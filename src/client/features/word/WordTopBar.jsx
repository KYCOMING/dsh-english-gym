import React, { useState } from 'react'
import { MODES } from './srsFormat.js'

export function WordTopBar({ mode, dueCount, busy, liveStats, learningCount, masteredCount, bankLabel, onSwitchMode }) {
  const [hoverMode, setHoverMode] = useState('')
  const shownMode = MODES.find((m) => m.id === (hoverMode || mode)) || MODES[0]

  return (
    <div className="eg-srs-bar" data-nodrag="true">
      <div
        className="eg-srs-modes"
        role="tablist"
        aria-label="出词模式"
        onMouseLeave={() => setHoverMode('')}
      >
        {MODES.map((m) => (
          <button
            key={m.id}
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
