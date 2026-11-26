import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { explainReportSentence, normalizeExplanation } from '../src/features/report/explain.js'
import { createReportService } from '../src/features/report/service.js'
import { createSettingsService } from '../src/features/settings/service.js'
import { dayKey, loadReport, saveReport } from '../src/core/store.js'
import { REPORT_SCHEMA } from '../src/features/report/structure.js'

test('normalizeExplanation validates Chinese fields, caps points, and rejects empty/non-Chinese output', () => {
  assert.equal(normalizeExplanation(null), null)
  assert.equal(normalizeExplanation({ structure: 'only english', points: [{ phrase: 'foo', note: 'english only' }], nuance: 'none' }), null)

  const normalized = normalizeExplanation({
    structure: '  主句为 Compact models run locally，后接 which 非限制性定语从句。  ',
    points: [
      { phrase: 'run locally', note: '表示在本地设备运行' },
      { phrase: 'bad', note: 'english only note' },
      { phrase: 'burning through', note: '引申为迅速消耗（预算）' },
      { phrase: 'p3', note: '点拨三' },
      { phrase: 'p4', note: '点拨四' },
      { phrase: 'p5', note: '点拨五（超出上限应被截断）' },
    ],
    nuance: '中文将定语从句拆为独立短句更自然。',
  })
  assert.equal(normalized.structure, '主句为 Compact models run locally，后接 which 非限制性定语从句。')
  assert.equal(normalized.points.length, 4)
  assert.equal(normalized.points[0].phrase, 'run locally')
  assert.equal(normalized.nuance, '中文将定语从句拆为独立短句更自然。')
})

test('explainReportSentence parses model JSON and throws on unparseable output', async () => {
  const goodCtx = {
    get(name) {
      if (name !== 'llm') return null
      return {
        async *stream() {
          yield {
            type: 'text-delta',
            text: '```json\n{"structure":"主干是 Small models are fast。","points":[{"phrase":"everyday tasks","note":"日常任务"}],"nuance":"顺译即可。"}\n```',
          }
          yield { type: 'finish', reason: { kind: 'stop' } }
        },
      }
    },
  }
  const conf = { level: 'B1', provider: 'mock', model: 'mock-model' }
  const out = await explainReportSentence(goodCtx, conf, {
    en: 'Small models are fast for everyday tasks.',
    zh: '小模型处理日常任务很快。',
    level: 'B1',
  })
  assert.equal(out.structure, '主干是 Small models are fast。')
  assert.equal(out.points.length, 1)
  assert.equal(out.nuance, '顺译即可。')

  const badCtx = {
    get(name) {
      if (name !== 'llm') return null
      return {
        async *stream() {
          yield { type: 'text-delta', text: 'not json at all' }
          yield { type: 'finish', reason: { kind: 'stop' } }
        },
      }
    },
  }
  await assert.rejects(
    () => explainReportSentence(badCtx, conf, { en: 'Small models are fast.' }),
    /讲解解析失败/,
  )
})

test('createReportService.explainSentence caches explanation onto today report and rejects missing en', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-report-explain-'))
  try {
    let calls = 0
    const mockCtx = {
      get(name) {
        if (name !== 'llm') return null
        return {
          async *stream() {
            calls += 1
            yield {
              type: 'text-delta',
              text: JSON.stringify({
                structure: '主句 + which 引导的非限制性定语从句。',
                points: [{ phrase: 'keeps private data close', note: 'keep + 宾语 + 宾补表示“让……保持在……”' }],
                nuance: '把 which 从句顺译为“让私密数据留在用户身边”。',
              }),
            }
            yield { type: 'finish', reason: { kind: 'stop' } }
          },
        }
      },
    }

    const conf = { level: 'B1', topic: 'AI and technology', provider: 'mock', model: 'mock-model' }
    const settings = createSettingsService({ dir, conf })
    const reportSvc = createReportService({
      ctx: mockCtx,
      conf,
      dir,
      getTopic: () => settings.getTopic(),
      getReportLevel: () => settings.getReportLevel(),
    })

    await assert.rejects(() => reportSvc.explainSentence({ en: '   ' }), (err) => err && err.status === 400)

    const day = dayKey()
    const sentenceEn = 'A compact model can run on a laptop, which keeps private data close.'
    const sentenceZh = '紧凑模型可以在笔记本上运行，从而让私密数据留在本地。'
    saveReport(dir, day, {
      date: day,
      level: 'B1',
      topic: 'AI and technology',
      schema: REPORT_SCHEMA,
      title: 'Local Models',
      body: sentenceEn,
      paragraphs: [
        {
          gist_zh: '本地模型更私密。',
          sentences: [{ en: sentenceEn, zh: sentenceZh }],
        },
      ],
      highlights: [],
      questions: [],
    })

    const first = await reportSvc.explainSentence({
      date: day,
      paragraphIndex: 0,
      sentenceIndex: 0,
      en: sentenceEn,
      zh: sentenceZh,
      context: sentenceEn,
      level: 'B1',
    })
    assert.equal(first.cached, false)
    assert.equal(calls, 1)
    assert.equal(first.explain.structure, '主句 + which 引导的非限制性定语从句。')

    const persisted = loadReport(dir, day)
    assert.deepEqual(persisted.paragraphs[0].sentences[0].explain, first.explain)

    const second = await reportSvc.explainSentence({
      date: day,
      paragraphIndex: 0,
      sentenceIndex: 0,
      en: sentenceEn,
      zh: sentenceZh,
      level: 'B1',
    })
    assert.equal(second.cached, true)
    assert.equal(calls, 1)
    assert.deepEqual(second.explain, first.explain)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
