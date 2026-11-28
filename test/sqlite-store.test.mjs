import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { closeDb, getDb } from '../src/core/db.js'
import {
  dbPath,
  deleteCustomWordBank,
  deleteReportsBefore,
  listCustomWordBanks,
  listReportDays,
  loadCustomWordBank,
  loadReport,
  loadState,
  saveCustomWordBank,
  saveReport,
  saveState,
  writeJson,
} from '../src/core/store.js'

const EXPECTED_TABLES = [
  'kv_meta',
  'daily_stats',
  'study_log',
  'word_memory',
  'pending_items',
  'daily_reports',
  'wordbanks',
]

test('SQLite schema defines all 7 tables with auto-increment id primary keys, column comments, and WAL mode', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-sqlite-schema-'))
  try {
    const db = getDb(dir)
    const modeRow = db.prepare('PRAGMA journal_mode').get()
    assert.equal(String(modeRow.journal_mode).toLowerCase(), 'wal')

    const rows = db
      .prepare("SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")
      .all()
    const tableSql = new Map(rows.map((r) => [r.name, r.sql]))

    for (const table of EXPECTED_TABLES) {
      assert.ok(tableSql.has(table), `missing table ${table}`)
      const ddl = tableSql.get(table)
      assert.match(ddl, /id\s+INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT/i, `${table} must have AUTOINCREMENT id`)
      assert.match(ddl, /--/, `${table} DDL must preserve column comments`)

      const cols = db.prepare(`PRAGMA table_info(${table})`).all()
      assert.equal(cols[0].name, 'id', `${table} first column must be id`)
      assert.equal(cols[0].pk, 1, `${table}.id must be primary key`)
      for (const col of cols) {
        assert.ok(ddl.includes(col.name), `${table}.${col.name} present`)
      }
    }
  } finally {
    closeDb(dir)
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('auto-increment ids increment for new rows and stay stable across updates', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-sqlite-id-'))
  try {
    const state = loadState(dir)
    state.daily = {
      '2026-11-20': { answered: 1, correct: 1 },
      '2026-11-21': { answered: 2, correct: 1 },
    }
    state.wordMemory = {
      alpha: { state: 'review', stability: 2.5, difficulty: 4.1, dueAt: 1000, lastAt: 500, reps: 1, lapses: 0, mastered: false, fsrs: 6 },
      beta: { stage: 2, dueAt: 2000, lastAt: 600, reps: 2, lapses: 1, mastered: false },
    }
    saveState(dir, state)

    const db = getDb(dir)
    const dailyBefore = db.prepare('SELECT id, day FROM daily_stats ORDER BY id ASC').all()
    assert.deepEqual(
      dailyBefore.map((r) => ({ id: r.id, day: r.day })),
      [
        { id: 1, day: '2026-11-20' },
        { id: 2, day: '2026-11-21' },
      ],
    )

    const memBefore = db.prepare('SELECT id, word_key FROM word_memory ORDER BY id ASC').all()
    assert.deepEqual(
      memBefore.map((r) => ({ id: r.id, word_key: r.word_key })),
      [
        { id: 1, word_key: 'alpha' },
        { id: 2, word_key: 'beta' },
      ],
    )

    // Update existing rows + add a third row; ids 1 and 2 must remain unchanged
    state.daily['2026-11-20'].answered = 5
    state.daily['2026-11-22'] = { answered: 3, correct: 3 }
    state.wordMemory.alpha.reps = 4
    saveState(dir, state)

    const dailyAfter = db.prepare('SELECT id, day, answered FROM daily_stats ORDER BY id ASC').all()
    assert.deepEqual(
      dailyAfter.map((r) => ({ id: r.id, day: r.day, answered: r.answered })),
      [
        { id: 1, day: '2026-11-20', answered: 5 },
        { id: 2, day: '2026-11-21', answered: 2 },
        { id: 3, day: '2026-11-22', answered: 3 },
      ],
    )

    const memAfter = db.prepare('SELECT id, word_key, reps FROM word_memory ORDER BY id ASC').all()
    assert.deepEqual(
      memAfter.map((r) => ({ id: r.id, word_key: r.word_key, reps: r.reps })),
      [
        { id: 1, word_key: 'alpha', reps: 4 },
        { id: 2, word_key: 'beta', reps: 2 },
      ],
    )
  } finally {
    closeDb(dir)
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('state, reports, and custom wordbanks round-trip cleanly across closeDb and reopen', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-sqlite-roundtrip-'))
  try {
    const s = loadState(dir)
    s.streak = { count: 4, lastActiveDay: '2026-11-28' }
    s.totals = { answered: 12, correct: 10 }
    s.word = { answered: 20, correct: 18 }
    s.wordBankId = 'wb-custom-1'
    s.wordRecent = ['compact', 'latency']
    s.wordReviewStreak = 3
    s.settings.reportLevel = 'C1'
    s.settings.customTopics = [{ id: 'ct-demo-1', label: 'Rust', topic: 'Rust' }]
    s.daily['2026-11-28'] = { answered: 2, correct: 2 }
    s.pending['p-1'] = { zh: '测试', en: 'test', hint: 'h', bankWords: ['compact'], source: 'topic', createdAt: '2026-11-28T01:00:00.000Z' }
    s.wordPending['w-1'] = { en: 'compact', zh: '紧凑的', createdAt: '2026-11-28T01:05:00.000Z', hadMiss: false }
    s.wordMemory.compact = {
      state: 'review',
      stability: 3.2,
      difficulty: 4.5,
      dueAt: 1800000000000,
      lastAt: 1799000000000,
      reps: 3,
      lapses: 0,
      mastered: false,
      fsrs: 6,
    }
    s.wordMemory.legacy = { stage: 2, dueAt: 1799500000000, lastAt: 1799000000000, reps: 1, lapses: 0, mastered: false }
    s.log['2026-11-28'] = {
      words: [{ en: 'compact', zh: '紧凑的', pos: 'adj', ok: true, at: '2026-11-28T01:10:00.000Z' }],
      phrases: [{ zh: '测试', en: 'test', answer: 'test', ok: true, score: 95, at: '2026-11-28T01:12:00.000Z' }],
    }
    saveState(dir, s)

    saveReport(dir, '2026-11-28', {
      id: 'rep-1',
      title: 'SQLite Migration',
      body: 'Body text',
      level: 'C1',
      topic: 'AI and technology',
      bankLink: true,
      bankId: 'wb-custom-1',
      enriched: true,
    })

    saveCustomWordBank(dir, {
      id: 'wb-custom-1',
      name: 'My Custom Bank',
      source: 'custom.csv',
      createdAt: '2026-11-28T00:00:00.000Z',
      entries: [{ word: 'compact', meaning: '紧凑的', pos: 'adj', uk: '', us: '', phonetic: '', example: '', exampleZh: '' }],
    })

    closeDb(dir)
    assert.equal(fs.existsSync(dbPath(dir)), true)

    const loaded = loadState(dir)
    assert.deepEqual(loaded.streak, s.streak)
    assert.deepEqual(loaded.totals, s.totals)
    assert.deepEqual(loaded.word, s.word)
    assert.equal(loaded.wordBankId, 'wb-custom-1')
    assert.deepEqual(loaded.wordRecent, ['compact', 'latency'])
    assert.equal(loaded.wordReviewStreak, 3)
    assert.equal(loaded.settings.reportLevel, 'C1')
    assert.deepEqual(loaded.settings.customTopics, [{ id: 'ct-demo-1', label: 'Rust', topic: 'Rust' }])
    assert.deepEqual(loaded.daily, s.daily)
    assert.deepEqual(loaded.pending, s.pending)
    assert.deepEqual(loaded.wordPending, s.wordPending)
    assert.deepEqual(loaded.wordMemory.compact, s.wordMemory.compact)
    assert.deepEqual(loaded.wordMemory.legacy, s.wordMemory.legacy)
    assert.deepEqual(loaded.log, s.log)

    const rep = loadReport(dir, '2026-11-28')
    assert.equal(rep.id, 'rep-1')
    assert.equal(rep.title, 'SQLite Migration')
    assert.deepEqual(listReportDays(dir), ['2026-11-28'])

    const banks = listCustomWordBanks(dir)
    assert.equal(banks.length, 1)
    assert.equal(banks[0].id, 'wb-custom-1')
    assert.equal(banks[0].count, 1)
    const bank = loadCustomWordBank(dir, 'wb-custom-1')
    assert.equal(bank.entries[0].word, 'compact')

    assert.equal(deleteCustomWordBank(dir, 'wb-custom-1'), true)
    assert.equal(loadCustomWordBank(dir, 'wb-custom-1'), null)
    assert.equal(deleteReportsBefore(dir, null), 1)
    assert.equal(loadReport(dir, '2026-11-28'), null)
  } finally {
    closeDb(dir)
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('migrates legacy state.json, reports/*.json, and wordbanks/*.json once without deleting backups or crashing on corrupt files', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-sqlite-migrate-'))
  try {
    writeJson(path.join(dir, 'state.json'), {
      version: 1,
      streak: { count: 6, lastActiveDay: '2026-11-20' },
      totals: { answered: 8, correct: 7 },
      daily: { '2026-11-20': { answered: 8, correct: 7 } },
      word: { answered: 5, correct: 4 },
      wordBankId: 'wb-legacy-01',
      wordMemory: {
        resilient: { state: 'review', stability: 5.5, difficulty: 3.1, dueAt: 1800000000000, lastAt: 1799000000000, reps: 2, lapses: 0, mastered: false, fsrs: 6 },
      },
      settings: { reportLevel: 'B2', topicId: 'software' },
      log: { '2026-11-20': { words: [{ en: 'resilient', zh: '有弹性的', ok: true, at: '2026-11-20T10:00:00.000Z' }], phrases: [] } },
    })
    writeJson(path.join(dir, 'reports', '2026-11-20.json'), {
      id: 'legacy-rep-1',
      title: 'Legacy Report',
      body: 'Legacy body',
      level: 'B2',
      topic: 'software development and engineering',
    })
    fs.writeFileSync(path.join(dir, 'reports', '2026-11-21.json'), '{corrupt json', 'utf8')
    writeJson(path.join(dir, 'wordbanks', 'wb-legacy-01.json'), {
      id: 'wb-legacy-01',
      name: 'Legacy Bank',
      source: 'legacy.txt',
      createdAt: '2026-11-20T09:00:00.000Z',
      entries: [{ word: 'resilient', meaning: '有弹性的' }],
    })
    fs.writeFileSync(path.join(dir, 'wordbanks', 'wb-corrupt-02.json'), '{broken', 'utf8')

    // First load triggers automatic one-time migration
    const migrated = loadState(dir)
    assert.equal(migrated.streak.count, 6)
    assert.equal(migrated.totals.answered, 8)
    assert.equal(migrated.settings.reportLevel, 'B2')
    assert.equal(migrated.wordBankId, 'wb-legacy-01')
    assert.ok(migrated.wordMemory.resilient)
    assert.equal(loadReport(dir, '2026-11-20').title, 'Legacy Report')
    assert.equal(loadReport(dir, '2026-11-21'), null)
    assert.equal(loadCustomWordBank(dir, 'wb-legacy-01').name, 'Legacy Bank')

    // Original JSON files stay intact as backups
    assert.equal(fs.existsSync(path.join(dir, 'state.json')), true)
    assert.equal(fs.existsSync(path.join(dir, 'reports', '2026-11-20.json')), true)
    assert.equal(fs.existsSync(path.join(dir, 'wordbanks', 'wb-legacy-01.json')), true)

    // Subsequent SQLite changes are never overwritten by legacy JSON on reopen
    migrated.streak.count = 99
    saveState(dir, migrated)
    closeDb(dir)

    const reopened = loadState(dir)
    assert.equal(reopened.streak.count, 99)

    // Confirm raw SQLite file can also be inspected directly with node:sqlite
    closeDb(dir)
    const raw = new DatabaseSync(dbPath(dir))
    const flag = raw.prepare("SELECT value_json FROM kv_meta WHERE meta_key = 'legacy_json_migrated'").get()
    assert.ok(flag)
    raw.close()
  } finally {
    closeDb(dir)
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
