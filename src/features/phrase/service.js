import { randomUUID } from 'node:crypto'
import { dayKey, loadState, saveState, yesterdayKey } from '../../core/store.js'
import { gradeAnswer } from './grade.js'
import { generateQuestion } from './generate.js'
import { readSessionExcerpt } from './session.js'
import { recordStudy } from '../activity/service.js'
import { normalizeSettings } from '../settings/service.js'
import { pickBankCandidates } from '../word/sample.js'

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

function recentPrompts(state, limit = 6) {
  const seen = new Set()
  const out = []
  const pending = Object.values(state.pending || {}).sort((a, b) =>
    String(b.createdAt || '').localeCompare(String(a.createdAt || '')),
  )
  for (const item of pending) {
    const zh = String((item && item.zh) || '').trim()
    if (!zh || seen.has(zh)) continue
    seen.add(zh)
    out.push(zh)
    if (out.length >= limit) return out
  }
  const todayBucket = state.log && state.log[dayKey()]
  const phrases = todayBucket && Array.isArray(todayBucket.phrases) ? todayBucket.phrases : []
  for (let i = phrases.length - 1; i >= 0 && out.length < limit; i -= 1) {
    const zh = String((phrases[i] && phrases[i].zh) || '').trim()
    if (!zh || seen.has(zh)) continue
    seen.add(zh)
    out.push(zh)
  }
  return out
}

/** Phrase translation drill: generate one prompt, grade one answer. */
export function createPhraseService({ ctx, conf, dir, getTopic }) {
  async function nextQuestion(input) {
    const mode = typeof input === 'string' ? input : input && input.mode
    const sessionId = typeof input === 'object' && input ? input.sessionId : ''
    const state = loadState(dir)
    let picked
    if (mode === 'review' && state.review.length) {
      state.review.sort((a, b) => String(a.missedAt || '').localeCompare(String(b.missedAt || '')))
      const item = state.review[0]
      picked = { zh: item.zh, en: item.en, hint: item.hint || '', mode: 'review', bankWords: [], source: 'review' }
    } else {
      const opts = normalizeSettings(state.settings)
      const sessionExcerpt = opts.sessionLink && sessionId ? await readSessionExcerpt(ctx, sessionId) : ''
      if (sessionExcerpt) {
        // Session-linked mode ignores topic and word-bank coupling so the sentence stays focused on the active conversation.
        const q = await generateQuestion(ctx, conf, {
          level: conf.level,
          sessionContext: sessionExcerpt,
          avoid: recentPrompts(state, 6),
        })
        picked = {
          zh: q.zh,
          en: q.en,
          hint: q.hint || '',
          mode: 'new',
          bankWords: [],
          source: q.fallback ? 'fallback' : 'session',
        }
      } else {
        const topic = typeof getTopic === 'function' ? getTopic() : conf.topic
        const words = opts.bankLink ? pickBankCandidates(dir, state, 24) : []
        const retries = opts.bankLink ? opts.bankRetries : 0
        let q = null
        for (let attempt = 0; attempt <= retries; attempt += 1) {
          q = await generateQuestion(ctx, conf, { level: conf.level, topic, words })
          if (!q || q.fallback) break
          if (!words.length || (Array.isArray(q.used) && q.used.length)) break
        }
        picked = {
          zh: q.zh,
          en: q.en,
          hint: q.hint || '',
          mode: 'new',
          bankWords: q.used || [],
          source: q.fallback ? 'fallback' : 'topic',
        }
      }
    }
    const id = randomUUID()
    state.pending[id] = {
      zh: picked.zh,
      en: picked.en,
      hint: picked.hint,
      mode: picked.mode,
      bankWords: picked.bankWords || [],
      source: picked.source || 'topic',
      createdAt: new Date().toISOString(),
    }
    prunePending(state)
    saveState(dir, state)
    return {
      id,
      zh: picked.zh,
      hint: picked.hint,
      mode: picked.mode,
      bankWords: picked.bankWords || [],
      source: picked.source || 'topic',
    }
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
    // Keep the prompt pending (capped by prunePending) so “再试一次” can re-check the same sentence.
    recordStudy(state, 'phrase', {
      zh: pending.zh,
      en: pending.en,
      answer: answer || '',
      ok: result.correct,
      score: result.score,
    })
    pruneDaily(state)
    saveState(dir, state)

    return {
      correct: result.correct,
      exact: !!result.exact,
      score: result.score,
      zh: pending.zh,
      reference: result.reference,
      tip: result.tip,
      corrected: result.corrected,
      highlights: Array.isArray(result.highlights) ? result.highlights : [],
      bankWords: Array.isArray(pending.bankWords) ? pending.bankWords : [],
      source: pending.source || 'topic',
    }
  }

  return { nextQuestion, checkAnswer }
}
