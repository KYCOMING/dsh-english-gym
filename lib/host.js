import { randomUUID } from 'node:crypto'
import {
  resolveDataDir,
  loadState,
  saveState,
  loadReport,
  saveReport,
  dayKey,
  yesterdayKey,
} from './store.js'
import { hasLlm } from './llm.js'
import { gradeAnswer } from './grade.js'
import { generateQuestion, generateReport } from './generate.js'
import { normalize } from './grade.js'
import {
  BUILTIN_BANK_ID,
  deleteWordBank,
  listWordBanks,
  loadWordBank,
  makeBankId,
  resolveActiveBank,
  saveWordBank,
} from './wordbanks.js'
import { parseWordBank, summarizeParse } from './wordbank-import.js'

const API_PREFIX = '/api/english-gym'

const DEFAULTS = {
  level: 'B1',
  reportHour: 9,
  provider: '',
  model: '',
  topic: 'AI and technology',
  dataDir: '',
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 5_000_000) req.destroy()
    })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch {
        resolve({})
      }
    })
    req.on('error', () => resolve({}))
  })
}

function sendJson(res, status, obj) {
  let body
  try {
    body = JSON.stringify(obj)
  } catch {
    body = JSON.stringify({ error: 'serialization failed' })
  }
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(body)
}

function prunePending(state) {
  const entries = Object.entries(state.pending || {})
  if (entries.length <= 30) return
  entries.sort((a, b) => String(a[1].createdAt || '').localeCompare(String(b[1].createdAt || '')))
  const remove = entries.length - 30
  for (let i = 0; i < remove; i += 1) delete state.pending[entries[i][0]]
}

function pruneDaily(state) {
  const keys = Object.keys(state.daily || {}).sort()
  const excess = keys.length - 120
  for (let i = 0; i < excess; i += 1) delete state.daily[keys[i]]
}

function recordAnswer(state, correct) {
  const day = dayKey()
  const daily = state.daily[day] || { answered: 0, correct: 0 }
  daily.answered += 1
  if (correct) daily.correct += 1
  state.daily[day] = daily

  state.totals.answered += 1
  if (correct) state.totals.correct += 1

  if (state.streak.lastActiveDay !== day) {
    state.streak.count = state.streak.lastActiveDay === yesterdayKey() ? (state.streak.count || 0) + 1 : 1
    state.streak.lastActiveDay = day
  }
}

function summarize(state, conf, dir) {
  const today = state.daily[dayKey()] || { answered: 0, correct: 0 }
  const answered = state.totals.answered
  const correct = state.totals.correct
  const word = state.word || { answered: 0, correct: 0 }
  const bank = resolveActiveBank(dir, state)
  return {
    level: conf.level,
    streakDays: state.streak.count || 0,
    totals: { answered, correct },
    accuracy: answered ? Math.round((correct / answered) * 100) : 0,
    reviewCount: state.review.length,
    today: { answered: today.answered || 0, correct: today.correct || 0 },
    word: {
      answered: word.answered || 0,
      correct: word.correct || 0,
      accuracy: word.answered ? Math.round((word.correct / word.answered) * 100) : 0,
    },
    wordBankSize: bank.entries.length,
    wordBank: { id: bank.id, name: bank.name, count: bank.entries.length },
  }
}

function pruneWordPending(state) {
  const entries = Object.entries(state.wordPending || {})
  if (entries.length <= 10) return
  entries.sort((a, b) => String(a[1].createdAt || '').localeCompare(String(b[1].createdAt || '')))
  const remove = entries.length - 10
  for (let i = 0; i < remove; i += 1) delete state.wordPending[entries[i][0]]
}

