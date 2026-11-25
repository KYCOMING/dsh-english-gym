import test from 'node:test'
import assert from 'node:assert/strict'
import { MAX_REPORT_HIGHLIGHTS, normalizeReportHighlights } from '../src/features/report/highlights.js'
import { FALLBACK_REPORT } from '../src/features/report/fallback.js'
import { segmentReportParagraphs } from '../src/client/features/report/highlight.js'
import { formatPos } from '../src/client/core/text.js'

test('normalizeReportHighlights validates existence, filters stop words, deduplicates, and enforces cap', () => {
  const body =
    'Compact models can accelerate iterative workflows while keeping latency low. ' +
    'Teams burn through budgets when scaling massive architectures without clear benchmarks.'

  const raw = [
    { word: 'nonexistent', pos: 'adj', zh: '不存在的' },
    { word: 'the', pos: 'art', zh: '这' },
    { word: 'good', pos: 'adj', zh: '好的' },
    { word: 'compact', lemma: 'compact', pos: 'adj', zh: '紧凑的' },
    { word: 'Compact', pos: 'adj', zh: '重复词' },
    { word: 'iterative', pos: 'adj', zh: '迭代的' },
    { word: 'workflows', lemma: 'workflow', pos: 'n', zh: '工作流' },
    { word: 'latency', pos: 'n', zh: '延迟' },
    { word: 'burn through', pos: 'phrasal verb', zh: '迅速耗尽' },
    { word: 'burn', pos: 'v', zh: '消耗' },
    { word: 'budgets', lemma: 'budget', pos: 'n', zh: '预算' },
    { word: 'scaling', lemma: 'scale', pos: 'v', zh: '扩展' },
    { word: 'massive', pos: 'adj', zh: '庞大的' },
    { word: 'architectures', lemma: 'architecture', pos: 'n', zh: '架构' },
    { word: 'benchmarks', lemma: 'benchmark', pos: 'n', zh: '基准测试' },
  ]

  const result = normalizeReportHighlights(raw, body, [])
  assert.equal(result.length, MAX_REPORT_HIGHLIGHTS)
  assert.ok(!result.some((h) => h.word.toLowerCase() === 'nonexistent'))
  assert.ok(!result.some((h) => h.word.toLowerCase() === 'the'))
  assert.ok(!result.some((h) => h.word.toLowerCase() === 'good'))
  // Shorter sub-term 'burn' must be dropped when 'burn through' is selected.
  assert.ok(result.some((h) => h.word === 'burn through' && h.pos === 'phrase'))
  assert.ok(!result.some((h) => h.word === 'burn'))
  // Lemma matching word is omitted.
  const compactItem = result.find((h) => h.word.toLowerCase() === 'compact')
  assert.ok(compactItem)
  assert.equal('lemma' in compactItem, false)
})

test('normalizeReportHighlights prioritizes bank words, inherits POS, and falls back when omitted', () => {
  const body =
    'A resilient pipeline handles unexpected latency spikes gracefully and keeps throughput steady.'
  const candidates = [
    { word: 'throughput', meaning: '吞吐量', pos: 'n' },
    { word: 'resilient', meaning: '有韧性的', pos: 'adj' },
    { word: 'unusedword', meaning: '未出现', pos: 'n' },
  ]

  const raw = [
    { word: 'unexpected', pos: 'adj', zh: '意外的' },
    { word: 'spikes', lemma: 'spike', pos: 'n', zh: '激增' },
    { word: 'gracefully', pos: 'adv', zh: '优雅地；平稳地' },
    { word: 'resilient', zh: '有弹性的' },
    { word: 'throughput', zh: '吞吐量' },
  ]

  // With limit=3, bank words must be kept first.
  const prioritized = normalizeReportHighlights(raw, body, candidates, 3)
  assert.equal(prioritized.length, 3)
  assert.equal(prioritized.filter((h) => h.fromBank).length, 2)
  assert.equal(prioritized.find((h) => h.word === 'resilient').pos, 'adj')
  assert.equal(prioritized.find((h) => h.word === 'throughput').pos, 'n')

  // When model omits highlights, fall back to matched bank words.
  const fallback = normalizeReportHighlights(undefined, body, candidates)
  assert.deepEqual(
    fallback.map((h) => h.word),
    ['resilient', 'throughput'],
  )
  assert.ok(fallback.every((h) => h.fromBank === true))
})

test('segmentReportParagraphs highlights first occurrence only, longest-first, preserving case', () => {
  const paragraphs = [
    'Compact models stay compact when engineers burn through limits.',
    'Compacted data and burn-in tests do not falsely match compact or burn through.',
  ]
  const highlights = [
    { word: 'compact', pos: 'adj', zh: '紧凑的' },
    { word: 'burn through', pos: 'phrase', zh: '迅速耗尽' },
  ]

  const { segmentsByParagraph, matchedCount } = segmentReportParagraphs(paragraphs, highlights)
  assert.equal(matchedCount, 2)
  assert.equal(segmentsByParagraph.length, 2)

  const p0Terms = segmentsByParagraph[0].filter((s) => s.type === 'term')
  assert.equal(p0Terms.length, 2)
  assert.equal(p0Terms[0].text, 'Compact')
  assert.equal(p0Terms[1].text, 'burn through')

  // Second occurrence of 'compact' in paragraph 0 and 'Compacted' in paragraph 1 remain plain text.
  const p1Terms = segmentsByParagraph[1].filter((s) => s.type === 'term')
  assert.equal(p1Terms.length, 0)
  assert.equal(segmentsByParagraph[1].map((s) => s.text).join(''), paragraphs[1])
  assert.equal(segmentsByParagraph[0].map((s) => s.text).join(''), paragraphs[0])
})

test('segmentReportParagraphs handles empty or missing highlights cleanly', () => {
  const paragraphs = ['First paragraph.', 'Second paragraph.']
  const { segmentsByParagraph, matchedCount } = segmentReportParagraphs(paragraphs, undefined)
  assert.equal(matchedCount, 0)
  assert.deepEqual(segmentsByParagraph, [
    [{ type: 'text', text: 'First paragraph.' }],
    [{ type: 'text', text: 'Second paragraph.' }],
  ])
})

test('FALLBACK_REPORT highlights validate cleanly and match body once each', () => {
  const normalized = normalizeReportHighlights(FALLBACK_REPORT.highlights, FALLBACK_REPORT.body, [])
  assert.equal(normalized.length, FALLBACK_REPORT.highlights.length)
  assert.ok(normalized.length >= 6 && normalized.length <= MAX_REPORT_HIGHLIGHTS)

  const paragraphs = FALLBACK_REPORT.body.split(/\n{2,}/).filter(Boolean)
  const { matchedCount } = segmentReportParagraphs(paragraphs, normalized)
  assert.equal(matchedCount, normalized.length)
})

test('formatPos formats phrase and idiom cleanly', () => {
  assert.equal(formatPos('phrase'), '短语')
  assert.equal(formatPos('idiom'), '习语')
  assert.equal(formatPos('adj'), '形容词 adj.')
})
