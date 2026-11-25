import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../core/api.js'

export function useDailyReport({ open, active }) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const staleRef = useRef(false)

  const refresh = useCallback(async (force) => {
    setLoading(true)
    setError('')
    if (force) setReport(null)
    try {
      setReport(force ? await api('/report/refresh', { method: 'POST' }) : await api('/report'))
    } catch (e) {
      setError(e.message || '文章加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open && active && !report && !loading) {
      const force = staleRef.current
      staleRef.current = false
      refresh(force)
    }
  }, [open, active, report, loading, refresh])

  const invalidate = useCallback(() => {
    setReport(null)
    setError('')
    staleRef.current = true
  }, [])

  return { report, loading, error, refresh, invalidate }
}
