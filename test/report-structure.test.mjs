import test from 'node:test'
import assert from 'node:assert/strict'
import {
  joinParagraphs,
  normalizeChunks,
  normalizeCore,
  normalizeReportParagraphs,
  REPORT_SCHEMA,
} from '../src/features/report/structure.js'
import { FALLBACK_REPORT } from '../src/features/report/fallback.js'
import {
  annotateSentenceSegments,
  groupSegmentsBySentence,
  segmentReportParagraphs,
} from '../src/client/features/report/highlight.js'
import { generateReport } from '../src/features/report/generate.js'

test('normalizeReportParagraphs keeps sentences, blanks bad translations, drops empty paragraphs', () => {
  const result = normalizeReportParagraphs([
    {
      gist_zh: '  第一段\n大意 ',
      sentences: [
        { en: 'First  sentence\nhere.', zh: '第一句。' },
        { en: 'Second sentence.', zh: 'not chinese' },
        { en: '   ', zh: '空' },
        null,
      ],
    },
    { gist_zh: 'no cjk', sentences: [] },
    { gist: '第三段', sentences: [{ en: 'Third.', zh: '第三句。' }] },
  ])
  assert.deepEqual(result, [
    {
      gist_zh: '第一段 大意',
      sentences: [
        { en: 'First sentence here.', zh: '第一句。' },
        { en: 'Second sentence.', zh: '' },
      ],
    },
    { gist_zh: '第三段', sentences: [{ en: 'Third.', zh: '第三句。' }] },
  ])
  assert.equal(normalizeReportParagraphs(null), null)
  assert.equal(normalizeReportParagraphs([{ sentences: [] }]), null)
  assert.equal(joinParagraphs(result), 'First sentence here. Second sentence.\n\nThird.')
})

test('normalizeChunks validates reading chunks verbatim and rejects misaligned or punctuation-only chunks', () => {
  const en = 'Compact models can run on a laptop, which keeps private data local.'
  assert.deepEqual(
    normalizeChunks(['Compact models can run', 'on a laptop,', 'which keeps private data local.'], en),
    ['Compact models can run', 'on a laptop,', 'which keeps private data local.'],
  )
  // Rejects single chunk, extra/missing words, or leading punctuation
  assert.deepEqual(normalizeChunks([en], en), [])
  assert.deepEqual(normalizeChunks(['Compact models', 'which keeps private data local.'], en), [])
  assert.deepEqual(normalizeChunks(['Compact models can run on a laptop', ', which keeps private data local.'], en), [])
  assert.deepEqual(normalizeChunks(['Compact models', '...'], en), [])
})

test('normalizeCore accepts arrays or delimiter strings, preserves casing, rejects mid-word or full-sentence cores', () => {
  const en = 'The teams that win will be the ones that know which model to use.'
  assert.deepEqual(normalizeCore(['the teams', 'will be the ones'], en), ['The teams', 'will be the ones'])
  assert.deepEqual(normalizeCore('the teams ... will be the ones', en), ['The teams', 'will be the ones'])
  assert.deepEqual(normalizeCore('The teams / will be the ones', en), ['The teams', 'will be the ones'])
  // Rejects out-of-order, mid-word, too-short, or whole-sentence matches
  assert.deepEqual(normalizeCore(['will be the ones', 'The teams'], en), [])
  assert.deepEqual(normalizeCore(['team'], en), [])
  assert.deepEqual(normalizeCore(['is'], 'It is OK.'), [])
  assert.deepEqual(normalizeCore([en], en), [])
})

test('fallback report is fully structured, passes normalization, and leaves short sentence without hints', () => {
  assert.equal(FALLBACK_REPORT.body, joinParagraphs(FALLBACK_REPORT.paragraphs))
  const normalized = normalizeReportParagraphs(FALLBACK_REPORT.paragraphs)
  assert.deepEqual(normalized, FALLBACK_REPORT.paragraphs)

  for (const p of FALLBACK_REPORT.paragraphs) {
    assert.ok(p.gist_zh)
    for (const s of p.sentences) {
      assert.ok(s.en && /[\u4e00-\u9fff]/.test(s.zh), s.en)
      if (s.en === 'The appeal is practical.') {
        assert.equal(s.chunks, undefined)
        assert.equal(s.core, undefined)
      } else {
        assert.ok(Array.isArray(s.chunks) && s.chunks.length >= 2, s.en)
        assert.ok(Array.isArray(s.core) && s.core.length >= 1, s.en)
      }
    }
  }
})

test('groupSegmentsBySentence splits text at sentence borders and keeps terms whole', () => {
  const paragraphs = FALLBACK_REPORT.body.split(/\n{2,}/)
  const { segmentsByParagraph } = segmentReportParagraphs(paragraphs, FALLBACK_REPORT.highlights)
  paragraphs.forEach((text, i) => {
    const sentences = FALLBACK_REPORT.paragraphs[i].sentences
    const groups = groupSegmentsBySentence(text, segmentsByParagraph[i], sentences)
    assert.ok(groups)
    const sentenceGroups = groups.filter((g) => g.type === 'sentence')
    assert.deepEqual(
      sentenceGroups.map((g) => g.index),
      sentences.map((_, si) => si),
    )
    sentenceGroups.forEach((g) => {
      assert.equal(g.segs.map((s) => s.text).join(''), sentences[g.index].en)
    })
    groups
      .filter((g) => g.type === 'gap')
      .forEach((g) => assert.match(g.segs.map((s) => s.text).join(''), /^\s+$/))
    // Lossless: concatenation of all groups reproduces the paragraph.
    assert.equal(groups.flatMap((g) => g.segs.map((s) => s.text)).join(''), text)
  })
  // The term "burning through" stays a single term segment inside sentence 4 of paragraph 2.
  const groups = groupSegmentsBySentence(paragraphs[1], segmentsByParagraph[1], FALLBACK_REPORT.paragraphs[1].sentences)
  const last = groups.filter((g) => g.type === 'sentence').pop()
  assert.ok(last.segs.some((s) => s.type === 'term' && s.text === 'burning through'))
})

