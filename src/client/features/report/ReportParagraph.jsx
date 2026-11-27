import React from 'react'
import { annotateSentenceSegments } from './highlight.js'

function hasSentenceHint(s) {
  return Boolean(
    s && ((Array.isArray(s.chunks) && s.chunks.length >= 2) || (Array.isArray(s.core) && s.core.length > 0)),
  )
}

function SentenceExplainBox({ exp, onRetry }) {
  const expLoading = !!(exp && exp.loading)
  const expData = exp && exp.data
  const expErr = exp && exp.error

  return (
    <div className="eg-rexplain">
      {expLoading ? (
        <div className="eg-rexplain-loading">
          <span className="eg-spin" />
          正在解析句型与译法…
        </div>
      ) : expErr ? (
        <div className="eg-rexplain-err">
          <span>{expErr}</span>
          <button type="button" className="eg-rslot-btn" onClick={onRetry}>
            重试
          </button>
        </div>
      ) : expData ? (
        <>
          {expData.structure ? (
            <div className="eg-rexplain-sec">
              <span className="eg-rexplain-label">句型</span>
              <span className="eg-rexplain-text">{expData.structure}</span>
            </div>
          ) : null}
          {expData.points && expData.points.length ? (
            <ul className="eg-rexplain-pts">
              {expData.points.map((pt, pi) => (
                <li key={pi} className="eg-rexplain-pt">
                  <span className="eg-rexplain-phrase">{pt.phrase}</span>
                  <span className="eg-rexplain-note">{pt.note}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {expData.nuance ? (
            <div className="eg-rexplain-sec">
              <span className="eg-rexplain-label">译法</span>
              <span className="eg-rexplain-text">{expData.nuance}</span>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export function ReportParagraph({
  index,
  segs,
  paragraphText,
  info,
  reveal,
  explains,
  activeTermId,
  termRefs,
  onToggleGist,
  onToggleSentence,
  onExplainToggle,
  termHandlers,
}) {
  const renderSeg = (seg, j) => {
    if (seg.type === 'slash') {
      return (
        <span key={'sl-' + j} className="eg-rslash" aria-hidden="true">
          /
        </span>
      )
    }
    if (seg.type !== 'term') {
      return seg.inCore ? (
        <span key={'c-' + j} className="eg-rcore">
          {seg.text}
        </span>
      ) : (
        seg.text
      )
    }
    const isActive = activeTermId === seg.id
    return (
      <mark
        key={seg.id + '-' + j}
        ref={(el) => {
          if (el) termRefs.current[seg.id] = el
          else delete termRefs.current[seg.id]
        }}
        className={'eg-rword' + (isActive ? ' is-active' : '') + (seg.inCore ? ' is-core' : '')}
        role="button"
        tabIndex={0}
        aria-expanded={isActive ? 'true' : 'false'}
        onMouseEnter={() => termHandlers.onEnter(seg)}
        onMouseLeave={termHandlers.onLeave}
        onClick={(e) => termHandlers.onClick(e, seg)}
        onFocus={() => termHandlers.onFocus(seg)}
        onBlur={termHandlers.onBlur}
        onKeyDown={(e) => termHandlers.onKeyDown(e, seg)}
      >
        {seg.text}
      </mark>
    )
  }

  if (!info || (!info.groups && !info.gist)) {
    return <p className="eg-rp">{segs.map(renderSeg)}</p>
  }

  const handleSentenceClick = (e, key) => {
    const sel = typeof window !== 'undefined' && window.getSelection ? window.getSelection() : null
    if (sel && String(sel).trim()) return
    if (e.target && e.target.closest && e.target.closest('.eg-rword')) return
    onToggleSentence(key)
  }

  const handleSentenceKeyDown = (e, key) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      onToggleSentence(key)
    }
  }

  const children = info.groups
    ? info.groups.map((g, gi) => {
        if (g.type !== 'sentence') {
          return <React.Fragment key={'gap-' + gi}>{g.segs.map(renderSeg)}</React.Fragment>
        }
        const n = info.base + g.index
        const s = info.sentences[g.index] || {}
        const key = 's' + n
        const canReveal = !!(s && s.zh)
        const isOpen = canReveal && !!reveal[key]
        const segList = isOpen && hasSentenceHint(s) ? annotateSentenceSegments(s.en, g.segs, s) : g.segs

        return (
          <span
            key={key}
            className={'eg-rsent' + (canReveal ? ' can-reveal' : '') + (isOpen ? ' is-open' : '')}
            tabIndex={canReveal ? 0 : undefined}
            aria-expanded={canReveal ? (isOpen ? 'true' : 'false') : undefined}
            title={canReveal ? (isOpen ? '点击收起本句译文' : '点击查看本句译文') : undefined}
            onClick={canReveal ? (e) => handleSentenceClick(e, key) : undefined}
            onKeyDown={canReveal ? (e) => handleSentenceKeyDown(e, key) : undefined}
          >
            {segList.map(renderSeg)}
            {isOpen ? (
              <sup className="eg-rsent-n" aria-hidden="true">
                {String(n + 1)}
              </sup>
            ) : null}
          </span>
        )
      })
    : segs.map(renderSeg)

  const gistKey = 'g' + index
  const gistOpen = !!(info.gist && reveal[gistKey])
  const openSentences = info.sentences
    .map((s, si) => ({ s, si, n: info.base + si }))
    .filter(({ s, n }) => s && s.zh && reveal['s' + n])

  return (
    <>
      <p className="eg-rp">
        {children}
        {info.gist ? (
          <button
            type="button"
            className="eg-rgist-btn"
            aria-expanded={gistOpen ? 'true' : 'false'}
            title={gistOpen ? '收起本段大意' : '看本段大意（中文）'}
            onClick={() => onToggleGist(gistKey)}
          >
            段意
          </button>
        ) : null}
      </p>
      {gistOpen || openSentences.length ? (
        <div className="eg-rslot" aria-live="polite">
          {gistOpen ? (
            <div key={gistKey} className="eg-rslot-row is-gist">
              <span className="eg-rslot-tag">段意</span>
              <span className="eg-rslot-zh">{info.gist}</span>
              <button type="button" className="eg-rslot-x" aria-label="收起段意" onClick={() => onToggleGist(gistKey)}>
                ×
              </button>
            </div>
          ) : null}
          {openSentences.map(({ s, si, n }) => {
            const skey = 's' + n
            const exp = explains[skey] || null
            const expOpen = !!(exp && exp.open)
            const expLoading = !!(exp && exp.loading)
            const explainPayload = { key: skey, pIdx: index, sIdx: si, sentence: s, paragraphText }

            return (
              <div key={skey} className="eg-rslot-row">
                <span className="eg-rslot-tag">{String(n + 1)}</span>
                <div className="eg-rslot-body">
                  <div className="eg-rslot-zh">{s.zh}</div>
                  <div className="eg-rslot-tools">
                    <button
                      type="button"
                      className={'eg-rslot-btn' + (expOpen ? ' is-active' : '')}
                      aria-expanded={expOpen ? 'true' : 'false'}
                      disabled={expLoading}
                      onClick={() => onExplainToggle(explainPayload)}
                    >
                      {expLoading ? '解析中…' : expOpen ? '收起讲解' : '为什么？'}
                    </button>
                  </div>
                  {expOpen ? (
                    <SentenceExplainBox
                      exp={exp}
                      onRetry={() => onExplainToggle({ ...explainPayload, retry: true })}
                    />
                  ) : null}
                </div>
                <button
                  type="button"
                  className="eg-rslot-x"
                  aria-label={'收起第 ' + (n + 1) + ' 句译文'}
                  onClick={() => onToggleSentence(skey)}
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      ) : null}
    </>
  )
}
