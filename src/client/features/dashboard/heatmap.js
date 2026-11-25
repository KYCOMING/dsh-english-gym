export function pad2(n) {
  return String(n).padStart(2, '0')
}

export function dayStr(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function levelOf(n) {
  const count = Number(n) || 0
  if (count > 60) return 4
  if (count >= 31) return 3
  if (count >= 11) return 2
  if (count >= 1) return 1
  return 0
}

function parseDay(str) {
  if (typeof str === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const d = new Date(str + 'T00:00:00')
    if (!Number.isNaN(d.getTime())) return d
  }
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/**
 * Build a column-major GitHub-style contribution heatmap grid (7 rows Sun..Sat).
 * Supports `range: 'last-year'` (53 weeks ending today) or a 4-digit year string.
 */
export function buildContributionGrid({ todayStr, range = 'last-year', activityMap = {} } = {}) {
  const today = parseDay(todayStr)
  const todayKey = dayStr(today)
  const map = activityMap && typeof activityMap === 'object' ? activityMap : {}
  const isYear = typeof range === 'string' && /^\d{4}$/.test(range)

  let startDate
  let endDate
  let gridStart
  let gridEnd

  if (isYear) {
    const yr = Number(range)
    startDate = new Date(yr, 0, 1)
    endDate = new Date(yr, 11, 31)
    gridStart = new Date(yr, 0, 1 - startDate.getDay())
    gridEnd = new Date(yr, 11, 31 + (6 - endDate.getDay()))
  } else {
    const endSunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
    startDate = new Date(endSunday.getFullYear(), endSunday.getMonth(), endSunday.getDate() - 52 * 7)
    endDate = today
    gridStart = startDate
    gridEnd = new Date(endSunday.getFullYear(), endSunday.getMonth(), endSunday.getDate() + 6)
  }

  const weeks = []
  let rangeTotal = 0
  let rangeDays = 0

  for (let cur = new Date(gridStart.getTime()); cur <= gridEnd; ) {
    const col = []
    for (let row = 0; row < 7; row += 1) {
      const date = new Date(cur.getTime())
      const key = dayStr(date)
      const out = date < startDate || date > endDate
      const future = key > todayKey
      const act = !out ? map[key] || null : null
      const total = act ? Number(act.total) || 0 : 0
      const level = !out ? levelOf(total) : 0
      if (!out && act && total > 0) {
        rangeTotal += total
        rangeDays += 1
      }
      col.push({
        key,
        date,
        out,
        future,
        isToday: !out && key === todayKey,
        activity: act,
        level,
      })
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(col)
  }

  const monthLabels = []
  let lastCol = -10
  for (let colIdx = 0; colIdx < weeks.length; colIdx += 1) {
    const col = weeks[colIdx]
    let targetCell = col.find((c) => !c.out && c.date.getDate() === 1)
    if (!targetCell && colIdx === 0) {
      targetCell = col.find((c) => !c.out)
    }
    if (!targetCell) continue
    if (colIdx - lastCol < 3) continue
    monthLabels.push({
      col: colIdx,
      label: `${targetCell.date.getMonth() + 1}月`,
    })
    lastCol = colIdx
  }

  return {
    weeks,
    monthLabels,
    rangeTotal,
    rangeDays,
  }
}

/** Build compact page numbers with '...' ellipses (e.g. [1, '...', 4, 5, 6, '...', 73]). */
export function getPageItems(totalPages, currentPage) {
  const total = Math.max(1, Math.floor(Number(totalPages) || 1))
  const current = Math.max(1, Math.min(total, Math.floor(Number(currentPage) || 1)))
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)
  const items = []
  let prev = 0
  for (const p of sorted) {
    if (prev && p - prev > 1) items.push('...')
    items.push(p)
    prev = p
  }
  return items
}
