import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { extractJson } from '../src/core/llm.js'
import { parseDelimitedSentence, normalizeReportParagraphs, joinParagraphs } from '../src/features/report/structure.js'
import { formatCompactCandidateList, usedBankWords } from '../src/features/word/sample.js'
import { generateReport } from '../src/features/report/generate.js'
import { enrichReportContent, mergeReportEnrichment } from '../src/features/report/enrich.js'
import { createReportService } from '../src/features/report/service.js'
import { createSettingsService } from '../src/features/settings/service.js'
import { createWordService } from '../src/features/word/service.js'
import { dayKey, loadReport } from '../src/core/store.js'
import { createEnglishGym } from '../src/host/plugin.js'

const MOCK_CONF = { level: 'B1', topic: 'AI and technology', provider: 'mock', model: 'mock-model' }

test('parseDelimitedSentence and normalizeReportParagraphs parse compact 2D |-delimited sentences', () => {
  assert.deepEqual(
    parseDelimitedSentence('Compact models | can run locally , | without high latency .'),
    {
      en: 'Compact models can run locally, without high latency.',
      chunks: ['Compact models', 'can run locally,', 'without high latency.'],
    },
  )

  assert.deepEqual(parseDelimitedSentence('Short sentence.'), {
    en: 'Short sentence.',
    chunks: [],
  })

  // Leading bare punctuation after a delimiter is rejected cleanly by normalizeChunks, while `en` stays intact.
  assert.deepEqual(parseDelimitedSentence('Compact models | , locally.'), {
    en: 'Compact models, locally.',
    chunks: [],
  })

  const paragraphs = normalizeReportParagraphs([
    ['Compact models | run on laptops.', 'They stay fast.'],
    ['Teams | build smarter tools | every week.'],
  ])
  assert.deepEqual(paragraphs, [
    {
      gist_zh: '',
      sentences: [
        { en: 'Compact models run on laptops.', zh: '', chunks: ['Compact models', 'run on laptops.'] },
        { en: 'They stay fast.', zh: '' },
      ],
    },
    {
      gist_zh: '',
      sentences: [
        {
          en: 'Teams build smarter tools every week.',
          zh: '',
          chunks: ['Teams', 'build smarter tools', 'every week.'],
        },
      ],
    },
  ])
  assert.equal(
    joinParagraphs(paragraphs),
    'Compact models run on laptops. They stay fast.\n\nTeams build smarter tools every week.',
  )
})

test('usedBankWords matches regular inflections, fromBank highlight lemmas, and avoids short false positives', () => {
  const candidates = [
    { word: 'accelerate', pos: 'v', meaning: '加速' },
    { word: 'study', pos: 'v', meaning: '研究' },
    { word: 'plan', pos: 'v', meaning: '计划' },
    { word: 'box', pos: 'n', meaning: '盒子' },
    { word: 'build', pos: 'v', meaning: '构建' },
    { word: 'car', pos: 'n', meaning: '汽车' },
  ]
  const text =
    'Teams are accelerating releases after they studied logs and planned shipments in small boxes. ' +
    'They built a reliable workflow and cared about latency.'
  const highlights = [{ word: 'built', lemma: 'build', pos: 'v', zh: '构建', fromBank: true }]

  assert.deepEqual(usedBankWords(text, candidates, highlights), [
    'accelerate',
    'study',
    'plan',
    'box',
    'build',
  ])
  assert.equal(formatCompactCandidateList(candidates.slice(0, 2)), 'accelerate (v), study (v)')
})

