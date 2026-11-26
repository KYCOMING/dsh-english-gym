import { escapeRegExp } from '../../core/text.js'

/**
 * Split report paragraphs into plain text and highlighted term segments.
 * Longest terms match first on word boundaries, and by default only the first
 * occurrence of each term across the entire article is highlighted.
 *
 * @param {string[]} paragraphs
 * @param {Array<{word:string, lemma?:string, pos?:string, zh:string, fromBank?:boolean}>} highlights
 * @param {{firstOnly?:boolean}} [options]
 */
export function segmentReportParagraphs(paragraphs, highlights, options = {}) {
  const list = Array.isArray(paragraphs) ? paragraphs : []
  const firstOnly = options.firstOnly !== false

  const items = []
  const byKey = new Map()
  for (const raw of Array.isArray(highlights) ? highlights : []) {
    if (!raw || typeof raw !== 'object') continue
    const word = String(raw.word || '').trim().replace(/\s+/g, ' ')
    const zh = String(raw.zh || '').trim()
    if (!word || !zh) continue
    const key = word.toLowerCase()
    if (byKey.has(key)) continue
    const item = { ...raw, word, zh }
    byKey.set(key, item)
    items.push(item)
  }

  if (!items.length) {
    return {
      segmentsByParagraph: list.map((p) => [{ type: 'text', text: String(p || '') }]),
      matchedCount: 0,
    }
  }

  items.sort((a, b) => b.word.length - a.word.length)
  let pattern = ''
  try {
    const alts = items.map((i) => escapeRegExp(i.word)).join('|')
    pattern = new RegExp(`(?<![A-Za-z0-9'’-])(?:${alts})(?![A-Za-z0-9'’-])`, 'gi')
  } catch {
    return {
      segmentsByParagraph: list.map((p) => [{ type: 'text', text: String(p || '') }]),
      matchedCount: 0,
    }
  }

  const seenKeys = new Set()
  let nextId = 0
  const segmentsByParagraph = list.map((rawPara) => {
    const source = String(rawPara || '')
    if (!source) return [{ type: 'text', text: '' }]
    pattern.lastIndex = 0
    const segs = []
    let cursor = 0
    let m
    while ((m = pattern.exec(source)) !== null) {
      const matchedText = m[0]
      if (!matchedText) {
        pattern.lastIndex += 1
        continue
      }
      const key = matchedText.toLowerCase().replace(/\s+/g, ' ')
      const item = byKey.get(key)
      if (!item || (firstOnly && seenKeys.has(key))) continue
      if (m.index > cursor) {
        segs.push({ type: 'text', text: source.slice(cursor, m.index) })
      }
      seenKeys.add(key)
      segs.push({ type: 'term', id: 'hl-' + nextId++, text: matchedText, item })
      cursor = m.index + matchedText.length
    }
    if (cursor < source.length) {
      segs.push({ type: 'text', text: source.slice(cursor) })
    }
    return segs.length ? segs : [{ type: 'text', text: source }]
  })

  return { segmentsByParagraph, matchedCount: nextId }
}

/**
 * Regroup one paragraph's highlight segments into sentence groups so each
 * sentence can be revealed on its own. Text between sentences becomes a `gap`.
 * A highlighted term stays whole and belongs to the sentence it starts in.
 *
 * @param {string} paragraphText
 * @param {Array<{type:string, text:string}>} segs  partition of `paragraphText` (from segmentReportParagraphs)
 * @param {Array<{en:string}>} sentences  sentences in order; each `en` must occur in `paragraphText`
 * @returns {Array<{type:'sentence', index:number, segs:Array} | {type:'gap', segs:Array}> | null}
 *   `null` when the sentences cannot be aligned (caller should render the plain paragraph).
 */
export function groupSegmentsBySentence(paragraphText, segs, sentences) {
  const source = String(paragraphText || '')
  const list = Array.isArray(sentences) ? sentences : []
  const parts = Array.isArray(segs) ? segs : []
  if (!source || !list.length) return null
  if (parts.map((s) => String((s && s.text) || '')).join('') !== source) return null

  const ranges = []
  let cursor = 0
  for (let i = 0; i < list.length; i += 1) {
    const en = String((list[i] && list[i].en) || '')
    const at = en ? source.indexOf(en, cursor) : -1
    if (at < 0) return null
    ranges.push({ start: at, end: at + en.length, index: i })
    cursor = at + en.length
  }
  const cutPoints = Array.from(new Set(ranges.flatMap((r) => [r.start, r.end]))).sort((a, b) => a - b)
  const containerAt = (pos) => {
    for (const r of ranges) if (pos >= r.start && pos < r.end) return r.index
    return -1
  }

  const pieces = []
  let offset = 0
  for (const seg of parts) {
    const start = offset
    const end = offset + seg.text.length
    offset = end
    if (!seg.text) continue
    if (seg.type === 'term') {
      pieces.push({ container: containerAt(start), seg })
      continue
    }
    let from = start
    for (const cut of [...cutPoints.filter((c) => c > start && c < end), end]) {
      pieces.push({ container: containerAt(from), seg: { type: 'text', text: source.slice(from, cut) } })
      from = cut
    }
  }

  const groups = []
  for (const piece of pieces) {
    const last = groups[groups.length - 1]
    if (last && last.container === piece.container) last.segs.push(piece.seg)
    else groups.push({ container: piece.container, segs: [piece.seg] })
  }
  return groups.map((g) =>
    g.container < 0 ? { type: 'gap', segs: g.segs } : { type: 'sentence', index: g.container, segs: g.segs },
  )
}

