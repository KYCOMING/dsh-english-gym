import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../../core/api.js'
import { bounceButton } from '../../components/motion.js'
import { groupSegmentsBySentence, segmentReportParagraphs } from './highlight.js'
import { useWordPopover } from './useWordPopover.js'
import { WordPopover } from './WordPopover.jsx'
import { ReportParagraph } from './ReportParagraph.jsx'
import { ReportPractice } from './ReportPractice.jsx'

export function Report({ report, loading, enriching, enrichError, error, onRefresh, onRetryEnrich }) {
  // Progressive reveals: 'g<p>' = paragraph gist, 's<n>' = sentence n translation + inline structure cues.
  const [reveal, setReveal] = useState({})
  // On-demand sentence explanations: { [key]: { open, loading, data, error } }
  const [explains, setExplains] = useState({})
  const reportRef = useRef(null)
  const reportGenRef = useRef(0)

  const { active, popPos, popRef, termRefs, cancelClose, closePopover, termHandlers } = useWordPopover({
    report,
    reportRef,
  })

  const reportKey = report
    ? report.id || `${report.date || ''}|${report.title || ''}|${report.body || ''}`
    : ''

  useEffect(() => {
    reportGenRef.current += 1
    setReveal({})
    setExplains({})
  }, [reportKey])

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
    return revealable || items.some((it) => it.gist) || (enriching && items.some((it) => it.groups))
      ? { items, revealable }
      : null
  }, [report, paragraphs, segmentsByParagraph, enriching])

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
    return (
      <div className="eg-loading is-stage">
        <span className="eg-spin" />
        正在生成今日文章…
      </div>
    )
  }
  if (!report) {
    return (
      <div>
        <div className="eg-loading">{error ? <span className="eg-err">{error}</span> : '暂无文章。'}</div>
        <div className="eg-actions">
          <button className="eg-btn primary" onClick={onRefresh}>
            生成今日文章
          </button>
        </div>
      </div>
    )
  }

  const questions = report.questions || []
  const wordCount = (body.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length
  const meta = [report.date, report.level, wordCount ? wordCount + ' 词' : '', matchedCount ? matchedCount + ' 个重点词' : '']
    .filter(Boolean)
    .join(' · ')

  const revealedCount = structure
    ? structure.items.reduce(
        (sum, it) => sum + it.sentences.filter((s, si) => s && s.zh && reveal['s' + (it.base + si)]).length,
        0,
      )
    : 0
  const footHint = enriching
    ? '中文译文、段意与翻译小题生成中…'
    : structure
      ? revealedCount
        ? `已看 ${revealedCount}/${structure.revealable} 句译文 · 点「为什么？」看语法与译法讲解`
        : '读不懂时点句子看译文，点「段意」看段落大意'
      : matchedCount
        ? '标黄词可悬停或点击查译，可随时换一篇'
        : '按当前内容方向生成，可随时换一篇'

  return (
    <div className="eg-report" ref={reportRef} data-nodrag="true">
      <div className="r-top">
        <h2 className="eg-rtitle">{report.title || 'Daily Report'}</h2>
      </div>
      <div className="eg-rmeta-row">
        {meta || enriching ? (
          <div className="eg-rmeta-left">
            {meta ? <div className="eg-rmeta">{meta}</div> : null}
            {enriching ? (
              <span className="eg-renrich-pill" role="status" aria-live="polite">
                <span className="eg-spin" />
                中文译文生成中…
              </span>
            ) : null}
          </div>
        ) : (
          <span />
        )}
        <button
          type="button"
          className="eg-rrefresh"
          onClick={onRefresh}
          disabled={loading}
          title="重新生成一篇今日文章"
        >
          {loading ? '生成中…' : '↻ 换一篇'}
        </button>
      </div>
      {report.fallback ? (
        <div className="eg-rnotice">
          <span className="eg-rnotice-text">
            生成未成功，当前显示内置示例文章{report.fallbackReason ? `（${report.fallbackReason}）` : ''}
          </span>
          <button type="button" className="eg-rslot-btn" onClick={onRefresh} disabled={loading}>
            重试
          </button>
        </div>
      ) : null}
      {enrichError && !enriching && !report.fallback ? (
        <div className="eg-rnotice is-err">
          <span className="eg-rnotice-text">{enrichError}</span>
          {onRetryEnrich ? (
            <button type="button" className="eg-rslot-btn" onClick={onRetryEnrich}>
              重试
            </button>
          ) : null}
        </div>
      ) : null}
      {error ? <div className="eg-rnotice is-err">{error}</div> : null}
      {report.summary_zh ? <p className="eg-rsum">{report.summary_zh}</p> : null}
      {segmentsByParagraph.map((segs, i) => (
        <ReportParagraph
          key={i}
          index={i}
          segs={segs}
          paragraphText={paragraphs[i]}
          info={structure ? structure.items[i] : null}
          enriching={enriching}
          reveal={reveal}
          explains={explains}
          activeTermId={active ? active.id : null}
          termRefs={termRefs}
          onToggleGist={toggleGist}
          onToggleSentence={toggleSentence}
          onExplainToggle={handleExplainToggle}
          termHandlers={termHandlers}
        />
      ))}
      <WordPopover
        active={active}
        popPos={popPos}
        popRef={popRef}
        onCancelClose={cancelClose}
        onLeave={termHandlers.onLeave}
        onClose={closePopover}
      />
      <ReportPractice
        report={report}
        questions={questions}
        enriching={enriching}
        enrichError={enrichError}
        onRetryEnrich={onRetryEnrich}
      />
      <div className="eg-report-foot">
        {enrichError && !enriching ? (
          <span className="eg-report-foot-err">
            <span>{enrichError}</span>
            {onRetryEnrich ? (
              <button type="button" className="eg-rslot-btn" onClick={onRetryEnrich}>
                重试
              </button>
            ) : null}
          </span>
        ) : (
          <span className="eg-report-foot-hint">{footHint}</span>
        )}
        <button type="button" className="eg-btn" onClick={onRefresh} onPointerDown={bounceButton} disabled={loading}>
          {loading ? '生成中…' : '↻ 换一篇'}
        </button>
      </div>
    </div>
  )
}
