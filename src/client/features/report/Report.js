import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../../core/api.js'
import { bounceButton } from '../../components/motion.js'
import { formatPos } from '../../core/text.js'
import { annotateSentenceSegments, groupSegmentsBySentence, segmentReportParagraphs } from './highlight.js'

const useIsoLayoutEffect = React.useLayoutEffect || useEffect

function hasSentenceHint(s) {
  return Boolean(
    s && ((Array.isArray(s.chunks) && s.chunks.length >= 2) || (Array.isArray(s.core) && s.core.length > 0)),
  )
}

export function Report({ report, loading, error, onRefresh }) {
  const [openMap, setOpenMap] = useState({})
  // Progressive reveals: 'g<p>' = paragraph gist, 's<n>' = sentence n translation + inline structure cues.
  const [reveal, setReveal] = useState({})
  // On-demand sentence explanations: { [key]: { open, loading, data, error } }
  const [explains, setExplains] = useState({})
  const [active, setActive] = useState(null)
  const [popPos, setPopPos] = useState(null)
  const reportRef = useRef(null)
  const popRef = useRef(null)
  const termRefs = useRef({})
  const closeTimerRef = useRef(null)
  const reportGenRef = useRef(0)

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
    reportGenRef.current += 1
    cancelClose()
    setOpenMap({})
    setReveal({})
    setExplains({})
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
  // Sentence structure is only used when it lines up 1:1 with the rendered paragraphs.
  const structure = useMemo(() => {
    const list = report && Array.isArray(report.paragraphs) ? report.paragraphs : []
    if (!list.length || list.length !== paragraphs.length) return null
    let base = 0
    let revealable = 0
    const items = segmentsByParagraph.map((segs, i) => {
      const p = list[i] || {}
      const sentences = Array.isArray(p.sentences) ? p.sentences : []
      const groups = groupSegmentsBySentence(paragraphs[i], segs, sentences)
      const item = { gist: groups && p.gist_zh ? String(p.gist_zh) : '', sentences: groups ? sentences : [], groups, base }
      if (groups) {
        base += sentences.length
        revealable += sentences.filter((s) => s && s.zh).length
      }
      return item
    })
    return revealable || items.some((it) => it.gist) ? { items, revealable } : null
  }, [report, paragraphs, segmentsByParagraph])

  const toggleGist = useCallback((key) => {
    setReveal((prev) => {
      const next = { ...prev }
      if (next[key]) delete next[key]
      else next[key] = true
      return next
    })
  }, [])

  const toggleSentence = useCallback(
    (key) => {
      const wasOpen = !!reveal[key]
      setReveal((prev) => {
        const next = { ...prev }
        if (next[key]) delete next[key]
        else next[key] = true
        return next
      })
      if (wasOpen) {
        setExplains((prev) => {
          if (!prev[key] || !prev[key].open) return prev
          return { ...prev, [key]: { ...prev[key], open: false } }
        })
      }
    },
    [reveal],
  )

  const handleExplainToggle = useCallback(
    async ({ key, pIdx, sIdx, sentence, paragraphText, retry = false }) => {
      const cur = explains[key]
      if (!retry && cur && cur.loading) return
      if (!retry && cur && cur.open && (cur.data || cur.error)) {
        setExplains((prev) => ({ ...prev, [key]: { ...prev[key], open: false } }))
        return
      }
      const cached = (cur && cur.data) || (sentence && sentence.explain) || null
      if (!retry && cached) {
        setExplains((prev) => ({ ...prev, [key]: { open: true, loading: false, data: cached, error: '' } }))
        return
      }
      const gen = reportGenRef.current
      setExplains((prev) => ({ ...prev, [key]: { open: true, loading: true, data: null, error: '' } }))
      try {
        const res = await api('/report/explain', {
          method: 'POST',
          body: JSON.stringify({
            date: report && report.date,
            paragraphIndex: pIdx,
            sentenceIndex: sIdx,
            en: sentence.en,
            zh: sentence.zh || '',
            context: paragraphText,
            level: report && report.level,
          }),
        })
        if (reportGenRef.current !== gen) return
        const data = res && res.explain ? res.explain : null
        setExplains((prev) => ({
          ...prev,
          [key]: data
            ? { open: true, loading: false, data, error: '' }
            : { open: true, loading: false, data: null, error: '讲解生成失败，请重试' },
        }))
      } catch (err) {
        if (reportGenRef.current !== gen) return
        setExplains((prev) => ({
          ...prev,
          [key]: { open: true, loading: false, data: null, error: (err && err.message) || '讲解生成失败，请重试' },
        }))
      }
    },
    [explains, report],
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

  const renderSeg = (seg, j) => {
    if (seg.type === 'slash') {
      return React.createElement('span', { key: 'sl-' + j, className: 'eg-rslash', 'aria-hidden': 'true' }, '/')
    }
    if (seg.type !== 'term') {
      return seg.inCore ? React.createElement('span', { key: 'c-' + j, className: 'eg-rcore' }, seg.text) : seg.text
    }
    const isActive = !!(active && active.id === seg.id)
    return React.createElement(
      'mark',
      {
        key: seg.id + '-' + j,
        ref: (el) => {
          if (el) termRefs.current[seg.id] = el
          else delete termRefs.current[seg.id]
        },
        className: 'eg-rword' + (isActive ? ' is-active' : '') + (seg.inCore ? ' is-core' : ''),
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
  }

  const handleSentenceClick = (e, key) => {
    const sel = typeof window !== 'undefined' && window.getSelection ? window.getSelection() : null
    if (sel && String(sel).trim()) return
    if (e.target && e.target.closest && e.target.closest('.eg-rword')) return
    toggleSentence(key)
  }

  const handleSentenceKeyDown = (e, key) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      toggleSentence(key)
    }
  }

  const renderParagraph = (segs, i) => {
    const info = structure ? structure.items[i] : null
    if (!info || (!info.groups && !info.gist)) {
      return React.createElement('p', { key: i, className: 'eg-rp' }, segs.map(renderSeg))
    }

    const children = info.groups
      ? info.groups.map((g, gi) => {
          if (g.type !== 'sentence') return React.createElement(React.Fragment, { key: 'gap-' + gi }, g.segs.map(renderSeg))
          const n = info.base + g.index
          const s = info.sentences[g.index] || {}
          const key = 's' + n
          const canReveal = !!(s && s.zh)
          const isOpen = canReveal && !!reveal[key]
          const segList = isOpen && hasSentenceHint(s) ? annotateSentenceSegments(s.en, g.segs, s) : g.segs

          return React.createElement(
            'span',
            {
              key: key,
              className: 'eg-rsent' + (canReveal ? ' can-reveal' : '') + (isOpen ? ' is-open' : ''),
              tabIndex: canReveal ? 0 : undefined,
              'aria-expanded': canReveal ? (isOpen ? 'true' : 'false') : undefined,
              title: canReveal ? (isOpen ? '点击收起本句译文' : '点击查看本句译文') : undefined,
              onClick: canReveal ? (e) => handleSentenceClick(e, key) : undefined,
              onKeyDown: canReveal ? (e) => handleSentenceKeyDown(e, key) : undefined,
            },
            segList.map(renderSeg),
            isOpen ? React.createElement('sup', { className: 'eg-rsent-n', 'aria-hidden': 'true' }, String(n + 1)) : null,
          )
        })
      : segs.map(renderSeg)

    const gistKey = 'g' + i
    const gistOpen = !!(info.gist && reveal[gistKey])
    const openSentences = info.sentences
      .map((s, si) => ({ s, si, n: info.base + si }))
      .filter(({ s, n }) => s && s.zh && reveal['s' + n])

    const closeBtn = (onClose, label) =>
      React.createElement(
        'button',
        { type: 'button', className: 'eg-rslot-x', 'aria-label': label, onClick: onClose },
        '×',
      )

    return React.createElement(
      React.Fragment,
      { key: i },
      React.createElement(
        'p',
        { className: 'eg-rp' },
        children,
        info.gist
          ? React.createElement(
              'button',
              {
                type: 'button',
                className: 'eg-rgist-btn',
                'aria-expanded': gistOpen ? 'true' : 'false',
                title: gistOpen ? '收起本段大意' : '看本段大意（中文）',
                onClick: () => toggleGist(gistKey),
              },
              '段意',
            )
          : null,
      ),
      gistOpen || openSentences.length
        ? React.createElement(
            'div',
            { className: 'eg-rslot', 'aria-live': 'polite' },
            gistOpen
              ? React.createElement(
                  'div',
                  { key: gistKey, className: 'eg-rslot-row is-gist' },
                  React.createElement('span', { className: 'eg-rslot-tag' }, '段意'),
                  React.createElement('span', { className: 'eg-rslot-zh' }, info.gist),
                  closeBtn(() => toggleGist(gistKey), '收起段意'),
                )
              : null,
            openSentences.map(({ s, si, n }) => {
              const skey = 's' + n
              const exp = explains[skey] || null
              const expOpen = !!(exp && exp.open)
              const expLoading = !!(exp && exp.loading)
              const expData = exp && exp.data
              const expErr = exp && exp.error
              const explainPayload = { key: skey, pIdx: i, sIdx: si, sentence: s, paragraphText: paragraphs[i] }

              return React.createElement(
                'div',
                { key: skey, className: 'eg-rslot-row' },
                React.createElement('span', { className: 'eg-rslot-tag' }, String(n + 1)),
                React.createElement(
                  'div',
                  { className: 'eg-rslot-body' },
                  React.createElement('div', { className: 'eg-rslot-zh' }, s.zh),
                  React.createElement(
                    'div',
                    { className: 'eg-rslot-tools' },
                    React.createElement(
                      'button',
                      {
                        type: 'button',
                        className: 'eg-rslot-btn' + (expOpen ? ' is-active' : ''),
                        'aria-expanded': expOpen ? 'true' : 'false',
                        disabled: expLoading,
                        onClick: () => handleExplainToggle(explainPayload),
                      },
                      expLoading ? '解析中…' : expOpen ? '收起讲解' : '为什么？',
                    ),
                  ),
                  expOpen
                    ? React.createElement(
                        'div',
                        { className: 'eg-rexplain' },
                        expLoading
                          ? React.createElement(
                              'div',
                              { className: 'eg-rexplain-loading' },
                              React.createElement('span', { className: 'eg-spin' }),
                              '正在解析句型与译法…',
                            )
                          : expErr
                            ? React.createElement(
                                'div',
                                { className: 'eg-rexplain-err' },
                                React.createElement('span', null, expErr),
                                React.createElement(
                                  'button',
                                  {
                                    type: 'button',
                                    className: 'eg-rslot-btn',
                                    onClick: () => handleExplainToggle({ ...explainPayload, retry: true }),
                                  },
                                  '重试',
                                ),
                              )
                            : expData
                              ? React.createElement(
                                  React.Fragment,
                                  null,
                                  expData.structure
                                    ? React.createElement(
                                        'div',
                                        { className: 'eg-rexplain-sec' },
                                        React.createElement('span', { className: 'eg-rexplain-label' }, '句型'),
                                        React.createElement('span', { className: 'eg-rexplain-text' }, expData.structure),
                                      )
                                    : null,
                                  expData.points && expData.points.length
                                    ? React.createElement(
                                        'ul',
                                        { className: 'eg-rexplain-pts' },
                                        expData.points.map((pt, pi) =>
                                          React.createElement(
                                            'li',
                                            { key: pi, className: 'eg-rexplain-pt' },
                                            React.createElement('span', { className: 'eg-rexplain-phrase' }, pt.phrase),
                                            React.createElement('span', { className: 'eg-rexplain-note' }, pt.note),
                                          ),
                                        ),
                                      )
                                    : null,
                                  expData.nuance
                                    ? React.createElement(
                                        'div',
                                        { className: 'eg-rexplain-sec' },
                                        React.createElement('span', { className: 'eg-rexplain-label' }, '译法'),
                                        React.createElement('span', { className: 'eg-rexplain-text' }, expData.nuance),
                                      )
                                    : null,
                                )
                              : null,
                      )
                    : null,
                ),
                closeBtn(() => toggleSentence(skey), '收起第 ' + (n + 1) + ' 句译文'),
              )
            }),
          )
        : null,
    )
  }

  const revealedCount = structure
    ? structure.items.reduce(
        (sum, it) => sum + it.sentences.filter((s, si) => s && s.zh && reveal['s' + (it.base + si)]).length,
        0,
      )
    : 0
  const footHint = structure
    ? revealedCount
      ? `已看 ${revealedCount}/${structure.revealable} 句译文 · 点「为什么？」看语法与译法讲解`
      : '读不懂时点句子看译文，点「段意」看段落大意'
    : matchedCount
      ? '标黄词可悬停或点击查译，可随时换一篇'
      : '按当前内容方向生成，可随时换一篇'

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
    segmentsByParagraph.map(renderParagraph),
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
        footHint,
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
