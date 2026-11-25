import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { bounceButton } from '../../components/motion.js'
import { formatPos } from '../../core/text.js'
import { segmentReportParagraphs } from './highlight.js'

const useIsoLayoutEffect = React.useLayoutEffect || useEffect

export function Report({ report, loading, error, onRefresh }) {
  const [openMap, setOpenMap] = useState({})
  const [active, setActive] = useState(null)
  const [popPos, setPopPos] = useState(null)
  const reportRef = useRef(null)
  const popRef = useRef(null)
  const termRefs = useRef({})
  const closeTimerRef = useRef(null)

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimerRef.current = setTimeout(() => {
      setActive((prev) => (prev && !prev.pinned ? null : prev))
    }, 140)
  }, [cancelClose])

  useEffect(() => {
    cancelClose()
    setOpenMap({})
    setActive(null)
    setPopPos(null)
    termRefs.current = {}
  }, [report, cancelClose])

  useEffect(() => () => cancelClose(), [cancelClose])

  // Close popover on outside click or Escape (capturing Escape before the board closes).
  useEffect(() => {
    if (!active) return undefined
    const onPointerDown = (e) => {
      const target = e.target
      if (popRef.current && target && popRef.current.contains(target)) return
      if (target && target.closest && target.closest('.eg-rword')) return
      setActive(null)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        setActive(null)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown, true)
    }
  }, [active])

  const updatePopoverPosition = useCallback(() => {
    if (!active) {
      setPopPos(null)
      return
    }
    const reportEl = reportRef.current
    const popEl = popRef.current
    const anchorEl = termRefs.current[active.id]
    if (!reportEl || !popEl || !anchorEl) return

    const reportRect = reportEl.getBoundingClientRect()
    const anchorRect = (anchorEl.getClientRects && anchorEl.getClientRects()[0]) || anchorEl.getBoundingClientRect()
    const popWidth = popEl.offsetWidth
    const popHeight = popEl.offsetHeight
    if (!reportRect.width || !popWidth || !popHeight) return

    const scrollEl = reportEl.closest ? reportEl.closest('.eg-body') : null
    const scrollRect = (scrollEl || document.documentElement).getBoundingClientRect()

    const anchorTop = anchorRect.top - reportRect.top
    const anchorBottom = anchorRect.bottom - reportRect.top
    const anchorCenterX = anchorRect.left - reportRect.left + anchorRect.width / 2
    const gap = 9
    const spaceAbove = anchorRect.top - scrollRect.top
    const spaceBelow = scrollRect.bottom - anchorRect.bottom
    const placement = spaceAbove < popHeight + gap + 8 && spaceBelow >= spaceAbove ? 'below' : 'above'
    const top = placement === 'below' ? Math.round(anchorBottom + gap) : Math.round(anchorTop - popHeight - gap)
    const maxLeft = Math.max(0, reportRect.width - popWidth)
    const left = Math.round(Math.max(0, Math.min(maxLeft, anchorCenterX - popWidth / 2)))
    const arrowX = Math.round(Math.max(12, Math.min(Math.max(12, popWidth - 12), anchorCenterX - left)))

    setPopPos({ left, top, arrowX, placement })
  }, [active])

  useIsoLayoutEffect(() => {
    updatePopoverPosition()
    if (!active) return undefined
    window.addEventListener('resize', updatePopoverPosition)
    let ro = null
    if (typeof ResizeObserver === 'function' && reportRef.current) {
      ro = new ResizeObserver(updatePopoverPosition)
      ro.observe(reportRef.current)
    }
    return () => {
      window.removeEventListener('resize', updatePopoverPosition)
      if (ro) ro.disconnect()
    }
  }, [active, updatePopoverPosition])

  const body = report ? String(report.body || '') : ''
  const highlights = report && Array.isArray(report.highlights) ? report.highlights : []
  const paragraphs = useMemo(() => body.split(/\n{2,}/).filter(Boolean), [body])
  const { segmentsByParagraph, matchedCount } = useMemo(
    () => segmentReportParagraphs(paragraphs, highlights),
    [paragraphs, highlights],
  )

  if (loading && !report) {
    return React.createElement(
      'div',
      { className: 'eg-loading is-stage' },
      React.createElement('span', { className: 'eg-spin' }),
      '正在生成今日文章…',
    )
  }
  if (!report) {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'eg-loading' },
        error ? React.createElement('span', { className: 'eg-err' }, error) : '暂无文章。',
      ),
      React.createElement(
        'div',
        { className: 'eg-actions' },
        React.createElement('button', { className: 'eg-btn primary', onClick: onRefresh }, '生成今日文章'),
      ),
    )
  }

  const questions = report.questions || []
  const wordCount = (body.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length
  const meta = [
    report.date,
    report.level,
    wordCount ? wordCount + ' 词' : '',
    matchedCount ? matchedCount + ' 个重点词' : '',
  ]
    .filter(Boolean)
    .join(' · ')

  const handleTermEnter = (seg) => {
    cancelClose()
    setActive((prev) => (prev && prev.pinned ? prev : { id: seg.id, item: seg.item, text: seg.text, pinned: false }))
  }

  const handleTermLeave = () => {
    scheduleClose()
  }

  const handleTermClick = (e, seg) => {
    const sel = typeof window !== 'undefined' && window.getSelection ? window.getSelection() : null
    if (sel && String(sel).trim()) return
    e.stopPropagation()
    cancelClose()
    setActive((prev) =>
      prev && prev.pinned && prev.id === seg.id ? null : { id: seg.id, item: seg.item, text: seg.text, pinned: true },
    )
  }

  const handleTermFocus = (seg) => {
    cancelClose()
    setActive((prev) => (prev && prev.pinned ? prev : { id: seg.id, item: seg.item, text: seg.text, pinned: false }))
  }

  const handleTermBlur = (e) => {
    if (popRef.current && e.relatedTarget && popRef.current.contains(e.relatedTarget)) return
    setActive((prev) => (prev && !prev.pinned ? null : prev))
  }

  const handleTermKeyDown = (e, seg) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      cancelClose()
      setActive((prev) =>
        prev && prev.pinned && prev.id === seg.id ? null : { id: seg.id, item: seg.item, text: seg.text, pinned: true },
      )
    }
  }

  const activePos = active && active.item.pos ? formatPos(active.item.pos) : ''
  const activeLemma =
    active && active.item.lemma && active.item.lemma.toLowerCase() !== active.text.toLowerCase()
      ? active.item.lemma
      : ''

  return React.createElement(
    'div',
    { className: 'eg-report', ref: reportRef, 'data-nodrag': 'true' },
    React.createElement('div', { className: 'r-top' }, React.createElement('h2', { className: 'eg-rtitle' }, report.title || 'Daily Report')),
    React.createElement(
      'div',
      { className: 'eg-rmeta-row' },
      meta ? React.createElement('div', { className: 'eg-rmeta' }, meta) : React.createElement('span', null),
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'eg-rrefresh',
          onClick: onRefresh,
          disabled: loading,
          title: '重新生成一篇今日文章',
        },
        loading ? '生成中…' : '↻ 换一篇',
      ),
    ),
    report.summary_zh ? React.createElement('p', { className: 'eg-rsum' }, report.summary_zh) : null,
    segmentsByParagraph.map((segs, i) =>
      React.createElement(
        'p',
        { key: i, className: 'eg-rp' },
        segs.map((seg, j) => {
          if (seg.type !== 'term') return seg.text
          const isActive = !!(active && active.id === seg.id)
          return React.createElement(
            'mark',
            {
              key: seg.id + '-' + j,
              ref: (el) => {
                if (el) termRefs.current[seg.id] = el
                else delete termRefs.current[seg.id]
              },
              className: 'eg-rword' + (isActive ? ' is-active' : ''),
              role: 'button',
              tabIndex: 0,
              'aria-expanded': isActive ? 'true' : 'false',
              onMouseEnter: () => handleTermEnter(seg),
              onMouseLeave: handleTermLeave,
              onClick: (e) => handleTermClick(e, seg),
              onFocus: () => handleTermFocus(seg),
              onBlur: handleTermBlur,
              onKeyDown: (e) => handleTermKeyDown(e, seg),
            },
            seg.text,
          )
        }),
      ),
    ),
    active
      ? React.createElement(
          'div',
          {
            ref: popRef,
            className:
              'eg-rpop' +
              (popPos ? ' is-ready' : '') +
              (popPos && popPos.placement === 'below' ? ' is-below' : '') +
              (active.pinned ? ' is-pinned' : ''),
            role: active.pinned ? 'dialog' : 'tooltip',
            'aria-label': active.text + ' 释义',
            style: popPos
              ? {
                  left: popPos.left + 'px',
                  top: popPos.top + 'px',
                  '--eg-arrow-x': popPos.arrowX + 'px',
                }
              : { left: 0, top: 0 },
            onMouseEnter: cancelClose,
            onMouseLeave: handleTermLeave,
          },
          React.createElement(
            'div',
            { className: 'eg-rpop-head' },
            React.createElement(
              'div',
              { className: 'eg-rpop-title' },
              React.createElement('span', { className: 'eg-rpop-word' }, active.text),
              activeLemma ? React.createElement('span', { className: 'eg-rpop-lemma' }, '→ ' + activeLemma) : null,
            ),
            active.pinned
              ? React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'eg-rpop-close',
                    'aria-label': '关闭释义',
                    onClick: () => setActive(null),
                  },
                  '×',
                )
              : null,
          ),
          activePos || active.item.fromBank
            ? React.createElement(
                'div',
                { className: 'eg-rpop-tags' },
                activePos ? React.createElement('span', { className: 'eg-rpop-pos' }, activePos) : null,
                active.item.fromBank ? React.createElement('span', { className: 'eg-rpop-bank' }, '词库') : null,
              )
            : null,
          React.createElement('div', { className: 'eg-rpop-zh' }, active.item.zh),
        )
      : null,
    questions.length
      ? React.createElement(
          'div',
          { className: 'eg-practice' },
          React.createElement('div', { className: 'eg-ptitle' }, '练一练'),
          questions.map((q, i) => {
            const isOpen = !!openMap[i]
            return React.createElement(
              'div',
              { key: i, className: 'eg-q' + (isOpen ? ' reveal' : '') },
              React.createElement(
                'div',
                { className: 'eg-q-head' },
                React.createElement('span', { className: 'eg-q-n' }, String(i + 1)),
                React.createElement('span', { className: 'eg-q-zh' }, q.zh),
              ),
              React.createElement(
                'button',
                {
                  className: 'eg-q-toggle',
                  type: 'button',
                  'aria-expanded': isOpen ? 'true' : 'false',
                  onClick: () => setOpenMap((prev) => ({ ...prev, [i]: !prev[i] })),
                },
                React.createElement('span', { className: 'caret', 'aria-hidden': 'true' }, '▸'),
                isOpen ? '收起参考' : '看参考',
              ),
              React.createElement(
                'div',
                { className: 'eg-collapse' + (isOpen ? ' open' : ''), 'aria-hidden': isOpen ? 'false' : 'true' },
                React.createElement(
                  'div',
                  { className: 'eg-collapse-inner' },
                  React.createElement('div', { className: 'eg-q-en' }, q.en),
                ),
              ),
            )
          }),
        )
      : null,
    React.createElement(
      'div',
      { className: 'eg-report-foot' },
      React.createElement(
        'span',
        { className: 'eg-report-foot-hint' },
        matchedCount ? '标黄词可悬停或点击查译，可随时换一篇' : '按当前内容方向生成，可随时换一篇',
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'eg-btn',
          onClick: onRefresh,
          onPointerDown: bounceButton,
          disabled: loading,
        },
        loading ? '生成中…' : '↻ 换一篇',
      ),
    ),
  )
}
