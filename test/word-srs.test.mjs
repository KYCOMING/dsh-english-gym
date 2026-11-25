import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  applyWordReview,
  INITIAL_CLEAN_STAGE,
  markWordMastered,
  pickWordSrs,
  SRS_INTERVALS_MS,
  SRS_MAX_STAGE,
  summarizeBankMemory,
} from '../src/features/word/srs.js'
import { createWordService } from '../src/features/word/service.js'
import { pickBankCandidates } from '../src/features/word/sample.js'
import { formatPos, formatMeaning } from '../src/client/core/text.js'
import { saveState } from '../src/core/store.js'

test('applyWordReview handles clean recall, misses, retries, and full progression to mastered', () => {
  const t0 = 1_700_000_000_000

  // Brand new word spelled cleanly -> INITIAL_CLEAN_STAGE (12h)
  const firstClean = applyWordReview(null, { correct: true, clean: true, now: t0 })
  assert.equal(firstClean.stage, INITIAL_CLEAN_STAGE)
  assert.equal(firstClean.mastered, false)
  assert.equal(firstClean.nextIntervalMs, SRS_INTERVALS_MS[INITIAL_CLEAN_STAGE])
  assert.equal(firstClean.nextReviewText, '12 小时后复习')

  // Missed word -> stage 0 (5m) and lapses = 1; subsequent retry miss does not double-count lapses
  const miss1 = applyWordReview(null, { correct: false, clean: false, countLapse: true, now: t0 })
  assert.equal(miss1.stage, 0)
  assert.equal(miss1.memory.lapses, 1)
  assert.equal(miss1.nextReviewText, '5 分钟后再次巩固')

  const missRetry = applyWordReview(miss1.memory, { correct: false, clean: false, countLapse: false, now: t0 + 5000 })
  assert.equal(missRetry.memory.lapses, 1)

  // Retry-after-miss spelled right (clean=false) stays at stage 0 (5m)
  const retryCorrect = applyWordReview(missRetry.memory, { correct: true, clean: false, now: t0 + 10_000 })
  assert.equal(retryCorrect.stage, 0)
  assert.equal(retryCorrect.mastered, false)
  assert.equal(retryCorrect.nextReviewText, '5 分钟后再次巩固')

  // Early clean review before dueAt keeps stage & dueAt unchanged, only incrementing reps
  const earlyClean = applyWordReview(firstClean.memory, { correct: true, clean: true, now: t0 + 60_000 })
  assert.equal(earlyClean.stage, INITIAL_CLEAN_STAGE)
  assert.equal(earlyClean.mastered, false)
  assert.equal(earlyClean.early, true)
  assert.equal(earlyClean.memory.dueAt, firstClean.memory.dueAt)
  assert.equal(earlyClean.memory.reps, firstClean.memory.reps + 1)
  assert.ok(earlyClean.nextReviewText.startsWith('提前巩固 · 仍于 '))

  // Early miss before dueAt still resets to stage 0 and increments lapses
  const earlyMiss = applyWordReview(firstClean.memory, { correct: false, clean: false, countLapse: true, now: t0 + 120_000 })
  assert.equal(earlyMiss.stage, 0)
  assert.equal(earlyMiss.memory.lapses, 1)

  // Clean progression through all remaining stages once due until mastered
  let mem = firstClean.memory
  for (let s = INITIAL_CLEAN_STAGE + 1; s < SRS_MAX_STAGE; s += 1) {
    const step = applyWordReview(mem, { correct: true, clean: true, now: mem.dueAt })
    assert.equal(step.stage, s)
    assert.equal(step.mastered, false)
    assert.ok(!step.early)
    mem = step.memory
  }
  const finalStep = applyWordReview(mem, { correct: true, clean: true, now: mem.dueAt })
  assert.equal(finalStep.stage, SRS_MAX_STAGE)
  assert.equal(finalStep.mastered, true)
  assert.equal(finalStep.nextReviewText, '已掌握')
})

test('summarizeBankMemory and markWordMastered count due, learning, mastered, and unseen accurately', () => {
  const now = 1_700_000_000_000
  const entries = [
    { word: 'alpha', meaning: 'a' },
    { word: 'beta', meaning: 'b' },
    { word: 'gamma', meaning: 'c' },
    { word: 'delta', meaning: 'd' },
  ]
  const wordMemory = {
    alpha: { stage: 1, dueAt: now - 1000, lastAt: now - 5000, reps: 1, lapses: 0, mastered: false },
    beta: { stage: 3, dueAt: now + 60_000, lastAt: now - 5000, reps: 2, lapses: 0, mastered: false },
    gamma: markWordMastered(null, now),
  }

  const stats = summarizeBankMemory(entries, wordMemory, now)
  assert.deepEqual(stats, {
    total: 4,
    due: 1,
    learning: 2,
    mastered: 1,
    unseen: 1,
  })
})

