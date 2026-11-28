import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  closeAllDbs,
  closeDb,
  dbPath,
  getDb,
  writeReportToDb,
  writeStateToDb,
  writeWordBankToDb,
} from './db.js'

export { closeAllDbs, closeDb, dbPath }

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
    pending: {}, // id -> { zh, en, hint, createdAt, bankWords, source }
    word: { answered: 0, correct: 0 }, // 单词训练 totals
    wordPending: {}, // id -> { en, zh, createdAt }
    wordRecent: [], // recently served words, to avoid immediate repeats
    wordMemory: {}, // lowercased word -> FSRS-6 { state, stability, difficulty, dueAt, lastAt, reps, lapses, mastered, fsrs }
    wordReviewStreak: 0,
    wordBankId: 'builtin', // active word bank (builtin or an imported bank id)
    settings: { confetti: true, topicId: 'ai', customTopics: [], bankLink: true, bankRetries: 1, sessionLink: false, fsrsRetention: 0.9, reasoningEffort: 'off' },
    // Per-day study log used by the dashboard:
    // dayKey -> { words: [{ en, zh, pos, ok, at }], phrases: [{ zh, en, answer, ok, score, at }] }
    log: {},
  }
}

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function loadState(dir) {
  const db = getDb(dir)
  const base = defaultState()

  const meta = new Map()
  const metaRows = db
    .prepare(
      `SELECT meta_key, value_json FROM kv_meta
       WHERE meta_key IN (
         'version', 'created_at', 'streak', 'totals', 'word_totals',
         'word_recent', 'word_review_streak', 'word_bank_id', 'settings'
       )`,
    )
    .all()
  for (const row of metaRows) {
    meta.set(row.meta_key, safeJsonParse(row.value_json, undefined))
  }

  const daily = {}
  for (const row of db.prepare('SELECT day, answered, correct FROM daily_stats').all()) {
    daily[row.day] = { answered: row.answered, correct: row.correct }
  }

  const log = {}
  for (const row of db
    .prepare('SELECT day, kind, en, zh, pos, answer, ok, score, studied_at FROM study_log ORDER BY day ASC, id ASC')
    .all()) {
    if (!log[row.day]) log[row.day] = { words: [], phrases: [] }
    if (row.kind === 'word') {
      log[row.day].words.push({
        en: row.en,
        zh: row.zh,
        pos: row.pos,
        ok: Boolean(row.ok),
        at: row.studied_at,
      })
    } else if (row.kind === 'phrase') {
      log[row.day].phrases.push({
        zh: row.zh,
        en: row.en,
        answer: row.answer,
        ok: Boolean(row.ok),
        score: row.score,
        at: row.studied_at,
      })
    }
  }

  const wordMemory = {}
  for (const row of db
    .prepare(
      `SELECT word_key, state, stability, difficulty, due_at, last_at,
              reps, lapses, mastered, fsrs_version, legacy_stage
       FROM word_memory`,
    )
    .all()) {
    if (row.stability !== null && row.difficulty !== null) {
      wordMemory[row.word_key] = {
        state: row.state || 'review',
        stability: row.stability,
        difficulty: row.difficulty,
        dueAt: row.due_at,
        lastAt: row.last_at,
        reps: row.reps,
        lapses: row.lapses,
        mastered: Boolean(row.mastered),
        fsrs: row.fsrs_version || 6,
      }
    } else {
      wordMemory[row.word_key] = {
        stage: row.legacy_stage ?? 0,
        dueAt: row.due_at,
        lastAt: row.last_at,
        reps: row.reps,
        lapses: row.lapses,
        mastered: Boolean(row.mastered),
      }
    }
  }

  const pending = {}
  const wordPending = {}
  for (const row of db.prepare('SELECT kind, item_uuid, payload_json FROM pending_items ORDER BY id ASC').all()) {
    const payload = safeJsonParse(row.payload_json, null)
    if (!payload || typeof payload !== 'object') continue
    if (row.kind === 'phrase') pending[row.item_uuid] = payload
    else if (row.kind === 'word') wordPending[row.item_uuid] = payload
  }

  const rawVersion = meta.get('version')
  const rawCreatedAt = meta.get('created_at')
  const rawStreak = meta.get('streak')
  const rawTotals = meta.get('totals')
  const rawWord = meta.get('word_totals')
  const rawWordRecent = meta.get('word_recent')
  const rawReviewStreak = meta.get('word_review_streak')
  const rawBankId = meta.get('word_bank_id')
  const rawSettings = meta.get('settings')

  return {
    ...base,
    version: Number.isFinite(Number(rawVersion)) ? Number(rawVersion) : base.version,
    createdAt: typeof rawCreatedAt === 'string' && rawCreatedAt ? rawCreatedAt : base.createdAt,
    streak: { ...base.streak, ...(rawStreak && typeof rawStreak === 'object' ? rawStreak : {}) },
    totals: { ...base.totals, ...(rawTotals && typeof rawTotals === 'object' ? rawTotals : {}) },
    daily,
    pending,
    word: { ...base.word, ...(rawWord && typeof rawWord === 'object' ? rawWord : {}) },
    wordPending,
    wordRecent: Array.isArray(rawWordRecent) ? rawWordRecent : [],
    wordMemory,
    wordReviewStreak: Number.isFinite(Number(rawReviewStreak)) ? Number(rawReviewStreak) : 0,
    wordBankId: typeof rawBankId === 'string' && rawBankId ? rawBankId : 'builtin',
    settings: { ...base.settings, ...(rawSettings && typeof rawSettings === 'object' ? rawSettings : {}) },
    log,
  }
}

