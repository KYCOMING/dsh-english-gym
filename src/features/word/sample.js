import { resolveActiveBank } from './banks.js'

const WORD_RE = /^[A-Za-z][A-Za-z' -]{1,23}$/

function clean(word) {
  return String(word || '').trim()
}

function shuffle(list) {
  const arr = list.slice()
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function toCandidate(entry) {
  return {
    word: clean(entry.word),
    meaning: String(entry.meaning || '').trim().slice(0, 40),
    pos: String(entry.pos || '').trim(),
  }
}

/**
 * Pick a handful of words from the learner's active word bank, for prompts that
 * should softly incorporate current vocabulary. Prefers recently studied words
 * (up to half the pool) and fills the rest with random bank words.
 *
 * @returns {Array<{word:string, meaning:string, pos:string}>}
 */
export function pickBankCandidates(dir, state, count = 24) {
  const bank = resolveActiveBank(dir, state)
  const entries = bank && Array.isArray(bank.entries) ? bank.entries : []
  const wanted = Math.max(1, Math.min(60, Number(count) || 24))

  const byWord = new Map()
  for (const entry of entries) {
    const word = clean(entry && entry.word)
    if (!word || !WORD_RE.test(word)) continue
    if (word.length < 2 || word.length > 24) continue
    const key = word.toLowerCase()
    if (byWord.has(key)) continue
    byWord.set(key, toCandidate(entry))
  }
  const all = Array.from(byWord.values())
  if (!all.length) return []

  const recent = new Set((state && Array.isArray(state.wordRecent) ? state.wordRecent : []).map((w) => String(w).toLowerCase()))
  const recentPool = all.filter((item) => recent.has(item.word.toLowerCase()))
  const restPool = all.filter((item) => !recent.has(item.word.toLowerCase()))

  const picked = []
  const seen = new Set()
  const takeFrom = (pool, limit) => {
    for (const item of shuffle(pool)) {
      if (picked.length >= wanted || limit <= 0) return
      if (seen.has(item.word.toLowerCase())) continue
      seen.add(item.word.toLowerCase())
      picked.push(item)
      limit -= 1
    }
  }

  takeFrom(recentPool, Math.ceil(wanted / 2))
  takeFrom(restPool, wanted - picked.length)
  // Small banks may not fill the quota; top up from whatever is left.
  if (picked.length < wanted) takeFrom(all, wanted - picked.length)
  return picked
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Which of the candidate words actually appear in the generated English text. */
export function usedBankWords(text, candidates) {
  const source = String(text || '')
  const lower = source.toLowerCase()
  const used = []
  for (const item of candidates || []) {
    const term = clean(item && item.word).toLowerCase()
    if (!term) continue
    if (/\s/.test(term)) {
      if (lower.includes(term)) used.push(item.word)
    } else {
      const re = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i')
      if (re.test(source)) used.push(item.word)
    }
  }
  return used
}

/** One line per candidate, for the prompt. */
export function formatCandidateList(candidates) {
  return (candidates || [])
    .map((item) => `- ${item.word}${item.pos ? ` (${item.pos})` : ''}: ${item.meaning}`)
    .join('\n')
}
