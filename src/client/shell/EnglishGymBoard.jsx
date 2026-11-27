import React, { useEffect, useRef, useState } from 'react'
import { api } from '../core/api.js'
import { useStyle } from '../core/style.js'
import { refreshStats, store, useShared } from '../core/store.js'
import { prefersReducedMotion } from '../components/motion.js'
import { Confetti } from '../components/Confetti.jsx'
import { useBoardGeom } from './useBoardGeom.js'
import { usePhraseDrill } from '../features/phrase/usePhraseDrill.js'
import { Drill } from '../features/phrase/Drill.jsx'
import { WordPractice } from '../features/word/WordPractice.jsx'
import { useDailyReport } from '../features/report/useDailyReport.js'
import { Report } from '../features/report/Report.jsx'
import { Dashboard, invalidateDashboardCache } from '../features/dashboard/Dashboard.jsx'
import { SettingsPanel } from '../features/settings/SettingsPanel.jsx'

const useIsoLayoutEffect = React.useLayoutEffect || useEffect

const TABS = [
  { id: 'word', label: '单词训练' },
  { id: 'drill', label: '短语训练' },
  { id: 'report', label: '今日文章' },
  { id: 'dashboard', label: '看板' },
  { id: 'settings', label: '设置' },
]

// Small floating board: draggable + resizable, never reflows the chat.
export function EnglishGymBoard() {
  useStyle()
  const shared = useShared()
  const [tab, setTab] = useState('word')
  const open = shared.open
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const tabRefs = useRef({})
  const bodyRef = useRef(null)
  const [slider, setSlider] = useState({ left: 0, width: 0, ready: false })
  const [confettiKey, setConfettiKey] = useState(0)
  const [wordBankRev, setWordBankRev] = useState(0)
  const lastBurstRef = useRef(shared.burst || 0)
  const lastWordReqTickRef = useRef(0)
  const settingsLoadedRef = useRef(false)

  const {
    geom,
    onPanelDown,
    onPanelMove,
    onPanelUp,
    onResizeDown,
    onResizeMove,
    onResizeUp,
  } = useBoardGeom(open)

  const drill = usePhraseDrill({ open, active: tab === 'drill' })
  const dailyReport = useDailyReport({ open, active: tab === 'report' })

  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
      return undefined
    }
    if (!mounted) return undefined
    if (prefersReducedMotion()) {
      setMounted(false)
      setClosing(false)
      return undefined
    }
    setClosing(true)
    const timer = setTimeout(() => {
      setMounted(false)
      setClosing(false)
    }, 145)
    return () => clearTimeout(timer)
  }, [open, mounted])

  useIsoLayoutEffect(() => {
    if (!mounted) return undefined
    const measure = () => {
      const el = tabRefs.current && tabRefs.current[tab]
      if (!el) return
      const pad = Math.min(5, Math.floor(el.offsetWidth * 0.16))
      const left = el.offsetLeft + pad
      const width = Math.max(14, el.offsetWidth - pad * 2)
      setSlider((prev) => (prev.ready && prev.left === left && prev.width === width ? prev : { left, width, ready: true }))
    }
    measure()
    const raf = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(raf)
  }, [tab, mounted, geom.w])

  useIsoLayoutEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [tab])

  // Load persisted settings as soon as the board opens so the celebration
  // switch applies before the user answers anything.
  useEffect(() => {
    if (!open || settingsLoadedRef.current) return
    settingsLoadedRef.current = true
    api('/settings')
      .then((result) => store.setSettings(result.settings))
      .catch(() => {
        settingsLoadedRef.current = false
      })
  }, [open])

  // Consume each celebrate() event once.  Keeping the burst counter in the
  // store is useful for the pill, but the board must not replay the
  // animation merely because the host re-mounted the overlay (e.g. after
  // the window is resized).
  useEffect(() => {
    const burst = shared.burst || 0
    if (!burst || burst === lastBurstRef.current) return
    lastBurstRef.current = burst
    setConfettiKey(burst)
    const timer = setTimeout(() => setConfettiKey(0), 1400)
    return () => clearTimeout(timer)
  }, [shared.burst])

  useEffect(() => {
    const req = shared.wordModeRequest
    if (!req || !req.tick || req.tick === lastWordReqTickRef.current) return
    lastWordReqTickRef.current = req.tick
    setTab('word')
  }, [shared.wordModeRequest])

  useEffect(() => {
    if (open || !store.stats) refreshStats()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !e.defaultPrevented) store.setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!mounted) return null

  return (
    <div
      className={'eg-panel' + (closing ? ' is-closing' : '')}
      role="dialog"
      aria-label="English Gym"
      style={{ left: geom.x, top: geom.y, width: geom.w, height: geom.h }}
      onPointerDown={onPanelDown}
      onPointerMove={onPanelMove}
      onPointerUp={onPanelUp}
      onPointerCancel={onPanelUp}
    >
      <div className="eg-head">
        <span className="eg-grip" aria-hidden="true">
          ⠿
        </span>
        <div className={'eg-tabs' + (slider.ready ? ' has-slider' : '')}>
          {TABS.map((t) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el
              }}
              className={'eg-tab' + (tab === t.id ? ' active' : '')}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
          {slider.ready ? (
            <span
              className="eg-tab-indicator"
              aria-hidden="true"
              style={{ transform: 'translateX(' + slider.left + 'px)', width: slider.width + 'px' }}
            />
          ) : null}
        </div>
        <div className="eg-head-right">
          <button className="eg-close" onClick={() => store.setOpen(false)} title="收起">
            ✕
          </button>
        </div>
      </div>
      <div className="eg-body" ref={bodyRef}>
        <div className="eg-view" key={tab}>
          {tab === 'drill' ? (
            <div className="eg-drill">
              <Drill
                key={drill.card ? drill.card.id : drill.feedback ? 'fb' : 'loading'}
                card={drill.card}
                answer={drill.answer}
                setAnswer={drill.setAnswer}
                submittedAnswer={drill.submittedAnswer}
                feedback={drill.feedback}
                attempt={drill.attempt}
                prevScore={drill.prevScore}
                retryFocusTick={drill.retryFocusTick}
                busy={drill.busy}
                error={drill.error}
                onSubmit={drill.submit}
                onRetry={drill.retry}
                onNext={drill.next}
              />
            </div>
          ) : tab === 'word' ? (
            <WordPractice key="word" bankRev={wordBankRev} />
          ) : tab === 'report' ? (
            <Report
              report={dailyReport.report}
              loading={dailyReport.loading}
              enriching={dailyReport.enriching}
              enrichError={dailyReport.enrichError}
              error={dailyReport.error}
              onRefresh={() => dailyReport.refresh(true)}
              onRetryEnrich={dailyReport.retryEnrich}
            />
          ) : tab === 'dashboard' ? (
            <Dashboard key="dashboard" />
          ) : (
            <SettingsPanel
              onPhraseConfigChange={drill.reset}
              onReportConfigChange={dailyReport.invalidate}
              onWordBankChange={() => {
                setWordBankRev((n) => n + 1)
                drill.reset()
                dailyReport.invalidate()
              }}
              onDataCleared={({ range, clearMemory } = {}) => {
                invalidateDashboardCache()
                if (clearMemory || range === 'all') setWordBankRev((n) => n + 1)
                if (range === 'all') {
                  drill.reset()
                  dailyReport.invalidate()
                }
                refreshStats()
              }}
              onTopicChange={() => {
                drill.reset()
                dailyReport.invalidate()
              }}
            />
          )}
        </div>
      </div>
      {confettiKey ? <Confetti key={confettiKey} /> : null}
      <div
        className="eg-resize"
        onPointerDown={onResizeDown}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeUp}
        onPointerCancel={onResizeUp}
        title="拖动缩放"
      />
    </div>
  )
}