test('generateReport Phase 1 compact format returns id, enriched: false, parsed chunks, highlights, and inflected bankWords', async () => {
  const ctx = {
    get(name) {
      if (name !== 'llm') return null
      return {
        async *stream() {
          yield {
            type: 'text-delta',
            text: JSON.stringify({
              title: 'Small Models Accelerate Work',
              summary_zh: '小模型加速日常工作流。',
              paragraphs: [
                ['Compact models | are accelerating local tools.', 'Setup is simple.'],
                ['Engineers | have built reliable helpers | for daily review.'],
              ],
              highlights: [
                { word: 'accelerating', lemma: 'accelerate', pos: 'v', zh: '加速' },
                { word: 'built', lemma: 'build', pos: 'v', zh: '构建' },
                { word: 'reliable', pos: 'adj', zh: '可靠的' },
              ],
            }),
          }
          yield { type: 'finish', reason: { kind: 'stop' } }
        },
      }
    },
  }

  const words = [
    { word: 'accelerate', pos: 'v', meaning: '加速' },
    { word: 'build', pos: 'v', meaning: '构建' },
  ]
  const report = await generateReport(ctx, MOCK_CONF, { level: 'B1', date: '2026-11-27', words })
  assert.equal(report.fallback, undefined)
  assert.ok(typeof report.id === 'string' && report.id.length > 0)
  assert.equal(report.enriched, false)
  assert.equal(report.body, 'Compact models are accelerating local tools. Setup is simple.\n\nEngineers have built reliable helpers for daily review.')
  assert.deepEqual(report.paragraphs[0].sentences[0].chunks, ['Compact models', 'are accelerating local tools.'])
  assert.equal(report.paragraphs[0].sentences[1].chunks, undefined)
  assert.deepEqual(report.bankWords, ['accelerate', 'build'])
  assert.deepEqual(
    report.highlights.map((h) => h.word),
    ['accelerating', 'built', 'reliable'],
  )
  assert.deepEqual(report.questions, [])
})

test('mergeReportEnrichment and enrichReportContent merge gists, translations, cores, and questions while preserving chunks and explain', async () => {
  const phase1 = {
    id: 'rep-1',
    enriched: false,
    date: '2026-11-27',
    level: 'B1',
    title: 'Small Models Accelerate Work',
    body: 'Compact models are accelerating local tools. Setup is simple.',
    paragraphs: [
      {
        gist_zh: '',
        sentences: [
          {
            en: 'Compact models are accelerating local tools.',
            zh: '',
            chunks: ['Compact models', 'are accelerating local tools.'],
            explain: { structure: '主谓宾结构', points: [], nuance: '自然直译' },
          },
          { en: 'Setup is simple.', zh: '' },
        ],
      },
    ],
    highlights: [],
    questions: [],
  }

  const { report: manual } = mergeReportEnrichment(phase1, {
    paragraphs: [
      {
        gist_zh: '紧凑模型加速本地工具。',
        zh: ['紧凑模型正在加速本地工具。', '配置很简单。'],
        core: [['Compact models', 'are accelerating local tools'], null],
      },
    ],
    questions: [{ zh: '配置很简单。', en: 'Setup is simple.' }],
  })
  assert.equal(manual.enriched, true)
  assert.equal(manual.paragraphs[0].gist_zh, '紧凑模型加速本地工具。')
  assert.equal(manual.paragraphs[0].sentences[0].zh, '紧凑模型正在加速本地工具。')
  assert.deepEqual(manual.paragraphs[0].sentences[0].chunks, ['Compact models', 'are accelerating local tools.'])
  assert.deepEqual(manual.paragraphs[0].sentences[0].core, ['Compact models', 'are accelerating local tools'])
  assert.equal(manual.paragraphs[0].sentences[0].explain.structure, '主谓宾结构')
  assert.equal(manual.paragraphs[0].sentences[1].zh, '配置很简单。')
  assert.equal(manual.paragraphs[0].sentences[1].core, undefined)
  assert.deepEqual(manual.questions, [{ zh: '配置很简单。', en: 'Setup is simple.' }])

  const ctx = {
    get(name) {
      if (name !== 'llm') return null
      return {
        async *stream() {
          yield {
            type: 'text-delta',
            text: JSON.stringify({
              paragraphs: [
                {
                  gist_zh: '紧凑模型加速本地工具。',
                  zh: ['紧凑模型正在加速本地工具。', '配置很简单。'],
                  core: [['Compact models', 'are accelerating'], null],
                },
              ],
              questions: [{ zh: '紧凑模型正在加速本地工具。', en: 'Compact models are accelerating local tools.' }],
            }),
          }
          yield { type: 'finish', reason: { kind: 'stop' } }
        },
      }
    },
  }
  const enriched = await enrichReportContent(ctx, MOCK_CONF, phase1)
  assert.equal(enriched.enriched, true)
  assert.equal(enriched.paragraphs[0].sentences[0].zh, '紧凑模型正在加速本地工具。')
  assert.deepEqual(enriched.paragraphs[0].sentences[0].core, ['Compact models', 'are accelerating'])
})

