import React, { useState } from 'react'
import { api } from '../../core/api.js'
import { store } from '../../core/store.js'

const CLEANUP_RANGES = [
  { id: '7d', label: '7 天前' },
  { id: '30d', label: '30 天前' },
  { id: '90d', label: '90 天前' },
  { id: '365d', label: '一年前' },
  { id: 'all', label: '全部记录' },
]

export function DataCleanupSection({ onDataCleared, onError }) {
  const [cleanRange, setCleanRange] = useState('30d')
  const [clearMemory, setClearMemory] = useState(false)
  const [cleanPreview, setCleanPreview] = useState(null)
  const [cleanBusy, setCleanBusy] = useState(false)
  const [cleanNotice, setCleanNotice] = useState('')

  const startCleanupPreview = async () => {
    if (cleanBusy) return
    setCleanBusy(true)
    onError('')
    setCleanNotice('')
    try {
      const preview = await api('/data/preview', {
        method: 'POST',
        body: JSON.stringify({ range: cleanRange, clearMemory }),
      })
      setCleanPreview(preview)
    } catch (e) {
      onError(e.message || '统计可清理数据失败')
    } finally {
      setCleanBusy(false)
    }
  }

  const confirmCleanup = async () => {
    if (cleanBusy) return
    setCleanBusy(true)
    onError('')
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
      onError(e.message || '清理数据失败')
    } finally {
      setCleanBusy(false)
    }
  }

  const totalItems = cleanPreview
    ? (cleanPreview.recordDays || 0) + (cleanPreview.reports || 0) + (cleanPreview.memoryWords || 0)
    : 0
  const rangeObj = cleanPreview ? CLEANUP_RANGES.find((r) => r.id === cleanPreview.range) : null
  const summaryParts = []
  if (cleanPreview) {
    if (cleanPreview.recordDays) summaryParts.push(cleanPreview.recordDays + ' 天学习记录')
    if (cleanPreview.reports) summaryParts.push(cleanPreview.reports + ' 篇缓存文章')
    if (cleanPreview.memoryWords) summaryParts.push(cleanPreview.memoryWords + ' 个单词记忆进度')
  }

  return (
    <div className="eg-setting-section">
      <div className="eg-section-head">
        <div className="eg-section-label">数据管理</div>
      </div>
      <div className="eg-setting-card">
        <div className="eg-setting-row">
          <div className="eg-setting-desc eg-lead">
            按时间清理历史学习记录与文章缓存；不会删除你的偏好设置和自定义词库。
          </div>
          <div className="eg-clean-ranges">
            {CLEANUP_RANGES.map((item) => (
              <button
                type="button"
                key={item.id}
                className={
                  'eg-clean-range' + (item.id === cleanRange ? ' active' : '') + (item.id === 'all' ? ' is-danger' : '')
                }
                aria-pressed={item.id === cleanRange ? 'true' : 'false'}
                disabled={cleanBusy}
                onClick={() => {
                  setCleanRange(item.id)
                  setCleanPreview(null)
                  setCleanNotice('')
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="eg-clean-foot">
            <label className="eg-clean-check">
              <input
                type="checkbox"
                checked={clearMemory}
                disabled={cleanBusy}
                onChange={(e) => {
                  setClearMemory(e.target.checked)
                  setCleanPreview(null)
                  setCleanNotice('')
                }}
              />
              <span>同时清除对应时间段内学习中的记忆进度（已掌握单词仅在「全部记录」时清除）</span>
            </label>
            {!cleanPreview ? (
              <button type="button" className="eg-btn danger" disabled={cleanBusy} onClick={startCleanupPreview}>
                {cleanBusy ? '统计中…' : '清理数据'}
              </button>
            ) : null}
          </div>
          {cleanPreview ? (
            <div className="eg-clean-confirm">
              <div className="eg-clean-confirm-text">
                {totalItems > 0
                  ? '将清除「' +
                    (rangeObj ? rangeObj.label : cleanPreview.range) +
                    '」范围内：' +
                    summaryParts.join('、') +
                    '，操作不可恢复。'
                  : '所选范围内暂无可清理的学习记录或缓存文章。'}
              </div>
              <div className="eg-clean-confirm-actions">
                <button type="button" className="eg-btn" disabled={cleanBusy} onClick={() => setCleanPreview(null)}>
                  取消
                </button>
                {totalItems > 0 ? (
                  <button type="button" className="eg-btn danger" disabled={cleanBusy} onClick={confirmCleanup}>
                    {cleanBusy ? '清理中…' : '确认清理'}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
          {cleanNotice ? <div className="eg-notice eg-clean-notice">{cleanNotice}</div> : null}
        </div>
      </div>
    </div>
  )
}
