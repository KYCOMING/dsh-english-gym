import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../core/api.js'

export function useDailyReport({ open, active }) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [enriching, setEnriching] = useState(false)
  const [enrichError, setEnrichError] = useState('')
  const [error, setError] = useState('')
  const genRef = useRef(0)
  const abortRef = useRef(null)
  const enrichAbortRef = useRef(null)
  const startedRef = useRef(false)
  const reportRef = useRef(null)

  useEffect(() => {
    reportRef.current = report
  }, [report])

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort()
      if (enrichAbortRef.current) enrichAbortRef.current.abort()
    }
  }, [])

  const runEnrich = useCallback(async (target, gen) => {
    if (!target || target.fallback || target.enriched !== false) return
    if (enrichAbortRef.current) enrichAbortRef.current.abort()
    const ac = new AbortController()
    enrichAbortRef.current = ac
    setEnriching(true)
    setEnrichError('')
    try {
      const next = await api('/report/enrich', {
        method: 'POST',
        body: JSON.stringify({ date: target.date, id: target.id }),
        signal: ac.signal,
      })
      if (gen !== genRef.current || ac.signal.aborted) return
      if (target.id && next && next.id && next.id !== target.id) return
      setReport(next)
    } catch (e) {
      if (gen !== genRef.current || ac.signal.aborted || (e && e.name === 'AbortError')) return
      const msg = String((e && e.message) || '')
      setEnrichError(/timed out/i.test(msg) ? '后台补全超时，请点击重试' : msg || '译文与练习加载失败')
    } finally {
      if (enrichAbortRef.current === ac) enrichAbortRef.current = null
      if (gen === genRef.current) setEnriching(false)
    }
  }, [])

  const refresh = useCallback(
    async (force) => {
      const gen = ++genRef.current
      if (abortRef.current) abortRef.current.abort()
      if (enrichAbortRef.current) {
        enrichAbortRef.current.abort()
        enrichAbortRef.current = null
      }
      const ac = new AbortController()
      abortRef.current = ac
      startedRef.current = true
      setLoading(true)
      setEnriching(false)
      setEnrichError('')
      setError('')
      if (force) setReport(null)
      try {
        const next = force
          ? await api('/report/refresh', { method: 'POST', signal: ac.signal })
          : await api('/report', { signal: ac.signal })
        if (gen !== genRef.current || ac.signal.aborted) return
        setReport(next)
        if (next && !next.fallback && next.enriched === false) {
          runEnrich(next, gen)
        }
      } catch (e) {
        if (gen !== genRef.current || ac.signal.aborted || (e && e.name === 'AbortError')) return
        setError(e.message || '文章加载失败')
      } finally {
        if (abortRef.current === ac) abortRef.current = null
        if (gen === genRef.current) setLoading(false)
      }
    },
    [runEnrich],
  )

  const retryEnrich = useCallback(() => {
    const current = reportRef.current
    if (!current || current.fallback || current.enriched !== false) return
    runEnrich(current, genRef.current)
  }, [runEnrich])

  useEffect(() => {
    if (open && active && !report && !loading && !error && !startedRef.current) {
      refresh(false)
    }
  }, [open, active, report, loading, error, refresh])

  useEffect(() => {
    if (!open && error) {
      startedRef.current = false
      setError('')
    }
  }, [open, error])

  const invalidate = useCallback(() => {
    genRef.current += 1
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    if (enrichAbortRef.current) {
      enrichAbortRef.current.abort()
      enrichAbortRef.current = null
    }
    startedRef.current = false
    setReport(null)
    setError('')
    setEnrichError('')
    setLoading(false)
    setEnriching(false)
  }, [])

  return { report, loading, enriching, enrichError, error, refresh, retryEnrich, invalidate }
}
