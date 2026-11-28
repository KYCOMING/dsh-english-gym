import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

export const DB_FILENAME = 'english-gym.db'
export const SCHEMA_VERSION = 1

const dbCache = new Map()
let exitHookRegistered = false

export function dbPath(dir) {
  return path.join(dir, DB_FILENAME)
}

const SCHEMA_SQL = `
-- ============================================================
-- 1. 全局元数据与偏好设置表（对应原 state.json 的标量与配置字段）
-- ============================================================
CREATE TABLE IF NOT EXISTS kv_meta (
  id          INTEGER PRIMARY KEY AUTOINCREMENT, -- 自增主键 ID
  meta_key    TEXT    NOT NULL UNIQUE,           -- 全局配置或元数据键名（如 settings、streak、totals、word_totals、word_bank_id、word_recent、word_review_streak、created_at、version、schema_version、legacy_json_migrated）
  value_json  TEXT    NOT NULL,                  -- JSON 序列化的配置或状态值
  created_at  TEXT    NOT NULL,                  -- 创建时间（ISO-8601）
  updated_at  TEXT    NOT NULL                   -- 最近更新时间（ISO-8601）
);

-- ============================================================
-- 2. 按天短语答题汇总表（对应原 state.daily）
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_stats (
  id          INTEGER PRIMARY KEY AUTOINCREMENT, -- 自增主键 ID
  day         TEXT    NOT NULL UNIQUE,           -- 本地日期键（YYYY-MM-DD）
  answered    INTEGER NOT NULL DEFAULT 0,        -- 当天短语累计作答次数
  correct     INTEGER NOT NULL DEFAULT 0,        -- 当天短语累计答对次数
  created_at  TEXT    NOT NULL,                  -- 创建时间（ISO-8601）
  updated_at  TEXT    NOT NULL                   -- 最近更新时间（ISO-8601）
);

-- ============================================================
-- 3. 每日学习明细表（对应原 state.log，供数据看板与热力图使用）
-- ============================================================
CREATE TABLE IF NOT EXISTS study_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT, -- 自增主键 ID
  day         TEXT    NOT NULL,                  -- 学习日期（YYYY-MM-DD）
  kind        TEXT    NOT NULL,                  -- 练习类型：word（单词）或 phrase（短语）
  item_key    TEXT    NOT NULL,                  -- 当天去重键：单词为小写英文，短语为中文题干
  en          TEXT    NOT NULL DEFAULT '',       -- 英文单词或参考英文译文
  zh          TEXT    NOT NULL DEFAULT '',       -- 中文释义或中文题干
  pos         TEXT    NOT NULL DEFAULT '',       -- 词性（仅单词记录使用）
  answer      TEXT    NOT NULL DEFAULT '',       -- 用户提交的英文译文（仅短语记录使用）
  ok          INTEGER NOT NULL DEFAULT 0,        -- 是否答对（0=否，1=是）
  score       INTEGER NOT NULL DEFAULT 0,        -- 评分 0-100（仅短语记录使用）
  studied_at  TEXT    NOT NULL DEFAULT '',       -- 最近一次练习时间（ISO-8601）
  UNIQUE (day, kind, item_key)
);
CREATE INDEX IF NOT EXISTS idx_study_log_day ON study_log (day);

-- ============================================================
-- 4. 单词 FSRS-6 记忆进度表（对应原 state.wordMemory）
-- ============================================================
CREATE TABLE IF NOT EXISTS word_memory (
  id            INTEGER PRIMARY KEY AUTOINCREMENT, -- 自增主键 ID
  word_key      TEXT    NOT NULL UNIQUE,           -- 归一化后的小写英文单词键
  state         TEXT    NOT NULL DEFAULT '',       -- FSRS 记忆状态：learning / relearning / review
  stability     REAL,                              -- FSRS 记忆稳定性 S（单位：天；兼容旧版记录可为空）
  difficulty    REAL,                              -- FSRS 记忆难度 D（范围 1-10；兼容旧版记录可为空）
  due_at        INTEGER,                           -- 下次应复习时间戳（毫秒；已掌握为 NULL）
  last_at       INTEGER NOT NULL DEFAULT 0,        -- 最近一次复习时间戳（毫秒）
  reps          INTEGER NOT NULL DEFAULT 0,        -- 累计复习次数
  lapses        INTEGER NOT NULL DEFAULT 0,        -- 累计遗忘次数
  mastered      INTEGER NOT NULL DEFAULT 0,        -- 是否已掌握（0=否，1=是）
  fsrs_version  INTEGER,                           -- FSRS 算法版本号（新版为 6，旧版艾宾浩斯记录为空）
  legacy_stage  INTEGER,                           -- 兼容旧版艾宾浩斯阶段字段（无则为 NULL）
  updated_at    TEXT    NOT NULL                   -- 最近更新时间（ISO-8601）
);
CREATE INDEX IF NOT EXISTS idx_word_memory_due     ON word_memory (mastered, due_at);
CREATE INDEX IF NOT EXISTS idx_word_memory_last_at ON word_memory (last_at);

-- ============================================================
-- 5. 待作答/待评分临时题池表（对应原 state.pending 与 state.wordPending）
-- ============================================================
CREATE TABLE IF NOT EXISTS pending_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT, -- 自增主键 ID
  kind          TEXT    NOT NULL,                  -- 题目类型：phrase（短语题）或 word（单词题）
  item_uuid     TEXT    NOT NULL,                  -- 前端交互使用的题目 UUID
  payload_json  TEXT    NOT NULL,                  -- 题目完整上下文 JSON
  created_at    TEXT    NOT NULL,                  -- 出题时间（ISO-8601）
  UNIQUE (kind, item_uuid)
);
CREATE INDEX IF NOT EXISTS idx_pending_items_kind_created ON pending_items (kind, created_at);

-- ============================================================
-- 6. 每日文章缓存表（对应原 reports/YYYY-MM-DD.json）
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_reports (
  id            INTEGER PRIMARY KEY AUTOINCREMENT, -- 自增主键 ID
  day           TEXT    NOT NULL UNIQUE,           -- 文章所属日期（YYYY-MM-DD）
  report_uuid   TEXT    NOT NULL DEFAULT '',       -- 文章唯一标识
  level         TEXT    NOT NULL DEFAULT '',       -- CEFR 难度等级（A1-C2）
  topic         TEXT    NOT NULL DEFAULT '',       -- 内容方向主题
  bank_link     INTEGER NOT NULL DEFAULT 0,        -- 是否开启词库关联（0=否，1=是）
  bank_id       TEXT,                              -- 关联的词库 ID（未开启为 NULL）
  enriched      INTEGER NOT NULL DEFAULT 1,        -- 是否已完成二阶段翻译/要点增强（0=否，1=是）
  payload_json  TEXT    NOT NULL,                  -- 文章完整 JSON（段落、译文、语法解析缓存、配题等）
  created_at    TEXT    NOT NULL,                  -- 创建时间（ISO-8601）
  updated_at    TEXT    NOT NULL                   -- 最近更新时间（ISO-8601）
);

-- ============================================================
-- 7. 自定义词库表（对应原 wordbanks/wb-*.json）
-- ============================================================
CREATE TABLE IF NOT EXISTS wordbanks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT, -- 自增主键 ID
  bank_id       TEXT    NOT NULL UNIQUE,           -- 自定义词库业务 ID（如 wb-xxx）
  name          TEXT    NOT NULL,                  -- 词库显示名称
  source        TEXT    NOT NULL DEFAULT 'import', -- 导入来源文件名或 paste
  word_count    INTEGER NOT NULL DEFAULT 0,        -- 有效词条总数
  entries_json  TEXT    NOT NULL,                  -- 词条数组 JSON
  created_at    TEXT    NOT NULL,                  -- 导入时间（ISO-8601）
  updated_at    TEXT    NOT NULL                   -- 最近更新时间（ISO-8601）
);
`

