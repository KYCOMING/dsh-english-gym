import { useCallback, useEffect, useRef, useState } from 'react'
import { clamp } from '../components/motion.js'
import { EDGE_PAD, fitGeom, GEOM_KEY, loadGeom, MIN_TOP, pillAnchorGeom } from './geom.js'

export function useBoardGeom(open) {
  const [geom, setGeom] = useState(() => {
    const saved = loadGeom()
    if (saved) return fitGeom(saved)
    return pillAnchorGeom()
  })
  const geomRef = useRef(geom)
  useEffect(() => {
    geomRef.current = geom
  }, [geom])

  // Position just above the pill the first time it opens (unless the user
  // has already dragged it and we have a remembered geometry).
  const anchoredRef = useRef(false)
  useEffect(() => {
    if (open && !anchoredRef.current) {
      anchoredRef.current = true
      if (!loadGeom()) setGeom(pillAnchorGeom())
    }
  }, [open])

  useEffect(() => {
    const onResize = () => setGeom((g) => fitGeom(g))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const saveGeom = useCallback(() => {
    try {
      localStorage.setItem(GEOM_KEY, JSON.stringify(geomRef.current))
    } catch {
      /* ignore */
    }
  }, [])

  const dragRef = useRef(null)
  const resizeRef = useRef(null)

  // Drag via pointer capture: the browser routes all subsequent pointer
  // events to the element that captured the pointer, even outside it.
  const onPanelDown = useCallback((e) => {
    if (e.button !== 0 || dragRef.current) return
    const t = e.target
    const el = t && t.nodeType === 1 ? t : t && t.parentElement
    if (
      el &&
      el.closest &&
      el.closest('button, textarea, input, select, a, summary, [contenteditable="true"], [data-nodrag], .eg-resize')
    )
      return
    e.preventDefault()
    dragRef.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, g0: geomRef.current }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }, [])

  const onPanelMove = useCallback((e) => {
    const d = dragRef.current
    if (!d || d.id !== e.pointerId) return
    const x = clamp(d.g0.x + (e.clientX - d.sx), EDGE_PAD, Math.max(EDGE_PAD, window.innerWidth - d.g0.w - EDGE_PAD))
    const y = clamp(d.g0.y + (e.clientY - d.sy), MIN_TOP, Math.max(MIN_TOP, window.innerHeight - 44))
    setGeom({ x, y, w: d.g0.w, h: d.g0.h })
  }, [])

  const onPanelUp = useCallback(
    (e) => {
      const d = dragRef.current
      if (!d || d.id !== e.pointerId) return
      dragRef.current = null
      try {
        if (e.currentTarget.hasPointerCapture(d.id)) e.currentTarget.releasePointerCapture(d.id)
      } catch {
        /* ignore */
      }
      saveGeom()
    },
    [saveGeom],
  )

  const onResizeDown = useCallback((e) => {
    if (e.button !== 0 || resizeRef.current) return
    e.preventDefault()
    e.stopPropagation()
    resizeRef.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, g0: geomRef.current }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }, [])

  const onResizeMove = useCallback((e) => {
    const d = resizeRef.current
    if (!d || d.id !== e.pointerId) return
    const maxW = window.innerWidth - d.g0.x - EDGE_PAD
    const maxH = window.innerHeight - d.g0.y - EDGE_PAD
    const w = clamp(d.g0.w + (e.clientX - d.sx), 240, Math.max(240, maxW))
    const h = clamp(d.g0.h + (e.clientY - d.sy), 170, Math.max(170, maxH))
    setGeom({ x: d.g0.x, y: d.g0.y, w, h })
  }, [])

  const onResizeUp = useCallback(
    (e) => {
      const d = resizeRef.current
      if (!d || d.id !== e.pointerId) return
      resizeRef.current = null
      try {
        if (e.currentTarget.hasPointerCapture(d.id)) e.currentTarget.releasePointerCapture(d.id)
      } catch {
        /* ignore */
      }
      saveGeom()
    },
    [saveGeom],
  )

  return {
    geom,
    onPanelDown,
    onPanelMove,
    onPanelUp,
    onResizeDown,
    onResizeMove,
    onResizeUp,
  }
}
