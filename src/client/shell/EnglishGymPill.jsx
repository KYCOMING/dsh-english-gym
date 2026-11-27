import React, { useEffect } from 'react'
import { useStyle } from '../core/style.js'
import { refreshStats, store, useShared } from '../core/store.js'

// Inline trigger under the composer (compact).
export function EnglishGymPill(props) {
  useStyle()
  const shared = useShared()
  const sessionId = props && typeof props.sessionId === 'string' ? props.sessionId : ''
  useEffect(() => {
    store.setSessionId(sessionId)
    return () => {
      if (sessionId && store.sessionId === sessionId) store.setSessionId('')
    }
  }, [sessionId])
  useEffect(() => {
    if (!store.stats) refreshStats()
    const refreshIfVisible = () => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        refreshStats()
      }
    }
    const interval = setInterval(refreshIfVisible, 60 * 1000)
    const onFocus = () => refreshStats()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refreshStats()
    }
    if (typeof window !== 'undefined') window.addEventListener('focus', onFocus)
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearInterval(interval)
      if (typeof window !== 'undefined') window.removeEventListener('focus', onFocus)
      if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])
  const stats = shared.stats

  return (
    <div className="eg-root eg-entry">
      <button
        className="eg-pill"
        onClick={() => store.toggle()}
        title="English Gym — 短语造句 + 单词拼写"
        aria-expanded={shared.open ? 'true' : 'false'}
      >
        <span className="eg-mono">EG</span>
        <span className="eg-wordmark">English Gym</span>
        {stats && stats.streakDays > 0 ? (
          <span className="eg-streak">{'连续 ' + stats.streakDays + ' 天'}</span>
        ) : null}
        {stats && stats.reviewCount > 0 ? (
          <span
            className="eg-chip warn"
            title={'有 ' + stats.reviewCount + ' 个单词到期复习，点击直接开始'}
            onClick={(e) => {
              e.stopPropagation()
              store.openWordReview()
            }}
          >
            {'待复习 ' + stats.reviewCount}
          </span>
        ) : null}
        <span className="eg-chev" aria-hidden="true">
          ▸
        </span>
      </button>
    </div>
  )
}
