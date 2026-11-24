window.__ModuleLoader__.load({
  id: 'dsh-english-gym',
  factory(require) {
    const React = require('react')
    const { useState, useEffect, useRef, useCallback, useReducer } = React
    const h = React.createElement

    const API = '/api/english-gym'
    const STYLE_ID = 'eg-dock-style'
    const GEOM_KEY = 'eg-board-geom-v3'

    const POS_LABELS = {
      n: '名词', v: '动词', adj: '形容词', adv: '副词', prep: '介词', pron: '代词',
      conj: '连词', num: '数词', art: '冠词', aux: '助动词', int: '感叹词',
    }
    function formatPos(pos) {
      const parts = String(pos || '')
        .toLowerCase()
        .split(/[\/,&\s]+/)
        .map((p) => p.replace(/\.+$/, ''))
        .filter(Boolean)
        .map((p) => (p === 'vt' || p === 'vi' ? 'v' : p))
      const unique = [...new Set(parts)]
      if (!unique.length) return ''
      return unique.map((p) => (POS_LABELS[p] ? POS_LABELS[p] + ' ' + p + '.' : p)).join(' / ')
    }

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
  --eg-confetti-1: var(--eg-accent); --eg-confetti-2: var(--eg-bad); --eg-confetti-3: var(--eg-ok);
  --eg-confetti-4: var(--eg-warn); --eg-confetti-5: #c9407e; --eg-confetti-6: #1b7c83;
}
.eg-root { font: var(--eg-fs-sm)/1.5 var(--eg-font); color: var(--eg-ink); }
/* place the composer-strip pill at the far right of the dock row (after the context meter) */
.eg-root.eg-entry { order: 999; flex: 0 0 auto; }
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
.eg-chip.warn { background: var(--eg-warn-strong); color: var(--eg-on-accent); }
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
  display: flex; align-items: center; gap: 10px; padding: 10px 12px 10px 14px;
  border-bottom: 1px solid var(--eg-line); flex: 0 0 auto; cursor: move; user-select: none; touch-action: none;
  background: var(--eg-bg); position: relative;
}
.eg-grip { color: var(--eg-ink-2); opacity: .9; font-size: var(--eg-fs-xs); letter-spacing: -2px; cursor: grab; }
.eg-tabs { display: flex; flex-wrap: nowrap; gap: 2px; margin-left: 2px; min-width: 0; }
.eg-tab {
  position: relative; padding: 8px 10px; border: none; background: transparent; cursor: pointer; white-space: nowrap;
  color: var(--eg-ink-2); font: 600 var(--eg-fs-sm)/1 var(--eg-font); border-radius: 7px; transition: color var(--eg-dur) ease;
}
.eg-tab:hover { color: var(--eg-ink); }
.eg-tab:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-tab.active { color: var(--eg-ink); }
.eg-tab.active::after {
  content: ""; position: absolute; left: 12px; right: 12px; bottom: -10px; height: 2px; border-radius: 2px; background: var(--eg-accent);
}
.eg-head-right { margin-left: auto; display: flex; align-items: center; gap: 6px; }
.eg-close { appearance: none; -webkit-appearance: none;
  border: none; background: transparent; color: var(--eg-ink-2); cursor: pointer;
  width: 26px; height: 26px; border-radius: 7px; font-size: 14px; line-height: 1; display: flex; align-items: center; justify-content: center;
  transition: background var(--eg-dur) ease, color var(--eg-dur) ease;
}
.eg-close:hover { background: var(--eg-bg-2); color: var(--eg-ink); }
.eg-close:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-body { padding: 22px 24px 24px; overflow-y: auto; flex: 1 1 auto; display: flex; flex-direction: column; }
.eg-body > * { width: 100%; max-width: 640px; margin-left: auto; margin-right: auto; }

/* ===== drill ===== */
.eg-cap { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); font-weight: 600; letter-spacing: .01em; }
.eg-zh {
  margin-top: 16px; font-family: var(--eg-serif); font-size: var(--eg-fs-lg); line-height: 1.6; font-weight: 600;
  letter-spacing: .01em; color: var(--eg-ink); overflow-wrap: break-word;
}
.eg-hintbtn { appearance: none; -webkit-appearance: none;
  margin-top: 14px; display: inline-flex; align-items: center; gap: 5px; min-height: 30px; padding: 5px 10px;
  border: 1px solid var(--eg-line); background: var(--eg-bg); border-radius: var(--eg-r-sm);
  color: var(--eg-ink-2); font: 600 var(--eg-fs-sm)/1 var(--eg-font); cursor: pointer; transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease;
}
.eg-hintbtn:hover { border-color: var(--eg-line-2); color: var(--eg-ink); }
.eg-hintbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-hintbtn .caret { transition: transform var(--eg-dur) ease; }
.eg-hintbox {
  margin-top: 8px; padding: 2px 6px; border: none; border-radius: 8px;
  background: transparent; color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.6;
  text-align: center; opacity: .88;
  transform-origin: top center; animation: eg-hint-in .22s cubic-bezier(.2,.8,.25,1) both;
}
@keyframes eg-hint-in {
  from { opacity: 0; transform: translateY(-5px); }
  to   { opacity: 1; transform: translateY(0); }
}
.eg-inputwrap { position: relative; margin-top: 20px; }
.eg-input {
  width: 100%; min-height: 96px; resize: vertical; padding: 12px 14px;
  border: 1px solid var(--eg-line); border-radius: var(--eg-r-sm);
  background: var(--eg-bg-2); color: var(--eg-ink);
  font: var(--eg-fs-md)/1.55 var(--eg-font); outline: none;
  transition: border-color var(--eg-dur) ease, box-shadow var(--eg-dur) ease, background var(--eg-dur) ease;
}
.eg-input::placeholder { color: var(--eg-ink-2); opacity: .85; }
.eg-input:hover { border-color: var(--eg-line-2); }
.eg-input:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 18%, transparent); }
.eg-input.error { border-color: var(--eg-bad); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-bad) 15%, transparent); }
.eg-foot { display: flex; align-items: center; gap: 12px; margin-top: 18px; }
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
  min-height: 36px; min-width: 76px; padding: 0 15px; border-radius: var(--eg-r-sm); cursor: pointer;
  appearance: none; -webkit-appearance: none;
  font: 600 var(--eg-fs-sm)/1 var(--eg-font); transition: background var(--eg-dur) ease, filter var(--eg-dur) ease, border-color var(--eg-dur) ease, transform .28s cubic-bezier(.34, 1.56, .64, 1);
  border: 1px solid var(--eg-line-2); background: var(--eg-bg); color: var(--eg-ink);
}
.eg-btn:hover { background: var(--eg-bg-2); }
.eg-btn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }
.eg-btn:active { transform: scale(.92); transition-duration: .06s; }
.eg-btn.is-bouncing { animation: eg-btn-bounce .34s cubic-bezier(.34, 1.56, .64, 1); }
@keyframes eg-btn-bounce {
  0% { transform: scale(.92); }
  55% { transform: scale(1.04); }
  100% { transform: scale(1); }
}
.eg-btn.primary { border-color: transparent; background: var(--eg-accent); color: var(--eg-on-accent); }
.eg-btn.primary:hover { filter: brightness(1.06); }
.eg-btn:disabled { opacity: .5; cursor: not-allowed; pointer-events: none; }
.eg-btn.primary:disabled { background: var(--eg-accent); color: var(--eg-on-accent); border-color: transparent; }
.eg-btn:not(.primary):disabled { background: var(--eg-bg-2); color: var(--eg-ink-2); border-color: var(--eg-line); }
.eg-btn.primary.is-loading { color: transparent; position: relative; }
.eg-btn.primary.is-loading::after {
  content: ""; position: absolute; width: 15px; height: 15px; border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, .5); border-top-color: #fff; animation: eg-spin .7s linear infinite;
}
.eg-btn.ghost { border-color: transparent; background: transparent; color: var(--eg-ink-2); padding: 0 10px; }
.eg-btn.ghost:hover { background: var(--eg-bg-2); color: var(--eg-ink); }