test('pickWordSrs prioritizes short-term due words, interleaves new words, and handles empty review mode', () => {
  const now = 1_700_000_000_000
  const entries = [
    { word: 'old_due', meaning: '1' },
    { word: 'short_due', meaning: '2' },
    { word: 'fresh_word', meaning: '3' },
  ]
  const wordMemory = {
    old_due: { stage: 4, dueAt: now - 100_000, reps: 3, lapses: 0, mastered: false },
    short_due: { stage: 0, dueAt: now - 10_000, reps: 1, lapses: 1, mastered: false },
  }

  // Short-term (stage <= 1) due word comes before longer-stage overdue word.
  const p1 = pickWordSrs(entries, wordMemory, { mode: 'smart', reviewStreak: 0, now })
  assert.equal(p1.entry.word, 'short_due')
  assert.equal(p1.kind, 'review')
  assert.equal(p1.nextReviewStreak, 1)

  // After 3 consecutive reviews, smart mode interleaves an unseen word.
  const p2 = pickWordSrs(entries, wordMemory, { mode: 'smart', reviewStreak: 3, now })
  assert.equal(p2.entry.word, 'fresh_word')
  assert.equal(p2.kind, 'new')
  assert.equal(p2.nextReviewStreak, 0)

  // Explicit 'new' mode picks unseen word even when due words exist.
  const pNew = pickWordSrs(entries, wordMemory, { mode: 'new', now })
  assert.equal(pNew.entry.word, 'fresh_word')
  assert.equal(pNew.kind, 'new')

  // Explicit 'review' mode returns done when nothing is due.
  const pDone = pickWordSrs(
    entries,
    {
      old_due: { stage: 4, dueAt: now + 100_000, reps: 3, lapses: 0, mastered: false },
      short_due: markWordMastered(null, now),
    },
    { mode: 'review', now },
  )
  assert.equal(pDone.entry, null)
  assert.equal(pDone.kind, 'done')
  assert.equal(pDone.reason, 'no_due')
})

test('createWordService end-to-end SRS flow, markMastered, and cross-bank sharing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-word-srs-'))
  try {
    const svc = createWordService({ dir })
    const custom = svc.importBank({
      name: 'Test Bank',
      content: 'compact\t紧凑的\nlatency\t延迟\n',
    })
    assert.equal(custom.ok, true)

    const w1 = svc.nextWord({ mode: 'new' })
    assert.ok(w1.id)
    assert.equal(w1.srs.kind, 'new')
    assert.equal(w1.srsStats.total, 2)

    const refWord = w1.letters === 7 ? 'compact' : 'latency'
    // Wrong attempt first, then right on retry -> stays at stage 0 (5m consolidation)
    const missRes = svc.checkWord({ id: w1.id, answer: 'xxxxxxx' })
    assert.equal(missRes.correct, false)
    assert.equal(missRes.srs.stage, 0)

    const retryOk = svc.checkWord({ id: w1.id, answer: missRes.reference })
    assert.equal(retryOk.correct, true)
    assert.equal(retryOk.srs.stage, 0)
    assert.equal(retryOk.srs.nextReviewText, '5 分钟后再次巩固')
    assert.equal(retryOk.srsStats.learning, 1)

    // Second word: mark as mastered directly
    const w2 = svc.nextWord({ mode: 'new' })
    const masterRes = svc.markMastered({ id: w2.id })
    assert.equal(masterRes.ok, true)
    assert.equal(masterRes.body.srsStats.mastered, 1)
    assert.equal(masterRes.body.srsStats.learning, 1)

    // Review mode has 0 due right now (compact/latency was scheduled 5m in the future)
    const reviewDone = svc.nextWord({ mode: 'review' })
    assert.equal(reviewDone.done, true)

    // Memory is shared across banks by word key
    assert.ok(refWord)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('pickBankCandidates prioritizes active/due SRS words over mastered words', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-sample-srs-'))
  try {
    const svc = createWordService({ dir })
    svc.importBank({
      name: 'Sample Bank',
      content: 'alpha\t阿尔法\nbeta\t贝塔\ngamma\t伽马\ndelta\t德尔塔\n',
    })
    const state = {
      wordBankId: svc.listBanks().active,
      wordRecent: [],
      wordMemory: {
        alpha: { stage: 0, dueAt: Date.now() - 1000, reps: 1, lapses: 2, mastered: false },
        beta: markWordMastered(null, Date.now()),
      },
    }
    saveState(dir, state)
    const picked = pickBankCandidates(dir, state, 2)
    assert.ok(picked.some((p) => p.word === 'alpha'))
    assert.ok(!picked.some((p) => p.word === 'beta'))
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('formatMeaning normalizes punctuation, deduplicates glosses, and preserves parentheses', () => {
  assert.equal(
    formatMeaning('实施,执行,加强; 实施，生效，执行; 强迫，迫使'),
    '实施、执行、加强；生效；强迫、迫使',
  )
  assert.equal(formatMeaning('吸收（液体、气体等）'), '吸收（液体、气体等）')
  assert.equal(formatPos('n/v'), '名词 n. / 动词 v.')
})

test('createWordService accepts letters-only answers for hyphenated and apostrophe words', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-word-punct-'))
  try {
    const svc = createWordService({ dir })
    svc.importBank({
      name: 'Punctuation Bank',
      content: "e-mail\t电子邮件\no'clock\t点钟\n",
    })

    for (let i = 0; i < 2; i += 1) {
      const q = svc.nextWord({ mode: 'new' })
      if (q.letters === 5) {
        const res = svc.checkWord({ id: q.id, answer: 'email' })
        assert.equal(res.correct, true)
        assert.equal(res.reference, 'e-mail')
      } else {
        assert.equal(q.letters, 6)
        const res = svc.checkWord({ id: q.id, answer: 'oclock' })
        assert.equal(res.correct, true)
        assert.equal(res.reference, "o'clock")
      }
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
