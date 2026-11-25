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
  }, [])
  const stats = shared.stats
  return React.createElement(
    'div',
    { className: 'eg-root eg-entry' },
    React.createElement(
      'button',
      {
        className: 'eg-pill',
        onClick: () => store.toggle(),
        title: 'English Gym — 短语造句 + 单词拼写',
        'aria-expanded': shared.open ? 'true' : 'false',
      },
      React.createElement('span', { className: 'eg-mono' }, 'EG'),
      React.createElement('span', { className: 'eg-wordmark' }, 'English Gym'),
      stats && stats.streakDays > 0
        ? React.createElement('span', { className: 'eg-streak' }, '连续 ' + stats.streakDays + ' 天')
        : null,
      stats && stats.reviewCount > 0
        ? React.createElement('span', { className: 'eg-chip warn' }, '待复习 ' + stats.reviewCount)
        : null,
      React.createElement('span', { className: 'eg-chev', 'aria-hidden': 'true' }, '▸'),
    ),
  )
}
