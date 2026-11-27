const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export const SHORT_TERM_MS = 5 * MINUTE
export const MIN_GRADUATE_MS = 10 * MINUTE
export const DEFAULT_REQUEST_RETENTION = 0.9
export const MASTERY_STABILITY_DAYS = 90
export const FSRS_MAX_FAMILIARITY = 5

export const FSRS_RATING = {
  AGAIN: 1,
  HARD: 2,
  GOOD: 3,
  EASY: 4,
}

/** Official FSRS-6 default weights (21 parameters). */
export const FSRS_DEFAULT_WEIGHTS = Object.freeze([
  0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194,
  0.001, 1.8722, 0.1666, 0.796, 1.4835, 0.0614, 0.2629,
  1.6483, 0.6014, 1.8729, 0.5425, 0.0912, 0.0658, 0.1542,
])

const DECAY = -FSRS_DEFAULT_WEIGHTS[20]
const FACTOR = Math.pow(0.9, 1 / DECAY) - 1

/** Legacy Ebbinghaus stage intervals in days, used for lazy migration. */
const LEGACY_STAGE_DAYS = [5 / 1440, 30 / 1440, 0.5, 1, 2, 4, 7, 15, 30]

export function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

export function normalizeWordKey(word) {
  return String(word || '').trim().toLowerCase()
}

export function normalizeRating(rating, fallback = FSRS_RATING.GOOD) {
  if (typeof rating === 'string') {
    const key = rating.trim().toLowerCase()
    if (key === 'again') return FSRS_RATING.AGAIN
    if (key === 'hard') return FSRS_RATING.HARD
    if (key === 'good') return FSRS_RATING.GOOD
    if (key === 'easy') return FSRS_RATING.EASY
  }
  const num = Number(rating)
  if (num === 1 || num === 2 || num === 3 || num === 4) return num
  return fallback
}

export function normalizeRetention(r) {
  const num = Number(r)
  if (!Number.isFinite(num)) return DEFAULT_REQUEST_RETENTION
  return Math.round(clamp(num, 0.75, 0.97) * 100) / 100
}

/** FSRS-6 power forgetting curve: R(t, S) = (1 + FACTOR * t / S) ^ (-w[20]). */
export function computeRetrievability(elapsedDays, stability) {
  if (!Number.isFinite(stability) || stability <= 0) return 0
  if (!Number.isFinite(elapsedDays) || elapsedDays <= 0) return 1
  return Math.pow(1 + FACTOR * (elapsedDays / stability), DECAY)
}

/** Solve R(t, S) = r for interval t in days. */
export function nextIntervalDays(stability, requestRetention = DEFAULT_REQUEST_RETENTION) {
  if (!Number.isFinite(stability) || stability <= 0) return 0
  const r = normalizeRetention(requestRetention)
  return Math.max(0, (stability / FACTOR) * (Math.pow(r, 1 / DECAY) - 1))
}

export function initStability(rating) {
  const r = normalizeRating(rating, FSRS_RATING.GOOD)
  return Math.max(0.01, FSRS_DEFAULT_WEIGHTS[r - 1])
}

export function initDifficulty(rating) {
  const r = normalizeRating(rating, FSRS_RATING.GOOD)
  const w = FSRS_DEFAULT_WEIGHTS
  return clamp(w[4] - Math.exp(w[5] * (r - 1)) + 1, 1, 10)
}

export function nextDifficulty(d, rating) {
  const r = normalizeRating(rating, FSRS_RATING.GOOD)
  const w = FSRS_DEFAULT_WEIGHTS
  const delta = -w[6] * (r - 3)
  const dNext = d + delta * ((10 - d) / 9)
  const d0Easy = initDifficulty(FSRS_RATING.EASY)
  return clamp(w[7] * d0Easy + (1 - w[7]) * dNext, 1, 10)
}

export function shortTermStability(s, rating) {
  const r = normalizeRating(rating, FSRS_RATING.GOOD)
  const w = FSRS_DEFAULT_WEIGHTS
  const sSafe = Math.max(0.01, s)
  const sinc = Math.exp(w[17] * (r - 3 + w[18])) * Math.pow(sSafe, -w[19])
  const mult = r >= FSRS_RATING.GOOD ? Math.max(1, sinc) : sinc
  return Math.max(0.01, sSafe * mult)
}

