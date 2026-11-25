import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/** Resolve the data directory (override via config.dataDir). */
export function resolveDataDir(config) {
  if (config && typeof config.dataDir === 'string' && config.dataDir.trim()) {
    return config.dataDir.trim()
  }
  const home = process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
  return path.join(home, 'english-gym')
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

export function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

/** Atomic-ish write: write temp file then rename over the target. */
export function writeJson(file, value) {
  ensureDir(path.dirname(file))
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), 'utf8')
  fs.renameSync(tmp, file)
}

export function pad(n) {
  return String(n).padStart(2, '0')
}

/** Local calendar day key YYYY-MM-DD. */
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function yesterdayKey(date = new Date()) {
  const d = new Date(date.getTime())
  d.setDate(d.getDate() - 1)
  return dayKey(d)
}

export function defaultState() {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    streak: { count: 0, lastActiveDay: null },
    totals: { answered: 0, correct: 0 },
    daily: {}, // dayKey -> { answered, correct }
    review: [], // [{ id, zh, en, hint, missedAt, misses }]
    pending: {}, // id -> { zh, en, hint, createdAt, mode }
    word: { answered: 0, correct: 0 }, // 单词训练 totals
    wordPending: {}, // id -> { en, zh, createdAt }
    wordRecent: [], // recently served words, to avoid immediate repeats
    wordBankId: 'builtin', // active word bank (builtin or an imported bank id)
    settings: { confetti: true, topicId: 'ai', customTopics: [], bankLink: true, bankRetries: 1 },
    // Per-day study log used by the dashboard:
    // dayKey -> { words: [{ en, zh, pos, ok, at }], phrases: [{ zh, en, answer, ok, score, at }] }
    log: {},
  }
}

export function loadState(dir) {
  const state = readJson(path.join(dir, 'state.json'), null)
  if (!state || typeof state !== 'object') return defaultState()
  const base = defaultState()
  return {
    ...base,
    ...state,
    streak: { ...base.streak, ...(state.streak || {}) },
    totals: { ...base.totals, ...(state.totals || {}) },
    daily: state.daily && typeof state.daily === 'object' ? state.daily : {},
    review: Array.isArray(state.review) ? state.review : [],
    pending: state.pending && typeof state.pending === 'object' ? state.pending : {},
    word: { ...base.word, ...(state.word || {}) },
    wordPending: state.wordPending && typeof state.wordPending === 'object' ? state.wordPending : {},
    wordRecent: Array.isArray(state.wordRecent) ? state.wordRecent : [],
    wordBankId: typeof state.wordBankId === 'string' && state.wordBankId ? state.wordBankId : 'builtin',
    settings: { ...base.settings, ...(state.settings && typeof state.settings === 'object' ? state.settings : {}) },
    log: state.log && typeof state.log === 'object' ? state.log : {},
  }
}

export function saveState(dir, state) {
  writeJson(path.join(dir, 'state.json'), state)
}

export function reportPath(dir, day) {
  return path.join(dir, 'reports', `${day}.json`)
}

export function loadReport(dir, day) {
  return readJson(reportPath(dir, day), null)
}

export function saveReport(dir, day, report) {
  writeJson(reportPath(dir, day), report)
}