test('createReportService.enrichReport persists, deduplicates, caches, preserves concurrent explain, and ignores stale refreshes', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-report-progressive-'))
  try {
    let phase1Calls = 0
    let enrichCalls = 0
    let explainCalls = 0
    let releaseEnrich = null
    let enrichStarted = null
    const waitEnrichStarted = new Promise((resolve) => {
      enrichStarted = resolve
    })

    const ctx = {
      get(name) {
        if (name !== 'llm') return null
        return {
          async *stream(opts) {
            if (opts.purpose === 'english-gym-explain') {
              explainCalls += 1
              yield {
                type: 'text-delta',
                text: JSON.stringify({
                  structure: '主谓宾句型。',
                  points: [{ phrase: 'accelerating workflows', note: '加速工作流' }],
                  nuance: '顺译即可。',
                }),
              }
              yield { type: 'finish', reason: { kind: 'stop' } }
              return
            }
            if (opts.purpose === 'english-gym-report-enrich') {
              enrichCalls += 1
              const callNo = enrichCalls
              if (callNo === 1 && enrichStarted) enrichStarted()
              if (callNo === 1) {
                await new Promise((resolve) => {
                  releaseEnrich = resolve
                })
              }
              yield {
                type: 'text-delta',
                text: JSON.stringify({
                  paragraphs: [
                    {
                      gist_zh: '工作流明显提速。',
                      zh: ['紧凑模型正在加速工程工作流。', '测试保持稳定。'],
                      core: [['Compact models', 'are accelerating'], null],
                    },
                  ],
                  questions: [{ zh: '测试保持稳定。', en: 'Tests stay steady.' }],
                }),
              }
              yield { type: 'finish', reason: { kind: 'stop' } }
              return
            }
            phase1Calls += 1
            yield {
              type: 'text-delta',
              text: JSON.stringify({
                title: `Fast Report ${phase1Calls}`,
                summary_zh: '快速报告。',
                paragraphs: [['Compact models | are accelerating engineering workflows.', 'Tests stay steady and reliable.']],
                highlights: [
                  { word: 'accelerating', lemma: 'accelerate', pos: 'v', zh: '加速' },
                  { word: 'steady', pos: 'adj', zh: '稳定的' },
                ],
              }),
            }
            yield { type: 'finish', reason: { kind: 'stop' } }
          },
        }
      },
    }

    const wordSvc = createWordService({ dir })
    wordSvc.importBank({ name: 'Inflection Bank', content: 'accelerate\t加速\nsteady\t稳定的\n' })
    const settings = createSettingsService({ dir, conf: MOCK_CONF })
    settings.update({ bankLink: true, bankRetries: 1 })

    const svc = createReportService({
      ctx,
      conf: MOCK_CONF,
      dir,
      getTopic: () => settings.getTopic(),
      getReportLevel: () => settings.getReportLevel(),
    })

    // Phase 1 hits inflected bank word on first try -> no retry!
    const p1 = await svc.getReport(false)
    assert.equal(phase1Calls, 1)
    assert.equal(p1.enriched, false)
    assert.deepEqual([...p1.bankWords].sort(), ['accelerate', 'steady'])

    // Concurrent enrichReport calls share a single inflight LLM call, while explainSentence writes concurrently.
    const enrichPromiseA = svc.enrichReport({ date: p1.date, id: p1.id })
    const enrichPromiseB = svc.enrichReport({ date: p1.date, id: p1.id })
    await waitEnrichStarted

    const explained = await svc.explainSentence({
      date: p1.date,
      paragraphIndex: 0,
      sentenceIndex: 0,
      en: 'Compact models are accelerating engineering workflows.',
      zh: '',
      level: 'B1',
    })
    assert.equal(explainCalls, 1)
    assert.equal(explained.explain.structure, '主谓宾句型。')

    releaseEnrich()
    const [rA, rB] = await Promise.all([enrichPromiseA, enrichPromiseB])
    assert.equal(enrichCalls, 1)
    assert.equal(rA.enriched, true)
    assert.equal(rB.enriched, true)
    assert.equal(rA.paragraphs[0].sentences[0].zh, '紧凑模型正在加速工程工作流。')
    assert.equal(rA.paragraphs[0].sentences[0].explain.structure, '主谓宾句型。')

    // Subsequent enrichReport hits persisted cache with 0 LLM calls.
    const cachedEnriched = await svc.enrichReport({ date: p1.date, id: p1.id })
    assert.equal(enrichCalls, 1)
    assert.equal(cachedEnriched.enriched, true)

    // Stale enrichment must NOT overwrite a newer report generated by getReport(true).
    const p1New = await svc.getReport(true)
    assert.equal(phase1Calls, 2)
    assert.notEqual(p1New.id, p1.id)
    assert.equal(p1New.enriched, false)

    // Passing stale id returns current report without calling enrich LLM.
    const staleRes = await svc.enrichReport({ date: p1.date, id: p1.id })
    assert.equal(staleRes.id, p1New.id)
    assert.equal(enrichCalls, 1)

    // Now test the /report/enrich HTTP route via createEnglishGym when enrichment runs cleanly.
    const gym = createEnglishGym(ctx, { ...MOCK_CONF, dataDir: dir })
    let statusCode = 0
    let rawBody = ''
    await gym.route.handler(
      {
        method: 'POST',
        url: '/api/english-gym/report/enrich',
        on(ev, cb) {
          if (ev === 'data') cb(JSON.stringify({ date: dayKey(), id: p1New.id }))
          if (ev === 'end') cb()
        },
      },
      {
        setHeader() {},
        end(chunk) {
          rawBody = String(chunk || '')
        },
        set statusCode(code) {
          statusCode = code
        },
        get statusCode() {
          return statusCode
        },
      },
      { owner: true },
    )
    assert.equal(statusCode, 200)
    const httpBody = JSON.parse(rawBody)
    assert.equal(httpBody.id, p1New.id)
    assert.equal(httpBody.enriched, true)
    assert.equal(enrichCalls, 2)
    assert.equal(loadReport(dir, dayKey()).enriched, true)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('extractJson, normalizeReportParagraphs, generateReport, and mergeReportEnrichment tolerate variant shapes', async () => {
  // 1. extractJson tolerates trailing prose with braces after the JSON object
  const messy = 'Here is the article:\n{"title":"Hello","ok":true}\nNote: {ignore this trailing brace}'
  assert.deepEqual(extractJson(messy), { title: 'Hello', ok: true })

  // 2. normalizeReportParagraphs accepts 1D paragraph strings (preserving abbreviations), { text }, and multi-paragraph strings
  const from1D = normalizeReportParagraphs([
    'Dr. Smith | tests small models. They stay fast!',
    'Teams use e.g. local caches.',
  ])
  assert.equal(from1D.length, 2)
  assert.deepEqual(from1D[0].sentences, [
    { en: 'Dr. Smith tests small models.', zh: '', chunks: ['Dr. Smith', 'tests small models.'] },
    { en: 'They stay fast!', zh: '' },
  ])
  assert.deepEqual(from1D[1].sentences, [{ en: 'Teams use e.g. local caches.', zh: '' }])

  const fromObjects = normalizeReportParagraphs([
    { gist_zh: '第一段。', text: 'Alpha runs locally. Beta scales.' },
    { en: 'Gamma stays simple.' },
  ])
  assert.equal(fromObjects.length, 2)
  assert.equal(fromObjects[0].gist_zh, '第一段。')
  assert.deepEqual(
    fromObjects[0].sentences.map((s) => s.en),
    ['Alpha runs locally.', 'Beta scales.'],
  )
  assert.deepEqual(
    fromObjects[1].sentences.map((s) => s.en),
    ['Gamma stays simple.'],
  )

  const fromMultiStr = normalizeReportParagraphs('Para one sentence.\n\nPara two sentence.')
  assert.equal(fromMultiStr.length, 2)

  // 3. generateReport succeeds when model returns 1D string paragraphs + headline alias
  const ctx = {
    get(name) {
      if (name !== 'llm') return null
      return {
        async *stream() {
          yield {
            type: 'text-delta',
            text: JSON.stringify({
              headline: 'Compact AI Tools',
              summary_zh: '紧凑型 AI 工具。',
              paragraphs: [
                'Small models | run on laptops. Setup stays easy.',
                'Teams | ship updates faster.',
              ],
              highlights: [{ word: 'laptops', pos: 'n', zh: '笔记本电脑' }],
            }),
          }
          yield { type: 'finish', reason: { kind: 'stop' } }
        },
      }
    },
  }
  const rep = await generateReport(ctx, MOCK_CONF, { level: 'B1', date: '2026-11-27' })
  assert.equal(rep.fallback, undefined)
  assert.equal(rep.title, 'Compact AI Tools')
  assert.equal(rep.paragraphs.length, 2)
  assert.deepEqual(rep.paragraphs[0].sentences[0].chunks, ['Small models', 'run on laptops.'])

  // 4. mergeReportEnrichment accepts 2D string array paragraphs
  const { report: enriched, addedZh } = mergeReportEnrichment(rep, {
    paragraphs: [
      ['小模型可在笔记本上运行。', '配置依然简单。'],
      ['团队更快发布更新。'],
    ],
    questions: [{ zh: '团队更快发布更新。', en: 'Teams ship updates faster.' }],
  })
  assert.equal(addedZh, 3)
  assert.equal(enriched.paragraphs[0].sentences[0].zh, '小模型可在笔记本上运行。')
  assert.equal(enriched.paragraphs[1].sentences[0].zh, '团队更快发布更新。')
})

test('generateReport uses maxTokens 6000 with off effort, retries once on unparseable JSON, and flags truncated JSON', async () => {
  // 1. maxTokens: 6000 even when reasoningEffort === 'off', and retries once on malformed JSON
  const calls = []
  const retryCtx = {
    get(name) {
      if (name !== 'llm') return null
      return {
        async *stream(opts) {
          calls.push({ maxTokens: opts.maxTokens, reasoningEffort: opts.reasoningEffort })
          if (calls.length === 1) {
            yield { type: 'text-delta', text: 'Here is not valid json at all' }
          } else {
            yield {
              type: 'text-delta',
              text: '\uFEFF{"title":"Retry Worked","summary_zh":"重试成功。","paragraphs":["First | second sentence."],// comment\n"highlights":[]}',
            }
          }
          yield { type: 'finish', reason: { kind: 'stop' } }
        },
      }
    },
  }
  const ok = await generateReport(retryCtx, MOCK_CONF, { level: 'B1', reasoningEffort: 'off' })
  assert.equal(ok.fallback, undefined)
  assert.equal(ok.title, 'Retry Worked')
  assert.equal(calls.length, 2)
  assert.equal(calls[0].maxTokens, 6000)
  assert.equal(calls[0].reasoningEffort, 'off')

  // 2. Repeated truncated JSON returns explicit truncation fallbackReason
  let truncCalls = 0
  const truncCtx = {
    get(name) {
      if (name !== 'llm') return null
      return {
        async *stream() {
          truncCalls += 1
          yield { type: 'text-delta', text: '{"title":"Cut Off","paragraphs":["Sentence never finishes' }
          yield { type: 'finish', reason: { kind: 'length' } }
        },
      }
    },
  }
  const trunc = await generateReport(truncCtx, MOCK_CONF, { level: 'B1', reasoningEffort: 'off' })
  assert.equal(trunc.fallback, true)
  assert.equal(truncCalls, 2)
  assert.equal(trunc.fallbackReason, '模型输出被截断，JSON 不完整')

  // 3. extractJson tolerates UTF-8 BOM and // line comments outside strings
  assert.deepEqual(extractJson('\uFEFF{"url":"https://example.com",// note\n"ok":true}'), {
    url: 'https://example.com',
    ok: true,
  })
})
