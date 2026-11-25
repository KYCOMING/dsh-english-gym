import React, { useEffect, useState } from 'react'
import { clamp, prefersReducedMotion } from './motion.js'

export function ScoreRing({ score, displayScore }) {
  const clamped = clamp(Number(score) || 0, 0, 100)
  const [drawn, setDrawn] = useState(() => prefersReducedMotion())
  useEffect(() => {
    if (prefersReducedMotion()) {
      setDrawn(true)
      return undefined
    }
    setDrawn(false)
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setDrawn(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [clamped])
  const r = 20
  const c = 2 * Math.PI * r
  const offset = drawn ? c * (1 - clamped / 100) : c
  return React.createElement(
    'div',
    { className: 'eg-ring', 'aria-label': '得分 ' + clamped + ' 分' },
    React.createElement(
      'svg',
      { viewBox: '0 0 50 50', 'aria-hidden': 'true' },
      React.createElement('circle', { className: 'eg-ring-track', cx: 25, cy: 25, r }),
      clamped > 0
        ? React.createElement('circle', {
            className: 'eg-ring-arc',
            cx: 25,
            cy: 25,
            r,
            strokeDasharray: c.toFixed(2),
            strokeDashoffset: offset.toFixed(2),
          })
        : null,
    ),
    React.createElement(
      'span',
      { className: 'eg-ring-val' },
      React.createElement('strong', null, displayScore),
      React.createElement('small', null, '分'),
    ),
  )
}
