import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../core/api.js'
import { store } from '../../core/store.js'

export function usePhraseDrill({ open, active }) {
  const [card, setCard] = useState(null)
  const [answer, setAnswer] = useState('')
  const [submittedAnswer, setSubmittedAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const [prevScore, setPrevScore] = useState(null)
  const [retryFocusTick, setRetryFocusTick] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lastScoreRef = useRef(null)
  const startedRef = useRef(false)
  const genRef = useRef(0)
  const abortRef = useRef(null)

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

  const loadNext = useCallback(async () => {
    const gen = ++genRef.current
    if (abortRef.current) abortRef.current.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setBusy(true)
    setError('')
    try {
      const data = await api('/next', {
        method: 'POST',
        body: JSON.stringify({ sessionId: store.sessionId || '' }),
        signal: ac.signal,
      })
      if (gen !== genRef.current || ac.signal.aborted) return
      setCard(data)
      setAnswer('')
      setSubmittedAnswer('')
      setFeedback(null)
      setAttempt(0)
      setPrevScore(null)
      setRetryFocusTick(0)
      lastScoreRef.current = null
    } catch (e) {
      if (gen !== genRef.current || ac.signal.aborted || (e && e.name === 'AbortError')) return
      setError(e.message || '出题失败')
    } finally {
      if (gen === genRef.current) {
        abortRef.current = null
        setBusy(false)
      }
    }
  }, [])

  useEffect(() => {
    if (open && active && !card && !feedback && !startedRef.current) {
      startedRef.current = true
      loadNext()
    }
  }, [open, active, card, feedback, loadNext])

  const submit = useCallback(async () => {
    if (!card || busy || !String(answer || '').trim()) return
    const currentAnswer = answer
    const gen = ++genRef.current
    if (abortRef.current) abortRef.current.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setBusy(true)
    setError('')
    try {
      const res = await api('/check', {
        method: 'POST',
        body: JSON.stringify({ id: card.id, answer: currentAnswer }),
        signal: ac.signal,
      })
      if (gen !== genRef.current || ac.signal.aborted) return
      setSubmittedAnswer(currentAnswer)
      setPrevScore(lastScoreRef.current)
      lastScoreRef.current = Number.isFinite(Number(res.score)) ? Number(res.score) : 0
      setAttempt((n) => n + 1)
      setFeedback(res)
      if (res.correct) store.celebrate()
      if (res.summary) store.setStats(res.summary)
    } catch (e) {
      if (gen !== genRef.current || ac.signal.aborted || (e && e.name === 'AbortError')) return
      setError(e.message || '判分失败')
      if (e.status === 409) {
        setCard(null)
        setFeedback(null)
        setAttempt(0)
        setPrevScore(null)
        lastScoreRef.current = null
        startedRef.current = false
      }
    } finally {
      if (gen === genRef.current) {
        abortRef.current = null
        setBusy(false)
      }
    }
  }, [card, answer, busy])

  const retry = useCallback(() => {
    if (!card || busy) return
    setFeedback(null)
    setError('')
    setRetryFocusTick((n) => n + 1)
  }, [card, busy])

  const next = useCallback(() => {
    setFeedback(null)
    setCard(null)
    setSubmittedAnswer('')
    setAttempt(0)
    setPrevScore(null)
    setRetryFocusTick(0)
    lastScoreRef.current = null
    // Keep startedRef true so the auto-load effect does NOT fire a second
    // /next on top of the one we start here (that double-fetch made the
    // previous wording flash in for a moment).
    loadNext()
  }, [loadNext])

  const reset = useCallback(() => {
    genRef.current += 1
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    setCard(null)
    setFeedback(null)
    setAnswer('')
    setSubmittedAnswer('')
    setAttempt(0)
    setPrevScore(null)
    setRetryFocusTick(0)
    setError('')
    setBusy(false)
    lastScoreRef.current = null
    startedRef.current = false
  }, [])

  return {
    card,
    answer,
    setAnswer,
    submittedAnswer,
    feedback,
    attempt,
    prevScore,
    retryFocusTick,
    busy,
    error,
    submit,
    retry,
    next,
    reset,
  }
}
