import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../../core/api.js'
import { buildContributionGrid, getPageItems } from './heatmap.js'

// Data dashboard: GitHub-style contribution graph + paginated daily words & sentences.
export const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const DOW_LABELS = ['', '一', '', '三', '', '五', '']
const PAGE_SIZE = 5
const useIsoLayoutEffect = React.useLayoutEffect || useEffect

let cachedDashboard = null

export function Dashboard() {
  const [data, setData] = useState(() => cachedDashboard)
  const [loading, setLoading] = useState(() => !cachedDashboard)
  const [error, setError] = useState('')
  const [range, setRange] = useState('last-year')
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState({})
  const [flashDay, setFlashDay] = useState('')
  const [tip, setTip] = useState(null)
  const flashTimerRef = useRef(null)
  const pendingJumpRef = useRef('')
  const cardRef = useRef(null)
  const scrollRef = useRef(null)
  const histHeadRef = useRef(null)
  const toggleGroup = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  const WORD_LIMIT = 5
  const PHRASE_LIMIT = 3

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

  const records = useMemo(() => (data && Array.isArray(data.days) ? data.days : []), [data])
  const filteredRecords = useMemo(() => {
    if (/^\d{4}$/.test(range)) return records.filter((r) => String(r.day || '').startsWith(range + '-'))
    return records
  }, [records, range])
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const safePage = Math.max(1, Math.min(page, totalPages))
  const pageRecords = useMemo(
    () => filteredRecords.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredRecords, safePage],
  )
  const pageItems = useMemo(() => getPageItems(totalPages, safePage), [totalPages, safePage])

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

  useIsoLayoutEffect(() => {
    setTip(null)
    setPage(1)
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
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

  const showTip = (e, cell) => {
    const cardEl = cardRef.current
    const cellEl = e.currentTarget
    if (!cardEl || !cellEl) return
    const cardRect = cardEl.getBoundingClientRect()
    const cellRect = cellEl.getBoundingClientRect()
    const rawX = cellRect.left - cardRect.left + cellRect.width / 2
    const pad = Math.min(82, Math.max(40, cardRect.width * 0.24))
    const x = Math.round(Math.max(pad, Math.min(Math.max(pad, cardRect.width - pad), rawX)))
    const y = Math.round(cellRect.top - cardRect.top)
    setTip({ x, y, cell })
  }

  const hideTip = () => setTip(null)

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

  const recordNodes = pageRecords.map((rec) => {
    const dt = new Date(rec.day + 'T00:00:00')
    const wd = WEEKDAYS[dt.getDay()]
    const t = rec.totals || {}
    const allWords = rec.words || []
    const allPhrases = rec.phrases || []
    const wKey = rec.day + ':w'
    const pKey = rec.day + ':p'
    const words = expanded[wKey] ? allWords : allWords.slice(0, WORD_LIMIT)
    const phrases = expanded[pKey] ? allPhrases : allPhrases.slice(0, PHRASE_LIMIT)
    const moreBtn = (key, total, limit, open) =>
      total > limit
        ? React.createElement(
            'button',
            { className: 'eg-more', key: 'more', onClick: () => toggleGroup(key) },
            open ? '收起' : '展开全部 · 共 ' + total + ' 条',
          )
        : null
    return React.createElement(
      'div',
      { className: 'eg-hist-day' + (flashDay === rec.day ? ' is-flash' : ''), id: 'eg-hist-' + rec.day, key: rec.day },
      React.createElement(
        'div',
        { className: 'eg-hist-head' },
        React.createElement(
          'div',
          { className: 'eg-hist-date' },
          dt.getMonth() + 1 + '月' + dt.getDate() + '日',
          React.createElement('span', { className: 'wd' }, '周' + wd),
        ),
        React.createElement('div', { className: 'eg-hist-count' }, '单词 ' + (t.words || 0) + ' · 句子 ' + (t.phrases || 0)),
      ),
      allWords.length
        ? React.createElement(
            'div',
            null,
            React.createElement('div', { className: 'eg-hist-sub' }, '单词'),
            React.createElement(
              'div',
              { className: 'eg-wchips' },
              words.map((w, i) =>
                React.createElement(
                  'span',
                  { className: 'eg-wchip ' + (w.ok ? 'ok' : 'bad'), key: 'w' + i, title: w.ok ? '拼对了' : '没拼对' },
                  React.createElement('span', { className: 'w' }, w.en),
                  w.zh ? React.createElement('span', { className: 'm' }, w.zh) : null,
                ),
              ),
            ),
            moreBtn(wKey, allWords.length, WORD_LIMIT, !!expanded[wKey]),
          )
        : null,
      allPhrases.length
        ? React.createElement(
            'div',
            null,
            React.createElement('div', { className: 'eg-hist-sub' }, '句子'),
            React.createElement(
              'div',
              { className: 'eg-sents' },
              phrases.map((p, i) =>
                React.createElement(
                  'div',
                  { className: 'eg-sent ' + (p.ok ? 'ok' : 'bad'), key: 'p' + i },
                  React.createElement('span', { className: 'mark' }, p.ok ? '✓' : '✗'),
                  React.createElement(
                    'div',
                    { className: 'body' },
                    React.createElement('div', { className: 'zh' }, p.zh),
                    p.en ? React.createElement('div', { className: 'en' }, p.en) : null,
                  ),
                ),
              ),
            ),
            moreBtn(pKey, allPhrases.length, PHRASE_LIMIT, !!expanded[pKey]),
          )
        : null,
    )
  })

  if (loading && !data) {
    return React.createElement(
      'div',
      { className: 'eg-dash' },
      React.createElement('div', { className: 'eg-loading' }, React.createElement('span', { className: 'eg-spin' }), '正在加载看板…'),
    )
  }

  const rangeLabel = range === 'last-year' ? '近一年' : range + ' 年'
  const tipCell = tip ? tip.cell : null
  const tipAct = tipCell && tipCell.activity
  const tipText = tipCell
    ? tipAct
      ? tipCell.key + ' · 单词 ' + tipAct.words + ' · 句子 ' + tipAct.phrases
      : tipCell.key + ' · 无学习记录'
    : ''

  return React.createElement(
    'div',
    { className: 'eg-dash' },
    React.createElement(
      'div',
      { className: 'eg-dash-top' },
      React.createElement('div', { className: 'eg-dash-title' }, '学习看板'),
      React.createElement(
        'div',
        { className: 'eg-dash-ranges', role: 'tablist', 'aria-label': '统计范围' },
        React.createElement(
          'button',
          {
            type: 'button',
            role: 'tab',
            'aria-selected': range === 'last-year' ? 'true' : 'false',
            className: 'eg-rangebtn' + (range === 'last-year' ? ' active' : ''),
            onClick: () => setRange('last-year'),
          },
          '近一年',
        ),
        years.map((y) =>
          React.createElement(
            'button',
            {
              key: y,
              type: 'button',
              role: 'tab',
              'aria-selected': range === y ? 'true' : 'false',
              className: 'eg-rangebtn' + (range === y ? ' active' : ''),
              onClick: () => setRange(y),
            },
            y,
          ),
        ),
      ),
    ),
    React.createElement(
      'div',
      { className: 'eg-dash-sum' },
      React.createElement('div', { className: 'eg-stat' }, React.createElement('b', null, streak), React.createElement('span', { title: '连续学习天数' }, '连续')),
      React.createElement('div', { className: 'eg-stat' }, React.createElement('b', null, totals.words || 0), React.createElement('span', { title: '累计单词' }, '单词')),
      React.createElement('div', { className: 'eg-stat' }, React.createElement('b', null, totals.phrases || 0), React.createElement('span', { title: '累计句子' }, '句子')),
      React.createElement('div', { className: 'eg-stat' }, React.createElement('b', null, totals.days || 0), React.createElement('span', { title: '累计学习天数' }, '累计')),
    ),
    React.createElement(
      'div',
      { className: 'eg-cal-card', ref: cardRef, 'data-nodrag': 'true' },
      React.createElement(
        'div',
        { className: 'eg-gh-head' },
        rangeLabel + '共完成 ' + grid.rangeTotal + ' 项练习 · ' + grid.rangeDays + ' 天',
      ),
      React.createElement(
        'div',
        { className: 'eg-gh-wrap' },
        React.createElement(
          'div',
          { className: 'eg-gh-dows', 'aria-hidden': 'true' },
          DOW_LABELS.map((lbl, i) => React.createElement('span', { key: i }, lbl)),
        ),
        React.createElement(
          'div',
          { className: 'eg-gh-scroll', ref: scrollRef },
          React.createElement(
            'div',
            { className: 'eg-gh-inner' },
            React.createElement(
              'div',
              { className: 'eg-gh-months', style: { width: grid.weeks.length * 11 - 2 + 'px' } },
              grid.monthLabels.map((m) =>
                React.createElement(
                  'span',
                  { key: m.col, className: 'eg-gh-month', style: { left: m.col * 11 + 'px' } },
                  m.label,
                ),
              ),
            ),
            React.createElement(
              'div',
              { className: 'eg-gh-grid', role: 'grid', 'aria-label': rangeLabel + '学习热力图' },
              grid.weeks.map((week, ci) =>
                React.createElement(
                  'div',
                  { className: 'eg-gh-col', key: ci },
                  week.map((cell, ri) => {
                    if (cell.out) {
                      return React.createElement('span', { className: 'eg-gh-cell out', key: ri, 'aria-hidden': 'true' })
                    }
                    const has = Boolean(cell.activity && cell.activity.total > 0)
                    const cls = ['eg-gh-cell', 'l' + cell.level]
                    if (has) cls.push('has')
                    if (cell.isToday) cls.push('today')
                    return React.createElement('button', {
                      key: cell.key,
                      type: 'button',
                      className: cls.join(' '),
                      'aria-label': cell.activity
                        ? cell.key + ' 单词 ' + cell.activity.words + ' 句子 ' + cell.activity.phrases
                        : cell.key + ' 无学习记录',
                      onMouseEnter: (e) => showTip(e, cell),
                      onMouseLeave: hideTip,
                      onFocus: (e) => showTip(e, cell),
                      onBlur: hideTip,
                      onClick: has ? () => jumpTo(cell.key) : undefined,
                    })
                  }),
                ),
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        'div',
        { className: 'eg-gh-foot' },
        React.createElement('span', { className: 'eg-gh-hint' }, '点击绿色方块定位当日记录'),
        React.createElement(
          'div',
          { className: 'eg-dash-legend' },
          '少',
          React.createElement('i', { className: 'l0' }),
          React.createElement('i', { className: 'l1' }),
          React.createElement('i', { className: 'l2' }),
          React.createElement('i', { className: 'l3' }),
          React.createElement('i', { className: 'l4' }),
          '多',
        ),
      ),
      tip
        ? React.createElement(
            'div',
            {
              className: 'eg-gh-tip',
              role: 'tooltip',
              style: { left: tip.x + 'px', top: tip.y + 'px' },
            },
            tipText,
          )
        : null,
    ),
    error ? React.createElement('div', { className: 'eg-dash-error' }, error) : null,
    filteredRecords.length
      ? React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'eg-hist-bar', ref: histHeadRef },
            React.createElement('div', { className: 'eg-hist-title' }, '每日学习记录'),
            React.createElement(
              'div',
              { className: 'eg-hist-meta' },
              '共 ' + filteredRecords.length + ' 天' + (totalPages > 1 ? ' · 第 ' + safePage + ' / ' + totalPages + ' 页' : ''),
            ),
          ),
          React.createElement('div', { className: 'eg-hist' }, recordNodes),
          totalPages > 1
            ? React.createElement(
                'div',
                { className: 'eg-pager', role: 'navigation', 'aria-label': '学习记录分页' },
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'eg-pagebtn',
                    disabled: safePage <= 1,
                    onClick: () => goPage(safePage - 1),
                  },
                  '‹ 上一页',
                ),
                pageItems.map((it, i) =>
                  it === '...'
                    ? React.createElement('span', { className: 'eg-page-dots', key: 'dots-' + i }, '…')
                    : React.createElement(
                        'button',
                        {
                          type: 'button',
                          key: it,
                          className: 'eg-pagebtn' + (it === safePage ? ' active' : ''),
                          'aria-current': it === safePage ? 'page' : undefined,
                          onClick: () => goPage(it),
                        },
                        String(it),
                      ),
                ),
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'eg-pagebtn',
                    disabled: safePage >= totalPages,
                    onClick: () => goPage(safePage + 1),
                  },
                  '下一页 ›',
                ),
              )
            : null,
        )
      : React.createElement(
          'div',
          { className: 'eg-dash-empty' },
          loading ? '正在加载…' : records.length ? range + ' 年还没有详细学习记录。' : '还没有学习记录，去练几题吧。',
        ),
  )
}