export function nextRecallStability(d, s, r, rating) {
  const g = normalizeRating(rating, FSRS_RATING.GOOD)
  const w = FSRS_DEFAULT_WEIGHTS
  const hardPenalty = g === FSRS_RATING.HARD ? w[15] : 1
  const easyBonus = g === FSRS_RATING.EASY ? w[16] : 1
  const gain =
    Math.exp(w[8]) *
    (11 - d) *
    Math.pow(Math.max(0.01, s), -w[9]) *
    (Math.exp(w[10] * (1 - clamp(r, 0, 1))) - 1) *
    hardPenalty *
    easyBonus
  return Math.max(0.01, s * (1 + gain))
}

export function nextForgetStability(d, s, r) {
  const w = FSRS_DEFAULT_WEIGHTS
  const raw =
    w[11] *
    Math.pow(clamp(d, 1, 10), -w[12]) *
    (Math.pow(Math.max(0.01, s) + 1, w[13]) - 1) *
    Math.exp(w[14] * (1 - clamp(r, 0, 1)))
  return Math.max(0.01, Math.min(Math.max(0.01, s), raw))
}

export function stabilityToFamiliarity(stability, { state, mastered } = {}) {
  if (state === 'new') return 0
  if (mastered === true) return FSRS_MAX_FAMILIARITY
  const s = Number(stability) || 0
  if (s < 1) return 1
  if (s < 4) return 2
  if (s < 14) return 3
  if (s < 40) return 4
  return FSRS_MAX_FAMILIARITY
}

/**
 * Normalize an existing memory record (FSRS-6 or legacy Ebbinghaus stage record)
 * into the canonical FSRS-6 shape without mutating the caller's object.
 */
export function ensureFsrsMemory(mem) {
  if (!mem || typeof mem !== 'object') return null
  const reps = Math.max(0, Number(mem.reps) || 0)
  const lapses = Math.max(0, Number(mem.lapses) || 0)
  const lastAt = Number.isFinite(Number(mem.lastAt)) ? Number(mem.lastAt) : 0
  const dueAt = Number.isFinite(Number(mem.dueAt)) ? Number(mem.dueAt) : null
  const mastered = mem.mastered === true

  if (Number.isFinite(Number(mem.stability)) && Number.isFinite(Number(mem.difficulty))) {
    const rawState = mem.state
    const state =
      rawState === 'learning' || rawState === 'relearning' || rawState === 'review'
        ? rawState
        : mastered
          ? 'review'
          : lapses > 0 && Number(mem.stability) < 0.5
            ? 'relearning'
            : 'review'
    return {
      state,
      stability: Math.max(0.01, Number(mem.stability)),
      difficulty: clamp(Number(mem.difficulty), 1, 10),
      dueAt: mastered ? null : dueAt,
      lastAt,
      reps,
      lapses,
      mastered,
      fsrs: 6,
    }
  }

  // Lazy migration from legacy Ebbinghaus `{ stage, dueAt, lastAt, reps, lapses, mastered }`.
  if (mastered) {
    return {
      state: 'review',
      stability: MASTERY_STABILITY_DAYS,
      difficulty: 3.0,
      dueAt: null,
      lastAt,
      reps,
      lapses,
      mastered: true,
      fsrs: 6,
    }
  }

  const stage = clamp(Math.floor(Number(mem.stage) || 0), 0, LEGACY_STAGE_DAYS.length - 1)
  const state = stage <= 1 ? (lapses > 0 ? 'relearning' : 'learning') : 'review'
  const stability = Math.max(FSRS_DEFAULT_WEIGHTS[0], LEGACY_STAGE_DAYS[stage])
  const difficulty = clamp(5.0 + lapses * 0.8 - stage * 0.25, 1, 10)
  return {
    state,
    stability,
    difficulty,
    dueAt,
    lastAt,
    reps,
    lapses,
    mastered: false,
    fsrs: 6,
  }
}

export function formatIntervalZh(ms, mastered = false) {
  if (mastered || !Number.isFinite(ms) || ms <= 0) return '已掌握'
  if (ms < HOUR) return `${Math.max(1, Math.round(ms / MINUTE))} 分钟后复习`
  if (ms < DAY) return `${Math.max(1, Math.round(ms / HOUR))} 小时后复习`
  return `${Math.max(1, Math.round(ms / DAY))} 天后复习`
}