/* ===== confetti ===== */
.eg-confetti { position: absolute; inset: 0; z-index: 6; pointer-events: none; overflow: hidden; border-radius: inherit; }
.eg-confetti-piece {
  position: absolute; display: block; border-radius: 1.5px; opacity: 0;
  transform: translate(-50%, -50%) rotate(var(--r0, 0deg));
  animation: eg-confetti-fly var(--dur, 900ms) cubic-bezier(.15, .7, .3, 1) var(--delay, 0ms) forwards;
  will-change: transform, opacity;
}
@keyframes eg-confetti-fly {
  0%   { opacity: 1; transform: translate(-50%, -50%) rotate(var(--r0, 0deg)) scale(.65); }
  18%  { opacity: 1; }
  100% { opacity: 0; transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, 0px))) rotate(calc(var(--r0, 0deg) + var(--rot, 360deg))) scale(1); }
}
@media (prefers-reduced-motion: reduce) { .eg-confetti { display: none; } }

/* ===== feedback ===== */
.eg-fb { margin-top: 28px; padding: 18px 0 0; border: none; border-top: 2px solid var(--eg-line); border-radius: 0; background: transparent; }
.eg-fb.ok { border-top-color: color-mix(in srgb, var(--eg-ok) 55%, var(--eg-line)); }
.eg-fb.bad { border-top-color: color-mix(in srgb, var(--eg-bad) 55%, var(--eg-line)); }
.eg-fb-top { display: flex; align-items: baseline; gap: 10px; }
.eg-score { font: 700 var(--eg-fs-xl)/1 var(--eg-font); font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
.eg-fb.ok .eg-score { color: var(--eg-ok); }
.eg-fb.bad .eg-score { color: var(--eg-bad); }
.eg-score small { font-size: var(--eg-fs-xs); font-weight: 700; opacity: 1; color: inherit; margin-left: 1px; }
.eg-fb-status { font-weight: 650; font-size: var(--eg-fs-lg); }
.eg-fb.ok .eg-fb-status { color: var(--eg-ok); }
.eg-fb.bad .eg-fb-status { color: var(--eg-bad); }
.eg-fb-ref {
  margin-top: 14px; padding: 0; border: none; border-radius: 0; background: transparent;
  font-family: var(--eg-serif); font-size: var(--eg-fs-lg); line-height: 1.65; color: var(--eg-ink); overflow-wrap: break-word;
}
.eg-fb-ref .lbl { display: block; font: 600 var(--eg-fs-xs)/1 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em; margin-bottom: 6px; }
.eg-fb-tip { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--eg-line); color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.7; display: flex; gap: 8px; align-items: flex-start; }
.eg-fb-tip .b { color: var(--eg-accent-ink); font-weight: 700; white-space: nowrap; flex: 0 0 auto; }
.eg-fb-actions { margin-top: 18px; display: flex; gap: 10px; }

