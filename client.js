window.__ModuleLoader__.load({
  id: 'dsh-english-gym',
  factory(require) {
    const React = require('react')
    const { useState, useEffect, useRef, useCallback } = React

    const API = '/api/english-gym'
    const STYLE_ID = 'eg-dock-style'

    const CSS = `
.eg-root { font: 12px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif; color: var(--dsw-alias-label-primary, #1f2328); }
.eg-pill { display:flex; align-items:center; gap:8px; width:100%; padding:6px 10px; background:transparent; border:none; cursor:pointer; color:var(--dsw-alias-label-secondary, #57606a); text-align:left; border-radius:8px; }
.eg-pill:hover { background:var(--dsw-alias-bg-layer-2, rgba(0,0,0,.04)); }
.eg-dot { width:8px; height:8px; border-radius:50%; background:var(--dsw-alias-brand-primary, #0969da); flex:0 0 auto; }
.eg-pill-title { font-weight:600; color:var(--dsw-alias-label-primary, #1f2328); }
.eg-chip { display:inline-flex; align-items:center; padding:0 7px; height:18px; border-radius:9px; background:var(--dsw-alias-bg-layer-2, rgba(0,0,0,.06)); color:var(--dsw-alias-label-secondary, #57606a); font-size:11px; }
.eg-chip.warn { background:var(--dsw-alias-state-warn-primary, #bf8700); color:#fff; opacity:.92; }
.eg-chev { margin-left:auto; opacity:.6; font-size:11px; }
.eg-panel { margin-top:4px; border:1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.12)); border-radius:12px; background:var(--dsw-alias-bg-layer-1, #fff); box-shadow:0 6px 24px rgba(0,0,0,.08); overflow:hidden; }
.eg-head { display:flex; align-items:center; gap:10px; padding:10px 12px 8px; border-bottom:1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.1)); }
.eg-tabs { display:flex; gap:4px; }
.eg-tab { padding:4px 10px; border-radius:8px; border:none; background:transparent; color:var(--dsw-alias-label-secondary,#57606a); cursor:pointer; font-size:12px; }
.eg-tab.active { background:var(--dsw-alias-bg-layer-2, rgba(0,0,0,.06)); color:var(--dsw-alias-label-primary,#1f2328); font-weight:600; }
.eg-stats { margin-left:auto; display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end; }
.eg-body { padding:12px; }
.eg-zh { font-size:16px; line-height:1.6; font-weight:600; letter-spacing:.2px; }
.eg-hint { margin-top:6px; color:var(--dsw-alias-label-secondary,#57606a); font-size:12px; }
.eg-hint summary { cursor:pointer; opacity:.85; }
.eg-input { width:100%; box-sizing:border-box; margin-top:10px; min-height:58px; resize:vertical; padding:8px 10px; border-radius:8px; border:1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.18)); background:var(--dsw-alias-bg-base, #fff); color:var(--dsw-alias-label-primary,#1f2328); font:inherit; outline:none; }
.eg-input:focus { border-color:var(--dsw-alias-brand-primary,#0969da); }
.eg-actions { display:flex; gap:8px; margin-top:10px; }
.eg-btn { padding:6px 12px; border-radius:8px; border:1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.18)); background:var(--dsw-alias-bg-layer-1,#fff); color:var(--dsw-alias-label-primary,#1f2328); cursor:pointer; font-size:12px; }
.eg-btn:hover { background:var(--dsw-alias-bg-layer-2, rgba(0,0,0,.05)); }
.eg-btn.primary { background:var(--dsw-alias-brand-primary,#0969da); border-color:transparent; color:#fff; font-weight:600; }
.eg-btn.primary:disabled { opacity:.55; cursor:default; }
.eg-btn.ghost { margin-left:auto; }
.eg-fb { margin-top:10px; padding:10px 12px; border-radius:10px; border:1px solid transparent; }
.eg-fb.ok { background:color-mix(in srgb, var(--dsw-alias-state-success-primary,#1a7f37) 10%, transparent); border-color:color-mix(in srgb, var(--dsw-alias-state-success-primary,#1a7f37) 35%, transparent); }
.eg-fb.bad { background:color-mix(in srgb, var(--dsw-alias-state-error-primary,#cf222e) 9%, transparent); border-color:color-mix(in srgb, var(--dsw-alias-state-error-primary,#cf222e) 32%, transparent); }
.eg-fb-title { font-weight:700; }
.eg-fb.ok .eg-fb-title { color:var(--dsw-alias-state-success-primary,#1a7f37); }
.eg-fb.bad .eg-fb-title { color:var(--dsw-alias-state-error-primary,#cf222e); }
.eg-fb-row { margin-top:6px; }
.eg-ref { font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:13px; }
.eg-muted { color:var(--dsw-alias-label-secondary,#57606a); }
.eg-err { color:var(--dsw-alias-state-error-primary,#cf222e); margin-top:8px; }
.eg-report h3 { margin:0 0 4px; font-size:15px; }
.eg-report .meta { color:var(--dsw-alias-label-secondary,#57606a); font-size:11px; margin-bottom:8px; }
.eg-report p { margin:0 0 8px; line-height:1.7; }
.eg-q { margin-top:8px; padding:8px 10px; border-radius:8px; background:var(--dsw-alias-bg-layer-2, rgba(0,0,0,.04)); }
.eg-q .en { display:none; margin-top:4px; font-family:ui-monospace, Menlo, monospace; color:var(--dsw-alias-label-primary,#1f2328); }
.eg-q.reveal .en { display:block; }
.eg-q-toggle { background:none; border:none; color:var(--dsw-alias-brand-primary,#0969da); cursor:pointer; font-size:11px; padding:0; margin-top:2px; }
.eg-loading { color:var(--dsw-alias-label-secondary,#57606a); padding:6px 0; }
.eg-spin { display:inline-block; width:12px; height:12px; border:2px solid var(--dsw-alias-border-l2, rgba(0,0,0,.2)); border-top-color:var(--dsw-alias-brand-primary,#0969da); border-radius:50%; animation:eg-rotate .7s linear infinite; vertical-align:-2px; margin-right:6px; }
@keyframes eg-rotate { to { transform:rotate(360deg); } }
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
              ? React.createElement(
                  'div',
                  { className: 'eg-fb-row eg-muted' },
                  '💡 ' + feedback.tip,
                )
              : null,
          ),
          React.createElement(
            'div',
            { className: 'eg-actions' },
            React.createElement(
              'button',
              { className: 'eg-btn primary', onClick: onNext, disabled: busy },
              '下一题 →',
            ),
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
        React.createElement(
          'div',
          { className: 'eg-zh' },
          card.zh,
        ),
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
          placeholder: '在这里输入英文翻译…（⌘/Ctrl + Enter 提交）',
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
          React.createElement(
            'button',
            { className: 'eg-btn', style: { marginLeft: 8 }, onClick: onRefresh },
            '生成',
          ),
        )
      }
      const paragraphs = String(report.body || '').split(/\n{2,}/).filter(Boolean)
      return React.createElement(
        'div',
        { className: 'eg-report' },
        React.createElement('h3', null, report.title || 'Daily Report'),
        React.createElement(
          'div',
          { className: 'meta' },
          [report.date, report.level].filter(Boolean).join(' · '),
        ),
        report.summary_zh
          ? React.createElement('p', { className: 'eg-muted' }, report.summary_zh)
          : null,
        paragraphs.map((p, i) => React.createElement('p', { key: i }, p)),
        (report.questions || []).length
          ? React.createElement(
              'div',
              { style: { marginTop: 10 } },
              React.createElement('div', { className: 'eg-muted', style: { fontWeight: 600 } }, '练一练（先自己翻译，再点“看参考”）'),
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

    function EnglishGymDock() {
      useStyle()
      const [open, setOpen] = useState(false)
      const [tab, setTab] = useState('drill')
      const [stats, setStats] = useState(null)
      const [card, setCard] = useState(null)
      const [answer, setAnswer] = useState('')
      const [feedback, setFeedback] = useState(null)
      const [busy, setBusy] = useState(false)
      const [error, setError] = useState('')
      const [report, setReport] = useState(null)
      const [reportLoading, setReportLoading] = useState(false)
      const startedRef = useRef(false)

      const refreshStats = useCallback(async () => {
        try {
          const s = await api('/state')
          setStats(s)
        } catch {
          /* ignore */
        }
      }, [])

      const loadNext = useCallback(
        async (mode) => {
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
        },
        [],
      )

      const refreshReport = useCallback(async () => {
        setReportLoading(true)
        try {
          const r = await api('/report')
          setReport(r)
        } catch (e) {
          setError(e.message || '报告加载失败')
        } finally {
          setReportLoading(false)
        }
      }, [])

      useEffect(() => {
        refreshStats()
      }, [refreshStats])

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
          if (res.summary) setStats(res.summary)
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

      const skip = useCallback(() => {
        setFeedback(null)
        setCard(null)
        startedRef.current = false
        loadNext('new')
      }, [loadNext])

      const reviewMode = card && card.mode === 'review'

      return React.createElement(
        'div',
        { className: 'eg-root' },
        React.createElement(
          'button',
          { className: 'eg-pill', onClick: () => setOpen((v) => !v), title: 'English Gym — 中文造句练习' },
          React.createElement('span', { className: 'eg-dot' }),
          React.createElement('span', { className: 'eg-pill-title' }, 'English Gym'),
          stats ? React.createElement('span', { className: 'eg-chip' }, '连续 ' + stats.streakDays + ' 天') : null,
          stats && stats.reviewCount > 0
            ? React.createElement('span', { className: 'eg-chip warn' }, '待复习 ' + stats.reviewCount)
            : null,
          stats ? React.createElement('span', { className: 'eg-chip' }, stats.accuracy + '% 正确') : null,
          React.createElement('span', { className: 'eg-chev' }, open ? '▾' : '▸'),
        ),
        open
          ? React.createElement(
              'div',
              { className: 'eg-panel' },
              React.createElement(
                'div',
                { className: 'eg-head' },
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
                stats
                  ? React.createElement(
                      'div',
                      { className: 'eg-stats' },
                      React.createElement(StatChip, { label: '今日', value: stats.today.answered }),
                      React.createElement(StatChip, { label: '待复习', value: stats.reviewCount, warn: stats.reviewCount > 0 }),
                      React.createElement(StatChip, { label: '正确率', value: stats.accuracy + '%' }),
                    )
                  : null,
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
                      onSkip: skip,
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
            )
          : null,
      )
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('conversation.composer.dock', () =>
          ctx.slots.register(
            {
              name: 'conversation.composer.dock',
              id: 'dsh-english-gym',
              order: 20,
            },
            EnglishGymDock,
          ),
        )
      },
    }
  },
})
