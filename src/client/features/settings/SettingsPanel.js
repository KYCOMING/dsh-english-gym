import React, { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../core/api.js'
import { store, useShared } from '../../core/store.js'
import { WordBankImport } from '../word/WordBankImport.js'

let cachedSettings = null
let cachedBanks = null

const FALLBACK_LEVELS = [
  { id: 'A1', label: 'A1', desc: '入门', detail: '约小学至初中水平 · 简短句式与日常基础词汇，适合零基础起步' },
  { id: 'A2', label: 'A2', desc: '基础', detail: '约初中至高中入门 · 常见生活话题与直白表达，轻松建立阅读语感' },
  { id: 'B1', label: 'B1', desc: '进阶', detail: '约高考 / 大学四级（CET-4）· 清晰自然的实用表达，日常与职场阅读主力' },
  { id: 'B2', label: 'B2', desc: '熟练', detail: '约大学六级（CET-6）/ 雅思 6.0–6.5 · 句式更丰富，流畅阅读技术博客与行业资讯' },
  { id: 'C1', label: 'C1', desc: '高级', detail: '约雅思 7.0–7.5 / 托福 95+ · 地道外刊文风，含精准词汇与复杂长难句' },
  { id: 'C2', label: 'C2', desc: '精通', detail: '约雅思 8.0+ / 母语外刊水准 · 细腻修辞、高阶词汇与深度评论风格' },
]

const CLEANUP_RANGES = [
  { id: '7d', label: '7 天前' },
  { id: '30d', label: '30 天前' },
  { id: '90d', label: '90 天前' },
  { id: '365d', label: '一年前' },
  { id: 'all', label: '全部记录' },
]

// Settings tab: celebration toggle + session/bank links + word bank + report level + content directions + data cleanup.
export function SettingsPanel({ onTopicChange, onPhraseConfigChange, onReportConfigChange, onWordBankChange, onDataCleared }) {
  const shared = useShared()
  const [data, setData] = useState(() => cachedSettings)
  const [bankData, setBankData] = useState(() => cachedBanks)
  const [importing, setImporting] = useState(false)
  const [bankNotice, setBankNotice] = useState('')
  const [cleanRange, setCleanRange] = useState('30d')
  const [clearMemory, setClearMemory] = useState(false)
  const [cleanPreview, setCleanPreview] = useState(null)
  const [cleanBusy, setCleanBusy] = useState(false)
  const [cleanNotice, setCleanNotice] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState('')
  const [hoverLevel, setHoverLevel] = useState('')
  const [loading, setLoading] = useState(() => !cachedSettings)
  const queueRef = useRef(Promise.resolve())
  const seqRef = useRef(0)
  const lastConfirmedRef = useRef(cachedSettings)

  const load = useCallback(async () => {
    if (!cachedSettings) setLoading(true)
    try {
      const [settingsRes, banksRes] = await Promise.all([
        api('/settings'),
        api('/wordbanks').catch(() => null),
      ])
      cachedSettings = settingsRes
      lastConfirmedRef.current = settingsRes
      setData(settingsRes)
      store.setSettings(settingsRes.settings)
      if (banksRes && Array.isArray(banksRes.banks)) {
        cachedBanks = banksRes
        setBankData(banksRes)
      }
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
    (patch, changeScope) => {
      const seq = ++seqRef.current
      setError('')

      // Optimistically apply scalar setting changes immediately so controls never flash disabled.
      const scalarPatch = {}
      for (const key of ['confetti', 'sessionLink', 'bankLink', 'bankRetries', 'reportLevel', 'topicId']) {
        if (patch && patch[key] !== undefined) scalarPatch[key] = patch[key]
      }
      if (Object.keys(scalarPatch).length) {
        store.setSettings(scalarPatch)
        setData((prev) => {
          if (!prev || !prev.settings) return prev
          const next = { ...prev, settings: { ...prev.settings, ...scalarPatch } }
          cachedSettings = next
          return next
        })
      }

      const task = queueRef.current.then(async () => {
        try {
          const result = await api('/settings', {
            method: 'POST',
            body: JSON.stringify(patch),
          })
          lastConfirmedRef.current = result
          if (seq === seqRef.current) {
            cachedSettings = result
            setData(result)
            store.setSettings(result.settings)
          }
          if (changeScope === true || changeScope === 'topic') {
            if (typeof onTopicChange === 'function') onTopicChange()
          } else if (changeScope === 'phrase') {
            if (typeof onPhraseConfigChange === 'function') onPhraseConfigChange()
          } else if (changeScope === 'report') {
            if (typeof onReportConfigChange === 'function') onReportConfigChange()
          }
          return true
        } catch (e) {
          if (seq === seqRef.current && lastConfirmedRef.current) {
            cachedSettings = lastConfirmedRef.current
            setData(lastConfirmedRef.current)
            store.setSettings(lastConfirmedRef.current.settings)
          }
          setError(e.message || '设置保存失败')
          return false
        }
      })
      queueRef.current = task.catch(() => false)
      return task
    },
    [onTopicChange, onPhraseConfigChange, onReportConfigChange],
  )

  const settings = data ? data.settings : shared.settings
  const directions = data ? data.directions : []
  const levels = (data && Array.isArray(data.levels) && data.levels.length ? data.levels : FALLBACK_LEVELS).map((item) => {
    const fb = FALLBACK_LEVELS.find((f) => f.id === item.id)
    return item.detail || !fb ? item : { ...item, detail: fb.detail }
  })
  const customTopics = settings.customTopics || []
  const activeId = settings.topicId
  const activeLevel = settings.reportLevel || 'B1'

  const chooseDirection = (id) => {
    if (id === activeId) return
    save({ topicId: id }, true)
  }

  const chooseReportLevel = (id) => {
    if (id === activeLevel) return
    save({ reportLevel: id }, 'report')
  }

  const addCustom = async () => {
    const label = draft.trim()
    if (!label || adding) return
    setAdding(true)
    try {
      const ok = await save({ customTopics: customTopics.concat({ label }) }, false)
      if (ok) setDraft('')
    } finally {
      setAdding(false)
    }
  }

  const removeCustom = (id) => {
    save({ customTopics: customTopics.filter((item) => item.id !== id) }, id === activeId)
  }

  const setRetries = (value) => {
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
  const activeLevelObj = levels.find((item) => item.id === activeLevel) || levels[2] || { id: activeLevel, label: activeLevel, desc: '', detail: '' }
  const shownLevelObj = levels.find((item) => item.id === (hoverLevel || activeLevel)) || activeLevelObj

  const banks = bankData && Array.isArray(bankData.banks) ? bankData.banks : []
  const activeBankId = (bankData && bankData.active) || 'builtin'
  const builtinBanks = banks.filter((b) => b.builtin !== false)
  const customBanks = banks.filter((b) => b.builtin === false)
  const activeBankObj = banks.find((b) => b.id === activeBankId)
  const shortBankName = (name) => String(name || '').replace(/^内置\s*·\s*/, '')

  const chooseBank = async (id) => {
    if (!id || id === activeBankId) return
    const prev = bankData
    setError('')
    setBankNotice('')
    setBankData((cur) => {
      if (!cur) return cur
      const next = { ...cur, active: id }
      cachedBanks = next
      return next
    })
    try {
      const res = await api('/wordbanks/active', { method: 'POST', body: JSON.stringify({ id }) })
      if (res.summary) store.setStats(res.summary)
      if (typeof onWordBankChange === 'function') onWordBankChange()
    } catch (e) {
      cachedBanks = prev
      setBankData(prev)
      setError(e.message || '切换词库失败')
    }
  }

  const removeBank = async (id) => {
    const wasActive = id === activeBankId
    setError('')
    setBankNotice('')
    try {
      const res = await api('/wordbanks/delete', { method: 'POST', body: JSON.stringify({ id }) })
      const next = { active: res.active, banks: Array.isArray(res.banks) ? res.banks : banks.filter((b) => b.id !== id) }
      cachedBanks = next
      setBankData(next)
      if (res.summary) store.setStats(res.summary)
      if (wasActive && typeof onWordBankChange === 'function') onWordBankChange()
    } catch (e) {
      setError(e.message || '删除词库失败')
    }
  }

  const handleBankImported = async (res) => {
    setImporting(false)
    setBankNotice('已导入「' + res.bank.name + '」' + res.bank.count + ' 条')
    try {
      const banksRes = await api('/wordbanks')
      if (banksRes && Array.isArray(banksRes.banks)) {
        cachedBanks = banksRes
        setBankData(banksRes)
      }
    } catch {
      /* ignore */
    }
    if (typeof onWordBankChange === 'function') onWordBankChange()
  }

  const startCleanupPreview = async () => {
    if (cleanBusy) return
    setCleanBusy(true)
    setError('')
    setCleanNotice('')
    try {
      const preview = await api('/data/preview', {
        method: 'POST',
        body: JSON.stringify({ range: cleanRange, clearMemory }),
      })
      setCleanPreview(preview)
    } catch (e) {
      setError(e.message || '统计可清理数据失败')
    } finally {
      setCleanBusy(false)
    }
  }

  const confirmCleanup = async () => {
    if (cleanBusy) return
    setCleanBusy(true)
    setError('')
    try {
      const res = await api('/data/clear', {
        method: 'POST',
        body: JSON.stringify({ range: cleanRange, clearMemory }),
      })
      if (res.summary) store.setStats(res.summary)
      setCleanPreview(null)
      const rm = (res && res.removed) || {}
      const parts = []
      if (rm.recordDays) parts.push(rm.recordDays + ' 天学习记录')
      if (rm.reports) parts.push(rm.reports + ' 篇缓存文章')
      if (rm.memoryWords) parts.push(rm.memoryWords + ' 个单词记忆进度')
      setCleanNotice(parts.length ? '已清理：' + parts.join('、') : '已清理完成')
      if (typeof onDataCleared === 'function') onDataCleared({ range: cleanRange, clearMemory })
    } catch (e) {
      setError(e.message || '清理数据失败')
    } finally {
      setCleanBusy(false)
    }
  }

  if (importing) {
    return React.createElement(WordBankImport, {
      onClose: () => setImporting(false),
      onImported: handleBankImported,
    })
  }

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
                '开启后，短语出题和今日文章会从当前词库挑词，自然融入句子和文章（不硬塞）。',
              ),
            ),
            React.createElement('button', {
              type: 'button',
              className: 'eg-switch',
              role: 'switch',
              'aria-checked': settings.bankLink ? 'true' : 'false',
              'aria-label': '词库关联',
              onClick: () => save({ bankLink: !settings.bankLink }, true),
            }),
          ),
          settings.sessionLink
            ? React.createElement(
                'div',
                { className: 'eg-setting-note' },
                '已开启会话关联：短语训练优先按当前会话出题，词库关联仅用于今日文章或无可用会话时兜底。',
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
                      disabled: !settings.bankLink || settings.bankRetries <= 0,
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
                      disabled: !settings.bankLink || settings.bankRetries >= 5,
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
        React.createElement('div', { className: 'eg-section-label' }, '单词词库'),
        activeBankObj
          ? React.createElement(
              'div',
              { className: 'eg-active-badge', title: '当前词库：' + activeBankObj.name },
              React.createElement('span', null, shortBankName(activeBankObj.name) + ' · ' + activeBankObj.count + ' 词'),
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
            '选择单词训练与词库关联使用的词库；记忆进度跨词库通用。',
          ),
          builtinBanks.length
            ? React.createElement(
                'div',
                { className: 'eg-bank-list' },
                builtinBanks.map((b) =>
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      key: b.id,
                      className: 'eg-bank-item' + (b.id === activeBankId ? ' active' : ''),
                      'aria-pressed': b.id === activeBankId ? 'true' : 'false',
                      title: b.name + '（' + b.count + ' 词）',
                      onClick: () => chooseBank(b.id),
                    },
                    React.createElement('span', { className: 'eg-bank-name' }, shortBankName(b.name)),
                    React.createElement('span', { className: 'eg-bank-cnt' }, b.count + ' 词'),
                  ),
                ),
              )
            : null,
        ),
        React.createElement(
          'div',
          { className: 'eg-setting-row' },
          React.createElement(
            'div',
            { className: 'eg-custom-head' },
            React.createElement('div', { className: 'eg-sub-title' }, '自定义词库'),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'eg-bankbtn',
                onClick: () => {
                  setBankNotice('')
                  setImporting(true)
                },
              },
              '+ 导入词库',
            ),
          ),
          React.createElement(
            'div',
            { className: 'eg-setting-desc' },
            '支持导入 CSV / TSV / TXT / JSON 词表，导入后自动切换，不影响内置词库。',
          ),
          bankNotice ? React.createElement('div', { className: 'eg-notice eg-bank-notice' }, bankNotice) : null,
          customBanks.length
            ? React.createElement(
                'div',
                { className: 'eg-custom-chips' },
                customBanks.map((b) =>
                  React.createElement(
                    'div',
                    {
                      className: 'eg-custom-chip' + (b.id === activeBankId ? ' active' : ''),
                      key: b.id,
                    },
                    React.createElement(
                      'button',
                      {
                        type: 'button',
                        className: 'eg-custom-select',
                        'aria-pressed': b.id === activeBankId ? 'true' : 'false',
                        title: b.name + '（' + b.count + ' 词）',
                        onClick: () => chooseBank(b.id),
                      },
                      b.name + '（' + b.count + '）',
                    ),
                    React.createElement(
                      'button',
                      {
                        type: 'button',
                        className: 'eg-custom-remove',
                        title: '删除词库',
                        'aria-label': '删除 ' + b.name,
                        onClick: () => removeBank(b.id),
                      },
                      '×',
                    ),
                  ),
                ),
              )
            : null,
        ),
      ),
    ),
    React.createElement(
      'div',
      { className: 'eg-setting-section' },
      React.createElement(
        'div',
        { className: 'eg-section-head' },
        React.createElement('div', { className: 'eg-section-label' }, '文章难度'),
        activeLevelObj
          ? React.createElement(
              'div',
              { className: 'eg-active-badge', title: '当前难度：' + activeLevelObj.label + (activeLevelObj.desc ? ' · ' + activeLevelObj.desc : '') },
              React.createElement('span', null, activeLevelObj.label + (activeLevelObj.desc ? ' · ' + activeLevelObj.desc : '')),
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
            '控制今日文章的词汇与句式难度（CEFR）；切换后下次进入或换一篇生效。',
          ),
          React.createElement(
            'div',
            {
              className: 'eg-level-list',
              onMouseLeave: () => setHoverLevel(''),
            },
            levels.map((item) =>
              React.createElement(
                'button',
                {
                  type: 'button',
                  key: item.id,
                  className: 'eg-level' + (item.id === activeLevel ? ' active' : ''),
                  'aria-pressed': item.id === activeLevel ? 'true' : 'false',
                  title: item.label + (item.desc ? ' · ' + item.desc : ''),
                  onMouseEnter: () => setHoverLevel(item.id),
                  onFocus: () => setHoverLevel(item.id),
                  onBlur: () => setHoverLevel((prev) => (prev === item.id ? '' : prev)),
                  onClick: () => chooseReportLevel(item.id),
                },
                React.createElement('span', { className: 'eg-level-code' }, item.label),
                item.desc ? React.createElement('span', { className: 'eg-level-desc' }, item.desc) : null,
              ),
            ),
          ),
          shownLevelObj && shownLevelObj.detail
            ? React.createElement(
                'div',
                { className: 'eg-level-detail' },
                React.createElement(
                  'strong',
                  null,
                  shownLevelObj.label + (shownLevelObj.desc ? ' ' + shownLevelObj.desc : ''),
                ),
                React.createElement('span', null, shownLevelObj.detail),
              )
            : null,
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
              ? '已开启会话关联，短语训练优先按当前会话出题；内容方向用于今日文章及无可用会话时兜底。'
              : '用于生成短语和今日文章；切换后下一题、下一篇生效。',
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
                disabled: adding || !draft.trim(),
                onClick: addCustom,
              },
              '添加',
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
        React.createElement('div', { className: 'eg-section-label' }, '数据管理'),
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
            '按时间清理历史学习记录与文章缓存；不会删除你的偏好设置和自定义词库。',
          ),
          React.createElement(
            'div',
            { className: 'eg-clean-ranges' },
            CLEANUP_RANGES.map((item) =>
              React.createElement(
                'button',
                {
                  type: 'button',
                  key: item.id,
                  className:
                    'eg-clean-range' +
                    (item.id === cleanRange ? ' active' : '') +
                    (item.id === 'all' ? ' is-danger' : ''),
                  'aria-pressed': item.id === cleanRange ? 'true' : 'false',
                  disabled: cleanBusy,
                  onClick: () => {
                    setCleanRange(item.id)
                    setCleanPreview(null)
                    setCleanNotice('')
                  },
                },
                item.label,
              ),
            ),
          ),
          React.createElement(
            'div',
            { className: 'eg-clean-foot' },
            React.createElement(
              'label',
              { className: 'eg-clean-check' },
              React.createElement('input', {
                type: 'checkbox',
                checked: clearMemory,
                disabled: cleanBusy,
                onChange: (e) => {
                  setClearMemory(e.target.checked)
                  setCleanPreview(null)
                  setCleanNotice('')
                },
              }),
              React.createElement('span', null, '同时清除对应时间段的艾宾浩斯记忆进度（默认保留）'),
            ),
            !cleanPreview
              ? React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'eg-btn danger',
                    disabled: cleanBusy,
                    onClick: startCleanupPreview,
                  },
                  cleanBusy ? '统计中…' : '清理数据',
                )
              : null,
          ),
          cleanPreview
            ? (() => {
                const totalItems =
                  (cleanPreview.recordDays || 0) +
                  (cleanPreview.reports || 0) +
                  (cleanPreview.memoryWords || 0)
                const rangeObj = CLEANUP_RANGES.find((r) => r.id === cleanPreview.range)
                const summaryParts = []
                if (cleanPreview.recordDays) summaryParts.push(cleanPreview.recordDays + ' 天学习记录')
                if (cleanPreview.reports) summaryParts.push(cleanPreview.reports + ' 篇缓存文章')
                if (cleanPreview.memoryWords) summaryParts.push(cleanPreview.memoryWords + ' 个单词记忆进度')
                return React.createElement(
                  'div',
                  { className: 'eg-clean-confirm' },
                  React.createElement(
                    'div',
                    { className: 'eg-clean-confirm-text' },
                    totalItems > 0
                      ? '将清除「' +
                          (rangeObj ? rangeObj.label : cleanPreview.range) +
                          '」范围内：' +
                          summaryParts.join('、') +
                          '，操作不可恢复。'
                      : '所选范围内暂无可清理的学习记录或缓存文章。',
                  ),
                  React.createElement(
                    'div',
                    { className: 'eg-clean-confirm-actions' },
                    React.createElement(
                      'button',
                      {
                        type: 'button',
                        className: 'eg-btn',
                        disabled: cleanBusy,
                        onClick: () => setCleanPreview(null),
                      },
                      '取消',
                    ),
                    totalItems > 0
                      ? React.createElement(
                          'button',
                          {
                            type: 'button',
                            className: 'eg-btn danger',
                            disabled: cleanBusy,
                            onClick: confirmCleanup,
                          },
                          cleanBusy ? '清理中…' : '确认清理',
                        )
                      : null,
                  ),
                )
              })()
            : null,
          cleanNotice ? React.createElement('div', { className: 'eg-notice eg-clean-notice' }, cleanNotice) : null,
        ),
      ),
    ),
    error ? React.createElement('div', { className: 'eg-settings-error' }, error) : null,
  )
}