/* ===== report ===== */
.eg-report .r-top { display: flex; align-items: center; justify-content: center; gap: 8px; }
.eg-rtitle { font-family: var(--eg-serif); font-size: var(--eg-fs-lg); line-height: 1.35; font-weight: 700; margin: 0; overflow-wrap: break-word; min-width: 0; text-align: center; }
.eg-rmeta { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); margin-top: 6px; font-variant-numeric: tabular-nums; text-align: center; }
.eg-rsum { margin: 16px 0 0; padding: 0; border-top: 1px solid var(--eg-line); border-radius: 0; background: transparent; color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.75; text-align: center; }
.eg-rp { margin: 16px 0 0; font-size: var(--eg-fs-md); line-height: 1.9; color: var(--eg-ink); }
.eg-practice { margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--eg-line); }
.eg-report .eg-ptitle { text-align: center; }
.eg-report .eg-actions { justify-content: center; }
.eg-report .eg-q-toggle { appearance: none; -webkit-appearance: none; width: 100%; justify-content: center; }
.eg-ptitle { display: flex; align-items: center; justify-content: center; gap: 7px; font-size: var(--eg-fs-sm); font-weight: 700; color: var(--eg-ink); }
.eg-q { margin-top: 0; padding: 14px 0; border-top: 1px solid var(--eg-line); border-radius: 0; background: transparent; }
.eg-q:first-of-type { border-top: none; }
.eg-q-head { display: flex; gap: 8px; align-items: baseline; justify-content: center; text-align: center; }
.eg-q-n { font: 700 var(--eg-fs-sm)/1.4 var(--eg-font); color: var(--eg-accent-ink); font-variant-numeric: tabular-nums; flex: 0 0 auto; }
.eg-q-zh { font-size: var(--eg-fs-sm); line-height: 1.6; text-align: center; }
.eg-q-en { display: none; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--eg-line); font-family: var(--eg-serif); font-size: var(--eg-fs-md); color: var(--eg-ink); text-align: center; }
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
.eg-letters { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
.eg-letter {
  flex: 1 1 0; min-width: 8px; max-width: 38px; width: auto; height: 50px; padding: 0; text-align: center;
  border: none; border-bottom: 2px solid var(--eg-line-2); border-radius: 5px 5px 0 0;
  background: transparent; color: var(--eg-ink);
  font: 600 22px/1 var(--eg-font); text-transform: lowercase; outline: none;
  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, color var(--eg-dur) ease;
}
.eg-letter:hover { border-bottom-color: var(--eg-line-2); background: var(--eg-bg-2); }
.eg-letter:focus { border-bottom-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }
.eg-letter.ok { border-bottom-color: var(--eg-ok); color: var(--eg-ok); }
.eg-letter.bad { border-bottom-color: var(--eg-bad); color: var(--eg-bad); }
.eg-letters.answered .eg-letter { cursor: default; }
/* word training: centred column */
.eg-word { width: 100%; max-width: 640px; margin-left: auto; margin-right: auto; height: 100%; min-height: 0; display: flex; flex-direction: column; align-items: stretch; text-align: center; }
.eg-word-main { flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; min-height: 0; overflow-y: auto; padding: 8px 0 4px; }
.eg-word .eg-pos { margin: 0 0 -2px; display: inline-flex; align-items: center; padding: 2px 8px; border: 1px solid var(--eg-line); border-radius: 999px; background: var(--eg-bg-2); color: var(--eg-ink-2); font: 600 var(--eg-fs-xs)/1.2 var(--eg-font); }
.eg-word .eg-zh { font-size: 28px; line-height: 1.4; margin-top: 8px; }
.eg-word .eg-letters { justify-content: center; margin-top: 16px; }
.eg-word .eg-foot { justify-content: center; width: 100%; margin-top: 26px; }
.eg-word .eg-foot .eg-kbd { margin-left: 0; }
.eg-word .eg-fb { width: 100%; text-align: center; margin-top: 14px; padding-top: 0; border-top: none; }
.eg-word .eg-fb-top { justify-content: center; }
.eg-word .eg-fb-actions { justify-content: center; }
.eg-word .eg-fb > .eg-fb-actions:first-child { margin-top: 0; gap: 8px; flex-wrap: wrap; justify-content: center; }
.eg-word .eg-fb-actions .eg-btn { padding: 0 10px; }
.eg-word-foot { flex: 0 0 auto; display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--eg-line); }
.eg-word-foot .eg-btn { padding: 0 10px; }
.eg-word .eg-fb-ref { margin-top: 6px; font-size: 26px; text-align: center; }
/* phrase drill: centred column */
.eg-drill { max-width: 640px; min-height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; padding-top: 12px; }
.eg-drill .eg-cap { justify-content: center; }
.eg-drill .eg-foot { justify-content: center; width: 100%; }
.eg-drill .eg-foot .eg-kbd { margin-left: 0; }
.eg-drill .eg-inputwrap { width: 100%; }
.eg-drill .eg-input { text-align: left; }
.eg-drill .eg-hintbox { text-align: center; }
.eg-drill .eg-fb { width: 100%; text-align: center; }
.eg-drill .eg-fb-top { justify-content: center; }
.eg-drill .eg-fb-actions { justify-content: center; }
.eg-drill .eg-fb-tip { justify-content: center; align-items: center; text-align: center; }
.eg-drill .eg-err { text-align: center; }

