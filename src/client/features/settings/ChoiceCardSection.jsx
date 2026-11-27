import React, { useState } from 'react'

export function ChoiceCardSection({
  title,
  badgePrefix,
  lead,
  listClassName,
  items,
  activeId,
  fallbackActiveItem,
  onSelect,
}) {
  const [hoverId, setHoverId] = useState(null)
  const activeItem = items.find((item) => item.id === activeId) || fallbackActiveItem
  const shownItem = (hoverId !== null ? items.find((item) => item.id === hoverId) : null) || activeItem

  return (
    <div className="eg-setting-section">
      <div className="eg-section-head">
        <div className="eg-section-label">{title}</div>
        {activeItem ? (
          <div
            className="eg-active-badge"
            title={badgePrefix + '：' + activeItem.label + (activeItem.desc ? ' · ' + activeItem.desc : '')}
          >
            <span>{activeItem.label + (activeItem.desc ? ' · ' + activeItem.desc : '')}</span>
          </div>
        ) : null}
      </div>
      <div className="eg-setting-card">
        <div className="eg-setting-row">
          <div className="eg-setting-desc eg-lead">{lead}</div>
          <div className={listClassName} onMouseLeave={() => setHoverId(null)}>
            {items.map((item) => (
              <button
                type="button"
                key={String(item.id)}
                className={'eg-level' + (item.id === activeId ? ' active' : '')}
                aria-pressed={item.id === activeId ? 'true' : 'false'}
                title={item.label + (item.desc ? ' · ' + item.desc : '')}
                onMouseEnter={() => setHoverId(item.id)}
                onFocus={() => setHoverId(item.id)}
                onBlur={() => setHoverId((prev) => (prev === item.id ? null : prev))}
                onClick={() => onSelect(item.id)}
              >
                <span className="eg-level-code">{item.label}</span>
                {item.desc ? <span className="eg-level-desc">{item.desc}</span> : null}
              </button>
            ))}
          </div>
          {shownItem && shownItem.detail ? (
            <div className="eg-level-detail">
              <strong>{shownItem.label + (shownItem.desc ? ' ' + shownItem.desc : '')}</strong>
              <span>{shownItem.detail}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
