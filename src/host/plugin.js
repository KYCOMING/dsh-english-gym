import { dayKey, loadState, resolveDataDir } from '../core/store.js'
import { hasLlm } from '../core/llm.js'
import { gradeAnswer } from '../features/phrase/grade.js'
import { generateQuestion } from '../features/phrase/generate.js'
import { createPhraseService } from '../features/phrase/service.js'
import { createWordService } from '../features/word/service.js'
import { createReportService } from '../features/report/service.js'
import { createSettingsService } from '../features/settings/service.js'
import { buildDashboard } from '../features/activity/service.js'
import { resolveActiveBank } from '../features/word/banks.js'
import { summarizeBankMemory } from '../features/word/srs.js'
import { readBody, sendJson } from './http.js'

const API_PREFIX = '/api/english-gym'

const DEFAULTS = {
  level: 'B1',
  reportHour: 9,
  provider: '',
  model: '',
  topic: 'AI and technology',
  dataDir: '',
}

function summarize(state, conf, dir) {
  const today = state.daily[dayKey()] || { answered: 0, correct: 0 }
  const answered = state.totals.answered
  const correct = state.totals.correct
  const word = state.word || { answered: 0, correct: 0 }
  const bank = resolveActiveBank(dir, state)
  const bankEntries = bank && Array.isArray(bank.entries) ? bank.entries : []
  const bankCount = bankEntries.length
  const wordSrs = summarizeBankMemory(bankEntries, state.wordMemory, Date.now())
  return {
    level: conf.level,
    streakDays: state.streak.count || 0,
    totals: { answered, correct },
    accuracy: answered ? Math.round((correct / answered) * 100) : 0,
    reviewCount: wordSrs.due,
    wordSrs,
    today: { answered: today.answered || 0, correct: today.correct || 0 },
    word: {
      answered: word.answered || 0,
      correct: word.correct || 0,
      accuracy: word.answered ? Math.round((word.correct / word.answered) * 100) : 0,
    },
    wordBankSize: bankCount,
    wordBank: { id: (bank && bank.id) || 'builtin', name: (bank && bank.name) || '单词', count: bankCount },
  }
}

/**
 * Compose the English Gym host: feature services + one HTTP route + optional tools.
 * The widget only needs this object; all business logic lives under features/.
 */
export function createEnglishGym(ctx, rawConfig) {
  const conf = { ...DEFAULTS, ...(rawConfig || {}) }
  const dir = resolveDataDir(conf)
  const settings = createSettingsService({ dir, conf })
  const getTopic = () => settings.getTopic()
  const getReportLevel = () => settings.getReportLevel()
  const phrase = createPhraseService({ ctx, conf, dir, getTopic })
  const word = createWordService({ dir })
  const report = createReportService({ ctx, conf, dir, getTopic, getReportLevel })

  async function handler(req, res, peer) {
    // Defense in depth: with route auth 'required' the webServer only invokes this
    // handler after a live owner Peer is verified; refuse if that ever changes.
    if (!peer) return sendJson(res, 401, { error: 'unauthorized' })
    const url = new URL(req.url || '/', 'http://localhost')
    let sub = url.pathname.slice(API_PREFIX.length) || '/'
    if (sub.length > 1 && sub.endsWith('/')) sub = sub.slice(0, -1)
    try {
      if (req.method === 'GET' && (sub === '/' || sub === '/health')) {
        return sendJson(res, 200, { ok: true, llm: hasLlm(ctx), level: conf.level })
      }
      if (req.method === 'GET' && sub === '/state') {
        return sendJson(res, 200, summarize(loadState(dir), conf, dir))
      }
      if (req.method === 'GET' && sub === '/dashboard') {
        return sendJson(res, 200, buildDashboard(loadState(dir)))
      }
      if (req.method === 'GET' && sub === '/settings') {
        return sendJson(res, 200, settings.get())
      }
      if (req.method === 'POST' && sub === '/settings') {
        const body = await readBody(req)
        return sendJson(res, 200, settings.update(body || {}))
      }
      if (req.method === 'GET' && sub === '/report') {
        return sendJson(res, 200, await report.getReport(false))
      }
      if (req.method === 'POST' && sub === '/report/refresh') {
        return sendJson(res, 200, await report.getReport(true))
      }
      if (req.method === 'POST' && sub === '/next') {
        const body = await readBody(req)
        return sendJson(res, 200, await phrase.nextQuestion({ mode: body && body.mode, sessionId: body && body.sessionId }))
      }
      if (req.method === 'POST' && sub === '/check') {
        const body = await readBody(req)
        const result = await phrase.checkAnswer(body || {})
        return sendJson(res, 200, { ...result, summary: summarize(loadState(dir), conf, dir) })
      }
      if (req.method === 'GET' && sub === '/wordbanks') {
        return sendJson(res, 200, word.listBanks())
      }
      if (req.method === 'POST' && sub === '/wordbanks/preview') {
        const body = await readBody(req)
        return sendJson(res, 200, word.previewImport(body && body.content))
      }
      if (req.method === 'POST' && sub === '/wordbanks/import') {
        const body = await readBody(req)
        const result = word.importBank({ name: body && body.name, filename: body && body.filename, content: body && body.content })
        if (!result.ok) return sendJson(res, result.status, result.body)
        return sendJson(res, 200, { ...result.body, summary: summarize(loadState(dir), conf, dir) })
      }
      if (req.method === 'POST' && sub === '/wordbanks/active') {
        const body = await readBody(req)
        const result = word.setActiveBank(body && body.id)
        if (!result.ok) return sendJson(res, result.status, result.body)
        return sendJson(res, 200, { ...result.body, summary: summarize(loadState(dir), conf, dir) })
      }
      if (req.method === 'POST' && sub === '/wordbanks/delete') {
        const body = await readBody(req)
        const result = word.deleteBank(body && body.id)
        if (!result.ok) return sendJson(res, result.status, result.body)
        return sendJson(res, 200, { ...result.body, summary: summarize(loadState(dir), conf, dir) })
      }
      if (req.method === 'POST' && sub === '/word/next') {
        const body = await readBody(req)
        return sendJson(res, 200, word.nextWord({ mode: body && body.mode }))
      }
      if (req.method === 'POST' && sub === '/word/check') {
        const body = await readBody(req)
        const result = word.checkWord(body || {})
        return sendJson(res, 200, { ...result, summary: summarize(loadState(dir), conf, dir) })
      }
      if (req.method === 'POST' && sub === '/word/master') {
        const body = await readBody(req)
        const result = word.markMastered(body || {})
        if (!result.ok) return sendJson(res, result.status, result.body)
        return sendJson(res, 200, { ...result.body, summary: summarize(loadState(dir), conf, dir) })
      }
      return sendJson(res, 404, { error: 'not found', sub })
    } catch (error) {
      const status = error && error.status ? error.status : 500
      return sendJson(res, status, { error: (error && error.message) || String(error) })
    }
  }

  // Host authentication is enforced by the webServer + connection before this
  // handler runs: the Host/Origin fence plus a live owner Peer (the desktop
  // session cookie) must verify, and the route fails closed otherwise. This route
  // reads/writes progress files and can trigger host model calls, so it must
  // never be anonymous.
  const route = {
    kind: 'prefix',
    path: API_PREFIX,
    auth: 'required',
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
            const q = await generateQuestion(ctx, conf, { level: (args && args.level) || conf.level, topic: settings.getTopic() })
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

  return { route, registerTools, startDailyReporter: report.startDailyReporter, getReport: report.getReport, summarize }
}