/**
 * Annotate one sentence's segments with inline chunk boundaries (`{ type: 'slash' }`)
 * and `inCore: true` flags for main-clause skeleton highlights.
 * Highlighted `<mark>` terms are never split; any slash inside a multi-word term is ignored.
 *
 * @param {string} sentenceEn
 * @param {Array<{type:string, text:string}>} segs
 * @param {{chunks?:string[], core?:string[]}} [hint]
 * @returns {Array<{type:string, text?:string, inCore?:boolean}>}
 */
export function annotateSentenceSegments(sentenceEn, segs, hint = {}) {
  const source = String(sentenceEn || '')
  const parts = Array.isArray(segs) ? segs : []
  if (!source || !parts.length) return parts
  if (parts.map((s) => String((s && s.text) || '')).join('') !== source) return parts

  const slashPositions = new Set()
  const rawChunks = hint && Array.isArray(hint.chunks) ? hint.chunks : []
  if (rawChunks.length >= 2) {
    let cursor = 0
    const ends = []
    let ok = true
    for (const raw of rawChunks) {
      const chunk = String(raw || '').replace(/\s+/g, ' ').trim()
      while (cursor < source.length && /\s/.test(source[cursor])) cursor += 1
      if (!chunk || !source.startsWith(chunk, cursor)) {
        ok = false
        break
      }
      cursor += chunk.length
      ends.push(cursor)
    }
    while (cursor < source.length && /\s/.test(source[cursor])) cursor += 1
    if (ok && cursor === source.length) {
      for (let i = 0; i < ends.length - 1; i += 1) slashPositions.add(ends[i])
    }
  }

  let coreRanges = []
  const rawCore = hint && Array.isArray(hint.core) ? hint.core : []
  if (rawCore.length) {
    const lower = source.toLowerCase()
    let cursor = 0
    const ranges = []
    let ok = true
    for (const raw of rawCore) {
      const piece = String(raw || '').replace(/\s+/g, ' ').trim()
      if (!piece) continue
      let at = source.indexOf(piece, cursor)
      if (at < 0) at = lower.indexOf(piece.toLowerCase(), cursor)
      if (at < 0) {
        ok = false
        break
      }
      ranges.push({ start: at, end: at + piece.length })
      cursor = at + piece.length
    }
    if (ok && ranges.length) coreRanges = ranges
  }

  if (!slashPositions.size && !coreRanges.length) return parts

  const out = []
  const emittedSlashes = new Set()
  const maybePushSlash = (pos) => {
    if (slashPositions.has(pos) && !emittedSlashes.has(pos)) {
      emittedSlashes.add(pos)
      out.push({ type: 'slash' })
    }
  }
  const isInsideCore = (start, end) => coreRanges.some((r) => start < r.end && end > r.start)

  let offset = 0
  for (const seg of parts) {
    const text = String((seg && seg.text) || '')
    const start = offset
    const end = offset + text.length
    offset = end
    if (!text) continue

    maybePushSlash(start)
    if (seg.type === 'term') {
      out.push({ ...seg, inCore: isInsideCore(start, end) })
      maybePushSlash(end)
      continue
    }

    const cuts = new Set()
    for (const pos of slashPositions) {
      if (pos > start && pos < end) cuts.add(pos)
    }
    for (const r of coreRanges) {
      if (r.start > start && r.start < end) cuts.add(r.start)
      if (r.end > start && r.end < end) cuts.add(r.end)
    }
    const sortedCuts = Array.from(cuts).sort((a, b) => a - b)

    let from = start
    for (const cut of [...sortedCuts, end]) {
      maybePushSlash(from)
      const sliceText = source.slice(from, cut)
      if (sliceText) {
        out.push({ type: 'text', text: sliceText, inCore: isInsideCore(from, cut) })
      }
      from = cut
    }
    maybePushSlash(end)
  }

  return out
}
