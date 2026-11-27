import React, { useEffect, useRef, useState } from 'react'

export function PracticePrefsSection({
  settings,
  reasoningEfforts,
  activeReasoningEffort,
  onSave,
  onSetRetries,
  onChooseReasoningEffort,
}) {
  const effortOptions = Array.isArray(reasoningEfforts) ? reasoningEfforts : []
  const selectableEfforts = effortOptions.filter((item) => item.id !== 'off')
  const currentEffort = activeReasoningEffort || 'off'
  const thinkingOn = currentEffort !== 'off'
  const lastEnabledRef = useRef('low')
  const [hoverEffort, setHoverEffort] = useState(null)

  useEffect(() => {
    if (currentEffort && currentEffort !== 'off') {
      lastEnabledRef.current = currentEffort
    }
  }, [currentEffort])

  const activeEffortObj =
    selectableEfforts.find((item) => item.id === currentEffort) || selectableEfforts[0] || null
  const shownEffortObj =
    (hoverEffort ? selectableEfforts.find((item) => item.id === hoverEffort) : null) || activeEffortObj

  return (
    <div className="eg-setting-section">
      <div className="eg-section-head">
        <div className="eg-section-label">练习偏好</div>
      </div>
      <div className="eg-setting-card">
        <div className="eg-setting-row">
          <div className="eg-setting-head">
            <div className="eg-setting-info">
              <div className="eg-setting-title">庆祝效果</div>
              <div className="eg-setting-desc">答对时从四周喷射彩带。</div>
            </div>
            <button
              type="button"
              className="eg-switch"
              role="switch"
              aria-checked={settings.confetti ? 'true' : 'false'}
              aria-label="彩带庆祝"
              onClick={() => onSave({ confetti: !settings.confetti }, false)}
            />
          </div>
        </div>
        <div className="eg-setting-row">
          <div className="eg-setting-head">
            <div className="eg-setting-info">
              <div className="eg-setting-title">深度思考</div>
              <div className="eg-setting-desc">
                关闭后将跳过思考过程以大幅加快文章生成、出题与讲解速度；开启后可按需调节模型思考强度（仅对支持思考的模型生效）。
              </div>
            </div>
            <button
              type="button"
              className="eg-switch"
              role="switch"
              aria-checked={thinkingOn ? 'true' : 'false'}
              aria-label="深度思考"
              onClick={() => onChooseReasoningEffort(thinkingOn ? 'off' : lastEnabledRef.current || 'low')}
            />
          </div>
          <div className={'eg-collapse' + (thinkingOn ? ' open' : '')} aria-hidden={thinkingOn ? 'false' : 'true'}>
            <div className="eg-collapse-inner">
              <div className="eg-setting-sub is-stack">
                <div className="eg-effort-head">
                  <div className="eg-sub-title">思考强度</div>
                  {activeEffortObj ? (
                    <span className="eg-effort-badge">
                      {activeEffortObj.label + (activeEffortObj.desc ? ' · ' + activeEffortObj.desc : '')}
                    </span>
                  ) : null}
                </div>
                <div className="eg-effort-list" onMouseLeave={() => setHoverEffort(null)}>
                  {selectableEfforts.map((item) => {
                    const isActive = item.id === currentEffort
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={'eg-effort-btn' + (isActive ? ' active' : '')}
                        aria-pressed={isActive ? 'true' : 'false'}
                        tabIndex={thinkingOn ? undefined : -1}
                        title={item.label + (item.desc ? ' · ' + item.desc : '')}
                        onMouseEnter={() => setHoverEffort(item.id)}
                        onFocus={() => setHoverEffort(item.id)}
                        onBlur={() => setHoverEffort((prev) => (prev === item.id ? null : prev))}
                        onClick={() => onChooseReasoningEffort(item.id)}
                      >
                        <span className="eg-effort-label">{item.label}</span>
                        {item.desc ? <span className="eg-effort-desc">{item.desc}</span> : null}
                      </button>
                    )
                  })}
                </div>
                {shownEffortObj && shownEffortObj.detail ? (
                  <div className="eg-effort-detail">{shownEffortObj.detail}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="eg-setting-row">
          <div className="eg-setting-head">
            <div className="eg-setting-info">
              <div className="eg-setting-title">会话关联</div>
              <div className="eg-setting-desc">
                开启后，短语训练会读取当前会话并截取部分对话内容作为翻译素材（自动过滤代码与过长文本），不再关注词库关联和内容方向；当前会话暂无可用内容时自动回退。
              </div>
            </div>
            <button
              type="button"
              className="eg-switch"
              role="switch"
              aria-checked={settings.sessionLink ? 'true' : 'false'}
              aria-label="会话关联"
              onClick={() => onSave({ sessionLink: !settings.sessionLink }, 'phrase')}
            />
          </div>
        </div>
        <div className="eg-setting-row">
          <div className="eg-setting-head">
            <div className="eg-setting-info">
              <div className="eg-setting-title">词库关联</div>
              <div className="eg-setting-desc">
                开启后，短语出题和今日文章会从当前词库挑词，自然融入句子和文章（不硬塞）。
              </div>
            </div>
            <button
              type="button"
              className="eg-switch"
              role="switch"
              aria-checked={settings.bankLink ? 'true' : 'false'}
              aria-label="词库关联"
              onClick={() => onSave({ bankLink: !settings.bankLink }, true)}
            />
          </div>
          {settings.sessionLink ? (
            <div className="eg-setting-note">
              已开启会话关联：短语训练优先按当前会话出题，词库关联仅用于今日文章或无可用会话时兜底。
            </div>
          ) : null}
          <div
            className={'eg-collapse' + (settings.bankLink ? ' open' : '')}
            aria-hidden={settings.bankLink ? 'false' : 'true'}
          >
            <div className="eg-collapse-inner">
              <div className="eg-setting-sub">
                <div className="eg-setting-info">
                  <div className="eg-sub-title">重试次数</div>
                  <div className="eg-setting-desc">生成的句子或文章没用到词库词时，再试几次（0–5）。</div>
                </div>
                <div className="eg-stepper">
                  <button
                    type="button"
                    className="eg-stepbtn"
                    aria-label="减少重试次数"
                    tabIndex={settings.bankLink ? undefined : -1}
                    disabled={!settings.bankLink || settings.bankRetries <= 0}
                    onClick={() => onSetRetries(settings.bankRetries - 1)}
                  >
                    −
                  </button>
                  <span className="eg-stepper-value">{String(settings.bankRetries)}</span>
                  <button
                    type="button"
                    className="eg-stepbtn"
                    aria-label="增加重试次数"
                    tabIndex={settings.bankLink ? undefined : -1}
                    disabled={!settings.bankLink || settings.bankRetries >= 5}
                    onClick={() => onSetRetries(settings.bankRetries + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
