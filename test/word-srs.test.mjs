import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  applyWordReview,
  computeRetrievability,
  ensureFsrsMemory,
  FSRS_RATING,
  inspectWordMemory,
  markWordMastered,
  MASTERY_STABILITY_DAYS,
  pickWordSrs,
  previewWordRatings,
  SHORT_TERM_MS,
  summarizeBankMemory,
} from '../src/features/word/srs.js'
import { createWordService } from '../src/features/word/service.js'
import { createSettingsService } from '../src/features/settings/service.js'
import { pickBankCandidates } from '../src/features/word/sample.js'
import { formatPos, formatMeaning } from '../src/client/core/text.js'
import { saveState } from '../src/core/store.js'

const DAY = 24 * 60 * 60 * 1000

test('applyWordReview handles FSRS-6 initial ratings, misses, retries, early consolidation, and auto-mastery', () => {
  const t0 = 1_700_000_000_000

  // Brand new word spelled cleanly -> monotonic Hard < Good < Easy intervals
  const firstHard = applyWordReview(null, { correct: true, clean: true, rating: FSRS_RATING.HARD, now: t0 })
  const firstGood = applyWordReview(null, { correct: true, clean: true, rating: FSRS_RATING.GOOD, now: t0 })
  const firstEasy = applyWordReview(null, { correct: true, clean: true, rating: FSRS_RATING.EASY, now: t0 })
  assert.equal(firstGood.mastered, false)
  assert.equal(firstGood.state, 'review')
  assert.equal(firstGood.rating, FSRS_RATING.GOOD)
  assert.ok(firstHard.nextIntervalMs < firstGood.nextIntervalMs)
  assert.ok(firstGood.nextIntervalMs < firstEasy.nextIntervalMs)
  assert.ok(firstGood.memory.stability > 0 && firstGood.memory.difficulty >= 1)

  // Missed word -> 5m consolidation and lapses = 1; retry miss does not double-count lapses
  const miss1 = applyWordReview(null, { correct: false, clean: false, countLapse: true, now: t0 })
  assert.equal(miss1.state, 'learning')
  assert.equal(miss1.memory.lapses, 1)
  assert.equal(miss1.nextIntervalMs, SHORT_TERM_MS)
  assert.equal(miss1.nextReviewText, '5 分钟后再次巩固')

  const missRetry = applyWordReview(miss1.memory, { correct: false, clean: false, countLapse: false, now: t0 + 5000 })
  assert.equal(missRetry.memory.lapses, 1)

  // Retry-after-miss spelled right (clean=false) stays in 5m consolidation
  const retryCorrect = applyWordReview(missRetry.memory, { correct: true, clean: false, now: t0 + 10_000 })
  assert.equal(retryCorrect.mastered, false)
  assert.equal(retryCorrect.nextIntervalMs, SHORT_TERM_MS)
  assert.equal(retryCorrect.nextReviewText, '5 分钟后再次巩固')

  // Early review during 5m consolidation preserves dueAt and marks early=true
  const earlyLearning = applyWordReview(retryCorrect.memory, { correct: true, clean: true, now: t0 + 60_000 })
  assert.equal(earlyLearning.early, true)
  assert.equal(earlyLearning.memory.dueAt, retryCorrect.memory.dueAt)
  assert.ok(earlyLearning.nextReviewText.startsWith('提前巩固 · 仍于 '))

  // Early clean review right after graduation keeps schedule unchanged, only incrementing reps
  const earlyClean = applyWordReview(firstGood.memory, { correct: true, clean: true, now: t0 + 60_000 })
  assert.equal(earlyClean.early, true)
  assert.equal(earlyClean.memory.dueAt, firstGood.memory.dueAt)
  assert.equal(earlyClean.memory.reps, firstGood.memory.reps + 1)

  // Early miss before dueAt enters relearning with 5m consolidation and increments lapses
  const earlyMiss = applyWordReview(firstGood.memory, { correct: false, clean: false, countLapse: true, now: t0 + 120_000 })
  assert.equal(earlyMiss.state, 'relearning')
  assert.equal(earlyMiss.memory.lapses, 1)
  assert.equal(earlyMiss.nextIntervalMs, SHORT_TERM_MS)

  // Lapse on a previously mastered word exits mastered and enters relearning
  const masteredMem = markWordMastered(firstGood.memory, t0)
  const masteredLapse = applyWordReview(masteredMem, { correct: false, clean: false, countLapse: true, now: t0 + 10 * DAY })
  assert.equal(masteredLapse.mastered, false)
  assert.equal(masteredLapse.state, 'relearning')
  assert.equal(masteredLapse.memory.lapses, 1)

  // Multi-step clean progression grows stability monotonically until auto-mastery (>= 90d)
  let mem = firstGood.memory
  let prevStability = mem.stability
  let guard = 0
  while (!mem.mastered && guard < 20) {
    const step = applyWordReview(mem, { correct: true, clean: true, rating: FSRS_RATING.GOOD, now: mem.dueAt })
    assert.ok(step.memory.stability > prevStability)
    prevStability = step.memory.stability
    mem = step.memory
    guard += 1
  }
  assert.equal(mem.mastered, true)
  assert.ok(mem.stability >= MASTERY_STABILITY_DAYS)
})