export function formatIntervalShortZh(ms, mastered = false) {
  if (mastered || !Number.isFinite(ms) || ms <= 0) return '已掌握'
  if (ms < HOUR) return `${Math.max(1, Math.round(ms / MINUTE))} 分钟`
  if (ms < DAY) return `${Math.max(1, Math.round(ms / HOUR))} 小时`
  const days = Math.max(1, Math.round(ms / DAY))
  if (days >= 60) {
    const months = Math.round(days / 30)
    return months >= 12 ? `${Math.round(days / 365)} 年` : `${months} 个月`
  }
  return `${days} 天`
}

function intervalDaysToMs(days) {
  if (!Number.isFinite(days) || days <= 0) return MIN_GRADUATE_MS
  if (days >= 1) return Math.max(1, Math.round(days)) * DAY
  const rawMs = days * DAY
  if (rawMs < HOUR) {
    const mins = Math.max(10, Math.round(rawMs / (5 * MINUTE)) * 5)
    return mins * MINUTE
  }
  const hours = Math.max(1, Math.round(rawMs / HOUR))
  return hours >= 24 ? DAY : hours * HOUR
}

function isEarlyConsolidation(prev, now) {
  if (!prev || prev.mastered === true) return false
  if (!Number.isFinite(prev.dueAt) || now >= prev.dueAt) return false
  if (prev.state === 'learning' || prev.state === 'relearning') return true
  const elapsedDays = prev.lastAt > 0 ? Math.max(0, (now - prev.lastAt) / DAY) : 0
  const r = computeRetrievability(elapsedDays, prev.stability)
  return elapsedDays < 1 / 24 || r >= 0.98
}

function computeRecallCandidate(prev, rating, now, retention) {
  let stability
  let difficulty
  if (!prev) {
    stability = initStability(rating)
    difficulty = initDifficulty(rating)
  } else {
    const elapsedDays = prev.lastAt > 0 ? Math.max(0, (now - prev.lastAt) / DAY) : 0
    if (prev.state === 'learning' || prev.state === 'relearning' || elapsedDays < 1) {
      stability = shortTermStability(prev.stability, rating)
    } else {
      const r = computeRetrievability(elapsedDays, prev.stability)
      stability = nextRecallStability(prev.difficulty, prev.stability, r, rating)
    }
    difficulty = nextDifficulty(prev.difficulty, rating)
  }

  let intervalMs = intervalDaysToMs(nextIntervalDays(stability, retention))
  if (prev && prev.state === 'review' && Number.isFinite(prev.dueAt) && now < prev.dueAt && rating >= FSRS_RATING.GOOD) {
    const remaining = Math.max(MIN_GRADUATE_MS, prev.dueAt - now)
    if (intervalMs < remaining) {
      intervalMs = remaining >= DAY ? Math.ceil(remaining / DAY) * DAY : Math.ceil(remaining / HOUR) * HOUR
    }
  }
  const mastered = rating >= FSRS_RATING.GOOD && stability >= MASTERY_STABILITY_DAYS
  return {
    rating,
    stability,
    difficulty,
    intervalMs: mastered ? 0 : intervalMs,
    mastered,
  }
}

function computeMonotonicCandidates(prev, now, retention) {
  const hard = computeRecallCandidate(prev, FSRS_RATING.HARD, now, retention)
  const good = computeRecallCandidate(prev, FSRS_RATING.GOOD, now, retention)
  const easy = computeRecallCandidate(prev, FSRS_RATING.EASY, now, retention)

  if (!good.mastered && good.intervalMs <= hard.intervalMs) {
    good.intervalMs = hard.intervalMs + (hard.intervalMs >= DAY ? DAY : HOUR)
  }
  if (!easy.mastered && !good.mastered && easy.intervalMs <= good.intervalMs) {
    easy.intervalMs = good.intervalMs + (good.intervalMs >= DAY ? DAY : HOUR)
  }

  return {
    [FSRS_RATING.HARD]: hard,
    [FSRS_RATING.GOOD]: good,
    [FSRS_RATING.EASY]: easy,
  }
}

function roundStat(n, digits = 2) {
  const f = Math.pow(10, digits)
  return Math.round((Number(n) || 0) * f) / f
}