/* ===== word bank bar ===== */
.eg-bankbar { width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px; padding: 0 0 10px; margin: 0 0 12px; border-bottom: 1px solid var(--eg-line); }
.eg-banklabel { flex: 0 0 auto; font-size: var(--eg-fs-sm); font-weight: 500; color: var(--eg-ink-2); }
.eg-select {
  flex: 1 1 auto; min-width: 0; max-width: 260px; height: 34px; padding: 0 25px 0 12px; border: 1px solid var(--eg-line);
  border-radius: 999px; background: var(--eg-bg-2); color: var(--eg-ink); cursor: pointer;
  font: 600 var(--eg-fs-xs)/1 var(--eg-font); outline: none; appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--eg-ink-2) 50%), linear-gradient(135deg, var(--eg-ink-2) 50%, transparent 50%);
  background-position: calc(100% - 13px) 13px, calc(100% - 9px) 13px; background-size: 4px 4px, 4px 4px; background-repeat: no-repeat;
}
.eg-select:hover { border-color: var(--eg-line-2); }
.eg-select:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-bankbtn { appearance: none; -webkit-appearance: none;
  flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; gap: 3px;
  min-height: 34px; min-width: 76px; padding: 0 12px; border: 1px solid var(--eg-line-2); border-radius: var(--eg-r-sm);
  background: var(--eg-bg); color: var(--eg-ink-2); cursor: pointer;
  font: 600 var(--eg-fs-sm)/1 var(--eg-font);
}
.eg-bankbtn:hover { border-color: var(--eg-accent); color: var(--eg-accent-ink); background: color-mix(in srgb, var(--eg-accent) 5%, var(--eg-bg)); }
.eg-bankbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-notice { margin: 0 0 12px; padding: 8px 10px; border-radius: 8px; background: color-mix(in srgb, var(--eg-ok) 8%, transparent); border: 1px solid color-mix(in srgb, var(--eg-ok) 28%, transparent); color: var(--eg-ink); font-size: var(--eg-fs-xs); line-height: 1.5; }

