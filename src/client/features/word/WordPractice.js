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
  { id: 'smart', label: '智能', title: '按 FSRS 算法优先复习最易遗忘的到期词，每复习 3 个穿插 1 个新词' },
  { id: 'review', label: '待复习', title: '专注清理当前词库已到复习时间的单词' },
  { id: 'new', label: '新词', title: '跳过到期复习，优先抽取尚未背过的新词' },
]

const FSRS_RATINGS = [
  { rating: 2, key: 'hard', keyHint: '1', label: '模糊' },
  { rating: 3, key: 'good', keyHint: '2', label: '记得' },
  { rating: 4, key: 'easy', keyHint: '3', label: '很熟' },
]

function formatStabilityShort(days) {
  const n = Number(days)
  if (!Number.isFinite(n) || n <= 0) return ''
  if (n < 1) return Math.max(1, Math.round(n * 24)) + ' 小时'
  return Math.max(1, Math.round(n)) + ' 天'
}

function memoryLabel(srs) {
  if (!srs || srs.kind === 'new') return '新词'
  if (srs.kind === 'mastered' || srs.mastered) return '已掌握回顾'
  if (srs.state === 'learning' || srs.state === 'relearning') return '巩固中'
  if (srs.kind === 'upcoming') {
    const st = formatStabilityShort(srs.stability)
    return st ? '提前巩固 · 稳定 ' + st : '提前巩固'
  }
  if (srs.retrievability != null) return '复习 · 记忆 ' + srs.retrievability + '%'
  const st = formatStabilityShort(srs.stability)
  return st ? '复习 · 稳定 ' + st : '复习'
}

function memoryTooltip(srs) {
  if (!srs || srs.kind === 'new') return '首次学习该词，将按 FSRS 记忆算法安排复习'
  const parts = []
  const st = formatStabilityShort(srs.stability)
  if (st) parts.push('稳定度 ' + st)
  if (srs.difficulty > 0) parts.push('难度 ' + srs.difficulty + '/10')
  if (srs.retrievability != null) parts.push('回忆概率 ' + srs.retrievability + '%')
  parts.push('复习 ' + (srs.reps || 0) + ' 次 / 遗忘 ' + (srs.lapses || 0) + ' 次')
  return parts.join(' · ')
}

function shortBankName(name) {
  return String(name || '').replace(/^内置\s*·\s*/, '')
}

