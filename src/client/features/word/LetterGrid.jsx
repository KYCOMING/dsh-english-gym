import React from 'react'

export function LetterGrid({ cells, answered, ok, reference, busy, inputRefs, onSetCell, onKey }) {
  const target = String(reference || '').toLowerCase().replace(/[^a-z]/g, '')
  const letterGap = cells.length > 7 ? 8 : 10
  const letterFont = cells.length > 12 ? 15 : cells.length > 9 ? 17 : 22

  return (
    <div
      className={'eg-letters' + (answered ? ' answered' + (ok ? ' is-ok' : ' is-bad') : '')}
      style={{ gap: letterGap }}
    >
      {cells.map((ch, i) => {
        let cls = 'eg-letter'
        if (answered) cls += ok ? ' ok' : ' bad'
        return (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el
            }}
            className={cls}
            value={answered ? ch || target[i] || '' : ch}
            style={{ fontSize: letterFont, '--i': i }}
            maxLength={1}
            inputMode="text"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={answered || busy}
            aria-label={'第 ' + (i + 1) + ' 个字母'}
            onChange={(e) => onSetCell(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
          />
        )
      })}
    </div>
  )
}
