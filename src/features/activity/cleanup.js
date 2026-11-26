import fs from 'node:fs'
import path from 'node:path'
import { dayKey, loadState, saveState } from '../../core/store.js'

export const CLEANUP_RANGES = [
  { id: '7d', label: '7 天前', days: 7 },
  { id: '30d', label: '30 天前', days: 30 },
  { id: '90d', label: '90 天前', days: 90 },
  { id: '365d', label: '一年前', days: 365 },
  { id: 'all', label: '全部记录', days: null },
]

function assertValidRange(range) {
  const id = String(range == null ? '' : range).trim()
  if (!CLEANUP_RANGES.some((r) => r.id === id)) {
    const err = new Error('无效的清理时间范围')
    err.status = 400
    throw err
  }
  return id
}

export function cutoffDayKey(range, now = new Date()) {
  const norm = assertValidRange(range)
  const meta = CLEANUP_RANGES.find((r) => r.id === norm)
  if (!meta || meta.days === null) return null
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - meta.days)
  return dayKey(d)
}

function listReportFiles(dir) {
  const reportsDir = path.join(dir, 'reports')
  let names = []
  try {
    names = fs.readdirSync(reportsDir)
  } catch {
    return []
  }
  const out = []
  for (const file of names) {
    const m = /^(\d{4}-\d{2}-\d{2})\.json$/.exec(file)
    if (!m) continue
    out.push({ file, fullPath: path.join(reportsDir, file), day: m[1] })
  }
  return out
}

function computeMatches(dir, state, { range, clearMemory = false, now = new Date() } = {}) {
  const normRange = assertValidRange(range)
  const cutoff = cutoffDayKey(normRange, now)
  const isOld = (day) => cutoff === null || String(day) < cutoff

  const logKeys = Object.keys(state.log || {}).filter(isOld)
  const dailyKeys = Object.keys(state.daily || {}).filter(isOld)
  const daySet = new Set([...logKeys, ...dailyKeys])
  const reportFiles = listReportFiles(dir).filter((f) => isOld(f.day))

  let memoryKeys = []
  if (clearMemory === true) {
    const memMap = state.wordMemory || {}
    const cutoffMs = cutoff ? new Date(cutoff + 'T00:00:00').getTime() : null
    memoryKeys = Object.keys(memMap).filter((k) => {
      const mem = memMap[k]
      if (cutoffMs === null) return true
      if (mem && mem.mastered === true) return false
      const lastAt = mem && Number(mem.lastAt)
      return !Number.isFinite(lastAt) || lastAt < cutoffMs
    })
  }

  return {
    range: normRange,
    cutoff,
    logKeys,
    dailyKeys,
    recordDays: daySet.size,
    reportFiles,
    memoryKeys,
  }
}

/** Read-only preview of how many items match a time-based cleanup request. */
export function previewCleanup(dir, { range, clearMemory = false, now = new Date() } = {}) {
  assertValidRange(range)
  const state = loadState(dir)
  const m = computeMatches(dir, state, { range, clearMemory, now })
  return {
    range: m.range,
    cutoff: m.cutoff,
    recordDays: m.recordDays,
    reports: m.reportFiles.length,
    memoryWords: m.memoryKeys.length,
  }
}