/**
 * Compute updated FSRS-6 memory record after a spelling check or rating adjustment.
 * Clean first-try recall advances along FSRS-6; misses or retries after a
 * miss/reveal enter 5m short-term consolidation to prevent gaming intervals.
 */
export function applyWordReview(
  prevMem,
  { correct, clean = true, rating, countLapse = !correct, now = Date.now(), requestRetention = DEFAULT_REQUEST_RETENTION } = {},
) {
  const prev = ensureFsrsMemory(prevMem)
  const retention = normalizeRetention(requestRetention)
  const reps = prev ? prev.reps : 0
  const lapses = prev ? prev.lapses : 0

  const requestedRating = rating !== undefined ? normalizeRating(rating, FSRS_RATING.GOOD) : null

  // Miss or explicit Again rating -> short-term consolidation (5m)
  if (!correct || (clean && requestedRating === FSRS_RATING.AGAIN)) {
    let stability
    let difficulty
    let state
    if (!prev) {
      stability = initStability(FSRS_RATING.AGAIN)
      difficulty = initDifficulty(FSRS_RATING.AGAIN)
      state = 'learning'
    } else {
      const elapsedDays = prev.lastAt > 0 ? Math.max(0, (now - prev.lastAt) / DAY) : 0
      const r = prev.mastered ? 0.5 : computeRetrievability(elapsedDays, prev.stability)
      stability =
        prev.state === 'learning' || prev.state === 'relearning'
          ? shortTermStability(prev.stability, FSRS_RATING.AGAIN)
          : nextForgetStability(prev.difficulty, prev.stability, r)
      difficulty = nextDifficulty(prev.difficulty, FSRS_RATING.AGAIN)
      state = prev.state === 'learning' && reps <= 1 ? 'learning' : 'relearning'
    }
    const nextLapses = !correct && countLapse ? lapses + 1 : lapses
    const memory = {
      state,
      stability: roundStat(stability, 4),
      difficulty: roundStat(difficulty, 4),
      dueAt: now + SHORT_TERM_MS,
      lastAt: now,
      reps: reps + 1,
      lapses: nextLapses,
      mastered: false,
      fsrs: 6,
    }
    return {
      memory,
      rating: FSRS_RATING.AGAIN,
      state,
      stability: memory.stability,
      difficulty: memory.difficulty,
      retrievability: 0,
      familiarity: stabilityToFamiliarity(memory.stability, { state, mastered: false }),
      maxFamiliarity: FSRS_MAX_FAMILIARITY,
      mastered: false,
      nextIntervalMs: SHORT_TERM_MS,
      nextReviewText: '5 分钟后再次巩固',
      clean: false,
      early: false,
    }
  }

  // Retry-after-miss/reveal spelled right (clean=false) -> stay in 5m consolidation without inflating stability
  if (!clean) {
    const stability = prev ? prev.stability : initStability(FSRS_RATING.AGAIN)
    const difficulty = prev ? prev.difficulty : initDifficulty(FSRS_RATING.AGAIN)
    const state = prev ? (prev.state === 'review' ? 'relearning' : prev.state) : 'learning'
    const memory = {
      state,
      stability: roundStat(stability, 4),
      difficulty: roundStat(difficulty, 4),
      dueAt: now + SHORT_TERM_MS,
      lastAt: now,
      reps: reps + 1,
      lapses,
      mastered: false,
      fsrs: 6,
    }
    return {
      memory,
      rating: FSRS_RATING.AGAIN,
      state,
      stability: memory.stability,
      difficulty: memory.difficulty,
      retrievability: 0,
      familiarity: stabilityToFamiliarity(memory.stability, { state, mastered: false }),
      maxFamiliarity: FSRS_MAX_FAMILIARITY,
      mastered: false,
      nextIntervalMs: SHORT_TERM_MS,
      nextReviewText: '5 分钟后再次巩固',
      clean: false,
      early: false,
    }
  }

  // Already mastered word reviewed cleanly -> keep mastered
  if (prev && prev.mastered === true) {
    const memory = {
      ...prev,
      dueAt: null,
      lastAt: now,
      reps: reps + 1,
      mastered: true,
      fsrs: 6,
    }
    return {
      memory,
      rating: requestedRating || FSRS_RATING.GOOD,
      state: 'review',
      stability: memory.stability,
      difficulty: memory.difficulty,
      retrievability: 100,
      familiarity: FSRS_MAX_FAMILIARITY,
      maxFamiliarity: FSRS_MAX_FAMILIARITY,
      mastered: true,
      nextIntervalMs: 0,
      nextReviewText: '已掌握',
      clean: true,
      early: false,
      wasMastered: true,
    }
  }

  // Early consolidation before dueAt (learning/relearning or high retrievability review) -> preserve schedule
  if (isEarlyConsolidation(prev, now)) {
    const remainingMs = Math.max(1, prev.dueAt - now)
    const memory = {
      ...prev,
      lastAt: now,
      reps: reps + 1,
      mastered: false,
      fsrs: 6,
    }
    return {
      memory,
      rating: requestedRating || FSRS_RATING.GOOD,
      state: memory.state,
      stability: memory.stability,
      difficulty: memory.difficulty,
      retrievability: 100,
      familiarity: stabilityToFamiliarity(memory.stability, { state: memory.state, mastered: false }),
      maxFamiliarity: FSRS_MAX_FAMILIARITY,
      mastered: false,
      nextIntervalMs: remainingMs,
      nextReviewText: `提前巩固 · 仍于 ${formatIntervalZh(remainingMs, false)}`,
      clean: true,
      early: true,
    }
  }

  // Normal clean FSRS-6 progression
  const effRating = requestedRating && requestedRating >= FSRS_RATING.HARD ? requestedRating : FSRS_RATING.GOOD
  const candidates = computeMonotonicCandidates(prev, now, retention)
  const chosen = candidates[effRating]
  const mastered = chosen.mastered
  const memory = {
    state: 'review',
    stability: roundStat(chosen.stability, 4),
    difficulty: roundStat(chosen.difficulty, 4),
    dueAt: mastered ? null : now + chosen.intervalMs,
    lastAt: now,
    reps: reps + 1,
    lapses,
    mastered,
    fsrs: 6,
  }
  return {
    memory,
    rating: effRating,
    state: 'review',
    stability: memory.stability,
    difficulty: memory.difficulty,
    retrievability: 100,
    familiarity: stabilityToFamiliarity(memory.stability, { state: 'review', mastered }),
    maxFamiliarity: FSRS_MAX_FAMILIARITY,
    mastered,
    nextIntervalMs: mastered ? 0 : chosen.intervalMs,
    nextReviewText: mastered ? '已掌握' : formatIntervalZh(chosen.intervalMs, false),
    clean: true,
    early: false,
  }
}