/* ===== word bank import ===== */
.eg-import { width: 100%; max-width: 520px; margin: 0 auto; text-align: left; }
.eg-import-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.eg-import-title { font-size: var(--eg-fs-md); font-weight: 700; color: var(--eg-ink); line-height: 1.3; }
.eg-import-actions { flex: 0 0 auto; display: flex; align-items: center; gap: 5px; }
.eg-import-back, .eg-filebtn { appearance: none; -webkit-appearance: none;
  flex: 0 0 auto; display: inline-flex; align-items: center; min-height: 30px; padding: 4px 10px;
  border: 1px solid var(--eg-line); border-radius: var(--eg-r-sm); background: var(--eg-bg);
  color: var(--eg-ink-2); cursor: pointer; font: 600 var(--eg-fs-sm)/1 var(--eg-font); white-space: nowrap;
}
.eg-import-back:hover, .eg-filebtn:hover { border-color: var(--eg-line-2); color: var(--eg-ink); }
.eg-import-back:focus-visible, .eg-filebtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-import-sub { margin-top: 4px; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.5; }
.eg-field { margin-top: 8px; }
.eg-field label { display: block; margin-bottom: 6px; font-size: var(--eg-fs-xs); font-weight: 600; color: var(--eg-ink-2); }
.eg-text {
  width: 100%; height: 32px; padding: 0 10px; border: 1px solid var(--eg-line); border-radius: 8px;
  background: var(--eg-bg-2); color: var(--eg-ink); font: var(--eg-fs-sm)/1 var(--eg-font); outline: none;
}
.eg-text:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }
.eg-textarea-wrap { position: relative; margin-top: 10px; }
.eg-textarea {
  width: 100%; min-height: 82px; resize: vertical; padding: 9px 10px; border: 1px solid var(--eg-line); border-radius: 10px;
  background: var(--eg-bg-2); color: var(--eg-ink); font: var(--eg-fs-xs)/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; outline: none;
  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease;
}
.eg-textarea-wrap.over .eg-textarea, .eg-textarea-wrap:hover .eg-textarea { border-color: var(--eg-accent); background: color-mix(in srgb, var(--eg-accent) 5%, var(--eg-bg-2)); }
.eg-textarea:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }
.eg-preview { margin-top: 12px; border: 1px solid var(--eg-line); border-radius: 10px; overflow: hidden; }
.eg-preview-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px; background: var(--eg-bg-2); font-size: var(--eg-fs-xs); color: var(--eg-ink-2); }
.eg-preview-top strong { color: var(--eg-ink); }
.eg-preview-row { display: flex; gap: 10px; padding: 7px 10px; border-top: 1px solid var(--eg-line); font-size: var(--eg-fs-xs); line-height: 1.5; }
.eg-preview-row .w { flex: 0 0 38%; font-weight: 650; overflow-wrap: anywhere; }
.eg-preview-row .m { flex: 1 1 auto; color: var(--eg-ink-2); overflow-wrap: anywhere; }
.eg-preview-errors { margin-top: 8px; padding: 8px 10px; border-radius: 8px; background: color-mix(in srgb, var(--eg-bad) 7%, transparent); border: 1px solid color-mix(in srgb, var(--eg-bad) 24%, transparent); }
.eg-preview-errors .er { font-size: var(--eg-fs-xs); line-height: 1.55; color: var(--eg-bad); }
.eg-import-foot { display: flex; gap: 8px; margin-top: 8px; }

