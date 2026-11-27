import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../core/api.js'
import { store, useShared } from '../../core/store.js'

let cachedSettings = null
let cachedBanks = null

export const FALLBACK_LEVELS = [
  { id: 'A1', label: 'A1', desc: '入门', detail: '约小学至初中水平 · 简短句式与日常基础词汇，适合零基础起步' },
  { id: 'A2', label: 'A2', desc: '基础', detail: '约初中至高中入门 · 常见生活话题与直白表达，轻松建立阅读语感' },
  { id: 'B1', label: 'B1', desc: '进阶', detail: '约高考 / 大学四级（CET-4）· 清晰自然的实用表达，日常与职场阅读主力' },
  { id: 'B2', label: 'B2', desc: '熟练', detail: '约大学六级（CET-6）/ 雅思 6.0–6.5 · 句式更丰富，流畅阅读技术博客与行业资讯' },
  { id: 'C1', label: 'C1', desc: '高级', detail: '约雅思 7.0–7.5 / 托福 95+ · 地道外刊文风，含精准词汇与复杂长难句' },
  { id: 'C2', label: 'C2', desc: '精通', detail: '约雅思 8.0+ / 母语外刊水准 · 细腻修辞、高阶词汇与深度评论风格' },
]

export const FALLBACK_RETENTIONS = [
  { id: 0.85, label: '85%', desc: '轻松', detail: '复习间隔更长、每日复习负担最轻，适合长期泛背积累' },
  { id: 0.9, label: '90%', desc: '均衡', detail: 'FSRS 官方推荐默认值，在记忆牢固度与复习量之间取得最佳平衡' },
  { id: 0.93, label: '93%', desc: '强化', detail: '复习频率适度提高、遗忘率更低，适合四六级 / 雅思 / 托福备考' },
  { id: 0.95, label: '95%', desc: '极致', detail: '高频巩固以维持极高记住率，适合考前冲刺（每日复习量明显增加）' },
]

export function shortBankName(name) {
  return String(name || '').replace(/^内置\s*·\s*/, '')
}