function recomputeStreak(state) {
  const activeDays = new Set()
  for (const [day, bucket] of Object.entries(state.log || {})) {
    if (!bucket || typeof bucket !== 'object') continue
    const w = Array.isArray(bucket.words) ? bucket.words.length : 0
    const p = Array.isArray(bucket.phrases) ? bucket.phrases.length : 0
    if (w > 0 || p > 0) activeDays.add(day)
  }
  for (const [day, rec] of Object.entries(state.daily || {})) {
    if (rec && Number(rec.answered) > 0) activeDays.add(day)
  }
  if (!activeDays.size) {
    state.streak = { count: 0, lastActiveDay: null }
    return
  }
  const sorted = Array.from(activeDays).sort()
  const latest = sorted[sorted.length - 1]
  const parts = latest.split('-').map(Number)
  const cursor = new Date(parts[0], parts[1] - 1, parts[2])
  let count = 0
  while (activeDays.has(dayKey(cursor))) {
    count += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  state.streak = { count, lastActiveDay: latest }
}

/**
 * Remove study records and cached reports matching the chosen time range.
 * Settings and custom word banks are never touched; `wordMemory` is preserved
 * unless `clearMemory` is explicitly true.
 */
export function executeCleanup(dir, { range, clearMemory = false, now = new Date() } = {}) {
  assertValidRange(range)
  const state = loadState(dir)
  const m = computeMatches(dir, state, { range, clearMemory, now })

  let removedPhraseAnswered = 0
  let removedPhraseCorrect = 0
  for (const k of m.dailyKeys) {
    const rec = state.daily && state.daily[k]
    if (rec && typeof rec === 'object') {
      removedPhraseAnswered += Math.max(0, Number(rec.answered) || 0)
      removedPhraseCorrect += Math.max(0, Number(rec.correct) || 0)
    }
    delete state.daily[k]
  }

  let removedWordAnswered = 0
  let removedWordCorrect = 0
  for (const k of m.logKeys) {
    const bucket = state.log && state.log[k]
    const words = bucket && Array.isArray(bucket.words) ? bucket.words : []
    removedWordAnswered += words.length
    removedWordCorrect += words.filter((w) => w && w.ok).length
    delete state.log[k]
  }

  if (m.range === 'all') {
    state.pending = {}
    state.wordPending = {}
    state.wordRecent = []
    state.wordReviewStreak = 0
    state.totals = { answered: 0, correct: 0 }
    state.word = { answered: 0, correct: 0 }
  } else {
    const hasRemainingPhrases = Object.values(state.log || {}).some(
      (b) => b && Array.isArray(b.phrases) && b.phrases.length > 0,
    )
    if (Object.keys(state.daily || {}).length === 0 && !hasRemainingPhrases) {
      state.totals = { answered: 0, correct: 0 }
    } else {
      const prevAnswered = Math.max(0, Number(state.totals && state.totals.answered) || 0)
      const prevCorrect = Math.max(0, Number(state.totals && state.totals.correct) || 0)
      const nextAnswered = Math.max(0, prevAnswered - removedPhraseAnswered)
      const nextCorrect = Math.max(0, Math.min(nextAnswered, prevCorrect - removedPhraseCorrect))
      state.totals = { answered: nextAnswered, correct: nextCorrect }
    }

    if (Object.keys(state.log || {}).length === 0) {
      state.word = { answered: 0, correct: 0 }
    } else {
      const prevWordAnswered = Math.max(0, Number(state.word && state.word.answered) || 0)
      const prevWordCorrect = Math.max(0, Number(state.word && state.word.correct) || 0)
      const nextWordAnswered = Math.max(0, prevWordAnswered - removedWordAnswered)
      const nextWordCorrect = Math.max(0, Math.min(nextWordAnswered, prevWordCorrect - removedWordCorrect))
      state.word = { answered: nextWordAnswered, correct: nextWordCorrect }
    }
  }
  recomputeStreak(state)

  if (clearMemory === true) {
    for (const k of m.memoryKeys) delete state.wordMemory[k]
    if (m.range === 'all') {
      state.wordRecent = []
      state.wordReviewStreak = 0
    }
  }

  saveState(dir, state)

  let removedReports = 0
  for (const f of m.reportFiles) {
    try {
      fs.unlinkSync(f.fullPath)
      removedReports += 1
    } catch {
      /* ignore missing/locked file */
    }
  }

  return {
    ok: true,
    range: m.range,
    cutoff: m.cutoff,
    removed: {
      recordDays: m.recordDays,
      reports: removedReports,
      memoryWords: m.memoryKeys.length,
    },
  }
}

/** Best-effort pruning of cached daily reports older than `maxAgeDays`. */
export function pruneOldReports(dir, maxAgeDays = 90, now = new Date()) {
  const days = Math.max(1, Math.floor(Number(maxAgeDays) || 90))
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days)
  const cutoff = dayKey(d)
  let removed = 0
  for (const f of listReportFiles(dir)) {
    if (f.day < cutoff) {
      try {
        fs.unlinkSync(f.fullPath)
        removed += 1
      } catch {
        /* ignore */
      }
    }
  }
  return removed
}