test('previewWordRatings matches applyWordReview intervals and respects requestRetention', () => {
  const t0 = 1_700_000_000_000
  const mem = applyWordReview(null, { correct: true, clean: true, rating: FSRS_RATING.GOOD, now: t0 }).memory
  const reviewAt = mem.dueAt

  const previews90 = previewWordRatings(mem, { now: reviewAt, requestRetention: 0.9 })
  assert.ok(previews90)
  for (const [k, r] of [
    ['hard', FSRS_RATING.HARD],
    ['good', FSRS_RATING.GOOD],
    ['easy', FSRS_RATING.EASY],
  ]) {
    const applied = applyWordReview(mem, { correct: true, clean: true, rating: r, now: reviewAt, requestRetention: 0.9 })
    assert.equal(previews90[k].intervalMs, applied.nextIntervalMs)
  }
  assert.ok(previews90.hard.intervalMs < previews90.good.intervalMs)
  assert.ok(previews90.good.intervalMs < previews90.easy.intervalMs)

  // Higher desired retention produces shorter (or equal) review intervals for the same card
  const good85 = applyWordReview(mem, { correct: true, clean: true, rating: FSRS_RATING.GOOD, now: reviewAt, requestRetention: 0.85 })
  const good95 = applyWordReview(mem, { correct: true, clean: true, rating: FSRS_RATING.GOOD, now: reviewAt, requestRetention: 0.95 })
  assert.ok(good95.nextIntervalMs < good85.nextIntervalMs)

  // Early consolidation and mastered words have null rating previews
  assert.equal(previewWordRatings(mem, { now: t0 + 60_000 }), null)
  assert.equal(previewWordRatings(markWordMastered(mem, t0), { now: reviewAt }), null)
})

