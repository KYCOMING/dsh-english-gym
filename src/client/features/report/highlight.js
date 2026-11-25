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
