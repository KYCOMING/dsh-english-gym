import { randomUUID } from 'node:crypto'
import { dayKey, loadState, saveState, yesterdayKey } from '../../core/store.js'
import { gradeAnswer } from './grade.js'
import { generateQuestion } from './generate.js'

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

/** Phrase translation drill: generate one prompt, grade one answer. */
export function createPhraseService({ ctx, conf, dir }) {
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
    }
  }

  return { nextQuestion, checkAnswer }
}
