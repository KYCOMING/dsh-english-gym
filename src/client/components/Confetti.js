import React, { useState } from 'react'

export function makeConfettiPieces() {
  const colors = [
    'var(--eg-confetti-1)',
    'var(--eg-confetti-2)',
    'var(--eg-confetti-3)',
    'var(--eg-confetti-4)',
    'var(--eg-confetti-5)',
    'var(--eg-confetti-6)',
  ]
  const pieces = []
  for (let i = 0; i < 64; i += 1) {
    const side = i % 4
    let x = 0
    let y = 0
    let dx = 0
    let dy = 0
    if (side === 0) {
      x = 0
      y = 6 + Math.random() * 88
      dx = 70 + Math.random() * 110
      dy = (Math.random() - 0.5) * 90
    } else if (side === 1) {
      x = 100
      y = 6 + Math.random() * 88
      dx = -(70 + Math.random() * 110)
      dy = (Math.random() - 0.5) * 90
    } else if (side === 2) {
      x = 6 + Math.random() * 88
      y = 0
      dx = (Math.random() - 0.5) * 90
      dy = 70 + Math.random() * 110
    } else {
      x = 6 + Math.random() * 88
      y = 100
      dx = (Math.random() - 0.5) * 90
      dy = -(70 + Math.random() * 110)
    }
    pieces.push({
      key: i,
      style: {
        left: x + '%',
        top: y + '%',
        width: 4 + Math.random() * 4 + 'px',
        height: 8 + Math.random() * 10 + 'px',
        backgroundColor: colors[i % colors.length],
        '--dx': dx.toFixed(1) + 'px',
        '--dy': dy.toFixed(1) + 'px',
        '--r0': Math.round(Math.random() * 360) + 'deg',
        '--rot': Math.round((Math.random() - 0.5) * 720) + 'deg',
        '--delay': Math.round(Math.random() * 110) + 'ms',
        '--dur': Math.round(720 + Math.random() * 420) + 'ms',
      },
    })
  }
  return pieces
}

export function Confetti() {
  const [pieces] = useState(makeConfettiPieces)
  return React.createElement(
    'div',
    { className: 'eg-confetti', 'aria-hidden': 'true' },
    pieces.map((piece) => React.createElement('span', { key: piece.key, className: 'eg-confetti-piece', style: piece.style })),
  )
}