export function useSettings({ onTopicChange, onPhraseConfigChange, onReportConfigChange, onWordBankChange }) {
  const shared = useShared()
  const [data, setData] = useState(() => cachedSettings)
  const [bankData, setBankData] = useState(() => cachedBanks)
  const [bankNotice, setBankNotice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(() => !cachedSettings)
  const queueRef = useRef(Promise.resolve())
  const seqRef = useRef(0)
  const lastConfirmedRef = useRef(cachedSettings)
  const customTopicsRef = useRef(
    (cachedSettings && cachedSettings.settings && cachedSettings.settings.customTopics) || [],
  )
  const bankQueueRef = useRef(Promise.resolve())
  const bankSeqRef = useRef(0)
  const lastConfirmedBanksRef = useRef(cachedBanks)

  const load = useCallback(async () => {
    if (!cachedSettings) setLoading(true)
    try {
      const [settingsRes, banksRes] = await Promise.all([
        api('/settings'),
        api('/wordbanks').catch(() => null),
      ])
      cachedSettings = settingsRes
      lastConfirmedRef.current = settingsRes
      customTopicsRef.current = (settingsRes && settingsRes.settings && settingsRes.settings.customTopics) || []
      setData(settingsRes)
      store.setSettings(settingsRes.settings)
      if (banksRes && Array.isArray(banksRes.banks)) {
        cachedBanks = banksRes
        lastConfirmedBanksRef.current = banksRes
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
    (patchOrBuilder, changeScope, optimisticOverride) => {
      const seq = ++seqRef.current
      setError('')

      const optimisticPatch =
        optimisticOverride !== undefined
          ? optimisticOverride
          : typeof patchOrBuilder === 'function'
            ? null
            : patchOrBuilder

      // Optimistically apply scalar and customTopics removals immediately so controls never flash disabled.
      const scalarPatch = {}
      for (const key of ['confetti', 'sessionLink', 'bankLink', 'bankRetries', 'reportLevel', 'topicId', 'fsrsRetention']) {
        if (optimisticPatch && optimisticPatch[key] !== undefined) scalarPatch[key] = optimisticPatch[key]
      }
      const hasOptimisticTopics = Boolean(optimisticPatch && Array.isArray(optimisticPatch.customTopics))
      if (Object.keys(scalarPatch).length || hasOptimisticTopics) {
        if (Object.keys(scalarPatch).length) store.setSettings(scalarPatch)
        setData((prev) => {
          if (!prev || !prev.settings) return prev
          const nextSettings = { ...prev.settings, ...scalarPatch }
          let nextDirections = prev.directions
          if (hasOptimisticTopics) {
            nextSettings.customTopics = optimisticPatch.customTopics
            const keepIds = new Set(optimisticPatch.customTopics.map((item) => item.id).filter(Boolean))
            if (Array.isArray(prev.directions)) {
              nextDirections = prev.directions.filter((item) => item.builtin !== false || keepIds.has(item.id))
            }
            if (nextDirections && !nextDirections.some((item) => item.id === nextSettings.topicId)) {
              nextSettings.topicId = 'ai'
            }
            store.setSettings({ customTopics: nextSettings.customTopics, topicId: nextSettings.topicId })
          }
          const next = { ...prev, settings: nextSettings, directions: nextDirections }
          cachedSettings = next
          return next
        })
      }

      const task = queueRef.current.then(async () => {
        try {
          const baseSettings = (lastConfirmedRef.current && lastConfirmedRef.current.settings) || null
          const patch = typeof patchOrBuilder === 'function' ? patchOrBuilder(baseSettings) : patchOrBuilder
          const result = await api('/settings', {
            method: 'POST',
            body: JSON.stringify(patch),
          })
          lastConfirmedRef.current = result
          customTopicsRef.current = (result && result.settings && result.settings.customTopics) || []
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
          if (lastConfirmedRef.current && lastConfirmedRef.current.settings) {
            customTopicsRef.current = lastConfirmedRef.current.settings.customTopics || []
          }
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
  const retentions = (data && Array.isArray(data.retentions) && data.retentions.length ? data.retentions : FALLBACK_RETENTIONS).map((item) => {
    const fb = FALLBACK_RETENTIONS.find((f) => f.id === item.id)
    return item.detail || !fb ? item : { ...item, detail: fb.detail }
  })
  const customTopics = settings.customTopics || []
  const activeId = settings.topicId
  const activeLevel = settings.reportLevel || 'B1'
  const activeRetention = Number.isFinite(Number(settings.fsrsRetention)) ? Number(settings.fsrsRetention) : 0.9

  const chooseDirection = (id) => {
    if (id === activeId) return
    save({ topicId: id }, true)
  }

  const chooseReportLevel = (id) => {
    if (id === activeLevel) return
    save({ reportLevel: id }, 'report')
  }

  const chooseRetention = (value) => {
    if (value === activeRetention) return
    save({ fsrsRetention: value }, false)
  }

  const addCustom = (rawLabel) => {
    const label = String(rawLabel || '').trim()
    if (!label) return Promise.resolve(false)
    return save(
      (latest) => {
        const base = latest && Array.isArray(latest.customTopics) ? latest.customTopics : customTopicsRef.current
        return { customTopics: base.concat({ label }) }
      },
      false,
      null,
    )
  }

  const removeCustom = (id) => {
    const nextTopics = customTopicsRef.current.filter((item) => item.id !== id)
    customTopicsRef.current = nextTopics
    save(
      (latest) => {
        const base = latest && Array.isArray(latest.customTopics) ? latest.customTopics : customTopicsRef.current
        return { customTopics: base.filter((item) => item.id !== id) }
      },
      id === activeId,
      { customTopics: nextTopics },
    )
  }

  const setRetries = (value) => {
    const next = Math.max(0, Math.min(5, Number(value) || 0))
    if (next === settings.bankRetries) return
    save({ bankRetries: next }, false)
  }

  const banks = bankData && Array.isArray(bankData.banks) ? bankData.banks : []
  const activeBankId = (bankData && bankData.active) || 'builtin'
  const builtinBanks = banks.filter((b) => b.builtin !== false)
  const customBanks = banks.filter((b) => b.builtin === false)
  const activeBankObj = banks.find((b) => b.id === activeBankId)

  const chooseBank = (id) => {
    if (!id || id === activeBankId) return undefined
    const seq = ++bankSeqRef.current
    setError('')
    setBankNotice('')
    setBankData((cur) => {
      if (!cur) return cur
      const next = { ...cur, active: id }
      cachedBanks = next
      return next
    })
    const task = bankQueueRef.current.then(async () => {
      try {
        const res = await api('/wordbanks/active', { method: 'POST', body: JSON.stringify({ id }) })
        const base = lastConfirmedBanksRef.current || cachedBanks
        if (base) {
          lastConfirmedBanksRef.current = { ...base, active: (res && res.active) || id }
        }
        if (seq === bankSeqRef.current) {
          if (lastConfirmedBanksRef.current) {
            cachedBanks = lastConfirmedBanksRef.current
            setBankData(lastConfirmedBanksRef.current)
          }
          if (res.summary) store.setStats(res.summary)
          if (typeof onWordBankChange === 'function') onWordBankChange()
        }
      } catch (e) {
        if (seq === bankSeqRef.current) {
          const rollback = lastConfirmedBanksRef.current
          if (rollback) {
            cachedBanks = rollback
            setBankData(rollback)
          }
          setError(e.message || '切换词库失败')
        }
      }
    })
    bankQueueRef.current = task.catch(() => {})
    return task
  }

  const removeBank = async (id) => {
    const wasActive = id === activeBankId
    setError('')
    setBankNotice('')
    try {
      const res = await api('/wordbanks/delete', { method: 'POST', body: JSON.stringify({ id }) })
      const next = { active: res.active, banks: Array.isArray(res.banks) ? res.banks : banks.filter((b) => b.id !== id) }
      cachedBanks = next
      lastConfirmedBanksRef.current = next
      setBankData(next)
      if (res.summary) store.setStats(res.summary)
      if (wasActive && typeof onWordBankChange === 'function') onWordBankChange()
    } catch (e) {
      setError(e.message || '删除词库失败')
    }
  }

  const handleBankImported = async (res) => {
    setBankNotice('已导入「' + res.bank.name + '」' + res.bank.count + ' 条')
    try {
      const banksRes = await api('/wordbanks')
      if (banksRes && Array.isArray(banksRes.banks)) {
        cachedBanks = banksRes
        lastConfirmedBanksRef.current = banksRes
        setBankData(banksRes)
      }
    } catch {
      /* ignore */
    }
    if (typeof onWordBankChange === 'function') onWordBankChange()
  }

  return {
    data,
    loading,
    error,
    setError,
    settings,
    directions,
    levels,
    retentions,
    customTopics,
    activeId,
    activeLevel,
    activeRetention,
    banks,
    activeBankId,
    builtinBanks,
    customBanks,
    activeBankObj,
    bankNotice,
    setBankNotice,
    save,
    chooseDirection,
    chooseReportLevel,
    chooseRetention,
    addCustom,
    removeCustom,
    setRetries,
    chooseBank,
    removeBank,
    handleBankImported,
  }
}
