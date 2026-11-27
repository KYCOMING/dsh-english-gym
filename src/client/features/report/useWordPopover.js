import React, { useCallback, useEffect, useRef, useState } from 'react'

const useIsoLayoutEffect = React.useLayoutEffect || useEffect

export function useWordPopover({ report, reportRef }) {
  const [active, setActive] = useState(null)
  const [popPos, setPopPos] = useState(null)
  const popRef = useRef(null)
  const termRefs = useRef({})
  const closeTimerRef = useRef(null)

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimerRef.current = setTimeout(() => {
      setActive((prev) => (prev && !prev.pinned ? null : prev))
    }, 140)
  }, [cancelClose])

  useEffect(() => {
    cancelClose()
    setActive(null)
    setPopPos(null)
    termRefs.current = {}
  }, [report, cancelClose])

  useEffect(() => () => cancelClose(), [cancelClose])

  // Close popover on outside click or Escape (capturing Escape before the board closes).
  useEffect(() => {
    if (!active) return undefined
    const onPointerDown = (e) => {
      const target = e.target
      if (popRef.current && target && popRef.current.contains(target)) return
      if (target && target.closest && target.closest('.eg-rword')) return
      setActive(null)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        setActive(null)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown, true)
    }
  }, [active])

  const updatePopoverPosition = useCallback(() => {
    if (!active) {
      setPopPos(null)
      return
    }
    const reportEl = reportRef.current
    const popEl = popRef.current
    const anchorEl = termRefs.current[active.id]
    if (!reportEl || !popEl || !anchorEl) return

    const reportRect = reportEl.getBoundingClientRect()
    const anchorRect = (anchorEl.getClientRects && anchorEl.getClientRects()[0]) || anchorEl.getBoundingClientRect()
    const popWidth = popEl.offsetWidth
    const popHeight = popEl.offsetHeight
    if (!reportRect.width || !popWidth || !popHeight) return

    const scrollEl = reportEl.closest ? reportEl.closest('.eg-body') : null
    const scrollRect = (scrollEl || document.documentElement).getBoundingClientRect()

    const anchorTop = anchorRect.top - reportRect.top
    const anchorBottom = anchorRect.bottom - reportRect.top
    const anchorCenterX = anchorRect.left - reportRect.left + anchorRect.width / 2
    const gap = 9
    const spaceAbove = anchorRect.top - scrollRect.top
    const spaceBelow = scrollRect.bottom - anchorRect.bottom
    const placement = spaceAbove < popHeight + gap + 8 && spaceBelow >= spaceAbove ? 'below' : 'above'
    const top = placement === 'below' ? Math.round(anchorBottom + gap) : Math.round(anchorTop - popHeight - gap)
    const maxLeft = Math.max(0, reportRect.width - popWidth)
    const left = Math.round(Math.max(0, Math.min(maxLeft, anchorCenterX - popWidth / 2)))
    const arrowX = Math.round(Math.max(12, Math.min(Math.max(12, popWidth - 12), anchorCenterX - left)))

    setPopPos({ left, top, arrowX, placement })
  }, [active, reportRef])

  useIsoLayoutEffect(() => {
    updatePopoverPosition()
    if (!active) return undefined
    window.addEventListener('resize', updatePopoverPosition)
    let ro = null
    if (typeof ResizeObserver === 'function' && reportRef.current) {
      ro = new ResizeObserver(updatePopoverPosition)
      ro.observe(reportRef.current)
    }
    return () => {
      window.removeEventListener('resize', updatePopoverPosition)
      if (ro) ro.disconnect()
    }
  }, [active, reportRef, updatePopoverPosition])

  const handleTermEnter = useCallback(
    (seg) => {
      cancelClose()
      setActive((prev) => (prev && prev.pinned ? prev : { id: seg.id, item: seg.item, text: seg.text, pinned: false }))
    },
    [cancelClose],
  )

  const handleTermLeave = useCallback(() => {
    scheduleClose()
  }, [scheduleClose])

  const handleTermClick = useCallback(
    (e, seg) => {
      const sel = typeof window !== 'undefined' && window.getSelection ? window.getSelection() : null
      if (sel && String(sel).trim()) return
      e.stopPropagation()
      cancelClose()
      setActive((prev) =>
        prev && prev.pinned && prev.id === seg.id ? null : { id: seg.id, item: seg.item, text: seg.text, pinned: true },
      )
    },
    [cancelClose],
  )

  const handleTermFocus = useCallback(
    (seg) => {
      cancelClose()
      setActive((prev) => (prev && prev.pinned ? prev : { id: seg.id, item: seg.item, text: seg.text, pinned: false }))
    },
    [cancelClose],
  )

  const handleTermBlur = useCallback((e) => {
    if (popRef.current && e.relatedTarget && popRef.current.contains(e.relatedTarget)) return
    setActive((prev) => (prev && !prev.pinned ? null : prev))
  }, [])

  const handleTermKeyDown = useCallback(
    (e, seg) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
        cancelClose()
        setActive((prev) =>
          prev && prev.pinned && prev.id === seg.id ? null : { id: seg.id, item: seg.item, text: seg.text, pinned: true },
        )
      }
    },
    [cancelClose],
  )

  const closePopover = useCallback(() => setActive(null), [])

  return {
    active,
    popPos,
    popRef,
    termRefs,
    cancelClose,
    closePopover,
    termHandlers: {
      onEnter: handleTermEnter,
      onLeave: handleTermLeave,
      onClick: handleTermClick,
      onFocus: handleTermFocus,
      onBlur: handleTermBlur,
      onKeyDown: handleTermKeyDown,
    },
  }
}
