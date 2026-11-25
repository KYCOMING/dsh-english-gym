import React, { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../core/api.js'
import { store } from '../../core/store.js'
import { formatPos } from '../../core/text.js'
import { bounceButton, popElement } from '../../components/motion.js'
import { ExampleBlock } from './ExampleBlock.js'
import { WordBankImport } from './WordBankImport.js'

const h = React.createElement

const cachedWord = { item: null, cells: [], res: null, revealed: false, banks: null, bankId: '' }

// Static word bank drill: Chinese gloss + one underline per letter.
export function WordPractice() {
  const [item, setItem] = useState(() => cachedWord.item)
  const [cells, setCells] = useState(() => cachedWord.cells)
  const [res, setRes] = useState(() => cachedWord.res)
  const [revealed, setRevealed] = useState(() => cachedWord.revealed)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [banks, setBanks] = useState(() => cachedWord.banks)
  const [bankId, setBankId] = useState(() => cachedWord.bankId)
  const [view, setView] = useState('practice')
  const [notice, setNotice] = useState('')
  const [switching, setSwitching] = useState(false)
  const refs = useRef([])
  const inFlight = useRef(false)

  useEffect(() => {
    cachedWord.item = item
    cachedWord.cells = cells
    cachedWord.res = res
    cachedWord.revealed = revealed
    cachedWord.banks = banks
    cachedWord.bankId = bankId
  }, [item, cells, res, revealed, banks, bankId])

  const load = useCallback(async () => {
    if (inFlight.current) return
    inFlight.current = true
    setBusy(true)
    setError('')
    setRes(null)
    setRevealed(false)
    try {
      const data = await api('/word/next', { method: 'POST', body: '{}' })
      setItem(data)
      setCells(new Array(Math.max(0, data.letters || 0)).fill(''))
      setTimeout(() => {
        try {
          if (refs.current[0]) refs.current[0].focus()
        } catch {
          /* ignore */
        }
      }, 0)
    } catch (e) {
      setError(e.message || '出题失败')
    } finally {
      inFlight.current = false
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    if (!cachedWord.item) load()
  }, [load])

  // After a correct spelling, Enter acts as “next word” — the primary action is
  // always one keystroke away, even when the letter inputs are disabled.
  useEffect(() => {
    if (!res || !res.correct || view !== 'practice') return undefined
    const onKeyDown = (e) => {
      if (e.key !== 'Enter' || e.isComposing) return
      const el = e.target
      if (el && el.closest && el.closest('textarea, input:not([disabled]), select, button')) return
      e.preventDefault()
      load()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [res, view, load])

  const loadBanks = useCallback(async () => {
    try {
      const data = await api('/wordbanks')
      setBanks(Array.isArray(data.banks) ? data.banks : [])
      setBankId(data.active || 'builtin')
    } catch {
      /* ignore: practice still works with the built-in bank */
    }
  }, [])

  useEffect(() => {
    if (!cachedWord.banks) loadBanks()
  }, [loadBanks])

  const switchBank = useCallback(
    async (e) => {
      const id = e.target.value
      if (!id || id === bankId) return
      setSwitching(true)
      setError('')
      setNotice('')
      try {
        const data = await api('/wordbanks/active', { method: 'POST', body: JSON.stringify({ id }) })
        setBankId(data.active)
        if (data.summary) store.setStats(data.summary)
        await load()
      } catch (err) {
        setError(err.message || '切换词库失败')
      } finally {
        setSwitching(false)
      }
    },
    [bankId, load],
  )

  const onImported = useCallback(
    (result) => {
      setNotice('已导入「' + result.bank.name + '」' + result.bank.count + ' 条')
      setView('practice')
      loadBanks()
      load()
    },
    [loadBanks, load],
  )

  const submit = useCallback(async () => {
    if (!item || busy || res) return
    if (cells.some((c) => !c)) return
    setBusy(true)
    setError('')
    setRevealed(false)
    try {
      const r = await api('/word/check', {
        method: 'POST',
        body: JSON.stringify({ id: item.id, answer: cells.join('') }),
      })
      setRes(r)
      if (r.correct) store.celebrate()
      if (r.summary) store.setStats(r.summary)
    } catch (e) {
      setError(e.message || '判分失败')
    } finally {
      setBusy(false)
    }
  }, [item, cells, busy, res])

  const retry = useCallback(() => {
    if (!item || busy) return
    setRes(null)
    setError('')
    setRevealed(false)
    setCells(new Array(Math.max(0, item.letters || 0)).fill(''))
    setTimeout(() => {
      try {
        if (refs.current[0]) refs.current[0].focus()
      } catch {
        /* ignore */
      }
    }, 0)
  }, [item, busy])

  const setCell = (i, v) => {
    const ch = String(v || '').replace(/[^a-zA-Z]/g, '').slice(-1)
    setCells((prev) => {
      const next = prev.slice()
      next[i] = ch
      return next
    })
    if (ch) popElement(refs.current[i], 'is-pop', 180)
    if (ch && i < cells.length - 1) {
      setTimeout(() => {
        try {
          if (refs.current[i + 1]) refs.current[i + 1].focus()
        } catch {
          /* ignore */
        }
      }, 0)
    }
  }

  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !cells[i] && i > 0) {
      e.preventDefault()
      setCells((prev) => {
        const next = prev.slice()
        next[i - 1] = ''
        return next
      })
      try {
        if (refs.current[i - 1]) refs.current[i - 1].focus()
      } catch {
        /* ignore */
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      try {
        if (refs.current[i - 1]) refs.current[i - 1].focus()
      } catch {
        /* ignore */
      }
    } else if (e.key === 'ArrowRight' && i < cells.length - 1) {
      try {
        if (refs.current[i + 1]) refs.current[i + 1].focus()
      } catch {
        /* ignore */
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  if (view === 'import') {
    return h(WordBankImport, { onClose: () => setView('practice'), onImported })
  }

  if (!item) {
    return React.createElement(
      'div',
      null,
      error
        ? React.createElement('div', { className: 'eg-err' }, error)
        : React.createElement(
            'div',
            { className: 'eg-loading' },
            React.createElement('span', { className: 'eg-spin' }),
            '正在取词…',
          ),
      error
        ? React.createElement(
            'div',
            { className: 'eg-foot' },
            React.createElement('button', { className: 'eg-btn primary', onClick: load, disabled: busy }, '重试'),
          )
        : null,
    )
  }

  const answered = !!res
  const ok = answered && !!res.correct
  const target = String((res && res.reference) || '').toLowerCase()
  const letterGap = cells.length > 7 ? 8 : 10
  const letterFont = cells.length > 12 ? 15 : cells.length > 9 ? 17 : 22
  const cellsNodes = cells.map((ch, i) => {
    let cls = 'eg-letter'
    if (answered) cls += ok ? ' ok' : ' bad'
    return React.createElement('input', {
      key: i,
      ref: (el) => {
        refs.current[i] = el
      },
      className: cls,
      value: answered ? ch || target[i] || '' : ch,
      style: { fontSize: letterFont, '--i': i },
      maxLength: 1,
      inputMode: 'text',
      autoCapitalize: 'off',
      autoComplete: 'off',
      autoCorrect: 'off',
      spellCheck: false,
      disabled: answered || busy,
      'aria-label': '第 ' + (i + 1) + ' 个字母',
      onChange: (e) => setCell(i, e.target.value),
      onKeyDown: (e) => onKey(i, e),
    })
  })

  const footerActions = answered
    ? React.createElement(
        'div',
        { className: 'eg-word-foot' },
        ok
          ? React.createElement('button', { className: 'eg-btn primary', onClick: load, disabled: busy, title: '回车继续', 'aria-keyshortcuts': 'Enter' }, '下一个')
          : [
              React.createElement('button', { key: 'retry', className: 'eg-btn primary', onClick: retry, disabled: busy }, '再试一次'),
              React.createElement(
                'button',
                {
                  key: 'reveal',
                  className: 'eg-btn',
                  onClick: () => setRevealed((v) => !v),
                  disabled: busy,
                  'aria-expanded': revealed ? 'true' : 'false',
                },
                revealed ? '收起答案' : '显示答案',
              ),
              React.createElement('button', { key: 'next', className: 'eg-btn', onClick: load, disabled: busy }, '下一个'),
            ],
      )
    : item
      ? React.createElement(
          'div',
          { className: 'eg-word-foot' },
          React.createElement(
            'button',
            {
              className: 'eg-btn primary' + (busy ? ' is-loading' : ''),
              onClick: submit,
              onPointerDown: bounceButton,
              disabled: busy || cells.some((c) => !c),
            },
            '提交',
          ),
          React.createElement('button', { className: 'eg-btn ghost', onClick: load, disabled: busy }, '换一个'),
          React.createElement(
            'span',
            { className: 'eg-kbd', title: '回车提交' },
            React.createElement('kbd', null, '↵'),
          ),
        )
      : null

  return React.createElement(
    'div',
    { className: 'eg-word' },
    React.createElement(
      'div',
      { className: 'eg-bankbar', 'data-nodrag': 'true' },
      React.createElement('span', { className: 'eg-banklabel' }, '词库'),
      React.createElement(
        'select',
        {
          className: 'eg-select',
          value: bankId || '',
          disabled: switching || !banks,
          onChange: switchBank,
          title: '切换单词词库',
        },
        (banks || []).map((b) =>
          React.createElement('option', { key: b.id, value: b.id }, b.name + '（' + b.count + '）'),
        ),
      ),
      React.createElement(
        'button',
        { className: 'eg-bankbtn', onClick: () => { setNotice(''); setView('import') } },
        React.createElement('span', { className: 'eg-plus', 'aria-hidden': 'true' }, '+'),
        '导入',
      ),
    ),
    notice ? React.createElement('div', { className: 'eg-notice' }, notice) : null,
    React.createElement(
      'div',
      { className: 'eg-word-main' },
      React.createElement(
        'div',
        { className: 'eg-word-stage', key: item.id },
        item.pos ? React.createElement('div', { className: 'eg-pos', title: '词性提示' }, formatPos(item.pos)) : null,
        React.createElement('div', { className: 'eg-zh' }, item.zh),
        !answered ? React.createElement(ExampleBlock, { example: item.example }) : null,
        React.createElement(
          'div',
          {
            className: 'eg-letters' + (answered ? ' answered' + (ok ? ' is-ok' : ' is-bad') : ''),
            style: { gap: letterGap },
          },
          cellsNodes,
        ),
        error ? React.createElement('div', { className: 'eg-err' }, error) : null,
        answered
          ? ok
            ? React.createElement(
                'div',
                { className: 'eg-fb ok' },
                React.createElement(
                  'div',
                  { className: 'eg-fb-top' },
                  React.createElement('span', { className: 'eg-fb-status' }, '拼对了'),
                ),
                React.createElement(
                  'div',
                  { className: 'eg-fb-ref' },
                  React.createElement('span', { className: 'lbl' }, '正确拼写'),
                  res.reference,
                ),
                React.createElement(ExampleBlock, {
                  example: res.example,
                  exampleZh: res.exampleZh,
                  word: res.reference,
                  highlight: true,
                }),
              )
            : React.createElement(
                'div',
                { className: 'eg-fb bad' },
                !revealed
                  ? React.createElement('div', { className: 'eg-word-miss' }, '拼写有误，可再试一次或查看答案')
                  : null,
                React.createElement(
                  'div',
                  {
                    className: 'eg-collapse eg-word-reveal' + (revealed ? ' open' : ''),
                    'aria-hidden': revealed ? 'false' : 'true',
                  },
                  React.createElement(
                    'div',
                    { className: 'eg-collapse-inner' },
                    React.createElement(
                      'div',
                      { className: 'eg-fb-ref' },
                      React.createElement('span', { className: 'lbl' }, '正确拼写'),
                      res.reference,
                    ),
                    React.createElement(ExampleBlock, {
                      example: res.example,
                      exampleZh: res.exampleZh,
                      word: res.reference,
                      highlight: true,
                    }),
                  ),
                ),
              )
          : null,
      ),
    ),
    footerActions,
  )
}
