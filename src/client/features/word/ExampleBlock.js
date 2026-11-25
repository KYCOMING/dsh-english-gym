import React from 'react'
import { splitByWord } from '../../core/text.js'

const h = React.createElement

// Blanked before answering; full sentence with the target highlighted after.
export function ExampleBlock({ example, exampleZh, word, highlight }) {
  const en = String(example || '')
  const zh = String(exampleZh || '')
  if (!en && !zh) return null
  const parts = en && highlight && word ? splitByWord(en, word) : [en]
  return h(
    'div',
    { className: 'eg-eg' + (highlight ? ' done' : '') },
    en
      ? h(
          'div',
          { className: 'eg-eg-en' },
          parts.map((part, i) =>
            i % 2 ? h('mark', { className: 'eg-eg-hit', key: i }, part) : h('span', { key: i }, part),
          ),
        )
      : null,
    zh ? h('div', { className: 'eg-eg-zh' }, zh) : null,
  )
}