/** Preview Hard/Good/Easy intervals for a clean recall on `prevMem`. */
export function previewWordRatings(
  prevMem,
  { now = Date.now(), requestRetention = DEFAULT_REQUEST_RETENTION } = {},
) {
  const prev = ensureFsrsMemory(prevMem)
  if (prev && prev.mastered === true) return null
  if (isEarlyConsolidation(prev, now)) return null
  const retention = normalizeRetention(requestRetention)
  const candidates = computeMonotonicCandidates(prev, now, retention)
  return {
    hard: {
      rating: FSRS_RATING.HARD,
      intervalMs: candidates[FSRS_RATING.HARD].intervalMs,
      text: formatIntervalShortZh(candidates[FSRS_RATING.HARD].intervalMs, false),
      mastered: false,
    },
    good: {
      rating: FSRS_RATING.GOOD,
      intervalMs: candidates[FSRS_RATING.GOOD].intervalMs,
      text: formatIntervalShortZh(candidates[FSRS_RATING.GOOD].intervalMs, candidates[FSRS_RATING.GOOD].mastered),
      mastered: candidates[FSRS_RATING.GOOD].mastered,
    },
    easy: {
      rating: FSRS_RATING.EASY,
      intervalMs: candidates[FSRS_RATING.EASY].intervalMs,
      text: formatIntervalShortZh(candidates[FSRS_RATING.EASY].intervalMs, candidates[FSRS_RATING.EASY].mastered),
      mastered: candidates[FSRS_RATING.EASY].mastered,
    },
  }
}

