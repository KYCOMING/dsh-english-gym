import React, { useEffect, useRef, useState } from 'react'
import { MODES } from './srsFormat.js'

const useIsoLayoutEffect = React.useLayoutEffect || useEffect

export function WordTopBar({ mode, dueCount, busy, liveStats, learningCount, masteredCount, bankLabel, onSwitchMode }) {
  const [hoverMode, setHoverMode] = useState('')
  const [slider, setSlider] = useState({ left: 0, width: 0, ready: false })
  const listRef = useRef(null)
  const tabRefs = useRef({})
  const shownMode = MODES.find((m) => m.id === (hoverMode || mode)) || MODES[0]

  useIsoLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current && tabRefs.current[mode]
      if (!el) return
      const left = el.offsetLeft
      const width = el.offsetWidth
      setSlider((prev) =>
        prev.ready && prev.left === left && prev.width === width ? prev : { left, width, ready: true },
      )
    }
    measure()
    const raf = requestAnimationFrame(measure)
    let ro = null
    if (typeof ResizeObserver === 'function' && listRef.current) {
      ro = new ResizeObserver(measure)
      ro.observe(listRef.current)
    }
    return () => {
      cancelAnimationFrame(raf)
      if (ro) ro.disconnect()
    }
  }, [mode, dueCount])

  return (
    <div className="eg-srs-bar" data-nodrag="true">
      <div
        ref={listRef}
        className={'eg-srs-modes' + (slider.ready ? ' has-slider' : '')}
        role="tablist"
        aria-label="出词模式"
        onMouseLeave={() => setHoverMode('')}
      >
        {slider.ready ? (
          <span
            className="eg-srs-indicator"
            aria-hidden="true"
            style={{ transform: 'translateX(' + slider.left + 'px)', width: slider.width + 'px' }}
          />
        ) : null}
        {MODES.map((m) => (
          <button
            key={m.id}
            ref={(el) => {
              tabRefs.current[m.id] = el
            }}
            type="button"
            role="tab"
            aria-selected={mode === m.id ? 'true' : 'false'}
            className={'eg-srs-mode' + (mode === m.id ? ' active' : '')}
            title={m.title}
            disabled={busy}
            onMouseEnter={() => setHoverMode(m.id)}
            onFocus={() => setHoverMode(m.id)}
            onBlur={() => setHoverMode((prev) => (prev === m.id ? '' : prev))}
            onClick={() => onSwitchMode(m.id)}
          >
            {m.label}
            {m.id === 'review' && dueCount > 0 ? <span className="eg-srs-due">{String(dueCount)}</span> : null}
          </button>
        ))}
      </div>
      <div className="eg-srs-hint">{shownMode.title}</div>
      {liveStats || bankLabel ? (
        <div className="eg-srs-meta" title="词库可在「设置 → 单词词库」切换">
          {[bankLabel, liveStats ? '学习中 ' + learningCount : '', liveStats ? '已掌握 ' + masteredCount : '']
            .filter(Boolean)
            .join(' · ')}
        </div>
      ) : null}
    </div>
  )
}
