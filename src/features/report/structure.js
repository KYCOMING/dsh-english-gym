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

/**
 * Validate model-provided paragraphs.
 * Sentences without a usable Chinese translation are kept (so the article stays
 * intact) but get `zh: ''`, which the client renders as non-revealable.
 *
 * @returns {Array<{gist_zh:string, sentences:Array<{en:string, zh:string, chunks?:string[], core?:string[]}>}> | null}
 */
export function normalizeReportParagraphs(raw) {
  if (!Array.isArray(raw)) return null
  const paragraphs = []
  for (const p of raw.slice(0, MAX_PARAGRAPHS)) {
    if (!p || typeof p !== 'object') continue
    const sentences = []
    for (const s of Array.isArray(p.sentences) ? p.sentences.slice(0, MAX_SENTENCES) : []) {
      if (!s || typeof s !== 'object') continue
      const en = clean(s.en)
      if (!en || !/[A-Za-z]/.test(en)) continue
      const zh = clean(s.zh)
      const entry = { en, zh: HAS_CJK.test(zh) ? zh.slice(0, 240) : '' }
      const chunks = normalizeChunks(s.chunks, en)
      const core = normalizeCore(s.core, en)
      if (chunks.length >= 2) entry.chunks = chunks
      if (core.length >= 1) entry.core = core
      sentences.push(entry)
    }
    if (!sentences.length) continue
    const gist = clean(p.gist_zh || p.gist)
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
