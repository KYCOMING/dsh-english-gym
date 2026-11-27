import { resolveActiveBank } from './banks.js'
import { computeRetrievability, ensureFsrsMemory } from './srs.js'

const DAY_MS = 24 * 60 * 60 * 1000

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

  const memMap = state && state.wordMemory && typeof state.wordMemory === 'object' ? state.wordMemory : {}
  const now = Date.now()
  const recent = new Set((state && Array.isArray(state.wordRecent) ? state.wordRecent : []).map((w) => String(w).toLowerCase()))

  const dueOrLapsedPool = []
  const learningPool = []
  const recentPool = []
  const restPool = []

  for (const item of all) {
    const key = item.word.toLowerCase()
    const fsrs = ensureFsrsMemory(memMap[key])
    if (fsrs) {
      if (fsrs.mastered === true) continue
      const isDue = Number.isFinite(fsrs.dueAt) && fsrs.dueAt <= now
      const elapsedDays = fsrs.lastAt > 0 ? Math.max(0, (now - fsrs.lastAt) / DAY_MS) : 0
      const r = fsrs.lastAt > 0 ? computeRetrievability(elapsedDays, fsrs.stability) : 1
      if (isDue || fsrs.lapses > 0 || fsrs.difficulty >= 7 || r < 0.85) dueOrLapsedPool.push(item)
      else learningPool.push(item)
    } else if (recent.has(key)) {
      recentPool.push(item)
    } else {
      restPool.push(item)
    }
  }

  const picked = []
  const seen = new Set()
  const takeFrom = (pool, limit) => {
    for (const item of shuffle(pool)) {
      if (picked.length >= wanted || limit <= 0) return
      const key = item.word.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      picked.push(item)
      limit -= 1
    }
  }

  const srsBudget = Math.ceil(wanted / 2)
  takeFrom(dueOrLapsedPool, srsBudget)
  takeFrom(learningPool, Math.max(0, srsBudget - picked.length))
  takeFrom(recentPool, Math.max(0, Math.ceil(wanted / 2) - picked.length))
  takeFrom(restPool, wanted - picked.length)
  // Small banks or mostly-mastered banks may not fill the quota; top up from whatever is left.
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
