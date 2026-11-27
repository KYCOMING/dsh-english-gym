import React, { useState } from 'react'

export function DirectionSection({
  sessionLink,
  activeId,
  activeDirection,
  builtinDirections,
  customDirections,
  customTopicsCount,
  onChooseDirection,
  onAddCustom,
  onRemoveCustom,
}) {
  const [draft, setDraft] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    const label = draft.trim()
    if (!label || adding) return
    setAdding(true)
    try {
      const ok = await onAddCustom(label)
      if (ok) setDraft('')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="eg-setting-section">
      <div className="eg-section-head">
        <div className="eg-section-label">内容方向</div>
        {activeDirection ? (
          <div className="eg-active-badge" title={'当前方向：' + activeDirection.label}>
            <span>{activeDirection.label}</span>
          </div>
        ) : null}
      </div>
      <div className="eg-setting-card">
        <div className="eg-setting-row">
          <div className="eg-setting-desc eg-lead">
            {sessionLink
              ? '已开启会话关联，短语训练优先按当前会话出题；内容方向用于今日文章及无可用会话时兜底。'
              : '用于生成短语和今日文章；切换后下一题、下一篇生效。'}
          </div>
          <div className="eg-direction-list">
            {builtinDirections.map((item) => (
              <button
                type="button"
                key={item.id}
                className={'eg-direction' + (item.id === activeId ? ' active' : '')}
                aria-pressed={item.id === activeId ? 'true' : 'false'}
                title={item.label}
                onClick={() => onChooseDirection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="eg-setting-row">
          <div className="eg-custom-head">
            <div className="eg-sub-title">自定义方向</div>
            <span className="eg-custom-count">{customTopicsCount ? customTopicsCount + ' / 40' : '最多 40 个'}</span>
          </div>
          <div className="eg-setting-desc">添加你自己的主题，点击即可切换，与内置方向一样用于生成内容。</div>
          {customDirections.length ? (
            <div className="eg-custom-chips">
              {customDirections.map((item) => (
                <div className={'eg-custom-chip' + (item.id === activeId ? ' active' : '')} key={item.id}>
                  <button
                    type="button"
                    className="eg-custom-select"
                    aria-pressed={item.id === activeId ? 'true' : 'false'}
                    title={item.label}
                    onClick={() => onChooseDirection(item.id)}
                  >
                    {item.label}
                  </button>
                  <button
                    type="button"
                    className="eg-custom-remove"
                    title="删除方向"
                    aria-label={'删除 ' + item.label}
                    onClick={() => onRemoveCustom(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <div className="eg-addrow">
            <input
              className="eg-text"
              value={draft}
              maxLength={40}
              placeholder="例如：摄影与视觉"
              aria-label="自定义方向名称"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd()
              }}
            />
            <button type="button" className="eg-btn primary" disabled={adding || !draft.trim()} onClick={handleAdd}>
              添加
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
