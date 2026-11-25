import { dayKey, yesterdayKey } from '../../core/store.js'

const MAX_DAYS = 400

/** Advance the daily study streak when a study event happens today. */
export function touchStreak(state, now = new Date()) {
  const day = dayKey(now)
  if (!state.streak || typeof state.streak !== 'object') state.streak = { count: 0, lastActiveDay: null }
  if (state.streak.lastActiveDay === day) return
  state.streak.count = state.streak.lastActiveDay === yesterdayKey(now) ? (Number(state.streak.count) || 0) + 1 : 1
  state.streak.lastActiveDay = day
}

/** Return the active streak count, or 0 if the streak has expired (missed yesterday & today). */
export function currentStreak(state, now = new Date()) {
  const streak = state && state.streak
  if (!streak || !streak.lastActiveDay) return 0
  const today = dayKey(now)
  const yesterday = yesterdayKey(now)
  if (streak.lastActiveDay !== today && streak.lastActiveDay !== yesterday) return 0
  return Math.max(0, Number(streak.count) || 0)
}

/** Keep only the most recent MAX_DAYS day buckets. */
function pruneLog(state) {
  const keys = Object.keys(state.log || {}).sort()
  const excess = keys.length - MAX_DAYS
  for (let i = 0; i < excess; i += 1) delete state.log[keys[i]]
}

function bucketFor(state, day) {
  if (!state.log || typeof state.log !== 'object') state.log = {}
  const bucket = state.log[day] || {}
  if (!Array.isArray(bucket.words)) bucket.words = []
  if (!Array.isArray(bucket.phrases)) bucket.phrases = []
  state.log[day] = bucket
  return bucket
}

/**
 * Append one study event to today's log. A repeat of the same word (by spelling)
 * or the same sentence (by Chinese prompt) within a day replaces the earlier
 * record, so each day lists every distinct item once with its latest result.
 */
export function recordStudy(state, kind, entry) {
  const now = new Date()
  const day = dayKey(now)
  const bucket = bucketFor(state, day)
  const at = now.toISOString()
  if (kind === 'word') {
    const key = String(entry.en || '').toLowerCase()
    if (!key) return
    const existing = bucket.words.find((w) => String(w.en || '').toLowerCase() === key)
    if (existing) {
      existing.en = entry.en
      existing.zh = entry.zh || existing.zh || ''
      existing.pos = entry.pos || existing.pos || ''
      existing.ok = !!entry.ok
      existing.at = at
    } else {
      bucket.words.push({
        en: entry.en,
        zh: entry.zh || '',
        pos: entry.pos || '',
        ok: !!entry.ok,
        at,
      })
    }
  } else if (kind === 'phrase') {
    const key = String(entry.zh || '')
    if (!key) return
    const existing = bucket.phrases.find((p) => String(p.zh || '') === key)
    if (existing) {
      existing.en = entry.en || existing.en || ''
      existing.answer = entry.answer !== undefined ? String(entry.answer || '') : existing.answer || ''
      existing.ok = !!entry.ok
      existing.score = Number(entry.score) || 0
      existing.at = at
    } else {
      bucket.phrases.push({
        zh: entry.zh,
        en: entry.en || '',
        answer: String(entry.answer || ''),
        ok: !!entry.ok,
        score: Number(entry.score) || 0,
        at,
      })
    }
  } else {
    return
  }
  touchStreak(state, now)
  pruneLog(state)
}

/**
 * Build the dashboard payload: a compact per-day activity series for the
 * calendar, plus the full grouped records (each day's words + sentences,
 * newest first) for the list below it.
 */
export function buildDashboard(state) {
  const log = state.log || {}
  const activity = []
  const days = []
  const keys = Object.keys(log).sort().reverse()
  for (const day of keys) {
    const bucket = log[day] || {}
    const words = Array.isArray(bucket.words)
      ? bucket.words.slice().sort((a, b) => String(a.at || '').localeCompare(String(b.at || '')))
      : []
    const phrases = Array.isArray(bucket.phrases)
      ? bucket.phrases.slice().sort((a, b) => String(a.at || '').localeCompare(String(b.at || '')))
      : []
    const wordCount = words.length
    const phraseCount = phrases.length
    if (!wordCount && !phraseCount) continue
    const correct = words.filter((w) => w.ok).length + phrases.filter((p) => p.ok).length
    activity.push({ day, words: wordCount, phrases: phraseCount, total: wordCount + phraseCount, correct })
    days.push({
      day,
      words,
      phrases,
      totals: { words: wordCount, phrases: phraseCount, total: wordCount + phraseCount, correct },
    })
  }
  const wordTotal = activity.reduce((sum, a) => sum + a.words, 0)
  const phraseTotal = activity.reduce((sum, a) => sum + a.phrases, 0)

  // Back-fill the calendar with days that predate per-item logging: the older
  // state.daily counters still prove the learner practised that day, so show
  // them as rough activity (no item detail available for those days).
  const daily = state.daily || {}
  const seen = new Set(activity.map((a) => a.day))
  for (const day of Object.keys(daily)) {
    if (seen.has(day)) continue
    const rec = daily[day] || {}
    const n = Number(rec.answered) || 0
    if (!n) continue
    activity.push({ day, words: 0, phrases: n, total: n, correct: Number(rec.correct) || 0, rough: true })
  }
  activity.sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : 0))

  return {
    today: dayKey(),
    streak: currentStreak(state),
    totals: { days: activity.length, words: wordTotal, phrases: phraseTotal },
    activity,
    days,
  }
}
