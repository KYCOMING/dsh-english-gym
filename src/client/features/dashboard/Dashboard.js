import React, { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../core/api.js'

// Data dashboard: a calendar of study activity + each day's words & sentences.
export const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export function pad2(n) {
  return String(n).padStart(2, '0')
}

let cachedDashboard = null

export function Dashboard() {
  const [data, setData] = useState(() => cachedDashboard)
  const [loading, setLoading] = useState(() => !cachedDashboard)
  const [error, setError] = useState('')
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return { y: d.getFullYear(), m: d.getMonth() }
  })
  const [expanded, setExpanded] = useState({})
  const [flashDay, setFlashDay] = useState('')
  const flashTimerRef = useRef(null)
  const toggleGroup = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  const WORD_LIMIT = 10
  const PHRASE_LIMIT = 5

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

  const activity = {}
  if (data && Array.isArray(data.activity)) {
    for (const a of data.activity) activity[a.day] = a
  }
  const records = data && Array.isArray(data.days) ? data.days : []
  const today = data ? data.today : null
  const streak = data ? data.streak || 0 : 0
  const totals = data && data.totals ? data.totals : { days: 0, words: 0, phrases: 0 }

  const { y, m } = cursor
  const startDow = (new Date(y, m, 1).getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startDow; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  const dayStr = (d) => y + '-' + pad2(m + 1) + '-' + pad2(d)
  const levelOf = (n) => (n > 60 ? 4 : n >= 31 ? 3 : n >= 11 ? 2 : n >= 1 ? 1 : 0)

  const goMonth = (delta) =>
    setCursor((c) => {
      let mm = c.m + delta
      let yy = c.y
      if (mm < 0) {
        mm = 11
        yy -= 1
      }
      if (mm > 11) {
        mm = 0
        yy += 1
      }
      return { y: yy, m: mm }
    })
  const goToday = () => {
    const d = new Date()
    setCursor({ y: d.getFullYear(), m: d.getMonth() })
  }
  const jumpTo = (day) => {
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
  }

  const dowNodes = ['一', '二', '三', '四', '五', '六', '日'].map((w, i) =>
    React.createElement('div', { className: 'dow', key: 'dow' + i }, w),
  )
  const cellNodes = cells.map((d, i) => {
    if (!d) return React.createElement('div', { className: 'eg-day blank', key: 'b' + i })
    const key = dayStr(d)
    const a = activity[key]
    const lv = a ? levelOf(a.total) : 0
    const cls = ['eg-day']
    if (lv) cls.push('l' + lv, 'has')
    if (key === today) cls.push('today')
    return React.createElement(
      'div',
      {
        key,
        className: cls.join(' '),
        title: a ? key + ' · 单词 ' + a.words + ' · 句子 ' + a.phrases : key,
        onClick: a ? () => jumpTo(key) : undefined,
        role: a ? 'button' : undefined,
        tabIndex: a ? 0 : undefined,
        onKeyDown: a
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                jumpTo(key)
              }
            }
          : undefined,
      },
      React.createElement('span', { className: 'n' }, d),
      a ? React.createElement('span', { className: 'cnt' }, a.total) : null,
    )
  })

  const recordNodes = records.map((rec) => {
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

  return React.createElement(
    'div',
    { className: 'eg-dash' },
    React.createElement(
      'div',
      { className: 'eg-dash-top' },
      React.createElement('div', { className: 'eg-dash-title' }, '学习看板'),
      React.createElement(
        'div',
        { className: 'eg-dash-nav' },
        React.createElement('button', { className: 'eg-navbtn', onClick: () => goMonth(-1), 'aria-label': '上个月', title: '上个月' }, '‹'),
        React.createElement('span', { className: 'eg-month' }, y + ' 年 ' + (m + 1) + ' 月'),
        React.createElement('button', { className: 'eg-navbtn', onClick: () => goMonth(1), 'aria-label': '下个月', title: '下个月' }, '›'),
        React.createElement('button', { className: 'eg-todaybtn', onClick: goToday, title: '回到今天' }, '今天'),
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
      { className: 'eg-cal-card' },
      React.createElement('div', { className: 'eg-cal' }, dowNodes.concat(cellNodes)),
      React.createElement(
        'div',
        { className: 'eg-dash-legend' },
        '少',
        React.createElement('i', { className: 'l1' }),
        React.createElement('i', { className: 'l2' }),
        React.createElement('i', { className: 'l3' }),
        React.createElement('i', { className: 'l4' }),
        '多',
      ),
    ),
    error ? React.createElement('div', { className: 'eg-dash-error' }, error) : null,
    records.length
      ? React.createElement(
          'div',
          null,
          React.createElement('div', { className: 'eg-hist-title' }, '每日学习记录'),
          React.createElement('div', { className: 'eg-hist' }, recordNodes),
        )
      : React.createElement('div', { className: 'eg-dash-empty' }, loading ? '正在加载…' : '还没有学习记录，去练几题吧。'),
  )
}