/** Immediately mark a word as mastered so it leaves active review scheduling. */
export function markWordMastered(prevMem, now = Date.now()) {
  const prev = ensureFsrsMemory(prevMem)
  return {
    state: 'review',
    stability: Math.max(MASTERY_STABILITY_DAYS, (prev && prev.stability) || 0),
    difficulty: prev ? prev.difficulty : 3.0,
    dueAt: null,
    lastAt: now,
    reps: prev ? prev.reps : 0,
    lapses: prev ? prev.lapses : 0,
    mastered: true,
    fsrs: 6,
  }
}

/** Inspect current FSRS metrics for display in UI cards and tooltips. */
export function inspectWordMemory(mem, now = Date.now()) {
  const fsrs = ensureFsrsMemory(mem)
  if (!fsrs) {
    return {
      state: 'new',
      stability: 0,
      difficulty: 0,
      retrievability: null,
      familiarity: 0,
      maxFamiliarity: FSRS_MAX_FAMILIARITY,
      reps: 0,
      lapses: 0,
      mastered: false,
      isHardWord: false,
    }
  }
  let retrievability = null
  if (!fsrs.mastered && fsrs.lastAt > 0) {
    const elapsedDays = Math.max(0, (now - fsrs.lastAt) / DAY)
    retrievability = Math.round(computeRetrievability(elapsedDays, fsrs.stability) * 100)
  }
  return {
    state: fsrs.state,
    stability: roundStat(fsrs.stability, 1),
    difficulty: roundStat(fsrs.difficulty, 1),
    retrievability,
    familiarity: stabilityToFamiliarity(fsrs.stability, { state: fsrs.state, mastered: fsrs.mastered }),
    maxFamiliarity: FSRS_MAX_FAMILIARITY,
    reps: fsrs.reps,
    lapses: fsrs.lapses,
    mastered: fsrs.mastered,
    isHardWord: !fsrs.mastered && (fsrs.difficulty >= 7.5 || fsrs.lapses >= 2),
  }
}

/** Summarize SRS counts for the active word bank. */
export function summarizeBankMemory(entries, wordMemory, now = Date.now()) {
  const memMap = wordMemory && typeof wordMemory === 'object' ? wordMemory : {}
  const seen = new Set()
  let total = 0
  let due = 0
  let learning = 0
  let mastered = 0

  for (const entry of Array.isArray(entries) ? entries : []) {
    const key = normalizeWordKey(entry && entry.word)
    if (!key || seen.has(key)) continue
    seen.add(key)
    total += 1
    const mem = memMap[key]
    if (!mem || typeof mem !== 'object') continue
    if (mem.mastered === true) {
      mastered += 1
    } else {
      learning += 1
      if (Number.isFinite(mem.dueAt) && mem.dueAt <= now) due += 1
    }
  }

  return {
    total,
    due,
    learning,
    mastered,
    unseen: Math.max(0, total - learning - mastered),
  }
}

function dueRetrievability(mem, now) {
  if (mem.lastAt > 0) {
    return computeRetrievability(Math.max(0, (now - mem.lastAt) / DAY), mem.stability)
  }
  const overdueDays = Number.isFinite(mem.dueAt) ? Math.max(0, (now - mem.dueAt) / DAY) : 0
  return computeRetrievability(overdueDays + mem.stability, mem.stability)
}

/**
 * Pick the next word for practice using FSRS-6 scheduling.
 * Modes:
 *  - 'smart' (default): due words first (short-term consolidation first, then lowest retrievability R),
 *    interleaving 1 unseen word after 3 consecutive reviews
 *  - 'review': only due words; returns { entry: null, kind: 'done', reason: 'no_due' } when clear
 *  - 'new': unseen words first, falling back to due/upcoming/mastered when all seen
 */
