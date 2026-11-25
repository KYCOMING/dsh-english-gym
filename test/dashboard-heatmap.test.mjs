import test from 'node:test'
import assert from 'node:assert/strict'
import { buildContributionGrid, getPageItems, levelOf } from '../src/client/features/dashboard/heatmap.js'

test('buildContributionGrid builds 53-week last-year heatmap ending on today', () => {
  const activityMap = {
    '2026-11-23': { day: '2026-11-23', words: 1, phrases: 0, total: 1 },
    '2026-11-24': { day: '2026-11-24', words: 30, phrases: 3, total: 33 },
    '2026-11-25': { day: '2026-11-25', words: 12, phrases: 2, total: 14 },
  }
  const grid = buildContributionGrid({ todayStr: '2026-11-25', range: 'last-year', activityMap })
  assert.equal(grid.weeks.length, 53)
  assert.ok(grid.weeks.every((col) => col.length === 7))

  // 2026-11-25 is Wednesday (row 3); Thu/Fri/Sat of final week must be out=true.
  const lastCol = grid.weeks[grid.weeks.length - 1]
  assert.equal(lastCol[3].key, '2026-11-25')
  assert.equal(lastCol[3].isToday, true)
  assert.equal(lastCol[3].level, 2)
  assert.equal(lastCol[4].out, true)
  assert.equal(lastCol[5].out, true)
  assert.equal(lastCol[6].out, true)

  assert.equal(grid.rangeTotal, 48)
  assert.equal(grid.rangeDays, 3)

  // Month labels never overlap (< 3 cols apart)
  for (let i = 1; i < grid.monthLabels.length; i += 1) {
    assert.ok(grid.monthLabels[i].col - grid.monthLabels[i - 1].col >= 3)
  }
})

test('buildContributionGrid supports full calendar year view with padded edges', () => {
  const activityMap = {
    '2026-01-01': { day: '2026-01-01', words: 65, phrases: 0, total: 65 },
    '2026-12-31': { day: '2026-12-31', words: 5, phrases: 0, total: 5 },
  }
  const grid = buildContributionGrid({ todayStr: '2026-11-25', range: '2026', activityMap })
  const firstCol = grid.weeks[0]
  // 2026-01-01 is Thursday (row 4), so Sun..Wed (0..3) are out-of-year padding.
  assert.equal(firstCol[0].out, true)
  assert.equal(firstCol[3].out, true)
  assert.equal(firstCol[4].key, '2026-01-01')
  assert.equal(firstCol[4].level, 4)

  assert.equal(grid.rangeTotal, 70)
  assert.equal(grid.rangeDays, 2)
  assert.equal(levelOf(0), 0)
  assert.equal(levelOf(1), 1)
  assert.equal(levelOf(11), 2)
  assert.equal(levelOf(31), 3)
  assert.equal(levelOf(61), 4)
})

test('getPageItems returns compact page ranges with ellipses for large totals', () => {
  assert.deepEqual(getPageItems(5, 2), [1, 2, 3, 4, 5])
  assert.deepEqual(getPageItems(73, 1), [1, 2, '...', 73])
  assert.deepEqual(getPageItems(73, 5), [1, '...', 4, 5, 6, '...', 73])
  assert.deepEqual(getPageItems(73, 73), [1, '...', 72, 73])
})
