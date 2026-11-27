import React from 'react'

export function PracticePrefsSection({ settings, onSave, onSetRetries }) {
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