@media (prefers-reduced-motion: reduce) { .eg-panel { animation: none; } .eg-hintbox { animation: none; } .eg-root *, .eg-panel * { transition: none !important; } }
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
      burst: 0,
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
      celebrate() {
        this.burst += 1
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

    // Small springy "tap" on the submit button: add a class for one animation
    // cycle so the button compresses and bounces back even after pointer-up.
    function bounceButton(e) {
      const el = e && e.currentTarget
      if (!el || !el.classList) return
      try {
        el.classList.remove('is-bouncing')
        void el.offsetWidth
        el.classList.add('is-bouncing')
        clearTimeout(el.__egBounceTimer)
        el.__egBounceTimer = setTimeout(() => el.classList.remove('is-bouncing'), 360)
      } catch {
        /* ignore */
      }
    }

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
      const w = 340
      const h = 440
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

    function makeConfettiPieces() {
      const colors = ['var(--eg-confetti-1)', 'var(--eg-confetti-2)', 'var(--eg-confetti-3)', 'var(--eg-confetti-4)', 'var(--eg-confetti-5)', 'var(--eg-confetti-6)']
      const pieces = []
      for (let i = 0; i < 64; i += 1) {
        const side = i % 4
        let x = 0
        let y = 0
        let dx = 0
        let dy = 0
        if (side === 0) {
          x = 0
          y = 6 + Math.random() * 88
          dx = 70 + Math.random() * 110
          dy = (Math.random() - 0.5) * 90
        } else if (side === 1) {
          x = 100
          y = 6 + Math.random() * 88
          dx = -(70 + Math.random() * 110)
          dy = (Math.random() - 0.5) * 90
        } else if (side === 2) {
          x = 6 + Math.random() * 88
          y = 0
          dx = (Math.random() - 0.5) * 90
          dy = 70 + Math.random() * 110
        } else {
          x = 6 + Math.random() * 88
          y = 100
          dx = (Math.random() - 0.5) * 90
          dy = -(70 + Math.random() * 110)
        }
        pieces.push({
          key: i,
          style: {
            left: x + '%',
            top: y + '%',
            width: 4 + Math.random() * 4 + 'px',
            height: 8 + Math.random() * 10 + 'px',
            backgroundColor: colors[i % colors.length],
            '--dx': dx.toFixed(1) + 'px',
            '--dy': dy.toFixed(1) + 'px',
            '--r0': Math.round(Math.random() * 360) + 'deg',
            '--rot': Math.round((Math.random() - 0.5) * 720) + 'deg',
            '--delay': Math.round(Math.random() * 110) + 'ms',
            '--dur': Math.round(720 + Math.random() * 420) + 'ms',
          },
        })
      }
      return pieces
    }

    function Confetti() {
      const [pieces] = useState(makeConfettiPieces)
      return React.createElement(
        'div',
        { className: 'eg-confetti', 'aria-hidden': 'true' },
        pieces.map((piece) => React.createElement('span', { key: piece.key, className: 'eg-confetti-piece', style: piece.style })),
      )
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
              onPointerDown: bounceButton,
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

    // Import a user word bank: file picker / drag-and-drop / paste, with a
    // server-side parse preview (same parser as the real import).
    function WordBankImport({ onClose, onImported }) {
      const [name, setName] = useState('')
      const [filename, setFilename] = useState('')
      const [content, setContent] = useState('')
      const [preview, setPreview] = useState(null)
      const [busy, setBusy] = useState(false)
      const [error, setError] = useState('')
      const [over, setOver] = useState(false)
      const fileRef = useRef(null)

      const readFile = useCallback(async (file) => {
        if (!file) return
        setError('')
        try {
          const buf = await file.arrayBuffer()
          let text = ''
          try {
            text = new TextDecoder('utf-8', { fatal: true }).decode(buf)
          } catch {
            text = new TextDecoder('gbk').decode(buf)
          }
          setContent(text)
          setFilename(file.name || '')
          setName((prev) => prev || String(file.name || '').replace(/\.[^.]+$/, '').slice(0, 60))
          setPreview(null)
        } catch (e) {
          setError('读取文件失败：' + (e.message || e))
        }
      }, [])

      const doPreview = useCallback(async () => {
        if (!content.trim() || busy) return
        setBusy(true)
        setError('')
        try {
          setPreview(await api('/wordbanks/preview', { method: 'POST', body: JSON.stringify({ content, filename }) }))
        } catch (e) {
          setError(e.message || '解析失败')
        } finally {
          setBusy(false)
        }
      }, [content, filename, busy])

      const doImport = useCallback(async () => {
        if (!preview || !preview.valid || busy) return
        setBusy(true)
        setError('')
        try {
          const res = await api('/wordbanks/import', { method: 'POST', body: JSON.stringify({ name, filename, content }) })
          if (res.summary) store.setStats(res.summary)
          onImported(res)
        } catch (e) {
          setError(e.message || '导入失败')
        } finally {
          setBusy(false)
        }
      }, [preview, busy, name, filename, content, onImported])

      const onDrop = (e) => {
        e.preventDefault()
        setOver(false)
        const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]
        if (file) readFile(file)
      }

      return h(
        'div',
        { className: 'eg-import', 'data-nodrag': 'true' },
        h(
          'div',
          { className: 'eg-import-head' },
          h(
            'div',
            null,
            h('div', { className: 'eg-import-title' }, '导入词库'),
            h('div', { className: 'eg-import-sub' }, 'CSV/TSV/TXT/JSON'),
          ),
          h(
            'div',
            { className: 'eg-import-actions' },
            h(
              'button',
              {
                className: 'eg-filebtn',
                onClick: () => {
                  try {
                    if (fileRef.current) fileRef.current.click()
                  } catch {
                    /* ignore */
                  }
                },
              },
              filename ? '换文件' : '选择文件',
            ),
            h('button', { className: 'eg-import-back', onClick: onClose }, '← 返回'),
          ),
        ),
        h(
          'div',
          { className: 'eg-field' },
          h('label', { htmlFor: 'eg-bank-name' }, '词库名称'),
          h('input', {
            id: 'eg-bank-name',
            className: 'eg-text',
            value: name,
            maxLength: 60,
            placeholder: '例如：CET-6 核心词',
            onChange: (e) => setName(e.target.value),
          }),
        ),
        h(
          'div',
          {
            className: 'eg-textarea-wrap' + (over ? ' over' : ''),
            onDragEnter: (e) => {
              e.preventDefault()
              setOver(true)
            },
            onDragOver: (e) => {
              e.preventDefault()
              setOver(true)
            },
            onDragLeave: () => setOver(false),
            onDrop,
          },
          h('textarea', {
            className: 'eg-textarea',
            value: content,
            placeholder: '把 CSV / TSV / TXT / JSON 内容粘贴到这里，或把文件拖进来…',
            onChange: (e) => {
              setContent(e.target.value)
              setFilename('')
              setPreview(null)
            },
          }),
          h('input', {
            ref: fileRef,
            type: 'file',
            accept: '.csv,.tsv,.txt,.json,text/csv,text/tab-separated-values,application/json',
            style: { display: 'none' },
            onChange: (e) => {
              const file = e.target.files && e.target.files[0]
              if (file) readFile(file)
              e.target.value = ''
            },
          }),
        ),
        h(
          'div',
          { className: 'eg-import-foot' },
          h(
            'button',
            { className: 'eg-btn primary', onClick: doPreview, disabled: busy || !content.trim() },
            busy ? '解析中…' : '解析预览',
          ),
          h(
            'button',
            { className: 'eg-btn ghost', onClick: doImport, disabled: busy || !preview || !preview.valid },
            preview && preview.valid ? '导入 ' + preview.valid + ' 条' : '导入',
          ),
        ),
        error ? h('div', { className: 'eg-err' }, error) : null,
        preview
          ? h(
              'div',
              null,
              h(
                'div',
                { className: 'eg-preview' },
                h(
                  'div',
                  { className: 'eg-preview-top' },
                  h('strong', null, '识别到 ' + preview.valid + ' 条'),
                  h(
                    'span',
                    null,
                    String(preview.format || '').toUpperCase() +
                      (preview.hasHeader ? ' · 含表头' : '') +
                      (preview.skippedCount ? ' · 跳过 ' + preview.skippedCount + ' 行' : ''),
                  ),
                ),
                (preview.sample || []).map((item, i) =>
                  h(
                    'div',
                    { className: 'eg-preview-row', key: i },
                    h('span', { className: 'w' }, item.word),
                    h('span', { className: 'm' }, item.meaning),
                  ),
                ),
              ),
              preview.errors && preview.errors.length
                ? h(
                    'div',
                    { className: 'eg-preview-errors' },
                    preview.errors.map((e, i) => h('div', { className: 'er', key: i }, '第 ' + e.line + ' 行：' + e.reason)),
                  )
                : null,
            )
          : null,
      )
    }

    // Static word bank drill: Chinese gloss + one underline per letter.
    function WordPractice() {
      const [item, setItem] = useState(null)
      const [cells, setCells] = useState([])
      const [res, setRes] = useState(null)
      const [revealed, setRevealed] = useState(false)
      const [busy, setBusy] = useState(false)
      const [error, setError] = useState('')
      const [banks, setBanks] = useState(null)
      const [bankId, setBankId] = useState('')
      const [view, setView] = useState('practice')
      const [notice, setNotice] = useState('')
      const [switching, setSwitching] = useState(false)
      const refs = useRef([])
      const inFlight = useRef(false)

      const load = useCallback(async () => {
        if (inFlight.current) return
        inFlight.current = true
        setBusy(true)
        setError('')
        setRes(null)
        setRevealed(false)
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

      // After a correct spelling, Enter acts as “next word” — the primary action is
      // always one keystroke away, even when the letter inputs are disabled.
      useEffect(() => {
        if (!res || !res.correct || view !== 'practice') return undefined
        const onKeyDown = (e) => {
          if (e.key !== 'Enter' || e.isComposing) return
          const el = e.target
          if (el && el.closest && el.closest('textarea, input:not([disabled]), select, button')) return
          e.preventDefault()
          load()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
      }, [res, view, load])

      const loadBanks = useCallback(async () => {
        try {
          const data = await api('/wordbanks')
          setBanks(Array.isArray(data.banks) ? data.banks : [])
          setBankId(data.active || 'builtin')
        } catch {
          /* ignore: practice still works with the built-in bank */
        }
      }, [])

      useEffect(() => {
        loadBanks()
      }, [loadBanks])

      const switchBank = useCallback(
        async (e) => {
          const id = e.target.value
          if (!id || id === bankId) return
          setSwitching(true)
          setError('')
          setNotice('')
          try {
            const data = await api('/wordbanks/active', { method: 'POST', body: JSON.stringify({ id }) })
            setBankId(data.active)
            if (data.summary) store.setStats(data.summary)
            await load()
          } catch (err) {
            setError(err.message || '切换词库失败')
          } finally {
            setSwitching(false)
          }
        },
        [bankId, load],
      )

      const onImported = useCallback(
        (result) => {
          setNotice('已导入「' + result.bank.name + '」' + result.bank.count + ' 条')
          setView('practice')
          loadBanks()
          load()
        },
        [loadBanks, load],
      )

      const submit = useCallback(async () => {
        if (!item || busy || res) return
        if (cells.some((c) => !c)) return
        setBusy(true)
        setError('')
        setRevealed(false)
        try {
          const r = await api('/word/check', {
            method: 'POST',
            body: JSON.stringify({ id: item.id, answer: cells.join('') }),
          })
          setRes(r)
          if (r.correct) store.celebrate()
          if (r.summary) store.setStats(r.summary)
        } catch (e) {
          setError(e.message || '判分失败')
        } finally {
          setBusy(false)
        }
      }, [item, cells, busy, res])

      const retry = useCallback(() => {
        if (!item || busy) return
        setRes(null)
        setError('')
        setRevealed(false)
        setCells(new Array(Math.max(0, item.letters || 0)).fill(''))
        setTimeout(() => {
          try {
            if (refs.current[0]) refs.current[0].focus()
          } catch {
            /* ignore */
          }
        }, 0)
      }, [item, busy])

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

      if (view === 'import') {
        return h(WordBankImport, { onClose: () => setView('practice'), onImported })
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
      const letterGap = cells.length > 7 ? 8 : 10
      const letterFont = cells.length > 12 ? 15 : cells.length > 9 ? 17 : 22
      const cellsNodes = cells.map((ch, i) => {
        let cls = 'eg-letter'
        if (answered) cls += ok ? ' ok' : ' bad'
        return React.createElement('input', {
          key: i,
          ref: (el) => {
            refs.current[i] = el
          },
          className: cls,
          value: answered ? ch || target[i] || '' : ch,
          style: { fontSize: letterFont },
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

      const footerActions = answered
        ? React.createElement(
            'div',
            { className: 'eg-word-foot' },
            ok
              ? React.createElement('button', { className: 'eg-btn primary', onClick: load, disabled: busy, title: '回车继续', 'aria-keyshortcuts': 'Enter' }, '下一个')
              : [
                  React.createElement('button', { key: 'retry', className: 'eg-btn primary', onClick: retry, disabled: busy }, '再试一次'),
                  React.createElement(
                    'button',
                    {
                      key: 'reveal',
                      className: 'eg-btn',
                      onClick: () => setRevealed((v) => !v),
                      disabled: busy,
                      'aria-expanded': revealed ? 'true' : 'false',
                    },
                    revealed ? '收起答案' : '显示答案',
                  ),
                  React.createElement('button', { key: 'next', className: 'eg-btn', onClick: load, disabled: busy }, '下一个'),
                ],
          )
        : item
          ? React.createElement(
              'div',
              { className: 'eg-word-foot' },
              React.createElement(
                'button',
                {
                  className: 'eg-btn primary' + (busy ? ' is-loading' : ''),
                  onClick: submit,
                  onPointerDown: bounceButton,
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
            )
          : null

      return React.createElement(
        'div',
        { className: 'eg-word' },
        React.createElement(
          'div',
          { className: 'eg-bankbar', 'data-nodrag': 'true' },
          React.createElement('span', { className: 'eg-banklabel' }, '词库'),
          React.createElement(
            'select',
            {
              className: 'eg-select',
              value: bankId || '',
              disabled: switching || !banks,
              onChange: switchBank,
              title: '切换单词词库',
            },
            (banks || []).map((b) =>
              React.createElement('option', { key: b.id, value: b.id }, b.name + '（' + b.count + '）'),
            ),
          ),
          React.createElement(
            'button',
            { className: 'eg-bankbtn', onClick: () => { setNotice(''); setView('import') } },
            React.createElement('span', { className: 'eg-plus', 'aria-hidden': 'true' }, '+'),
            '导入',
          ),
        ),
        notice ? React.createElement('div', { className: 'eg-notice' }, notice) : null,
        React.createElement('div', { className: 'eg-word-main' },
        item.pos ? React.createElement('div', { className: 'eg-pos', title: '词性提示' }, '词性 · ' + formatPos(item.pos)) : null,
        React.createElement('div', { className: 'eg-zh' }, item.zh),
        React.createElement('div', { className: 'eg-letters' + (answered ? ' answered' : ''), style: { gap: letterGap } }, cellsNodes),
        error ? React.createElement('div', { className: 'eg-err' }, error) : null,
        answered
          ? ok
            ? React.createElement(
                'div',
                { className: 'eg-fb ok' },
                React.createElement(
                  'div',
                  { className: 'eg-fb-top' },
                  React.createElement('span', { className: 'eg-fb-status' }, '拼对了'),
                ),
                React.createElement(
                  'div',
                  { className: 'eg-fb-ref' },
                  React.createElement('span', { className: 'lbl' }, '正确拼写'),
                  res.reference,
                ),
              )
            : React.createElement(
                'div',
                { className: 'eg-fb bad' },
                revealed
                  ? React.createElement(
                      'div',
                      { className: 'eg-fb-ref' },
                      React.createElement('span', { className: 'lbl' }, '正确拼写'),
                      res.reference,
                    )
                  : null,
              )
          : null,
        ),
        footerActions,
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
        { className: 'eg-root eg-entry' },
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
      const [tab, setTab] = useState('word')
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
          t.closest('button, textarea, input, select, a, summary, [contenteditable="true"], [data-nodrag], .eg-resize')
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
          if (res.correct) store.celebrate()
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
              { className: 'eg-tab' + (tab === 'word' ? ' active' : ''), onClick: () => setTab('word') },
              '单词训练',
            ),
            React.createElement(
              'button',
              { className: 'eg-tab' + (tab === 'drill' ? ' active' : ''), onClick: () => setTab('drill') },
              '短语训练',
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
        shared.burst ? React.createElement(Confetti, { key: shared.burst }) : null,
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