// Static word bank drill: FSRS-6 SRS + Chinese gloss + one underline per letter.
export function WordPractice({ bankRev = 0 } = {}) {
  const shared = useShared()
  const [item, setItem] = useState(() => cachedWord.item)
  const [cells, setCells] = useState(() => cachedWord.cells)
  const [res, setRes] = useState(() => cachedWord.res)
  const [revealed, setRevealed] = useState(() => cachedWord.revealed)
  const [busy, setBusy] = useState(false)
  const [rateBusy, setRateBusy] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState(() => cachedWord.mode)
  const [hoverMode, setHoverMode] = useState('')
  const [srsStats, setSrsStats] = useState(() => cachedWord.srsStats)
  const refs = useRef([])
  const reqGenRef = useRef(0)
  const abortRef = useRef(null)
  const revealedEverRef = useRef(cachedWord.revealedEver)
  const modeRef = useRef(mode)
  modeRef.current = mode

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

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
    const gen = ++reqGenRef.current
    if (abortRef.current) abortRef.current.abort()
    const ac = new AbortController()
    abortRef.current = ac
    const targetMode =
      requestedMode === 'review' || requestedMode === 'new' || requestedMode === 'smart'
        ? requestedMode
        : modeRef.current
    setBusy(true)
    setRateBusy(false)
    setError('')
    setRes(null)
    setRevealed(false)
    revealedEverRef.current = false
    try {
      const data = await api('/word/next', {
        method: 'POST',
        body: JSON.stringify({ mode: targetMode }),
        signal: ac.signal,
      })
      if (gen !== reqGenRef.current || ac.signal.aborted) return
      if (data.srsStats) {
        setSrsStats(data.srsStats)
        store.setWordSrs(data.srsStats)
      }
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
      if (gen !== reqGenRef.current || ac.signal.aborted || (e && e.name === 'AbortError')) return
      setError(e.message || '出题失败')
    } finally {
      if (gen === reqGenRef.current) {
        abortRef.current = null
        setBusy(false)
      }
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

  const rate = useCallback(
    async (rating) => {
      if (!item || item.done || !res || !res.correct || !res.srs || !res.srs.canRate || rateBusy) return
      if (res.srs.rating === rating) return
      setRateBusy(true)
      setError('')
      try {
        const r = await api('/word/rate', {
          method: 'POST',
          body: JSON.stringify({ id: item.id, rating }),
        })
        if (r && r.srs) {
          setRes((prev) => (prev ? { ...prev, srs: r.srs } : prev))
        }
        if (r && r.srsStats) setSrsStats(r.srsStats)
        if (r && r.summary) store.setStats(r.summary)
        else if (r && r.srsStats) store.setWordSrs(r.srsStats)
      } catch (e) {
        setError(e.message || '调整评分失败')
      } finally {
        setRateBusy(false)
      }
    },
    [item, res, rateBusy],
  )

  // After a correct spelling, Enter acts as “next word” and 1/2/3 adjust the FSRS rating.
  useEffect(() => {
    if (!res || !res.correct) return undefined
    const onKeyDown = (e) => {
      if (e.isComposing || e.ctrlKey || e.metaKey || e.altKey) return
      const el = e.target
      if (e.key === 'Enter') {
        if (el && el.closest && el.closest('textarea, input:not([disabled]), select, button')) return
        e.preventDefault()
        load()
        return
      }
      if (res.srs && res.srs.canRate && (e.key === '1' || e.key === '2' || e.key === '3')) {
        if (el && el.closest && el.closest('textarea, input:not([disabled]), select')) return
        e.preventDefault()
        rate(e.key === '1' ? 2 : e.key === '2' ? 3 : 4)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [res, load, rate])

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
    setRateBusy(false)
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
      else if (r.srsStats) store.setWordSrs(r.srsStats)
    } catch (e) {
      setError(e.message || '判分失败')
    } finally {
      setBusy(false)
    }
  }, [item, cells, busy, res])

  const markMastered = useCallback(async () => {
    if (!item || item.done || busy) return
    setBusy(true)
    setRateBusy(false)
    setError('')
    try {
      const r = await api('/word/master', {
        method: 'POST',
        body: JSON.stringify({ id: item.id, word: (res && res.reference) || '' }),
      })
      if (r.srsStats) setSrsStats(r.srsStats)
      if (r.summary) store.setStats(r.summary)
      else if (r.srsStats) store.setWordSrs(r.srsStats)
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

  const liveStats = (shared.stats && shared.stats.wordSrs) || srsStats || null
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
  const target = String((res && res.reference) || '').toLowerCase().replace(/[^a-z]/g, '')
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
  const activeSrs = (res && res.srs) || srsInfo
  const srsFam = activeSrs ? Number(activeSrs.familiarity) || 0 : 0
  const srsMaxFam = (activeSrs && Number(activeSrs.maxFamiliarity)) || 5
  const showDots = srsInfo && srsInfo.kind !== 'new' && srsFam > 0
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
            {
              className: 'eg-srs-tag' + (srsInfo && srsInfo.kind === 'review' ? ' is-review' : ''),
              title: memoryTooltip(srsInfo),
            },
            memoryLabel(srsInfo),
            showDots
              ? React.createElement(
                  'span',
                  { className: 'eg-srs-dots', 'aria-hidden': 'true' },
                  Array.from({ length: srsMaxFam }, (_, idx) =>
                    React.createElement('i', { key: idx, className: 'eg-srs-dot' + (idx < srsFam ? ' on' : '') }),
                  ),
                )
              : null,
            srsInfo && srsInfo.isHardWord
              ? React.createElement('span', { className: 'eg-srs-hard', title: '高难度或多次遗忘词汇' }, '易错')
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
                res.srs && res.srs.canRate && res.srs.ratingPreviews
                  ? React.createElement(
                      'div',
                      { className: 'eg-fsrs-rate', role: 'group', 'aria-label': '记忆体感评分（快捷键 1 / 2 / 3）' },
                      React.createElement('span', { className: 'eg-fsrs-rate-lbl' }, '记忆体感'),
                      React.createElement(
                        'div',
                        { className: 'eg-fsrs-rate-btns' },
                        FSRS_RATINGS.map((opt) => {
                          const preview = res.srs.ratingPreviews[opt.key]
                          if (!preview) return null
                          const active = res.srs.rating === opt.rating
                          return React.createElement(
                            'button',
                            {
                              key: opt.key,
                              type: 'button',
                              className: 'eg-fsrs-btn' + (active ? ' active' : ''),
                              'aria-pressed': active ? 'true' : 'false',
                              disabled: busy || rateBusy,
                              title: '快捷键 ' + opt.keyHint + '：' + opt.label + '（' + preview.text + '）',
                              onClick: () => rate(opt.rating),
                            },
                            React.createElement('kbd', { className: 'eg-fsrs-key' }, opt.keyHint),
                            React.createElement('span', { className: 'eg-fsrs-lbl' }, opt.label),
                            React.createElement('span', { className: 'eg-fsrs-iv' }, preview.text),
                          )
                        }),
                      ),
                    )
                  : null,
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
                React.createElement(
                  'div',
                  {
                    className: 'eg-collapse eg-word-miss-wrap' + (!revealed ? ' open' : ''),
                    'aria-hidden': revealed ? 'true' : 'false',
                  },
                  React.createElement(
                    'div',
                    { className: 'eg-collapse-inner' },
                    React.createElement(
                      'div',
                      { className: 'eg-word-miss' },
                      '拼写有误，可再试一次或查看答案 · ' + ((res.srs && res.srs.nextReviewText) || '5 分钟后再次巩固'),
                    ),
                  ),
                ),
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
