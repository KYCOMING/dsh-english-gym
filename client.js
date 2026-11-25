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

    function escapeRegExp(text) {
      return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    /** Split a sentence around the target word for highlighting after grading. */
    function splitByWord(text, word) {
      const source = String(text || '')
      const target = String(word || '')
      if (!target) return [source]
      return source.split(new RegExp('(' + escapeRegExp(target) + ')', 'gi'))
    }

    /** Split a reference sentence around any matched word-bank terms (longest first). */
    function splitByTerms(text, terms) {
      const source = String(text || '')
      const clean = (Array.isArray(terms) ? terms : [])
        .map((t) => String(t || '').trim())
        .filter(Boolean)
        .sort((a, b) => b.length - a.length)
      if (!source || !clean.length) return [source]
      const pattern = clean
        .map((t) => (/\s/.test(t) ? escapeRegExp(t) : '\\b' + escapeRegExp(t) + '\\b'))
        .join('|')
      try {
        return source.split(new RegExp('(' + pattern + ')', 'gi'))
      } catch {
        return [source]
      }
    }

    function normalizeEnglish(text) {
      return String(text || '')
        .toLowerCase()
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201c\u201d]/g, '"')
        .replace(/[.!?,;:]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    }

    async function copyToClipboard(text) {
      const value = String(text || '')
      if (!value) return false
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(value)
          return true
        }
      } catch {
        /* fall back to execCommand */
      }
      try {
        const ta = document.createElement('textarea')
        ta.value = value
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(ta)
        return !!ok
      } catch {
        return false
      }
    }

    const CSS = `
/* Hallmark · component: english-gym panel · genre: editorial · theme: in-place (dsh tokens) · states: 8 · contrast: pass · v3.0.0
 * critique: the drill is a study desk — crisp sans for Chinese & UI, Charter/Georgia for English reading, tactile micro-motion throughout.
 * waive: none
 */
.eg-root, .eg-panel {
  --eg-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --eg-en: "Charter", "Iowan Old Style", "Georgia", "Times New Roman", "PingFang SC", serif;
  --eg-serif: var(--eg-en);
  --eg-ink: var(--dsw-alias-label-primary, #1f2328);
  --eg-ink-2: var(--dsw-alias-label-secondary, #5a6069);
  --eg-bg: var(--dsw-alias-bg-layer-1, #ffffff);
  --eg-bg-2: var(--dsw-alias-bg-layer-2, rgba(23, 26, 31, .045));
  --eg-bg-3: color-mix(in srgb, var(--eg-ink) 8%, transparent);
  --eg-line: var(--dsw-alias-border-l1, rgba(23, 26, 31, .12));
  --eg-line-2: var(--dsw-alias-border-l2, rgba(23, 26, 31, .24));
  --eg-accent: var(--dsw-alias-brand-primary, #2f6fed);
  --eg-accent-ink: var(--eg-accent);
  --eg-on-accent: #ffffff;
  --eg-ok: var(--dsw-alias-state-success-primary, #1a7f37);
  --eg-bad: var(--dsw-alias-state-error-primary, #cf222e);
  --eg-warn: var(--dsw-alias-state-warn-primary, #bf8700);
  --eg-warn-strong: var(--eg-warn);
  --eg-r: 16px;
  --eg-r-sm: 10px;
  --eg-shadow: 0 20px 56px rgba(17, 22, 31, .22), 0 2px 8px rgba(17, 22, 31, .08);
  --eg-dur: .16s;
  --eg-ease: cubic-bezier(.22, 1, .36, 1);
  --eg-spring: cubic-bezier(.34, 1.45, .64, 1);
  --eg-fs-xs: 12px; --eg-fs-sm: 13px; --eg-fs-md: 15px; --eg-fs-lg: 19px; --eg-fs-xl: 32px;
  --eg-confetti-1: var(--eg-accent); --eg-confetti-2: var(--eg-bad); --eg-confetti-3: var(--eg-ok);
  --eg-confetti-4: var(--eg-warn); --eg-confetti-5: #c9407e; --eg-confetti-6: #1b7c83;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  transition: background var(--eg-dur) ease, transform .12s ease;
}
.eg-pill:hover { background: var(--eg-bg-2); }
.eg-pill:active { transform: scale(.985); }
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
  display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; height: 20px; border-radius: 999px;
  background: var(--eg-bg-3); color: var(--eg-ink-2); font-size: 11.5px; font-weight: 600; font-variant-numeric: tabular-nums;
}
.eg-chip.warn {
  background: color-mix(in srgb, var(--eg-warn) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--eg-warn) 32%, transparent);
  color: var(--eg-warn);
}
.eg-chev { margin-left: auto; opacity: .7; font-size: var(--eg-fs-xs); transition: transform .2s var(--eg-ease); }
.eg-pill[aria-expanded="true"] .eg-chev { transform: rotate(90deg); }

/* ===== panel ===== */
.eg-panel {
  position: fixed; z-index: 2147483000; pointer-events: auto;
  display: flex; flex-direction: column;
  background: var(--eg-bg); border: 1px solid var(--eg-line); border-radius: var(--eg-r);
  box-shadow: var(--eg-shadow); overflow: hidden;
  font: var(--eg-fs-sm)/1.5 var(--eg-font); color: var(--eg-ink);
  transform-origin: bottom center; animation: eg-pop .2s var(--eg-ease) both;
}
.eg-panel.is-closing {
  animation: eg-pop-out .14s cubic-bezier(.4, 0, 1, 1) forwards;
  pointer-events: none;
}
@keyframes eg-pop { from { opacity: 0; transform: scale(.95) translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes eg-pop-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: scale(.96) translateY(6px); } }
.eg-head {
  display: flex; align-items: center; gap: 5px; padding: 9px 8px 9px 10px;
  border-bottom: 1px solid var(--eg-line); flex: 0 0 auto; cursor: move; user-select: none; touch-action: none;
  background: var(--eg-bg); position: relative;
}
.eg-grip { color: var(--eg-ink-2); opacity: .7; font-size: var(--eg-fs-xs); letter-spacing: -2px; cursor: grab; width: 10px; flex: 0 0 auto; transition: opacity var(--eg-dur) ease; }
.eg-head:hover .eg-grip { opacity: 1; }
.eg-tabs { position: relative; display: flex; flex-wrap: nowrap; align-items: center; gap: 0; margin-left: 0; min-width: 0; flex: 0 1 auto; }
.eg-tab {
  position: relative; padding: 5px 5px; border: none; background: transparent; cursor: pointer; white-space: nowrap;
  color: var(--eg-ink-2); font: 600 var(--eg-fs-xs)/1.2 var(--eg-font); border-radius: 7px;
  transition: color var(--eg-dur) ease, background var(--eg-dur) ease;
}
.eg-tab:hover { color: var(--eg-ink); background: var(--eg-bg-2); }
.eg-tab:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-tab.active { color: var(--eg-ink); }
.eg-tabs:not(.has-slider) .eg-tab.active::after {
  content: ""; position: absolute; left: 5px; right: 5px; bottom: -10px; height: 2px; border-radius: 2px; background: var(--eg-accent);
}
.eg-tab-indicator {
  position: absolute; left: 0; bottom: -10px; height: 2px; border-radius: 2px;
  background: var(--eg-accent); pointer-events: none;
  transition: transform .24s var(--eg-ease), width .24s var(--eg-ease), opacity .16s ease;
  will-change: transform, width;
}
.eg-head-right { margin-left: auto; display: flex; align-items: center; gap: 6px; }
.eg-close { appearance: none; -webkit-appearance: none;
  border: none; background: transparent; color: var(--eg-ink-2); cursor: pointer;
  width: 26px; height: 26px; border-radius: 7px; font-size: 14px; line-height: 1; display: flex; align-items: center; justify-content: center;
  transition: background var(--eg-dur) ease, color var(--eg-dur) ease, transform .14s ease;
}
.eg-close:hover { background: var(--eg-bg-2); color: var(--eg-ink); }
.eg-close:active { transform: scale(.9); }
.eg-close:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-body { padding: 20px 22px 22px; overflow-y: auto; flex: 1 1 auto; display: flex; flex-direction: column; }
.eg-body > * { width: 100%; max-width: 640px; margin-left: auto; margin-right: auto; }

/* ===== shared motion primitives ===== */
.eg-view {
  width: 100%; max-width: 640px; margin-left: auto; margin-right: auto;
  display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0;
  animation: eg-view-in .2s var(--eg-ease) both;
}
.eg-stage-in { animation: eg-stage-in .22s var(--eg-ease) both; }
@keyframes eg-view-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes eg-stage-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
.eg-collapse {
  display: grid; grid-template-rows: 0fr; opacity: 0;
  transition: grid-template-rows .24s var(--eg-ease), opacity .2s ease;
}
.eg-collapse.open { grid-template-rows: 1fr; opacity: 1; }
.eg-collapse-inner { overflow: hidden; min-height: 0; }

/* ===== drill ===== */
.eg-cap { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); font-weight: 600; letter-spacing: .02em; }
.eg-zh {
  margin-top: 14px; font-family: var(--eg-font); font-size: 18px; line-height: 1.6; font-weight: 650;
  letter-spacing: -.005em; color: var(--eg-ink); overflow-wrap: break-word;
}
.eg-hintbtn { appearance: none; -webkit-appearance: none;
  margin-top: 14px; display: inline-flex; align-items: center; gap: 6px; min-height: 30px; padding: 5px 11px;
  border: 1px solid var(--eg-line); background: var(--eg-bg); border-radius: 999px;
  color: var(--eg-ink-2); font: 600 var(--eg-fs-xs)/1 var(--eg-font); cursor: pointer;
  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease;
}
.eg-hintbtn:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }
.eg-hintbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-hintbtn .caret { display: inline-block; transition: transform .22s var(--eg-ease); }
.eg-hintbtn[aria-expanded="true"] .caret { transform: rotate(90deg); }
.eg-hint-collapse { width: 100%; }
.eg-hintbox {
  margin-top: 10px; padding: 10px 13px; border: 1px solid var(--eg-line); border-radius: var(--eg-r-sm);
  background: var(--eg-bg-2); color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.6;
  text-align: left;
}
.eg-inputwrap { position: relative; margin-top: 18px; }
.eg-input {
  width: 100%; min-height: 98px; resize: vertical; padding: 12px 14px;
  border: 1px solid var(--eg-line); border-radius: var(--eg-r-sm);
  background: var(--eg-bg-2); color: var(--eg-ink);
  font: var(--eg-fs-md)/1.6 var(--eg-font); outline: none;
  transition: border-color var(--eg-dur) ease, box-shadow var(--eg-dur) ease, background var(--eg-dur) ease;
}
.eg-input::placeholder { color: var(--eg-ink-2); opacity: .82; }
.eg-input:hover { border-color: var(--eg-line-2); }
.eg-input:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }
.eg-input.error { border-color: var(--eg-bad); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-bad) 14%, transparent); }
.eg-foot { display: flex; align-items: center; gap: 10px; margin-top: 16px; }
.eg-foot .eg-kbd { margin-left: auto; }
.eg-err { color: var(--eg-bad); font-size: var(--eg-fs-xs); margin-top: 8px; }
.eg-kbd { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); white-space: nowrap; }
.eg-kbd kbd {
  font: 600 11.5px/1 var(--eg-font); padding: 2px 5px; border: 1px solid var(--eg-line); border-bottom-width: 2px;
  border-radius: 4px; background: var(--eg-bg); color: var(--eg-ink-2);
}
.eg-actions { display: flex; gap: 8px; margin-top: 16px; }
.eg-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  min-height: 36px; min-width: 76px; padding: 0 15px; border-radius: var(--eg-r-sm); cursor: pointer;
  appearance: none; -webkit-appearance: none;
  font: 600 var(--eg-fs-sm)/1 var(--eg-font);
  transition: background var(--eg-dur) ease, filter var(--eg-dur) ease, border-color var(--eg-dur) ease, transform .26s var(--eg-spring);
  border: 1px solid var(--eg-line-2); background: var(--eg-bg); color: var(--eg-ink);
}
.eg-btn:hover { background: var(--eg-bg-2); }
.eg-btn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }
.eg-btn:active { transform: scale(.94); transition-duration: .06s; }
.eg-btn.is-bouncing { animation: eg-btn-bounce .34s var(--eg-spring); }
@keyframes eg-btn-bounce {
  0% { transform: scale(.93); }
  55% { transform: scale(1.04); }
  100% { transform: scale(1); }
}
.eg-btn.primary { border-color: transparent; background: var(--eg-accent); color: var(--eg-on-accent); }
.eg-btn.primary:hover { filter: brightness(1.08); }
.eg-btn:disabled { opacity: .48; cursor: not-allowed; pointer-events: none; }
.eg-btn.primary:disabled { background: var(--eg-accent); color: var(--eg-on-accent); border-color: transparent; }
.eg-btn:not(.primary):disabled { background: var(--eg-bg-2); color: var(--eg-ink-2); border-color: var(--eg-line); }
.eg-btn.primary.is-loading { color: transparent; position: relative; }
.eg-btn.primary.is-loading::after {
  content: ""; position: absolute; width: 15px; height: 15px; border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, .45); border-top-color: #fff; animation: eg-spin .7s linear infinite;
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

/* ===== feedback ===== */
.eg-fb {
  --eg-tone: var(--eg-line-2);
  margin-top: 8px; padding: 18px 20px; border: 1px solid var(--eg-line);
  border-top: 3px solid var(--eg-line); border-radius: 12px; background: var(--eg-bg);
  text-align: left; animation: eg-stage-in .24s var(--eg-ease) both;
}
.eg-fb.ok { --eg-tone: var(--eg-ok); border-top-color: var(--eg-ok); }
.eg-fb.warn { --eg-tone: var(--eg-warn); border-top-color: var(--eg-warn); }
.eg-fb.bad { --eg-tone: var(--eg-bad); border-top-color: var(--eg-bad); }
.eg-fb-top { display: flex; align-items: baseline; gap: 10px; }
.eg-score { font: 700 var(--eg-fs-xl)/1 var(--eg-font); font-variant-numeric: tabular-nums; letter-spacing: -.02em; color: var(--eg-tone); }
.eg-score small { font-size: var(--eg-fs-xs); font-weight: 700; opacity: .9; color: inherit; margin-left: 2px; }
.eg-fb-status { font-weight: 700; font-size: 16px; color: var(--eg-tone); line-height: 1.25; }
.eg-fb-ref {
  margin-top: 14px; padding: 12px 14px; border-radius: 10px; background: var(--eg-bg-2);
  font-family: var(--eg-en); font-size: 17px; line-height: 1.65; color: var(--eg-ink); overflow-wrap: break-word;
  animation: eg-view-in .24s var(--eg-ease) .05s both;
}
.eg-fb-ref .lbl { display: block; font: 600 11.5px/1 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em; margin-bottom: 6px; }
.eg-fb-tip {
  margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--eg-line);
  color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.65;
  display: flex; gap: 8px; align-items: flex-start;
  animation: eg-view-in .24s var(--eg-ease) .1s both;
}
.eg-fb-tip .b {
  padding: 2px 7px; border-radius: 6px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);
  color: var(--eg-ink); font-size: 11px; font-weight: 650; line-height: 1.3;
  white-space: nowrap; flex: 0 0 auto; margin-top: 2px;
}
.eg-fb-actions { margin-top: 16px; display: flex; gap: 10px; animation: eg-view-in .24s var(--eg-ease) .14s both; }

/* phrase feedback card (editorial study-desk breakdown) */
.eg-fb.is-phrase {
  container-type: inline-size;
  display: flex; flex-direction: column;
  flex: 0 1 auto; min-height: 0; max-height: 100%;
  margin-top: 0; padding: 0; border-radius: 14px; overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--eg-tone) 24%, var(--eg-line));
  border-top: 1px solid color-mix(in srgb, var(--eg-tone) 24%, var(--eg-line));
  background: var(--eg-bg);
  box-shadow: 0 4px 18px color-mix(in srgb, var(--eg-tone) 6%, rgba(17, 22, 31, .05));
}
.eg-fb-hero {
  flex: 0 0 auto;
  display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--eg-tone) 11%, var(--eg-bg)) 0%, color-mix(in srgb, var(--eg-tone) 2.5%, var(--eg-bg)) 100%);
  border-bottom: 1px solid color-mix(in srgb, var(--eg-tone) 16%, var(--eg-line));
}
.eg-ring {
  position: relative; width: 50px; height: 50px; flex: 0 0 auto;
  display: flex; align-items: center; justify-content: center;
}
.eg-ring svg { width: 50px; height: 50px; display: block; }
.eg-ring-track { fill: var(--eg-bg); stroke: color-mix(in srgb, var(--eg-tone) 16%, var(--eg-line)); stroke-width: 3.8; }
.eg-ring-arc {
  fill: none; stroke: var(--eg-tone); stroke-width: 3.8; stroke-linecap: round;
  transform: rotate(-90deg); transform-origin: 50% 50%;
  transition: stroke-dashoffset .55s var(--eg-ease);
}
.eg-ring-val {
  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: var(--eg-tone); font-variant-numeric: tabular-nums; pointer-events: none;
}
.eg-ring-val strong { font: 750 16px/1 var(--eg-font); letter-spacing: -.03em; }
.eg-ring-val small { font: 650 9px/1 var(--eg-font); opacity: .78; margin-top: 2px; }
.eg-fb-verdict { min-width: 0; flex: 1 1 auto; }
.eg-fb-headline { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; }
.eg-fb-pill {
  display: inline-flex; align-items: center; gap: 3px;
  padding: 2px 8px; border-radius: 999px;
  background: var(--eg-bg); border: 1px solid var(--eg-line);
  color: var(--eg-ink-2); font: 600 11px/1.35 var(--eg-font); font-variant-numeric: tabular-nums;
}
.eg-fb-pill.tone {
  background: color-mix(in srgb, var(--eg-tone) 12%, var(--eg-bg));
  border-color: color-mix(in srgb, var(--eg-tone) 28%, transparent);
  color: var(--eg-tone);
}
.eg-fb-pill.up {
  background: color-mix(in srgb, var(--eg-ok) 12%, var(--eg-bg));
  border-color: color-mix(in srgb, var(--eg-ok) 28%, transparent);
  color: var(--eg-ok);
}
.eg-fb-sub { margin-top: 3px; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.45; }
.eg-fb-body {
  flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain;
  padding: 12px 16px 14px; display: flex; flex-direction: column; gap: 9px;
}
.eg-fb-prompt {
  display: flex; align-items: baseline; gap: 9px;
  padding-bottom: 9px; border-bottom: 1px dashed var(--eg-line);
}
.eg-fb-tag {
  flex: 0 0 auto; padding: 2px 7px; border-radius: 5px;
  background: var(--eg-bg-2); border: 1px solid var(--eg-line);
  color: var(--eg-ink-2); font: 650 11px/1.35 var(--eg-font); letter-spacing: .02em;
}
.eg-fb-zh { font-size: 14px; font-weight: 600; color: var(--eg-ink); line-height: 1.55; overflow-wrap: break-word; min-width: 0; }
.eg-fb-boxhead { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 5px; flex-wrap: wrap; }
.eg-fb-boxhead-left { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; min-width: 0; }
.eg-fb.is-phrase .lbl {
  display: inline-flex; align-items: center; gap: 5px; margin-bottom: 0;
  font: 650 11.5px/1.2 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em;
}
.eg-fb-mine {
  padding: 9px 12px; border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--eg-tone) 22%, var(--eg-line));
  border-left: 3px solid var(--eg-tone);
  background: color-mix(in srgb, var(--eg-tone) 4%, var(--eg-bg));
  animation: eg-view-in .22s var(--eg-ease) .03s both;
}
.eg-fb-mine .lbl { color: var(--eg-tone); }
.eg-fb-mine-text { font-family: var(--eg-en); font-size: 14.5px; line-height: 1.55; color: var(--eg-ink); overflow-wrap: break-word; }
.eg-fb-mine-text.empty { font-family: var(--eg-font); font-size: var(--eg-fs-sm); color: var(--eg-ink-2); font-style: italic; }
.eg-fb.is-phrase .eg-fb-ref {
  margin-top: 0; padding: 10px 13px; border-radius: 10px;
  border: 1px solid var(--eg-line); background: var(--eg-bg-2);
  font-family: var(--eg-font); font-size: var(--eg-fs-sm); line-height: 1.5;
  animation: eg-view-in .24s var(--eg-ease) .06s both;
}
.eg-fb-ref-text { font-family: var(--eg-en); font-size: 16px; line-height: 1.6; color: var(--eg-ink); overflow-wrap: break-word; }
.eg-fb-banktag {
  display: inline-flex; align-items: center; padding: 1px 7px; border-radius: 999px;
  background: color-mix(in srgb, var(--eg-accent) 10%, var(--eg-bg));
  border: 1px solid color-mix(in srgb, var(--eg-accent) 22%, transparent);
  color: var(--eg-ink-2); font: 600 10.5px/1.4 var(--eg-font);
}
.eg-copybtn {
  appearance: none; -webkit-appearance: none;
  display: inline-flex; align-items: center; gap: 4px;
  height: 24px; padding: 0 8px; border-radius: 6px;
  border: 1px solid var(--eg-line); background: var(--eg-bg); color: var(--eg-ink-2);
  font: 600 11px/1 var(--eg-font); cursor: pointer;
  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease;
}
.eg-copybtn:hover { border-color: var(--eg-line-2); color: var(--eg-ink); }
.eg-copybtn.copied { border-color: color-mix(in srgb, var(--eg-ok) 40%, transparent); color: var(--eg-ok); }
.eg-copybtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-fb-corr {
  padding: 9px 12px; border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--eg-accent) 22%, var(--eg-line));
  border-left: 3px solid var(--eg-accent);
  background: color-mix(in srgb, var(--eg-accent) 4%, var(--eg-bg));
  animation: eg-view-in .24s var(--eg-ease) .08s both;
}
.eg-fb-corr-text { font-family: var(--eg-en); font-size: 15px; line-height: 1.55; color: var(--eg-ink); overflow-wrap: break-word; }
.eg-fb.is-phrase .eg-fb-tip {
  margin-top: 0; padding: 9px 12px; border-radius: 10px;
  border: 1px solid var(--eg-line); background: var(--eg-bg);
  color: var(--eg-ink); font-size: var(--eg-fs-sm); line-height: 1.6;
  display: flex; gap: 9px; align-items: flex-start;
  animation: eg-view-in .24s var(--eg-ease) .1s both;
}
.eg-fb.is-phrase .eg-fb-tip .b {
  background: color-mix(in srgb, var(--eg-tone) 11%, var(--eg-bg));
  border-color: color-mix(in srgb, var(--eg-tone) 26%, transparent);
  color: var(--eg-tone); margin-top: 2px;
}
.eg-fb-hl { display: flex; flex-direction: column; gap: 6px; animation: eg-view-in .24s var(--eg-ease) .12s both; }
.eg-fb-hl-lbl { font: 650 11.5px/1.2 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em; }
.eg-fb-hl-list { display: flex; flex-wrap: wrap; gap: 6px; }
.eg-hl-chip {
  display: inline-flex; align-items: baseline; gap: 6px; padding: 4px 10px; border-radius: 8px;
  background: var(--eg-bg-2); border: 1px solid var(--eg-line);
  font-size: var(--eg-fs-xs); line-height: 1.4; max-width: 100%;
}
.eg-hl-chip .en { font-family: var(--eg-en); font-weight: 700; font-size: 13px; color: var(--eg-ink); }
.eg-hl-chip .zh { color: var(--eg-ink-2); }
.eg-fb.is-phrase .eg-fb-actions {
  flex: 0 0 auto;
  margin-top: 0; padding: 10px 16px;
  border-top: 1px solid var(--eg-line); background: var(--eg-bg-2);
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.eg-fb.is-phrase .eg-fb-actions .eg-kbd { margin-left: auto; }
@container (max-width: 340px) {
  .eg-fb-hero { padding: 11px 13px; gap: 10px; }
  .eg-fb-body { padding: 11px 13px 12px; }
  .eg-fb.is-phrase .eg-fb-actions { padding: 10px 13px; }
  .eg-fb.is-phrase .eg-fb-actions .eg-kbd { display: none; }
}
.eg-cap-row { display: inline-flex; align-items: center; justify-content: center; gap: 7px; flex-wrap: wrap; }
.eg-attempt-pill {
  display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 999px;
  background: color-mix(in srgb, var(--eg-accent) 10%, var(--eg-bg));
  border: 1px solid color-mix(in srgb, var(--eg-accent) 22%, transparent);
  color: var(--eg-ink-2); font: 600 11px/1.3 var(--eg-font); font-variant-numeric: tabular-nums;
}

/* ===== report ===== */
.eg-report { text-align: left; width: 100%; padding-bottom: 22px; }
.eg-report .r-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.eg-rtitle {
  font-family: var(--eg-en); font-size: 22px; line-height: 1.32; font-weight: 700;
  letter-spacing: -.01em; margin: 0; overflow-wrap: break-word; min-width: 0; text-align: left; color: var(--eg-ink);
}
.eg-rmeta-row {
  display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;
  margin-top: 9px;
}
.eg-rmeta {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 10px; border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);
  color: var(--eg-ink-2); font-size: 11.5px; font-weight: 600; font-variant-numeric: tabular-nums;
}
.eg-rrefresh {
  appearance: none; -webkit-appearance: none;
  display: inline-flex; align-items: center; gap: 5px;
  height: 26px; padding: 0 10px; border-radius: 999px;
  border: 1px solid var(--eg-line); background: var(--eg-bg); color: var(--eg-ink-2);
  font: 600 11.5px/1 var(--eg-font); cursor: pointer;
  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease, transform .14s ease;
}
.eg-rrefresh:hover:not(:disabled) { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }
.eg-rrefresh:active:not(:disabled) { transform: scale(.96); }
.eg-rrefresh:disabled { opacity: .48; cursor: not-allowed; }
.eg-rrefresh:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }
.eg-rsum {
  margin: 14px 0 0; padding: 11px 14px;
  border: 1px solid var(--eg-line); border-left: 3px solid var(--eg-accent); border-radius: 10px;
  background: var(--eg-bg-2); color: var(--eg-ink-2);
  font-family: var(--eg-font); font-size: var(--eg-fs-sm); line-height: 1.65; text-align: left;
}
.eg-rp {
  margin: 15px 0 0; width: 100%;
  font-family: var(--eg-en); font-size: 15.5px; line-height: 1.78; color: var(--eg-ink); text-align: left;
}
.eg-practice { margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--eg-line); }
.eg-ptitle {
  display: flex; align-items: center; justify-content: flex-start; gap: 7px;
  font-size: var(--eg-fs-xs); font-weight: 650; letter-spacing: .03em; color: var(--eg-ink-2);
  margin-bottom: 10px;
}
.eg-q {
  margin: 0; padding: 13px 15px; border: 1px solid var(--eg-line); border-radius: 11px;
  background: var(--eg-bg); transition: border-color var(--eg-dur) ease;
}
.eg-q + .eg-q { margin-top: 10px; }
.eg-q.reveal { border-color: var(--eg-line-2); }
.eg-q-head { display: flex; gap: 9px; align-items: flex-start; justify-content: flex-start; text-align: left; }
.eg-q-n {
  flex: 0 0 auto; width: 20px; height: 20px; margin-top: 1px; border-radius: 6px;
  background: var(--eg-bg-2); border: 1px solid var(--eg-line); color: var(--eg-ink);
  display: inline-flex; align-items: center; justify-content: center;
  font: 700 11px/1 var(--eg-font); font-variant-numeric: tabular-nums;
}
.eg-q-zh { font-size: var(--eg-fs-sm); font-weight: 500; line-height: 1.6; color: var(--eg-ink); text-align: left; }
.eg-q-toggle {
  appearance: none; -webkit-appearance: none;
  margin-top: 10px; display: inline-flex; align-items: center; gap: 5px;
  min-height: 27px; padding: 4px 10px; border-radius: 7px;
  background: var(--eg-bg); border: 1px solid var(--eg-line); color: var(--eg-ink-2);
  cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font);
  transition: background var(--eg-dur) ease, color var(--eg-dur) ease, border-color var(--eg-dur) ease;
}
.eg-q-toggle:hover { background: var(--eg-bg-2); border-color: var(--eg-line-2); color: var(--eg-ink); }
.eg-q-toggle:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }
.eg-q-toggle .caret { display: inline-block; transition: transform .22s var(--eg-ease); }
.eg-q.reveal .eg-q-toggle .caret { transform: rotate(90deg); }
.eg-q-en {
  margin-top: 10px; padding: 10px 13px; border-radius: 8px;
  border: 1px solid var(--eg-line); border-left: 2.5px solid var(--eg-accent);
  background: var(--eg-bg-2); font-family: var(--eg-en); font-size: 14.5px; line-height: 1.6;
  color: var(--eg-ink); text-align: left;
}
.eg-report-foot {
  margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--eg-line);
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
}
.eg-report-foot-hint { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.4; }
.eg-report .eg-actions { justify-content: flex-start; margin-top: 18px; }

/* ===== misc ===== */
.eg-loading { display: flex; align-items: center; gap: 9px; color: var(--eg-ink-2); padding: 10px 0; font-size: var(--eg-fs-sm); }
.eg-loading.is-stage {
  flex: 1 1 auto; width: 100%; min-height: 180px;
  flex-direction: column; justify-content: center; gap: 14px;
  padding: 0 0 14px; text-align: center;
  font-size: 14px; font-weight: 500; color: var(--eg-ink-2);
}
.eg-spin { display: inline-block; width: 15px; height: 15px; border: 2px solid var(--eg-line-2); border-top-color: var(--eg-accent); border-radius: 50%; animation: eg-spin .7s linear infinite; }
.eg-loading.is-stage .eg-spin { width: 28px; height: 28px; border-width: 2.5px; }
@keyframes eg-spin { to { transform: rotate(360deg); } }
.eg-resize { position: absolute; right: 0; bottom: 0; width: 18px; height: 18px; cursor: nwse-resize; touch-action: none; }
.eg-resize::after { content: ""; position: absolute; right: 4px; bottom: 4px; width: 9px; height: 9px; border-right: 2px solid var(--eg-line-2); border-bottom: 2px solid var(--eg-line-2); border-bottom-right-radius: 3px; opacity: .7; transition: opacity var(--eg-dur) ease; }
.eg-resize:hover::after { opacity: 1; }

/* ===== word training ===== */
.eg-letters { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
.eg-letters.is-bad { animation: eg-shake .32s cubic-bezier(.36, .07, .19, .97) both; }
@keyframes eg-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  42% { transform: translateX(5px); }
  64% { transform: translateX(-3px); }
  84% { transform: translateX(2px); }
}
.eg-letter {
  flex: 1 1 0; min-width: 8px; max-width: 38px; width: auto; height: 48px; padding: 0; text-align: center;
  border: none; border-bottom: 2px solid var(--eg-line-2); border-radius: 6px 6px 0 0;
  background: transparent; color: var(--eg-ink);
  font: 600 22px/1 var(--eg-font); text-transform: lowercase; outline: none;
  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, color var(--eg-dur) ease, box-shadow var(--eg-dur) ease, transform .14s var(--eg-spring);
}
.eg-letter:hover { border-bottom-color: var(--eg-ink-2); background: var(--eg-bg-2); }
.eg-letter:focus { border-bottom-color: var(--eg-accent); background: var(--eg-bg-2); box-shadow: 0 3px 0 -1px color-mix(in srgb, var(--eg-accent) 26%, transparent); }
.eg-letter.is-pop { animation: eg-letter-pop .16s var(--eg-spring); }
@keyframes eg-letter-pop {
  0% { transform: scale(.9); }
  55% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
.eg-letter.ok { border-bottom-color: var(--eg-ok); color: var(--eg-ok); }
.eg-letters.is-ok .eg-letter.ok {
  animation: eg-letter-ok .34s var(--eg-spring) calc(var(--i, 0) * 34ms) both;
}
@keyframes eg-letter-ok {
  0% { transform: translateY(0) scale(1); }
  45% { transform: translateY(-5px) scale(1.08); }
  100% { transform: translateY(0) scale(1); }
}
.eg-letter.bad { border-bottom-color: var(--eg-bad); color: var(--eg-bad); }
.eg-letters.answered .eg-letter { cursor: default; }
/* word training: centred column */
.eg-word {
  container-type: inline-size;
  width: 100%; max-width: 640px; margin-left: auto; margin-right: auto;
  height: 100%; min-height: 0; display: flex; flex-direction: column; align-items: stretch; text-align: center;
}
.eg-word-main { flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; min-height: 0; overflow-y: auto; padding: 10px 0 6px; }
.eg-word-stage { width: 100%; display: flex; flex-direction: column; align-items: center; }
.eg-word .eg-pos {
  display: inline-flex; align-items: center; margin: 0 0 4px; padding: 3px 10px;
  border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);
  color: var(--eg-ink-2); font: 600 11.5px/1.2 var(--eg-font);
}
.eg-word .eg-zh { font-family: var(--eg-font); font-size: 26px; font-weight: 700; letter-spacing: -.01em; line-height: 1.4; margin-top: 6px; color: var(--eg-ink); }
.eg-word .eg-letters { justify-content: center; margin-top: 18px; width: 100%; }
.eg-word .eg-foot { justify-content: center; width: 100%; margin-top: 24px; }
.eg-word .eg-foot .eg-kbd { margin-left: 0; }
.eg-word .eg-fb {
  width: 100%; text-align: center; margin-top: 14px; padding: 0; border: none; border-radius: 0; background: transparent;
}
.eg-word .eg-fb-top { justify-content: center; }
.eg-word .eg-fb-actions { justify-content: center; }
.eg-word .eg-fb > .eg-fb-actions:first-child { margin-top: 0; gap: 8px; flex-wrap: wrap; justify-content: center; }
.eg-word .eg-fb-actions .eg-btn { padding: 0 10px; }
.eg-word-miss { margin-top: 12px; font-size: var(--eg-fs-xs); font-weight: 550; color: var(--eg-bad); animation: eg-view-in .2s var(--eg-ease) both; }
.eg-word-reveal { width: 100%; }
.eg-word-foot { flex: 0 0 auto; display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--eg-line); }
.eg-word-foot .eg-btn { padding: 0 12px; }
.eg-word .eg-fb-ref {
  margin-top: 8px; padding: 0; background: transparent; font-family: var(--eg-en); font-size: 24px; font-weight: 600; text-align: center;
}
.eg-word .eg-eg {
  width: 100%; max-width: 480px; margin: 12px auto 0; padding: 12px 16px;
  border: 1px solid var(--eg-line); border-radius: 10px; background: var(--eg-bg-2); text-align: center;
  transition: background var(--eg-dur) ease, border-color var(--eg-dur) ease;
}
.eg-word .eg-eg.done { animation: eg-view-in .22s var(--eg-ease) both; }
.eg-word .eg-eg-en { font: 15px/1.65 var(--eg-en); color: var(--eg-ink); overflow-wrap: anywhere; }
.eg-word .eg-eg-zh { margin-top: 5px; font: var(--eg-fs-xs)/1.6 var(--eg-font); color: var(--eg-ink-2); }
.eg-eg-hit {
  padding: 1px 4px; border-radius: 4px;
  background: color-mix(in srgb, var(--eg-accent) 13%, transparent);
  color: var(--eg-ink); font-weight: 700;
}
/* phrase drill: centred prompt, left-aligned reading feedback */
.eg-drill { flex: 1 1 auto; width: 100%; max-width: 640px; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; padding-top: 10px; }
.eg-drill > div { width: 100%; }
.eg-drill .eg-cap { justify-content: center; }
.eg-drill .eg-foot { justify-content: center; width: 100%; }
.eg-drill .eg-foot .eg-kbd { margin-left: 0; }
.eg-drill .eg-inputwrap { width: 100%; }
.eg-drill .eg-input { text-align: left; }
.eg-drill .eg-err { text-align: center; }

/* ===== word bank bar ===== */
.eg-bankbar { width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; padding: 0 0 11px; margin: 0 0 10px; border-bottom: 1px solid var(--eg-line); }
.eg-banklabel { flex: 0 0 auto; font-size: var(--eg-fs-xs); font-weight: 600; color: var(--eg-ink-2); }
@container (max-width: 315px) {
  .eg-banklabel { display: none; }
}
.eg-select {
  flex: 1 1 auto; min-width: 0; max-width: 280px; height: 34px; padding: 0 26px 0 12px; border: 1px solid var(--eg-line);
  border-radius: 999px; background: var(--eg-bg-2); color: var(--eg-ink); cursor: pointer;
  font: 600 var(--eg-fs-xs)/1 var(--eg-font); outline: none; appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--eg-ink-2) 50%), linear-gradient(135deg, var(--eg-ink-2) 50%, transparent 50%);
  background-position: calc(100% - 13px) 13px, calc(100% - 9px) 13px; background-size: 4px 4px, 4px 4px; background-repeat: no-repeat;
  transition: border-color var(--eg-dur) ease, background-color var(--eg-dur) ease;
}
.eg-select:hover { border-color: var(--eg-line-2); }
.eg-select:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-bankbtn { appearance: none; -webkit-appearance: none;
  flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; gap: 4px;
  min-height: 34px; padding: 0 12px; border: 1px solid var(--eg-line); border-radius: 999px;
  background: var(--eg-bg); color: var(--eg-ink-2); cursor: pointer;
  font: 600 var(--eg-fs-xs)/1 var(--eg-font);
  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease, transform .14s ease;
}
.eg-bankbtn:hover { border-color: var(--eg-line-2); color: var(--eg-ink); background: var(--eg-bg-2); }
.eg-bankbtn:active { transform: scale(.95); }
.eg-bankbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-notice { margin: 0 0 12px; padding: 8px 11px; border-radius: 9px; background: color-mix(in srgb, var(--eg-ok) 9%, transparent); border: 1px solid color-mix(in srgb, var(--eg-ok) 28%, transparent); color: var(--eg-ink); font-size: var(--eg-fs-xs); line-height: 1.5; animation: eg-view-in .2s var(--eg-ease) both; }

/* ===== word bank import ===== */
.eg-import { width: 100%; max-width: 520px; margin: 0 auto; text-align: left; animation: eg-view-in .2s var(--eg-ease) both; }
.eg-import-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.eg-import-title { font-size: var(--eg-fs-md); font-weight: 700; color: var(--eg-ink); line-height: 1.3; }
.eg-import-actions { flex: 0 0 auto; display: flex; align-items: center; gap: 6px; }
.eg-import-back, .eg-filebtn { appearance: none; -webkit-appearance: none;
  flex: 0 0 auto; display: inline-flex; align-items: center; min-height: 30px; padding: 4px 10px;
  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg);
  color: var(--eg-ink-2); cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font); white-space: nowrap;
  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease;
}
.eg-import-back:hover, .eg-filebtn:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }
.eg-import-back:focus-visible, .eg-filebtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-import-sub { margin-top: 4px; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.5; }
.eg-field { margin-top: 10px; }
.eg-field label { display: block; margin-bottom: 6px; font-size: var(--eg-fs-xs); font-weight: 600; color: var(--eg-ink-2); }
.eg-text {
  width: 100%; height: 34px; padding: 0 11px; border: 1px solid var(--eg-line); border-radius: 8px;
  background: var(--eg-bg-2); color: var(--eg-ink); font: var(--eg-fs-sm)/1 var(--eg-font); outline: none;
  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, box-shadow var(--eg-dur) ease;
}
.eg-text:hover { border-color: var(--eg-line-2); }
.eg-text:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }
.eg-textarea-wrap { position: relative; margin-top: 10px; }
.eg-textarea {
  width: 100%; min-height: 86px; resize: vertical; padding: 9px 11px; border: 1px solid var(--eg-line); border-radius: 10px;
  background: var(--eg-bg-2); color: var(--eg-ink); font: var(--eg-fs-xs)/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; outline: none;
  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, box-shadow var(--eg-dur) ease;
}
.eg-textarea-wrap.over .eg-textarea, .eg-textarea-wrap:hover .eg-textarea { border-color: var(--eg-accent); background: color-mix(in srgb, var(--eg-accent) 5%, var(--eg-bg-2)); }
.eg-textarea:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }
.eg-preview { margin-top: 12px; border: 1px solid var(--eg-line); border-radius: 10px; overflow: hidden; animation: eg-view-in .2s var(--eg-ease) both; }
.eg-preview-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px; background: var(--eg-bg-2); font-size: var(--eg-fs-xs); color: var(--eg-ink-2); }
.eg-preview-top strong { color: var(--eg-ink); }
.eg-preview-row { display: flex; flex-wrap: wrap; gap: 10px; padding: 7px 10px; border-top: 1px solid var(--eg-line); font-size: var(--eg-fs-xs); line-height: 1.5; }
.eg-preview-row .w { flex: 0 0 38%; font-weight: 650; overflow-wrap: anywhere; }
.eg-preview-row .m { flex: 1 1 auto; color: var(--eg-ink-2); overflow-wrap: anywhere; }
.eg-preview-row .ex { flex: 1 0 100%; color: var(--eg-ink-2); font-family: var(--eg-en); font-style: italic; overflow-wrap: anywhere; }
.eg-preview-errors { margin-top: 8px; padding: 8px 10px; border-radius: 8px; background: color-mix(in srgb, var(--eg-bad) 7%, transparent); border: 1px solid color-mix(in srgb, var(--eg-bad) 24%, transparent); }
.eg-preview-errors .er { font-size: var(--eg-fs-xs); line-height: 1.55; color: var(--eg-bad); }
.eg-import-foot { display: flex; gap: 8px; margin-top: 10px; }

/* ===== settings ===== */
.eg-settings {
  container-type: inline-size;
  display: flex; flex-direction: column; gap: 18px;
}
.eg-setting-section { display: flex; flex-direction: column; gap: 8px; }
.eg-section-head {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 0 2px; min-height: 20px;
}
.eg-section-label {
  font-size: var(--eg-fs-xs); font-weight: 650; color: var(--eg-ink-2);
  letter-spacing: .03em; line-height: 1.2;
}
.eg-active-badge {
  display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 68%;
  padding: 2px 9px; border-radius: 999px;
  background: var(--eg-bg-2); border: 1px solid var(--eg-line);
  font-size: 11px; font-weight: 600; color: var(--eg-ink); line-height: 1.4;
}
.eg-active-badge::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%; flex: 0 0 auto;
  background: var(--eg-accent);
}
.eg-active-badge span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.eg-setting-card {
  border: 1px solid var(--eg-line); border-radius: 12px; background: var(--eg-bg);
  overflow: hidden;
}
.eg-setting-row { padding: 14px 16px; }
.eg-setting-row + .eg-setting-row { border-top: 1px solid var(--eg-line); }
.eg-setting-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.eg-setting-info { min-width: 0; flex: 1 1 auto; }
.eg-setting-title { font-size: 14px; font-weight: 600; color: var(--eg-ink); line-height: 1.35; }
.eg-setting-desc { margin-top: 3px; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.55; }
.eg-setting-desc.eg-lead { margin-top: 0; }
.eg-switch {
  appearance: none; -webkit-appearance: none; position: relative; flex: 0 0 auto;
  width: 40px; height: 22px; padding: 2px; border: 1px solid var(--eg-line-2); border-radius: 999px;
  background: var(--eg-bg-2); cursor: pointer;
  transition: background .2s var(--eg-ease), border-color .2s var(--eg-ease);
}
.eg-switch::after {
  content: ''; display: block; width: 16px; height: 16px; border-radius: 50%;
  background: var(--eg-bg); box-shadow: 0 1px 2px rgba(17, 22, 31, .24);
  transition: transform .24s var(--eg-spring), width .16s ease;
}
.eg-switch:active::after { width: 19px; }
.eg-switch[aria-checked="true"] { background: var(--eg-accent); border-color: var(--eg-accent); }
.eg-switch[aria-checked="true"]::after { transform: translateX(18px); background: var(--eg-on-accent); }
.eg-switch[aria-checked="true"]:active::after { transform: translateX(15px); }
.eg-switch:disabled { opacity: .55; cursor: not-allowed; }
.eg-switch:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }
.eg-setting-sub {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  margin-top: 12px; padding: 10px 12px; border-radius: 9px; background: var(--eg-bg-2);
}
.eg-sub-title { font-size: var(--eg-fs-sm); font-weight: 600; color: var(--eg-ink); line-height: 1.35; }
.eg-stepper {
  display: inline-flex; align-items: center; flex: 0 0 auto;
  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg); overflow: hidden;
}
.eg-stepbtn {
  appearance: none; -webkit-appearance: none; width: 28px; height: 28px; padding: 0;
  border: none; background: transparent; color: var(--eg-ink);
  font: 600 15px/1 var(--eg-font); cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  transition: background var(--eg-dur) ease, color var(--eg-dur) ease;
}
.eg-stepbtn:hover:not(:disabled) { background: var(--eg-bg-2); }
.eg-stepbtn:disabled { opacity: .35; cursor: default; }
.eg-stepbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: -2px; }
.eg-stepper-value {
  min-width: 28px; height: 28px; padding: 0 4px;
  display: inline-flex; align-items: center; justify-content: center;
  border-left: 1px solid var(--eg-line); border-right: 1px solid var(--eg-line);
  font: 650 var(--eg-fs-sm)/1 var(--eg-font); font-variant-numeric: tabular-nums; color: var(--eg-ink);
}
.eg-direction-list {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; margin-top: 12px;
}
@container (min-width: 440px) {
  .eg-direction-list { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
}
@container (max-width: 279px) {
  .eg-direction-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.eg-direction {
  appearance: none; -webkit-appearance: none; text-align: center;
  min-height: 34px; padding: 6px 8px;
  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg);
  color: var(--eg-ink-2); font: 500 12.5px/1.3 var(--eg-font); cursor: pointer;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: background var(--eg-dur) ease, border-color var(--eg-dur) ease, color var(--eg-dur) ease, transform .14s ease;
}
.eg-direction:hover:not(.active):not(:disabled) {
  background: var(--eg-bg-2); border-color: var(--eg-line-2); color: var(--eg-ink);
}
.eg-direction:active:not(:disabled) { transform: scale(.96); }
.eg-direction.active {
  border-color: var(--eg-accent); background: var(--eg-accent);
  color: var(--eg-on-accent); font-weight: 600;
}
.eg-direction:disabled { opacity: .6; cursor: not-allowed; }
.eg-direction:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }
.eg-custom-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.eg-custom-count {
  font-size: 11px; color: var(--eg-ink-2); font-variant-numeric: tabular-nums; flex: 0 0 auto;
}
.eg-custom-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 10px; }
.eg-custom-chip {
  display: inline-flex; align-items: stretch; max-width: 100%;
  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg-2);
  color: var(--eg-ink); overflow: hidden;
  transition: background var(--eg-dur) ease, border-color var(--eg-dur) ease, color var(--eg-dur) ease;
}
.eg-custom-chip:hover { border-color: var(--eg-line-2); }
.eg-custom-chip.active {
  background: var(--eg-accent); border-color: var(--eg-accent); color: var(--eg-on-accent);
}
.eg-custom-select {
  appearance: none; -webkit-appearance: none; min-width: 0;
  padding: 6px 9px 6px 10px; border: none; background: transparent; color: inherit;
  font: 500 12.5px/1.3 var(--eg-font); cursor: pointer;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.eg-custom-chip.active .eg-custom-select { font-weight: 600; }
.eg-custom-select:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: -2px; }
.eg-custom-remove {
  appearance: none; -webkit-appearance: none; flex: 0 0 auto;
  width: 26px; padding: 0; border: none; border-left: 1px solid var(--eg-line);
  background: transparent; color: var(--eg-ink-2);
  font: 600 14px/1 var(--eg-font); cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  transition: background var(--eg-dur) ease, color var(--eg-dur) ease;
}
.eg-custom-remove:hover:not(:disabled) {
  background: color-mix(in srgb, var(--eg-bad) 10%, transparent); color: var(--eg-bad);
}
.eg-custom-chip.active .eg-custom-remove {
  border-left-color: color-mix(in srgb, var(--eg-on-accent) 22%, transparent);
  color: color-mix(in srgb, var(--eg-on-accent) 80%, transparent);
}
.eg-custom-chip.active .eg-custom-remove:hover:not(:disabled) {
  background: color-mix(in srgb, var(--eg-on-accent) 16%, transparent); color: var(--eg-on-accent);
}
.eg-custom-remove:disabled, .eg-custom-select:disabled { opacity: .6; cursor: not-allowed; }
.eg-custom-remove:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: -2px; }
.eg-addrow { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
.eg-addrow .eg-text { flex: 1 1 auto; min-width: 0; height: 34px; padding: 0 11px; border-radius: 8px; }
.eg-addrow .eg-btn { min-height: 34px; height: 34px; min-width: 64px; padding: 0 14px; border-radius: 8px; }
.eg-addrow .eg-btn:disabled { opacity: .4; }
.eg-settings-error {
  padding: 9px 12px; border-radius: 9px;
  background: color-mix(in srgb, var(--eg-bad) 7%, transparent);
  border: 1px solid color-mix(in srgb, var(--eg-bad) 24%, transparent);
  color: var(--eg-bad); font-size: var(--eg-fs-xs); line-height: 1.55;
}
.eg-settings-loading { display: flex; align-items: center; gap: 9px; color: var(--eg-ink-2); font-size: var(--eg-fs-sm); padding: 8px 0; }

/* ===== dashboard ===== */
.eg-dash { container-type: inline-size; display: flex; flex-direction: column; }
.eg-dash-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; }
.eg-dash-title { font: 700 15px/1.2 var(--eg-font); color: var(--eg-ink); white-space: nowrap; }
.eg-dash-nav { display: flex; align-items: center; justify-content: center; gap: 4px; flex: 1 1 100%; }
@container (min-width: 340px) {
  .eg-dash-nav { flex: 0 0 auto; justify-content: flex-end; }
}
.eg-navbtn {
  appearance: none; -webkit-appearance: none; width: 28px; height: 28px; padding: 0;
  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg); color: var(--eg-ink-2);
  cursor: pointer; font: 600 15px/1 var(--eg-font); display: inline-flex; align-items: center; justify-content: center;
  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease, transform .12s ease;
}
.eg-navbtn:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }
.eg-navbtn:active { transform: scale(.93); }
.eg-navbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-month { min-width: 86px; text-align: center; font: 600 var(--eg-fs-sm)/1 var(--eg-font); font-variant-numeric: tabular-nums; color: var(--eg-ink); }
.eg-todaybtn {
  appearance: none; -webkit-appearance: none; height: 28px; padding: 0 9px;
  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg); color: var(--eg-ink-2);
  cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font);
  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease, transform .12s ease;
}
.eg-todaybtn:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }
.eg-todaybtn:active { transform: scale(.95); }
.eg-todaybtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-dash-sum { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin: 14px 0 2px; }
.eg-stat {
  min-width: 0; border: 1px solid var(--eg-line); border-radius: 11px; padding: 10px 6px;
  text-align: center; background: var(--eg-bg);
  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease;
}
.eg-stat:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); }
.eg-stat b { display: block; font: 700 18px/1.15 var(--eg-font); font-variant-numeric: tabular-nums; color: var(--eg-ink); }
.eg-stat span { display: block; margin-top: 3px; font-size: 11.5px; color: var(--eg-ink-2); }
.eg-cal-card { margin-top: 12px; padding: 12px; border: 1px solid var(--eg-line); border-radius: 12px; background: var(--eg-bg); }
.eg-cal { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px; }
.eg-cal .dow { text-align: center; font: 600 11.5px/1 var(--eg-font); color: var(--eg-ink-2); padding: 0 0 4px; }
.eg-day {
  position: relative; aspect-ratio: 1 / 1; border-radius: 8px; border: 1px solid transparent;
  background: var(--eg-bg-2);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px;
  font: 600 var(--eg-fs-xs)/1 var(--eg-font); color: var(--eg-ink-2); font-variant-numeric: tabular-nums;
  transition: transform .16s var(--eg-spring), box-shadow .16s ease, border-color .16s ease;
}
.eg-day.blank { background: transparent; border-color: transparent; }
.eg-day .cnt { font-size: 10px; font-weight: 650; opacity: .88; letter-spacing: 0; line-height: 1; }
.eg-day.l1 { background: color-mix(in srgb, var(--eg-ok) 18%, var(--eg-bg)); color: var(--eg-ink); }
.eg-day.l2 { background: color-mix(in srgb, var(--eg-ok) 38%, var(--eg-bg)); color: var(--eg-ink); }
.eg-day.l3 { background: color-mix(in srgb, var(--eg-ok) 68%, var(--eg-bg)); color: #ffffff; }
.eg-day.l4 { background: var(--eg-ok); color: #ffffff; }
.eg-day.today { border-color: var(--eg-ok); box-shadow: inset 0 0 0 1px var(--eg-ok); }
.eg-day.has { cursor: pointer; }
.eg-day.has:hover { transform: translateY(-1px) scale(1.06); box-shadow: 0 3px 10px rgba(0, 0, 0, .12); z-index: 1; }
.eg-day.has:active { transform: scale(.96); }
.eg-day.has:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-dash-legend { display: flex; align-items: center; justify-content: flex-end; gap: 5px; margin-top: 10px; font-size: 11px; color: var(--eg-ink-2); }
.eg-dash-legend i { width: 11px; height: 11px; border-radius: 3px; background: var(--eg-bg-2); display: inline-block; }
.eg-dash-legend i.l1 { background: color-mix(in srgb, var(--eg-ok) 18%, var(--eg-bg)); }
.eg-dash-legend i.l2 { background: color-mix(in srgb, var(--eg-ok) 38%, var(--eg-bg)); }
.eg-dash-legend i.l3 { background: color-mix(in srgb, var(--eg-ok) 68%, var(--eg-bg)); }
.eg-dash-legend i.l4 { background: var(--eg-ok); }
.eg-hist-title { margin: 20px 0 8px; padding: 0 2px; font: 650 var(--eg-fs-xs)/1.3 var(--eg-font); letter-spacing: .03em; color: var(--eg-ink-2); }
.eg-hist { display: flex; flex-direction: column; gap: 10px; }
.eg-hist-day {
  padding: 13px 15px; border: 1px solid var(--eg-line); border-radius: 12px; background: var(--eg-bg);
  transition: border-color .25s ease, box-shadow .25s ease;
}
.eg-hist-day.is-flash { animation: eg-flash-ring 1.15s var(--eg-ease) both; }
@keyframes eg-flash-ring {
  0% { border-color: var(--eg-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 22%, transparent); }
  70% { border-color: var(--eg-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 12%, transparent); }
  100% { border-color: var(--eg-line); box-shadow: none; }
}
.eg-hist-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.eg-hist-date { font: 650 14px/1.3 var(--eg-font); color: var(--eg-ink); }
.eg-hist-date .wd { margin-left: 6px; font-weight: 500; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); }
.eg-hist-count { flex: 0 0 auto; color: var(--eg-ink-2); font-size: 11.5px; font-variant-numeric: tabular-nums; }
.eg-hist-sub { margin: 11px 0 6px; font: 600 11.5px/1 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em; }
.eg-wchips { display: flex; flex-wrap: wrap; gap: 6px; }
.eg-wchip { display: inline-flex; align-items: baseline; gap: 5px; padding: 3px 9px; border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line); font-size: var(--eg-fs-xs); max-width: 100%; }
.eg-wchip .w { font-weight: 650; color: var(--eg-ink); }
.eg-wchip .m { color: var(--eg-ink-2); overflow-wrap: anywhere; }
.eg-wchip.ok { border-color: color-mix(in srgb, var(--eg-ok) 42%, var(--eg-line)); }
.eg-wchip.bad { border-color: color-mix(in srgb, var(--eg-bad) 42%, var(--eg-line)); }
.eg-sents { display: flex; flex-direction: column; }
.eg-more {
  align-self: flex-start; margin: 9px 0 1px; padding: 4px 10px;
  border: 1px solid var(--eg-line); border-radius: 999px; background: var(--eg-bg);
  color: var(--eg-ink-2); cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font);
  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease;
}
.eg-more:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }
.eg-more:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }
.eg-sent { display: flex; gap: 8px; padding: 8px 0; border-top: 1px dashed var(--eg-line); }
.eg-sent:first-child { border-top: none; padding-top: 4px; }
.eg-sent:last-child { padding-bottom: 2px; }
.eg-sent .mark { flex: 0 0 auto; width: 14px; font-weight: 700; font-size: var(--eg-fs-sm); line-height: 1.55; }
.eg-sent.ok .mark { color: var(--eg-ok); }
.eg-sent.bad .mark { color: var(--eg-bad); }
.eg-sent .body { flex: 1 1 auto; min-width: 0; }
.eg-sent .zh { font-size: var(--eg-fs-sm); line-height: 1.55; color: var(--eg-ink); }
.eg-sent .en { margin-top: 3px; font-family: var(--eg-en); font-size: 13.5px; line-height: 1.55; color: var(--eg-ink-2); overflow-wrap: break-word; }
.eg-dash-empty { padding: 30px 0; text-align: center; color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.7; }
.eg-dash-error { margin-top: 10px; color: var(--eg-bad); font-size: var(--eg-fs-xs); }

@media (prefers-reduced-motion: reduce) {
  .eg-panel, .eg-panel.is-closing, .eg-view, .eg-stage-in, .eg-fb, .eg-fb-ref, .eg-fb-tip, .eg-fb-actions,
  .eg-fb-mine, .eg-fb-corr, .eg-fb-hl,
  .eg-letters.is-bad, .eg-letter.is-pop, .eg-letters.is-ok .eg-letter.ok, .eg-hist-day.is-flash,
  .eg-notice, .eg-import, .eg-preview, .eg-word-miss, .eg-word .eg-eg.done { animation: none !important; }
  .eg-confetti { display: none; }
  .eg-root *, .eg-panel * { transition: none !important; }
}
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
      settings: { confetti: true, topicId: 'ai', customTopics: [], bankLink: true, bankRetries: 1 },
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
      setSettings(s) {
        if (s && typeof s === 'object') {
          this.settings = { ...this.settings, ...s }
          this.emit()
        }
      },
      celebrate() {
        if (this.settings && this.settings.confetti === false) return
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

    function prefersReducedMotion() {
      try {
        return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      } catch {
        return false
      }
    }

    function popElement(el, cls, ms) {
      if (!el || !el.classList || prefersReducedMotion()) return
      try {
        el.classList.remove(cls)
        void el.offsetWidth
        el.classList.add(cls)
        clearTimeout(el.__egPopTimer)
        el.__egPopTimer = setTimeout(() => el.classList.remove(cls), ms)
      } catch {
        /* ignore */
      }
    }

    function useCountUp(target, active) {
      const num = Number(target)
      const [val, setVal] = useState(() => (Number.isFinite(num) ? num : target))
      useEffect(() => {
        if (!active || !Number.isFinite(num) || prefersReducedMotion()) {
          setVal(target)
          return undefined
        }
        let raf = 0
        const dur = 260
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur)
          const eased = 1 - Math.pow(1 - t, 3)
          setVal(Math.round(num * eased))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        setVal(0)
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
      }, [target, num, active])
      return val
    }

    function phraseVerdict(feedback) {
      const score = clamp(Number(feedback && feedback.score) || 0, 0, 100)
      if (feedback && feedback.correct) {
        if (feedback.exact || score >= 98) {
          return { tone: 'ok', title: '完全正确', sub: '表达精准自然，无可挑剔。' }
        }
        if (score >= 88) {
          return { tone: 'ok', title: '表达地道', sub: '语义准确，用词自然流畅。' }
        }
        return { tone: 'ok', title: '译得不错', sub: '核心意思到位，可对照参考打磨细节。' }
      }
      if (score >= 55) {
        return { tone: 'warn', title: '还差一点', sub: '方向已接近，修正细节后再试一次。' }
      }
      if (score > 0) {
        return { tone: 'bad', title: '还需调整', sub: '语义或语法有偏差，对照参考重练一遍。' }
      }
      return { tone: 'bad', title: '暂未得分', sub: '对照原句和参考译文，重新组织英文再试一次。' }
    }

    function ScoreRing({ score, displayScore }) {
      const clamped = clamp(Number(score) || 0, 0, 100)
      const [drawn, setDrawn] = useState(() => prefersReducedMotion())
      useEffect(() => {
        if (prefersReducedMotion()) {
          setDrawn(true)
          return undefined
        }
        setDrawn(false)
        let raf2 = 0
        const raf1 = requestAnimationFrame(() => {
          raf2 = requestAnimationFrame(() => setDrawn(true))
        })
        return () => {
          cancelAnimationFrame(raf1)
          cancelAnimationFrame(raf2)
        }
      }, [clamped])
      const r = 20
      const c = 2 * Math.PI * r
      const offset = drawn ? c * (1 - clamped / 100) : c
      return React.createElement(
        'div',
        { className: 'eg-ring', 'aria-label': '得分 ' + clamped + ' 分' },
        React.createElement(
          'svg',
          { viewBox: '0 0 50 50', 'aria-hidden': 'true' },
          React.createElement('circle', { className: 'eg-ring-track', cx: 25, cy: 25, r }),
          clamped > 0
            ? React.createElement('circle', {
                className: 'eg-ring-arc',
                cx: 25,
                cy: 25,
                r,
                strokeDasharray: c.toFixed(2),
                strokeDashoffset: offset.toFixed(2),
              })
            : null,
        ),
        React.createElement(
          'span',
          { className: 'eg-ring-val' },
          React.createElement('strong', null, displayScore),
          React.createElement('small', null, '分'),
        ),
      )
    }

    function Drill({
      card,
      answer,
      setAnswer,
      submittedAnswer,
      feedback,
      attempt,
      prevScore,
      retryFocusTick,
      busy,
      error,
      onSubmit,
      onRetry,
      onNext,
    }) {
      const [hintOpen, setHintOpen] = useState(false)
      const [copied, setCopied] = useState(false)
      const inputRef = useRef(null)
      const copyTimerRef = useRef(null)
      const displayScore = useCountUp(feedback ? feedback.score : 0, !!feedback)

      useEffect(() => {
        setCopied(false)
        return () => clearTimeout(copyTimerRef.current)
      }, [feedback])

      // Focus and select the previous draft when returning from “再试一次”.
      useEffect(() => {
        if (!retryFocusTick || feedback || !card) return
        const timer = setTimeout(() => {
          try {
            const el = inputRef.current
            if (el) {
              el.focus()
              if (el.select) el.select()
            }
          } catch {
            /* ignore */
          }
        }, 0)
        return () => clearTimeout(timer)
      }, [retryFocusTick, feedback, card])

      // Enter triggers the primary action on the feedback card (retry when missed, next when passed).
      useEffect(() => {
        if (!feedback || busy) return undefined
        const onKeyDown = (e) => {
          if (e.key !== 'Enter' || e.isComposing || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
          const el = e.target
          if (el && el.closest && el.closest('textarea, input, select, button, a')) return
          e.preventDefault()
          if (feedback.correct) onNext()
          else if (onRetry) onRetry()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
      }, [feedback, busy, onNext, onRetry])

      const handleCopy = async () => {
        if (!feedback || !feedback.reference) return
        const ok = await copyToClipboard(feedback.reference)
        if (!ok) return
        setCopied(true)
        clearTimeout(copyTimerRef.current)
        copyTimerRef.current = setTimeout(() => setCopied(false), 1600)
      }

      if (feedback) {
        const ok = !!feedback.correct
        const verdict = phraseVerdict(feedback)
        const promptZh = feedback.zh || (card && card.zh) || ''
        const mine = String(submittedAnswer !== undefined ? submittedAnswer : answer || '').trim()
        const reference = feedback.reference || ''
        const corrected = feedback.corrected || ''
        const score = clamp(Number(feedback.score) || 0, 0, 100)
        const hasEnglishAttempt = /[a-zA-Z]{2,}/.test(mine)
        const showCorrected =
          score >= 40 &&
          hasEnglishAttempt &&
          corrected &&
          normalizeEnglish(corrected) !== normalizeEnglish(reference) &&
          normalizeEnglish(corrected) !== normalizeEnglish(mine)
        const bankWords =
          Array.isArray(feedback.bankWords) && feedback.bankWords.length
            ? feedback.bankWords
            : card && Array.isArray(card.bankWords)
              ? card.bankWords
              : []
        const refParts = reference && bankWords.length ? splitByTerms(reference, bankWords) : [reference || '—']
        const highlights = Array.isArray(feedback.highlights) ? feedback.highlights : []
        const delta = prevScore !== null && prevScore !== undefined ? score - prevScore : 0
        const canRetry = !!(card && onRetry)

        return React.createElement(
          'div',
          { className: 'eg-fb is-phrase ' + verdict.tone, 'data-nodrag': 'true' },
          React.createElement(
            'div',
            { className: 'eg-fb-hero' },
            React.createElement(ScoreRing, { score, displayScore }),
            React.createElement(
              'div',
              { className: 'eg-fb-verdict' },
              React.createElement(
                'div',
                { className: 'eg-fb-headline' },
                React.createElement('span', { className: 'eg-fb-status' }, verdict.title),
                feedback.exact ? React.createElement('span', { className: 'eg-fb-pill tone' }, '完全匹配') : null,
                attempt > 1 ? React.createElement('span', { className: 'eg-fb-pill' }, '第 ' + attempt + ' 次尝试') : null,
                delta > 0 ? React.createElement('span', { className: 'eg-fb-pill up' }, '↑ +' + delta + ' 分') : null,
              ),
              React.createElement('div', { className: 'eg-fb-sub' }, verdict.sub),
            ),
          ),
          React.createElement(
            'div',
            { className: 'eg-fb-body' },
            promptZh
              ? React.createElement(
                  'div',
                  { className: 'eg-fb-prompt' },
                  React.createElement('span', { className: 'eg-fb-tag' }, '原句'),
                  React.createElement('span', { className: 'eg-fb-zh' }, promptZh),
                )
              : null,
            React.createElement(
              'div',
              { className: 'eg-fb-mine' },
              React.createElement(
                'div',
                { className: 'eg-fb-boxhead' },
                React.createElement(
                  'span',
                  { className: 'lbl' },
                  React.createElement('span', { 'aria-hidden': 'true' }, ok ? '✓' : '✗'),
                  '你的作答',
                ),
              ),
              React.createElement(
                'div',
                { className: 'eg-fb-mine-text' + (mine ? '' : ' empty') },
                mine || '（未输入有效内容）',
              ),
            ),
            React.createElement(
              'div',
              { className: 'eg-fb-ref' },
              React.createElement(
                'div',
                { className: 'eg-fb-boxhead' },
                React.createElement(
                  'div',
                  { className: 'eg-fb-boxhead-left' },
                  React.createElement('span', { className: 'lbl' }, '参考译文'),
                  bankWords.length
                    ? React.createElement('span', { className: 'eg-fb-banktag', title: '融入的词库词' }, '词库 · ' + bankWords.join(' / '))
                    : null,
                ),
                reference
                  ? React.createElement(
                      'button',
                      {
                        type: 'button',
                        className: 'eg-copybtn' + (copied ? ' copied' : ''),
                        onClick: handleCopy,
                        title: '复制参考译文',
                      },
                      copied ? '已复制 ✓' : '复制',
                    )
                  : null,
              ),
              React.createElement(
                'div',
                { className: 'eg-fb-ref-text' },
                refParts.map((part, i) =>
                  i % 2 ? React.createElement('mark', { className: 'eg-eg-hit', key: i }, part) : React.createElement('span', { key: i }, part),
                ),
              ),
            ),
            showCorrected
              ? React.createElement(
                  'div',
                  { className: 'eg-fb-corr' },
                  React.createElement(
                    'div',
                    { className: 'eg-fb-boxhead' },
                    React.createElement('span', { className: 'lbl' }, '贴近你思路的改写'),
                  ),
                  React.createElement('div', { className: 'eg-fb-corr-text' }, corrected),
                )
              : null,
            feedback.tip
              ? React.createElement(
                  'div',
                  { className: 'eg-fb-tip' },
                  React.createElement('span', { className: 'b' }, '点评'),
                  React.createElement('span', null, feedback.tip),
                )
              : null,
            highlights.length
              ? React.createElement(
                  'div',
                  { className: 'eg-fb-hl' },
                  React.createElement('div', { className: 'eg-fb-hl-lbl' }, '核心表达'),
                  React.createElement(
                    'div',
                    { className: 'eg-fb-hl-list' },
                    highlights.map((item, i) =>
                      React.createElement(
                        'span',
                        { className: 'eg-hl-chip', key: i },
                        React.createElement('span', { className: 'en' }, item.en),
                        React.createElement('span', { className: 'zh' }, item.zh),
                      ),
                    ),
                  ),
                )
              : null,
          ),
          React.createElement(
            'div',
            { className: 'eg-fb-actions' },
            ok
              ? [
                  React.createElement(
                    'button',
                    {
                      key: 'next',
                      className: 'eg-btn primary',
                      onClick: onNext,
                      onPointerDown: bounceButton,
                      disabled: busy,
                      title: '回车下一题',
                      'aria-keyshortcuts': 'Enter',
                    },
                    '下一题 →',
                  ),
                  canRetry
                    ? React.createElement(
                        'button',
                        { key: 'retry', className: 'eg-btn', onClick: onRetry, disabled: busy },
                        '↺ 再试一次',
                      )
                    : null,
                ]
              : [
                  canRetry
                    ? React.createElement(
                        'button',
                        {
                          key: 'retry',
                          className: 'eg-btn primary',
                          onClick: onRetry,
                          onPointerDown: bounceButton,
                          disabled: busy,
                          title: '回车再试一次',
                          'aria-keyshortcuts': 'Enter',
                        },
                        '↺ 再试一次',
                      )
                    : null,
                  React.createElement(
                    'button',
                    { key: 'next', className: canRetry ? 'eg-btn' : 'eg-btn primary', onClick: onNext, disabled: busy },
                    '下一题 →',
                  ),
                ],
            React.createElement(
              'span',
              { className: 'eg-kbd', title: ok ? '按 Enter 进入下一题' : '按 Enter 再试一次' },
              React.createElement('kbd', null, '↵'),
              ' ',
              ok ? '下一题' : '再试',
            ),
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
          { className: 'eg-loading is-stage' },
          React.createElement('span', { className: 'eg-spin' }),
          '正在出题…',
        )
      }

      return React.createElement(
        'div',
        { className: 'eg-stage-in' },
        React.createElement(
          'div',
          { className: 'eg-cap eg-cap-row' },
          React.createElement('span', null, '把这句话译成英文'),
          attempt > 0 ? React.createElement('span', { className: 'eg-attempt-pill' }, '第 ' + (attempt + 1) + ' 次尝试') : null,
        ),
        React.createElement('div', { className: 'eg-zh' }, card.zh),
        card.hint
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(
                'button',
                {
                  className: 'eg-hintbtn',
                  'aria-expanded': hintOpen ? 'true' : 'false',
                  onClick: () => setHintOpen((v) => !v),
                  type: 'button',
                },
                React.createElement('span', { className: 'caret', 'aria-hidden': 'true' }, '▸'),
                '提示',
              ),
              React.createElement(
                'div',
                {
                  className: 'eg-collapse eg-hint-collapse' + (hintOpen ? ' open' : ''),
                  'aria-hidden': hintOpen ? 'false' : 'true',
                },
                React.createElement(
                  'div',
                  { className: 'eg-collapse-inner' },
                  React.createElement('div', { className: 'eg-hintbox' }, card.hint),
                ),
              ),
            )
          : null,
        React.createElement(
          'div',
          { className: 'eg-inputwrap' },
          React.createElement('textarea', {
            ref: inputRef,
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
      const [openMap, setOpenMap] = useState({})
      useEffect(() => {
        setOpenMap({})
      }, [report])

      if (loading && !report) {
        return React.createElement(
          'div',
          { className: 'eg-loading is-stage' },
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
      const wordCount = (String(report.body || '').match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length
      const meta = [report.date, report.level, wordCount ? wordCount + ' 词' : ''].filter(Boolean).join(' · ')
      return React.createElement(
        'div',
        { className: 'eg-report eg-stage-in', 'data-nodrag': 'true' },
        React.createElement('div', { className: 'r-top' }, React.createElement('h2', { className: 'eg-rtitle' }, report.title || 'Daily Report')),
        React.createElement(
          'div',
          { className: 'eg-rmeta-row' },
          meta ? React.createElement('div', { className: 'eg-rmeta' }, meta) : React.createElement('span', null),
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'eg-rrefresh',
              onClick: onRefresh,
              disabled: loading,
              title: '重新生成一篇今日报告',
            },
            loading ? '生成中…' : '↻ 换一篇',
          ),
        ),
        report.summary_zh ? React.createElement('p', { className: 'eg-rsum' }, report.summary_zh) : null,
        paragraphs.map((p, i) => React.createElement('p', { key: i, className: 'eg-rp' }, p)),
        questions.length
          ? React.createElement(
              'div',
              { className: 'eg-practice' },
              React.createElement('div', { className: 'eg-ptitle' }, '练一练'),
              questions.map((q, i) => {
                const isOpen = !!openMap[i]
                return React.createElement(
                  'div',
                  { key: i, className: 'eg-q' + (isOpen ? ' reveal' : '') },
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
                      'aria-expanded': isOpen ? 'true' : 'false',
                      onClick: () => setOpenMap((prev) => ({ ...prev, [i]: !prev[i] })),
                    },
                    React.createElement('span', { className: 'caret', 'aria-hidden': 'true' }, '▸'),
                    isOpen ? '收起参考' : '看参考',
                  ),
                  React.createElement(
                    'div',
                    { className: 'eg-collapse' + (isOpen ? ' open' : ''), 'aria-hidden': isOpen ? 'false' : 'true' },
                    React.createElement(
                      'div',
                      { className: 'eg-collapse-inner' },
                      React.createElement('div', { className: 'eg-q-en' }, q.en),
                    ),
                  ),
                )
              }),
            )
          : null,
        React.createElement(
          'div',
          { className: 'eg-report-foot' },
          React.createElement('span', { className: 'eg-report-foot-hint' }, '按当前内容方向生成，可随时换一篇'),
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'eg-btn',
              onClick: onRefresh,
              onPointerDown: bounceButton,
              disabled: loading,
            },
            loading ? '生成中…' : '↻ 换一篇',
          ),
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
                    item.example ? h('span', { className: 'ex' }, item.example) : null,
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

    // Blanked before answering; full sentence with the target highlighted after.
    function ExampleBlock({ example, exampleZh, word, highlight }) {
      const en = String(example || '')
      const zh = String(exampleZh || '')
      if (!en && !zh) return null
      const parts = en && highlight && word ? splitByWord(en, word) : [en]
      return h(
        'div',
        { className: 'eg-eg' + (highlight ? ' done' : '') },
        en
          ? h(
              'div',
              { className: 'eg-eg-en' },
              parts.map((part, i) =>
                i % 2 ? h('mark', { className: 'eg-eg-hit', key: i }, part) : h('span', { key: i }, part),
              ),
            )
          : null,
        zh ? h('div', { className: 'eg-eg-zh' }, zh) : null,
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
        if (ch) popElement(refs.current[i], 'is-pop', 180)
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
          style: { fontSize: letterFont, '--i': i },
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
        React.createElement(
          'div',
          { className: 'eg-word-main' },
          React.createElement(
            'div',
            { className: 'eg-word-stage eg-stage-in', key: item.id },
            item.pos ? React.createElement('div', { className: 'eg-pos', title: '词性提示' }, formatPos(item.pos)) : null,
            React.createElement('div', { className: 'eg-zh' }, item.zh),
            !answered ? React.createElement(ExampleBlock, { example: item.example }) : null,
            React.createElement(
              'div',
              {
                className: 'eg-letters' + (answered ? ' answered' + (ok ? ' is-ok' : ' is-bad') : ''),
                style: { gap: letterGap },
              },
              cellsNodes,
            ),
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
                    React.createElement(ExampleBlock, {
                      example: res.example,
                      exampleZh: res.exampleZh,
                      word: res.reference,
                      highlight: true,
                    }),
                  )
                : React.createElement(
                    'div',
                    { className: 'eg-fb bad' },
                    !revealed
                      ? React.createElement('div', { className: 'eg-word-miss' }, '拼写有误，可再试一次或查看答案')
                      : null,
                    React.createElement(
                      'div',
                      {
                        className: 'eg-collapse eg-word-reveal' + (revealed ? ' open' : ''),
                        'aria-hidden': revealed ? 'false' : 'true',
                      },
                      React.createElement(
                        'div',
                        { className: 'eg-collapse-inner' },
                        React.createElement(
                          'div',
                          { className: 'eg-fb-ref' },
                          React.createElement('span', { className: 'lbl' }, '正确拼写'),
                          res.reference,
                        ),
                        React.createElement(ExampleBlock, {
                          example: res.example,
                          exampleZh: res.exampleZh,
                          word: res.reference,
                          highlight: true,
                        }),
                      ),
                    ),
                  )
              : null,
          ),
        ),
        footerActions,
      )
    }

    // Settings tab: celebration toggle + content directions.
    function SettingsPanel({ onTopicChange }) {
      const shared = useShared()
      const [data, setData] = useState(null)
      const [busy, setBusy] = useState(false)
      const [error, setError] = useState('')
      const [draft, setDraft] = useState('')
      const [loading, setLoading] = useState(true)

      const load = useCallback(async () => {
        setLoading(true)
        try {
          const result = await api('/settings')
          setData(result)
          store.setSettings(result.settings)
          setError('')
        } catch (e) {
          setError(e.message || '设置加载失败')
        } finally {
          setLoading(false)
        }
      }, [])

      useEffect(() => {
        load()
      }, [load])

      const save = useCallback(
        async (patch, topicChanged) => {
          if (busy) return false
          setBusy(true)
          setError('')
          try {
            const result = await api('/settings', {
              method: 'POST',
              body: JSON.stringify(patch),
            })
            setData(result)
            store.setSettings(result.settings)
            if (topicChanged && typeof onTopicChange === 'function') onTopicChange()
            return true
          } catch (e) {
            setError(e.message || '设置保存失败')
            return false
          } finally {
            setBusy(false)
          }
        },
        [busy, onTopicChange],
      )

      const settings = data ? data.settings : shared.settings
      const directions = data ? data.directions : []
      const customTopics = settings.customTopics || []
      const activeId = settings.topicId

      const chooseDirection = (id) => {
        if (busy || id === activeId) return
        save({ topicId: id }, true)
      }

      const addCustom = async () => {
        const label = draft.trim()
        if (!label || busy) return
        const ok = await save({ customTopics: customTopics.concat({ label }) }, true)
        if (ok) setDraft('')
      }

      const removeCustom = (id) => {
        if (busy) return
        save({ customTopics: customTopics.filter((item) => item.id !== id) }, true)
      }

      const setRetries = (value) => {
        if (busy) return
        const next = Math.max(0, Math.min(5, Number(value) || 0))
        if (next === settings.bankRetries) return
        save({ bankRetries: next }, false)
      }

      if (loading && !data) {
        return React.createElement(
          'div',
          { className: 'eg-settings' },
          React.createElement(
            'div',
            { className: 'eg-settings-loading' },
            React.createElement('span', { className: 'eg-spin' }),
            '正在加载设置…',
          ),
          error ? React.createElement('div', { className: 'eg-settings-error' }, error) : null,
        )
      }

      const builtinDirections = directions.filter((item) => item.builtin !== false)
      const customDirections = directions.filter((item) => item.builtin === false)
      const activeDirection = directions.find((item) => item.id === activeId)

      return React.createElement(
        'div',
        { className: 'eg-settings' },
        React.createElement(
          'div',
          { className: 'eg-setting-section' },
          React.createElement(
            'div',
            { className: 'eg-section-head' },
            React.createElement('div', { className: 'eg-section-label' }, '练习偏好'),
          ),
          React.createElement(
            'div',
            { className: 'eg-setting-card' },
            React.createElement(
              'div',
              { className: 'eg-setting-row' },
              React.createElement(
                'div',
                { className: 'eg-setting-head' },
                React.createElement(
                  'div',
                  { className: 'eg-setting-info' },
                  React.createElement('div', { className: 'eg-setting-title' }, '庆祝效果'),
                  React.createElement('div', { className: 'eg-setting-desc' }, '答对时从四周喷射彩带。'),
                ),
                React.createElement('button', {
                  type: 'button',
                  className: 'eg-switch',
                  role: 'switch',
                  'aria-checked': settings.confetti ? 'true' : 'false',
                  'aria-label': '彩带庆祝',
                  disabled: busy,
                  onClick: () => save({ confetti: !settings.confetti }, false),
                }),
              ),
            ),
            React.createElement(
              'div',
              { className: 'eg-setting-row' },
              React.createElement(
                'div',
                { className: 'eg-setting-head' },
                React.createElement(
                  'div',
                  { className: 'eg-setting-info' },
                  React.createElement('div', { className: 'eg-setting-title' }, '词库关联'),
                  React.createElement(
                    'div',
                    { className: 'eg-setting-desc' },
                    '开启后，短语出题和今日报告会从当前词库挑词，自然融入句子和文章（不硬塞）。',
                  ),
                ),
                React.createElement('button', {
                  type: 'button',
                  className: 'eg-switch',
                  role: 'switch',
                  'aria-checked': settings.bankLink ? 'true' : 'false',
                  'aria-label': '词库关联',
                  disabled: busy,
                  onClick: () => save({ bankLink: !settings.bankLink }, false),
                }),
              ),
              React.createElement(
                'div',
                {
                  className: 'eg-collapse' + (settings.bankLink ? ' open' : ''),
                  'aria-hidden': settings.bankLink ? 'false' : 'true',
                },
                React.createElement(
                  'div',
                  { className: 'eg-collapse-inner' },
                  React.createElement(
                    'div',
                    { className: 'eg-setting-sub' },
                    React.createElement(
                      'div',
                      { className: 'eg-setting-info' },
                      React.createElement('div', { className: 'eg-sub-title' }, '重试次数'),
                      React.createElement(
                        'div',
                        { className: 'eg-setting-desc' },
                        '生成的句子或文章没用到词库词时，再试几次（0–5）。',
                      ),
                    ),
                    React.createElement(
                      'div',
                      { className: 'eg-stepper' },
                      React.createElement(
                        'button',
                        {
                          type: 'button',
                          className: 'eg-stepbtn',
                          'aria-label': '减少重试次数',
                          tabIndex: settings.bankLink ? undefined : -1,
                          disabled: busy || !settings.bankLink || settings.bankRetries <= 0,
                          onClick: () => setRetries(settings.bankRetries - 1),
                        },
                        '−',
                      ),
                      React.createElement('span', { className: 'eg-stepper-value' }, String(settings.bankRetries)),
                      React.createElement(
                        'button',
                        {
                          type: 'button',
                          className: 'eg-stepbtn',
                          'aria-label': '增加重试次数',
                          tabIndex: settings.bankLink ? undefined : -1,
                          disabled: busy || !settings.bankLink || settings.bankRetries >= 5,
                          onClick: () => setRetries(settings.bankRetries + 1),
                        },
                        '+',
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        React.createElement(
          'div',
          { className: 'eg-setting-section' },
          React.createElement(
            'div',
            { className: 'eg-section-head' },
            React.createElement('div', { className: 'eg-section-label' }, '内容方向'),
            activeDirection
              ? React.createElement(
                  'div',
                  { className: 'eg-active-badge', title: '当前方向：' + activeDirection.label },
                  React.createElement('span', null, activeDirection.label),
                )
              : null,
          ),
          React.createElement(
            'div',
            { className: 'eg-setting-card' },
            React.createElement(
              'div',
              { className: 'eg-setting-row' },
              React.createElement(
                'div',
                { className: 'eg-setting-desc eg-lead' },
                '用于生成短语和今日报告；切换后下一题、下一篇生效。',
              ),
              React.createElement(
                'div',
                { className: 'eg-direction-list' },
                builtinDirections.map((item) =>
                  React.createElement(
                    'button',
                    {
                      type: 'button',
                      key: item.id,
                      className: 'eg-direction' + (item.id === activeId ? ' active' : ''),
                      'aria-pressed': item.id === activeId ? 'true' : 'false',
                      disabled: busy,
                      title: item.label,
                      onClick: () => chooseDirection(item.id),
                    },
                    item.label,
                  ),
                ),
              ),
            ),
            React.createElement(
              'div',
              { className: 'eg-setting-row' },
              React.createElement(
                'div',
                { className: 'eg-custom-head' },
                React.createElement('div', { className: 'eg-sub-title' }, '自定义方向'),
                React.createElement(
                  'span',
                  { className: 'eg-custom-count' },
                  customTopics.length ? customTopics.length + ' / 40' : '最多 40 个',
                ),
              ),
              React.createElement(
                'div',
                { className: 'eg-setting-desc' },
                '添加你自己的主题，点击即可切换，与内置方向一样用于生成内容。',
              ),
              customDirections.length
                ? React.createElement(
                    'div',
                    { className: 'eg-custom-chips' },
                    customDirections.map((item) =>
                      React.createElement(
                        'div',
                        {
                          className: 'eg-custom-chip' + (item.id === activeId ? ' active' : ''),
                          key: item.id,
                        },
                        React.createElement(
                          'button',
                          {
                            type: 'button',
                            className: 'eg-custom-select',
                            'aria-pressed': item.id === activeId ? 'true' : 'false',
                            disabled: busy,
                            title: item.label,
                            onClick: () => chooseDirection(item.id),
                          },
                          item.label,
                        ),
                        React.createElement(
                          'button',
                          {
                            type: 'button',
                            className: 'eg-custom-remove',
                            title: '删除方向',
                            'aria-label': '删除 ' + item.label,
                            disabled: busy,
                            onClick: () => removeCustom(item.id),
                          },
                          '×',
                        ),
                      ),
                    ),
                  )
                : null,
              React.createElement(
                'div',
                { className: 'eg-addrow' },
                React.createElement('input', {
                  className: 'eg-text',
                  value: draft,
                  maxLength: 40,
                  placeholder: '例如：摄影与视觉',
                  'aria-label': '自定义方向名称',
                  onChange: (e) => setDraft(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === 'Enter') addCustom()
                  },
                }),
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'eg-btn primary',
                    disabled: busy || !draft.trim(),
                    onClick: addCustom,
                  },
                  '添加',
                ),
              ),
            ),
          ),
        ),
        error ? React.createElement('div', { className: 'eg-settings-error' }, error) : null,
      )
    }

    // Data dashboard: a calendar of study activity + each day's words & sentences.
    const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
    function pad2(n) {
      return String(n).padStart(2, '0')
    }

    function Dashboard() {
      const [data, setData] = useState(null)
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState('')
      const [cursor, setCursor] = useState(() => {
        const d = new Date()
        return { y: d.getFullYear(), m: d.getMonth() }
      })
      const [expanded, setExpanded] = useState({})
      const [flashDay, setFlashDay] = useState('')
      const flashTimerRef = useRef(null)
      const toggleGroup = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
      const WORD_LIMIT = 10
      const PHRASE_LIMIT = 5

      useEffect(() => {
        return () => clearTimeout(flashTimerRef.current)
      }, [])

      const load = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
          setData(await api('/dashboard'))
        } catch (e) {
          setError(e.message || '看板加载失败')
        } finally {
          setLoading(false)
        }
      }, [])

      useEffect(() => {
        load()
      }, [load])

      const activity = {}
      if (data && Array.isArray(data.activity)) {
        for (const a of data.activity) activity[a.day] = a
      }
      const records = data && Array.isArray(data.days) ? data.days : []
      const today = data ? data.today : null
      const streak = data ? data.streak || 0 : 0
      const totals = data && data.totals ? data.totals : { days: 0, words: 0, phrases: 0 }

      const { y, m } = cursor
      const startDow = (new Date(y, m, 1).getDay() + 6) % 7 // Monday-first
      const daysInMonth = new Date(y, m + 1, 0).getDate()
      const cells = []
      for (let i = 0; i < startDow; i += 1) cells.push(null)
      for (let d = 1; d <= daysInMonth; d += 1) cells.push(d)
      while (cells.length % 7 !== 0) cells.push(null)
      const dayStr = (d) => y + '-' + pad2(m + 1) + '-' + pad2(d)
      const levelOf = (n) => (n > 60 ? 4 : n >= 31 ? 3 : n >= 11 ? 2 : n >= 1 ? 1 : 0)

      const goMonth = (delta) =>
        setCursor((c) => {
          let mm = c.m + delta
          let yy = c.y
          if (mm < 0) {
            mm = 11
            yy -= 1
          }
          if (mm > 11) {
            mm = 0
            yy += 1
          }
          return { y: yy, m: mm }
        })
      const goToday = () => {
        const d = new Date()
        setCursor({ y: d.getFullYear(), m: d.getMonth() })
      }
      const jumpTo = (day) => {
        try {
          const el = document.getElementById('eg-hist-' + day)
          if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start', behavior: 'smooth' })
        } catch {
          /* ignore */
        }
        setFlashDay('')
        clearTimeout(flashTimerRef.current)
        setTimeout(() => {
          setFlashDay(day)
          flashTimerRef.current = setTimeout(() => setFlashDay(''), 1200)
        }, 20)
      }

      const dowNodes = ['一', '二', '三', '四', '五', '六', '日'].map((w, i) =>
        React.createElement('div', { className: 'dow', key: 'dow' + i }, w),
      )
      const cellNodes = cells.map((d, i) => {
        if (!d) return React.createElement('div', { className: 'eg-day blank', key: 'b' + i })
        const key = dayStr(d)
        const a = activity[key]
        const lv = a ? levelOf(a.total) : 0
        const cls = ['eg-day']
        if (lv) cls.push('l' + lv, 'has')
        if (key === today) cls.push('today')
        return React.createElement(
          'div',
          {
            key,
            className: cls.join(' '),
            title: a ? key + ' · 单词 ' + a.words + ' · 句子 ' + a.phrases : key,
            onClick: a ? () => jumpTo(key) : undefined,
            role: a ? 'button' : undefined,
            tabIndex: a ? 0 : undefined,
            onKeyDown: a
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    jumpTo(key)
                  }
                }
              : undefined,
          },
          React.createElement('span', { className: 'n' }, d),
          a ? React.createElement('span', { className: 'cnt' }, a.total) : null,
        )
      })

      const recordNodes = records.map((rec) => {
        const dt = new Date(rec.day + 'T00:00:00')
        const wd = WEEKDAYS[dt.getDay()]
        const t = rec.totals || {}
        const allWords = rec.words || []
        const allPhrases = rec.phrases || []
        const wKey = rec.day + ':w'
        const pKey = rec.day + ':p'
        const words = expanded[wKey] ? allWords : allWords.slice(0, WORD_LIMIT)
        const phrases = expanded[pKey] ? allPhrases : allPhrases.slice(0, PHRASE_LIMIT)
        const moreBtn = (key, total, limit, open) =>
          total > limit
            ? React.createElement(
                'button',
                { className: 'eg-more', key: 'more', onClick: () => toggleGroup(key) },
                open ? '收起' : '展开全部 · 共 ' + total + ' 条',
              )
            : null
        return React.createElement(
          'div',
          { className: 'eg-hist-day' + (flashDay === rec.day ? ' is-flash' : ''), id: 'eg-hist-' + rec.day, key: rec.day },
          React.createElement(
            'div',
            { className: 'eg-hist-head' },
            React.createElement(
              'div',
              { className: 'eg-hist-date' },
              dt.getMonth() + 1 + '月' + dt.getDate() + '日',
              React.createElement('span', { className: 'wd' }, '周' + wd),
            ),
            React.createElement('div', { className: 'eg-hist-count' }, '单词 ' + (t.words || 0) + ' · 句子 ' + (t.phrases || 0)),
          ),
          allWords.length
            ? React.createElement(
                'div',
                null,
                React.createElement('div', { className: 'eg-hist-sub' }, '单词'),
                React.createElement(
                  'div',
                  { className: 'eg-wchips' },
                  words.map((w, i) =>
                    React.createElement(
                      'span',
                      { className: 'eg-wchip ' + (w.ok ? 'ok' : 'bad'), key: 'w' + i, title: w.ok ? '拼对了' : '没拼对' },
                      React.createElement('span', { className: 'w' }, w.en),
                      w.zh ? React.createElement('span', { className: 'm' }, w.zh) : null,
                    ),
                  ),
                ),
                moreBtn(wKey, allWords.length, WORD_LIMIT, !!expanded[wKey]),
              )
            : null,
          allPhrases.length
            ? React.createElement(
                'div',
                null,
                React.createElement('div', { className: 'eg-hist-sub' }, '句子'),
                React.createElement(
                  'div',
                  { className: 'eg-sents' },
                  phrases.map((p, i) =>
                    React.createElement(
                      'div',
                      { className: 'eg-sent ' + (p.ok ? 'ok' : 'bad'), key: 'p' + i },
                      React.createElement('span', { className: 'mark' }, p.ok ? '✓' : '✗'),
                      React.createElement(
                        'div',
                        { className: 'body' },
                        React.createElement('div', { className: 'zh' }, p.zh),
                        p.en ? React.createElement('div', { className: 'en' }, p.en) : null,
                      ),
                    ),
                  ),
                ),
                moreBtn(pKey, allPhrases.length, PHRASE_LIMIT, !!expanded[pKey]),
              )
            : null,
        )
      })

      if (loading && !data) {
        return React.createElement(
          'div',
          { className: 'eg-dash' },
          React.createElement('div', { className: 'eg-loading' }, React.createElement('span', { className: 'eg-spin' }), '正在加载看板…'),
        )
      }

      return React.createElement(
        'div',
        { className: 'eg-dash' },
        React.createElement(
          'div',
          { className: 'eg-dash-top' },
          React.createElement('div', { className: 'eg-dash-title' }, '学习看板'),
          React.createElement(
            'div',
            { className: 'eg-dash-nav' },
            React.createElement('button', { className: 'eg-navbtn', onClick: () => goMonth(-1), 'aria-label': '上个月', title: '上个月' }, '‹'),
            React.createElement('span', { className: 'eg-month' }, y + ' 年 ' + (m + 1) + ' 月'),
            React.createElement('button', { className: 'eg-navbtn', onClick: () => goMonth(1), 'aria-label': '下个月', title: '下个月' }, '›'),
            React.createElement('button', { className: 'eg-todaybtn', onClick: goToday, title: '回到今天' }, '今天'),
          ),
        ),
        React.createElement(
          'div',
          { className: 'eg-dash-sum' },
          React.createElement('div', { className: 'eg-stat' }, React.createElement('b', null, streak), React.createElement('span', { title: '连续学习天数' }, '连续')),
          React.createElement('div', { className: 'eg-stat' }, React.createElement('b', null, totals.words || 0), React.createElement('span', { title: '累计单词' }, '单词')),
          React.createElement('div', { className: 'eg-stat' }, React.createElement('b', null, totals.phrases || 0), React.createElement('span', { title: '累计句子' }, '句子')),
          React.createElement('div', { className: 'eg-stat' }, React.createElement('b', null, totals.days || 0), React.createElement('span', { title: '累计学习天数' }, '累计')),
        ),
        React.createElement(
          'div',
          { className: 'eg-cal-card' },
          React.createElement('div', { className: 'eg-cal' }, dowNodes.concat(cellNodes)),
          React.createElement(
            'div',
            { className: 'eg-dash-legend' },
            '少',
            React.createElement('i', { className: 'l1' }),
            React.createElement('i', { className: 'l2' }),
            React.createElement('i', { className: 'l3' }),
            React.createElement('i', { className: 'l4' }),
            '多',
          ),
        ),
        error ? React.createElement('div', { className: 'eg-dash-error' }, error) : null,
        records.length
          ? React.createElement(
              'div',
              null,
              React.createElement('div', { className: 'eg-hist-title' }, '每日学习记录'),
              React.createElement('div', { className: 'eg-hist' }, recordNodes),
            )
          : React.createElement('div', { className: 'eg-dash-empty' }, loading ? '正在加载…' : '还没有学习记录，去练几题吧。'),
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
          React.createElement('span', { className: 'eg-mono' }, 'EG'),
          React.createElement('span', { className: 'eg-wordmark' }, 'English Gym'),
          stats && stats.streakDays > 0
            ? React.createElement('span', { className: 'eg-streak' }, '连续 ' + stats.streakDays + ' 天')
            : null,
          stats && stats.reviewCount > 0
            ? React.createElement('span', { className: 'eg-chip warn' }, '待复习 ' + stats.reviewCount)
            : null,
          React.createElement('span', { className: 'eg-chev', 'aria-hidden': 'true' }, '▸'),
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
      const [submittedAnswer, setSubmittedAnswer] = useState('')
      const [feedback, setFeedback] = useState(null)
      const [attempt, setAttempt] = useState(0)
      const [prevScore, setPrevScore] = useState(null)
      const [retryFocusTick, setRetryFocusTick] = useState(0)
      const lastScoreRef = useRef(null)
      const [busy, setBusy] = useState(false)
      const [error, setError] = useState('')
      const [report, setReport] = useState(null)
      const [reportLoading, setReportLoading] = useState(false)
      const reportStaleRef = useRef(false)
      const startedRef = useRef(false)
      const settingsLoadedRef = useRef(false)
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
      const [mounted, setMounted] = useState(open)
      const [closing, setClosing] = useState(false)
      const tabRefs = useRef({})
      const [slider, setSlider] = useState({ left: 0, width: 0, ready: false })
      const [confettiKey, setConfettiKey] = useState(0)
      const lastBurstRef = useRef(shared.burst || 0)

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

      useEffect(() => {
        if (!mounted) return undefined
        const measure = () => {
          const el = tabRefs.current && tabRefs.current[tab]
          if (!el) return
          const pad = Math.min(5, Math.floor(el.offsetWidth * 0.16))
          setSlider({
            left: el.offsetLeft + pad,
            width: Math.max(14, el.offsetWidth - pad * 2),
            ready: true,
          })
        }
        measure()
        const raf = requestAnimationFrame(measure)
        return () => cancelAnimationFrame(raf)
      }, [tab, mounted, geom.w])

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
          setSubmittedAnswer('')
          setFeedback(null)
          setAttempt(0)
          setPrevScore(null)
          setRetryFocusTick(0)
          lastScoreRef.current = null
        } catch (e) {
          setError(e.message || '出题失败')
        } finally {
          inFlightRef.current = false
          setBusy(false)
        }
      }, [])

      const refreshReport = useCallback(async (force) => {
        setReportLoading(true)
        try {
          setReport(force ? await api('/report/refresh', { method: 'POST' }) : await api('/report'))
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
          const force = reportStaleRef.current
          reportStaleRef.current = false
          refreshReport(force)
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
        const currentAnswer = answer
        setBusy(true)
        setError('')
        try {
          const res = await api('/check', {
            method: 'POST',
            body: JSON.stringify({ id: card.id, answer: currentAnswer }),
          })
          setSubmittedAnswer(currentAnswer)
          setPrevScore(lastScoreRef.current)
          lastScoreRef.current = Number.isFinite(Number(res.score)) ? Number(res.score) : 0
          setAttempt((n) => n + 1)
          setFeedback(res)
          if (res.correct) store.celebrate()
          if (res.summary) store.setStats(res.summary)
        } catch (e) {
          setError(e.message || '判分失败')
          if (e.status === 409) {
            setCard(null)
            setFeedback(null)
            setAttempt(0)
            setPrevScore(null)
            lastScoreRef.current = null
            startedRef.current = false
          }
        } finally {
          setBusy(false)
        }
      }, [card, answer, busy])

      const retry = useCallback(() => {
        if (!card || busy) return
        setFeedback(null)
        setError('')
        setRetryFocusTick((n) => n + 1)
      }, [card, busy])

      const next = useCallback(() => {
        setFeedback(null)
        setCard(null)
        setSubmittedAnswer('')
        setAttempt(0)
        setPrevScore(null)
        setRetryFocusTick(0)
        lastScoreRef.current = null
        // Keep startedRef true so the auto-load effect does NOT fire a second
        // /next on top of the one we start here (that double-fetch made the
        // previous wording flash in for a moment).
        loadNext('new')
      }, [loadNext])

      if (!mounted) return null

      const TABS = [
        { id: 'word', label: '单词训练' },
        { id: 'drill', label: '短语训练' },
        { id: 'report', label: '今日报告' },
        { id: 'dashboard', label: '看板' },
        { id: 'settings', label: '设置' },
      ]

      return React.createElement(
        'div',
        {
          className: 'eg-panel' + (closing ? ' is-closing' : ''),
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
            { className: 'eg-tabs' + (slider.ready ? ' has-slider' : '') },
            TABS.map((t) =>
              React.createElement(
                'button',
                {
                  key: t.id,
                  ref: (el) => {
                    tabRefs.current[t.id] = el
                  },
                  className: 'eg-tab' + (tab === t.id ? ' active' : ''),
                  onClick: () => setTab(t.id),
                },
                t.label,
              ),
            ),
            slider.ready
              ? React.createElement('span', {
                  className: 'eg-tab-indicator',
                  'aria-hidden': 'true',
                  style: { transform: 'translateX(' + slider.left + 'px)', width: slider.width + 'px' },
                })
              : null,
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
          React.createElement(
            'div',
            { className: 'eg-view', key: tab },
            tab === 'drill'
              ? React.createElement(
                  'div',
                  { className: 'eg-drill' },
                  React.createElement(Drill, {
                    key: card ? card.id : feedback ? 'fb' : 'loading',
                    card,
                    answer,
                    setAnswer,
                    submittedAnswer,
                    feedback,
                    attempt,
                    prevScore,
                    retryFocusTick,
                    busy,
                    error,
                    onSubmit: submit,
                    onRetry: retry,
                    onNext: next,
                  }),
                )
              : tab === 'word'
                ? React.createElement(WordPractice, { key: 'word' })
                : tab === 'report'
                  ? React.createElement(Report, {
                      report,
                      loading: reportLoading,
                      error,
                      onRefresh: () => {
                        setReport(null)
                        refreshReport(true)
                      },
                    })
                  : tab === 'dashboard'
                    ? React.createElement(Dashboard, { key: 'dashboard' })
                    : React.createElement(SettingsPanel, {
                        onTopicChange: () => {
                          setCard(null)
                          setFeedback(null)
                          setAnswer('')
                          setSubmittedAnswer('')
                          setAttempt(0)
                          setPrevScore(null)
                          setRetryFocusTick(0)
                          lastScoreRef.current = null
                          setReport(null)
                          reportStaleRef.current = true
                          startedRef.current = false
                        },
                      }),
          ),
        ),
        confettiKey ? React.createElement(Confetti, { key: confettiKey }) : null,
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
