import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { completeText } from '../src/core/llm.js'
import { createPhraseService } from '../src/features/phrase/service.js'
import { createReportService } from '../src/features/report/service.js'
import { generateReport } from '../src/features/report/generate.js'
import { createSettingsService } from '../src/features/settings/service.js'
import { createWordService } from '../src/features/word/service.js'
import { markWordMastered, pickWordSrs } from '../src/features/word/srs.js'
import { executeCleanup, previewCleanup } from '../src/features/activity/cleanup.js'
import { loadState, saveState } from '../src/core/store.js'

test('completeText times out when llm.stream hangs ignoring AbortSignal and releases inflight lock', async () => {
  const hangingCtx = {
    get(name) {
      if (name === 'llm') {
        return {
          stream() {
            return {
              [Symbol.asyncIterator]() {
                return {
                  next() {
                    return new Promise(() => {})
                  },
                }
              },
            }
          },
        }
      }
      return null
    },
  }
  const conf = { provider: 'mock', model: 'mock-model', level: 'B1', topic: 'AI and technology' }
  await assert.rejects(
    () => completeText(hangingCtx, conf, { prompt: 'hi', timeoutMs: 30 }),
    /timed out/,
  )

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-inflight-recover-'))
  try {
    let call = 0
    const ctx = {
      get(name) {
        if (name === 'llm') {
          return {
            async *stream() {
              call += 1
              if (call === 1) {
                throw new Error('upstream hang')
              }
              yield {
                type: 'text-delta',
                text: JSON.stringify({
                  title: 'Recovered Report',
                  paragraphs: [
                    {
                      gist_zh: '恢复正常生成。',
                      sentences: [
                        { en: 'The service recovered cleanly after a transient failure.', zh: '服务在短暂故障后顺利恢复。' },
                      ],
                    },
                  ],
                  summary_zh: '服务恢复正常。',
                  highlights: [],
                  questions: [],
                }),
              }
              yield { type: 'finish', reason: { kind: 'stop' } }
            },
          }
        }
        return null
      },
    }
    createSettingsService({ dir, conf }).update({ bankLink: false })
    const reportSvc = createReportService({ ctx, conf, dir })
    const r1 = await reportSvc.getReport(true)
    assert.equal(r1.fallback, true)
    const r2 = await reportSvc.getReport(false)
    assert.equal(r2.fallback, undefined)
    assert.equal(r2.title, 'Recovered Report')
    assert.equal(call, 2)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('createPhraseService and createReportService preserve best non-fallback result across retries', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-retry-best-'))
  try {
    const conf = { provider: 'mock', model: 'mock-model', level: 'B1', topic: 'finance and economy' }
    const wordSvc = createWordService({ dir })
    wordSvc.importBank({ name: 'Retry Bank', content: 'compact\t紧凑的\nlatency\t延迟\n' })
    createSettingsService({ dir, conf }).update({ bankLink: true, bankRetries: 2, topicId: 'finance' })

    // Phrase service: attempt 1 succeeds (0 bank words), attempt 2 fails -> keep attempt 1 instead of fallback
    let phraseCall = 0
    const phraseCtx = {
      get(name) {
        if (name === 'llm') {
          return {
            async *stream() {
              phraseCall += 1
              if (phraseCall === 1) {
                yield {
                  type: 'text-delta',
                  text: JSON.stringify({ zh: '公司调整了季度预算。', en: 'The company adjusted its quarterly budget.', hint: 'quarterly budget' }),
                }
                yield { type: 'finish', reason: { kind: 'stop' } }
                return
              }
              throw new Error('transient error')
            },
          }
        }
        return null
      },
    }
    const phraseSvc = createPhraseService({ ctx: phraseCtx, conf, dir, getTopic: () => 'finance and economy' })
    const card = await phraseSvc.nextQuestion({})
    assert.equal(card.source, 'topic')
    assert.equal(card.zh, '公司调整了季度预算。')
    assert.equal(phraseCall, 2)

    // Report service: attempt 1 has 1 bank word, attempt 2 has 0 bank words, attempt 3 fails -> keep attempt 1
    let reportCall = 0
    const reportCtx = {
      get(name) {
        if (name === 'llm') {
          return {
            async *stream() {
              reportCall += 1
              if (reportCall === 1) {
                yield {
                  type: 'text-delta',
                  text: JSON.stringify({
                    title: 'Budget Compact Report',
                    paragraphs: [
                      {
                        gist_zh: '紧凑预算方案。',
                        sentences: [
                          { en: 'Finance teams prefer a compact reporting process.', zh: '财务团队更喜欢紧凑的报告流程。' },
                        ],
                      },
                    ],
                    summary_zh: '关于紧凑预算。',
                    highlights: [],
                    questions: [{ zh: '团队偏好紧凑流程。', en: 'Teams prefer a compact process.' }],
                  }),
                }
                yield { type: 'finish', reason: { kind: 'stop' } }
                return
              }
              if (reportCall === 2) {
                yield {
                  type: 'text-delta',
                  text: JSON.stringify({
                    title: 'Zero Hit Report',
                    paragraphs: [
                      {
                        gist_zh: '无命中词。',
                        sentences: [{ en: 'Markets respond calmly to steady interest rates.', zh: '市场对稳定的利率反应平静。' }],
                      },
                    ],
                    summary_zh: '市场平稳。',
                    highlights: [],
                    questions: [],
                  }),
                }
                yield { type: 'finish', reason: { kind: 'stop' } }
                return
              }
              throw new Error('transient error')
            },
          }
        }
        return null
      },
    }
    const reportSvc = createReportService({ ctx: reportCtx, conf, dir, getTopic: () => 'finance and economy' })
    const report = await reportSvc.getReport(true)
    assert.equal(report.fallback, undefined)
    assert.equal(report.title, 'Budget Compact Report')
    assert.deepEqual(report.bankWords, ['compact'])
    assert.equal(reportCall, 3)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('generateReport returns empty questions when LLM omits questions on a normal report', async () => {
  const ctx = {
    get(name) {
      if (name === 'llm') {
        return {
          async *stream() {
            yield {
              type: 'text-delta',
              text: JSON.stringify({
                title: 'Healthy Morning Habits',
                paragraphs: [
                  {
                    gist_zh: '晨间习惯有助于专注。',
                    sentences: [{ en: 'A short morning walk improves focus.', zh: '清晨短途散步能提高专注力。' }],
                  },
                ],
                summary_zh: '晨间散步好处多。',
                highlights: [],
                questions: [],
              }),
            }
            yield { type: 'finish', reason: { kind: 'stop' } }
          },
        }
      }
      return null
    },
  }
  const report = await generateReport(ctx, { provider: 'mock', model: 'mock', level: 'B1' }, { topic: 'health and everyday life' })
  assert.equal(report.fallback, undefined)
  assert.deepEqual(report.questions, [])
})

test('pickWordSrs rotates cleanly across 2-word and 3-word due pools without getting stuck', () => {
  const now = 1_700_000_000_000
  const twoEntries = [
    { word: 'alpha', meaning: 'a' },
    { word: 'beta', meaning: 'b' },
  ]
  const twoMem = {
    alpha: { stage: 0, dueAt: now - 20_000, reps: 1, lapses: 1, mastered: false },
    beta: { stage: 0, dueAt: now - 10_000, reps: 1, lapses: 1, mastered: false },
  }
  let recent = []
  const seq2 = []
  for (let i = 0; i < 6; i += 1) {
    const pick = pickWordSrs(twoEntries, twoMem, { mode: 'review', recent, now })
    seq2.push(pick.entry.word)
    recent.push(pick.entry.word)
  }
  assert.deepEqual(seq2, ['alpha', 'beta', 'alpha', 'beta', 'alpha', 'beta'])

  const threeEntries = [
    { word: 'alpha', meaning: 'a' },
    { word: 'beta', meaning: 'b' },
    { word: 'gamma', meaning: 'c' },
  ]
  const threeMem = {
    alpha: { stage: 0, dueAt: now - 30_000, reps: 1, lapses: 1, mastered: false },
    beta: { stage: 0, dueAt: now - 20_000, reps: 1, lapses: 1, mastered: false },
    gamma: { stage: 0, dueAt: now - 10_000, reps: 1, lapses: 1, mastered: false },
  }
  recent = []
  const seq3 = []
  for (let i = 0; i < 6; i += 1) {
    const pick = pickWordSrs(threeEntries, threeMem, { mode: 'review', recent, now })
    seq3.push(pick.entry.word)
    recent.push(pick.entry.word)
  }
  assert.deepEqual(seq3, ['alpha', 'beta', 'gamma', 'alpha', 'beta', 'gamma'])
})

test('cleanup rejects invalid ranges with 400, protects mastered words on partial ranges, and syncs totals', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-cleanup-safe-'))
  try {
    assert.throws(() => previewCleanup(dir, {}), (err) => err && err.status === 400)
    assert.throws(() => previewCleanup(dir, { range: 'bogus' }), (err) => err && err.status === 400)
    assert.throws(() => executeCleanup(dir, { range: '' }), (err) => err && err.status === 400)

    const now = new Date('2026-11-25T15:00:00')
    const state = loadState(dir)
    state.totals = { answered: 7, correct: 5 }
    state.word = { answered: 5, correct: 4 }
    state.daily = {
      '2026-09-01': { answered: 3, correct: 2 },
      '2026-11-24': { answered: 4, correct: 3 },
    }
    state.log = {
      '2026-09-01': {
        words: [
          { en: 'old1', zh: '1', ok: true },
          { en: 'old2', zh: '2', ok: false },
        ],
        phrases: [],
      },
      '2026-11-24': {
        words: [
          { en: 'new1', zh: '1', ok: true },
          { en: 'new2', zh: '2', ok: true },
          { en: 'new3', zh: '3', ok: true },
        ],
        phrases: [],
      },
    }
    state.wordMemory = {
      oldlearning: { stage: 1, dueAt: 1, lastAt: new Date('2026-09-01T10:00:00').getTime(), reps: 1, lapses: 0, mastered: false },
      oldmastered: markWordMastered(null, new Date('2026-09-01T10:00:00').getTime()),
    }
    saveState(dir, state)

    const preview = previewCleanup(dir, { range: '30d', clearMemory: true, now })
    assert.equal(preview.memoryWords, 1)

    const resPartial = executeCleanup(dir, { range: '30d', clearMemory: true, now })
    assert.equal(resPartial.removed.memoryWords, 1)

    const afterPartial = loadState(dir)
    assert.ok(!afterPartial.wordMemory.oldlearning)
    assert.ok(afterPartial.wordMemory.oldmastered)
    assert.deepEqual(afterPartial.totals, { answered: 4, correct: 3 })
    assert.deepEqual(afterPartial.word, { answered: 3, correct: 3 })

    const resAll = executeCleanup(dir, { range: 'all', clearMemory: true, now })
    assert.equal(resAll.removed.memoryWords, 1)
    assert.deepEqual(loadState(dir).wordMemory, {})
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
