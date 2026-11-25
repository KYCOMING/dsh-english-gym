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
  const inFlightRef = useRef(false)

  const loadNext = useCallback(async () => {
    // Guard against a duplicate request: the "reset then reload" flow can
    // re-enter through the auto-load effect and, before this guard, fired a
    // second /next whose late response briefly replaced the just-shown card.
    if (inFlightRef.current) return
    inFlightRef.current = true
    setBusy(true)
    setError('')
    try {
      const data = await api('/next', {
        method: 'POST',
        body: JSON.stringify({ sessionId: store.sessionId || '' }),
      })
      setCard(data)
      setAnswer('')
      setSubmittedAnswer('')
      setFeedback(null)
      setAttempt(0)
      setPrevScore(null)
      setRetryFocusTick(0)
      lastScoreRef.current = null
    } catch (e) {
      setError(e.message || '出题失败')
    } finally {
      inFlightRef.current = false
      setBusy(false)
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
    setBusy(true)
    setError('')
    try {
      const res = await api('/check', {
        method: 'POST',
        body: JSON.stringify({ id: card.id, answer: currentAnswer }),
      })
      setSubmittedAnswer(currentAnswer)
      setPrevScore(lastScoreRef.current)
      lastScoreRef.current = Number.isFinite(Number(res.score)) ? Number(res.score) : 0
      setAttempt((n) => n + 1)
      setFeedback(res)
      if (res.correct) store.celebrate()
      if (res.summary) store.setStats(res.summary)
    } catch (e) {
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
      setBusy(false)
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
    setCard(null)
    setFeedback(null)
    setAnswer('')
    setSubmittedAnswer('')
    setAttempt(0)
    setPrevScore(null)
    setRetryFocusTick(0)
    setError('')
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