export function pickWordSrs(
  entries,
  wordMemory,
  { mode = 'smart', recent = [], reviewStreak = 0, now = Date.now(), rng = Math.random } = {},
) {
  const list = Array.isArray(entries) ? entries : []
  if (!list.length) return { entry: null, kind: 'done', reason: 'empty', nextReviewStreak: 0 }

  const normMode = mode === 'review' || mode === 'new' ? mode : 'smart'
  const memMap = wordMemory && typeof wordMemory === 'object' ? wordMemory : {}
  const recentKeys = (Array.isArray(recent) ? recent : []).map(normalizeWordKey).filter(Boolean)
  const avoid = new Set(recentKeys.slice(-3))
  const lastKey = recentKeys.length ? recentKeys[recentKeys.length - 1] : ''

  const dueList = []
  const unseenList = []
  const upcomingList = []
  const masteredList = []

  for (const entry of list) {
    const key = normalizeWordKey(entry && entry.word)
    if (!key) continue
    const rawMem = memMap[key]
    const mem = ensureFsrsMemory(rawMem)
    if (!mem) {
      unseenList.push(entry)
    } else if (mem.mastered === true) {
      masteredList.push(entry)
    } else if (Number.isFinite(mem.dueAt) && mem.dueAt <= now) {
      dueList.push({ entry, mem, r: dueRetrievability(mem, now) })
    } else {
      upcomingList.push({ entry, mem })
    }
  }

  // Short-term consolidation (learning/relearning) first by dueAt, then review cards by lowest R first.
  dueList.sort((a, b) => {
    const aShort = a.mem.state === 'learning' || a.mem.state === 'relearning' ? 0 : 1
    const bShort = b.mem.state === 'learning' || b.mem.state === 'relearning' ? 0 : 1
    if (aShort !== bShort) return aShort - bShort
    if (aShort === 0) return (Number(a.mem.dueAt) || 0) - (Number(b.mem.dueAt) || 0)
    if (Math.abs(a.r - b.r) > 1e-6) return a.r - b.r
    return (Number(a.mem.dueAt) || 0) - (Number(b.mem.dueAt) || 0)
  })

  upcomingList.sort((a, b) => (Number(a.mem.dueAt) || Infinity) - (Number(b.mem.dueAt) || Infinity))

  const sortedDue = dueList.map((x) => x.entry)
  const sortedUpcoming = upcomingList.map((x) => x.entry)

  const choose = (pool, randomPick) => {
    if (!pool.length) return null
    if (pool.length === 1) return pool[0]
    const filtered = pool.filter((e) => !avoid.has(normalizeWordKey(e.word)))
    if (filtered.length) {
      return randomPick ? filtered[Math.floor(rng() * filtered.length)] : filtered[0]
    }
    const notLast = lastKey ? pool.filter((e) => normalizeWordKey(e.word) !== lastKey) : pool
    const candidates = notLast.length ? notLast : pool
    if (randomPick) return candidates[Math.floor(rng() * candidates.length)]
    let bestEntry = candidates[0]
    let bestRecency = Infinity
    for (const entry of candidates) {
      const recency = recentKeys.lastIndexOf(normalizeWordKey(entry.word))
      if (recency < bestRecency) {
        bestRecency = recency
        bestEntry = entry
      }
    }
    return bestEntry
  }

  if (normMode === 'review') {
    if (sortedDue.length) {
      return { entry: choose(sortedDue, false), kind: 'review', nextReviewStreak: reviewStreak + 1 }
    }
    return { entry: null, kind: 'done', reason: 'no_due', nextReviewStreak: 0 }
  }

  if (normMode === 'new') {
    if (unseenList.length) {
      return { entry: choose(unseenList, true), kind: 'new', nextReviewStreak: 0 }
    }
    if (sortedDue.length) {
      return { entry: choose(sortedDue, false), kind: 'review', nextReviewStreak: reviewStreak + 1 }
    }
    if (sortedUpcoming.length) {
      return { entry: choose(sortedUpcoming, false), kind: 'upcoming', nextReviewStreak: 0 }
    }
    return { entry: choose(masteredList.length ? masteredList : list, true), kind: 'mastered', nextReviewStreak: 0 }
  }

  // 'smart' mode: due words first, weave 1 unseen word every 3 reviews when unseen words remain.
  if (sortedDue.length && !(unseenList.length && reviewStreak >= 3)) {
    return { entry: choose(sortedDue, false), kind: 'review', nextReviewStreak: reviewStreak + 1 }
  }
  if (unseenList.length) {
    return { entry: choose(unseenList, true), kind: 'new', nextReviewStreak: 0 }
  }
  if (sortedDue.length) {
    return { entry: choose(sortedDue, false), kind: 'review', nextReviewStreak: reviewStreak + 1 }
  }
  if (sortedUpcoming.length) {
    return { entry: choose(sortedUpcoming, false), kind: 'upcoming', nextReviewStreak: 0 }
  }
  return { entry: choose(masteredList.length ? masteredList : list, true), kind: 'mastered', nextReviewStreak: 0 }
}