test('ensureFsrsMemory lazily migrates legacy Ebbinghaus records without losing progress', () => {
  const t0 = 1_700_000_000_000
  const legacyReview = { stage: 4, dueAt: t0 + 2 * DAY, lastAt: t0, reps: 5, lapses: 1, mastered: false }
  const migrated = ensureFsrsMemory(legacyReview)
  assert.equal(migrated.state, 'review')
  assert.equal(migrated.dueAt, legacyReview.dueAt)
  assert.equal(migrated.reps, 5)
  assert.equal(migrated.lapses, 1)
  assert.equal(migrated.mastered, false)
  assert.equal(migrated.stability, 2)
  assert.ok(migrated.difficulty >= 1 && migrated.difficulty <= 10)

  const legacyMastered = ensureFsrsMemory({ stage: 9, dueAt: null, lastAt: t0, reps: 9, lapses: 0, mastered: true })
  assert.equal(legacyMastered.mastered, true)
  assert.ok(legacyMastered.stability >= MASTERY_STABILITY_DAYS)

  const info = inspectWordMemory(legacyReview, t0 + DAY)
  assert.ok(info.retrievability > 0 && info.retrievability <= 100)
  assert.ok(info.familiarity >= 1 && info.familiarity <= 5)
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
    alpha: { state: 'learning', stability: 0.212, difficulty: 6.4, dueAt: now - 1000, lastAt: now - 5000, reps: 1, lapses: 0, mastered: false },
    beta: { state: 'review', stability: 4, difficulty: 5.0, dueAt: now + 60_000, lastAt: now - 5000, reps: 2, lapses: 0, mastered: false },
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

test('pickWordSrs prioritizes short-term consolidation, then lowest retrievability R, and interleaves new words', () => {
  const now = 1_700_000_000_000
  const entries = [
    { word: 'high_r_due', meaning: '1' },
    { word: 'low_r_due', meaning: '2' },
    { word: 'short_due', meaning: '3' },
    { word: 'fresh_word', meaning: '4' },
  ]
  const wordMemory = {
    high_r_due: { state: 'review', stability: 10, difficulty: 4, lastAt: now - 11 * DAY, dueAt: now - 1000, reps: 4, lapses: 0, mastered: false },
    low_r_due: { state: 'review', stability: 2, difficulty: 6, lastAt: now - 8 * DAY, dueAt: now - 1000, reps: 3, lapses: 1, mastered: false },
    short_due: { state: 'relearning', stability: 0.212, difficulty: 7, lastAt: now - 600_000, dueAt: now - 10_000, reps: 2, lapses: 1, mastered: false },
  }

  // Short-term due word comes before review due words
  const p1 = pickWordSrs(entries, wordMemory, { mode: 'smart', reviewStreak: 0, now })
  assert.equal(p1.entry.word, 'short_due')
  assert.equal(p1.kind, 'review')
  assert.equal(p1.nextReviewStreak, 1)

  // Among review due words, lower retrievability R comes first
  const pLowR = pickWordSrs(entries, wordMemory, { mode: 'review', recent: ['short_due'], now })
  assert.equal(pLowR.entry.word, 'low_r_due')
  assert.ok(computeRetrievability(8, 2) < computeRetrievability(11, 10))

  // After 3 consecutive reviews, smart mode interleaves an unseen word
  const p2 = pickWordSrs(entries, wordMemory, { mode: 'smart', reviewStreak: 3, now })
  assert.equal(p2.entry.word, 'fresh_word')
  assert.equal(p2.kind, 'new')
  assert.equal(p2.nextReviewStreak, 0)

  // Explicit 'new' mode picks unseen word even when due words exist
  const pNew = pickWordSrs(entries, wordMemory, { mode: 'new', now })
  assert.equal(pNew.entry.word, 'fresh_word')
  assert.equal(pNew.kind, 'new')

  // Explicit 'review' mode returns done when nothing is due
  const pDone = pickWordSrs(
    entries,
    {
      high_r_due: { state: 'review', stability: 10, difficulty: 4, lastAt: now, dueAt: now + 100_000, reps: 3, lapses: 0, mastered: false },
      low_r_due: markWordMastered(null, now),
      short_due: markWordMastered(null, now),
    },
    { mode: 'review', now },
  )
  assert.equal(pDone.entry, null)
  assert.equal(pDone.kind, 'done')
  assert.equal(pDone.reason, 'no_due')
})

test('createWordService end-to-end FSRS flow, rateWord adjustment without double-counting, and markMastered', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-word-fsrs-'))
  try {
    const svc = createWordService({ dir })
    const custom = svc.importBank({
      name: 'Test Bank',
      content: 'compact\t紧凑的\nlatency\t延迟\n',
    })
    assert.equal(custom.ok, true)

    // First word: miss -> retry stays at 5m consolidation with canRate=false
    const w1 = svc.nextWord({ mode: 'new' })
    assert.ok(w1.id)
    assert.equal(w1.srs.kind, 'new')
    assert.equal(w1.srsStats.total, 2)

    const missRes = svc.checkWord({ id: w1.id, answer: 'xxxxxxx' })
    assert.equal(missRes.correct, false)
    assert.equal(missRes.srs.nextIntervalMs, SHORT_TERM_MS)
    assert.equal(missRes.srs.canRate, false)

    const retryOk = svc.checkWord({ id: w1.id, answer: missRes.reference })
    assert.equal(retryOk.correct, true)
    assert.equal(retryOk.srs.canRate, false)
    assert.equal(retryOk.srs.nextReviewText, '5 分钟后再次巩固')
    assert.equal(retryOk.srsStats.learning, 1)

    // Second word: clean recall -> defaults to Good with ratingPreviews, then rateWord adjusts to Easy without double-counting
    const w2 = svc.nextWord({ mode: 'new' })
    const answer2 = w2.letters === 7 ? (missRes.reference === 'compact' ? 'latency' : 'compact') : 'latency'
    const cleanOk = svc.checkWord({ id: w2.id, answer: answer2 })
    assert.equal(cleanOk.correct, true)
    assert.equal(cleanOk.srs.canRate, true)
    assert.equal(cleanOk.srs.rating, FSRS_RATING.GOOD)
    assert.ok(cleanOk.srs.ratingPreviews.easy.intervalMs > cleanOk.srs.ratingPreviews.good.intervalMs)

    // Duplicate checkWord on already-checked pending id rejects with 409
    assert.throws(() => svc.checkWord({ id: w2.id, answer: answer2 }), (err) => err && err.status === 409)

    // rateWord adjusts interval cleanly
    const ratedEasy = svc.rateWord({ id: w2.id, rating: FSRS_RATING.EASY })
    assert.equal(ratedEasy.ok, true)
    assert.equal(ratedEasy.body.srs.rating, FSRS_RATING.EASY)
    assert.equal(ratedEasy.body.srs.nextIntervalMs, cleanOk.srs.ratingPreviews.easy.intervalMs)

    const ratedHard = svc.rateWord({ id: w2.id, rating: 'hard' })
    assert.equal(ratedHard.ok, true)
    assert.equal(ratedHard.body.srs.rating, FSRS_RATING.HARD)
    assert.equal(ratedHard.body.srs.nextIntervalMs, cleanOk.srs.ratingPreviews.hard.intervalMs)

    // Invalid rating -> 400; unknown id -> 409
    assert.equal(svc.rateWord({ id: w2.id, rating: 99 }).status, 400)
    assert.equal(svc.rateWord({ id: 'missing-id', rating: 4 }).status, 409)

    // markMastered works even after checkWord kept pending for rating
    const masterRes = svc.markMastered({ id: w2.id })
    assert.equal(masterRes.ok, true)
    assert.equal(masterRes.body.srsStats.mastered, 1)
    assert.equal(masterRes.body.srsStats.learning, 1)

    // Review mode has 0 due right now
    const reviewDone = svc.nextWord({ mode: 'review' })
    assert.equal(reviewDone.done, true)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('createSettingsService persists fsrsRetention and clamps out-of-range values', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-fsrs-settings-'))
  try {
    const settingsSvc = createSettingsService({ dir, conf: { level: 'B1' } })
    const initial = settingsSvc.get()
    assert.equal(initial.settings.fsrsRetention, 0.9)
    assert.ok(Array.isArray(initial.retentions) && initial.retentions.length === 4)

    const updated = settingsSvc.update({ fsrsRetention: 0.95 })
    assert.equal(updated.settings.fsrsRetention, 0.95)

    const clampedHigh = settingsSvc.update({ fsrsRetention: 1.5 })
    assert.equal(clampedHigh.settings.fsrsRetention, 0.97)

    const clampedLow = settingsSvc.update({ fsrsRetention: 0.2 })
    assert.equal(clampedLow.settings.fsrsRetention, 0.75)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('pickBankCandidates prioritizes due and high-difficulty FSRS words over mastered words', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-sample-srs-'))
  try {
    const svc = createWordService({ dir })
    svc.importBank({
      name: 'Sample Bank',
      content: 'alpha\t阿尔法\nbeta\t贝塔\ngamma\t伽马\ndelta\t德尔塔\n',
    })
    const now = Date.now()
    const state = {
      wordBankId: svc.listBanks().active,
      wordRecent: [],
      wordMemory: {
        alpha: { state: 'relearning', stability: 0.25, difficulty: 8.2, lastAt: now - 10_000, dueAt: now - 1000, reps: 2, lapses: 2, mastered: false },
        beta: markWordMastered(null, now),
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
