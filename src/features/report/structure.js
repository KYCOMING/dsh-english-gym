/**
 * Sentence-level structure for the daily report, powering progressive
 * (paragraph gist → structure hint → single-sentence translation) reveal.
 */

/** Bump when the cached report shape changes so stale caches regenerate once. */
export const REPORT_SCHEMA = 3

const MAX_PARAGRAPHS = 8
const MAX_SENTENCES = 24
const HAS_CJK = /[\u4e00-\u9fff]/

function clean(value) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim()
}

/**
 * Parse a sentence that may contain inline `|` chunk delimiters into clean `en`
 * and validated `chunks`.
 *
 * @returns {{en:string, chunks:string[]}}
 */
export function parseDelimitedSentence(rawEn) {
  const cleaned = clean(rawEn)
  if (!cleaned || !cleaned.includes('|')) {
    return { en: cleaned, chunks: [] }
  }
  const parts = cleaned
    .split('|')
    .map((part) => clean(part).replace(/\s+([,.;:!?)\]])/g, '$1'))
    .filter(Boolean)
  if (parts.length < 2) {
    const en = clean(cleaned.replace(/\|/g, ' ').replace(/\s+([,.;:!?)\]])/g, '$1'))
    return { en, chunks: [] }
  }
  const en = parts.join(' ').replace(/\s+([,.;:!?)\]])/g, '$1')
  const chunks = normalizeChunks(parts, en)
  return { en, chunks }
}

/**
 * Validate model-provided reading chunks (`chunks`) against the exact sentence `en`.
 * Requires 2–6 non-empty chunks that cover `en` sequentially (ignoring spaces between them).
 *
 * @returns {string[]}
 */
export function normalizeChunks(rawChunks, en) {
  if (!Array.isArray(rawChunks) || rawChunks.length < 2 || rawChunks.length > 6) return []
  const source = String(en || '')
  if (!source) return []

  const matched = []
  let cursor = 0
  for (const item of rawChunks) {
    const chunk = clean(item)
    if (!chunk || !/[A-Za-z0-9]/.test(chunk) || /^[,.;:!?\)\]]/.test(chunk)) return []
    while (cursor < source.length && /\s/.test(source[cursor])) cursor += 1
    if (!source.startsWith(chunk, cursor)) return []
    matched.push(chunk)
    cursor += chunk.length
  }
  while (cursor < source.length && /\s/.test(source[cursor])) cursor += 1
  return cursor === source.length ? matched : []
}

/**
 * Validate model-provided main-clause skeleton pieces (`core`) against `en`.
 * Matches 1–3 substrings in order on word boundaries and rejects whole-sentence matches.
 *
 * @returns {string[]}
 */
export function normalizeCore(rawCore, en) {
  const source = String(en || '')
  if (!source) return []

  const rawList = Array.isArray(rawCore)
    ? rawCore
    : typeof rawCore === 'string'
      ? rawCore.split(/\s*(?:\.\.\.|…|\/|\|)\s*/)
      : []

  const pieces = rawList.map(clean).filter(Boolean).slice(0, 3)
  if (!pieces.length) return []

  const lower = source.toLowerCase()
  const matched = []
  let cursor = 0
  let totalLen = 0

  for (const piece of pieces) {
    let at = source.indexOf(piece, cursor)
    if (at < 0) at = lower.indexOf(piece.toLowerCase(), cursor)
    if (at < 0) return []
    const end = at + piece.length
    if (at > 0 && /[A-Za-z]/.test(source[at - 1]) && /[A-Za-z]/.test(source[at])) return []
    if (end < source.length && /[A-Za-z]/.test(source[end - 1]) && /[A-Za-z]/.test(source[end])) return []
    matched.push(source.slice(at, end))
    cursor = end
    totalLen += piece.length
  }

  if (totalLen < 3 || totalLen >= source.length - 1) return []
  return matched
}