export function createEnglishGym(ctx, rawConfig) {
  const conf = { ...DEFAULTS, ...(rawConfig || {}) }
  const dir = resolveDataDir(conf)
  const reportInflight = new Map()

  async function getReport(force) {
    const day = dayKey()
    if (!force) {
      const cached = loadReport(dir, day)
      if (cached && cached.body) return cached
    }
    if (reportInflight.has(day)) return reportInflight.get(day)
    const job = (async () => {
      const report = await generateReport(ctx, conf, { level: conf.level, date: day, topic: conf.topic })
      saveReport(dir, day, report)
      return report
    })()
    reportInflight.set(day, job)
    try {
      return await job
    } finally {
      reportInflight.delete(day)
    }
  }

  async function nextQuestion(mode) {
    const state = loadState(dir)
    let picked
    if (mode === 'review' && state.review.length) {
      state.review.sort((a, b) => String(a.missedAt || '').localeCompare(String(b.missedAt || '')))
      const item = state.review[0]
      picked = { zh: item.zh, en: item.en, hint: item.hint || '', mode: 'review' }
    } else {
      const q = await generateQuestion(ctx, conf, { level: conf.level, topic: conf.topic })
      picked = { zh: q.zh, en: q.en, hint: q.hint || '', mode: 'new' }
    }
    const id = randomUUID()
    state.pending[id] = {
      zh: picked.zh,
      en: picked.en,
      hint: picked.hint,
      mode: picked.mode,
      createdAt: new Date().toISOString(),
    }
    prunePending(state)
    saveState(dir, state)
    return { id, zh: picked.zh, hint: picked.hint, mode: picked.mode }
  }

  async function checkAnswer({ id, answer }) {
    const state = loadState(dir)
    const pending = id ? state.pending[id] : null
    if (!pending) {
      const error = new Error('题目已过期，请点“下一题”重新开始。')
      error.status = 409
      throw error
    }
    const result = await gradeAnswer(ctx, conf, { zh: pending.zh, reference: pending.en, answer: answer || '' })
    recordAnswer(state, result.correct)

    const idx = state.review.findIndex((r) => r.zh === pending.zh)
    if (result.correct) {
      if (idx >= 0) state.review.splice(idx, 1)
    } else {
      const entry = {
        id: idx >= 0 ? state.review[idx].id : randomUUID(),
        zh: pending.zh,
        en: pending.en,
        hint: pending.hint || '',
        missedAt: new Date().toISOString(),
        misses: idx >= 0 ? (state.review[idx].misses || 1) + 1 : 1,
      }
      if (idx >= 0) state.review[idx] = entry
      else state.review.push(entry)
    }
    delete state.pending[id]
    pruneDaily(state)
    saveState(dir, state)

    return {
      correct: result.correct,
      exact: !!result.exact,
      score: result.score,
      reference: result.reference,
      tip: result.tip,
      corrected: result.corrected,
      summary: summarize(state, conf, dir),
    }
  }

  const letterCount = (en) => String(en).replace(/[^a-zA-Z]/g, '').length

  function pickWord(state, entries) {
    const recent = new Set(state.wordRecent || [])
    const pool = entries.filter((w) => !recent.has(w.word))
    const src = pool.length ? pool : entries
    return src[Math.floor(Math.random() * src.length)]
  }

  function nextWord() {
    const state = loadState(dir)
    const bank = resolveActiveBank(dir, state)
    const picked = pickWord(state, bank.entries)
    const id = randomUUID()
    state.wordPending[id] = {
      en: picked.word,
      zh: picked.meaning,
      pos: picked.pos || '',
      bankId: bank.id,
      createdAt: new Date().toISOString(),
    }
    pruneWordPending(state)
    state.wordRecent.push(picked.word)
    if (state.wordRecent.length > 200) state.wordRecent = state.wordRecent.slice(-200)
    saveState(dir, state)
    return {
      id,
      zh: picked.meaning,
      pos: picked.pos || '',
      letters: letterCount(picked.word),
      bankSize: bank.entries.length,
      bankId: bank.id,
      bankName: bank.name,
    }
  }

  function checkWord({ id, answer }) {
    const state = loadState(dir)
    const pending = id ? state.wordPending[id] : null
    if (!pending) {
      const error = new Error('题目已过期，请点“换一个”重新开始。')
      error.status = 409
      throw error
    }
    const typed = normalize(answer || '').replace(/\s+/g, '')
    const target = normalize(pending.en).replace(/\s+/g, '')
    const correct = typed === target && typed.length > 0
    state.word.answered = (state.word.answered || 0) + 1
    if (correct) state.word.correct = (state.word.correct || 0) + 1
    // Keep a missed word pending so “再试一次” can re-check the same word.
    if (correct) delete state.wordPending[id]
    saveState(dir, state)
    return {
      correct,
      reference: pending.en,
      zh: pending.zh,
      pos: pending.pos || '',
      letters: letterCount(pending.en),
      summary: summarize(state, conf, dir),
    }
  }

  async function handler(req, res) {    const url = new URL(req.url || '/', 'http://localhost')
    let sub = url.pathname.slice(API_PREFIX.length) || '/'
    if (sub.length > 1 && sub.endsWith('/')) sub = sub.slice(0, -1)
    try {
      if (req.method === 'GET' && (sub === '/' || sub === '/health')) {
        return sendJson(res, 200, { ok: true, llm: hasLlm(ctx), level: conf.level })
      }
      if (req.method === 'GET' && sub === '/state') {
        const state = loadState(dir)
        return sendJson(res, 200, summarize(state, conf, dir))
      }
      if (req.method === 'GET' && sub === '/report') {
        return sendJson(res, 200, await getReport(false))
      }
      if (req.method === 'POST' && sub === '/report/refresh') {
        return sendJson(res, 200, await getReport(true))
      }
      if (req.method === 'POST' && sub === '/next') {
        const body = await readBody(req)
        return sendJson(res, 200, await nextQuestion(body && body.mode))
      }
      if (req.method === 'POST' && sub === '/check') {
        const body = await readBody(req)
        return sendJson(res, 200, await checkAnswer(body || {}))
      }
      if (req.method === 'GET' && sub === '/wordbanks') {
        const state = loadState(dir)
        const active = resolveActiveBank(dir, state)
        return sendJson(res, 200, { active: active.id, banks: listWordBanks(dir) })
      }
      if (req.method === 'POST' && sub === '/wordbanks/preview') {
        const body = await readBody(req)
        return sendJson(res, 200, summarizeParse(parseWordBank(body && body.content)))
      }
      if (req.method === 'POST' && sub === '/wordbanks/import') {
        const body = await readBody(req)
        const parsed = parseWordBank(body && body.content)
        if (!parsed.entries.length) {
          return sendJson(res, 400, {
            error: '没有识别到有效词条，请检查文件格式',
            report: summarizeParse(parsed),
          })
        }
        const fallbackName = String((body && body.filename) || '')
          .replace(/\.[^.]+$/, '')
          .trim()
        const name = String((body && body.name) || fallbackName || '我的词库')
          .trim()
          .slice(0, 60) || '我的词库'
        const bank = {
          id: makeBankId(),
          name,
          source: String((body && body.filename) || 'paste').slice(0, 200),
          createdAt: new Date().toISOString(),
          entries: parsed.entries,
        }
        saveWordBank(dir, bank)
        const state = loadState(dir)
        state.wordBankId = bank.id
        saveState(dir, state)
        return sendJson(res, 200, {
          ok: true,
          bank: { id: bank.id, name: bank.name, count: bank.entries.length },
          report: summarizeParse(parsed, 8),
          summary: summarize(state, conf, dir),
        })
      }
      if (req.method === 'POST' && sub === '/wordbanks/active') {
        const body = await readBody(req)
        const wanted = body && body.id
        if (!wanted) return sendJson(res, 400, { error: '缺少词库 id' })
        const bank = wanted === BUILTIN_BANK_ID ? loadWordBank(dir, BUILTIN_BANK_ID) : loadWordBank(dir, wanted)
        if (!bank) return sendJson(res, 404, { error: '词库不存在' })
        const state = loadState(dir)
        state.wordBankId = bank.id
        saveState(dir, state)
        return sendJson(res, 200, {
          ok: true,
          active: bank.id,
          bank: { id: bank.id, name: bank.name, count: bank.entries.length },
          summary: summarize(state, conf, dir),
        })
      }
      if (req.method === 'POST' && sub === '/wordbanks/delete') {
        const body = await readBody(req)
        const id = body && body.id
        if (!id || id === BUILTIN_BANK_ID) return sendJson(res, 400, { error: '内置词库不能删除' })
        const state = loadState(dir)
        const removed = deleteWordBank(dir, id)
        if (!removed) return sendJson(res, 404, { error: '词库不存在' })
        if (state.wordBankId === id) {
          state.wordBankId = BUILTIN_BANK_ID
          saveState(dir, state)
        }
        return sendJson(res, 200, { ok: true, active: state.wordBankId, banks: listWordBanks(dir) })
      }
      if (req.method === 'POST' && sub === '/word/next') {
        return sendJson(res, 200, nextWord())
      }
      if (req.method === 'POST' && sub === '/word/check') {
        const body = await readBody(req)
        return sendJson(res, 200, checkWord(body || {}))
      }
      return sendJson(res, 404, { error: 'not found', sub })
    } catch (error) {
      const status = error && error.status ? error.status : 500
      return sendJson(res, status, { error: (error && error.message) || String(error) })
    }
  }

  const route = {
    kind: 'prefix',
    path: API_PREFIX,
    auth: 'anonymous',
    handler,
  }

  function registerTools() {
    const tools = ctx.get('tools')
    if (!tools || typeof tools.register !== 'function') return null
    const disposers = []

    disposers.push(
      tools.register(
        {
          name: 'english_drill',
          description:
            'English practice: get ONE Chinese sentence for the user to translate into English. Returns the Chinese prompt and a short hint. Do NOT reveal the English answer; let the user try first.',
          parameters: {
            type: 'object',
            properties: {
              level: { type: 'string', description: 'CEFR level such as A2, B1, B2, C1. Optional.' },
            },
            additionalProperties: false,
          },
          output: {
            schema: {
              type: 'object',
              properties: { zh: { type: 'string' }, hint: { type: 'string' } },
              required: ['zh'],
              additionalProperties: true,
            },
            render(_args, value) {
              return [{ type: 'text', text: `中文：${value.zh}\n提示：${value.hint || '—'}\n请把这个句子翻译成英文。` }]
            },
          },
          async execute(args) {
            const q = await generateQuestion(ctx, conf, { level: (args && args.level) || conf.level, topic: conf.topic })
            return { zh: q.zh, hint: q.hint }
          },
        },
        {},
      ),
    )

    disposers.push(
      tools.register(
        {
          name: 'english_grade',
          description:
            'English practice: grade a Chinese→English translation answer. Provide the Chinese sentence and the learner answer; optionally the reference English. Returns correctness, a 0-100 score, the reference and a short tip.',
          parameters: {
            type: 'object',
            properties: {
              zh: { type: 'string', description: 'The original Chinese sentence.' },
              answer: { type: 'string', description: "The learner's English translation." },
              reference: { type: 'string', description: 'Optional reference English translation.' },
            },
            required: ['zh', 'answer'],
            additionalProperties: false,
          },
          output: {
            schema: {
              type: 'object',
              properties: {
                correct: { type: 'boolean' },
                score: { type: 'number' },
                reference: { type: 'string' },
                tip: { type: 'string' },
              },
              additionalProperties: true,
            },
            render(_args, value) {
              return [
                {
                  type: 'text',
                  text: `${value.correct ? '✅ 正确' : '❌ 再试试'}（${value.score} 分）\n参考：${value.reference}\n提示：${value.tip}`,
                },
              ]
            },
          },
          async execute(args) {
            const r = await gradeAnswer(ctx, conf, {
              zh: args.zh,
              reference: args.reference || '',
              answer: args.answer,
            })
            return { correct: r.correct, score: r.score, reference: r.reference || r.corrected || '', tip: r.tip }
          },
        },
        {},
      ),
    )

    return () => {
      for (const dispose of disposers) {
        try {
          dispose()
        } catch {
          /* ignore */
        }
      }
    }
  }

  function startDailyReporter() {
    const reportHour = Number(conf.reportHour)
    const noop = () => {}

    const tick = async () => {
      if (!Number.isFinite(reportHour)) return
      const now = new Date()
      if (now.getHours() < reportHour) return
      const day = dayKey(now)
      if (loadReport(dir, day)) return
      try {
        await getReport(false)
      } catch {
        /* ignore, retry next tick */
      }
    }

    const interval = setInterval(() => {
      tick().catch(noop)
    }, 30 * 60 * 1000)
    const warm = setTimeout(() => {
      tick().catch(noop)
    }, 20 * 1000)
    if (interval && typeof interval.unref === 'function') interval.unref()
    if (warm && typeof warm.unref === 'function') warm.unref()

    return () => {
      clearInterval(interval)
      clearTimeout(warm)
    }
  }

  return { route, registerTools, startDailyReporter, getReport, summarize }
}
