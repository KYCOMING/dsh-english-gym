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
