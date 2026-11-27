import React from 'react'
import { splitByWord } from '../../core/text.js'

// Blanked before answering; full sentence with the target highlighted after.
export function ExampleBlock({ example, exampleZh, word, highlight }) {
  const en = String(example || '')
  const zh = String(exampleZh || '')
  if (!en && !zh) return null
  const parts = en && highlight && word ? splitByWord(en, word) : [en]

  return (
    <div className={'eg-eg' + (highlight ? ' done' : '')}>
      {en ? (
        <div className="eg-eg-en">
          {parts.map((part, i) =>
            i % 2 ? (
              <mark className="eg-eg-hit" key={i}>
                {part}
              </mark>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </div>
      ) : null}
      {zh ? <div className="eg-eg-zh">{zh}</div> : null}
    </div>
  )
}
