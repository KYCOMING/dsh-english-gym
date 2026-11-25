import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { cutoffDayKey, executeCleanup, previewCleanup, pruneOldReports } from '../src/features/activity/cleanup.js'
import { loadState, saveReport, saveState } from '../src/core/store.js'
import { createWordService } from '../src/features/word/service.js'

test('cutoffDayKey calculates local cutoff dates across ranges', () => {
  const now = new Date('2026-11-25T15:00:00')
  assert.equal(cutoffDayKey('7d', now), '2026-11-18')
  assert.equal(cutoffDayKey('30d', now), '2026-10-26')
  assert.equal(cutoffDayKey('90d', now), '2026-08-27')
  assert.equal(cutoffDayKey('365d', now), '2025-11-25')
  assert.equal(cutoffDayKey('all', now), null)
})

test('previewCleanup and executeCleanup remove old logs/reports while preserving settings, banks, and protected memory', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-cleanup-'))
  try {
    const now = new Date('2026-11-25T15:00:00')
    const wordSvc = createWordService({ dir })
    const imported = wordSvc.importBank({ name: 'My Bank', content: 'compact\t紧凑的\n' })
    assert.equal(imported.ok, true)

    const state = loadState(dir)
    state.settings.reportLevel = 'C1'
    state.streak = { count: 2, lastActiveDay: '2026-11-24' }
    state.totals = { answered: 10, correct: 8 }
    state.log = {
      '2026-09-01': { words: [{ en: 'old', zh: '旧', ok: true }], phrases: [] },
      '2026-11-24': { words: [{ en: 'recent', zh: '近', ok: true }], phrases: [] },
    }
    state.daily = {
      '2026-09-01': { answered: 3, correct: 2 },
      '2026-11-24': { answered: 4, correct: 4 },
    }
    state.wordMemory = {
      oldword: { stage: 2, dueAt: 1, lastAt: new Date('2026-09-01T10:00:00').getTime(), reps: 1, lapses: 0, mastered: false },
      newword: { stage: 2, dueAt: 1, lastAt: new Date('2026-11-24T10:00:00').getTime(), reps: 1, lapses: 0, mastered: false },
    }
    saveState(dir, state)
    saveReport(dir, '2026-09-01', { title: 'Old', body: 'Old body' })
    saveReport(dir, '2026-11-24', { title: 'Recent', body: 'Recent body' })

    // Preview without clearMemory
    const previewSafe = previewCleanup(dir, { range: '30d', clearMemory: false, now })
    assert.equal(previewSafe.recordDays, 1)
    assert.equal(previewSafe.reports, 1)
    assert.equal(previewSafe.memoryWords, 0)

    // Execute without clearMemory: old logs & report gone, wordMemory & custom bank & settings intact
    const resSafe = executeCleanup(dir, { range: '30d', clearMemory: false, now })
    assert.equal(resSafe.removed.recordDays, 1)
    assert.equal(resSafe.removed.reports, 1)
    assert.equal(resSafe.removed.memoryWords, 0)

    const afterSafe = loadState(dir)
    assert.equal(afterSafe.settings.reportLevel, 'C1')
    assert.equal(afterSafe.wordBankId, imported.body.bank.id)
    assert.ok(!afterSafe.log['2026-09-01'])
    assert.ok(afterSafe.log['2026-11-24'])
    assert.ok(afterSafe.wordMemory.oldword)
    assert.ok(afterSafe.wordMemory.newword)
    assert.equal(fs.existsSync(path.join(dir, 'reports', '2026-09-01.json')), false)
    assert.equal(fs.existsSync(path.join(dir, 'reports', '2026-11-24.json')), true)

    // Execute with clearMemory=true for 30d -> prunes oldword, keeps newword
    const resMem = executeCleanup(dir, { range: '30d', clearMemory: true, now })
    assert.equal(resMem.removed.memoryWords, 1)
    const afterMem = loadState(dir)
    assert.ok(!afterMem.wordMemory.oldword)
    assert.ok(afterMem.wordMemory.newword)

    // Execute 'all' with clearMemory=true -> resets records, streak, totals, and remaining memory, keeps settings & bank
    const resAll = executeCleanup(dir, { range: 'all', clearMemory: true, now })
    assert.equal(resAll.removed.recordDays, 1)
    assert.equal(resAll.removed.reports, 1)
    assert.equal(resAll.removed.memoryWords, 1)
    const afterAll = loadState(dir)
    assert.deepEqual(afterAll.log, {})
    assert.deepEqual(afterAll.daily, {})
    assert.deepEqual(afterAll.wordMemory, {})
    assert.deepEqual(afterAll.streak, { count: 0, lastActiveDay: null })
    assert.deepEqual(afterAll.totals, { answered: 0, correct: 0 })
    assert.equal(afterAll.settings.reportLevel, 'C1')
    assert.equal(afterAll.wordBankId, imported.body.bank.id)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('pruneOldReports removes reports older than 90 days and retains recent ones', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-prune-reports-'))
  try {
    const now = new Date('2026-11-25T15:00:00')
    saveReport(dir, '2026-08-01', { title: 'Old', body: 'Old' })
    saveReport(dir, '2026-11-20', { title: 'Recent', body: 'Recent' })
    const removed = pruneOldReports(dir, 90, now)
    assert.equal(removed, 1)
    assert.equal(fs.existsSync(path.join(dir, 'reports', '2026-08-01.json')), false)
    assert.equal(fs.existsSync(path.join(dir, 'reports', '2026-11-20.json')), true)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
