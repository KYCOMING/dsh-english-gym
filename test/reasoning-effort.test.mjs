import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { completeText, selectSupportedEffort } from '../src/core/llm.js'
import { generateReport } from '../src/features/report/generate.js'
import {
  createSettingsService,
  normalizeReasoningEffort,
  REASONING_EFFORTS,
} from '../src/features/settings/service.js'
import { createReportService } from '../src/features/report/service.js'
import { createPhraseService } from '../src/features/phrase/service.js'
import { dayKey, saveReport } from '../src/core/store.js'
import { REPORT_SCHEMA } from '../src/features/report/structure.js'

test('normalizeReasoningEffort and createSettingsService manage reasoningEffort cleanly', () => {
  assert.equal(normalizeReasoningEffort('HIGH'), 'high')
  assert.equal(normalizeReasoningEffort(' medium '), 'medium')
  assert.equal(normalizeReasoningEffort('invalid', 'low'), 'low')
  assert.equal(normalizeReasoningEffort('', 'invalid'), 'off')
  assert.deepEqual(
    REASONING_EFFORTS.map((item) => item.id),
    ['off', 'low', 'medium', 'high', 'auto'],
  )

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-reasoning-settings-'))
  try {
    const svc = createSettingsService({ dir, conf: { level: 'B1', topic: 'AI and technology' } })
    const initial = svc.get()
    assert.equal(initial.settings.reasoningEffort, 'off')
    assert.equal(svc.getReasoningEffort(), 'off')
    assert.deepEqual(
      initial.reasoningEfforts.map((r) => r.id),
      ['off', 'low', 'medium', 'high', 'auto'],
    )

    for (const nextEffort of ['low', 'medium', 'high', 'auto', 'off']) {
      const updated = svc.update({ reasoningEffort: nextEffort })
      assert.equal(updated.settings.reasoningEffort, nextEffort)
      assert.equal(svc.getReasoningEffort(), nextEffort)
    }

    svc.update({ reasoningEffort: 'medium' })
    const invalid = svc.update({ reasoningEffort: 'ultra' })
    assert.equal(invalid.settings.reasoningEffort, 'medium')
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('selectSupportedEffort maps requested intensities across model capability sets', () => {
  assert.equal(selectSupportedEffort('off', ['off', 'low', 'medium', 'high']), 'off')
  assert.equal(selectSupportedEffort('medium', ['off', 'low', 'medium', 'high']), 'medium')

  // DeepSeek-style efforts: off | high | max
  assert.equal(selectSupportedEffort('off', ['off', 'high', 'max']), 'off')
  assert.equal(selectSupportedEffort('low', ['off', 'high', 'max']), 'high')
  assert.equal(selectSupportedEffort('medium', ['off', 'high', 'max']), 'high')
  assert.equal(selectSupportedEffort('high', ['off', 'high', 'max']), 'high')

  // Reasoning-only model without 'off'
  assert.equal(selectSupportedEffort('off', [{ id: 'minimal' }, { id: 'low' }, { id: 'high' }]), 'minimal')
  assert.equal(selectSupportedEffort('low', [{ id: 'minimal' }, { id: 'low' }, { id: 'high' }]), 'low')
  assert.equal(selectSupportedEffort('low', [{ id: 'minimal' }, { id: 'medium' }, { id: 'high' }]), 'minimal')
  assert.equal(selectSupportedEffort('medium', [{ id: 'low' }, { id: 'high' }]), 'low')

  assert.equal(selectSupportedEffort('off', []), undefined)
})

test('completeText resolves reasoningEffort with resolveModel and agentDefaultModel selection', async () => {
  const seenOptions = []

  // 1. No resolveModel -> passes explicit effort directly; 'auto' uses currentSelection().reasoningEffort
  const passthroughCtx = {
    get(name) {
      if (name === 'agentDefaultModel') {
        return {
          currentSelection: () => ({ provider: 'p1', model: 'm1', reasoningEffort: 'high' }),
        }
      }
      if (name === 'llm') {
        return {
          async *stream(opts) {
            seenOptions.push(opts)
            yield { type: 'text-delta', text: 'ok' }
            yield { type: 'finish', reason: { kind: 'stop' } }
          },
        }
      }
      return null
    },
  }
  await completeText(passthroughCtx, {}, { prompt: 'hi', reasoningEffort: 'off' })
  await completeText(passthroughCtx, {}, { prompt: 'hi', reasoningEffort: 'auto' })
  assert.equal(seenOptions[0].reasoningEffort, 'off')
  assert.equal(seenOptions[1].reasoningEffort, 'high')

  // 2. With resolveModel: maps to supported effort for thinking models, omits for explicit non-thinking ({ efforts: [] }), and passes through when reasoning is undeclared
  let resolveCalls = 0
  const capLlm = {
    async resolveModel(_provider, model) {
      resolveCalls += 1
      if (model === 'thinking-model') {
        return { reasoning: { efforts: [{ id: 'off' }, { id: 'high' }, { id: 'max' }] } }
      }
      if (model === 'plain-model') {
        return { reasoning: { efforts: [] } }
      }
      return { reasoning: undefined }
    },
    async *stream(opts) {
      seenOptions.push(opts)
      yield { type: 'text-delta', text: 'ok' }
      yield { type: 'finish', reason: { kind: 'stop' } }
    },
  }
  const capCtx = {
    get(name) {
      return name === 'llm' ? capLlm : null
    },
  }
  await completeText(capCtx, { provider: 'p', model: 'thinking-model' }, { prompt: 'hi', reasoningEffort: 'low' })
  await completeText(capCtx, { provider: 'p', model: 'thinking-model' }, { prompt: 'hi', reasoningEffort: 'off' })
  await completeText(capCtx, { provider: 'p', model: 'plain-model' }, { prompt: 'hi', reasoningEffort: 'off' })
  await completeText(capCtx, { provider: 'p', model: 'undeclared-model' }, { prompt: 'hi', reasoningEffort: 'off' })
  assert.equal(resolveCalls, 3) // thinking-model cached on 2nd call; undeclared-model not cached as empty
  assert.equal(seenOptions[2].reasoningEffort, 'high')
  assert.equal(seenOptions[3].reasoningEffort, 'off')
  assert.equal('reasoningEffort' in seenOptions[4], false)
  assert.equal(seenOptions[5].reasoningEffort, 'off')
})

test('createReportService and createPhraseService forward live reasoningEffort setting across all operations', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-reasoning-e2e-'))
  try {
    const captured = []
    const ctx = {
      get(name) {
        if (name !== 'llm') return null
        return {
          async *stream(opts) {
            captured.push({ purpose: opts.purpose || 'phrase', reasoningEffort: opts.reasoningEffort })
            let text = '{}'
            if (opts.purpose === 'english-gym-report') {
              text = JSON.stringify({
                title: 'Fast Test',
                summary_zh: '快速测试。',
                paragraphs: [['Compact models | run cleanly.']],
                highlights: [{ word: 'Compact', pos: 'adj', zh: '紧凑的' }],
              })
            } else if (opts.purpose === 'english-gym-report-enrich') {
              text = JSON.stringify({
                paragraphs: [{ gist_zh: '测试段意。', zh: ['紧凑模型运行流畅。'], core: [['Compact models', 'run cleanly']] }],
                questions: [{ zh: '紧凑模型运行流畅。', en: 'Compact models run cleanly.' }],
              })
            } else if (opts.purpose === 'english-gym-explain') {
              text = JSON.stringify({
                structure: '主谓结构。',
                points: [{ phrase: 'run cleanly', note: '稳定运行' }],
                nuance: '顺译即可。',
              })
            } else {
              const prompt = opts.messages[0].content[0].text
              text = prompt.includes('Learner answer:')
                ? JSON.stringify({ correct: true, score: 95, corrected: 'Keep latency low.', tip: '很好。', highlights: [] })
                : JSON.stringify({ zh: '保持低延迟。', en: 'Keep latency low.', hint: 'latency' })
            }
            yield { type: 'text-delta', text }
            yield { type: 'finish', reason: { kind: 'stop' } }
          },
        }
      },
    }

    const conf = { level: 'B1', topic: 'AI and technology', provider: 'mock', model: 'mock-model' }
    const settings = createSettingsService({ dir, conf })
    settings.update({ bankLink: false }) // default reasoningEffort is 'off'

    const reportSvc = createReportService({
      ctx,
      conf,
      dir,
      getTopic: () => settings.getTopic(),
      getReportLevel: () => settings.getReportLevel(),
      getReasoningEffort: () => settings.getReasoningEffort(),
    })
    const phraseSvc = createPhraseService({
      ctx,
      conf,
      dir,
      getTopic: () => settings.getTopic(),
      getReasoningEffort: () => settings.getReasoningEffort(),
    })

    const r1 = await reportSvc.getReport(true)
    await reportSvc.enrichReport({ date: r1.date, id: r1.id })

    // Switch reasoningEffort to 'high' and verify explain + phrase next/grade pick it up immediately
    settings.update({ reasoningEffort: 'high' })
    await reportSvc.explainSentence({
      date: r1.date,
      paragraphIndex: 0,
      sentenceIndex: 0,
      en: 'Compact models run cleanly.',
      zh: '紧凑模型运行流畅。',
      level: 'B1',
    })
    const card = await phraseSvc.nextQuestion({})
    await phraseSvc.checkAnswer({ id: card.id, answer: 'Keep latency very low.' })

    // Also verify explain on an existing schema v3 report works with updated effort
    saveReport(dir, dayKey(), {
      id: 'existing',
      date: dayKey(),
      level: 'B1',
      topic: 'AI and technology',
      schema: REPORT_SCHEMA,
      title: 'Existing',
      body: 'Simple test.',
      paragraphs: [{ gist_zh: '简短测试。', sentences: [{ en: 'Simple test.', zh: '简单测试。' }] }],
      highlights: [],
      questions: [],
    })

    assert.deepEqual(captured, [
      { purpose: 'english-gym-report', reasoningEffort: 'off' },
      { purpose: 'english-gym-report-enrich', reasoningEffort: 'off' },
      { purpose: 'english-gym-explain', reasoningEffort: 'high' },
      { purpose: 'english-gym', reasoningEffort: 'high' },
      { purpose: 'english-gym', reasoningEffort: 'high' },
    ])
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('completeText supports resolveModelInfo, retries without rejected reasoningEffort, and preserves generic errors', async () => {
  // 1. resolveModelInfo works and caches just like resolveModel
  let infoCalls = 0
  const seenInfo = []
  const infoLlm = {
    async resolveModelInfo() {
      infoCalls += 1
      return { reasoning: { efforts: ['off', 'high'] } }
    },
    async *stream(opts) {
      seenInfo.push(opts.reasoningEffort)
      yield { type: 'text-delta', text: 'ok' }
      yield { type: 'finish', reason: { kind: 'stop' } }
    },
  }
  const infoCtx = { get: (n) => (n === 'llm' ? infoLlm : null) }
  await completeText(infoCtx, { provider: 'p', model: 'm' }, { prompt: 'hi', reasoningEffort: 'low' })
  await completeText(infoCtx, { provider: 'p', model: 'm' }, { prompt: 'hi', reasoningEffort: 'off' })
  assert.equal(infoCalls, 1)
  assert.deepEqual(seenInfo, ['high', 'off'])

  // 2. When llm.stream rejects reasoningEffort (e.g. 400 unsupported), retries once without it and caches rejection
  const attempts = []
  const rejectingLlm = {
    async *stream(opts) {
      attempts.push({ reasoningEffort: opts.reasoningEffort, maxTokens: opts.maxTokens })
      if (opts.reasoningEffort) {
        throw new Error('400 unsupported parameter: reasoningEffort')
      }
      yield { type: 'text-delta', text: 'recovered' }
      yield { type: 'finish', reason: { kind: 'stop' } }
    },
  }
  const rejectingCtx = { get: (n) => (n === 'llm' ? rejectingLlm : null) }
  const first = await completeText(rejectingCtx, { provider: 'p', model: 'm-strict' }, { prompt: 'hi', reasoningEffort: 'off' })
  assert.equal(first, 'recovered')
  assert.equal(attempts.length, 2)
  assert.equal(attempts[0].reasoningEffort, 'off')
  assert.equal(attempts[1].reasoningEffort, undefined)
  assert.ok(attempts[1].maxTokens >= 4096)

  // Subsequent call skips rejected reasoningEffort immediately (only 1 attempt)
  const second = await completeText(rejectingCtx, { provider: 'p', model: 'm-strict' }, { prompt: 'hi', reasoningEffort: 'off' })
  assert.equal(second, 'recovered')
  assert.equal(attempts.length, 3)

  // 3. Generic network error does NOT trigger a retry
  let netCalls = 0
  const netCtx = {
    get: (n) =>
      n === 'llm'
        ? {
            async *stream() {
              netCalls += 1
              throw new Error('temporary network outage')
            },
          }
        : null,
  }
  await assert.rejects(
    () => completeText(netCtx, { provider: 'p', model: 'm' }, { prompt: 'hi', reasoningEffort: 'off' }),
    /temporary network outage/,
  )
  assert.equal(netCalls, 1)

  // 4. generateReport attaches fallbackReason on failure
  const fbReport = await generateReport(netCtx, { provider: 'p', model: 'm', level: 'B1' }, { reasoningEffort: 'off' })
  assert.equal(fbReport.fallback, true)
  assert.match(fbReport.fallbackReason, /temporary network outage/)

  // 5. Idle timer resets on every streamed chunk so active slow streams do not time out prematurely
  const slowStreamCtx = {
    get: (n) =>
      n === 'llm'
        ? {
            async *stream() {
              for (const part of ['a', 'b', 'c', 'd']) {
                await new Promise((r) => setTimeout(r, 20))
                yield { type: 'text-delta', text: part }
              }
              yield { type: 'finish', reason: { kind: 'stop' } }
            },
          }
        : null,
  }
  const streamed = await completeText(slowStreamCtx, { provider: 'p', model: 'm' }, { prompt: 'hi', timeoutMs: 40 })
  assert.equal(streamed, 'abcd')
})