const ABBREV_RE = /(?:^|[\s(])(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc|e\.g|i\.e|[A-Z])\.$/

/**
 * Split a plain paragraph string into sentence strings on terminal punctuation,
 * avoiding splits after common abbreviations or single-letter initials.
 *
 * @returns {string[]}
 */
export function splitParagraphSentences(rawText) {
  const text = clean(rawText)
  if (!text) return []
  const out = []
  const re = /[.!?]["'”’)\]]*(?=\s|$)/g
  let start = 0
  let m
  while ((m = re.exec(text)) !== null) {
    const end = m.index + m[0].length
    const prefix = text.slice(start, m.index + 1)
    if (ABBREV_RE.test(prefix) && end < text.length) continue
    const sent = clean(text.slice(start, end))
    if (sent) out.push(sent)
    start = end
    while (start < text.length && /\s/.test(text[start])) start += 1
  }
  const tail = clean(text.slice(start))
  if (tail) out.push(tail)
  return out
}

/**
 * Validate model-provided paragraphs.
 * Sentences without a usable Chinese translation are kept (so the article stays
 * intact) but get `zh: ''`, which the client renders as non-revealable.
 *
 * @returns {Array<{gist_zh:string, sentences:Array<{en:string, zh:string, chunks?:string[], core?:string[]}>}> | null}
 */
export function normalizeReportParagraphs(raw) {
  const list =
    typeof raw === 'string'
      ? raw.split(/\n{2,}/).filter(Boolean)
      : Array.isArray(raw)
        ? raw
        : null
  if (!list) return null

  const paragraphs = []
  for (const p of list.slice(0, MAX_PARAGRAPHS)) {
    let rawSentences = null
    let gist = ''
    if (Array.isArray(p)) {
      rawSentences = p
    } else if (typeof p === 'string') {
      rawSentences = splitParagraphSentences(p)
    } else if (p && typeof p === 'object') {
      gist = clean(p.gist_zh || p.gist)
      if (Array.isArray(p.sentences)) {
        rawSentences = p.sentences
      } else if (typeof p.sentences === 'string') {
        rawSentences = splitParagraphSentences(p.sentences)
      } else if (typeof p.text === 'string' || typeof p.en === 'string' || typeof p.content === 'string') {
        rawSentences = splitParagraphSentences(p.text || p.en || p.content)
      } else {
        rawSentences = []
      }
    } else {
      continue
    }

    const sentences = []
    for (const s of rawSentences.slice(0, MAX_SENTENCES)) {
      if (typeof s === 'string') {
        const parsed = parseDelimitedSentence(s)
        if (!parsed.en || !/[A-Za-z]/.test(parsed.en)) continue
        const entry = { en: parsed.en, zh: '' }
        if (parsed.chunks.length >= 2) entry.chunks = parsed.chunks
        sentences.push(entry)
        continue
      }
      if (!s || typeof s !== 'object') continue
      const parsed = parseDelimitedSentence(s.en)
      const en = parsed.en
      if (!en || !/[A-Za-z]/.test(en)) continue
      const zh = clean(s.zh)
      const entry = { en, zh: HAS_CJK.test(zh) ? zh.slice(0, 240) : '' }
      const explicitChunks = normalizeChunks(s.chunks, en)
      const chunks = explicitChunks.length >= 2 ? explicitChunks : parsed.chunks
      const core = normalizeCore(s.core, en)
      if (chunks.length >= 2) entry.chunks = chunks
      if (core.length >= 1) entry.core = core
      sentences.push(entry)
    }
    if (!sentences.length) continue
    paragraphs.push({ gist_zh: HAS_CJK.test(gist) ? gist.slice(0, 80) : '', sentences })
  }
  return paragraphs.length ? paragraphs : null
}

/** Derive the plain article body from structured paragraphs (sentences joined by a space). */
export function joinParagraphs(paragraphs) {
  return (Array.isArray(paragraphs) ? paragraphs : [])
    .map((p) => p.sentences.map((s) => s.en).join(' '))
    .join('\n\n')
}
