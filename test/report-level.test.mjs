import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createSettingsService, normalizeReportLevel, REPORT_LEVELS } from '../src/features/settings/service.js'
import { createReportService } from '../src/features/report/service.js'
import { dayKey, loadReport } from '../src/core/store.js'

test('normalizeReportLevel normalizes case, rejects invalid levels, and respects fallback', () => {
  assert.equal(normalizeReportLevel('c1'), 'C1')
  assert.equal(normalizeReportLevel(' a2 '), 'A2')
  assert.equal(normalizeReportLevel('invalid', 'b2'), 'B2')
  assert.equal(normalizeReportLevel('', 'invalid'), 'B1')
  assert.equal(REPORT_LEVELS.length, 6)
})

test('createSettingsService persists reportLevel, respects conf.level default, and exposes levels', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-settings-level-'))
  try {
    const svc = createSettingsService({ dir, conf: { level: 'B2', topic: 'AI and technology' } })
    const initial = svc.get()
    assert.equal(initial.settings.reportLevel, 'B2')
    assert.equal(svc.getReportLevel(), 'B2')
    assert.deepEqual(
      initial.levels.map((l) => l.id),
      ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    )
    assert.ok(initial.levels.every((l) => typeof l.detail === 'string' && l.detail.trim().length > 0))

    const updated = svc.update({ reportLevel: 'c1' })
    assert.equal(updated.settings.reportLevel, 'C1')
    assert.equal(svc.getReportLevel(), 'C1')

    // Invalid value does not overwrite valid persisted level.
    const unchanged = svc.update({ reportLevel: 'Z9' })
    assert.equal(unchanged.settings.reportLevel, 'C1')
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('createReportService reuses cached report when level matches and regenerates when level changes', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-report-level-'))
  try {
    let calls = 0
    const mockCtx = {
      get(name) {
        if (name === 'llm') {
          return {
            async *stream(opts) {
              calls += 1
              const userText = opts.messages[0].content[0].text
              const m = userText.match(/CEFR ([A-C][12])/)
              const lvl = m ? m[1] : 'B1'
              const payload = JSON.stringify({
                title: `Article for ${lvl}`,
                body: `This is paragraph one for ${lvl}. It includes compact models.\n\nParagraph two keeps latency low.\n\nParagraph three closes cleanly.`,
                summary_zh: `摘要 ${lvl}`,
                highlights: [{ word: 'compact', pos: 'adj', zh: '紧凑的' }],
                questions: [{ zh: '第一句。', en: 'First sentence.' }],
              })
              yield { type: 'text-delta', text: payload }
              yield { type: 'finish', reason: { kind: 'stop' } }
            },
          }
        }
        return null
      },
    }

    const conf = { level: 'B1', topic: 'AI and technology', provider: 'mock', model: 'mock-model' }
    const settings = createSettingsService({ dir, conf })
    settings.update({ bankLink: false })
    const reportSvc = createReportService({
      ctx: mockCtx,
      conf,
      dir,
      getTopic: () => settings.getTopic(),
      getReportLevel: () => settings.getReportLevel(),
    })

    const first = await reportSvc.getReport(false)
    assert.equal(first.level, 'B1')
    assert.equal(calls, 1)

    // Same level -> cached hit, no new LLM call.
    const second = await reportSvc.getReport(false)
    assert.equal(second.level, 'B1')
    assert.equal(calls, 1)

    // Changing level -> regenerates with the new level.
    settings.update({ reportLevel: 'C1' })
    const third = await reportSvc.getReport(false)
    assert.equal(third.level, 'C1')
    assert.equal(third.title, 'Article for C1')
    assert.equal(calls, 2)

    // Same level & same topic -> reuses cache; changing topic -> regenerates cleanly.
    const sameTopic = await reportSvc.getReport(false)
    assert.equal(sameTopic.title, 'Article for C1')
    assert.equal(calls, 2)

    settings.update({ topicId: 'science' })
    const newTopic = await reportSvc.getReport(false)
    assert.equal(newTopic.topic, 'science and discovery')
    assert.equal(calls, 3)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('createReportService does not cache fallback report on LLM failure and retries cleanly on recovery', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-report-fallback-'))
  try {
    let available = false
    let calls = 0
    const mockCtx = {
      get(name) {
        if (name === 'llm') {
          return {
            async *stream() {
              calls += 1
              if (!available) throw new Error('temporary network outage')
              const payload = JSON.stringify({
                title: 'Recovered Article',
                body: 'Recovered body text.\n\nSecond paragraph.\n\nThird paragraph.',
                summary_zh: '恢复成功',
                highlights: [],
                questions: [{ zh: '测试句子。', en: 'Test sentence.' }],
              })
              yield { type: 'text-delta', text: payload }
              yield { type: 'finish', reason: { kind: 'stop' } }
            },
          }
        }
        return null
      },
    }
    const conf = { level: 'B1', topic: 'AI and technology', provider: 'mock', model: 'mock-model' }
    const settings = createSettingsService({ dir, conf })
    settings.update({ bankLink: false })
    const reportSvc = createReportService({
      ctx: mockCtx,
      conf,
      dir,
      getTopic: () => settings.getTopic(),
      getReportLevel: () => settings.getReportLevel(),
    })

    const fb = await reportSvc.getReport(false)
    assert.equal(fb.fallback, true)
    assert.equal(calls, 1)
    assert.equal(fs.existsSync(path.join(dir, 'reports')), false)
    assert.equal(loadReport(dir, dayKey()), null)

    available = true
    const real = await reportSvc.getReport(false)
    assert.ok(!real.fallback)
    assert.equal(real.title, 'Recovered Article')
    assert.equal(calls, 2)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