export function saveState(dir, state) {
  const db = getDb(dir)
  writeStateToDb(db, state)
}

export function reportPath(dir, day) {
  return path.join(dir, 'reports', `${day}.json`)
}

export function loadReport(dir, day) {
  const db = getDb(dir)
  const row = db.prepare('SELECT payload_json FROM daily_reports WHERE day = ?').get(String(day))
  if (!row) return null
  return safeJsonParse(row.payload_json, null)
}

export function saveReport(dir, day, report) {
  const db = getDb(dir)
  writeReportToDb(db, day, report)
}

export function listReportDays(dir) {
  const db = getDb(dir)
  return db
    .prepare('SELECT day FROM daily_reports ORDER BY day ASC')
    .all()
    .map((row) => row.day)
}

export function deleteReportsBefore(dir, cutoffDay) {
  const db = getDb(dir)
  if (cutoffDay === null || cutoffDay === undefined) {
    return Number(db.prepare('DELETE FROM daily_reports').run().changes || 0)
  }
  return Number(db.prepare('DELETE FROM daily_reports WHERE day < ?').run(String(cutoffDay)).changes || 0)
}

export function listCustomWordBanks(dir) {
  const db = getDb(dir)
  return db
    .prepare('SELECT bank_id, name, source, word_count, created_at FROM wordbanks ORDER BY created_at DESC')
    .all()
    .map((row) => ({
      id: row.bank_id,
      name: row.name || '未命名词库',
      count: row.word_count,
      source: row.source || 'import',
      createdAt: row.created_at || null,
      builtin: false,
    }))
}

export function loadCustomWordBank(dir, bankId) {
  const db = getDb(dir)
  const row = db
    .prepare('SELECT bank_id, name, source, created_at, entries_json FROM wordbanks WHERE bank_id = ?')
    .get(String(bankId))
  if (!row) return null
  const entries = safeJsonParse(row.entries_json, null)
  if (!Array.isArray(entries)) return null
  return {
    id: row.bank_id,
    name: row.name || '未命名词库',
    source: row.source || 'import',
    createdAt: row.created_at || null,
    entries,
  }
}

export function saveCustomWordBank(dir, bank) {
  const db = getDb(dir)
  writeWordBankToDb(db, bank)
}

export function deleteCustomWordBank(dir, bankId) {
  const db = getDb(dir)
  return Number(db.prepare('DELETE FROM wordbanks WHERE bank_id = ?').run(String(bankId)).changes || 0) > 0
}
