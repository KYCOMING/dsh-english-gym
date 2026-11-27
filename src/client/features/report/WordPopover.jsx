import React from 'react'
import { formatPos } from '../../core/text.js'

export function WordPopover({ active, popPos, popRef, onCancelClose, onLeave, onClose }) {
  if (!active) return null

  const activePos = active.item.pos ? formatPos(active.item.pos) : ''
  const activeLemma =
    active.item.lemma && active.item.lemma.toLowerCase() !== active.text.toLowerCase()
      ? active.item.lemma
      : ''

  return (
    <div
      ref={popRef}
      className={
        'eg-rpop' +
        (popPos ? ' is-ready' : '') +
        (popPos && popPos.placement === 'below' ? ' is-below' : '') +
        (active.pinned ? ' is-pinned' : '')
      }
      role={active.pinned ? 'dialog' : 'tooltip'}
      aria-label={active.text + ' 释义'}
      style={
        popPos
          ? { left: popPos.left + 'px', top: popPos.top + 'px', '--eg-arrow-x': popPos.arrowX + 'px' }
          : { left: 0, top: 0 }
      }
      onMouseEnter={onCancelClose}
      onMouseLeave={onLeave}
    >
      <div className="eg-rpop-head">
        <div className="eg-rpop-title">
          <span className="eg-rpop-word">{active.text}</span>
          {activeLemma ? <span className="eg-rpop-lemma">{'→ ' + activeLemma}</span> : null}
        </div>
        {active.pinned ? (
          <button type="button" className="eg-rpop-close" aria-label="关闭释义" onClick={onClose}>
            ×
          </button>
        ) : null}
      </div>
      {activePos || active.item.fromBank ? (
        <div className="eg-rpop-tags">
          {activePos ? <span className="eg-rpop-pos">{activePos}</span> : null}
          {active.item.fromBank ? <span className="eg-rpop-bank">词库</span> : null}
        </div>
      ) : null}
      <div className="eg-rpop-zh">{active.item.zh}</div>
    </div>
  )
}
