const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** Ebbinghaus stepped intervals (9 stages -> mastered). */
export const SRS_INTERVALS_MS = [
  5 * MINUTE,
  30 * MINUTE,
  12 * HOUR,
  1 * DAY,
  2 * DAY,
  4 * DAY,
  7 * DAY,
  15 * DAY,
  30 * DAY,
]

export const SRS_MAX_STAGE = SRS_INTERVALS_MS.length
export const INITIAL_CLEAN_STAGE = 2

export function normalizeWordKey(word) {
  return String(word || '').trim().toLowerCase()
}

export function formatIntervalZh(ms, mastered = false) {
  if (mastered || !Number.isFinite(ms) || ms <= 0) return '已掌握'
  if (ms < HOUR) return `${Math.max(1, Math.round(ms / MINUTE))} 分钟后复习`
  if (ms < DAY) return `${Math.max(1, Math.round(ms / HOUR))} 小时后复习`
  return `${Math.max(1, Math.round(ms / DAY))} 天后复习`
}

/**
 * Compute updated SRS memory record after a spelling check.
 * Clean first-try recall advances along the curve; misses or retries after a
 * miss/reveal stay in short-term consolidation (5m) to prevent cheating.
 */
export function applyWordReview(prevMem, { correct, clean = true, countLapse = !correct, now = Date.now() } = {}) {
  const prev = prevMem && typeof prevMem === 'object' ? prevMem : null
  const reps = (prev && Number(prev.reps)) || 0
  const lapses = (prev && Number(prev.lapses)) || 0

  if (!correct) {
    const nextIntervalMs = SRS_INTERVALS_MS[0]
    const nextLapses = countLapse ? lapses + 1 : lapses
    return {
      memory: {
        stage: 0,
        dueAt: now + nextIntervalMs,
        lastAt: now,
        reps: reps + 1,
        lapses: nextLapses,
        mastered: false,
      },
      stage: 0,
      maxStage: SRS_MAX_STAGE,
      mastered: false,
      nextIntervalMs,
      nextReviewText: '5 分钟后再次巩固',
      clean: false,
    }
  }

  if (!clean) {
    const nextIntervalMs = SRS_INTERVALS_MS[0]
    return {
      memory: {
        stage: 0,
        dueAt: now + nextIntervalMs,
        lastAt: now,
        reps: reps + 1,
        lapses,
        mastered: false,
      },
      stage: 0,
      maxStage: SRS_MAX_STAGE,
      mastered: false,
      nextIntervalMs,
      nextReviewText: '5 分钟后再次巩固',
      clean: false,
    }
  }

  const isEarly = Boolean(prev && prev.mastered !== true && Number.isFinite(prev.dueAt) && now < prev.dueAt)
  if (isEarly) {
    const keepStage = Math.max(0, Math.min(SRS_MAX_STAGE - 1, Number(prev.stage) || 0))
    const remainingMs = Math.max(1, prev.dueAt - now)
    return {
      memory: {
        stage: keepStage,
        dueAt: prev.dueAt,
        lastAt: now,
        reps: reps + 1,
        lapses,
        mastered: false,
      },
      stage: keepStage,
      maxStage: SRS_MAX_STAGE,
      mastered: false,
      nextIntervalMs: remainingMs,
      nextReviewText: `提前巩固 · 仍于 ${formatIntervalZh(remainingMs, false)}`,
      clean: true,
      early: true,
    }
  }

  const nextStage = prev ? Math.min(SRS_MAX_STAGE, (Number(prev.stage) || 0) + 1) : INITIAL_CLEAN_STAGE
  if (nextStage >= SRS_MAX_STAGE) {
    return {
      memory: {
        stage: SRS_MAX_STAGE,
        dueAt: null,
        lastAt: now,
        reps: reps + 1,
        lapses,
        mastered: true,
      },
      stage: SRS_MAX_STAGE,
      maxStage: SRS_MAX_STAGE,
      mastered: true,
      nextIntervalMs: 0,
      nextReviewText: '已掌握',
      clean: true,
    }
  }

  const nextIntervalMs = SRS_INTERVALS_MS[nextStage]
  return {
    memory: {
      stage: nextStage,
      dueAt: now + nextIntervalMs,
      lastAt: now,
      reps: reps + 1,
      lapses,
      mastered: false,
    },
    stage: nextStage,
    maxStage: SRS_MAX_STAGE,
    mastered: false,
    nextIntervalMs,
    nextReviewText: formatIntervalZh(nextIntervalMs, false),
    clean: true,
  }
}

/** Immediately mark a word as mastered so it leaves active review scheduling. */
export function markWordMastered(prevMem, now = Date.now()) {
  const prev = prevMem && typeof prevMem === 'object' ? prevMem : null
  return {
    stage: SRS_MAX_STAGE,
    dueAt: null,
    lastAt: now,
    reps: (prev && Number(prev.reps)) || 0,
    lapses: (prev && Number(prev.lapses)) || 0,
    mastered: true,
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

/**
 * Pick the next word for practice using Ebbinghaus scheduling.
 * Modes:
 *  - 'smart' (default): due words first, interleaving 1 unseen word after 3 consecutive reviews
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
    const mem = memMap[key]
    if (!mem || typeof mem !== 'object') {
      unseenList.push(entry)
    } else if (mem.mastered === true) {
      masteredList.push(entry)
    } else if (Number.isFinite(mem.dueAt) && mem.dueAt <= now) {
      dueList.push({ entry, mem })
    } else {
      upcomingList.push({ entry, mem })
    }
  }

  // Short-term consolidation (stage <= 1) first, then most overdue first.
  dueList.sort((a, b) => {
    const aShort = (Number(a.mem.stage) || 0) <= 1 ? 0 : 1
    const bShort = (Number(b.mem.stage) || 0) <= 1 ? 0 : 1
    if (aShort !== bShort) return aShort - bShort
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
