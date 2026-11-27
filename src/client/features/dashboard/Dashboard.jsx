import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../../core/api.js'
import { buildContributionGrid, getPageItems } from './heatmap.js'
import { ContributionCard } from './ContributionCard.jsx'
import { DailyHistoryList, WEEKDAYS } from './DailyHistoryList.jsx'

export { WEEKDAYS }

// Data dashboard: GitHub-style contribution graph + paginated daily words & sentences.
const PAGE_SIZE = 5
const useIsoLayoutEffect = React.useLayoutEffect || useEffect

let cachedDashboard = null

export function invalidateDashboardCache() {
  cachedDashboard = null
}

export function Dashboard() {
  const [data, setData] = useState(() => cachedDashboard)
  const [loading, setLoading] = useState(() => !cachedDashboard)
  const [error, setError] = useState('')
  const [range, setRange] = useState('last-year')
  const [page, setPage] = useState(1)
  const [flashDay, setFlashDay] = useState('')
  const flashTimerRef = useRef(null)
  const pendingJumpRef = useRef('')
  const histHeadRef = useRef(null)

  useEffect(() => {
    return () => clearTimeout(flashTimerRef.current)
  }, [])

  const load = useCallback(async () => {
    if (!cachedDashboard) setLoading(true)
    setError('')
    try {
      const next = await api('/dashboard')
      cachedDashboard = next
      setData(next)
    } catch (e) {
      setError(e.message || '看板加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const activity = useMemo(() => {
    const map = {}
    if (data && Array.isArray(data.activity)) {
      for (const a of data.activity) map[a.day] = a
    }
    return map
  }, [data])

  const today = data ? data.today : null
  const streak = data ? data.streak || 0 : 0
  const totals = data && data.totals ? data.totals : { days: 0, words: 0, phrases: 0 }

  const years = useMemo(() => {
    const set = new Set()
    const currentYear = (today || new Date().toISOString().slice(0, 10)).slice(0, 4)
    if (/^\d{4}$/.test(currentYear)) set.add(currentYear)
    for (const key of Object.keys(activity)) {
      const y = key.slice(0, 4)
      if (/^\d{4}$/.test(y)) set.add(y)
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a)).slice(0, 4)
  }, [activity, today])

  const grid = useMemo(
    () => buildContributionGrid({ todayStr: today, range, activityMap: activity }),
    [today, range, activity],
  )

  const records = useMemo(() => (data && Array.isArray(data.days) ? data.days : []), [data])
  const filteredRecords = useMemo(
    () =>
      records.filter((r) => {
        const day = String((r && r.day) || '')
        return day >= grid.startKey && day <= grid.endKey
      }),
    [records, grid.startKey, grid.endKey],
  )
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const safePage = Math.max(1, Math.min(page, totalPages))
  const pageRecords = useMemo(
    () => filteredRecords.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredRecords, safePage],
  )
  const pageItems = useMemo(() => getPageItems(totalPages, safePage), [totalPages, safePage])

  useIsoLayoutEffect(() => {
    setPage(1)
  }, [range, data])

  const scrollAndFlash = useCallback((day) => {
    try {
      const el = document.getElementById('eg-hist-' + day)
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start', behavior: 'smooth' })
    } catch {
      /* ignore */
    }
    setFlashDay('')
    clearTimeout(flashTimerRef.current)
    setTimeout(() => {
      setFlashDay(day)
      flashTimerRef.current = setTimeout(() => setFlashDay(''), 1200)
    }, 20)
  }, [])

  useEffect(() => {
    const pendingDay = pendingJumpRef.current
    if (!pendingDay) return
    if (!pageRecords.some((r) => r.day === pendingDay)) return
    pendingJumpRef.current = ''
    scrollAndFlash(pendingDay)
  }, [safePage, pageRecords, scrollAndFlash])

  const jumpTo = (day) => {
    const idx = filteredRecords.findIndex((r) => r.day === day)
    if (idx < 0) return
    const targetPage = Math.floor(idx / PAGE_SIZE) + 1
    if (targetPage !== safePage) {
      pendingJumpRef.current = day
      setPage(targetPage)
    } else {
      pendingJumpRef.current = ''
      scrollAndFlash(day)
    }
  }

  const goPage = (nextPage) => {
    const target = Math.max(1, Math.min(totalPages, nextPage))
    if (target === safePage) return
    pendingJumpRef.current = ''
    setPage(target)
    try {
      if (histHeadRef.current && histHeadRef.current.scrollIntoView) {
        histHeadRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    } catch {
      /* ignore */
    }
  }

  if (loading && !data) {
    return (
      <div className="eg-dash">
        <div className="eg-loading">
          <span className="eg-spin" />
          正在加载看板…
        </div>
      </div>
    )
  }

  const rangeLabel = range === 'last-year' ? '近一年' : range + ' 年'

  return (
    <div className="eg-dash">
      <div className="eg-dash-top">
        <div className="eg-dash-title">学习看板</div>
        <div className="eg-dash-ranges" role="tablist" aria-label="统计范围">
          <button
            type="button"
            role="tab"
            aria-selected={range === 'last-year' ? 'true' : 'false'}
            className={'eg-rangebtn' + (range === 'last-year' ? ' active' : '')}
            onClick={() => setRange('last-year')}
          >
            近一年
          </button>
          {years.map((y) => (
            <button
              key={y}
              type="button"
              role="tab"
              aria-selected={range === y ? 'true' : 'false'}
              className={'eg-rangebtn' + (range === y ? ' active' : '')}
              onClick={() => setRange(y)}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
      <div className="eg-dash-sum">
        <div className="eg-stat">
          <b>{streak}</b>
          <span title="连续学习天数">连续</span>
        </div>
        <div className="eg-stat">
          <b>{totals.words || 0}</b>
          <span title="累计单词">单词</span>
        </div>
        <div className="eg-stat">
          <b>{totals.phrases || 0}</b>
          <span title="累计句子">句子</span>
        </div>
        <div className="eg-stat">
          <b>{totals.days || 0}</b>
          <span title="累计学习天数">累计</span>
        </div>
      </div>
      <ContributionCard range={range} rangeLabel={rangeLabel} grid={grid} onSelectDay={jumpTo} />
      {error ? <div className="eg-dash-error">{error}</div> : null}
      {filteredRecords.length ? (
        <DailyHistoryList
          pageRecords={pageRecords}
          totalFilteredCount={filteredRecords.length}
          safePage={safePage}
          totalPages={totalPages}
          pageItems={pageItems}
          flashDay={flashDay}
          histHeadRef={histHeadRef}
          onGoPage={goPage}
        />
      ) : (
        <div className="eg-dash-empty">
          {loading ? '正在加载…' : records.length ? rangeLabel + '还没有详细学习记录。' : '还没有学习记录，去练几题吧。'}
        </div>
      )}
    </div>
  )
}
