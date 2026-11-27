import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../core/api.js'
import { store, useShared } from '../../core/store.js'
import { popElement } from '../../components/motion.js'
import { shortBankName } from './srsFormat.js'

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

export function useWordPractice({ bankRev = 0 } = {}) {
  const shared = useShared()
  const [item, setItem] = useState(() => cachedWord.item)
  const [cells, setCells] = useState(() => cachedWord.cells)
  const [res, setRes] = useState(() => cachedWord.res)
  const [revealed, setRevealed] = useState(() => cachedWord.revealed)
  const [busy, setBusy] = useState(false)
  const [rateBusy, setRateBusy] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState(() => cachedWord.mode)
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

  return {
    item,
    cells,
    res,
    revealed,
    busy,
    rateBusy,
    error,
    mode,
    refs,
    liveStats,
    dueCount,
    learningCount,
    masteredCount,
    bankLabel,
    load,
    rate,
    switchMode,
    submit,
    markMastered,
    retry,
    toggleReveal,
    setCell,
    onKey,
  }
}