export function runInTransaction(db, fn) {
  db.exec('BEGIN IMMEDIATE')
  try {
    const result = fn()
    db.exec('COMMIT')
    return result
  } catch (error) {
    try {
      db.exec('ROLLBACK')
    } catch {
      /* ignore rollback error */
    }
    throw error
  }
}

function upsertMeta(db, key, value, now) {
  const k = String(key)
  const json = JSON.stringify(value === undefined ? null : value)
  const res = db.prepare('UPDATE kv_meta SET value_json = ?, updated_at = ? WHERE meta_key = ?').run(json, now, k)
  if (!res.changes) {
    db.prepare('INSERT INTO kv_meta (meta_key, value_json, created_at, updated_at) VALUES (?, ?, ?, ?)').run(k, json, now, now)
  }
}

function syncDailyStats(db, daily, now) {
  const map = daily && typeof daily === 'object' ? daily : {}
  const incoming = new Set()
  const update = db.prepare('UPDATE daily_stats SET answered = ?, correct = ?, updated_at = ? WHERE day = ?')
  const insert = db.prepare('INSERT INTO daily_stats (day, answered, correct, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
  for (const [day, rec] of Object.entries(map)) {
    if (!day || !rec || typeof rec !== 'object') continue
    incoming.add(day)
    const answered = Math.max(0, Math.trunc(Number(rec.answered) || 0))
    const correct = Math.max(0, Math.trunc(Number(rec.correct) || 0))
    if (!update.run(answered, correct, now, day).changes) {
      insert.run(day, answered, correct, now, now)
    }
  }
  const existing = db.prepare('SELECT day FROM daily_stats').all()
  const del = db.prepare('DELETE FROM daily_stats WHERE day = ?')
  for (const row of existing) {
    if (!incoming.has(row.day)) del.run(row.day)
  }
}

function syncStudyLog(db, log) {
  const map = log && typeof log === 'object' ? log : {}
  const incoming = new Set()
  const update = db.prepare(
    `UPDATE study_log
     SET en = ?, zh = ?, pos = ?, answer = ?, ok = ?, score = ?, studied_at = ?
     WHERE day = ? AND kind = ? AND item_key = ?`,
  )
  const insert = db.prepare(
    `INSERT INTO study_log (day, kind, item_key, en, zh, pos, answer, ok, score, studied_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
  for (const [day, bucket] of Object.entries(map)) {
    if (!day || !bucket || typeof bucket !== 'object') continue
    const words = Array.isArray(bucket.words) ? bucket.words : []
    for (const w of words) {
      if (!w || typeof w !== 'object') continue
      const en = String(w.en || '')
      const itemKey = en.toLowerCase()
      if (!itemKey) continue
      incoming.add(`${day}\0word\0${itemKey}`)
      const zh = String(w.zh || '')
      const pos = String(w.pos || '')
      const ok = w.ok ? 1 : 0
      const studiedAt = String(w.at || '')
      if (!update.run(en, zh, pos, '', ok, 0, studiedAt, day, 'word', itemKey).changes) {
        insert.run(day, 'word', itemKey, en, zh, pos, '', ok, 0, studiedAt)
      }
    }
    const phrases = Array.isArray(bucket.phrases) ? bucket.phrases : []
    for (const p of phrases) {
      if (!p || typeof p !== 'object') continue
      const zh = String(p.zh || '')
      if (!zh) continue
      incoming.add(`${day}\0phrase\0${zh}`)
      const en = String(p.en || '')
      const answer = String(p.answer || '')
      const ok = p.ok ? 1 : 0
      const score = Math.trunc(Number(p.score) || 0)
      const studiedAt = String(p.at || '')
      if (!update.run(en, zh, '', answer, ok, score, studiedAt, day, 'phrase', zh).changes) {
        insert.run(day, 'phrase', zh, en, zh, '', answer, ok, score, studiedAt)
      }
    }
  }
  const existing = db.prepare('SELECT id, day, kind, item_key FROM study_log').all()
  const del = db.prepare('DELETE FROM study_log WHERE id = ?')
  for (const row of existing) {
    if (!incoming.has(`${row.day}\0${row.kind}\0${row.item_key}`)) del.run(row.id)
  }
}

function syncWordMemory(db, wordMemory, now) {
  const map = wordMemory && typeof wordMemory === 'object' ? wordMemory : {}
  const incoming = new Set()
  const update = db.prepare(
    `UPDATE word_memory
     SET state = ?, stability = ?, difficulty = ?, due_at = ?, last_at = ?,
         reps = ?, lapses = ?, mastered = ?, fsrs_version = ?, legacy_stage = ?, updated_at = ?
     WHERE word_key = ?`,
  )
  const insert = db.prepare(
    `INSERT INTO word_memory (
       word_key, state, stability, difficulty, due_at, last_at,
       reps, lapses, mastered, fsrs_version, legacy_stage, updated_at
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
  for (const [rawKey, mem] of Object.entries(map)) {
    const wordKey = String(rawKey || '').trim().toLowerCase()
    if (!wordKey || !mem || typeof mem !== 'object') continue
    incoming.add(wordKey)
    const hasFsrs =
      mem.stability !== null &&
      mem.stability !== undefined &&
      mem.difficulty !== null &&
      mem.difficulty !== undefined &&
      Number.isFinite(Number(mem.stability)) &&
      Number.isFinite(Number(mem.difficulty))
    const stateVal = typeof mem.state === 'string' ? mem.state : ''
    const stabilityVal = hasFsrs ? Number(mem.stability) : null
    const difficultyVal = hasFsrs ? Number(mem.difficulty) : null
    const dueAtVal =
      mem.dueAt !== null && mem.dueAt !== undefined && Number.isFinite(Number(mem.dueAt))
        ? Math.trunc(Number(mem.dueAt))
        : null
    const lastAtVal = Number.isFinite(Number(mem.lastAt)) ? Math.trunc(Number(mem.lastAt)) : 0
    const repsVal = Math.max(0, Math.trunc(Number(mem.reps) || 0))
    const lapsesVal = Math.max(0, Math.trunc(Number(mem.lapses) || 0))
    const masteredVal = mem.mastered === true || mem.mastered === 1 ? 1 : 0
    const fsrsVersionVal = hasFsrs
      ? Number.isFinite(Number(mem.fsrs))
        ? Math.trunc(Number(mem.fsrs))
        : 6
      : null
    const legacyStageVal =
      !hasFsrs && mem.stage !== null && mem.stage !== undefined && Number.isFinite(Number(mem.stage))
        ? Math.trunc(Number(mem.stage))
        : null
    const updated = update.run(
      stateVal,
      stabilityVal,
      difficultyVal,
      dueAtVal,
      lastAtVal,
      repsVal,
      lapsesVal,
      masteredVal,
      fsrsVersionVal,
      legacyStageVal,
      now,
      wordKey,
    )
    if (!updated.changes) {
      insert.run(
        wordKey,
        stateVal,
        stabilityVal,
        difficultyVal,
        dueAtVal,
        lastAtVal,
        repsVal,
        lapsesVal,
        masteredVal,
        fsrsVersionVal,
        legacyStageVal,
        now,
      )
    }
  }
  const existing = db.prepare('SELECT word_key FROM word_memory').all()
  const del = db.prepare('DELETE FROM word_memory WHERE word_key = ?')
  for (const row of existing) {
    if (!incoming.has(row.word_key)) del.run(row.word_key)
  }
}

function syncPendingItems(db, pending, wordPending, now) {
  const incoming = new Set()
  const update = db.prepare('UPDATE pending_items SET payload_json = ?, created_at = ? WHERE kind = ? AND item_uuid = ?')
  const insert = db.prepare('INSERT INTO pending_items (kind, item_uuid, payload_json, created_at) VALUES (?, ?, ?, ?)')
  const addGroup = (kind, map) => {
    const obj = map && typeof map === 'object' ? map : {}
    for (const [uuid, payload] of Object.entries(obj)) {
      if (!uuid || !payload || typeof payload !== 'object') continue
      incoming.add(`${kind}\0${uuid}`)
      const createdAt = typeof payload.createdAt === 'string' && payload.createdAt ? payload.createdAt : now
      const json = JSON.stringify(payload)
      if (!update.run(json, createdAt, kind, uuid).changes) {
        insert.run(kind, uuid, json, createdAt)
      }
    }
  }
  addGroup('phrase', pending)
  addGroup('word', wordPending)

  const existing = db.prepare('SELECT id, kind, item_uuid FROM pending_items').all()
  const del = db.prepare('DELETE FROM pending_items WHERE id = ?')
  for (const row of existing) {
    if (!incoming.has(`${row.kind}\0${row.item_uuid}`)) del.run(row.id)
  }
}

export function writeStateToDb(db, state) {
  const s = state && typeof state === 'object' ? state : {}
  const now = new Date().toISOString()
  runInTransaction(db, () => {
    upsertMeta(db, 'version', Number.isFinite(Number(s.version)) ? Math.trunc(Number(s.version)) : 1, now)
    upsertMeta(db, 'created_at', typeof s.createdAt === 'string' && s.createdAt ? s.createdAt : now, now)
    upsertMeta(db, 'streak', s.streak && typeof s.streak === 'object' ? s.streak : { count: 0, lastActiveDay: null }, now)
    upsertMeta(db, 'totals', s.totals && typeof s.totals === 'object' ? s.totals : { answered: 0, correct: 0 }, now)
    upsertMeta(db, 'word_totals', s.word && typeof s.word === 'object' ? s.word : { answered: 0, correct: 0 }, now)
    upsertMeta(db, 'word_recent', Array.isArray(s.wordRecent) ? s.wordRecent : [], now)
    upsertMeta(db, 'word_review_streak', Number.isFinite(Number(s.wordReviewStreak)) ? Number(s.wordReviewStreak) : 0, now)
    upsertMeta(db, 'word_bank_id', typeof s.wordBankId === 'string' && s.wordBankId ? s.wordBankId : 'builtin', now)
    upsertMeta(db, 'settings', s.settings && typeof s.settings === 'object' ? s.settings : {}, now)

    syncDailyStats(db, s.daily, now)
    syncStudyLog(db, s.log)
    syncWordMemory(db, s.wordMemory, now)
    syncPendingItems(db, s.pending, s.wordPending, now)
  })
}

export function writeReportToDb(db, day, report) {
  const now = new Date().toISOString()
  const r = report && typeof report === 'object' ? report : {}
  const reportUuid = typeof r.id === 'string' ? r.id : ''
  const level = typeof r.level === 'string' ? r.level : ''
  const topic = typeof r.topic === 'string' ? r.topic : ''
  const bankLink = r.bankLink === true ? 1 : 0
  const bankId = typeof r.bankId === 'string' && r.bankId ? r.bankId : null
  const enriched = r.enriched === false ? 0 : 1
  const payloadJson = JSON.stringify(r)
  const dayStr = String(day)
  const updated = db
    .prepare(
      `UPDATE daily_reports
       SET report_uuid = ?, level = ?, topic = ?, bank_link = ?, bank_id = ?,
           enriched = ?, payload_json = ?, updated_at = ?
       WHERE day = ?`,
    )
    .run(reportUuid, level, topic, bankLink, bankId, enriched, payloadJson, now, dayStr)
  if (!updated.changes) {
    db.prepare(
      `INSERT INTO daily_reports (
         day, report_uuid, level, topic, bank_link, bank_id,
         enriched, payload_json, created_at, updated_at
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(dayStr, reportUuid, level, topic, bankLink, bankId, enriched, payloadJson, now, now)
  }
}

export function writeWordBankToDb(db, bank) {
  const now = new Date().toISOString()
  const entries = Array.isArray(bank.entries) ? bank.entries : []
  const createdAt = typeof bank.createdAt === 'string' && bank.createdAt ? bank.createdAt : now
  const bankId = String(bank.id)
  const name = String(bank.name || '未命名词库')
  const source = String(bank.source || 'import')
  const entriesJson = JSON.stringify(entries)
  const updated = db
    .prepare(
      `UPDATE wordbanks
       SET name = ?, source = ?, word_count = ?, entries_json = ?, updated_at = ?
       WHERE bank_id = ?`,
    )
    .run(name, source, entries.length, entriesJson, now, bankId)
  if (!updated.changes) {
    db.prepare(
      `INSERT INTO wordbanks (bank_id, name, source, word_count, entries_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).run(bankId, name, source, entries.length, entriesJson, createdAt, now)
  }
}

function tryReadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}

function dbHasUserData(db) {
  const metaRows = db.prepare("SELECT meta_key FROM kv_meta WHERE meta_key NOT IN ('schema_version', 'legacy_json_migrated') LIMIT 1").all()
  if (metaRows.length > 0) return true
  const tables = ['daily_stats', 'study_log', 'word_memory', 'pending_items', 'daily_reports', 'wordbanks']
  for (const t of tables) {
    const row = db.prepare(`SELECT 1 AS ok FROM ${t} LIMIT 1`).get()
    if (row) return true
  }
  return false
}

function migrateLegacyJsonIfNeeded(db, dir) {
  const already = db.prepare("SELECT 1 FROM kv_meta WHERE meta_key = 'legacy_json_migrated'").get()
  if (already) return

  const now = new Date().toISOString()
  if (dbHasUserData(db)) {
    upsertMeta(db, 'legacy_json_migrated', { migratedAt: now, skipped: 'db_non_empty' }, now)
    return
  }

  const stateFile = path.join(dir, 'state.json')
  const legacyState = fs.existsSync(stateFile) ? tryReadJson(stateFile) : null

  const reportsDir = path.join(dir, 'reports')
  const legacyReports = []
  try {
    for (const name of fs.readdirSync(reportsDir)) {
      const m = /^(\d{4}-\d{2}-\d{2})\.json$/.exec(name)
      if (!m) continue
      const data = tryReadJson(path.join(reportsDir, name))
      if (data && typeof data === 'object' && !data.fallback) {
        legacyReports.push({ day: m[1], data })
      }
    }
  } catch {
    /* ignore missing reports dir */
  }

  const wordbanksDir = path.join(dir, 'wordbanks')
  const legacyBanks = []
  try {
    for (const name of fs.readdirSync(wordbanksDir)) {
      if (!name.endsWith('.json')) continue
      const data = tryReadJson(path.join(wordbanksDir, name))
      if (
        data &&
        typeof data === 'object' &&
        typeof data.id === 'string' &&
        /^wb-[a-z0-9-]{4,64}$/.test(data.id) &&
        Array.isArray(data.entries)
      ) {
        legacyBanks.push(data)
      }
    }
  } catch {
    /* ignore missing wordbanks dir */
  }

  runInTransaction(db, () => {
    if (legacyState && typeof legacyState === 'object') {
      upsertMeta(db, 'version', Number.isFinite(Number(legacyState.version)) ? Math.trunc(Number(legacyState.version)) : 1, now)
      upsertMeta(db, 'created_at', typeof legacyState.createdAt === 'string' && legacyState.createdAt ? legacyState.createdAt : now, now)
      upsertMeta(db, 'streak', legacyState.streak && typeof legacyState.streak === 'object' ? legacyState.streak : { count: 0, lastActiveDay: null }, now)
      upsertMeta(db, 'totals', legacyState.totals && typeof legacyState.totals === 'object' ? legacyState.totals : { answered: 0, correct: 0 }, now)
      upsertMeta(db, 'word_totals', legacyState.word && typeof legacyState.word === 'object' ? legacyState.word : { answered: 0, correct: 0 }, now)
      upsertMeta(db, 'word_recent', Array.isArray(legacyState.wordRecent) ? legacyState.wordRecent : [], now)
      upsertMeta(db, 'word_review_streak', Number.isFinite(Number(legacyState.wordReviewStreak)) ? Number(legacyState.wordReviewStreak) : 0, now)
      upsertMeta(db, 'word_bank_id', typeof legacyState.wordBankId === 'string' && legacyState.wordBankId ? legacyState.wordBankId : 'builtin', now)
      upsertMeta(db, 'settings', legacyState.settings && typeof legacyState.settings === 'object' ? legacyState.settings : {}, now)

      syncDailyStats(db, legacyState.daily, now)
      syncStudyLog(db, legacyState.log)
      syncWordMemory(db, legacyState.wordMemory, now)
      syncPendingItems(db, legacyState.pending, legacyState.wordPending, now)
    }

    for (const r of legacyReports) {
      writeReportToDb(db, r.day, r.data)
    }
    for (const b of legacyBanks) {
      writeWordBankToDb(db, b)
    }

    upsertMeta(
      db,
      'legacy_json_migrated',
      {
        migratedAt: now,
        hadState: Boolean(legacyState && typeof legacyState === 'object'),
        reports: legacyReports.length,
        wordbanks: legacyBanks.length,
      },
      now,
    )
  })
}

export function getDb(dir) {
  const key = path.resolve(dir)
  const file = dbPath(key)
  const cached = dbCache.get(key)
  if (cached) {
    try {
      const stat = fs.statSync(file)
      if (stat.ino === cached.ino && stat.dev === cached.dev) {
        return cached.db
      }
    } catch {
      /* file vanished or replaced; reopen below */
    }
    try {
      cached.db.close()
    } catch {
      /* ignore */
    }
    dbCache.delete(key)
  }

  fs.mkdirSync(key, { recursive: true })
  const db = new DatabaseSync(file)
  db.exec('PRAGMA journal_mode = WAL;')
  db.exec('PRAGMA synchronous = NORMAL;')
  db.exec('PRAGMA busy_timeout = 5000;')
  db.exec('PRAGMA foreign_keys = ON;')
  db.exec(SCHEMA_SQL)

  const now = new Date().toISOString()
  db.prepare(
    `INSERT OR IGNORE INTO kv_meta (meta_key, value_json, created_at, updated_at)
     VALUES ('schema_version', ?, ?, ?)`,
  ).run(JSON.stringify(SCHEMA_VERSION), now, now)

  migrateLegacyJsonIfNeeded(db, key)

  const stat = fs.statSync(file)
  dbCache.set(key, { db, file, ino: stat.ino, dev: stat.dev })

  if (!exitHookRegistered) {
    exitHookRegistered = true
    process.once('exit', closeAllDbs)
  }

  return db
}

export function closeDb(dir) {
  const key = path.resolve(dir)
  const cached = dbCache.get(key)
  if (!cached) return
  dbCache.delete(key)
  try {
    cached.db.close()
  } catch {
    /* ignore */
  }
}

export function closeAllDbs() {
  for (const [key, cached] of dbCache.entries()) {
    dbCache.delete(key)
    try {
      cached.db.close()
    } catch {
      /* ignore */
    }
  }
}
