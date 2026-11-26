import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../core/api.js'

export function useDailyReport({ open, active }) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const genRef = useRef(0)
  const abortRef = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

  const refresh = useCallback(async (force) => {
    const gen = ++genRef.current
    if (abortRef.current) abortRef.current.abort()
    const ac = new AbortController()
    abortRef.current = ac
    startedRef.current = true
    setLoading(true)
    setError('')
    if (force) setReport(null)
    try {
      const next = force
        ? await api('/report/refresh', { method: 'POST', signal: ac.signal })
        : await api('/report', { signal: ac.signal })
      if (gen !== genRef.current || ac.signal.aborted) return
      setReport(next)
    } catch (e) {
      if (gen !== genRef.current || ac.signal.aborted || (e && e.name === 'AbortError')) return
      setError(e.message || '文章加载失败')
    } finally {
      if (gen === genRef.current) {
        abortRef.current = null
        setLoading(false)
      }
    }
  }, [])

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
    startedRef.current = false
    setReport(null)
    setError('')
    setLoading(false)
  }, [])

  return { report, loading, error, refresh, invalidate }
}
