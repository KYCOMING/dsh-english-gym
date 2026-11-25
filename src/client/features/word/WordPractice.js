import React, { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../core/api.js'
import { store, useShared } from '../../core/store.js'
import { formatMeaning, formatPos } from '../../core/text.js'
import { bounceButton, popElement } from '../../components/motion.js'
import { ExampleBlock } from './ExampleBlock.js'

const cachedWord = {
  item: null,
  cells: [],
  res: null,
  revealed: false,
  revealedEver: false,
  mode: 'smart',
  srsStats: null,
  bankRev: 0,
}

let lastConsumedWordReqTick = 0

const MODES = [
  { id: 'smart', label: '智能', title: '按艾宾浩斯曲线优先复习到期词，每复习 3 个穿插 1 个新词' },
  { id: 'review', label: '待复习', title: '专注清理当前词库已到复习时间的单词' },
  { id: 'new', label: '新词', title: '跳过到期复习，优先抽取尚未背过的新词' },
]

function stageLabel(srs) {
  if (!srs) return '新词'
  if (srs.kind === 'new') return '新词'
  if (srs.kind === 'mastered' || srs.mastered) return '已掌握回顾'
  if (srs.kind === 'upcoming') return '提前巩固 · 第 ' + ((srs.stage || 0) + 1) + ' 阶'
  return '复习 · 第 ' + ((srs.stage || 0) + 1) + ' 阶'
}

function shortBankName(name) {
  return String(name || '').replace(/^内置\s*·\s*/, '')
}

// Static word bank drill: Ebbinghaus SRS + Chinese gloss + one underline per letter.
export function WordPractice({ bankRev = 0 } = {}) {
  const shared = useShared()
  const [item, setItem] = useState(() => cachedWord.item)
  const [cells, setCells] = useState(() => cachedWord.cells)
  const [res, setRes] = useState(() => cachedWord.res)
  const [revealed, setRevealed] = useState(() => cachedWord.revealed)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState(() => cachedWord.mode)
  const [hoverMode, setHoverMode] = useState('')
  const [srsStats, setSrsStats] = useState(() => cachedWord.srsStats)
  const refs = useRef([])
  const inFlight = useRef(false)
  const revealedEverRef = useRef(cachedWord.revealedEver)
  const modeRef = useRef(mode)
  modeRef.current = mode

  useEffect(() => {
    cachedWord.item = item
    cachedWord.cells = cells
    cachedWord.res = res
    cachedWord.revealed = revealed
    cachedWord.revealedEver = revealedEverRef.current
    cachedWord.mode = mode
    cachedWord.srsStats = srsStats
  }, [item, cells, res, revealed, mode, srsStats])

  const load = useCallback(async (requestedMode) => {
    if (inFlight.current) return
    const targetMode =
      requestedMode === 'review' || requestedMode === 'new' || requestedMode === 'smart'
        ? requestedMode
        : modeRef.current
    inFlight.current = true
    setBusy(true)
    setError('')
    setRes(null)
    setRevealed(false)
    revealedEverRef.current = false
    try {
      const data = await api('/word/next', {
        method: 'POST',
        body: JSON.stringify({ mode: targetMode }),
      })
      if (data.srsStats) setSrsStats(data.srsStats)
      setItem(data)
      if (data.done) {
        setCells([])
      } else {
        setCells(new Array(Math.max(0, data.letters || 0)).fill(''))
        setTimeout(() => {
          try {
            if (refs.current[0]) refs.current[0].focus()
          } catch {
            /* ignore */
          }
        }, 0)
      }
    } catch (e) {
      setError(e.message || '出题失败')
    } finally {
      inFlight.current = false
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    const req = shared.wordModeRequest
    if (req && req.tick && req.tick !== lastConsumedWordReqTick) {
      lastConsumedWordReqTick = req.tick
      cachedWord.bankRev = bankRev
      const nextMode = req.mode || 'review'
      setMode(nextMode)
      modeRef.current = nextMode
      load(nextMode)
      return
    }
    if (bankRev !== cachedWord.bankRev) {
      cachedWord.bankRev = bankRev
      setItem(null)
      setRes(null)
      load(modeRef.current)
      return
    }
    if (!cachedWord.item) load(modeRef.current)
  }, [shared.wordModeRequest, bankRev, load])

  // After a correct spelling, Enter acts as “next word” — the primary action is
  // always one keystroke away, even when the letter inputs are disabled.
  useEffect(() => {
    if (!res || !res.correct) return undefined
    const onKeyDown = (e) => {
      if (e.key !== 'Enter' || e.isComposing) return
      const el = e.target
      if (el && el.closest && el.closest('textarea, input:not([disabled]), select, button')) return
      e.preventDefault()
      load()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [res, load])

  const switchMode = useCallback(
    (nextMode) => {
      if (busy || nextMode === modeRef.current) return
      setMode(nextMode)
      modeRef.current = nextMode
      load(nextMode)
    },
    [busy, load],
  )

  const submit = useCallback(async () => {
    if (!item || item.done || busy || res) return
    if (cells.some((c) => !c)) return
    setBusy(true)
    setError('')
    setRevealed(false)
    try {
      const r = await api('/word/check', {
        method: 'POST',
        body: JSON.stringify({
          id: item.id,
          answer: cells.join(''),
          revealed: revealedEverRef.current,
        }),
      })
      setRes(r)
      if (r.correct) store.celebrate()
      if (r.srsStats) setSrsStats(r.srsStats)
      if (r.summary) store.setStats(r.summary)
    } catch (e) {
      setError(e.message || '判分失败')
    } finally {
      setBusy(false)
    }
  }, [item, cells, busy, res])

  const markMastered = useCallback(async () => {
    if (!item || item.done || busy) return
    setBusy(true)
    setError('')
    try {
      const r = await api('/word/master', {
        method: 'POST',
        body: JSON.stringify({ id: item.id, word: (res && res.reference) || '' }),
      })
      if (r.srsStats) setSrsStats(r.srsStats)
      if (r.summary) store.setStats(r.summary)
      inFlight.current = false
      setBusy(false)
      load(modeRef.current)
    } catch (e) {
      setError(e.message || '操作失败')
      setBusy(false)
    }
  }, [item, res, busy, load])

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

  const toggleReveal = useCallback(() => {
    setRevealed((v) => {
      if (!v) revealedEverRef.current = true
      return !v
    })
  }, [])

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

  const liveStats = srsStats || (shared.stats && shared.stats.wordSrs) || null
  const dueCount = liveStats ? Number(liveStats.due) || 0 : 0
  const learningCount = liveStats ? Number(liveStats.learning) || 0 : 0
  const masteredCount = liveStats ? Number(liveStats.mastered) || 0 : 0
  const bankLabel = shortBankName((item && item.bankName) || (shared.stats && shared.stats.wordBank && shared.stats.wordBank.name) || '')
  const shownMode = MODES.find((m) => m.id === (hoverMode || mode)) || MODES[0]

  const topBar = React.createElement(
    'div',
    { className: 'eg-srs-bar', 'data-nodrag': 'true' },
    React.createElement(
      'div',
      {
        className: 'eg-srs-modes',
        role: 'tablist',
        'aria-label': '出词模式',
        onMouseLeave: () => setHoverMode(''),
      },
      MODES.map((m) =>
        React.createElement(
          'button',
          {
            key: m.id,
            type: 'button',
            role: 'tab',
            'aria-selected': mode === m.id ? 'true' : 'false',
            className: 'eg-srs-mode' + (mode === m.id ? ' active' : ''),
            title: m.title,
            disabled: busy,
            onMouseEnter: () => setHoverMode(m.id),
            onFocus: () => setHoverMode(m.id),
            onBlur: () => setHoverMode((prev) => (prev === m.id ? '' : prev)),
            onClick: () => switchMode(m.id),
          },
          m.label,
          m.id === 'review' && dueCount > 0
            ? React.createElement('span', { className: 'eg-srs-due' }, String(dueCount))
            : null,
        ),
      ),
    ),
    React.createElement('div', { className: 'eg-srs-hint' }, shownMode.title),
    liveStats || bankLabel
      ? React.createElement(
          'div',
          { className: 'eg-srs-meta', title: '词库可在「设置 → 单词词库」切换' },
          [
            bankLabel,
            liveStats ? '学习中 ' + learningCount : '',
            liveStats ? '已掌握 ' + masteredCount : '',
          ]
            .filter(Boolean)
            .join(' · '),
        )
      : null,
  )

  if (!item) {
    return React.createElement(
      'div',
      { className: 'eg-word' },
      topBar,
      React.createElement(
        'div',
        { className: 'eg-word-main' },
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
              React.createElement('button', { className: 'eg-btn primary', onClick: () => load(), disabled: busy }, '重试'),
            )
          : null,
      ),
    )
  }

  if (item.done) {
    return React.createElement(
      'div',
      { className: 'eg-word' },
      topBar,
      React.createElement(
        'div',
        { className: 'eg-word-main' },
        React.createElement(
          'div',
          { className: 'eg-srs-done' },
          React.createElement('div', { className: 'eg-srs-done-title' }, '到期单词已全部复习完成'),
          React.createElement(
            'div',
            { className: 'eg-srs-done-sub' },
            (bankLabel ? bankLabel + '：' : '当前词库：') + '学习中 ' + learningCount + ' 词 · 已掌握 ' + masteredCount + ' 词',
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'eg-btn primary',
              disabled: busy,
              onClick: () => switchMode('smart'),
            },
            '切回智能模式继续学习',
          ),
        ),
      ),
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

  const srsInfo = item.srs || null
  const srsStage = srsInfo ? Number(srsInfo.stage) || 0 : 0
  const srsMax = (srsInfo && Number(srsInfo.maxStage)) || 9
  const showDots = srsInfo && srsInfo.kind !== 'new' && srsStage > 0
  const cleanMeaning = formatMeaning(item.zh)
  const meaningClass = 'eg-zh' + (cleanMeaning.length > 28 ? ' is-xlong' : cleanMeaning.length > 16 ? ' is-long' : '')

  const footerActions = answered
    ? React.createElement(
        'div',
        { className: 'eg-word-foot' },
        ok
          ? [
              React.createElement(
                'button',
                { key: 'next', className: 'eg-btn primary', onClick: () => load(), disabled: busy, title: '回车继续', 'aria-keyshortcuts': 'Enter' },
                '下一个',
              ),
              !(res.srs && res.srs.mastered)
                ? React.createElement(
                    'button',
                    { key: 'master', className: 'eg-btn', onClick: markMastered, disabled: busy, title: '太简单，直接标为已掌握' },
                    '已掌握',
                  )
                : null,
            ]
          : [
              React.createElement('button', { key: 'retry', className: 'eg-btn primary', onClick: retry, disabled: busy }, '再试一次'),
              React.createElement(
                'button',
                {
                  key: 'reveal',
                  className: 'eg-btn',
                  onClick: toggleReveal,
                  disabled: busy,
                  'aria-expanded': revealed ? 'true' : 'false',
                },
                revealed ? '收起答案' : '显示答案',
              ),
              React.createElement('button', { key: 'next', className: 'eg-btn', onClick: () => load(), disabled: busy }, '下一个'),
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
          React.createElement('button', { className: 'eg-btn', onClick: () => load(), disabled: busy }, '换一个'),
          React.createElement(
            'button',
            { className: 'eg-btn', onClick: markMastered, disabled: busy, title: '太简单，直接标为已掌握' },
            '已掌握',
          ),
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
    topBar,
    React.createElement(
      'div',
      { className: 'eg-word-main' },
      React.createElement(
        'div',
        { className: 'eg-word-stage', key: item.id },
        React.createElement(
          'div',
          { className: 'eg-word-meta' },
          item.pos ? React.createElement('span', { className: 'eg-pos-text', title: '词性提示' }, formatPos(item.pos)) : null,
          item.pos ? React.createElement('span', { className: 'eg-meta-sep', 'aria-hidden': 'true' }, '·') : null,
          React.createElement(
            'span',
            { className: 'eg-srs-tag' + (srsInfo && srsInfo.kind === 'review' ? ' is-review' : '') },
            stageLabel(srsInfo),
            showDots
              ? React.createElement(
                  'span',
                  { className: 'eg-srs-dots', 'aria-hidden': 'true' },
                  Array.from({ length: srsMax }, (_, idx) =>
                    React.createElement('i', { key: idx, className: 'eg-srs-dot' + (idx < srsStage ? ' on' : '') }),
                  ),
                )
              : null,
          ),
        ),
        React.createElement('div', { className: meaningClass }, cleanMeaning),
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
                  res.srs && res.srs.nextReviewText
                    ? React.createElement('span', { className: 'eg-srs-next' }, res.srs.nextReviewText)
                    : null,
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
                  ? React.createElement('div', { className: 'eg-word-miss' }, '拼写有误，可再试一次或查看答案 · 5 分钟后再次巩固')
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
