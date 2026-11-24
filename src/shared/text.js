/** Text helpers shared by the phrase and word drills. */

/** Normalize an English answer for a cheap exact/fuzzy comparison. */
export function normalize(text) {
  return String(text || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[.!?,;:]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function words(text) {
  return normalize(text)
    .replace(/[^a-z0-9' ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

/** Jaccard-ish token overlap in [0,1]. */
export function tokenOverlap(a, b) {
  const A = new Set(words(a))
  const B = new Set(words(b))
  if (A.size === 0 || B.size === 0) return 0
  let inter = 0
  for (const w of A) if (B.has(w)) inter += 1
  return inter / Math.max(A.size, B.size)
}

export function escapeRegExp(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function targetTokenRegex(word) {
  return new RegExp(`(?<![A-Za-z0-9'’-])${escapeRegExp(word)}(?![A-Za-z0-9'’-])`, 'gi')
}

function countSubstring(text, needle) {
  if (!needle) return 0
  let count = 0
  let from = 0
  while (true) {
    const index = text.indexOf(needle, from)
    if (index < 0) return count
    count += 1
    from = index + needle.length
  }
}

/**
 * Replace every standalone occurrence of `word` with "____".
 * Only safe when the word does not also appear inside other tokens
 * (abandoned / unhappy / counterexample) — those would leak the spelling.
 */
export function blankTarget(text, word) {
  const sentence = String(text || '')
  const target = String(word || '').trim()
  if (!sentence || !target) return { text: '', ok: false }
  const tokens = sentence.match(targetTokenRegex(target)) || []
  if (!tokens.length) return { text: '', ok: false }
  const substringCount = countSubstring(sentence.toLowerCase(), target.toLowerCase())
  if (substringCount !== tokens.length) return { text: '', ok: false }
  return { text: sentence.replace(targetTokenRegex(target), '____'), ok: true }
}

/** Pre-answer payload: the sentence with the target blanked, or '' when unsafe. */
export function scrubExample(word, example) {
  const result = blankTarget(example, word)
  return result.ok ? result.text : ''
}

/** Quality gate used by the generator/verifier. */
export function isCleanExample(word, example, exampleZh) {
  const en = String(example || '').trim()
  const zh = String(exampleZh || '').trim()
  if (en.length < 10 || en.length > 200) return false
  if (!/^[\x20-\x7E]+$/.test(en)) return false
  if (!/^[A-Z"']/.test(en)) return false
  if (!/[.?!]["']?$/.test(en)) return false
  if (!blankTarget(en, word).ok) return false
  if (zh.length < 4 || zh.length > 160) return false
  if (!/[\u4e00-\u9fff]/.test(zh)) return false
  if (/[A-Za-z]/.test(zh)) return false
  return true
}
