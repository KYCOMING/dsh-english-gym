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

function normalizeRange(range) {
  const id = String(range || '').trim()
  return CLEANUP_RANGES.some((r) => r.id === id) ? id : '30d'
}

export function cutoffDayKey(range, now = new Date()) {
  const norm = normalizeRange(range)
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

function computeMatches(dir, state, { range = '30d', clearMemory = false, now = new Date() } = {}) {
  const normRange = normalizeRange(range)
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
      if (cutoffMs === null) return true
      const mem = memMap[k]
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
export function previewCleanup(dir, { range = '30d', clearMemory = false, now = new Date() } = {}) {
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

/**
 * Remove study records and cached reports matching the chosen time range.
 * Settings and custom word banks are never touched; `wordMemory` is preserved
 * unless `clearMemory` is explicitly true.
 */
export function executeCleanup(dir, { range = '30d', clearMemory = false, now = new Date() } = {}) {
  const state = loadState(dir)
  const m = computeMatches(dir, state, { range, clearMemory, now })

  for (const k of m.logKeys) delete state.log[k]
  for (const k of m.dailyKeys) delete state.daily[k]

  if (m.range === 'all') {
    state.review = []
    state.pending = {}
    state.wordPending = {}
    state.wordRecent = []
    state.wordReviewStreak = 0
    state.totals = { answered: 0, correct: 0 }
    state.word = { answered: 0, correct: 0 }
    state.streak = { count: 0, lastActiveDay: null }
  } else if (state.streak && state.streak.lastActiveDay && m.cutoff && state.streak.lastActiveDay < m.cutoff) {
    state.streak = { count: 0, lastActiveDay: null }
  }

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
