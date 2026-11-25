import { escapeRegExp } from '../../shared/text.js'

export const MAX_REPORT_HIGHLIGHTS = 8

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'so', 'as', 'at', 'by', 'for', 'from',
  'in', 'into', 'of', 'on', 'onto', 'out', 'over', 'to', 'up', 'with', 'without', 'about',
  'above', 'after', 'before', 'between', 'during', 'through', 'under', 'around',
  'i', 'me', 'my', 'we', 'us', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her',
  'it', 'its', 'they', 'them', 'their', 'this', 'that', 'these', 'those', 'who', 'which',
  'what', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'than', 'too', 'very',
  'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
  'be', 'am', 'is', 'are', 'was', 'were', 'been', 'being',
  'do', 'does', 'did', 'doing', 'have', 'has', 'had', 'having',
  'good', 'bad', 'big', 'small', 'new', 'old', 'make', 'use', 'get', 'work', 'time',
  'people', 'year', 'years', 'way', 'day', 'thing', 'things', 'many', 'much', 'just',
  'also', 'still', 'well', 'now', 'here', 'there', 'one', 'two', 'first', 'last',
])

export function termBoundaryRegex(term, flags = 'i') {
  return new RegExp(`(?<![A-Za-z0-9'’-])${escapeRegExp(term)}(?![A-Za-z0-9'’-])`, flags)
}

function normalizePos(raw) {
  const s = String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\.+$/g, '')
    .replace(/\s+/g, ' ')
  if (!s) return ''
  if (s === 'vt' || s === 'vi') return 'v'
  if (s === 'phr' || s === 'phrasal verb' || s === 'collocation' || s === 'exp' || s === 'expr' || s === 'expression') {
    return 'phrase'
  }
  return s.slice(0, 16)
}

function isValidCandidateTerm(word) {
  if (!word || word.length < 2 || word.length > 36) return false
  if (/^\d+$/.test(word) || !/[A-Za-z]/.test(word)) return false
  if (word.split(' ').length > 3) return false
  if (STOP_WORDS.has(word.toLowerCase())) return false
  return true
}

/**
 * Validate, deduplicate, and cap pre-generated report vocabulary highlights.
 * Ensures every returned term exists in `body` on word boundaries, removes
 * overlapping substrings, prioritizes incorporated word-bank words, and falls
 * back to matched bank words if the model omitted highlights.
 *
 * @returns {Array<{word:string, lemma?:string, pos?:string, zh:string, fromBank?:boolean}>}
 */
export function normalizeReportHighlights(rawHighlights, body, candidates = [], limit = MAX_REPORT_HIGHLIGHTS) {
  const source = String(body || '')
  const cap = Math.max(0, Math.min(16, Number(limit) || MAX_REPORT_HIGHLIGHTS))
  if (!source.trim() || cap <= 0) return []

  const bankMap = new Map()
  for (const c of Array.isArray(candidates) ? candidates : []) {
    const w = String((c && c.word) || '').trim().replace(/\s+/g, ' ')
    if (!w) continue
    const key = w.toLowerCase()
    if (!bankMap.has(key)) {
      bankMap.set(key, {
        word: w,
        meaning: String(c.meaning || '').trim().replace(/\s+/g, ' ').slice(0, 48),
        pos: normalizePos(c.pos),
      })
    }
  }

  const valid = []
  const seen = new Set()
  for (const item of Array.isArray(rawHighlights) ? rawHighlights : []) {
    if (!item || typeof item !== 'object') continue
    const word = String(item.word || item.en || '').trim().replace(/\s+/g, ' ')
    if (!isValidCandidateTerm(word)) continue
    const key = word.toLowerCase()
    if (seen.has(key)) continue

    const zh = String(item.zh || item.meaning || '').trim().replace(/\s+/g, ' ').slice(0, 48)
    if (!zh) continue

    const m = termBoundaryRegex(word, 'i').exec(source)
    if (!m) continue

    let lemma = String(item.lemma || '').trim().replace(/\s+/g, ' ').slice(0, 32)
    if (!lemma || lemma.toLowerCase() === key) lemma = ''

    let pos = normalizePos(item.pos)
    const bankHit = bankMap.get(key) || (lemma ? bankMap.get(lemma.toLowerCase()) : null)
    if (!pos && bankHit && bankHit.pos) pos = bankHit.pos

    seen.add(key)
    const entry = { word, zh, fromBank: Boolean(bankHit), _index: m.index }
    if (lemma) entry.lemma = lemma
    if (pos) entry.pos = pos
    valid.push(entry)
  }

  // Drop shorter terms that are contained as whole sub-tokens inside a longer selected term.
  let deduped = valid.filter(
    (a) => !valid.some((b) => b !== a && b.word.length > a.word.length && termBoundaryRegex(a.word, 'i').test(b.word)),
  )

  // Resilient fallback: if model output yielded no valid highlights, surface matched bank words.
  if (!deduped.length && bankMap.size) {
    const fallbackCap = Math.min(6, cap)
    const seenFb = new Set()
    for (const c of bankMap.values()) {
      if (deduped.length >= fallbackCap) break
      if (!c.meaning || !isValidCandidateTerm(c.word)) continue
      const key = c.word.toLowerCase()
      if (seenFb.has(key)) continue
      const m = termBoundaryRegex(c.word, 'i').exec(source)
      if (!m) continue
      seenFb.add(key)
      const entry = { word: c.word, zh: c.meaning, fromBank: true, _index: m.index }
      if (c.pos) entry.pos = c.pos
      deduped.push(entry)
    }
    deduped = deduped.filter(
      (a) => !deduped.some((b) => b !== a && b.word.length > a.word.length && termBoundaryRegex(a.word, 'i').test(b.word)),
    )
  }

  // Prioritize incorporated word-bank words first, then remaining items in model order up to cap.
  const bankItems = deduped.filter((item) => item.fromBank)
  const otherItems = deduped.filter((item) => !item.fromBank)
  const kept = [...bankItems, ...otherItems].slice(0, cap)

  // Sort by first appearance in the article and strip internal _index.
  kept.sort((a, b) => a._index - b._index)
  return kept.map(({ _index, ...rest }) => rest)
}