test('groupSegmentsBySentence returns null when sentences do not align', () => {
  const text = 'Alpha beta. Gamma delta.'
  const segs = [{ type: 'text', text }]
  assert.equal(groupSegmentsBySentence(text, segs, [{ en: 'Alpha beta.' }, { en: 'Missing.' }]), null)
  assert.equal(groupSegmentsBySentence(text, segs, []), null)
  assert.equal(groupSegmentsBySentence(text, [{ type: 'text', text: 'other' }], [{ en: 'Alpha beta.' }]), null)
})

test('annotateSentenceSegments places slash at chunk boundaries and marks core across text and terms', () => {
  const en = 'A compact model can run on a laptop, which keeps private data local.'
  const segs = [
    { type: 'text', text: 'A ' },
    { type: 'term', id: 'hl-0', text: 'compact', item: { word: 'compact', zh: '紧凑的' } },
    { type: 'text', text: ' model can run on a laptop, which keeps private data local.' },
  ]
  const hint = {
    chunks: ['A compact model can run', 'on a laptop,', 'which keeps private data local.'],
    core: ['A compact model can run', 'which keeps private data'],
  }

  const annotated = annotateSentenceSegments(en, segs, hint)
  // Lossless: stripping slash segments reproduces exact sentence text.
  assert.equal(
    annotated
      .filter((s) => s.type !== 'slash')
      .map((s) => s.text)
      .join(''),
    en,
  )
  // Two slashes emitted at chunk boundaries.
  assert.equal(annotated.filter((s) => s.type === 'slash').length, 2)
  // Term "compact" stays intact as a single term and inherits inCore.
  const terms = annotated.filter((s) => s.type === 'term')
  assert.equal(terms.length, 1)
  assert.equal(terms[0].text, 'compact')
  assert.equal(terms[0].inCore, true)
  // Text inside core is marked inCore, non-core text is not.
  assert.equal(
    annotated
      .filter((s) => s.inCore)
      .map((s) => s.text)
      .join(''),
    'A compact model can runwhich keeps private data',
  )
  // Safe fallback when chunks/core mismatch or segs mismatch.
  assert.equal(annotateSentenceSegments(en, [{ type: 'text', text: 'mismatch' }], hint).length, 1)
  assert.deepEqual(annotateSentenceSegments(en, segs, { chunks: ['bad'], core: ['missing'] }), segs)
})

function fakeCtx(reply) {
  return {
    get(name) {
      if (name !== 'llm') return null
      return {
        async *stream() {
          yield { type: 'text-delta', text: reply }
          yield { type: 'finish', reason: { kind: 'stop' } }
        },
      }
    },
  }
}

const MOCK_CONF = { level: 'B1', topic: 'AI and technology', provider: 'mock', model: 'mock-model' }

test('generateReport preserves chunks/core from structured paragraphs and tags schema v3', async () => {
  const reply = JSON.stringify({
    title: 'Tiny Models Win',
    summary_zh: '小模型胜出。',
    paragraphs: [
      {
        gist_zh: '小模型很快。',
        sentences: [
          {
            en: 'Compact models are fast for everyday work.',
            zh: '紧凑模型对日常工作来说很快。',
            chunks: ['Compact models are fast', 'for everyday work.'],
            core: ['Compact models are fast'],
          },
          { en: 'They are cheap.', zh: '它们很便宜。' },
        ],
      },
      { gist_zh: '未来是混合的。', sentences: [{ en: 'The future is hybrid.', zh: '未来是混合的。' }] },
    ],
    highlights: [
      { word: 'Compact', pos: 'adj', zh: '紧凑的' },
      { word: 'hybrid', pos: 'adj', zh: '混合的' },
    ],
    questions: [{ zh: '未来是混合的。', en: 'The future is hybrid.' }],
  })
  const report = await generateReport(fakeCtx(reply), MOCK_CONF, { level: 'B1', date: '2026-11-26' })
  assert.ok(!report.fallback)
  assert.equal(report.schema, REPORT_SCHEMA)
  assert.equal(REPORT_SCHEMA, 3)
  assert.equal(report.body, 'Compact models are fast for everyday work. They are cheap.\n\nThe future is hybrid.')
  assert.equal(report.paragraphs.length, 2)
  assert.deepEqual(report.paragraphs[0].sentences[0].chunks, ['Compact models are fast', 'for everyday work.'])
  assert.deepEqual(report.paragraphs[0].sentences[0].core, ['Compact models are fast'])
  assert.equal(report.paragraphs[0].sentences[1].chunks, undefined)
  assert.deepEqual(
    report.highlights.map((h) => h.word),
    ['Compact', 'hybrid'],
  )
})

test('generateReport still accepts a legacy plain body without paragraphs', async () => {
  const reply = JSON.stringify({ title: 'Legacy', body: 'Plain body text here.', summary_zh: '旧格式。', highlights: [], questions: [] })
  const report = await generateReport(fakeCtx(reply), MOCK_CONF, { level: 'B1', date: '2026-11-26' })
  assert.ok(!report.fallback)
  assert.equal(report.body, 'Plain body text here.')
  assert.deepEqual(report.paragraphs, [])
})
