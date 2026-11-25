import React, { useCallback, useEffect, useState } from 'react'
import { api } from '../../core/api.js'
import { store, useShared } from '../../core/store.js'

let cachedSettings = null

// Settings tab: celebration toggle + session/bank links + content directions.
export function SettingsPanel({ onTopicChange, onPhraseConfigChange }) {
  const shared = useShared()
  const [data, setData] = useState(() => cachedSettings)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(() => !cachedSettings)

  const load = useCallback(async () => {
    if (!cachedSettings) setLoading(true)
    try {
      const result = await api('/settings')
      cachedSettings = result
      setData(result)
      store.setSettings(result.settings)
      setError('')
    } catch (e) {
      setError(e.message || '设置加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const save = useCallback(
    async (patch, changeScope) => {
      if (busy) return false
      setBusy(true)
      setError('')
      try {
        const result = await api('/settings', {
          method: 'POST',
          body: JSON.stringify(patch),
        })
        cachedSettings = result
        setData(result)
        store.setSettings(result.settings)
        if (changeScope === true || changeScope === 'topic') {
          if (typeof onTopicChange === 'function') onTopicChange()
        } else if (changeScope === 'phrase') {
          if (typeof onPhraseConfigChange === 'function') onPhraseConfigChange()
        }
        return true
      } catch (e) {
        setError(e.message || '设置保存失败')
        return false
      } finally {
        setBusy(false)
      }
    },
    [busy, onTopicChange, onPhraseConfigChange],
  )

  const settings = data ? data.settings : shared.settings
  const directions = data ? data.directions : []
  const customTopics = settings.customTopics || []
  const activeId = settings.topicId

  const chooseDirection = (id) => {
    if (busy || id === activeId) return
    save({ topicId: id }, true)
  }

  const addCustom = async () => {
    const label = draft.trim()
    if (!label || busy) return
    const ok = await save({ customTopics: customTopics.concat({ label }) }, true)
    if (ok) setDraft('')
  }

  const removeCustom = (id) => {
    if (busy) return
    save({ customTopics: customTopics.filter((item) => item.id !== id) }, true)
  }

  const setRetries = (value) => {
    if (busy) return
    const next = Math.max(0, Math.min(5, Number(value) || 0))
    if (next === settings.bankRetries) return
    save({ bankRetries: next }, false)
  }

  if (loading && !data) {
    return React.createElement(
      'div',
      { className: 'eg-settings' },
      React.createElement(
        'div',
        { className: 'eg-settings-loading' },
        React.createElement('span', { className: 'eg-spin' }),
        '正在加载设置…',
      ),
      error ? React.createElement('div', { className: 'eg-settings-error' }, error) : null,
    )
  }

  const builtinDirections = directions.filter((item) => item.builtin !== false)
  const customDirections = directions.filter((item) => item.builtin === false)
  const activeDirection = directions.find((item) => item.id === activeId)

  return React.createElement(
    'div',
    { className: 'eg-settings' },
    React.createElement(
      'div',
      { className: 'eg-setting-section' },
      React.createElement(
        'div',
        { className: 'eg-section-head' },
        React.createElement('div', { className: 'eg-section-label' }, '练习偏好'),
      ),
      React.createElement(
        'div',
        { className: 'eg-setting-card' },
        React.createElement(
          'div',
          { className: 'eg-setting-row' },
          React.createElement(
            'div',
            { className: 'eg-setting-head' },
            React.createElement(
              'div',
              { className: 'eg-setting-info' },
              React.createElement('div', { className: 'eg-setting-title' }, '庆祝效果'),
              React.createElement('div', { className: 'eg-setting-desc' }, '答对时从四周喷射彩带。'),
            ),
            React.createElement('button', {
              type: 'button',
              className: 'eg-switch',
              role: 'switch',
              'aria-checked': settings.confetti ? 'true' : 'false',
              'aria-label': '彩带庆祝',
              disabled: busy,
              onClick: () => save({ confetti: !settings.confetti }, false),
            }),
          ),
        ),
        React.createElement(
          'div',
          { className: 'eg-setting-row' },
          React.createElement(
            'div',
            { className: 'eg-setting-head' },
            React.createElement(
              'div',
              { className: 'eg-setting-info' },
              React.createElement('div', { className: 'eg-setting-title' }, '会话关联'),
              React.createElement(
                'div',
                { className: 'eg-setting-desc' },
                '开启后，短语训练会读取当前会话并截取部分对话内容作为翻译素材（自动过滤代码与过长文本），不再关注词库关联和内容方向；当前会话暂无可用内容时自动回退。',
              ),
            ),
            React.createElement('button', {
              type: 'button',
              className: 'eg-switch',
              role: 'switch',
              'aria-checked': settings.sessionLink ? 'true' : 'false',
              'aria-label': '会话关联',
              disabled: busy,
              onClick: () => save({ sessionLink: !settings.sessionLink }, 'phrase'),
            }),
          ),
        ),
        React.createElement(
          'div',
          { className: 'eg-setting-row' },
          React.createElement(
            'div',
            { className: 'eg-setting-head' },
            React.createElement(
              'div',
              { className: 'eg-setting-info' },
              React.createElement('div', { className: 'eg-setting-title' }, '词库关联'),
              React.createElement(
                'div',
                { className: 'eg-setting-desc' },
                '开启后，短语出题和今日报告会从当前词库挑词，自然融入句子和文章（不硬塞）。',
              ),
            ),
            React.createElement('button', {
              type: 'button',
              className: 'eg-switch',
              role: 'switch',
              'aria-checked': settings.bankLink ? 'true' : 'false',
              'aria-label': '词库关联',
              disabled: busy,
              onClick: () => save({ bankLink: !settings.bankLink }, false),
            }),
          ),
          settings.sessionLink
            ? React.createElement(
                'div',
                { className: 'eg-setting-note' },
                '已开启会话关联：短语训练优先按当前会话出题，词库关联仅用于今日报告或无可用会话时兜底。',
              )
            : null,
          React.createElement(
            'div',
            {
              className: 'eg-collapse' + (settings.bankLink ? ' open' : ''),
              'aria-hidden': settings.bankLink ? 'false' : 'true',
            },
            React.createElement(
              'div',
              { className: 'eg-collapse-inner' },
              React.createElement(
                'div',
                { className: 'eg-setting-sub' },
                React.createElement(
                  'div',
                  { className: 'eg-setting-info' },
                  React.createElement('div', { className: 'eg-sub-title' }, '重试次数'),
                  React.createElement(
                    'div',
                    { className: 'eg-setting-desc' },
                    '生成的句子或文章没用到词库词时，再试几次（0–5）。',
                  ),
                ),
                React.createElement(
                  'div',
                  { className: 'eg-stepper' },
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'eg-stepbtn',
                      'aria-label': '减少重试次数',
                      tabIndex: settings.bankLink ? undefined : -1,
                      disabled: busy || !settings.bankLink || settings.bankRetries <= 0,
                      onClick: () => setRetries(settings.bankRetries - 1),
                    },
                    '−',
                  ),
                  React.createElement('span', { className: 'eg-stepper-value' }, String(settings.bankRetries)),
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      className: 'eg-stepbtn',
                      'aria-label': '增加重试次数',
                      tabIndex: settings.bankLink ? undefined : -1,
                      disabled: busy || !settings.bankLink || settings.bankRetries >= 5,
                      onClick: () => setRetries(settings.bankRetries + 1),
                    },
                    '+',
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
    React.createElement(
      'div',
      { className: 'eg-setting-section' },
      React.createElement(
        'div',
        { className: 'eg-section-head' },
        React.createElement('div', { className: 'eg-section-label' }, '内容方向'),
        activeDirection
          ? React.createElement(
              'div',
              { className: 'eg-active-badge', title: '当前方向：' + activeDirection.label },
              React.createElement('span', null, activeDirection.label),
            )
          : null,
      ),
      React.createElement(
        'div',
        { className: 'eg-setting-card' },
        React.createElement(
          'div',
          { className: 'eg-setting-row' },
          React.createElement(
            'div',
            { className: 'eg-setting-desc eg-lead' },
            settings.sessionLink
              ? '已开启会话关联，短语训练优先按当前会话出题；内容方向用于今日报告及无可用会话时兜底。'
              : '用于生成短语和今日报告；切换后下一题、下一篇生效。',
          ),
          React.createElement(
            'div',
            { className: 'eg-direction-list' },
            builtinDirections.map((item) =>
              React.createElement(
                'button',
                {
                  type: 'button',
                  key: item.id,
                  className: 'eg-direction' + (item.id === activeId ? ' active' : ''),
                  'aria-pressed': item.id === activeId ? 'true' : 'false',
                  disabled: busy,
                  title: item.label,
                  onClick: () => chooseDirection(item.id),
                },
                item.label,
              ),
            ),
          ),
        ),
        React.createElement(
          'div',
          { className: 'eg-setting-row' },
          React.createElement(
            'div',
            { className: 'eg-custom-head' },
            React.createElement('div', { className: 'eg-sub-title' }, '自定义方向'),
            React.createElement(
              'span',
              { className: 'eg-custom-count' },
              customTopics.length ? customTopics.length + ' / 40' : '最多 40 个',
            ),
          ),
          React.createElement(
            'div',
            { className: 'eg-setting-desc' },
            '添加你自己的主题，点击即可切换，与内置方向一样用于生成内容。',
          ),
          customDirections.length
            ? React.createElement(
                'div',
                { className: 'eg-custom-chips' },
                customDirections.map((item) =>
                  React.createElement(
                    'div',
                    {
                      className: 'eg-custom-chip' + (item.id === activeId ? ' active' : ''),
                      key: item.id,
                    },
                    React.createElement(
                      'button',
                      {
                        type: 'button',
                        className: 'eg-custom-select',
                        'aria-pressed': item.id === activeId ? 'true' : 'false',
                        disabled: busy,
                        title: item.label,
                        onClick: () => chooseDirection(item.id),
                      },
                      item.label,
                    ),
                    React.createElement(
                      'button',
                      {
                        type: 'button',
                        className: 'eg-custom-remove',
                        title: '删除方向',
                        'aria-label': '删除 ' + item.label,
                        disabled: busy,
                        onClick: () => removeCustom(item.id),
                      },
                      '×',
                    ),
                  ),
                ),
              )
            : null,
          React.createElement(
            'div',
            { className: 'eg-addrow' },
            React.createElement('input', {
              className: 'eg-text',
              value: draft,
              maxLength: 40,
              placeholder: '例如：摄影与视觉',
              'aria-label': '自定义方向名称',
              onChange: (e) => setDraft(e.target.value),
              onKeyDown: (e) => {
                if (e.key === 'Enter') addCustom()
              },
            }),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'eg-btn primary',
                disabled: busy || !draft.trim(),
                onClick: addCustom,
              },
              '添加',
            ),
          ),
        ),
      ),
    ),
    error ? React.createElement('div', { className: 'eg-settings-error' }, error) : null,
  )
}
