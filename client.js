window.__ModuleLoader__.load({
  id: 'dsh-english-gym',
  factory(require) {
    const React = require('react')
    const { useState, useEffect, useRef, useCallback, useReducer } = React

    const API = '/api/english-gym'
    const STYLE_ID = 'eg-dock-style'
    const GEOM_KEY = 'eg-board-geom-v2'

    const CSS = `
/* Hallmark · component: english-gym panel · genre: editorial · theme: in-place (dsh tokens) · states: 8 · contrast: pass · v2.0.0
 * critique: the drill is a study desk — one sentence set in serif, one writing field, one action; feedback reads like a marked page.
 * waive: none
 */
.eg-root, .eg-panel {
  --eg-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  --eg-serif: "Songti SC", "Songti TC", "Georgia", "Times New Roman", serif;
  --eg-ink: var(--dsw-alias-label-primary, #1f2328);
  --eg-ink-2: var(--dsw-alias-label-secondary, #5a6069);
  --eg-bg: var(--dsw-alias-bg-layer-1, #ffffff);
  --eg-bg-2: var(--dsw-alias-bg-layer-2, rgba(23, 26, 31, .045));
  --eg-bg-3: rgba(23, 26, 31, .09);
  --eg-line: var(--dsw-alias-border-l1, rgba(23, 26, 31, .12));
  --eg-line-2: var(--dsw-alias-border-l2, rgba(23, 26, 31, .24));
  --eg-accent: var(--dsw-alias-brand-primary, #2f6fed);
  --eg-accent-ink: #1d54c4;
  --eg-on-accent: #ffffff;
  --eg-ok: var(--dsw-alias-state-success-primary, #1a7f37);
  --eg-bad: var(--dsw-alias-state-error-primary, #cf222e);
  --eg-warn: var(--dsw-alias-state-warn-primary, #bf8700);
  --eg-warn-strong: #7a5200;
  --eg-r: 16px;
  --eg-r-sm: 10px;
  --eg-shadow: 0 20px 56px rgba(17, 22, 31, .22), 0 2px 8px rgba(17, 22, 31, .08);
  --eg-dur: .16s;
  --eg-fs-xs: 12px; --eg-fs-sm: 13px; --eg-fs-md: 15px; --eg-fs-lg: 19px; --eg-fs-xl: 32px;
}
.eg-root { font: var(--eg-fs-sm)/1.5 var(--eg-font); color: var(--eg-ink); }
.eg-root *, .eg-panel * { box-sizing: border-box; }

/* ===== pill (composer strip) ===== */
.eg-pill {
  display: flex; align-items: center; gap: 9px; width: 100%;
  padding: 7px 10px; background: transparent; border: none; border-radius: 10px;
  color: var(--eg-ink-2); font-family: var(--eg-font); font-size: var(--eg-fs-sm); text-align: left; cursor: pointer;
  transition: background var(--eg-dur) ease;
}
.eg-pill:hover { background: var(--eg-bg-2); }
.eg-pill:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }
.eg-mono {
  width: 22px; height: 22px; border-radius: 7px; flex: 0 0 auto;
  background: var(--eg-accent); color: var(--eg-on-accent);
  display: flex; align-items: center; justify-content: center;
  font: 700 var(--eg-fs-xs)/1 var(--eg-font); letter-spacing: .02em;
}
.eg-wordmark { font-weight: 650; color: var(--eg-ink); letter-spacing: .01em; }
.eg-streak { color: var(--eg-ink-2); font-variant-numeric: tabular-nums; }
.eg-chip {
  display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; height: 20px; border-radius: 10px;
  background: var(--eg-bg-3); color: var(--eg-ink-2); font-size: var(--eg-fs-xs); font-variant-numeric: tabular-nums;
}
.eg-chip.warn { background: var(--eg-warn-strong); color: #fff; }
.eg-chev { margin-left: auto; opacity: .7; font-size: var(--eg-fs-xs); }

/* ===== panel ===== */
.eg-panel {
  position: fixed; z-index: 2147483000; pointer-events: auto;
  display: flex; flex-direction: column;
  background: var(--eg-bg); border: 1px solid var(--eg-line); border-radius: var(--eg-r);
  box-shadow: var(--eg-shadow); overflow: hidden;
  font: var(--eg-fs-sm)/1.5 var(--eg-font); color: var(--eg-ink);
  transform-origin: bottom center; animation: eg-pop .18s cubic-bezier(.2, .85, .25, 1);
}
@keyframes eg-pop { from { opacity: 0; transform: scale(.94) translateY(10px); } to { opacity: 1; transform: none; } }
.eg-head {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px 8px 12px;
  border-bottom: 1px solid var(--eg-line); flex: 0 0 auto; cursor: move; user-select: none; touch-action: none;
  background: var(--eg-bg); position: relative;
}
.eg-grip { color: var(--eg-ink-2); opacity: .9; font-size: var(--eg-fs-xs); letter-spacing: -2px; cursor: grab; }
.eg-tabs { display: flex; gap: 2px; margin-left: 2px; }
.eg-tab {
  position: relative; padding: 6px 9px; border: none; background: transparent; cursor: pointer;
  color: var(--eg-ink-2); font: 600 var(--eg-fs-sm)/1 var(--eg-font); border-radius: 7px; transition: color var(--eg-dur) ease;
}
.eg-tab:hover { color: var(--eg-ink); }
.eg-tab:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-tab.active { color: var(--eg-ink); }
.eg-tab.active::after {
  content: ""; position: absolute; left: 9px; right: 9px; bottom: -8px; height: 2px; border-radius: 2px; background: var(--eg-accent);
}
.eg-head-right { margin-left: auto; display: flex; align-items: center; gap: 6px; }
.eg-close {
  border: none; background: transparent; color: var(--eg-ink-2); cursor: pointer;
  width: 26px; height: 26px; border-radius: 7px; font-size: 14px; line-height: 1; display: flex; align-items: center; justify-content: center;
  transition: background var(--eg-dur) ease, color var(--eg-dur) ease;
}
.eg-close:hover { background: var(--eg-bg-2); color: var(--eg-ink); }
.eg-close:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-body { padding: 15px 15px 16px; overflow-y: auto; flex: 1 1 auto; display: flex; flex-direction: column; }
.eg-body > * { width: 100%; max-width: 620px; margin-left: auto; margin-right: auto; }

/* ===== drill ===== */
.eg-cap { display: flex; align-items: center; gap: 7px; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); font-weight: 600; }
.eg-cap::before { content: ""; width: 14px; height: 2px; border-radius: 2px; background: var(--eg-accent); }
.eg-zh {
  margin-top: 11px; font-family: var(--eg-serif); font-size: var(--eg-fs-lg); line-height: 1.55; font-weight: 600;
  letter-spacing: .01em; color: var(--eg-ink); overflow-wrap: break-word;
}
.eg-hintbtn {
  margin-top: 11px; display: inline-flex; align-items: center; gap: 5px; min-height: 26px; padding: 4px 10px;
  border: 1px solid var(--eg-line); background: var(--eg-bg); border-radius: 999px;
  color: var(--eg-ink-2); font: 600 var(--eg-fs-xs)/1 var(--eg-font); cursor: pointer; transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease;
}
.eg-hintbtn:hover { border-color: var(--eg-line-2); color: var(--eg-ink); }
.eg-hintbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-hintbtn .caret { transition: transform var(--eg-dur) ease; }
.eg-hintbox {
  margin-top: 9px; padding: 9px 11px; border-left: 2px solid var(--eg-accent); border-radius: 0 8px 8px 0;
  background: var(--eg-bg-2); color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.6;
}
.eg-inputwrap { position: relative; margin-top: 13px; }
.eg-input {
  width: 100%; min-height: 86px; resize: vertical; padding: 11px 12px;
  border: 1px solid var(--eg-line); border-radius: var(--eg-r-sm);
  background: var(--eg-bg-2); color: var(--eg-ink);
  font: var(--eg-fs-md)/1.55 var(--eg-font); outline: none;
  transition: border-color var(--eg-dur) ease, box-shadow var(--eg-dur) ease, background var(--eg-dur) ease;
}
.eg-input::placeholder { color: var(--eg-ink-2); opacity: .85; }
.eg-input:hover { border-color: var(--eg-line-2); }
.eg-input:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 18%, transparent); }
.eg-input.error { border-color: var(--eg-bad); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-bad) 15%, transparent); }
.eg-foot { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
.eg-foot .eg-kbd { margin-left: auto; }
.eg-err { color: var(--eg-bad); font-size: var(--eg-fs-xs); margin-top: 8px; }
.eg-kbd { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); white-space: nowrap; }
.eg-kbd kbd {
  font: 600 12px/1 var(--eg-font); padding: 2px 5px; border: 1px solid var(--eg-line); border-bottom-width: 2px;
  border-radius: 4px; background: var(--eg-bg); color: var(--eg-ink-2);
}
.eg-actions { display: flex; gap: 8px; margin-top: 11px; }
.eg-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  min-height: 36px; padding: 0 15px; border-radius: 9px; cursor: pointer;
  font: 600 var(--eg-fs-sm)/1 var(--eg-font); transition: background var(--eg-dur) ease, filter var(--eg-dur) ease, border-color var(--eg-dur) ease;
  border: 1px solid var(--eg-line-2); background: var(--eg-bg); color: var(--eg-ink);
}
.eg-btn:hover { background: var(--eg-bg-2); }
.eg-btn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }
.eg-btn:active { transform: translateY(1px); }
.eg-btn.primary { border-color: transparent; background: var(--eg-accent); color: var(--eg-on-accent); }
.eg-btn.primary:hover { filter: brightness(1.06); }
.eg-btn:disabled { opacity: .5; cursor: default; pointer-events: none; }
.eg-btn.primary.is-loading { color: transparent; position: relative; }
.eg-btn.primary.is-loading::after {
  content: ""; position: absolute; width: 15px; height: 15px; border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, .5); border-top-color: #fff; animation: eg-spin .7s linear infinite;
}
.eg-btn.ghost { border-color: transparent; background: transparent; color: var(--eg-ink-2); padding: 0 10px; }
.eg-btn.ghost:hover { background: var(--eg-bg-2); color: var(--eg-ink); }

/* ===== feedback ===== */
.eg-fb { margin-top: 4px; border-radius: 12px; padding: 14px; border: 1px solid transparent; }
.eg-fb.ok { background: color-mix(in srgb, var(--eg-ok) 8%, transparent); border-color: color-mix(in srgb, var(--eg-ok) 30%, transparent); }
.eg-fb.bad { background: color-mix(in srgb, var(--eg-bad) 7%, transparent); border-color: color-mix(in srgb, var(--eg-bad) 28%, transparent); }
.eg-fb-top { display: flex; align-items: baseline; gap: 9px; }
.eg-score { font: 700 var(--eg-fs-xl)/1 var(--eg-font); font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
.eg-fb.ok .eg-score { color: var(--eg-ok); }
.eg-fb.bad .eg-score { color: var(--eg-bad); }
.eg-score small { font-size: var(--eg-fs-xs); font-weight: 700; opacity: 1; color: inherit; margin-left: 1px; }
.eg-fb-status { font-weight: 700; font-size: var(--eg-fs-md); }
.eg-fb.ok .eg-fb-status { color: var(--eg-ok); }
.eg-fb.bad .eg-fb-status { color: var(--eg-bad); }
.eg-fb-ref {
  margin-top: 11px; padding: 10px 12px; border-radius: 9px; background: var(--eg-bg);
  border: 1px solid var(--eg-line); font-family: var(--eg-serif); font-size: var(--eg-fs-md); line-height: 1.6; color: var(--eg-ink); overflow-wrap: break-word;
}
.eg-fb-ref .lbl { display: block; font: 600 var(--eg-fs-xs)/1 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em; margin-bottom: 5px; }
.eg-fb-tip { margin-top: 10px; color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.6; display: flex; gap: 6px; align-items: flex-start; }
.eg-fb-tip .b { color: var(--eg-accent-ink); font-weight: 700; white-space: nowrap; flex: 0 0 auto; }
.eg-fb-actions { margin-top: 13px; display: flex; gap: 8px; }

/* ===== report ===== */
.eg-report .r-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.eg-rtitle { font-family: var(--eg-serif); font-size: var(--eg-fs-lg); line-height: 1.35; font-weight: 700; margin: 0; overflow-wrap: break-word; min-width: 0; }
.eg-rmeta { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); margin-top: 6px; font-variant-numeric: tabular-nums; }
.eg-rsum { margin: 12px 0 0; padding: 11px 12px; border-radius: 10px; background: var(--eg-bg-2); color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.7; }
.eg-rp { margin: 13px 0 0; font-size: var(--eg-fs-md); line-height: 1.85; color: var(--eg-ink); }
.eg-practice { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--eg-line); }
.eg-ptitle { display: flex; align-items: center; gap: 7px; font-size: var(--eg-fs-sm); font-weight: 700; color: var(--eg-ink); }
.eg-q { margin-top: 10px; padding: 11px 12px; border-radius: 10px; background: var(--eg-bg-2); }
.eg-q-head { display: flex; gap: 8px; align-items: baseline; }
.eg-q-n { font: 700 var(--eg-fs-sm)/1.4 var(--eg-font); color: var(--eg-accent-ink); font-variant-numeric: tabular-nums; flex: 0 0 auto; }
.eg-q-zh { font-size: var(--eg-fs-sm); line-height: 1.6; }
.eg-q-en { display: none; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--eg-line); font-family: var(--eg-serif); font-size: var(--eg-fs-md); color: var(--eg-ink); }
.eg-q.reveal .eg-q-en { display: block; }
.eg-q-toggle { margin-top: 7px; display: inline-flex; align-items: center; min-height: 24px; padding: 4px 0; background: none; border: none; color: var(--eg-accent-ink); cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font); }
.eg-q-toggle:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; border-radius: 4px; }

/* ===== misc ===== */
.eg-loading { display: flex; align-items: center; gap: 9px; color: var(--eg-ink-2); padding: 10px 0; font-size: var(--eg-fs-sm); }
.eg-spin { display: inline-block; width: 15px; height: 15px; border: 2px solid var(--eg-line-2); border-top-color: var(--eg-accent); border-radius: 50%; animation: eg-spin .7s linear infinite; }
@keyframes eg-spin { to { transform: rotate(360deg); } }
.eg-resize { position: absolute; right: 0; bottom: 0; width: 18px; height: 18px; cursor: nwse-resize; touch-action: none; }
.eg-resize::after { content: ""; position: absolute; right: 4px; bottom: 4px; width: 9px; height: 9px; border-right: 2px solid var(--eg-line-2); border-bottom: 2px solid var(--eg-line-2); border-bottom-right-radius: 3px; opacity: .7; }
/* ===== word training ===== */
.eg-letters { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
.eg-letter {
  width: 34px; height: 44px; padding: 0; text-align: center;
  border: none; border-bottom: 2px solid var(--eg-line-2); border-radius: 7px 7px 0 0;
  background: var(--eg-bg-2); color: var(--eg-ink);
  font: 600 var(--eg-fs-lg)/1 var(--eg-font); text-transform: lowercase; outline: none;
  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, color var(--eg-dur) ease;
}
.eg-letter:hover { border-bottom-color: var(--eg-line-2); }
.eg-letter:focus { border-bottom-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }
.eg-letter.ok { border-bottom-color: var(--eg-ok); color: var(--eg-ok); }
.eg-letter.bad { border-bottom-color: var(--eg-bad); color: var(--eg-bad); }
.eg-letters.answered .eg-letter { cursor: default; }
.eg-lettercount { margin-top: 11px; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); }
/* word training: centred column */
.eg-word { max-width: 520px; min-height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.eg-word .eg-cap { justify-content: center; }
.eg-word .eg-letters { justify-content: center; }
.eg-word .eg-foot { justify-content: center; width: 100%; }
.eg-word .eg-foot .eg-kbd { margin-left: 0; }
.eg-word .eg-fb { width: 100%; text-align: left; }
/* phrase drill: centred column */
.eg-drill { max-width: 520px; min-height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.eg-drill .eg-cap { justify-content: center; }
.eg-drill .eg-foot { justify-content: center; width: 100%; }
.eg-drill .eg-foot .eg-kbd { margin-left: 0; }
.eg-drill .eg-inputwrap { width: 100%; }
.eg-drill .eg-input { text-align: left; }
.eg-drill .eg-hintbox { text-align: left; }
.eg-drill .eg-fb { width: 100%; text-align: left; }

@media (prefers-reduced-motion: reduce) { .eg-panel { animation: none; } .eg-root *, .eg-panel * { transition: none !important; } }
`

    function useStyle() {
      useEffect(() => {
        const existing = document.getElementById(STYLE_ID)
        if (existing) {
          // Refresh in place so live edits / HMR updates take effect without a reload.
          if (existing.textContent !== CSS) existing.textContent = CSS
          return
        }
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

    // Default placement: sit just above the "English Gym" pill, horizontally
    // centred on it. Falls back to bottom-centre when the pill isn't mounted.
    function pillAnchorGeom() {
      const vw = window.innerWidth || 1200
      const vh = window.innerHeight || 800
      const w = 300
      const h = 320
      let cx = vw / 2
      let bottom = vh - 120
      try {
        const pill = document.querySelector('.eg-pill')
        if (pill) {
          const r = pill.getBoundingClientRect()
          if (r && r.width) {
            cx = r.left + r.width / 2
            bottom = r.top - 10
          }
        }
      } catch {
        /* ignore */
      }
      return fitGeom({ w, h, x: Math.round(cx - w / 2), y: Math.round(bottom - h) })
    }

    function Drill({ card, answer, setAnswer, feedback, busy, error, onSubmit, onNext }) {
      const [hintOpen, setHintOpen] = useState(false)

      if (feedback) {
        const ok = !!feedback.correct
        return React.createElement(
          'div',
          { className: 'eg-fb ' + (ok ? 'ok' : 'bad') },
          React.createElement(
            'div',
            { className: 'eg-fb-top' },
            React.createElement('span', { className: 'eg-score' }, feedback.score, React.createElement('small', null, '分')),
            React.createElement('span', { className: 'eg-fb-status' }, ok ? '很好' : '再试一次'),
          ),
          React.createElement(
            'div',
            { className: 'eg-fb-ref' },
            React.createElement('span', { className: 'lbl' }, '参考'),
            feedback.reference || '—',
          ),
          feedback.tip
            ? React.createElement(
                'div',
                { className: 'eg-fb-tip' },
                React.createElement('span', { className: 'b' }, '提示'),
                React.createElement('span', null, feedback.tip),
              )
            : null,
          React.createElement(
            'div',
            { className: 'eg-fb-actions' },
            React.createElement('button', { className: 'eg-btn primary', onClick: onNext, disabled: busy }, '下一题 →'),
          ),
        )
      }

      if (!card) {
        if (error) {
          return React.createElement(
            'div',
            null,
            React.createElement('div', { className: 'eg-err' }, error),
            React.createElement(
              'div',
              { className: 'eg-foot' },
              React.createElement('button', { className: 'eg-btn primary', onClick: onNext, disabled: busy }, '重试'),
            ),
          )
        }
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
        React.createElement('div', { className: 'eg-cap' }, '把这句话译成英文'),
        React.createElement('div', { className: 'eg-zh' }, card.zh),
        card.hint
          ? React.createElement(
              'button',
              {
                className: 'eg-hintbtn',
                'aria-expanded': hintOpen ? 'true' : 'false',
                onClick: () => setHintOpen((v) => !v),
                type: 'button',
              },
              React.createElement('span', { className: 'caret', 'aria-hidden': 'true' }, hintOpen ? '▾' : '▸'),
              '提示',
            )
          : null,
        card.hint && hintOpen ? React.createElement('div', { className: 'eg-hintbox' }, card.hint) : null,
        React.createElement(
          'div',
          { className: 'eg-inputwrap' },
          React.createElement('textarea', {
            className: 'eg-input' + (error ? ' error' : ''),
            value: answer,
            placeholder: '在这里写下你的英文…',
            onChange: (e) => setAnswer(e.target.value),
            onKeyDown: (e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onSubmit()
              }
            },
          }),
        ),
        error ? React.createElement('div', { className: 'eg-err' }, error) : null,
        React.createElement(
          'div',
          { className: 'eg-foot' },
          React.createElement(
            'button',
            {
              className: 'eg-btn primary' + (busy ? ' is-loading' : ''),
              onClick: onSubmit,
              disabled: busy || !answer.trim(),
            },
            '提交',
          ),
          React.createElement('button', { className: 'eg-btn ghost', onClick: onNext, disabled: busy }, '换一题'),
          React.createElement(
            'span',
            { className: 'eg-kbd', title: '⌘/Ctrl + Enter 提交' },
            React.createElement('kbd', null, '⌘'),
            ' ',
            React.createElement('kbd', null, '↵'),
          ),
        ),
      )
    }

    function Report({ report, loading, error, onRefresh }) {
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
          null,
          React.createElement(
            'div',
            { className: 'eg-loading' },
            error ? React.createElement('span', { className: 'eg-err' }, error) : '暂无报告。',
          ),
          React.createElement(
            'div',
            { className: 'eg-actions' },
            React.createElement('button', { className: 'eg-btn primary', onClick: onRefresh }, '生成今日报告'),
          ),
        )
      }
      const paragraphs = String(report.body || '').split(/\n{2,}/).filter(Boolean)
      const questions = report.questions || []
      return React.createElement(
        'div',
        { className: 'eg-report' },
        React.createElement('div', { className: 'r-top' }, React.createElement('h2', { className: 'eg-rtitle' }, report.title || 'Daily Report')),
        React.createElement('div', { className: 'eg-rmeta' }, [report.date, report.level].filter(Boolean).join(' · ')),
        report.summary_zh ? React.createElement('p', { className: 'eg-rsum' }, report.summary_zh) : null,
        paragraphs.map((p, i) => React.createElement('p', { key: i, className: 'eg-rp' }, p)),
        questions.length
          ? React.createElement(
              'div',
              { className: 'eg-practice' },
              React.createElement('div', { className: 'eg-ptitle' }, '练一练'),
              questions.map((q, i) =>
                React.createElement(
                  'div',
                  { key: i, className: 'eg-q' },
                  React.createElement(
                    'div',
                    { className: 'eg-q-head' },
                    React.createElement('span', { className: 'eg-q-n' }, String(i + 1)),
                    React.createElement('span', { className: 'eg-q-zh' }, q.zh),
                  ),
                  React.createElement(
                    'button',
                    {
                      className: 'eg-q-toggle',
                      type: 'button',
                      onClick: (e) => {
                        const box = e.currentTarget.parentElement
                        box.classList.toggle('reveal')
                        e.currentTarget.textContent = box.classList.contains('reveal') ? '收起参考' : '看参考'
                      },
                    },
                    '看参考',
                  ),
                  React.createElement('div', { className: 'eg-q-en' }, q.en),
                ),
              ),
            )
          : null,
        React.createElement(
          'div',
          { className: 'eg-actions' },
          React.createElement('button', { className: 'eg-btn ghost', onClick: onRefresh, disabled: loading }, loading ? '生成中…' : '换一篇'),
        ),
      )
    }

    // Static word bank drill: Chinese gloss + one underline per letter.
    function WordPractice() {
      const [item, setItem] = useState(null)
      const [cells, setCells] = useState([])
      const [res, setRes] = useState(null)
      const [busy, setBusy] = useState(false)
      const [error, setError] = useState('')
      const refs = useRef([])
      const inFlight = useRef(false)

      const load = useCallback(async () => {
        if (inFlight.current) return
        inFlight.current = true
        setBusy(true)
        setError('')
        setRes(null)
        try {
          const data = await api('/word/next', { method: 'POST', body: '{}' })
          setItem(data)
          setCells(new Array(Math.max(0, data.letters || 0)).fill(''))
          setTimeout(() => {
            try {
              if (refs.current[0]) refs.current[0].focus()
            } catch {
              /* ignore */
            }
          }, 0)
        } catch (e) {
          setError(e.message || '出题失败')
        } finally {
          inFlight.current = false
          setBusy(false)
        }
      }, [])

      useEffect(() => {
        load()
      }, [load])

      const submit = useCallback(async () => {
        if (!item || busy || res) return
        if (cells.some((c) => !c)) return
        setBusy(true)
        setError('')
        try {
          const r = await api('/word/check', {
            method: 'POST',
            body: JSON.stringify({ id: item.id, answer: cells.join('') }),
          })
          setRes(r)
          if (r.summary) store.setStats(r.summary)
        } catch (e) {
          setError(e.message || '判分失败')
        } finally {
          setBusy(false)
        }
      }, [item, cells, busy, res])

      const setCell = (i, v) => {
        const ch = String(v || '').replace(/[^a-zA-Z]/g, '').slice(-1)
        setCells((prev) => {
          const next = prev.slice()
          next[i] = ch
          return next
        })
        if (ch && i < cells.length - 1) {
          setTimeout(() => {
            try {
              if (refs.current[i + 1]) refs.current[i + 1].focus()
            } catch {
              /* ignore */
            }
          }, 0)
        }
      }

      const onKey = (i, e) => {
        if (e.key === 'Backspace' && !cells[i] && i > 0) {
          e.preventDefault()
          setCells((prev) => {
            const next = prev.slice()
            next[i - 1] = ''
            return next
          })
          try {
            if (refs.current[i - 1]) refs.current[i - 1].focus()
          } catch {
            /* ignore */
          }
        } else if (e.key === 'ArrowLeft' && i > 0) {
          try {
            if (refs.current[i - 1]) refs.current[i - 1].focus()
          } catch {
            /* ignore */
          }
        } else if (e.key === 'ArrowRight' && i < cells.length - 1) {
          try {
            if (refs.current[i + 1]) refs.current[i + 1].focus()
          } catch {
            /* ignore */
          }
        } else if (e.key === 'Enter') {
          e.preventDefault()
          submit()
        }
      }

      if (!item) {
        return React.createElement(
          'div',
          null,
          error
            ? React.createElement('div', { className: 'eg-err' }, error)
            : React.createElement(
                'div',
                { className: 'eg-loading' },
                React.createElement('span', { className: 'eg-spin' }),
                '正在取词…',
              ),
          error
            ? React.createElement(
                'div',
                { className: 'eg-foot' },
                React.createElement('button', { className: 'eg-btn primary', onClick: load, disabled: busy }, '重试'),
              )
            : null,
        )
      }

      const answered = !!res
      const ok = answered && !!res.correct
      const target = String((res && res.reference) || '').toLowerCase()
      const cellsNodes = cells.map((ch, i) => {
        let cls = 'eg-letter'
        if (answered) cls += target[i] === String(ch).toLowerCase() ? ' ok' : ' bad'
        return React.createElement('input', {
          key: i,
          ref: (el) => {
            refs.current[i] = el
          },
          className: cls,
          value: answered ? ch || target[i] || '' : ch,
          style: { width: cells.length > 12 ? 24 : cells.length > 8 ? 29 : 34 },
          maxLength: 1,
          inputMode: 'text',
          autoCapitalize: 'off',
          autoComplete: 'off',
          autoCorrect: 'off',
          spellCheck: false,
          disabled: answered || busy,
          'aria-label': '第 ' + (i + 1) + ' 个字母',
          onChange: (e) => setCell(i, e.target.value),
          onKeyDown: (e) => onKey(i, e),
        })
      })

      return React.createElement(
        'div',
        { className: 'eg-word' },
        React.createElement('div', { className: 'eg-cap' }, '看中文，拼出下面的英文单词'),
        React.createElement('div', { className: 'eg-zh' }, item.zh),
        React.createElement('div', { className: 'eg-letters' + (answered ? ' answered' : '') }, cellsNodes),
        React.createElement('div', { className: 'eg-lettercount' }, item.letters + ' 个字母'),
        error ? React.createElement('div', { className: 'eg-err' }, error) : null,
        answered
          ? React.createElement(
              'div',
              { className: 'eg-fb ' + (ok ? 'ok' : 'bad') },
              React.createElement(
                'div',
                { className: 'eg-fb-top' },
                React.createElement('span', { className: 'eg-fb-status' }, ok ? '拼对了' : '再试一次'),
              ),
              React.createElement(
                'div',
                { className: 'eg-fb-ref' },
                React.createElement('span', { className: 'lbl' }, '正确拼写'),
                res.reference,
              ),
              React.createElement(
                'div',
                { className: 'eg-fb-actions' },
                React.createElement('button', { className: 'eg-btn primary', onClick: load, disabled: busy }, '下一个 →'),
              ),
            )
          : React.createElement(
              'div',
              { className: 'eg-foot' },
              React.createElement(
                'button',
                {
                  className: 'eg-btn primary' + (busy ? ' is-loading' : ''),
                  onClick: submit,
                  disabled: busy || cells.some((c) => !c),
                },
                '提交',
              ),
              React.createElement('button', { className: 'eg-btn ghost', onClick: load, disabled: busy }, '换一个'),
              React.createElement(
                'span',
                { className: 'eg-kbd', title: '回车提交' },
                React.createElement('kbd', null, '↵'),
              ),
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
            title: 'English Gym — 短语造句 + 单词拼写',
            'aria-expanded': shared.open ? 'true' : 'false',
          },
          React.createElement('span', { className: 'eg-mono' }, 'EN'),
          React.createElement('span', { className: 'eg-wordmark' }, 'English Gym'),
          stats && stats.streakDays > 0
            ? React.createElement('span', { className: 'eg-streak' }, '连续 ' + stats.streakDays + ' 天')
            : null,
          stats && stats.reviewCount > 0
            ? React.createElement('span', { className: 'eg-chip warn' }, '待复习 ' + stats.reviewCount)
            : null,
          React.createElement('span', { className: 'eg-chev', 'aria-hidden': 'true' }, shared.open ? '▾' : '▸'),
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
        return pillAnchorGeom()
      })
      const geomRef = useRef(geom)
      useEffect(() => {
        geomRef.current = geom
      }, [geom])

      const open = shared.open

      // Position just above the pill the first time it opens (unless the user
      // has already dragged it and we have a remembered geometry).
      const anchoredRef = useRef(false)
      useEffect(() => {
        if (open && !anchoredRef.current) {
          anchoredRef.current = true
          if (!loadGeom()) setGeom(pillAnchorGeom())
        }
      }, [open])

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
        if (
          t &&
          t.closest &&
          t.closest('button, textarea, input, select, a, summary, [contenteditable="true"], .eg-resize')
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
        const x = clamp(d.g0.x + (e.clientX - d.sx), 0, window.innerWidth - d.g0.w)
        const y = clamp(d.g0.y + (e.clientY - d.sy), 0, window.innerHeight - 44)
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
        const maxW = window.innerWidth - d.g0.x - 8
        const maxH = window.innerHeight - d.g0.y - 8
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

      const inFlightRef = useRef(false)
      const loadNext = useCallback(async (mode) => {
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
            body: JSON.stringify({ mode: mode || 'new' }),
          })
          setCard(data)
          setAnswer('')
          setFeedback(null)
        } catch (e) {
          setError(e.message || '出题失败')
        } finally {
          inFlightRef.current = false
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
        // Keep startedRef true so the auto-load effect does NOT fire a second
        // /next on top of the one we start here (that double-fetch made the
        // previous wording flash in for a moment).
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
          onPointerDown: onPanelDown,
          onPointerMove: onPanelMove,
          onPointerUp: onPanelUp,
          onPointerCancel: onPanelUp,
        },
        React.createElement(
          'div',
          { className: 'eg-head' },
          React.createElement('span', { className: 'eg-grip', 'aria-hidden': 'true' }, '⠿'),
          React.createElement(
            'div',
            { className: 'eg-tabs' },
            React.createElement(
              'button',
              { className: 'eg-tab' + (tab === 'drill' ? ' active' : ''), onClick: () => setTab('drill') },
              '短语训练',
            ),
            React.createElement(
              'button',
              { className: 'eg-tab' + (tab === 'word' ? ' active' : ''), onClick: () => setTab('word') },
              '单词训练',
            ),
            React.createElement(
              'button',
              { className: 'eg-tab' + (tab === 'report' ? ' active' : ''), onClick: () => setTab('report') },
              '今日报告',
            ),
          ),
          React.createElement(
            'div',
            { className: 'eg-head-right' },
            React.createElement('button', { className: 'eg-close', onClick: () => store.setOpen(false), title: '收起' }, '✕'),
          ),
        ),
        React.createElement(
          'div',
          { className: 'eg-body' },
          tab === 'drill'
            ? React.createElement(
                'div',
                { className: 'eg-drill' },
                React.createElement(Drill, {
                  key: card ? card.id : feedback ? 'fb' : 'loading',
                  card,
                  answer,
                  setAnswer,
                  feedback,
                  busy,
                  error,
                  onSubmit: submit,
                  onNext: next,
                }),
              )
            : tab === 'word'
              ? React.createElement(WordPractice, { key: 'word' })
              : React.createElement(Report, {
                report,
                loading: reportLoading,
                error,
                onRefresh: () => {
                  setReport(null)
                  refreshReport()
                },
              }),
        ),
        React.createElement('div', {
          className: 'eg-resize',
          onPointerDown: onResizeDown,
          onPointerMove: onResizeMove,
          onPointerUp: onResizeUp,
          onPointerCancel: onResizeUp,
          title: '拖动缩放',
        }),
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
