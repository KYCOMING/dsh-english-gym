window.__ModuleLoader__.load({
  id: 'dsh-english-gym',
  factory(require) {
    const React = require('react')
    const { useState, useEffect, useRef, useCallback, useReducer } = React

    const API = '/api/english-gym'
    const STYLE_ID = 'eg-dock-style'
    const GEOM_KEY = 'eg-board-geom'

    const CSS = `
.eg-root { font: 12px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif; color: var(--dsw-alias-label-primary, #1f2328); }
.eg-pill { display:flex; align-items:center; gap:8px; width:100%; padding:6px 10px; background:transparent; border:none; cursor:pointer; color:var(--dsw-alias-label-secondary, #57606a); text-align:left; border-radius:8px; }
.eg-pill:hover { background:var(--dsw-alias-bg-layer-2, rgba(0,0,0,.04)); }
.eg-dot { width:8px; height:8px; border-radius:50%; background:var(--dsw-alias-brand-primary, #0969da); flex:0 0 auto; }
.eg-pill-title { font-weight:600; color:var(--dsw-alias-label-primary, #1f2328); }
.eg-chip { display:inline-flex; align-items:center; padding:0 7px; height:18px; border-radius:9px; background:var(--dsw-alias-bg-layer-2, rgba(0,0,0,.06)); color:var(--dsw-alias-label-secondary, #57606a); font-size:11px; }
.eg-chip.warn { background:var(--dsw-alias-state-warn-primary, #bf8700); color:#fff; opacity:.92; }
.eg-chev { margin-left:auto; opacity:.6; font-size:11px; }

/* Small draggable / resizable floating board (shell.overlay) */
.eg-panel { position:fixed; display:flex; flex-direction:column; pointer-events:auto; z-index:2147483000; border:1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.14)); border-radius:14px; background:var(--dsw-alias-bg-layer-1, #fff); box-shadow:0 14px 44px rgba(0,0,0,.24); overflow:hidden; font:12.5px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif; color:var(--dsw-alias-label-primary, #1f2328); transform-origin:bottom center; animation:eg-pop .18s cubic-bezier(.2,.85,.25,1); }
.eg-panel * { box-sizing:border-box; }
@keyframes eg-pop { from { opacity:0; transform:scale(.93) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
.eg-head { display:flex; align-items:center; gap:6px; padding:7px 8px; border-bottom:1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.1)); flex:0 0 auto; cursor:move; user-select:none; background:var(--dsw-alias-bg-layer-2, rgba(0,0,0,.02)); }
.eg-grip { color:var(--dsw-alias-label-secondary,#57606a); opacity:.5; font-size:12px; letter-spacing:-2px; padding:0 2px 0 1px; flex:0 0 auto; }
.eg-tabs { display:flex; gap:3px; }
.eg-tab { padding:3px 9px; border-radius:7px; border:none; background:transparent; color:var(--dsw-alias-label-secondary,#57606a); cursor:pointer; font-size:12px; }
.eg-tab.active { background:var(--dsw-alias-bg-layer-2, rgba(0,0,0,.08)); color:var(--dsw-alias-label-primary,#1f2328); font-weight:600; }
.eg-close { margin-left:auto; border:none; background:transparent; color:var(--dsw-alias-label-secondary,#57606a); cursor:pointer; font-size:14px; line-height:1; padding:3px 6px; border-radius:7px; flex:0 0 auto; }
.eg-close:hover { background:var(--dsw-alias-bg-layer-2, rgba(0,0,0,.08)); }
.eg-body { padding:10px; overflow-y:auto; flex:1 1 auto; }
.eg-zh { font-size:15px; line-height:1.55; font-weight:600; letter-spacing:.2px; }
.eg-hint { margin-top:5px; color:var(--dsw-alias-label-secondary,#57606a); font-size:12px; }
.eg-hint summary { cursor:pointer; opacity:.85; }
.eg-input { width:100%; box-sizing:border-box; margin-top:8px; min-height:48px; resize:vertical; padding:7px 9px; border-radius:8px; border:1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.18)); background:var(--dsw-alias-bg-base, #fff); color:var(--dsw-alias-label-primary,#1f2328); font:inherit; outline:none; }
.eg-input:focus { border-color:var(--dsw-alias-brand-primary,#0969da); }
.eg-actions { display:flex; gap:7px; margin-top:8px; }
.eg-btn { padding:5px 11px; border-radius:8px; border:1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.18)); background:var(--dsw-alias-bg-layer-1,#fff); color:var(--dsw-alias-label-primary,#1f2328); cursor:pointer; font-size:12px; }
.eg-btn:hover { background:var(--dsw-alias-bg-layer-2, rgba(0,0,0,.05)); }
.eg-btn.primary { background:var(--dsw-alias-brand-primary,#0969da); border-color:transparent; color:#fff; font-weight:600; }
.eg-btn.primary:disabled { opacity:.55; cursor:default; }
.eg-fb { margin-top:8px; padding:8px 10px; border-radius:9px; border:1px solid transparent; }
.eg-fb.ok { background:color-mix(in srgb, var(--dsw-alias-state-success-primary,#1a7f37) 10%, transparent); border-color:color-mix(in srgb, var(--dsw-alias-state-success-primary,#1a7f37) 35%, transparent); }
.eg-fb.bad { background:color-mix(in srgb, var(--dsw-alias-state-error-primary,#cf222e) 9%, transparent); border-color:color-mix(in srgb, var(--dsw-alias-state-error-primary,#cf222e) 32%, transparent); }
.eg-fb-title { font-weight:700; }
.eg-fb.ok .eg-fb-title { color:var(--dsw-alias-state-success-primary,#1a7f37); }
.eg-fb.bad .eg-fb-title { color:var(--dsw-alias-state-error-primary,#cf222e); }
.eg-fb-row { margin-top:5px; }
.eg-ref { font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:12.5px; }
.eg-muted { color:var(--dsw-alias-label-secondary,#57606a); }
.eg-err { color:var(--dsw-alias-state-error-primary,#cf222e); margin-top:6px; }
.eg-report h3 { margin:0 0 3px; font-size:14px; }
.eg-report .meta { color:var(--dsw-alias-label-secondary,#57606a); font-size:11px; margin-bottom:6px; }
.eg-report p { margin:0 0 7px; line-height:1.65; }
.eg-q { margin-top:7px; padding:7px 9px; border-radius:8px; background:var(--dsw-alias-bg-layer-2, rgba(0,0,0,.04)); }
.eg-q .en { display:none; margin-top:4px; font-family:ui-monospace, Menlo, monospace; color:var(--dsw-alias-label-primary,#1f2328); }
.eg-q.reveal .en { display:block; }
.eg-q-toggle { background:none; border:none; color:var(--dsw-alias-brand-primary,#0969da); cursor:pointer; font-size:11px; padding:0; margin-top:2px; }
.eg-loading { color:var(--dsw-alias-label-secondary,#57606a); padding:4px 0; }
.eg-spin { display:inline-block; width:12px; height:12px; border:2px solid var(--dsw-alias-border-l2, rgba(0,0,0,.2)); border-top-color:var(--dsw-alias-brand-primary,#0969da); border-radius:50%; animation:eg-rotate .7s linear infinite; vertical-align:-2px; margin-right:6px; }
@keyframes eg-rotate { to { transform:rotate(360deg); } }
.eg-resize { position:absolute; right:0; bottom:0; width:16px; height:16px; cursor:nwse-resize; pointer-events:auto; }
.eg-resize::after { content:""; position:absolute; right:3px; bottom:3px; width:8px; height:8px; border-right:2px solid var(--dsw-alias-border-l2, rgba(0,0,0,.28)); border-bottom:2px solid var(--dsw-alias-border-l2, rgba(0,0,0,.28)); border-bottom-right-radius:3px; opacity:.7; }
`

    function useStyle() {
      useEffect(() => {
        if (document.getElementById(STYLE_ID)) return
        const el = document.createElement('style')
        el.id = STYLE_ID
        el.textContent = CSS
        document.head.appendChild(el)
      }, [])
    }

    async function api(path, options) {
      const res = await fetch(API + path, {
        headers: { 'content-type': 'application/json' },
        ...(options || {}),
      })
      let data = null
      try {
        data = await res.json()
      } catch {
        data = {}
      }
      if (!res.ok) {
        const message = (data && data.error) || 'HTTP ' + res.status
        const error = new Error(message)
        error.status = res.status
        throw error
      }
      return data
    }

    // Shared state between the inline pill and the floating board.
    const store = {
      open: false,
      stats: null,
      listeners: new Set(),
      emit() {
        for (const l of Array.from(this.listeners)) l()
      },
      subscribe(l) {
        this.listeners.add(l)
        return () => this.listeners.delete(l)
      },
      setOpen(v) {
        this.open = v
        this.emit()
      },
      toggle() {
        this.setOpen(!this.open)
      },
      setStats(s) {
        this.stats = s
        this.emit()
      },
    }

    async function refreshStats() {
      try {
        store.setStats(await api('/state'))
      } catch {
        /* ignore */
      }
    }

    function useShared() {
      const [, force] = useReducer((x) => x + 1, 0)
      useEffect(() => store.subscribe(force), [])
      return store
    }

    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)

    function loadGeom() {
      try {
        const g = JSON.parse(localStorage.getItem(GEOM_KEY) || 'null')
        if (g && g.w && g.h) return g
      } catch {
        /* ignore */
      }
      return null
    }

    function fitGeom(g) {
      const vw = window.innerWidth || 1200
      const vh = window.innerHeight || 800
      const w = clamp(g.w, 240, vw - 16)
      const h = clamp(g.h, 170, vh - 60)
      const x = clamp(g.x, 8, Math.max(8, vw - w - 8))
      const y = clamp(g.y, 8, Math.max(8, vh - 44))
      return { x, y, w, h }
    }

    function StatChip({ label, value, warn }) {
      return React.createElement(
        'span',
        { className: 'eg-chip' + (warn ? ' warn' : '') },
        label + ' ' + value,
      )
    }

    function Drill({ card, answer, setAnswer, feedback, busy, error, onSubmit, onNext, onSkip }) {
      if (feedback) {
        return React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'eg-fb ' + (feedback.correct ? 'ok' : 'bad') },
            React.createElement(
              'div',
              { className: 'eg-fb-title' },
              (feedback.correct ? '✅ 正确' : '❌ 再试试') + '　' + feedback.score + ' 分',
            ),
            React.createElement(
              'div',
              { className: 'eg-fb-row' },
              React.createElement('span', { className: 'eg-muted' }, '参考：'),
              React.createElement('span', { className: 'eg-ref' }, feedback.reference || '—'),
            ),
            feedback.tip
              ? React.createElement('div', { className: 'eg-fb-row eg-muted' }, '💡 ' + feedback.tip)
              : null,
          ),
          React.createElement(
            'div',
            { className: 'eg-actions' },
            React.createElement('button', { className: 'eg-btn primary', onClick: onNext, disabled: busy }, '下一题 →'),
          ),
        )
      }
      if (!card) {
        return React.createElement(
          'div',
          { className: 'eg-loading' },
          React.createElement('span', { className: 'eg-spin' }),
          '正在出题…',
        )
      }
      return React.createElement(
        'div',
        null,
        React.createElement('div', { className: 'eg-zh' }, card.zh),
        card.hint
          ? React.createElement(
              'details',
              { className: 'eg-hint' },
              React.createElement('summary', null, '提示'),
              React.createElement('span', null, card.hint),
            )
          : null,
        React.createElement('textarea', {
          className: 'eg-input',
          value: answer,
          placeholder: '输入英文翻译…（⌘/Ctrl + Enter 提交）',
          onChange: (e) => setAnswer(e.target.value),
          onKeyDown: (e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              onSubmit()
            }
          },
        }),
        error ? React.createElement('div', { className: 'eg-err' }, error) : null,
        React.createElement(
          'div',
          { className: 'eg-actions' },
          React.createElement(
            'button',
            { className: 'eg-btn primary', onClick: onSubmit, disabled: busy || !answer.trim() },
            busy ? '判分中…' : '提交',
          ),
          React.createElement('button', { className: 'eg-btn', onClick: onSkip, disabled: busy }, '换一题'),
        ),
      )
    }

    function Report({ report, loading, onRefresh }) {
      if (loading && !report) {
        return React.createElement(
          'div',
          { className: 'eg-loading' },
          React.createElement('span', { className: 'eg-spin' }),
          '正在生成今日报告…',
        )
      }
      if (!report) {
        return React.createElement(
          'div',
          { className: 'eg-loading' },
          '暂无报告。',
          React.createElement('button', { className: 'eg-btn', style: { marginLeft: 8 }, onClick: onRefresh }, '生成'),
        )
      }
      const paragraphs = String(report.body || '').split(/\n{2,}/).filter(Boolean)
      return React.createElement(
        'div',
        { className: 'eg-report' },
        React.createElement('h3', null, report.title || 'Daily Report'),
        React.createElement('div', { className: 'meta' }, [report.date, report.level].filter(Boolean).join(' · ')),
        report.summary_zh ? React.createElement('p', { className: 'eg-muted' }, report.summary_zh) : null,
        paragraphs.map((p, i) => React.createElement('p', { key: i }, p)),
        (report.questions || []).length
          ? React.createElement(
              'div',
              { style: { marginTop: 8 } },
              React.createElement('div', { className: 'eg-muted', style: { fontWeight: 600 } }, '练一练'),
              report.questions.map((q, i) =>
                React.createElement(
                  'div',
                  { key: i, className: 'eg-q' },
                  React.createElement('div', null, i + 1 + '. ' + q.zh),
                  React.createElement(
                    'button',
                    {
                      className: 'eg-q-toggle',
                      onClick: (e) => {
                        const box = e.currentTarget.parentElement
                        box.classList.toggle('reveal')
                        e.currentTarget.textContent = box.classList.contains('reveal') ? '收起参考' : '看参考'
                      },
                    },
                    '看参考',
                  ),
                  React.createElement('div', { className: 'en' }, q.en),
                ),
              ),
            )
          : null,
        React.createElement(
          'div',
          { className: 'eg-actions' },
          React.createElement('button', { className: 'eg-btn', onClick: onRefresh, disabled: loading }, loading ? '生成中…' : '换一篇'),
        ),
      )
    }

    // Inline trigger under the composer (compact).
    function EnglishGymPill() {
      useStyle()
      const shared = useShared()
      useEffect(() => {
        if (!store.stats) refreshStats()
      }, [])
      const stats = shared.stats
      return React.createElement(
        'div',
        { className: 'eg-root' },
        React.createElement(
          'button',
          {
            className: 'eg-pill',
            onClick: () => store.toggle(),
            title: 'English Gym — 中文造句练习',
            'aria-expanded': shared.open ? 'true' : 'false',
          },
          React.createElement('span', { className: 'eg-dot' }),
          React.createElement('span', { className: 'eg-pill-title' }, 'English Gym'),
          stats && stats.reviewCount > 0
            ? React.createElement('span', { className: 'eg-chip warn' }, '待复习 ' + stats.reviewCount)
            : null,
          React.createElement('span', { className: 'eg-chev' }, shared.open ? '▾' : '▸'),
        ),
      )
    }

    // Small floating board: draggable + resizable, never reflows the chat.
    function EnglishGymBoard() {
      useStyle()
      const shared = useShared()
      const [tab, setTab] = useState('drill')
      const [card, setCard] = useState(null)
      const [answer, setAnswer] = useState('')
      const [feedback, setFeedback] = useState(null)
      const [busy, setBusy] = useState(false)
      const [error, setError] = useState('')
      const [report, setReport] = useState(null)
      const [reportLoading, setReportLoading] = useState(false)
      const startedRef = useRef(false)
      const [geom, setGeom] = useState(() => {
        const saved = loadGeom()
        if (saved) return fitGeom(saved)
        const vw = window.innerWidth || 1200
        const vh = window.innerHeight || 800
        return fitGeom({ w: 300, h: 320, x: Math.round((vw - 300) / 2), y: Math.round(vh - 320 - 160) })
      })
      const geomRef = useRef(geom)
      useEffect(() => {
        geomRef.current = geom
      }, [geom])

      const open = shared.open

      const saveGeom = useCallback(() => {
        try {
          localStorage.setItem(GEOM_KEY, JSON.stringify(geomRef.current))
        } catch {
          /* ignore */
        }
      }, [])

      const onHeaderDown = useCallback(
        (e) => {
          if (e.button !== 0) return
          if (e.target && e.target.closest && e.target.closest('button')) return
          e.preventDefault()
          const g0 = geomRef.current
          const sx = e.clientX
          const sy = e.clientY
          const move = (ev) => {
            const x = clamp(g0.x + (ev.clientX - sx), 0, window.innerWidth - g0.w)
            const y = clamp(g0.y + (ev.clientY - sy), 0, window.innerHeight - 44)
            setGeom({ x, y, w: g0.w, h: g0.h })
          }
          const up = () => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
            saveGeom()
          }
          window.addEventListener('pointermove', move)
          window.addEventListener('pointerup', up)
        },
        [saveGeom],
      )

      const onResizeDown = useCallback(
        (e) => {
          if (e.button !== 0) return
          e.preventDefault()
          e.stopPropagation()
          const g0 = geomRef.current
          const sx = e.clientX
          const sy = e.clientY
          const move = (ev) => {
            const maxW = window.innerWidth - g0.x - 8
            const maxH = window.innerHeight - g0.y - 8
            const w = clamp(g0.w + (ev.clientX - sx), 240, Math.max(240, maxW))
            const h = clamp(g0.h + (ev.clientY - sy), 170, Math.max(170, maxH))
            setGeom({ x: g0.x, y: g0.y, w, h })
          }
          const up = () => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
            saveGeom()
          }
          window.addEventListener('pointermove', move)
          window.addEventListener('pointerup', up)
        },
        [saveGeom],
      )

      const loadNext = useCallback(async (mode) => {
        setBusy(true)
        setError('')
        try {
          const data = await api('/next', {
            method: 'POST',
            body: JSON.stringify({ mode: mode || 'new' }),
          })
          setCard(data)
          setAnswer('')
          setFeedback(null)
        } catch (e) {
          setError(e.message || '出题失败')
        } finally {
          setBusy(false)
        }
      }, [])

      const refreshReport = useCallback(async () => {
        setReportLoading(true)
        try {
          setReport(await api('/report'))
        } catch (e) {
          setError(e.message || '报告加载失败')
        } finally {
          setReportLoading(false)
        }
      }, [])

      useEffect(() => {
        if (!store.stats) refreshStats()
      }, [])

      useEffect(() => {
        if (open && tab === 'drill' && !card && !feedback && !startedRef.current) {
          startedRef.current = true
          loadNext('new')
        }
      }, [open, tab, card, feedback, loadNext])

      useEffect(() => {
        if (open && tab === 'report' && !report && !reportLoading) {
          refreshReport()
        }
      }, [open, tab, report, reportLoading, refreshReport])

      useEffect(() => {
        if (!open) return
        const onKey = (e) => {
          if (e.key === 'Escape') store.setOpen(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [open])

      const submit = useCallback(async () => {
        if (!card || busy) return
        setBusy(true)
        setError('')
        try {
          const res = await api('/check', {
            method: 'POST',
            body: JSON.stringify({ id: card.id, answer }),
          })
          setFeedback(res)
          if (res.summary) store.setStats(res.summary)
        } catch (e) {
          setError(e.message || '判分失败')
          if (e.status === 409) {
            setCard(null)
            setFeedback(null)
            startedRef.current = false
          }
        } finally {
          setBusy(false)
        }
      }, [card, answer, busy])

      const next = useCallback(() => {
        setFeedback(null)
        setCard(null)
        startedRef.current = false
        loadNext('new')
      }, [loadNext])

      if (!open) return null

      return React.createElement(
        'div',
        {
          className: 'eg-panel',
          role: 'dialog',
          'aria-label': 'English Gym',
          style: { left: geom.x, top: geom.y, width: geom.w, height: geom.h },
        },
        React.createElement(
          'div',
          { className: 'eg-head', onPointerDown: onHeaderDown },
          React.createElement('span', { className: 'eg-grip', 'aria-hidden': 'true' }, '⠿'),
          React.createElement(
            'div',
            { className: 'eg-tabs' },
            React.createElement(
              'button',
              { className: 'eg-tab' + (tab === 'drill' ? ' active' : ''), onClick: () => setTab('drill') },
              '练习',
            ),
            React.createElement(
              'button',
              { className: 'eg-tab' + (tab === 'report' ? ' active' : ''), onClick: () => setTab('report') },
              '今日报告',
            ),
          ),
          React.createElement('button', { className: 'eg-close', onClick: () => store.setOpen(false), title: '收起' }, '✕'),
        ),
        React.createElement(
          'div',
          { className: 'eg-body' },
          tab === 'drill'
            ? React.createElement(Drill, {
                card,
                answer,
                setAnswer,
                feedback,
                busy,
                error,
                onSubmit: submit,
                onNext: next,
                onSkip: next,
              })
            : React.createElement(Report, {
                report,
                loading: reportLoading,
                onRefresh: () => {
                  setReport(null)
                  refreshReport()
                },
              }),
        ),
        React.createElement('div', { className: 'eg-resize', onPointerDown: onResizeDown, title: '拖动缩放' }),
      )
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('conversation.composer.dock', () =>
          ctx.slots.register(
            { name: 'conversation.composer.dock', id: 'dsh-english-gym.pill', order: 20 },
            EnglishGymPill,
          ),
        )
        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            { name: 'shell.overlay', id: 'dsh-english-gym.board', order: 20 },
            EnglishGymBoard,
          ),
        )
      },
    }
  },
})
