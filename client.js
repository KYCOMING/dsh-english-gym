/* Generated from src/client/ — do not edit directly. Run `npm run build:client`. */
window.__ModuleLoader__.load({
  id: 'dsh-english-gym',
  factory(require) {
    var module = { exports: {} };
    var exports = module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.js
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/shell/EnglishGymPill.jsx
var import_react3 = __toESM(require("react"), 1);

// src/client/core/style.js
var import_react = require("react");

// src/client/styles/tokens.css
var tokens_default = '/* Hallmark · component: english-gym panel · genre: editorial · theme: in-place (dsh tokens) · states: 8 · contrast: pass · v3.0.0\n * critique: the drill is a study desk — crisp sans for Chinese & UI, Charter/Georgia for English reading, tactile micro-motion throughout.\n * waive: none\n */\n.eg-root, .eg-panel {\n  --eg-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;\n  --eg-en: "Charter", "Iowan Old Style", "Georgia", "Times New Roman", "PingFang SC", serif;\n  --eg-ipa: "Lucida Sans Unicode", "Segoe UI", "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif;\n  --eg-serif: var(--eg-en);\n  --eg-ink: var(--dsw-alias-label-primary, #1f2328);\n  --eg-ink-2: var(--dsw-alias-label-secondary, #5a6069);\n  --eg-bg: var(--dsw-alias-bg-layer-1, #ffffff);\n  --eg-bg-2: var(--dsw-alias-bg-layer-2, rgba(23, 26, 31, .045));\n  --eg-bg-3: color-mix(in srgb, var(--eg-ink) 8%, transparent);\n  --eg-line: var(--dsw-alias-border-l1, rgba(23, 26, 31, .12));\n  --eg-line-2: var(--dsw-alias-border-l2, rgba(23, 26, 31, .24));\n  --eg-accent: var(--dsw-alias-brand-primary, #2f6fed);\n  --eg-accent-ink: var(--eg-accent);\n  --eg-on-accent: #ffffff;\n  --eg-ok: var(--dsw-alias-state-success-primary, #1a7f37);\n  --eg-bad: var(--dsw-alias-state-error-primary, #cf222e);\n  --eg-warn: var(--dsw-alias-state-warn-primary, #bf8700);\n  --eg-warn-strong: var(--eg-warn);\n  --eg-hl-bg: color-mix(in srgb, #f5c518 28%, transparent);\n  --eg-hl-bg-active: color-mix(in srgb, #f5c518 46%, transparent);\n  --eg-hl-line: color-mix(in srgb, var(--eg-warn) 58%, transparent);\n  --eg-r: 16px;\n  --eg-r-sm: 10px;\n  --eg-shadow: 0 20px 56px rgba(17, 22, 31, .22), 0 2px 8px rgba(17, 22, 31, .08);\n  --eg-dur: .16s;\n  --eg-ease: cubic-bezier(.22, 1, .36, 1);\n  --eg-spring: cubic-bezier(.34, 1.45, .64, 1);\n  --eg-fs-xs: 12px; --eg-fs-sm: 13px; --eg-fs-md: 15px; --eg-fs-lg: 19px; --eg-fs-xl: 32px;\n  --eg-confetti-1: var(--eg-accent); --eg-confetti-2: var(--eg-bad); --eg-confetti-3: var(--eg-ok);\n  --eg-confetti-4: var(--eg-warn); --eg-confetti-5: #c9407e; --eg-confetti-6: #1b7c83;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.eg-root { font: var(--eg-fs-sm)/1.5 var(--eg-font); color: var(--eg-ink); }\n/* place the composer-strip pill at the far right of the dock row (after the context meter) */\n.eg-root.eg-entry { order: 999; flex: 0 0 auto; }\n.eg-root *, .eg-panel * { box-sizing: border-box; }\n\n';

// src/client/styles/shell.css
var shell_default = '/* ===== pill (composer strip) ===== */\n.eg-pill {\n  display: flex; align-items: center; gap: 9px; width: 100%;\n  padding: 7px 10px; background: transparent; border: none; border-radius: 10px;\n  color: var(--eg-ink-2); font-family: var(--eg-font); font-size: var(--eg-fs-sm); text-align: left; cursor: pointer;\n  transition: background var(--eg-dur) ease, transform .12s ease;\n}\n.eg-pill:hover { background: var(--eg-bg-2); }\n.eg-pill:active { transform: scale(.985); }\n.eg-pill:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-mono {\n  width: 22px; height: 22px; border-radius: 7px; flex: 0 0 auto;\n  background: var(--eg-accent); color: var(--eg-on-accent);\n  display: flex; align-items: center; justify-content: center;\n  font: 700 var(--eg-fs-xs)/1 var(--eg-font); letter-spacing: .02em;\n}\n.eg-wordmark { font-weight: 650; color: var(--eg-ink); letter-spacing: .01em; }\n.eg-streak { color: var(--eg-ink-2); font-variant-numeric: tabular-nums; }\n.eg-chip {\n  display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; height: 20px; border-radius: 999px;\n  background: var(--eg-bg-3); color: var(--eg-ink-2); font-size: 11.5px; font-weight: 600; font-variant-numeric: tabular-nums;\n}\n.eg-chip.warn {\n  background: color-mix(in srgb, var(--eg-warn) 14%, transparent);\n  border: 1px solid color-mix(in srgb, var(--eg-warn) 32%, transparent);\n  color: var(--eg-warn);\n}\n.eg-chev { margin-left: auto; opacity: .7; font-size: var(--eg-fs-xs); transition: transform .2s var(--eg-ease); }\n.eg-pill[aria-expanded="true"] .eg-chev { transform: rotate(90deg); }\n\n/* ===== panel ===== */\n.eg-panel {\n  position: fixed; z-index: 2147483000; pointer-events: auto;\n  -webkit-app-region: no-drag; app-region: no-drag;\n  display: flex; flex-direction: column;\n  background: var(--eg-bg); border: 1px solid var(--eg-line); border-radius: var(--eg-r);\n  box-shadow: var(--eg-shadow); overflow: hidden;\n  font: var(--eg-fs-sm)/1.5 var(--eg-font); color: var(--eg-ink);\n  transform-origin: bottom center; animation: eg-pop .2s var(--eg-ease) both;\n}\n.eg-panel.is-closing {\n  animation: eg-pop-out .14s cubic-bezier(.4, 0, 1, 1) forwards;\n  pointer-events: none;\n}\n@keyframes eg-pop { from { opacity: 0; transform: scale(.95) translateY(8px); } to { opacity: 1; transform: none; } }\n@keyframes eg-pop-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: scale(.96) translateY(6px); } }\n.eg-head {\n  display: flex; align-items: center; gap: 5px; padding: 9px 8px 9px 10px;\n  border-bottom: 1px solid var(--eg-line); flex: 0 0 auto; cursor: move; user-select: none; touch-action: none;\n  background: var(--eg-bg); position: relative;\n}\n.eg-grip { color: var(--eg-ink-2); opacity: .7; font-size: var(--eg-fs-xs); letter-spacing: -2px; cursor: grab; width: 10px; flex: 0 0 auto; transition: opacity var(--eg-dur) ease; }\n.eg-head:hover .eg-grip { opacity: 1; }\n.eg-tabs { position: relative; display: flex; flex-wrap: nowrap; align-items: center; gap: 0; margin-left: 0; min-width: 0; flex: 0 1 auto; }\n.eg-tab {\n  position: relative; padding: 5px 5px; border: none; background: transparent; cursor: pointer; white-space: nowrap;\n  color: var(--eg-ink-2); font: 600 var(--eg-fs-xs)/1.2 var(--eg-font); border-radius: 7px;\n  transition: color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-tab:hover { color: var(--eg-ink); background: var(--eg-bg-2); }\n.eg-tab:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-tab.active { color: var(--eg-ink); }\n.eg-tabs:not(.has-slider) .eg-tab.active::after {\n  content: ""; position: absolute; left: 5px; right: 5px; bottom: -10px; height: 2px; border-radius: 2px; background: var(--eg-accent);\n}\n.eg-tab-indicator {\n  position: absolute; left: 0; bottom: -10px; height: 2px; border-radius: 2px;\n  background: var(--eg-accent); pointer-events: none;\n  transition: transform .24s var(--eg-ease), width .24s var(--eg-ease), opacity .16s ease;\n  will-change: transform, width;\n}\n.eg-head-right { margin-left: auto; display: flex; align-items: center; gap: 6px; }\n.eg-close { appearance: none; -webkit-appearance: none;\n  border: none; background: transparent; color: var(--eg-ink-2); cursor: pointer;\n  width: 26px; height: 26px; border-radius: 7px; font-size: 14px; line-height: 1; display: flex; align-items: center; justify-content: center;\n  transition: background var(--eg-dur) ease, color var(--eg-dur) ease, transform .14s ease;\n}\n.eg-close:hover { background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-close:active { transform: scale(.9); }\n.eg-close:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-body { padding: 20px 22px 0; overflow-y: auto; flex: 1 1 auto; display: flex; flex-direction: column; }\n.eg-body:has(> .eg-view > .eg-word),\n.eg-body:has(.eg-fb.is-phrase) {\n  overflow-y: hidden;\n}\n.eg-body > * { width: 100%; max-width: 640px; margin-left: auto; margin-right: auto; }\n\n/* ===== shared motion primitives ===== */\n.eg-view {\n  width: 100%; max-width: 640px; margin-left: auto; margin-right: auto;\n  display: flex; flex-direction: column; flex: 1 0 auto; padding-bottom: 24px;\n}\n.eg-view > * {\n  animation: eg-view-in .18s var(--eg-ease) both;\n}\n.eg-view:has(> .eg-word),\n.eg-view:has(.eg-fb.is-phrase) {\n  flex: 1 1 0; min-height: 0;\n}\n.eg-stage-in { animation: eg-stage-in .22s var(--eg-ease) both; }\n@keyframes eg-view-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n@keyframes eg-stage-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }\n.eg-collapse {\n  display: grid; grid-template-rows: 0fr; opacity: 0;\n  transition: grid-template-rows .24s var(--eg-ease), opacity .2s ease;\n}\n.eg-collapse.open { grid-template-rows: 1fr; opacity: 1; }\n.eg-collapse-inner { overflow: hidden; min-height: 0; }\n\n/* ===== misc ===== */\n.eg-loading { display: flex; align-items: center; gap: 9px; color: var(--eg-ink-2); padding: 10px 0; font-size: var(--eg-fs-sm); }\n.eg-loading.is-stage {\n  flex: 1 1 auto; width: 100%; min-height: 180px;\n  flex-direction: column; justify-content: center; gap: 14px;\n  padding: 0 0 14px; text-align: center;\n  font-size: 14px; font-weight: 500; color: var(--eg-ink-2);\n}\n.eg-spin { display: inline-block; width: 15px; height: 15px; border: 2px solid var(--eg-line-2); border-top-color: var(--eg-accent); border-radius: 50%; animation: eg-spin .7s linear infinite; }\n.eg-loading.is-stage .eg-spin { width: 28px; height: 28px; border-width: 2.5px; }\n@keyframes eg-spin { to { transform: rotate(360deg); } }\n.eg-resize { position: absolute; right: 0; bottom: 0; width: 18px; height: 18px; cursor: nwse-resize; touch-action: none; }\n.eg-resize::after { content: ""; position: absolute; right: 4px; bottom: 4px; width: 9px; height: 9px; border-right: 2px solid var(--eg-line-2); border-bottom: 2px solid var(--eg-line-2); border-bottom-right-radius: 3px; opacity: .7; transition: opacity var(--eg-dur) ease; }\n.eg-resize:hover::after { opacity: 1; }\n\n';

// src/client/styles/phrase.css
var phrase_default = '/* ===== drill ===== */\n.eg-cap { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); font-weight: 600; letter-spacing: .02em; }\n.eg-zh {\n  margin-top: 14px; font-family: var(--eg-font); font-size: 18px; line-height: 1.6; font-weight: 650;\n  letter-spacing: -.005em; color: var(--eg-ink); overflow-wrap: break-word;\n}\n.eg-hintbtn { appearance: none; -webkit-appearance: none;\n  margin-top: 14px; display: inline-flex; align-items: center; gap: 6px; min-height: 30px; padding: 5px 11px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg); border-radius: 999px;\n  color: var(--eg-ink-2); font: 600 var(--eg-fs-xs)/1 var(--eg-font); cursor: pointer;\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-hintbtn:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-hintbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-hintbtn .caret { display: inline-block; transition: transform .22s var(--eg-ease); }\n.eg-hintbtn[aria-expanded="true"] .caret { transform: rotate(90deg); }\n.eg-hint-collapse { width: 100%; }\n.eg-hintbox {\n  max-width: 520px; margin: 10px auto 0; padding: 2px 8px;\n  color: var(--eg-ink-2); font-family: var(--eg-en); font-size: var(--eg-fs-sm); line-height: 1.6;\n  text-align: center; overflow-wrap: break-word;\n}\n.eg-inputwrap { position: relative; margin-top: 22px; }\n.eg-input {\n  --eg-line-h: 40px;\n  --eg-rule-color: var(--eg-line-2);\n  display: block;\n  width: 100%;\n  height: var(--eg-line-h);\n  min-height: var(--eg-line-h);\n  resize: none;\n  overflow: hidden;\n  padding: 0 4px;\n  border: none;\n  border-radius: 0;\n  background-color: transparent;\n  background-image: repeating-linear-gradient(\n    to bottom,\n    transparent 0,\n    transparent calc(var(--eg-line-h) - 1.5px),\n    var(--eg-rule-color) calc(var(--eg-line-h) - 1.5px),\n    var(--eg-rule-color) var(--eg-line-h)\n  );\n  background-size: 100% var(--eg-line-h);\n  background-position: 0 0;\n  background-attachment: local;\n  color: var(--eg-ink);\n  font: 400 16px/var(--eg-line-h) var(--eg-font);\n  outline: none;\n  transition: color var(--eg-dur) ease;\n}\n.eg-input::placeholder { color: var(--eg-ink-2); opacity: .68; }\n.eg-input:hover { --eg-rule-color: var(--eg-ink-2); }\n.eg-input:focus { --eg-rule-color: var(--eg-accent); background-color: transparent; box-shadow: none; }\n.eg-input.error { --eg-rule-color: var(--eg-bad); box-shadow: none; }\n.eg-foot { display: flex; align-items: center; gap: 10px; margin-top: 16px; }\n.eg-foot .eg-kbd { margin-left: auto; }\n.eg-err { color: var(--eg-bad); font-size: var(--eg-fs-xs); margin-top: 8px; }\n.eg-kbd { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); white-space: nowrap; }\n.eg-kbd kbd {\n  font: 600 11.5px/1 var(--eg-font); padding: 2px 5px; border: 1px solid var(--eg-line); border-bottom-width: 2px;\n  border-radius: 4px; background: var(--eg-bg); color: var(--eg-ink-2);\n}\n.eg-actions { display: flex; gap: 8px; margin-top: 16px; }\n.eg-btn {\n  display: inline-flex; align-items: center; justify-content: center; gap: 6px;\n  min-height: 36px; min-width: 76px; padding: 0 15px; border-radius: var(--eg-r-sm); cursor: pointer;\n  appearance: none; -webkit-appearance: none;\n  font: 600 var(--eg-fs-sm)/1 var(--eg-font);\n  transition: background var(--eg-dur) ease, filter var(--eg-dur) ease, border-color var(--eg-dur) ease, transform .26s var(--eg-spring);\n  border: 1px solid var(--eg-line-2); background: var(--eg-bg); color: var(--eg-ink);\n}\n.eg-btn:hover { background: var(--eg-bg-2); }\n.eg-btn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-btn:active { transform: scale(.94); transition-duration: .06s; }\n.eg-btn.is-bouncing { animation: eg-btn-bounce .34s var(--eg-spring); }\n@keyframes eg-btn-bounce {\n  0% { transform: scale(.93); }\n  55% { transform: scale(1.04); }\n  100% { transform: scale(1); }\n}\n.eg-btn.primary { border-color: transparent; background: var(--eg-accent); color: var(--eg-on-accent); }\n.eg-btn.primary:hover { filter: brightness(1.08); }\n.eg-btn:disabled { opacity: .48; cursor: not-allowed; pointer-events: none; }\n.eg-btn.primary:disabled { background: var(--eg-accent); color: var(--eg-on-accent); border-color: transparent; }\n.eg-btn:not(.primary):disabled { background: var(--eg-bg-2); color: var(--eg-ink-2); border-color: var(--eg-line); }\n.eg-btn.primary.is-loading { color: transparent; position: relative; }\n.eg-btn.primary.is-loading::after {\n  content: ""; position: absolute; width: 15px; height: 15px; border-radius: 50%;\n  border: 2px solid rgba(255, 255, 255, .45); border-top-color: #fff; animation: eg-spin .7s linear infinite;\n}\n.eg-btn.ghost { border-color: transparent; background: transparent; color: var(--eg-ink-2); padding: 0 10px; }\n.eg-btn.ghost:hover { background: var(--eg-bg-2); color: var(--eg-ink); }\n\n/* ===== confetti ===== */\n.eg-confetti { position: absolute; inset: 0; z-index: 6; pointer-events: none; overflow: hidden; border-radius: inherit; }\n.eg-confetti-piece {\n  position: absolute; display: block; border-radius: 1.5px; opacity: 0;\n  transform: translate(-50%, -50%) rotate(var(--r0, 0deg));\n  animation: eg-confetti-fly var(--dur, 900ms) cubic-bezier(.15, .7, .3, 1) var(--delay, 0ms) forwards;\n  will-change: transform, opacity;\n}\n@keyframes eg-confetti-fly {\n  0%   { opacity: 1; transform: translate(-50%, -50%) rotate(var(--r0, 0deg)) scale(.65); }\n  18%  { opacity: 1; }\n  100% { opacity: 0; transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, 0px))) rotate(calc(var(--r0, 0deg) + var(--rot, 360deg))) scale(1); }\n}\n\n/* ===== feedback ===== */\n.eg-fb {\n  --eg-tone: var(--eg-line-2);\n  margin-top: 8px; padding: 18px 20px; border: 1px solid var(--eg-line);\n  border-top: 3px solid var(--eg-line); border-radius: 12px; background: var(--eg-bg);\n  text-align: left; animation: eg-stage-in .24s var(--eg-ease) both;\n}\n.eg-fb.ok { --eg-tone: var(--eg-ok); border-top-color: var(--eg-ok); }\n.eg-fb.warn { --eg-tone: var(--eg-warn); border-top-color: var(--eg-warn); }\n.eg-fb.bad { --eg-tone: var(--eg-bad); border-top-color: var(--eg-bad); }\n.eg-fb-top { display: flex; align-items: baseline; gap: 10px; }\n.eg-score { font: 700 var(--eg-fs-xl)/1 var(--eg-font); font-variant-numeric: tabular-nums; letter-spacing: -.02em; color: var(--eg-tone); }\n.eg-score small { font-size: var(--eg-fs-xs); font-weight: 700; opacity: .9; color: inherit; margin-left: 2px; }\n.eg-fb-status { font-weight: 700; font-size: 16px; color: var(--eg-tone); line-height: 1.25; }\n.eg-fb-ref {\n  margin-top: 14px; padding: 12px 14px; border-radius: 10px; background: var(--eg-bg-2);\n  font-family: var(--eg-en); font-size: 17px; line-height: 1.65; color: var(--eg-ink); overflow-wrap: break-word;\n  animation: eg-view-in .24s var(--eg-ease) .05s both;\n}\n.eg-fb-ref .lbl { display: block; font: 600 11.5px/1 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em; margin-bottom: 6px; }\n.eg-fb-tip {\n  margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.65;\n  display: flex; gap: 8px; align-items: flex-start;\n  animation: eg-view-in .24s var(--eg-ease) .1s both;\n}\n.eg-fb-tip .b {\n  padding: 2px 7px; border-radius: 6px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  color: var(--eg-ink); font-size: 11px; font-weight: 650; line-height: 1.3;\n  white-space: nowrap; flex: 0 0 auto; margin-top: 2px;\n}\n.eg-fb-actions { margin-top: 16px; display: flex; gap: 10px; animation: eg-view-in .24s var(--eg-ease) .14s both; }\n\n/* phrase feedback: frameless editorial canvas matching word practice & daily report */\n.eg-fb.is-phrase {\n  container-type: inline-size;\n  display: flex; flex-direction: column;\n  flex: 1 1 auto; height: 100%; min-height: 0; max-height: 100%;\n  margin-top: 0; padding: 0; border: none; border-radius: 0;\n  background: transparent; box-shadow: none; overflow: hidden;\n}\n.eg-fb-hero {\n  flex: 0 0 auto;\n  display: flex; align-items: center; gap: 14px; padding: 2px 0 14px;\n  background: transparent;\n  border-bottom: 1px solid var(--eg-line);\n}\n.eg-ring {\n  position: relative; width: 46px; height: 46px; flex: 0 0 auto;\n  display: flex; align-items: center; justify-content: center;\n}\n.eg-ring svg { width: 46px; height: 46px; display: block; }\n.eg-ring-track { fill: transparent; stroke: color-mix(in srgb, var(--eg-tone) 15%, var(--eg-line)); stroke-width: 3.5; }\n.eg-ring-arc {\n  fill: none; stroke: var(--eg-tone); stroke-width: 3.5; stroke-linecap: round;\n  transform: rotate(-90deg); transform-origin: 50% 50%;\n  transition: stroke-dashoffset .55s var(--eg-ease);\n}\n.eg-ring-val {\n  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;\n  color: var(--eg-tone); font-variant-numeric: tabular-nums; pointer-events: none;\n}\n.eg-ring-val strong { font: 750 15px/1 var(--eg-font); letter-spacing: -.03em; }\n.eg-ring-val small { font: 650 9px/1 var(--eg-font); opacity: .78; margin-top: 2px; }\n.eg-fb-verdict { min-width: 0; flex: 1 1 auto; }\n.eg-fb-headline { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; }\n.eg-fb-pill {\n  display: inline-flex; align-items: center; gap: 3px;\n  padding: 2px 8px; border-radius: 999px;\n  background: var(--eg-bg-2); border: none;\n  color: var(--eg-ink-2); font: 600 11px/1.35 var(--eg-font); font-variant-numeric: tabular-nums;\n}\n.eg-fb-pill.tone {\n  background: color-mix(in srgb, var(--eg-tone) 12%, transparent);\n  color: var(--eg-tone);\n}\n.eg-fb-pill.up {\n  background: color-mix(in srgb, var(--eg-ok) 12%, transparent);\n  color: var(--eg-ok);\n}\n.eg-fb-sub { margin-top: 3px; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.45; }\n.eg-fb-body {\n  flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain;\n  padding: 16px 0 18px; display: flex; flex-direction: column; gap: 15px;\n  scrollbar-width: none; -ms-overflow-style: none;\n}\n.eg-fb-body::-webkit-scrollbar { display: none; width: 0; height: 0; }\n.eg-fb-prompt {\n  display: flex; align-items: baseline; gap: 9px;\n  padding-bottom: 0; border-bottom: none;\n}\n.eg-fb-tag {\n  flex: 0 0 auto; padding: 2px 7px; border-radius: 5px;\n  background: var(--eg-bg-2); border: none;\n  color: var(--eg-ink-2); font: 650 11px/1.35 var(--eg-font); letter-spacing: .02em;\n}\n.eg-fb-zh { font-size: 15.5px; font-weight: 650; color: var(--eg-ink); line-height: 1.55; overflow-wrap: break-word; min-width: 0; }\n.eg-fb-boxhead { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 5px; flex-wrap: wrap; }\n.eg-fb-boxhead-left { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; min-width: 0; }\n.eg-fb.is-phrase .lbl {\n  display: inline-flex; align-items: center; gap: 5px; margin-bottom: 0;\n  font: 650 11.5px/1.2 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em;\n}\n.eg-fb-mine {\n  padding: 9px 14px; border: none;\n  border-left: 2.5px solid color-mix(in srgb, var(--eg-tone) 75%, transparent);\n  border-radius: 0 9px 9px 0;\n  background: color-mix(in srgb, var(--eg-tone) 4.5%, transparent);\n  animation: eg-view-in .22s var(--eg-ease) .03s both;\n}\n.eg-fb-mine .lbl { color: var(--eg-tone); }\n.eg-fb-mine-text { font-family: var(--eg-en); font-size: 14.5px; line-height: 1.55; color: var(--eg-ink); overflow-wrap: break-word; }\n.eg-fb-mine-text.empty { font-family: var(--eg-font); font-size: var(--eg-fs-sm); color: var(--eg-ink-2); font-style: italic; }\n.eg-fb.is-phrase .eg-fb-ref {\n  margin-top: 0; padding: 12px 15px; border: none; border-radius: 10px;\n  background: var(--eg-bg-2);\n  font-family: var(--eg-font); font-size: var(--eg-fs-sm); line-height: 1.5;\n  animation: eg-view-in .24s var(--eg-ease) .06s both;\n}\n.eg-fb-ref-text { font-family: var(--eg-en); font-size: 17px; line-height: 1.62; color: var(--eg-ink); overflow-wrap: break-word; }\n.eg-fb-banktag {\n  display: inline-flex; align-items: center; padding: 1px 7px; border-radius: 999px;\n  background: color-mix(in srgb, var(--eg-accent) 10%, var(--eg-bg));\n  border: none;\n  color: var(--eg-ink-2); font: 600 10.5px/1.4 var(--eg-font);\n}\n.eg-copybtn {\n  appearance: none; -webkit-appearance: none;\n  display: inline-flex; align-items: center; gap: 4px;\n  height: 22px; padding: 0 9px; border-radius: 999px;\n  border: none; background: color-mix(in srgb, var(--eg-ink) 6%, transparent); color: var(--eg-ink-2);\n  font: 600 11px/1 var(--eg-font); cursor: pointer;\n  transition: color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-copybtn:hover { background: color-mix(in srgb, var(--eg-ink) 11%, transparent); color: var(--eg-ink); }\n.eg-copybtn.copied { background: color-mix(in srgb, var(--eg-ok) 12%, transparent); color: var(--eg-ok); }\n.eg-copybtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-fb-corr {\n  padding: 9px 14px; border: none;\n  border-left: 2.5px solid var(--eg-accent);\n  border-radius: 0 9px 9px 0;\n  background: color-mix(in srgb, var(--eg-accent) 4.5%, transparent);\n  animation: eg-view-in .24s var(--eg-ease) .08s both;\n}\n.eg-fb-corr-text { font-family: var(--eg-en); font-size: 15px; line-height: 1.55; color: var(--eg-ink); overflow-wrap: break-word; }\n.eg-fb.is-phrase .eg-fb-tip {\n  margin-top: 0; padding: 2px 0 0; border: none; border-radius: 0;\n  background: transparent;\n  color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.68;\n  display: flex; gap: 9px; align-items: flex-start;\n  animation: eg-view-in .24s var(--eg-ease) .1s both;\n}\n.eg-fb.is-phrase .eg-fb-tip .b {\n  background: color-mix(in srgb, var(--eg-tone) 10%, transparent);\n  border: none;\n  color: var(--eg-tone); margin-top: 2px;\n}\n.eg-fb-hl { display: flex; flex-direction: column; gap: 7px; animation: eg-view-in .24s var(--eg-ease) .12s both; }\n.eg-fb-hl-lbl { font: 650 11.5px/1.2 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em; }\n.eg-fb-hl-list { display: flex; flex-wrap: wrap; gap: 6px; }\n.eg-hl-chip {\n  display: inline-flex; align-items: baseline; gap: 6px; padding: 4px 10px; border-radius: 8px;\n  background: var(--eg-bg-2); border: none;\n  font-size: var(--eg-fs-xs); line-height: 1.4; max-width: 100%;\n}\n.eg-hl-chip .en { font-family: var(--eg-en); font-weight: 700; font-size: 13px; color: var(--eg-ink); }\n.eg-hl-chip .zh { color: var(--eg-ink-2); }\n.eg-fb.is-phrase .eg-fb-actions {\n  flex: 0 0 auto;\n  margin-top: 6px; padding: 10px 0 0;\n  border-top: 1px solid var(--eg-line); background: transparent;\n  display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap;\n}\n.eg-fb.is-phrase .eg-fb-actions .eg-btn { padding: 0 14px; }\n.eg-fb.is-phrase .eg-fb-actions .eg-kbd { margin-left: 4px; }\n@container (max-width: 340px) {\n  .eg-fb-hero { padding: 0 0 11px; gap: 10px; }\n  .eg-fb-body { padding: 12px 0 14px; gap: 12px; }\n  .eg-fb.is-phrase .eg-fb-actions { padding: 9px 0 0; }\n  .eg-fb.is-phrase .eg-fb-actions .eg-kbd { display: none; }\n}\n.eg-cap-row { display: inline-flex; align-items: center; justify-content: center; gap: 7px; flex-wrap: wrap; }\n.eg-attempt-pill, .eg-source-pill {\n  display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 999px;\n  background: color-mix(in srgb, var(--eg-accent) 10%, var(--eg-bg));\n  border: 1px solid color-mix(in srgb, var(--eg-accent) 22%, transparent);\n  color: var(--eg-ink-2); font: 600 11px/1.3 var(--eg-font); font-variant-numeric: tabular-nums;\n}\n.eg-source-pill { color: var(--eg-ink); }\n.eg-source-pill::before {\n  content: ""; width: 6px; height: 6px; border-radius: 50%; flex: 0 0 auto;\n  background: var(--eg-accent);\n}\n\n/* phrase drill: centred prompt, left-aligned reading feedback */\n.eg-drill { flex: 1 0 auto; width: 100%; max-width: 640px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; padding-top: 0; }\n.eg-view:has(.eg-fb.is-phrase) .eg-drill { flex: 1 1 0; height: 100%; min-height: 0; }\n.eg-drill > div { width: 100%; }\n.eg-drill-stage { width: 100%; margin: auto 0; padding: 12px 0 22px; }\n.eg-drill .eg-zh { max-width: 540px; margin-left: auto; margin-right: auto; text-wrap: balance; }\n.eg-drill .eg-cap { justify-content: center; }\n.eg-drill .eg-foot { justify-content: center; width: 100%; margin-top: 22px; }\n.eg-drill .eg-foot .eg-kbd { margin-left: 0; }\n.eg-drill .eg-inputwrap { width: 100%; max-width: 520px; margin: 22px auto 0; }\n.eg-drill .eg-input { text-align: left; }\n.eg-drill .eg-err { text-align: center; }\n\n';

// src/client/styles/report.css
var report_default = '/* ===== report ===== */\n.eg-report { position: relative; text-align: left; width: 100%; }\n.eg-report .r-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }\n.eg-rtitle {\n  font-family: var(--eg-en); font-size: 22px; line-height: 1.32; font-weight: 700;\n  letter-spacing: -.01em; margin: 0; overflow-wrap: break-word; min-width: 0; text-align: left; color: var(--eg-ink);\n}\n.eg-rmeta-row {\n  display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;\n  margin-top: 9px;\n}\n.eg-rmeta-left {\n  display: inline-flex; align-items: center; gap: 7px; flex-wrap: wrap; min-width: 0;\n}\n.eg-rmeta {\n  display: inline-flex; align-items: center; gap: 6px;\n  padding: 3px 10px; border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font-size: 11.5px; font-weight: 600; font-variant-numeric: tabular-nums;\n}\n.eg-renrich-pill {\n  display: inline-flex; align-items: center; gap: 5px;\n  padding: 3px 9px; border-radius: 999px;\n  background: color-mix(in srgb, var(--eg-accent) 9%, var(--eg-bg));\n  border: 1px solid color-mix(in srgb, var(--eg-accent) 24%, transparent);\n  color: var(--eg-accent-ink); font-size: 11.5px; font-weight: 600; line-height: 1.3;\n}\n.eg-renrich-pill .eg-spin { width: 10px; height: 10px; border-width: 1.5px; }\n.eg-rrefresh {\n  appearance: none; -webkit-appearance: none;\n  display: inline-flex; align-items: center; gap: 5px;\n  height: 26px; padding: 0 10px; border-radius: 999px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg); color: var(--eg-ink-2);\n  font: 600 11.5px/1 var(--eg-font); cursor: pointer;\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease, transform .14s ease;\n}\n.eg-rrefresh:hover:not(:disabled) { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-rrefresh:active:not(:disabled) { transform: scale(.96); }\n.eg-rrefresh:disabled { opacity: .48; cursor: not-allowed; }\n.eg-rrefresh:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-rnotice {\n  margin: 12px 0 0; padding: 8px 12px;\n  display: flex; align-items: center; justify-content: space-between; gap: 10px;\n  border: 1px solid color-mix(in srgb, var(--eg-warn) 35%, var(--eg-line)); border-radius: 9px;\n  background: color-mix(in srgb, var(--eg-warn) 8%, var(--eg-bg-2));\n  color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.5;\n}\n.eg-rnotice-text { flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; }\n.eg-rnotice.is-err {\n  border-color: color-mix(in srgb, var(--eg-bad) 32%, var(--eg-line));\n  background: color-mix(in srgb, var(--eg-bad) 7%, var(--eg-bg-2));\n  color: var(--eg-bad);\n}\n.eg-rsum {\n  margin: 14px 0 0; padding: 11px 14px;\n  border: 1px solid var(--eg-line); border-left: 3px solid var(--eg-accent); border-radius: 10px;\n  background: var(--eg-bg-2); color: var(--eg-ink-2);\n  font-family: var(--eg-font); font-size: var(--eg-fs-sm); line-height: 1.65; text-align: left;\n}\n.eg-rp {\n  margin: 15px 0 0; width: 100%;\n  font-family: var(--eg-en); font-size: 15.5px; line-height: 1.78; color: var(--eg-ink); text-align: left;\n}\n.eg-rword {\n  display: inline;\n  padding: 0 3px;\n  border-radius: 4px;\n  background: var(--eg-hl-bg);\n  color: inherit;\n  border-bottom: 1.5px dotted var(--eg-hl-line);\n  cursor: pointer;\n  transition: background var(--eg-dur) ease, border-color var(--eg-dur) ease;\n}\n.eg-rword:hover,\n.eg-rword.is-active {\n  background: var(--eg-hl-bg-active);\n  border-bottom-style: solid;\n  border-bottom-color: var(--eg-warn);\n}\n.eg-rword:focus-visible {\n  outline: 2px solid var(--eg-accent);\n  outline-offset: 1px;\n}\n/* ----- progressive translation: sentence → slot under the paragraph ----- */\n.eg-rsent {\n  border-radius: 4px;\n  -webkit-box-decoration-break: clone;\n  box-decoration-break: clone;\n  transition: background var(--eg-dur) ease;\n}\n.eg-rsent.can-reveal { cursor: pointer; }\n.eg-rsent.can-reveal:hover:not(:has(.eg-rword:hover)) { background: var(--eg-bg-2); }\n.eg-rsent.is-open { background: color-mix(in srgb, var(--eg-accent) 7%, transparent); }\n.eg-rsent.is-open:hover:not(:has(.eg-rword:hover)) { background: color-mix(in srgb, var(--eg-accent) 12%, transparent); }\n.eg-rsent:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-rslash {\n  margin: 0 1px 0 4px;\n  color: var(--eg-accent-ink);\n  font-family: var(--eg-font);\n  font-weight: 600;\n  font-size: .86em;\n  opacity: .62;\n  user-select: none;\n  pointer-events: none;\n}\n.eg-rcore {\n  font-weight: 650;\n  text-decoration: underline;\n  text-decoration-color: color-mix(in srgb, var(--eg-accent) 44%, transparent);\n  text-decoration-thickness: 1.5px;\n  text-underline-offset: 3px;\n}\n.eg-rword.is-core { font-weight: 650; }\n.eg-rsent-n {\n  margin-left: 2px;\n  font: 700 9.5px/1 var(--eg-font);\n  color: var(--eg-accent-ink);\n  font-variant-numeric: tabular-nums;\n}\n.eg-rgist-btn {\n  appearance: none; -webkit-appearance: none;\n  display: inline-flex; align-items: center;\n  height: 19px; margin-left: 7px; padding: 0 7px; vertical-align: 2px;\n  border-radius: 999px; border: 1px solid var(--eg-line); background: transparent;\n  color: var(--eg-ink-2); font: 600 10.5px/1 var(--eg-font); cursor: pointer;\n  transition: background var(--eg-dur) ease, border-color var(--eg-dur) ease, color var(--eg-dur) ease;\n}\n.eg-rgist-btn:hover { background: var(--eg-bg-2); border-color: var(--eg-line-2); color: var(--eg-ink); }\n.eg-rgist-btn[aria-expanded="true"] {\n  background: color-mix(in srgb, var(--eg-accent) 9%, var(--eg-bg));\n  border-color: color-mix(in srgb, var(--eg-accent) 32%, transparent);\n  color: var(--eg-accent-ink);\n}\n.eg-rgist-btn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-rslot {\n  margin: 8px 0 0; padding: 8px 8px 8px 10px;\n  display: flex; flex-direction: column; gap: 6px;\n  border: 1px solid var(--eg-line); border-radius: 10px; background: var(--eg-bg-2);\n  animation: eg-rslot-in .18s var(--eg-ease) both;\n}\n.eg-rslot-row {\n  display: flex; align-items: flex-start; gap: 8px;\n  font: 500 var(--eg-fs-sm)/1.6 var(--eg-font); color: var(--eg-ink); text-align: left;\n  animation: eg-rslot-in .18s var(--eg-ease) both;\n}\n@keyframes eg-rslot-in {\n  from { opacity: 0; transform: translateY(-3px); }\n  to { opacity: 1; transform: none; }\n}\n.eg-rslot-tag {\n  flex: 0 0 auto; min-width: 20px; height: 18px; margin-top: 2px; padding: 0 5px; box-sizing: border-box;\n  display: inline-flex; align-items: center; justify-content: center;\n  border-radius: 5px; font: 700 10.5px/1 var(--eg-font); font-variant-numeric: tabular-nums;\n  background: color-mix(in srgb, var(--eg-accent) 12%, var(--eg-bg)); color: var(--eg-accent-ink);\n}\n.eg-rslot-row.is-gist .eg-rslot-tag { background: var(--eg-bg); border: 1px solid var(--eg-line); color: var(--eg-ink-2); }\n.eg-rslot-row.is-gist .eg-rslot-zh { color: var(--eg-ink-2); }\n.eg-rslot-body { flex: 1 1 auto; min-width: 0; }\n.eg-rslot-zh { flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; }\n.eg-rslot-zh.is-pending { display: inline-flex; align-items: center; gap: 7px; color: var(--eg-ink-2); }\n.eg-rslot-zh.is-pending .eg-spin { width: 12px; height: 12px; border-width: 1.5px; }\n.eg-rslot-tools { margin-top: 5px; display: flex; align-items: center; gap: 6px; }\n.eg-rslot-btn {\n  appearance: none; -webkit-appearance: none;\n  flex: 0 0 auto;\n  display: inline-flex; align-items: center; justify-content: center;\n  height: 21px; padding: 0 8px; border-radius: 999px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg); color: var(--eg-ink-2);\n  font: 600 11px/1 var(--eg-font); cursor: pointer;\n  transition: background var(--eg-dur) ease, border-color var(--eg-dur) ease, color var(--eg-dur) ease;\n}\n.eg-rslot-btn:hover:not(:disabled) { border-color: var(--eg-line-2); color: var(--eg-ink); }\n.eg-rslot-btn.is-active {\n  background: color-mix(in srgb, var(--eg-accent) 9%, var(--eg-bg));\n  border-color: color-mix(in srgb, var(--eg-accent) 32%, transparent);\n  color: var(--eg-accent-ink);\n}\n.eg-rslot-btn:disabled { opacity: .55; cursor: wait; }\n.eg-rslot-btn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-rexplain {\n  margin-top: 7px; padding: 8px 10px; border-radius: 8px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg);\n  display: flex; flex-direction: column; gap: 6px;\n  font-size: var(--eg-fs-xs); line-height: 1.6;\n  animation: eg-rslot-in .18s var(--eg-ease) both;\n}\n.eg-rexplain-sec { display: flex; align-items: flex-start; gap: 7px; }\n.eg-rexplain-label {\n  flex: 0 0 auto; margin-top: 2px; padding: 1px 6px; border-radius: 4px;\n  background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font: 600 10.5px/1.3 var(--eg-font);\n}\n.eg-rexplain-text { flex: 1 1 auto; min-width: 0; color: var(--eg-ink); overflow-wrap: anywhere; }\n.eg-rexplain-pts { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 4px; }\n.eg-rexplain-pt { overflow-wrap: anywhere; }\n.eg-rexplain-phrase {\n  font-family: var(--eg-en); font-weight: 700; color: var(--eg-ink); margin-right: 6px;\n}\n.eg-rexplain-note { color: var(--eg-ink-2); }\n.eg-rexplain-loading { display: flex; align-items: center; gap: 7px; color: var(--eg-ink-2); }\n.eg-rexplain-loading .eg-spin { width: 12px; height: 12px; border-width: 1.5px; }\n.eg-rexplain-err { display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--eg-bad); }\n.eg-rslot-x {\n  appearance: none; -webkit-appearance: none;\n  flex: 0 0 auto; width: 20px; height: 20px; margin-top: 1px; padding: 0;\n  display: inline-flex; align-items: center; justify-content: center;\n  border: none; border-radius: 5px; background: transparent; color: var(--eg-ink-2);\n  font: 600 13px/1 var(--eg-font); cursor: pointer; opacity: 0;\n  transition: opacity var(--eg-dur) ease, background var(--eg-dur) ease, color var(--eg-dur) ease;\n}\n.eg-rslot-row:hover .eg-rslot-x, .eg-rslot-x:focus-visible { opacity: 1; }\n.eg-rslot-x:hover { background: var(--eg-bg-3); color: var(--eg-ink); }\n.eg-rslot-x:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n@media (hover: none) { .eg-rslot-x { opacity: 1; } }\n.eg-rpop {\n  position: absolute;\n  z-index: 20;\n  width: max-content;\n  min-width: 152px;\n  max-width: min(244px, 100%);\n  padding: 10px 16px;\n  border-radius: 10px;\n  border: 1px solid var(--eg-line-2);\n  background: var(--eg-bg);\n  box-shadow: 0 10px 28px rgba(17, 22, 31, .16), 0 2px 6px rgba(17, 22, 31, .08);\n  color: var(--eg-ink);\n  text-align: center;\n  visibility: hidden;\n  pointer-events: auto;\n}\n.eg-rpop.is-pinned {\n  padding-left: 24px;\n  padding-right: 24px;\n}\n.eg-rpop.is-ready {\n  visibility: visible;\n  animation: eg-rpop-in .14s var(--eg-ease) both;\n}\n@keyframes eg-rpop-in {\n  from { opacity: 0; transform: translateY(4px) scale(.97); }\n  to { opacity: 1; transform: none; }\n}\n.eg-rpop::after {\n  content: "";\n  position: absolute;\n  left: var(--eg-arrow-x, 20px);\n  bottom: -5px;\n  width: 8px;\n  height: 8px;\n  background: var(--eg-bg);\n  border-right: 1px solid var(--eg-line-2);\n  border-bottom: 1px solid var(--eg-line-2);\n  transform: translateX(-50%) rotate(45deg);\n}\n.eg-rpop.is-below::after {\n  bottom: auto;\n  top: -5px;\n  border-right: none;\n  border-bottom: none;\n  border-left: 1px solid var(--eg-line-2);\n  border-top: 1px solid var(--eg-line-2);\n}\n.eg-rpop-head {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.eg-rpop-title {\n  display: flex;\n  align-items: baseline;\n  justify-content: center;\n  flex-wrap: wrap;\n  gap: 5px;\n  min-width: 0;\n}\n.eg-rpop-word {\n  font-family: var(--eg-en);\n  font-size: 14.5px;\n  font-weight: 700;\n  line-height: 1.3;\n  color: var(--eg-ink);\n  overflow-wrap: anywhere;\n}\n.eg-rpop-lemma {\n  font-family: var(--eg-en);\n  font-size: 11.5px;\n  color: var(--eg-ink-2);\n}\n.eg-rpop-close {\n  appearance: none; -webkit-appearance: none;\n  position: absolute;\n  top: 6px;\n  right: 6px;\n  width: 18px;\n  height: 18px;\n  margin: 0;\n  padding: 0;\n  border: none;\n  border-radius: 5px;\n  background: transparent;\n  color: var(--eg-ink-2);\n  font: 600 13px/1 var(--eg-font);\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition: background var(--eg-dur) ease, color var(--eg-dur) ease;\n}\n.eg-rpop-close:hover { background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-rpop-close:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-rpop-tags {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-wrap: wrap;\n  gap: 5px;\n  margin-top: 4px;\n}\n.eg-rpop-pos,\n.eg-rpop-bank {\n  display: inline-flex;\n  align-items: center;\n  padding: 1px 6px;\n  border-radius: 999px;\n  font: 600 10.5px/1.35 var(--eg-font);\n}\n.eg-rpop-pos {\n  background: var(--eg-bg-2);\n  border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2);\n}\n.eg-rpop-bank {\n  background: color-mix(in srgb, var(--eg-accent) 10%, var(--eg-bg));\n  border: 1px solid color-mix(in srgb, var(--eg-accent) 24%, transparent);\n  color: var(--eg-accent-ink);\n}\n.eg-rpop-zh {\n  margin-top: 5px;\n  font: 500 var(--eg-fs-xs)/1.5 var(--eg-font);\n  color: var(--eg-ink);\n  text-align: center;\n  overflow-wrap: anywhere;\n}\n.eg-practice { margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--eg-line); }\n.eg-ptitle {\n  display: flex; align-items: center; justify-content: flex-start; gap: 7px;\n  font-size: var(--eg-fs-xs); font-weight: 650; letter-spacing: .03em; color: var(--eg-ink-2);\n  margin-bottom: 10px;\n}\n.eg-q {\n  margin: 0; padding: 13px 15px; border: 1px solid var(--eg-line); border-radius: 11px;\n  background: var(--eg-bg); transition: border-color var(--eg-dur) ease;\n}\n.eg-q + .eg-q { margin-top: 10px; }\n.eg-q.reveal { border-color: var(--eg-line-2); }\n.eg-q-head { display: flex; gap: 9px; align-items: flex-start; justify-content: flex-start; text-align: left; }\n.eg-q-n {\n  flex: 0 0 auto; width: 20px; height: 20px; margin-top: 1px; border-radius: 6px;\n  background: var(--eg-bg-2); border: 1px solid var(--eg-line); color: var(--eg-ink);\n  display: inline-flex; align-items: center; justify-content: center;\n  font: 700 11px/1 var(--eg-font); font-variant-numeric: tabular-nums;\n}\n.eg-q-zh { font-size: var(--eg-fs-sm); font-weight: 500; line-height: 1.6; color: var(--eg-ink); text-align: left; }\n.eg-q-toggle {\n  appearance: none; -webkit-appearance: none;\n  margin-top: 10px; display: inline-flex; align-items: center; gap: 5px;\n  min-height: 27px; padding: 4px 10px; border-radius: 7px;\n  background: var(--eg-bg); border: 1px solid var(--eg-line); color: var(--eg-ink-2);\n  cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font);\n  transition: background var(--eg-dur) ease, color var(--eg-dur) ease, border-color var(--eg-dur) ease;\n}\n.eg-q-toggle:hover { background: var(--eg-bg-2); border-color: var(--eg-line-2); color: var(--eg-ink); }\n.eg-q-toggle:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-q-toggle .caret { display: inline-block; transition: transform .22s var(--eg-ease); }\n.eg-q.reveal .eg-q-toggle .caret { transform: rotate(90deg); }\n.eg-q-en {\n  margin-top: 10px; padding: 10px 13px; border-radius: 8px;\n  border: 1px solid var(--eg-line); border-left: 2.5px solid var(--eg-accent);\n  background: var(--eg-bg-2); font-family: var(--eg-en); font-size: 14.5px; line-height: 1.6;\n  color: var(--eg-ink); text-align: left;\n}\n.eg-practice-pending {\n  display: flex; align-items: center; gap: 8px; padding: 12px 14px;\n  border: 1px solid var(--eg-line); border-radius: 11px; background: var(--eg-bg-2);\n  color: var(--eg-ink-2); font-size: var(--eg-fs-xs);\n}\n.eg-practice-pending .eg-spin { width: 12px; height: 12px; border-width: 1.5px; }\n.eg-practice-err {\n  display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 11px 14px;\n  border: 1px solid var(--eg-line); border-radius: 11px; background: var(--eg-bg-2);\n  color: var(--eg-bad); font-size: var(--eg-fs-xs);\n}\n.eg-report-foot {\n  margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--eg-line);\n  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;\n}\n.eg-report-foot-hint { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.4; }\n.eg-report-foot-err { display: inline-flex; align-items: center; gap: 8px; color: var(--eg-bad); font-size: var(--eg-fs-xs); line-height: 1.4; }\n.eg-report .eg-actions { justify-content: flex-start; margin-top: 18px; }\n\n';

// src/client/styles/word.css
var word_default = "/* ===== word training ===== */\n.eg-letters { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }\n.eg-letters.is-bad { animation: eg-shake .32s cubic-bezier(.36, .07, .19, .97) both; }\n@keyframes eg-shake {\n  0%, 100% { transform: translateX(0); }\n  20% { transform: translateX(-5px); }\n  42% { transform: translateX(5px); }\n  64% { transform: translateX(-3px); }\n  84% { transform: translateX(2px); }\n}\n.eg-letter {\n  flex: 1 1 0; min-width: 8px; max-width: 38px; width: auto; height: 48px; padding: 0; text-align: center;\n  border: none; border-bottom: 2px solid var(--eg-line-2); border-radius: 6px 6px 0 0;\n  background: transparent; color: var(--eg-ink);\n  font: 600 22px/1 var(--eg-font); text-transform: lowercase; outline: none;\n  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, color var(--eg-dur) ease, box-shadow var(--eg-dur) ease, transform .14s var(--eg-spring);\n}\n.eg-letter:hover { border-bottom-color: var(--eg-ink-2); background: var(--eg-bg-2); }\n.eg-letter:focus { border-bottom-color: var(--eg-accent); background: var(--eg-bg-2); box-shadow: 0 3px 0 -1px color-mix(in srgb, var(--eg-accent) 26%, transparent); }\n.eg-letter.is-pop { animation: eg-letter-pop .16s var(--eg-spring); }\n@keyframes eg-letter-pop {\n  0% { transform: scale(.9); }\n  55% { transform: scale(1.1); }\n  100% { transform: scale(1); }\n}\n.eg-letter.ok { border-bottom-color: var(--eg-ok); color: var(--eg-ok); }\n.eg-letters.is-ok .eg-letter.ok {\n  animation: eg-letter-ok .34s var(--eg-spring) calc(var(--i, 0) * 34ms) both;\n}\n@keyframes eg-letter-ok {\n  0% { transform: translateY(0) scale(1); }\n  45% { transform: translateY(-5px) scale(1.08); }\n  100% { transform: translateY(0) scale(1); }\n}\n.eg-letter.bad { border-bottom-color: var(--eg-bad); color: var(--eg-bad); }\n.eg-letters.answered .eg-letter { cursor: default; }\n/* word training: centred column */\n.eg-word {\n  container-type: inline-size;\n  width: 100%; max-width: 640px; margin-left: auto; margin-right: auto;\n  height: 100%; min-height: 0; display: flex; flex-direction: column; align-items: stretch; text-align: center;\n}\n.eg-word-main {\n  flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center;\n  min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 10px 0 14px;\n  scrollbar-width: none; -ms-overflow-style: none;\n}\n.eg-word-main::-webkit-scrollbar { display: none; width: 0; height: 0; }\n.eg-word-stage { width: 100%; margin: auto 0; display: flex; flex-direction: column; align-items: center; animation: eg-view-in .18s var(--eg-ease) both; }\n.eg-word .eg-pos {\n  display: inline-flex; align-items: center; margin: 0 0 4px; padding: 3px 10px;\n  border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font: 600 11.5px/1.2 var(--eg-font);\n}\n.eg-word .eg-zh {\n  max-width: 500px;\n  font-family: var(--eg-font); font-size: 23px; font-weight: 700; letter-spacing: -.01em; line-height: 1.42;\n  margin-top: 6px; color: var(--eg-ink); text-wrap: balance; overflow-wrap: break-word;\n}\n.eg-word .eg-zh.is-long { font-size: 20px; }\n.eg-word .eg-zh.is-xlong { font-size: 18px; line-height: 1.48; }\n.eg-word .eg-letters { justify-content: center; margin-top: 18px; width: 100%; }\n.eg-word .eg-foot { justify-content: center; width: 100%; margin-top: 24px; }\n.eg-word .eg-foot .eg-kbd { margin-left: 0; }\n.eg-word .eg-fb {\n  width: 100%; text-align: center; margin-top: 14px; padding: 0; border: none; border-radius: 0; background: transparent;\n}\n.eg-word .eg-fb-top { justify-content: center; align-items: center; flex-wrap: wrap; gap: 8px; }\n.eg-word .eg-fb-actions { justify-content: center; }\n.eg-word .eg-fb > .eg-fb-actions:first-child { margin-top: 0; gap: 8px; flex-wrap: wrap; justify-content: center; }\n.eg-word .eg-fb-actions .eg-btn { padding: 0 10px; }\n.eg-word-miss-wrap {\n  width: 100%;\n  pointer-events: none;\n  transition: grid-template-rows .13s var(--eg-ease) .08s, opacity .08s ease;\n}\n.eg-word-miss-wrap.open {\n  pointer-events: auto;\n  transition: grid-template-rows .14s var(--eg-ease) .1s, opacity .14s ease .16s;\n}\n.eg-word-miss { padding-top: 12px; font-size: var(--eg-fs-xs); font-weight: 550; color: var(--eg-bad); }\n.eg-word-reveal {\n  width: 100%;\n  pointer-events: none;\n  transition: grid-template-rows .14s var(--eg-ease) .095s, opacity .09s ease;\n}\n.eg-word-reveal .eg-collapse-inner {\n  transform: translateY(-4px);\n  transition: transform .09s ease;\n}\n.eg-word-reveal.open {\n  pointer-events: auto;\n  transition: grid-template-rows .14s var(--eg-ease), opacity .14s ease .12s;\n}\n.eg-word-reveal.open .eg-collapse-inner {\n  transform: none;\n  transition: transform .15s var(--eg-ease) .12s;\n}\n.eg-word-foot { flex: 0 0 auto; display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--eg-line); }\n.eg-word-foot .eg-btn { padding: 0 12px; }\n.eg-word .eg-fb-ref {\n  margin-top: 8px; padding: 0; background: transparent; font-family: var(--eg-en); font-size: 24px; font-weight: 600; text-align: center;\n}\n.eg-phonetics {\n  display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px 14px; margin-top: 10px;\n}\n.eg-fb-ref + .eg-phonetics {\n  margin-top: 4px;\n}\n.eg-phonetic {\n  display: inline-flex; align-items: center; gap: 5px; color: var(--eg-ink-2);\n}\n.eg-phonetic-tag {\n  display: inline-flex; align-items: center; justify-content: center; padding: 1px 5px; border-radius: 4px;\n  background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font: 600 10.5px/1.25 var(--eg-font);\n}\n.eg-phonetic-ipa {\n  font-family: var(--eg-ipa); font-size: 13.5px; line-height: 1.4; letter-spacing: .01em;\n  color: var(--eg-ink-2); user-select: text;\n}\n.eg-word .eg-eg {\n  width: 100%; max-width: 480px; margin: 12px auto 0; padding: 10px 15px;\n  border: none; border-radius: 10px; background: var(--eg-bg-2); text-align: center;\n  transition: background var(--eg-dur) ease;\n}\n.eg-word .eg-eg.done { animation: eg-view-in .22s var(--eg-ease) both; }\n.eg-word .eg-word-reveal .eg-fb-ref,\n.eg-word .eg-word-reveal .eg-eg.done {\n  animation: none;\n}\n.eg-word .eg-eg-en { font: 15px/1.65 var(--eg-en); color: var(--eg-ink); overflow-wrap: anywhere; }\n.eg-word .eg-eg-zh { margin-top: 5px; font: var(--eg-fs-xs)/1.6 var(--eg-font); color: var(--eg-ink-2); }\n.eg-eg-hit {\n  padding: 1px 4px; border-radius: 4px;\n  background: color-mix(in srgb, var(--eg-accent) 13%, transparent);\n  color: var(--eg-ink); font-weight: 700;\n}\n/* ===== word bank bar ===== */\n.eg-bankbar { width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; padding: 0 0 10px; margin: 0; border-bottom: 1px solid var(--eg-line); }\n.eg-srs-bar {\n  width: 100%; display: flex; flex-direction: column; align-items: center; gap: 5px;\n  padding: 2px 2px 10px; margin: 0 0 6px; border-bottom: 1px solid var(--eg-line);\n}\n.eg-srs-hint {\n  font: 400 11px/1.4 var(--eg-font); color: var(--eg-ink-2); text-align: center;\n}\n.eg-srs-meta {\n  font: 500 11px/1.3 var(--eg-font); color: var(--eg-ink-2); font-variant-numeric: tabular-nums;\n  opacity: .82; text-align: center;\n}\n.eg-srs-modes {\n  position: relative; display: inline-flex; align-items: center; gap: 3px; padding: 2px;\n  border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n}\n.eg-srs-indicator {\n  position: absolute; top: 2px; bottom: 2px; left: 0; z-index: 0;\n  border-radius: 999px; background: var(--eg-bg);\n  box-shadow: 0 1px 2px rgba(17, 22, 31, .08); pointer-events: none;\n  transition: transform .24s var(--eg-ease), width .24s var(--eg-ease), opacity .16s ease;\n  will-change: transform, width;\n}\n.eg-srs-mode {\n  position: relative; z-index: 1;\n  appearance: none; -webkit-appearance: none;\n  display: inline-flex; align-items: center; gap: 5px; height: 24px; padding: 0 10px;\n  border: none; border-radius: 999px; background: transparent; color: var(--eg-ink-2);\n  font: 600 11.5px/1 var(--eg-font); cursor: pointer; white-space: nowrap;\n  transition: background var(--eg-dur) ease, color var(--eg-dur) ease;\n}\n.eg-srs-mode:hover:not(.active):not(:disabled) { color: var(--eg-ink); }\n.eg-srs-mode.active { color: var(--eg-ink); }\n.eg-srs-modes:not(.has-slider) .eg-srs-mode.active { background: var(--eg-bg); box-shadow: 0 1px 2px rgba(17, 22, 31, .08); }\n.eg-srs-mode:disabled { opacity: .6; cursor: not-allowed; }\n.eg-srs-mode:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-srs-due {\n  display: inline-flex; align-items: center; justify-content: center;\n  min-width: 16px; height: 16px; padding: 0 4px; border-radius: 999px;\n  background: color-mix(in srgb, var(--eg-warn) 18%, transparent);\n  color: var(--eg-warn); font: 700 10.5px/1 var(--eg-font); font-variant-numeric: tabular-nums;\n}\n.eg-word-meta {\n  display: inline-flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 6px; margin: 0 0 2px;\n  color: var(--eg-ink-2); font: 500 12px/1.3 var(--eg-font);\n}\n.eg-pos-text { color: var(--eg-ink-2); }\n.eg-meta-sep { opacity: .45; }\n.eg-srs-tag {\n  display: inline-flex; align-items: center; gap: 6px;\n  color: var(--eg-ink-2); font: 500 12px/1.3 var(--eg-font);\n}\n.eg-srs-tag.is-review {\n  color: var(--eg-warn); font-weight: 600;\n}\n.eg-srs-dots { display: inline-flex; align-items: center; gap: 2.5px; }\n.eg-srs-dot {\n  width: 4.5px; height: 4.5px; border-radius: 50%; background: var(--eg-line-2); display: inline-block;\n}\n.eg-srs-dot.on { background: currentColor; }\n.eg-srs-hard {\n  display: inline-flex; align-items: center; padding: 1px 6px; border-radius: 999px;\n  background: color-mix(in srgb, var(--eg-bad) 10%, transparent);\n  border: 1px solid color-mix(in srgb, var(--eg-bad) 26%, transparent);\n  color: var(--eg-bad); font: 600 10.5px/1.25 var(--eg-font);\n}\n.eg-srs-next {\n  display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 999px;\n  background: color-mix(in srgb, var(--eg-ok) 12%, var(--eg-bg));\n  border: 1px solid color-mix(in srgb, var(--eg-ok) 26%, transparent);\n  color: var(--eg-ok); font: 600 11.5px/1.3 var(--eg-font);\n}\n.eg-fsrs-rate {\n  display: inline-flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 7px;\n  margin-top: 9px; padding: 4px 8px; border-radius: 999px;\n  background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n}\n.eg-fsrs-rate-lbl {\n  font: 600 11px/1 var(--eg-font); color: var(--eg-ink-2); padding-left: 2px;\n}\n.eg-fsrs-rate-btns {\n  display: inline-flex; align-items: center; flex-wrap: wrap; justify-content: center; gap: 4px;\n}\n.eg-fsrs-btn {\n  appearance: none; -webkit-appearance: none;\n  display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 8px;\n  border: 1px solid transparent; border-radius: 999px; background: transparent; color: var(--eg-ink-2);\n  font: 600 11.5px/1 var(--eg-font); cursor: pointer;\n  transition: background var(--eg-dur) ease, border-color var(--eg-dur) ease, color var(--eg-dur) ease, transform .12s ease;\n}\n.eg-fsrs-btn:hover:not(.active):not(:disabled) {\n  background: var(--eg-bg); border-color: var(--eg-line); color: var(--eg-ink);\n}\n.eg-fsrs-btn:active:not(:disabled) { transform: scale(.96); }\n.eg-fsrs-btn.active {\n  background: var(--eg-bg); border-color: color-mix(in srgb, var(--eg-accent) 42%, var(--eg-line));\n  color: var(--eg-ink); box-shadow: 0 1px 2px rgba(17, 22, 31, .08);\n}\n.eg-fsrs-btn:disabled { opacity: .6; cursor: not-allowed; }\n.eg-fsrs-btn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-fsrs-key {\n  display: inline-flex; align-items: center; justify-content: center;\n  min-width: 14px; height: 14px; padding: 0 3px; border-radius: 4px;\n  background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  font: 600 10px/1 var(--eg-font); color: var(--eg-ink-2);\n}\n.eg-fsrs-btn.active .eg-fsrs-key {\n  background: color-mix(in srgb, var(--eg-accent) 12%, var(--eg-bg));\n  border-color: color-mix(in srgb, var(--eg-accent) 30%, transparent);\n  color: var(--eg-accent);\n}\n.eg-fsrs-iv {\n  font: 500 11px/1 var(--eg-font); color: var(--eg-ink-2); font-variant-numeric: tabular-nums;\n}\n.eg-fsrs-btn.active .eg-fsrs-iv { color: var(--eg-ok); font-weight: 600; }\n.eg-srs-done {\n  margin: auto; padding: 22px 20px; max-width: 380px; width: 100%;\n  border: 1px solid var(--eg-line); border-radius: 12px; background: var(--eg-bg-2);\n  display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center;\n  animation: eg-view-in .18s var(--eg-ease) both;\n}\n.eg-srs-done-title { font: 700 15px/1.35 var(--eg-font); color: var(--eg-ink); }\n.eg-srs-done-sub { font: 500 var(--eg-fs-xs)/1.5 var(--eg-font); color: var(--eg-ink-2); font-variant-numeric: tabular-nums; }\n.eg-banklabel { flex: 0 0 auto; font-size: var(--eg-fs-xs); font-weight: 600; color: var(--eg-ink-2); }\n@container (max-width: 315px) {\n  .eg-banklabel { display: none; }\n}\n.eg-select {\n  flex: 1 1 auto; min-width: 0; max-width: 280px; height: 34px; padding: 0 26px 0 12px; border: 1px solid var(--eg-line);\n  border-radius: 999px; background: var(--eg-bg-2); color: var(--eg-ink); cursor: pointer;\n  font: 600 var(--eg-fs-xs)/1 var(--eg-font); outline: none; appearance: none;\n  background-image: linear-gradient(45deg, transparent 50%, var(--eg-ink-2) 50%), linear-gradient(135deg, var(--eg-ink-2) 50%, transparent 50%);\n  background-position: calc(100% - 13px) 13px, calc(100% - 9px) 13px; background-size: 4px 4px, 4px 4px; background-repeat: no-repeat;\n  transition: border-color var(--eg-dur) ease, background-color var(--eg-dur) ease;\n}\n.eg-select:hover { border-color: var(--eg-line-2); }\n.eg-select:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-bankbtn { appearance: none; -webkit-appearance: none;\n  flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; gap: 4px;\n  min-height: 34px; padding: 0 12px; border: 1px solid var(--eg-line); border-radius: 999px;\n  background: var(--eg-bg); color: var(--eg-ink-2); cursor: pointer;\n  font: 600 var(--eg-fs-xs)/1 var(--eg-font);\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease, transform .14s ease;\n}\n.eg-bankbtn:hover { border-color: var(--eg-line-2); color: var(--eg-ink); background: var(--eg-bg-2); }\n.eg-bankbtn:active { transform: scale(.95); }\n.eg-bankbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-notice { margin: 0 0 12px; padding: 8px 11px; border-radius: 9px; background: color-mix(in srgb, var(--eg-ok) 9%, transparent); border: 1px solid color-mix(in srgb, var(--eg-ok) 28%, transparent); color: var(--eg-ink); font-size: var(--eg-fs-xs); line-height: 1.5; animation: eg-view-in .2s var(--eg-ease) both; }\n\n/* ===== word bank import ===== */\n.eg-import { width: 100%; max-width: 520px; margin: 0 auto; text-align: left; animation: eg-view-in .2s var(--eg-ease) both; }\n.eg-import-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }\n.eg-import-title { font-size: var(--eg-fs-md); font-weight: 700; color: var(--eg-ink); line-height: 1.3; }\n.eg-import-actions { flex: 0 0 auto; display: flex; align-items: center; gap: 6px; }\n.eg-import-back, .eg-filebtn { appearance: none; -webkit-appearance: none;\n  flex: 0 0 auto; display: inline-flex; align-items: center; min-height: 30px; padding: 4px 10px;\n  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg);\n  color: var(--eg-ink-2); cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font); white-space: nowrap;\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-import-back:hover, .eg-filebtn:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-import-back:focus-visible, .eg-filebtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-import-sub { margin-top: 4px; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.5; }\n.eg-field { margin-top: 10px; }\n.eg-field label { display: block; margin-bottom: 6px; font-size: var(--eg-fs-xs); font-weight: 600; color: var(--eg-ink-2); }\n.eg-text {\n  width: 100%; height: 34px; padding: 0 11px; border: 1px solid var(--eg-line); border-radius: 8px;\n  background: var(--eg-bg-2); color: var(--eg-ink); font: var(--eg-fs-sm)/1 var(--eg-font); outline: none;\n  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, box-shadow var(--eg-dur) ease;\n}\n.eg-text:hover { border-color: var(--eg-line-2); }\n.eg-text:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }\n.eg-textarea-wrap { position: relative; margin-top: 10px; }\n.eg-textarea {\n  width: 100%; min-height: 86px; resize: vertical; padding: 9px 11px; border: 1px solid var(--eg-line); border-radius: 10px;\n  background: var(--eg-bg-2); color: var(--eg-ink); font: var(--eg-fs-xs)/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; outline: none;\n  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, box-shadow var(--eg-dur) ease;\n}\n.eg-textarea-wrap.over .eg-textarea, .eg-textarea-wrap:hover .eg-textarea { border-color: var(--eg-accent); background: color-mix(in srgb, var(--eg-accent) 5%, var(--eg-bg-2)); }\n.eg-textarea:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }\n.eg-preview { margin-top: 12px; border: 1px solid var(--eg-line); border-radius: 10px; overflow: hidden; animation: eg-view-in .2s var(--eg-ease) both; }\n.eg-preview-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px; background: var(--eg-bg-2); font-size: var(--eg-fs-xs); color: var(--eg-ink-2); }\n.eg-preview-top strong { color: var(--eg-ink); }\n.eg-preview-row { display: flex; flex-wrap: wrap; gap: 10px; padding: 7px 10px; border-top: 1px solid var(--eg-line); font-size: var(--eg-fs-xs); line-height: 1.5; }\n.eg-preview-row .w { flex: 0 0 38%; font-weight: 650; overflow-wrap: anywhere; }\n.eg-preview-row .ph { font-family: var(--eg-ipa); color: var(--eg-ink-2); font-size: 11.5px; margin-left: 6px; font-weight: 400; }\n.eg-preview-row .m { flex: 1 1 auto; color: var(--eg-ink-2); overflow-wrap: anywhere; }\n.eg-preview-row .ex { flex: 1 0 100%; color: var(--eg-ink-2); font-family: var(--eg-en); font-style: italic; overflow-wrap: anywhere; }\n.eg-preview-errors { margin-top: 8px; padding: 8px 10px; border-radius: 8px; background: color-mix(in srgb, var(--eg-bad) 7%, transparent); border: 1px solid color-mix(in srgb, var(--eg-bad) 24%, transparent); }\n.eg-preview-errors .er { font-size: var(--eg-fs-xs); line-height: 1.55; color: var(--eg-bad); }\n.eg-import-foot { display: flex; gap: 8px; margin-top: 10px; }\n\n";

// src/client/styles/settings.css
var settings_default = `/* ===== settings ===== */
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
.eg-setting-note {
  margin-top: 8px; padding: 7px 10px; border-radius: 8px;
  background: color-mix(in srgb, var(--eg-accent) 6%, var(--eg-bg-2));
  border: 1px solid color-mix(in srgb, var(--eg-accent) 18%, var(--eg-line));
  color: var(--eg-ink-2); font-size: 11.5px; line-height: 1.5;
}
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
.eg-setting-sub.is-stack {
  flex-direction: column; align-items: stretch; gap: 9px;
}
.eg-effort-head {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
}
.eg-effort-badge {
  font-size: 11px; font-weight: 600; color: var(--eg-ink-2);
}
.eg-effort-list {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px;
}
@container (max-width: 279px) {
  .eg-effort-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.eg-effort-btn {
  appearance: none; -webkit-appearance: none;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  min-height: 40px; padding: 5px 8px;
  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg);
  color: var(--eg-ink-2); cursor: pointer;
  transition: background var(--eg-dur) ease, border-color var(--eg-dur) ease, color var(--eg-dur) ease, transform .14s ease;
}
.eg-effort-label { font: 650 12.5px/1.2 var(--eg-font); color: var(--eg-ink); }
.eg-effort-desc { font: 500 10.5px/1.2 var(--eg-font); color: var(--eg-ink-2); }
.eg-effort-btn:hover:not(.active):not(:disabled) {
  background: var(--eg-bg-3, var(--eg-bg-2)); border-color: var(--eg-line-2); color: var(--eg-ink);
}
.eg-effort-btn:active:not(:disabled) { transform: scale(.96); }
.eg-effort-btn.active {
  border-color: var(--eg-accent); background: var(--eg-accent); color: var(--eg-on-accent);
}
.eg-effort-btn.active .eg-effort-label,
.eg-effort-btn.active .eg-effort-desc { color: var(--eg-on-accent); }
.eg-effort-btn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }
.eg-effort-detail {
  color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.5;
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
.eg-bank-list {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; margin-top: 12px;
}
.eg-level-list {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; margin-top: 12px;
}
.eg-retention-list {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; margin-top: 12px;
}
@container (min-width: 440px) {
  .eg-direction-list { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .eg-bank-list { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .eg-level-list { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; }
  .eg-retention-list { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
}
@container (max-width: 279px) {
  .eg-direction-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .eg-bank-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .eg-level-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .eg-retention-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.eg-bank-item {
  appearance: none; -webkit-appearance: none;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  min-height: 44px; padding: 6px 8px;
  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg);
  color: var(--eg-ink-2); cursor: pointer;
  transition: background var(--eg-dur) ease, border-color var(--eg-dur) ease, color var(--eg-dur) ease, transform .14s ease;
}
.eg-bank-name { font: 600 12.5px/1.2 var(--eg-font); color: var(--eg-ink); }
.eg-bank-cnt { font: 500 11px/1.2 var(--eg-font); font-variant-numeric: tabular-nums; color: var(--eg-ink-2); }
.eg-bank-item:hover:not(.active):not(:disabled) {
  background: var(--eg-bg-2); border-color: var(--eg-line-2); color: var(--eg-ink);
}
.eg-bank-item:active:not(:disabled) { transform: scale(.96); }
.eg-bank-item.active {
  border-color: var(--eg-accent); background: var(--eg-accent); color: var(--eg-on-accent);
}
.eg-bank-item.active .eg-bank-name,
.eg-bank-item.active .eg-bank-cnt { color: var(--eg-on-accent); }
.eg-bank-item:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }
.eg-bank-notice { margin-top: 10px; margin-bottom: 0; }
.eg-level {
  appearance: none; -webkit-appearance: none;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  min-height: 44px; padding: 6px 8px;
  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg);
  color: var(--eg-ink-2); cursor: pointer;
  transition: background var(--eg-dur) ease, border-color var(--eg-dur) ease, color var(--eg-dur) ease, transform .14s ease;
}
.eg-level-code { font: 700 13px/1.1 var(--eg-en); color: var(--eg-ink); }
.eg-level-desc { font: 500 11px/1.2 var(--eg-font); color: var(--eg-ink-2); }
.eg-level:hover:not(.active):not(:disabled) {
  background: var(--eg-bg-2); border-color: var(--eg-line-2); color: var(--eg-ink);
}
.eg-level:active:not(:disabled) { transform: scale(.96); }
.eg-level.active {
  border-color: var(--eg-accent); background: var(--eg-accent); color: var(--eg-on-accent);
}
.eg-level.active .eg-level-code,
.eg-level.active .eg-level-desc { color: var(--eg-on-accent); }
.eg-level:disabled { opacity: .6; cursor: not-allowed; }
.eg-level:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }
.eg-level-detail {
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--eg-bg-2);
  border: 1px solid var(--eg-line);
  color: var(--eg-ink-2);
  font-size: var(--eg-fs-xs);
  line-height: 1.55;
  text-align: center;
}
.eg-level-detail strong {
  color: var(--eg-ink);
  font-weight: 650;
  margin-right: 6px;
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
.eg-clean-ranges {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; margin-top: 12px;
}
@container (min-width: 440px) {
  .eg-clean-ranges { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
}
@container (max-width: 279px) {
  .eg-clean-ranges { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.eg-clean-range {
  appearance: none; -webkit-appearance: none; text-align: center;
  min-height: 34px; padding: 6px 8px;
  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg);
  color: var(--eg-ink-2); font: 500 12.5px/1.3 var(--eg-font); cursor: pointer;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: background var(--eg-dur) ease, border-color var(--eg-dur) ease, color var(--eg-dur) ease, transform .14s ease;
}
.eg-clean-range:hover:not(.active):not(:disabled) {
  background: var(--eg-bg-2); border-color: var(--eg-line-2); color: var(--eg-ink);
}
.eg-clean-range:active:not(:disabled) { transform: scale(.96); }
.eg-clean-range.active {
  border-color: var(--eg-accent); background: var(--eg-accent);
  color: var(--eg-on-accent); font-weight: 600;
}
.eg-clean-range.is-danger.active {
  border-color: var(--eg-bad); background: var(--eg-bad); color: #ffffff;
}
.eg-clean-range:disabled { opacity: .6; cursor: not-allowed; }
.eg-clean-range:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }
.eg-clean-foot {
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--eg-line);
}
.eg-clean-check {
  display: flex; align-items: center; gap: 8px; margin-top: 0; flex: 1 1 200px;
  font-size: var(--eg-fs-xs); line-height: 1.45; color: var(--eg-ink-2); cursor: pointer; user-select: none;
}
.eg-clean-check input { margin: 0; accent-color: var(--eg-accent); cursor: pointer; flex: 0 0 auto; }
.eg-clean-foot .eg-btn {
  min-height: 32px; height: 32px; padding: 0 13px; border-radius: 8px; flex: 0 0 auto;
}
.eg-btn.danger {
  border-color: color-mix(in srgb, var(--eg-bad) 36%, transparent);
  background: color-mix(in srgb, var(--eg-bad) 8%, var(--eg-bg));
  color: var(--eg-bad);
}
.eg-btn.danger:hover:not(:disabled) {
  background: color-mix(in srgb, var(--eg-bad) 15%, var(--eg-bg));
  border-color: color-mix(in srgb, var(--eg-bad) 55%, transparent);
}
.eg-clean-confirm {
  margin-top: 12px; padding: 10px 12px; border-radius: 10px;
  background: color-mix(in srgb, var(--eg-bad) 6%, var(--eg-bg-2));
  border: 1px solid color-mix(in srgb, var(--eg-bad) 26%, transparent);
  display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;
}
.eg-clean-confirm-text { font-size: var(--eg-fs-xs); line-height: 1.5; color: var(--eg-ink); flex: 1 1 200px; }
.eg-clean-confirm-actions { display: flex; align-items: center; gap: 7px; margin-left: auto; }
.eg-clean-confirm-actions .eg-btn { min-height: 30px; height: 30px; padding: 0 12px; border-radius: 8px; }
.eg-clean-notice { margin-top: 10px; margin-bottom: 0; }

`;

// src/client/styles/dashboard.css
var dashboard_default = "/* ===== dashboard ===== */\n.eg-dash { container-type: inline-size; display: flex; flex-direction: column; }\n.eg-dash-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; }\n.eg-dash-title { font: 700 15px/1.2 var(--eg-font); color: var(--eg-ink); white-space: nowrap; }\n.eg-dash-ranges {\n  display: inline-flex; align-items: center; gap: 2px; padding: 2px;\n  border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n}\n.eg-rangebtn {\n  appearance: none; -webkit-appearance: none;\n  height: 24px; padding: 0 9px; border: none; border-radius: 999px;\n  background: transparent; color: var(--eg-ink-2); cursor: pointer;\n  font: 600 11.5px/1 var(--eg-font); font-variant-numeric: tabular-nums;\n  transition: background var(--eg-dur) ease, color var(--eg-dur) ease;\n}\n.eg-rangebtn:hover:not(.active) { color: var(--eg-ink); }\n.eg-rangebtn.active { background: var(--eg-bg); color: var(--eg-ink); box-shadow: 0 1px 2px rgba(17, 22, 31, .08); }\n.eg-rangebtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-dash-sum { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin: 14px 0 2px; }\n.eg-stat {\n  min-width: 0; border: 1px solid var(--eg-line); border-radius: 11px; padding: 10px 6px;\n  text-align: center; background: var(--eg-bg);\n  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-stat:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); }\n.eg-stat b { display: block; font: 700 18px/1.15 var(--eg-font); font-variant-numeric: tabular-nums; color: var(--eg-ink); }\n.eg-stat span { display: block; margin-top: 3px; font-size: 11.5px; color: var(--eg-ink-2); }\n.eg-cal-card { position: relative; margin-top: 12px; padding: 12px 14px; border: 1px solid var(--eg-line); border-radius: 12px; background: var(--eg-bg); }\n.eg-gh-head { font: 600 12.5px/1.3 var(--eg-font); color: var(--eg-ink); margin-bottom: 10px; font-variant-numeric: tabular-nums; }\n.eg-gh-wrap { display: flex; align-items: flex-start; gap: 6px; }\n.eg-gh-dows {\n  display: grid; grid-template-rows: repeat(7, 9px); gap: 2px; padding-top: 16px; flex: 0 0 auto;\n  min-width: 12px; font: 500 9.5px/9px var(--eg-font); color: var(--eg-ink-2); text-align: right; user-select: none;\n}\n.eg-gh-scroll {\n  flex: 1 1 auto; min-width: 0; overflow-x: auto; padding-bottom: 2px; scrollbar-width: thin;\n}\n.eg-gh-inner { width: max-content; }\n.eg-gh-months {\n  position: relative; height: 14px; margin-bottom: 2px;\n  font: 500 10px/14px var(--eg-font); color: var(--eg-ink-2); user-select: none;\n}\n.eg-gh-month { position: absolute; top: 0; white-space: nowrap; }\n.eg-gh-grid { display: flex; gap: 2px; }\n.eg-gh-col { display: flex; flex-direction: column; gap: 2px; }\n.eg-gh-cell {\n  appearance: none; -webkit-appearance: none; padding: 0; border: none;\n  width: 9px; height: 9px; border-radius: 2px; display: block;\n  background: var(--eg-bg-2);\n  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--eg-ink) 6%, transparent);\n  transition: transform .12s ease, box-shadow .12s ease;\n}\n.eg-gh-cell.out { visibility: hidden; pointer-events: none; }\n.eg-gh-cell.l1 { background: color-mix(in srgb, var(--eg-ok) 26%, var(--eg-bg)); }\n.eg-gh-cell.l2 { background: color-mix(in srgb, var(--eg-ok) 50%, var(--eg-bg)); }\n.eg-gh-cell.l3 { background: color-mix(in srgb, var(--eg-ok) 74%, var(--eg-bg)); }\n.eg-gh-cell.l4 { background: var(--eg-ok); }\n.eg-gh-cell.today { outline: 1.5px solid var(--eg-ink); outline-offset: -0.5px; }\n.eg-gh-cell.has { cursor: pointer; }\n.eg-gh-cell:hover:not(.out) { transform: scale(1.28); box-shadow: 0 1px 4px rgba(0, 0, 0, .18); position: relative; z-index: 2; }\n.eg-gh-cell:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-gh-foot {\n  display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;\n  margin-top: 10px;\n}\n.eg-gh-hint { font-size: 11px; color: var(--eg-ink-2); }\n.eg-dash-legend { display: flex; align-items: center; justify-content: flex-end; gap: 4px; font-size: 11px; color: var(--eg-ink-2); }\n.eg-dash-legend i {\n  width: 9px; height: 9px; border-radius: 2px; background: var(--eg-bg-2); display: inline-block;\n  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--eg-ink) 6%, transparent);\n}\n.eg-dash-legend i.l1 { background: color-mix(in srgb, var(--eg-ok) 26%, var(--eg-bg)); }\n.eg-dash-legend i.l2 { background: color-mix(in srgb, var(--eg-ok) 50%, var(--eg-bg)); }\n.eg-dash-legend i.l3 { background: color-mix(in srgb, var(--eg-ok) 74%, var(--eg-bg)); }\n.eg-dash-legend i.l4 { background: var(--eg-ok); }\n.eg-gh-tip {\n  position: absolute; z-index: 10; pointer-events: none; white-space: nowrap;\n  padding: 5px 8px; border-radius: 6px; border: 1px solid var(--eg-line-2);\n  background: var(--eg-bg); color: var(--eg-ink);\n  box-shadow: 0 6px 18px rgba(17, 22, 31, .16);\n  font: 500 11px/1.3 var(--eg-font); font-variant-numeric: tabular-nums;\n  transform: translate(-50%, calc(-100% - 8px));\n}\n.eg-hist-bar {\n  display: flex; align-items: baseline; justify-content: space-between; gap: 8px;\n  margin: 20px 0 8px; padding: 0 2px;\n}\n.eg-hist-title { font: 650 var(--eg-fs-xs)/1.3 var(--eg-font); letter-spacing: .03em; color: var(--eg-ink-2); }\n.eg-hist-meta { font-size: 11.5px; color: var(--eg-ink-2); font-variant-numeric: tabular-nums; }\n.eg-pager {\n  display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 5px;\n  margin-top: 14px;\n}\n.eg-pagebtn {\n  appearance: none; -webkit-appearance: none;\n  min-width: 28px; height: 28px; padding: 0 8px;\n  border: 1px solid var(--eg-line); border-radius: 7px;\n  background: var(--eg-bg); color: var(--eg-ink-2); cursor: pointer;\n  font: 600 12px/1 var(--eg-font); font-variant-numeric: tabular-nums;\n  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, color var(--eg-dur) ease;\n}\n.eg-pagebtn:hover:not(:disabled):not(.active) { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-pagebtn.active { border-color: var(--eg-accent); background: var(--eg-accent); color: var(--eg-on-accent); }\n.eg-pagebtn:disabled { opacity: .42; cursor: not-allowed; }\n.eg-pagebtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-page-dots { padding: 0 3px; color: var(--eg-ink-2); font-size: 12px; user-select: none; }\n.eg-hist { display: flex; flex-direction: column; gap: 10px; }\n.eg-hist-day {\n  padding: 13px 15px; border: 1px solid var(--eg-line); border-radius: 12px; background: var(--eg-bg);\n  transition: border-color .25s ease, box-shadow .25s ease;\n}\n.eg-hist-day.is-flash { animation: eg-flash-ring 1.15s var(--eg-ease) both; }\n@keyframes eg-flash-ring {\n  0% { border-color: var(--eg-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 22%, transparent); }\n  70% { border-color: var(--eg-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 12%, transparent); }\n  100% { border-color: var(--eg-line); box-shadow: none; }\n}\n.eg-hist-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 4px; }\n.eg-hist-date { font: 650 14px/1.3 var(--eg-font); color: var(--eg-ink); }\n.eg-hist-date .wd { margin-left: 6px; font-weight: 500; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); }\n.eg-hist-count { flex: 0 0 auto; color: var(--eg-ink-2); font-size: 11.5px; font-variant-numeric: tabular-nums; }\n.eg-hist-sub { margin: 11px 0 6px; font: 600 11.5px/1 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em; }\n.eg-wchips { display: flex; flex-wrap: wrap; gap: 6px; }\n.eg-wchip { display: inline-flex; align-items: baseline; gap: 5px; padding: 3px 9px; border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line); font-size: var(--eg-fs-xs); max-width: 100%; }\n.eg-wchip .w { font-weight: 650; color: var(--eg-ink); }\n.eg-wchip .m { color: var(--eg-ink-2); overflow-wrap: anywhere; }\n.eg-wchip.ok { border-color: color-mix(in srgb, var(--eg-ok) 42%, var(--eg-line)); }\n.eg-wchip.bad { border-color: color-mix(in srgb, var(--eg-bad) 42%, var(--eg-line)); }\n.eg-wchip.is-enter {\n  transform-origin: center bottom;\n  animation: eg-jelly-in .38s cubic-bezier(.22, 1.35, .36, 1) calc(var(--i, 0) * 26ms) both;\n  will-change: transform, opacity;\n}\n@keyframes eg-jelly-in {\n  0%   { opacity: 0; transform: translateY(8px) scale(.76, .72); }\n  52%  { opacity: 1; transform: translateY(-2px) scale(1.06, .95); }\n  76%  { opacity: 1; transform: translateY(.5px) scale(.98, 1.03); }\n  100% { opacity: 1; transform: none; }\n}\n.eg-wchip.is-leave {\n  transform-origin: center top;\n  animation: eg-jelly-out .15s cubic-bezier(.4, 0, 1, 1) calc(var(--ri, 0) * 14ms) both;\n  will-change: transform, opacity;\n}\n@keyframes eg-jelly-out {\n  0%   { opacity: 1; transform: none; }\n  100% { opacity: 0; transform: translateY(-4px) scale(.8, .78); }\n}\n.eg-extra-collapse {\n  display: grid;\n  grid-template-rows: 0fr;\n  transition: grid-template-rows .24s cubic-bezier(.32, 0, .2, 1);\n}\n.eg-extra-collapse.open { grid-template-rows: 1fr; }\n.eg-extra-inner { overflow: hidden; min-height: 0; }\n.eg-extra-wchips { padding: 6px 3px 3px; margin: 0 -3px -3px; }\n.eg-sents { display: flex; flex-direction: column; }\n.eg-extra-sents .eg-sent:first-child { border-top: 1px dashed var(--eg-line); padding-top: 8px; }\n.eg-more {\n  align-self: flex-start; margin: 9px 0 1px; padding: 4px 10px;\n  border: 1px solid var(--eg-line); border-radius: 999px; background: var(--eg-bg);\n  color: var(--eg-ink-2); cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font);\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease, transform .12s ease;\n}\n.eg-more:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-more:active { transform: scale(.96); }\n.eg-more:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-sent { display: flex; gap: 8px; padding: 8px 0; border-top: 1px dashed var(--eg-line); }\n.eg-sent.is-enter {\n  transform-origin: left center;\n  animation: eg-sent-in .32s var(--eg-spring) calc(var(--i, 0) * 38ms) both;\n  will-change: transform, opacity;\n}\n@keyframes eg-sent-in {\n  0%   { opacity: 0; transform: translateY(8px) scale(.96); }\n  65%  { opacity: 1; transform: translateY(-1px) scale(1.01); }\n  100% { opacity: 1; transform: none; }\n}\n.eg-sent.is-leave {\n  transform-origin: left top;\n  animation: eg-sent-out .15s cubic-bezier(.4, 0, 1, 1) calc(var(--ri, 0) * 18ms) both;\n  will-change: transform, opacity;\n}\n@keyframes eg-sent-out {\n  0%   { opacity: 1; transform: none; }\n  100% { opacity: 0; transform: translateY(-5px) scale(.97); }\n}\n.eg-sent:first-child { border-top: none; padding-top: 4px; }\n.eg-sent:last-child { padding-bottom: 2px; }\n.eg-sent .mark { flex: 0 0 auto; width: 14px; font-weight: 700; font-size: var(--eg-fs-sm); line-height: 1.55; }\n.eg-sent.ok .mark { color: var(--eg-ok); }\n.eg-sent.bad .mark { color: var(--eg-bad); }\n.eg-sent .body { flex: 1 1 auto; min-width: 0; }\n.eg-sent .zh { font-size: var(--eg-fs-sm); line-height: 1.55; color: var(--eg-ink); }\n.eg-sent .en { margin-top: 3px; font-family: var(--eg-en); font-size: 13.5px; line-height: 1.55; color: var(--eg-ink-2); overflow-wrap: break-word; }\n.eg-dash-empty { padding: 30px 0; text-align: center; color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.7; }\n.eg-dash-error { margin-top: 10px; color: var(--eg-bad); font-size: var(--eg-fs-xs); }\n\n";

// src/client/styles/reduced-motion.css
var reduced_motion_default = "@media (prefers-reduced-motion: reduce) {\n  .eg-panel, .eg-panel.is-closing, .eg-view, .eg-view > *, .eg-stage-in, .eg-fb, .eg-fb-ref, .eg-fb-tip, .eg-fb-actions,\n  .eg-fb-mine, .eg-fb-corr, .eg-fb-hl,\n  .eg-letters.is-bad, .eg-letter.is-pop, .eg-letters.is-ok .eg-letter.ok, .eg-hist-day.is-flash,\n  .eg-notice, .eg-import, .eg-preview, .eg-word-stage, .eg-srs-done, .eg-word-miss, .eg-word .eg-eg.done, .eg-rpop.is-ready, .eg-rslot, .eg-rslot-row, .eg-rexplain, .eg-wchip.is-enter, .eg-wchip.is-leave, .eg-sent.is-enter, .eg-sent.is-leave { animation: none !important; }\n  .eg-confetti { display: none; }\n  .eg-root *, .eg-panel * { transition: none !important; }\n}\n";

// src/client/core/style.js
var STYLE_ID = "eg-dock-style";
var CSS = [
  tokens_default,
  shell_default,
  phrase_default,
  report_default,
  word_default,
  settings_default,
  dashboard_default,
  reduced_motion_default
].join("\n");
function useStyle() {
  (0, import_react.useEffect)(() => {
    const existing = document.getElementById(STYLE_ID);
    if (existing) {
      if (existing.textContent !== CSS) existing.textContent = CSS;
      return;
    }
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

// src/client/core/store.js
var import_react2 = require("react");

// src/client/core/api.js
var API = "/api/english-gym";
async function api(path, options) {
  const res = await fetch(API + path, {
    headers: { "content-type": "application/json" },
    ...options || {}
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    const message = data && data.error || "HTTP " + res.status;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return data;
}

// src/client/core/store.js
var store = {
  open: false,
  stats: null,
  sessionId: "",
  wordModeRequest: null,
  settings: { confetti: true, topicId: "ai", customTopics: [], bankLink: true, bankRetries: 1, sessionLink: false, reportLevel: "B1", fsrsRetention: 0.9, reasoningEffort: "off" },
  burst: 0,
  listeners: /* @__PURE__ */ new Set(),
  emit() {
    for (const l of Array.from(this.listeners)) l();
  },
  subscribe(l) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  },
  setOpen(v) {
    this.open = v;
    this.emit();
  },
  toggle() {
    this.setOpen(!this.open);
  },
  openWordReview() {
    this.open = true;
    this.wordModeRequest = { mode: "review", tick: Date.now() };
    this.emit();
  },
  setStats(s) {
    this.stats = s;
    this.emit();
  },
  setWordSrs(wordSrs) {
    if (wordSrs && typeof wordSrs === "object") {
      this.stats = { ...this.stats || {}, wordSrs, reviewCount: Number(wordSrs.due) || 0 };
      this.emit();
    }
  },
  setSessionId(id) {
    const next = typeof id === "string" ? id : "";
    if (this.sessionId === next) return;
    this.sessionId = next;
    this.emit();
  },
  setSettings(s) {
    if (s && typeof s === "object") {
      this.settings = { ...this.settings, ...s };
      this.emit();
    }
  },
  celebrate() {
    if (this.settings && this.settings.confetti === false) return;
    this.burst += 1;
    this.emit();
  }
};
async function refreshStats() {
  try {
    store.setStats(await api("/state"));
  } catch {
  }
}
function useShared() {
  const [, force] = (0, import_react2.useReducer)((x) => x + 1, 0);
  (0, import_react2.useEffect)(() => store.subscribe(force), []);
  return store;
}

// src/client/shell/EnglishGymPill.jsx
function EnglishGymPill(props) {
  useStyle();
  const shared = useShared();
  const sessionId = props && typeof props.sessionId === "string" ? props.sessionId : "";
  (0, import_react3.useEffect)(() => {
    store.setSessionId(sessionId);
    return () => {
      if (sessionId && store.sessionId === sessionId) store.setSessionId("");
    };
  }, [sessionId]);
  (0, import_react3.useEffect)(() => {
    if (!store.stats) refreshStats();
    const refreshIfVisible = () => {
      if (typeof document === "undefined" || document.visibilityState === "visible") {
        refreshStats();
      }
    };
    const interval = setInterval(refreshIfVisible, 60 * 1e3);
    const onFocus = () => refreshStats();
    const onVisibility = () => {
      if (document.visibilityState === "visible") refreshStats();
    };
    if (typeof window !== "undefined") window.addEventListener("focus", onFocus);
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") window.removeEventListener("focus", onFocus);
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  const stats = shared.stats;
  return /* @__PURE__ */ import_react3.default.createElement("div", { className: "eg-root eg-entry" }, /* @__PURE__ */ import_react3.default.createElement(
    "button",
    {
      className: "eg-pill",
      onClick: () => store.toggle(),
      title: "English Gym — 短语造句 + 单词拼写",
      "aria-expanded": shared.open ? "true" : "false"
    },
    /* @__PURE__ */ import_react3.default.createElement("span", { className: "eg-mono" }, "EG"),
    /* @__PURE__ */ import_react3.default.createElement("span", { className: "eg-wordmark" }, "English Gym"),
    stats && stats.streakDays > 0 ? /* @__PURE__ */ import_react3.default.createElement("span", { className: "eg-streak" }, "连续 " + stats.streakDays + " 天") : null,
    stats && stats.reviewCount > 0 ? /* @__PURE__ */ import_react3.default.createElement(
      "span",
      {
        className: "eg-chip warn",
        title: "有 " + stats.reviewCount + " 个单词到期复习，点击直接开始",
        onClick: (e) => {
          e.stopPropagation();
          store.openWordReview();
        }
      },
      "待复习 " + stats.reviewCount
    ) : null,
    /* @__PURE__ */ import_react3.default.createElement("span", { className: "eg-chev", "aria-hidden": "true" }, "▸")
  ));
}

// src/client/shell/EnglishGymBoard.jsx
var import_react34 = __toESM(require("react"), 1);

// src/client/components/motion.js
var import_react4 = require("react");
var clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
function bounceButton(e) {
  const el = e && e.currentTarget;
  if (!el || !el.classList) return;
  try {
    el.classList.remove("is-bouncing");
    void el.offsetWidth;
    el.classList.add("is-bouncing");
    clearTimeout(el.__egBounceTimer);
    el.__egBounceTimer = setTimeout(() => el.classList.remove("is-bouncing"), 360);
  } catch {
  }
}
function prefersReducedMotion() {
  try {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch {
    return false;
  }
}
function popElement(el, cls, ms) {
  if (!el || !el.classList || prefersReducedMotion()) return;
  try {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    clearTimeout(el.__egPopTimer);
    el.__egPopTimer = setTimeout(() => el.classList.remove(cls), ms);
  } catch {
  }
}
function useCountUp(target, active) {
  const num = Number(target);
  const [val, setVal] = (0, import_react4.useState)(() => Number.isFinite(num) ? num : target);
  (0, import_react4.useEffect)(() => {
    if (!active || !Number.isFinite(num) || prefersReducedMotion()) {
      setVal(target);
      return void 0;
    }
    let raf = 0;
    const dur = 260;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(num * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    setVal(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, num, active]);
  return val;
}

// src/client/components/Confetti.jsx
var import_react5 = __toESM(require("react"), 1);
function makeConfettiPieces() {
  const colors = [
    "var(--eg-confetti-1)",
    "var(--eg-confetti-2)",
    "var(--eg-confetti-3)",
    "var(--eg-confetti-4)",
    "var(--eg-confetti-5)",
    "var(--eg-confetti-6)"
  ];
  const pieces = [];
  for (let i = 0; i < 64; i += 1) {
    const side = i % 4;
    let x = 0;
    let y = 0;
    let dx = 0;
    let dy = 0;
    if (side === 0) {
      x = 0;
      y = 6 + Math.random() * 88;
      dx = 70 + Math.random() * 110;
      dy = (Math.random() - 0.5) * 90;
    } else if (side === 1) {
      x = 100;
      y = 6 + Math.random() * 88;
      dx = -(70 + Math.random() * 110);
      dy = (Math.random() - 0.5) * 90;
    } else if (side === 2) {
      x = 6 + Math.random() * 88;
      y = 0;
      dx = (Math.random() - 0.5) * 90;
      dy = 70 + Math.random() * 110;
    } else {
      x = 6 + Math.random() * 88;
      y = 100;
      dx = (Math.random() - 0.5) * 90;
      dy = -(70 + Math.random() * 110);
    }
    pieces.push({
      key: i,
      style: {
        left: x + "%",
        top: y + "%",
        width: 4 + Math.random() * 4 + "px",
        height: 8 + Math.random() * 10 + "px",
        backgroundColor: colors[i % colors.length],
        "--dx": dx.toFixed(1) + "px",
        "--dy": dy.toFixed(1) + "px",
        "--r0": Math.round(Math.random() * 360) + "deg",
        "--rot": Math.round((Math.random() - 0.5) * 720) + "deg",
        "--delay": Math.round(Math.random() * 110) + "ms",
        "--dur": Math.round(720 + Math.random() * 420) + "ms"
      }
    });
  }
  return pieces;
}
function Confetti() {
  const [pieces] = (0, import_react5.useState)(makeConfettiPieces);
  return /* @__PURE__ */ import_react5.default.createElement("div", { className: "eg-confetti", "aria-hidden": "true" }, pieces.map((piece) => /* @__PURE__ */ import_react5.default.createElement("span", { key: piece.key, className: "eg-confetti-piece", style: piece.style })));
}

// src/client/shell/useBoardGeom.js
var import_react6 = require("react");

// src/client/shell/geom.js
var GEOM_KEY = "eg-board-geom-v3";
var MIN_TOP = 44;
var EDGE_PAD = 8;
function loadGeom() {
  try {
    const g = JSON.parse(localStorage.getItem(GEOM_KEY) || "null");
    if (g && g.w && g.h) return g;
  } catch {
  }
  return null;
}
function fitGeom(g) {
  const vw = window.innerWidth || 1200;
  const vh = window.innerHeight || 800;
  const w = clamp(g.w, 240, Math.max(240, vw - EDGE_PAD * 2));
  const h = clamp(g.h, 170, Math.max(170, vh - MIN_TOP - EDGE_PAD));
  const x = clamp(g.x, EDGE_PAD, Math.max(EDGE_PAD, vw - w - EDGE_PAD));
  const y = clamp(g.y, MIN_TOP, Math.max(MIN_TOP, vh - 44));
  return { x, y, w, h };
}
function pillAnchorGeom() {
  const vw = window.innerWidth || 1200;
  const vh = window.innerHeight || 800;
  const w = 340;
  const h = 440;
  let cx = vw / 2;
  let bottom = vh - 120;
  try {
    const pill = document.querySelector(".eg-pill");
    if (pill) {
      const r = pill.getBoundingClientRect();
      if (r && r.width) {
        cx = r.left + r.width / 2;
        bottom = r.top - 10;
      }
    }
  } catch {
  }
  return fitGeom({ w, h, x: Math.round(cx - w / 2), y: Math.round(bottom - h) });
}

// src/client/shell/useBoardGeom.js
function useBoardGeom(open) {
  const [geom, setGeom] = (0, import_react6.useState)(() => {
    const saved = loadGeom();
    if (saved) return fitGeom(saved);
    return pillAnchorGeom();
  });
  const geomRef = (0, import_react6.useRef)(geom);
  (0, import_react6.useEffect)(() => {
    geomRef.current = geom;
  }, [geom]);
  const anchoredRef = (0, import_react6.useRef)(false);
  (0, import_react6.useEffect)(() => {
    if (open && !anchoredRef.current) {
      anchoredRef.current = true;
      if (!loadGeom()) setGeom(pillAnchorGeom());
    }
  }, [open]);
  (0, import_react6.useEffect)(() => {
    const onResize = () => setGeom((g) => fitGeom(g));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const saveGeom = (0, import_react6.useCallback)(() => {
    try {
      localStorage.setItem(GEOM_KEY, JSON.stringify(geomRef.current));
    } catch {
    }
  }, []);
  const dragRef = (0, import_react6.useRef)(null);
  const resizeRef = (0, import_react6.useRef)(null);
  const onPanelDown = (0, import_react6.useCallback)((e) => {
    if (e.button !== 0 || dragRef.current) return;
    const t = e.target;
    const el = t && t.nodeType === 1 ? t : t && t.parentElement;
    if (el && el.closest && el.closest('button, textarea, input, select, a, summary, [contenteditable="true"], [data-nodrag], .eg-resize'))
      return;
    e.preventDefault();
    dragRef.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, g0: geomRef.current };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
    }
  }, []);
  const onPanelMove = (0, import_react6.useCallback)((e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const x = clamp(d.g0.x + (e.clientX - d.sx), EDGE_PAD, Math.max(EDGE_PAD, window.innerWidth - d.g0.w - EDGE_PAD));
    const y = clamp(d.g0.y + (e.clientY - d.sy), MIN_TOP, Math.max(MIN_TOP, window.innerHeight - 44));
    setGeom({ x, y, w: d.g0.w, h: d.g0.h });
  }, []);
  const onPanelUp = (0, import_react6.useCallback)(
    (e) => {
      const d = dragRef.current;
      if (!d || d.id !== e.pointerId) return;
      dragRef.current = null;
      try {
        if (e.currentTarget.hasPointerCapture(d.id)) e.currentTarget.releasePointerCapture(d.id);
      } catch {
      }
      saveGeom();
    },
    [saveGeom]
  );
  const onResizeDown = (0, import_react6.useCallback)((e) => {
    if (e.button !== 0 || resizeRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, g0: geomRef.current };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
    }
  }, []);
  const onResizeMove = (0, import_react6.useCallback)((e) => {
    const d = resizeRef.current;
    if (!d || d.id !== e.pointerId) return;
    const maxW = window.innerWidth - d.g0.x - EDGE_PAD;
    const maxH = window.innerHeight - d.g0.y - EDGE_PAD;
    const w = clamp(d.g0.w + (e.clientX - d.sx), 240, Math.max(240, maxW));
    const h = clamp(d.g0.h + (e.clientY - d.sy), 170, Math.max(170, maxH));
    setGeom({ x: d.g0.x, y: d.g0.y, w, h });
  }, []);
  const onResizeUp = (0, import_react6.useCallback)(
    (e) => {
      const d = resizeRef.current;
      if (!d || d.id !== e.pointerId) return;
      resizeRef.current = null;
      try {
        if (e.currentTarget.hasPointerCapture(d.id)) e.currentTarget.releasePointerCapture(d.id);
      } catch {
      }
      saveGeom();
    },
    [saveGeom]
  );
  return {
    geom,
    onPanelDown,
    onPanelMove,
    onPanelUp,
    onResizeDown,
    onResizeMove,
    onResizeUp
  };
}

// src/client/features/phrase/usePhraseDrill.js
var import_react7 = require("react");
function usePhraseDrill({ open, active }) {
  const [card, setCard] = (0, import_react7.useState)(null);
  const [answer, setAnswer] = (0, import_react7.useState)("");
  const [submittedAnswer, setSubmittedAnswer] = (0, import_react7.useState)("");
  const [feedback, setFeedback] = (0, import_react7.useState)(null);
  const [attempt, setAttempt] = (0, import_react7.useState)(0);
  const [prevScore, setPrevScore] = (0, import_react7.useState)(null);
  const [retryFocusTick, setRetryFocusTick] = (0, import_react7.useState)(0);
  const [busy, setBusy] = (0, import_react7.useState)(false);
  const [error, setError] = (0, import_react7.useState)("");
  const lastScoreRef = (0, import_react7.useRef)(null);
  const startedRef = (0, import_react7.useRef)(false);
  const genRef = (0, import_react7.useRef)(0);
  const abortRef = (0, import_react7.useRef)(null);
  (0, import_react7.useEffect)(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);
  const loadNext = (0, import_react7.useCallback)(async () => {
    const gen = ++genRef.current;
    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setBusy(true);
    setError("");
    try {
      const data = await api("/next", {
        method: "POST",
        body: JSON.stringify({ sessionId: store.sessionId || "" }),
        signal: ac.signal
      });
      if (gen !== genRef.current || ac.signal.aborted) return;
      setCard(data);
      setAnswer("");
      setSubmittedAnswer("");
      setFeedback(null);
      setAttempt(0);
      setPrevScore(null);
      setRetryFocusTick(0);
      lastScoreRef.current = null;
    } catch (e) {
      if (gen !== genRef.current || ac.signal.aborted || e && e.name === "AbortError") return;
      setError(e.message || "出题失败");
    } finally {
      if (gen === genRef.current) {
        abortRef.current = null;
        setBusy(false);
      }
    }
  }, []);
  (0, import_react7.useEffect)(() => {
    if (open && active && !card && !feedback && !startedRef.current) {
      startedRef.current = true;
      loadNext();
    }
  }, [open, active, card, feedback, loadNext]);
  const submit = (0, import_react7.useCallback)(async () => {
    if (!card || busy || !String(answer || "").trim()) return;
    const currentAnswer = answer;
    const gen = ++genRef.current;
    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setBusy(true);
    setError("");
    try {
      const res = await api("/check", {
        method: "POST",
        body: JSON.stringify({ id: card.id, answer: currentAnswer }),
        signal: ac.signal
      });
      if (gen !== genRef.current || ac.signal.aborted) return;
      setSubmittedAnswer(currentAnswer);
      setPrevScore(lastScoreRef.current);
      lastScoreRef.current = Number.isFinite(Number(res.score)) ? Number(res.score) : 0;
      setAttempt((n) => n + 1);
      setFeedback(res);
      if (res.correct) store.celebrate();
      if (res.summary) store.setStats(res.summary);
    } catch (e) {
      if (gen !== genRef.current || ac.signal.aborted || e && e.name === "AbortError") return;
      setError(e.message || "判分失败");
      if (e.status === 409) {
        setCard(null);
        setFeedback(null);
        setAttempt(0);
        setPrevScore(null);
        lastScoreRef.current = null;
        startedRef.current = false;
      }
    } finally {
      if (gen === genRef.current) {
        abortRef.current = null;
        setBusy(false);
      }
    }
  }, [card, answer, busy]);
  const retry = (0, import_react7.useCallback)(() => {
    if (!card || busy) return;
    setFeedback(null);
    setError("");
    setRetryFocusTick((n) => n + 1);
  }, [card, busy]);
  const next = (0, import_react7.useCallback)(() => {
    setFeedback(null);
    setCard(null);
    setSubmittedAnswer("");
    setAttempt(0);
    setPrevScore(null);
    setRetryFocusTick(0);
    lastScoreRef.current = null;
    loadNext();
  }, [loadNext]);
  const reset = (0, import_react7.useCallback)(() => {
    genRef.current += 1;
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setCard(null);
    setFeedback(null);
    setAnswer("");
    setSubmittedAnswer("");
    setAttempt(0);
    setPrevScore(null);
    setRetryFocusTick(0);
    setError("");
    setBusy(false);
    lastScoreRef.current = null;
    startedRef.current = false;
  }, []);
  return {
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
    submit,
    retry,
    next,
    reset
  };
}

// src/client/features/phrase/Drill.jsx
var import_react10 = __toESM(require("react"), 1);

// src/client/features/phrase/PhraseFeedback.jsx
var import_react9 = __toESM(require("react"), 1);

// src/client/core/text.js
var POS_LABELS = {
  n: "名词",
  v: "动词",
  adj: "形容词",
  adv: "副词",
  prep: "介词",
  pron: "代词",
  conj: "连词",
  num: "数词",
  art: "冠词",
  aux: "助动词",
  int: "感叹词",
  phrase: "短语",
  idiom: "习语"
};
function formatPos(pos) {
  const parts = String(pos || "").toLowerCase().split(/[\/,&\s]+/).map((p) => p.replace(/\.+$/, "")).filter(Boolean).map((p) => p === "vt" || p === "vi" ? "v" : p);
  const unique = [...new Set(parts)];
  if (!unique.length) return "";
  return unique.map((p) => {
    if (p === "phrase" || p === "idiom") return POS_LABELS[p];
    return POS_LABELS[p] ? POS_LABELS[p] + " " + p + "." : p;
  }).join(" / ");
}
function escapeRegExp(text) {
  return String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function splitOutsideParens(str, seps) {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < str.length; i += 1) {
    const ch = str[i];
    if (ch === "(" || ch === "（" || ch === "[" || ch === "【") depth += 1;
    else if ((ch === ")" || ch === "）" || ch === "]" || ch === "】") && depth > 0) depth -= 1;
    else if (depth === 0 && seps.includes(ch)) {
      out.push(str.slice(start, i));
      start = i + 1;
    }
  }
  out.push(str.slice(start));
  return out;
}
function formatMeaning(raw) {
  const source = String(raw || "").trim();
  if (!source) return "";
  const seen = /* @__PURE__ */ new Set();
  const groups = [];
  for (const rawGroup of splitOutsideParens(source, ";；")) {
    const terms = [];
    for (const rawTerm of splitOutsideParens(rawGroup, ",，、")) {
      const term = rawTerm.trim().replace(/\s+/g, " ");
      if (!term) continue;
      const key = term.toLowerCase().replace(/\s+/g, "");
      if (seen.has(key)) continue;
      seen.add(key);
      terms.push(term);
    }
    if (terms.length) groups.push(terms.join("、"));
  }
  return groups.length ? groups.join("；") : source;
}
function splitByWord(text, word) {
  const source = String(text || "");
  const target = String(word || "");
  if (!target) return [source];
  return source.split(new RegExp("(" + escapeRegExp(target) + ")", "gi"));
}
function splitByTerms(text, terms) {
  const source = String(text || "");
  const clean = (Array.isArray(terms) ? terms : []).map((t) => String(t || "").trim()).filter(Boolean).sort((a, b) => b.length - a.length);
  if (!source || !clean.length) return [source];
  const pattern = clean.map((t) => /\s/.test(t) ? escapeRegExp(t) : "\\b" + escapeRegExp(t) + "\\b").join("|");
  try {
    return source.split(new RegExp("(" + pattern + ")", "gi"));
  } catch {
    return [source];
  }
}
function normalizeEnglish(text) {
  return String(text || "").toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/[.!?,;:]+$/g, "").replace(/\s+/g, " ").trim();
}
async function copyToClipboard(text) {
  const value = String(text || "");
  if (!value) return false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return !!ok;
  } catch {
    return false;
  }
}

// src/client/components/ScoreRing.jsx
var import_react8 = __toESM(require("react"), 1);
function ScoreRing({ score, displayScore }) {
  const clamped = clamp(Number(score) || 0, 0, 100);
  const [drawn, setDrawn] = (0, import_react8.useState)(() => prefersReducedMotion());
  (0, import_react8.useEffect)(() => {
    if (prefersReducedMotion()) {
      setDrawn(true);
      return void 0;
    }
    setDrawn(false);
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setDrawn(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [clamped]);
  const r = 20;
  const c = 2 * Math.PI * r;
  const offset = drawn ? c * (1 - clamped / 100) : c;
  return /* @__PURE__ */ import_react8.default.createElement("div", { className: "eg-ring", "aria-label": "得分 " + clamped + " 分" }, /* @__PURE__ */ import_react8.default.createElement("svg", { viewBox: "0 0 50 50", "aria-hidden": "true" }, /* @__PURE__ */ import_react8.default.createElement("circle", { className: "eg-ring-track", cx: 25, cy: 25, r }), clamped > 0 ? /* @__PURE__ */ import_react8.default.createElement(
    "circle",
    {
      className: "eg-ring-arc",
      cx: 25,
      cy: 25,
      r,
      strokeDasharray: c.toFixed(2),
      strokeDashoffset: offset.toFixed(2)
    }
  ) : null), /* @__PURE__ */ import_react8.default.createElement("span", { className: "eg-ring-val" }, /* @__PURE__ */ import_react8.default.createElement("strong", null, displayScore), /* @__PURE__ */ import_react8.default.createElement("small", null, "分")));
}

// src/client/features/phrase/verdict.js
function phraseVerdict(feedback) {
  const score = clamp(Number(feedback && feedback.score) || 0, 0, 100);
  if (feedback && feedback.correct) {
    if (feedback.exact || score >= 98) {
      return { tone: "ok", title: "完全正确", sub: "表达精准自然，无可挑剔。" };
    }
    if (score >= 88) {
      return { tone: "ok", title: "表达地道", sub: "语义准确，用词自然流畅。" };
    }
    return { tone: "ok", title: "译得不错", sub: "核心意思到位，可对照参考打磨细节。" };
  }
  if (score >= 55) {
    return { tone: "warn", title: "还差一点", sub: "方向已接近，修正细节后再试一次。" };
  }
  if (score > 0) {
    return { tone: "bad", title: "还需调整", sub: "语义或语法有偏差，对照参考重练一遍。" };
  }
  return { tone: "bad", title: "暂未得分", sub: "对照原句和参考译文，重新组织英文再试一次。" };
}

// src/client/features/phrase/PhraseFeedback.jsx
function PhraseFeedback({
  card,
  answer,
  submittedAnswer,
  feedback,
  attempt,
  prevScore,
  busy,
  onRetry,
  onNext
}) {
  const [copied, setCopied] = (0, import_react9.useState)(false);
  const copyTimerRef = (0, import_react9.useRef)(null);
  const displayScore = useCountUp(feedback ? feedback.score : 0, !!feedback);
  (0, import_react9.useEffect)(() => {
    setCopied(false);
    return () => clearTimeout(copyTimerRef.current);
  }, [feedback]);
  (0, import_react9.useEffect)(() => {
    if (!feedback || busy) return void 0;
    const onKeyDown = (e) => {
      if (e.key !== "Enter" || e.isComposing || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const el = e.target;
      if (el && el.closest && el.closest("textarea, input, select, button, a")) return;
      e.preventDefault();
      if (feedback.correct) onNext();
      else if (onRetry) onRetry();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [feedback, busy, onNext, onRetry]);
  const handleCopy = async () => {
    if (!feedback || !feedback.reference) return;
    const ok2 = await copyToClipboard(feedback.reference);
    if (!ok2) return;
    setCopied(true);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 1600);
  };
  const ok = !!feedback.correct;
  const verdict = phraseVerdict(feedback);
  const promptZh = feedback.zh || card && card.zh || "";
  const mine = String(submittedAnswer !== void 0 ? submittedAnswer : answer || "").trim();
  const reference = feedback.reference || "";
  const corrected = feedback.corrected || "";
  const score = clamp(Number(feedback.score) || 0, 0, 100);
  const hasEnglishAttempt = /[a-zA-Z]{2,}/.test(mine);
  const showCorrected = score >= 40 && hasEnglishAttempt && corrected && normalizeEnglish(corrected) !== normalizeEnglish(reference) && normalizeEnglish(corrected) !== normalizeEnglish(mine);
  const bankWords = Array.isArray(feedback.bankWords) && feedback.bankWords.length ? feedback.bankWords : card && Array.isArray(card.bankWords) ? card.bankWords : [];
  const refParts = reference && bankWords.length ? splitByTerms(reference, bankWords) : [reference || "—"];
  const highlights = Array.isArray(feedback.highlights) ? feedback.highlights : [];
  const delta = prevScore !== null && prevScore !== void 0 ? score - prevScore : 0;
  const canRetry = !!(card && onRetry);
  const fromSession = (feedback.source || card && card.source) === "session";
  return /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb is-phrase " + verdict.tone, "data-nodrag": "true" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-hero" }, /* @__PURE__ */ import_react9.default.createElement(ScoreRing, { score, displayScore }), /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-verdict" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-headline" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "eg-fb-status" }, verdict.title), feedback.exact ? /* @__PURE__ */ import_react9.default.createElement("span", { className: "eg-fb-pill tone" }, "完全匹配") : null, fromSession ? /* @__PURE__ */ import_react9.default.createElement("span", { className: "eg-fb-pill" }, "结合当前会话") : null, attempt > 1 ? /* @__PURE__ */ import_react9.default.createElement("span", { className: "eg-fb-pill" }, "第 " + attempt + " 次尝试") : null, delta > 0 ? /* @__PURE__ */ import_react9.default.createElement("span", { className: "eg-fb-pill up" }, "↑ +" + delta + " 分") : null), /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-sub" }, verdict.sub))), /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-body" }, promptZh ? /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-prompt" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "eg-fb-tag" }, "原句"), /* @__PURE__ */ import_react9.default.createElement("span", { className: "eg-fb-zh" }, promptZh)) : null, /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-mine" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-boxhead" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "lbl" }, /* @__PURE__ */ import_react9.default.createElement("span", { "aria-hidden": "true" }, ok ? "✓" : "✗"), "你的作答")), /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-mine-text" + (mine ? "" : " empty") }, mine || "（未输入有效内容）")), /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-ref" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-boxhead" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-boxhead-left" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "lbl" }, "参考译文"), bankWords.length ? /* @__PURE__ */ import_react9.default.createElement("span", { className: "eg-fb-banktag", title: "融入的词库词" }, "词库 · " + bankWords.join(" / ")) : null), reference ? /* @__PURE__ */ import_react9.default.createElement(
    "button",
    {
      type: "button",
      className: "eg-copybtn" + (copied ? " copied" : ""),
      onClick: handleCopy,
      title: "复制参考译文"
    },
    copied ? "已复制 ✓" : "复制"
  ) : null), /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-ref-text" }, refParts.map(
    (part, i) => i % 2 ? /* @__PURE__ */ import_react9.default.createElement("mark", { className: "eg-eg-hit", key: i }, part) : /* @__PURE__ */ import_react9.default.createElement("span", { key: i }, part)
  ))), showCorrected ? /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-corr" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-boxhead" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "lbl" }, "贴近你思路的改写")), /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-corr-text" }, corrected)) : null, feedback.tip ? /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-tip" }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "b" }, "点评"), /* @__PURE__ */ import_react9.default.createElement("span", null, feedback.tip)) : null, highlights.length ? /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-hl" }, /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-hl-lbl" }, "核心表达"), /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-hl-list" }, highlights.map((item, i) => /* @__PURE__ */ import_react9.default.createElement("span", { className: "eg-hl-chip", key: i }, /* @__PURE__ */ import_react9.default.createElement("span", { className: "en" }, item.en), /* @__PURE__ */ import_react9.default.createElement("span", { className: "zh" }, item.zh))))) : null), /* @__PURE__ */ import_react9.default.createElement("div", { className: "eg-fb-actions" }, ok ? /* @__PURE__ */ import_react9.default.createElement(import_react9.default.Fragment, null, /* @__PURE__ */ import_react9.default.createElement(
    "button",
    {
      className: "eg-btn primary",
      onClick: onNext,
      onPointerDown: bounceButton,
      disabled: busy,
      title: "回车下一题",
      "aria-keyshortcuts": "Enter"
    },
    "下一题 →"
  ), canRetry ? /* @__PURE__ */ import_react9.default.createElement("button", { className: "eg-btn", onClick: onRetry, disabled: busy }, "↺ 再试一次") : null) : /* @__PURE__ */ import_react9.default.createElement(import_react9.default.Fragment, null, canRetry ? /* @__PURE__ */ import_react9.default.createElement(
    "button",
    {
      className: "eg-btn primary",
      onClick: onRetry,
      onPointerDown: bounceButton,
      disabled: busy,
      title: "回车再试一次",
      "aria-keyshortcuts": "Enter"
    },
    "↺ 再试一次"
  ) : null, /* @__PURE__ */ import_react9.default.createElement("button", { className: canRetry ? "eg-btn" : "eg-btn primary", onClick: onNext, disabled: busy }, "下一题 →")), /* @__PURE__ */ import_react9.default.createElement("span", { className: "eg-kbd", title: ok ? "按 Enter 进入下一题" : "按 Enter 再试一次" }, /* @__PURE__ */ import_react9.default.createElement("kbd", null, "↵"), " ", ok ? "下一题" : "再试")));
}

// src/client/features/phrase/Drill.jsx
var useIsoLayoutEffect = import_react10.default.useLayoutEffect || import_react10.useEffect;
var INPUT_LINE_HEIGHT = 40;
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
  onNext
}) {
  const [hintOpen, setHintOpen] = (0, import_react10.useState)(false);
  const inputRef = (0, import_react10.useRef)(null);
  const syncInputHeight = (0, import_react10.useCallback)(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = INPUT_LINE_HEIGHT + "px";
    const lines = Math.max(1, Math.min(6, Math.ceil((el.scrollHeight - 2) / INPUT_LINE_HEIGHT)));
    el.style.height = lines * INPUT_LINE_HEIGHT + "px";
    el.style.overflowY = lines >= 6 ? "auto" : "hidden";
  }, []);
  useIsoLayoutEffect(() => {
    syncInputHeight();
  }, [answer, card, feedback, syncInputHeight]);
  (0, import_react10.useEffect)(() => {
    const el = inputRef.current;
    if (!el || typeof ResizeObserver !== "function") return void 0;
    const ro = new ResizeObserver(syncInputHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, [card, feedback, syncInputHeight]);
  (0, import_react10.useEffect)(() => {
    if (!retryFocusTick || feedback || !card) return void 0;
    const timer = setTimeout(() => {
      try {
        const el = inputRef.current;
        if (el) {
          el.focus();
          if (el.select) el.select();
        }
      } catch {
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [retryFocusTick, feedback, card]);
  if (feedback) {
    return /* @__PURE__ */ import_react10.default.createElement(
      PhraseFeedback,
      {
        card,
        answer,
        submittedAnswer,
        feedback,
        attempt,
        prevScore,
        busy,
        onRetry,
        onNext
      }
    );
  }
  if (!card) {
    if (error) {
      return /* @__PURE__ */ import_react10.default.createElement("div", null, /* @__PURE__ */ import_react10.default.createElement("div", { className: "eg-err" }, error), /* @__PURE__ */ import_react10.default.createElement("div", { className: "eg-foot" }, /* @__PURE__ */ import_react10.default.createElement("button", { className: "eg-btn primary", onClick: onNext, disabled: busy }, "重试")));
    }
    return /* @__PURE__ */ import_react10.default.createElement("div", { className: "eg-loading is-stage" }, /* @__PURE__ */ import_react10.default.createElement("span", { className: "eg-spin" }), "正在出题…");
  }
  return /* @__PURE__ */ import_react10.default.createElement("div", { className: "eg-drill-stage" }, /* @__PURE__ */ import_react10.default.createElement("div", { className: "eg-cap eg-cap-row" }, /* @__PURE__ */ import_react10.default.createElement("span", null, "把这句话译成英文"), card.source === "session" ? /* @__PURE__ */ import_react10.default.createElement("span", { className: "eg-source-pill", title: "根据当前会话内容生成" }, "结合当前会话") : null, attempt > 0 ? /* @__PURE__ */ import_react10.default.createElement("span", { className: "eg-attempt-pill" }, "第 " + (attempt + 1) + " 次尝试") : null), /* @__PURE__ */ import_react10.default.createElement("div", { className: "eg-zh" }, card.zh), card.hint ? /* @__PURE__ */ import_react10.default.createElement(import_react10.default.Fragment, null, /* @__PURE__ */ import_react10.default.createElement(
    "button",
    {
      className: "eg-hintbtn",
      "aria-expanded": hintOpen ? "true" : "false",
      onClick: () => setHintOpen((v) => !v),
      type: "button"
    },
    /* @__PURE__ */ import_react10.default.createElement("span", { className: "caret", "aria-hidden": "true" }, "▸"),
    "提示"
  ), /* @__PURE__ */ import_react10.default.createElement(
    "div",
    {
      className: "eg-collapse eg-hint-collapse" + (hintOpen ? " open" : ""),
      "aria-hidden": hintOpen ? "false" : "true"
    },
    /* @__PURE__ */ import_react10.default.createElement("div", { className: "eg-collapse-inner" }, /* @__PURE__ */ import_react10.default.createElement("div", { className: "eg-hintbox" }, card.hint))
  )) : null, /* @__PURE__ */ import_react10.default.createElement("div", { className: "eg-inputwrap" }, /* @__PURE__ */ import_react10.default.createElement(
    "textarea",
    {
      ref: inputRef,
      rows: 1,
      className: "eg-input" + (error ? " error" : ""),
      value: answer,
      placeholder: "在这里写下你的英文…",
      onChange: (e) => setAnswer(e.target.value),
      onKeyDown: (e) => {
        if (e.key !== "Enter" || e.isComposing || e.keyCode === 229 || e.altKey) return;
        if (e.shiftKey) return;
        e.preventDefault();
        if (!busy && answer.trim()) onSubmit();
      }
    }
  )), error ? /* @__PURE__ */ import_react10.default.createElement("div", { className: "eg-err" }, error) : null, /* @__PURE__ */ import_react10.default.createElement("div", { className: "eg-foot" }, /* @__PURE__ */ import_react10.default.createElement(
    "button",
    {
      className: "eg-btn primary" + (busy ? " is-loading" : ""),
      onClick: onSubmit,
      onPointerDown: bounceButton,
      disabled: busy || !answer.trim()
    },
    "提交"
  ), /* @__PURE__ */ import_react10.default.createElement("button", { className: "eg-btn", onClick: onNext, disabled: busy }, "换一题"), /* @__PURE__ */ import_react10.default.createElement("span", { className: "eg-kbd", title: "回车提交（Shift + Enter 换行）" }, /* @__PURE__ */ import_react10.default.createElement("kbd", null, "↵"))));
}

// src/client/features/word/WordPractice.jsx
var import_react16 = __toESM(require("react"), 1);

// src/client/features/word/ExampleBlock.jsx
var import_react11 = __toESM(require("react"), 1);
function ExampleBlock({ example, exampleZh, word, highlight }) {
  const en = String(example || "");
  const zh = String(exampleZh || "");
  if (!en && !zh) return null;
  const parts = en && highlight && word ? splitByWord(en, word) : [en];
  return /* @__PURE__ */ import_react11.default.createElement("div", { className: "eg-eg" + (highlight ? " done" : "") }, en ? /* @__PURE__ */ import_react11.default.createElement("div", { className: "eg-eg-en" }, parts.map(
    (part, i) => i % 2 ? /* @__PURE__ */ import_react11.default.createElement("mark", { className: "eg-eg-hit", key: i }, part) : /* @__PURE__ */ import_react11.default.createElement("span", { key: i }, part)
  )) : null, zh ? /* @__PURE__ */ import_react11.default.createElement("div", { className: "eg-eg-zh" }, zh) : null);
}

// src/client/features/word/srsFormat.js
var MODES = [
  { id: "smart", label: "智能", title: "按 FSRS 算法优先复习最易遗忘的到期词，每复习 3 个穿插 1 个新词" },
  { id: "review", label: "待复习", title: "专注清理当前词库已到复习时间的单词" },
  { id: "new", label: "新词", title: "跳过到期复习，优先抽取尚未背过的新词" }
];
var FSRS_RATINGS = [
  { rating: 2, key: "hard", keyHint: "1", label: "模糊" },
  { rating: 3, key: "good", keyHint: "2", label: "记得" },
  { rating: 4, key: "easy", keyHint: "3", label: "很熟" }
];
function formatStabilityShort(days) {
  const n = Number(days);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n < 1) return Math.max(1, Math.round(n * 24)) + " 小时";
  return Math.max(1, Math.round(n)) + " 天";
}
function memoryLabel(srs) {
  if (!srs || srs.kind === "new") return "新词";
  if (srs.kind === "mastered" || srs.mastered) return "已掌握回顾";
  if (srs.state === "learning" || srs.state === "relearning") return "巩固中";
  if (srs.kind === "upcoming") {
    const st2 = formatStabilityShort(srs.stability);
    return st2 ? "提前巩固 · 稳定 " + st2 : "提前巩固";
  }
  if (srs.retrievability != null) return "复习 · 记忆 " + srs.retrievability + "%";
  const st = formatStabilityShort(srs.stability);
  return st ? "复习 · 稳定 " + st : "复习";
}
function memoryTooltip(srs) {
  if (!srs || srs.kind === "new") return "首次学习该词，将按 FSRS 记忆算法安排复习";
  const parts = [];
  const st = formatStabilityShort(srs.stability);
  if (st) parts.push("稳定度 " + st);
  if (srs.difficulty > 0) parts.push("难度 " + srs.difficulty + "/10");
  if (srs.retrievability != null) parts.push("回忆概率 " + srs.retrievability + "%");
  parts.push("复习 " + (srs.reps || 0) + " 次 / 遗忘 " + (srs.lapses || 0) + " 次");
  return parts.join(" · ");
}
function shortBankName(name) {
  return String(name || "").replace(/^内置\s*·\s*/, "");
}

// src/client/features/word/useWordPractice.js
var import_react12 = require("react");
var cachedWord = {
  item: null,
  cells: [],
  res: null,
  revealed: false,
  revealedEver: false,
  mode: "smart",
  srsStats: null,
  bankRev: 0
};
var lastConsumedWordReqTick = 0;
function useWordPractice({ bankRev = 0 } = {}) {
  const shared = useShared();
  const [item, setItem] = (0, import_react12.useState)(() => cachedWord.item);
  const [cells, setCells] = (0, import_react12.useState)(() => cachedWord.cells);
  const [res, setRes] = (0, import_react12.useState)(() => cachedWord.res);
  const [revealed, setRevealed] = (0, import_react12.useState)(() => cachedWord.revealed);
  const [busy, setBusy] = (0, import_react12.useState)(false);
  const [rateBusy, setRateBusy] = (0, import_react12.useState)(false);
  const [error, setError] = (0, import_react12.useState)("");
  const [mode, setMode] = (0, import_react12.useState)(() => cachedWord.mode);
  const [srsStats, setSrsStats] = (0, import_react12.useState)(() => cachedWord.srsStats);
  const refs = (0, import_react12.useRef)([]);
  const reqGenRef = (0, import_react12.useRef)(0);
  const abortRef = (0, import_react12.useRef)(null);
  const revealedEverRef = (0, import_react12.useRef)(cachedWord.revealedEver);
  const modeRef = (0, import_react12.useRef)(mode);
  modeRef.current = mode;
  (0, import_react12.useEffect)(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);
  (0, import_react12.useEffect)(() => {
    cachedWord.item = item;
    cachedWord.cells = cells;
    cachedWord.res = res;
    cachedWord.revealed = revealed;
    cachedWord.revealedEver = revealedEverRef.current;
    cachedWord.mode = mode;
    cachedWord.srsStats = srsStats;
  }, [item, cells, res, revealed, mode, srsStats]);
  const load = (0, import_react12.useCallback)(async (requestedMode) => {
    const gen = ++reqGenRef.current;
    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    const targetMode = requestedMode === "review" || requestedMode === "new" || requestedMode === "smart" ? requestedMode : modeRef.current;
    setBusy(true);
    setRateBusy(false);
    setError("");
    setRes(null);
    setRevealed(false);
    revealedEverRef.current = false;
    try {
      const data = await api("/word/next", {
        method: "POST",
        body: JSON.stringify({ mode: targetMode }),
        signal: ac.signal
      });
      if (gen !== reqGenRef.current || ac.signal.aborted) return;
      if (data.srsStats) {
        setSrsStats(data.srsStats);
        store.setWordSrs(data.srsStats);
      }
      setItem(data);
      if (data.done) {
        setCells([]);
      } else {
        setCells(new Array(Math.max(0, data.letters || 0)).fill(""));
        setTimeout(() => {
          try {
            if (refs.current[0]) refs.current[0].focus();
          } catch {
          }
        }, 0);
      }
    } catch (e) {
      if (gen !== reqGenRef.current || ac.signal.aborted || e && e.name === "AbortError") return;
      setError(e.message || "出题失败");
    } finally {
      if (gen === reqGenRef.current) {
        abortRef.current = null;
        setBusy(false);
      }
    }
  }, []);
  (0, import_react12.useEffect)(() => {
    const req = shared.wordModeRequest;
    if (req && req.tick && req.tick !== lastConsumedWordReqTick) {
      lastConsumedWordReqTick = req.tick;
      cachedWord.bankRev = bankRev;
      const nextMode = req.mode || "review";
      setMode(nextMode);
      modeRef.current = nextMode;
      load(nextMode);
      return;
    }
    if (bankRev !== cachedWord.bankRev) {
      cachedWord.bankRev = bankRev;
      setItem(null);
      setRes(null);
      load(modeRef.current);
      return;
    }
    if (!cachedWord.item) load(modeRef.current);
  }, [shared.wordModeRequest, bankRev, load]);
  const rate = (0, import_react12.useCallback)(
    async (rating) => {
      if (!item || item.done || !res || !res.correct || !res.srs || !res.srs.canRate || rateBusy) return;
      if (res.srs.rating === rating) return;
      setRateBusy(true);
      setError("");
      try {
        const r = await api("/word/rate", {
          method: "POST",
          body: JSON.stringify({ id: item.id, rating })
        });
        if (r && r.srs) {
          setRes((prev) => prev ? { ...prev, srs: r.srs } : prev);
        }
        if (r && r.srsStats) setSrsStats(r.srsStats);
        if (r && r.summary) store.setStats(r.summary);
        else if (r && r.srsStats) store.setWordSrs(r.srsStats);
      } catch (e) {
        setError(e.message || "调整评分失败");
      } finally {
        setRateBusy(false);
      }
    },
    [item, res, rateBusy]
  );
  (0, import_react12.useEffect)(() => {
    if (!res || !res.correct) return void 0;
    const onKeyDown = (e) => {
      if (e.isComposing || e.ctrlKey || e.metaKey || e.altKey) return;
      const el = e.target;
      if (e.key === "Enter") {
        if (el && el.closest && el.closest("textarea, input:not([disabled]), select, button")) return;
        e.preventDefault();
        load();
        return;
      }
      if (res.srs && res.srs.canRate && (e.key === "1" || e.key === "2" || e.key === "3")) {
        if (el && el.closest && el.closest("textarea, input:not([disabled]), select")) return;
        e.preventDefault();
        rate(e.key === "1" ? 2 : e.key === "2" ? 3 : 4);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [res, load, rate]);
  const switchMode = (0, import_react12.useCallback)(
    (nextMode) => {
      if (busy || nextMode === modeRef.current) return;
      setMode(nextMode);
      modeRef.current = nextMode;
      load(nextMode);
    },
    [busy, load]
  );
  const submit = (0, import_react12.useCallback)(async () => {
    if (!item || item.done || busy || res) return;
    if (cells.some((c) => !c)) return;
    setBusy(true);
    setRateBusy(false);
    setError("");
    setRevealed(false);
    try {
      const r = await api("/word/check", {
        method: "POST",
        body: JSON.stringify({
          id: item.id,
          answer: cells.join(""),
          revealed: revealedEverRef.current
        })
      });
      setRes(r);
      if (r.correct) store.celebrate();
      if (r.srsStats) setSrsStats(r.srsStats);
      if (r.summary) store.setStats(r.summary);
      else if (r.srsStats) store.setWordSrs(r.srsStats);
    } catch (e) {
      setError(e.message || "判分失败");
    } finally {
      setBusy(false);
    }
  }, [item, cells, busy, res]);
  const markMastered = (0, import_react12.useCallback)(async () => {
    if (!item || item.done || busy) return;
    setBusy(true);
    setRateBusy(false);
    setError("");
    try {
      const r = await api("/word/master", {
        method: "POST",
        body: JSON.stringify({ id: item.id, word: res && res.reference || "" })
      });
      if (r.srsStats) setSrsStats(r.srsStats);
      if (r.summary) store.setStats(r.summary);
      else if (r.srsStats) store.setWordSrs(r.srsStats);
      setBusy(false);
      load(modeRef.current);
    } catch (e) {
      setError(e.message || "操作失败");
      setBusy(false);
    }
  }, [item, res, busy, load]);
  const retry = (0, import_react12.useCallback)(() => {
    if (!item || busy) return;
    setRes(null);
    setError("");
    setRevealed(false);
    setCells(new Array(Math.max(0, item.letters || 0)).fill(""));
    setTimeout(() => {
      try {
        if (refs.current[0]) refs.current[0].focus();
      } catch {
      }
    }, 0);
  }, [item, busy]);
  const toggleReveal = (0, import_react12.useCallback)(() => {
    setRevealed((v) => {
      if (!v) revealedEverRef.current = true;
      return !v;
    });
  }, []);
  const setCell = (i, v) => {
    const ch = String(v || "").replace(/[^a-zA-Z]/g, "").slice(-1);
    setCells((prev) => {
      const next = prev.slice();
      next[i] = ch;
      return next;
    });
    if (ch) popElement(refs.current[i], "is-pop", 180);
    if (ch && i < cells.length - 1) {
      setTimeout(() => {
        try {
          if (refs.current[i + 1]) refs.current[i + 1].focus();
        } catch {
        }
      }, 0);
    }
  };
  const onKey = (i, e) => {
    if (e.key === "Backspace" && !cells[i] && i > 0) {
      e.preventDefault();
      setCells((prev) => {
        const next = prev.slice();
        next[i - 1] = "";
        return next;
      });
      try {
        if (refs.current[i - 1]) refs.current[i - 1].focus();
      } catch {
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      try {
        if (refs.current[i - 1]) refs.current[i - 1].focus();
      } catch {
      }
    } else if (e.key === "ArrowRight" && i < cells.length - 1) {
      try {
        if (refs.current[i + 1]) refs.current[i + 1].focus();
      } catch {
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };
  const liveStats = shared.stats && shared.stats.wordSrs || srsStats || null;
  const dueCount = liveStats ? Number(liveStats.due) || 0 : 0;
  const learningCount = liveStats ? Number(liveStats.learning) || 0 : 0;
  const masteredCount = liveStats ? Number(liveStats.mastered) || 0 : 0;
  const bankLabel = shortBankName(item && item.bankName || shared.stats && shared.stats.wordBank && shared.stats.wordBank.name || "");
  return {
    item,
    cells,
    res,
    revealed,
    busy,
    rateBusy,
    error,
    mode,
    refs,
    liveStats,
    dueCount,
    learningCount,
    masteredCount,
    bankLabel,
    load,
    rate,
    switchMode,
    submit,
    markMastered,
    retry,
    toggleReveal,
    setCell,
    onKey
  };
}

// src/client/features/word/WordTopBar.jsx
var import_react13 = __toESM(require("react"), 1);
var useIsoLayoutEffect2 = import_react13.default.useLayoutEffect || import_react13.useEffect;
function WordTopBar({ mode, dueCount, busy, liveStats, learningCount, masteredCount, bankLabel, onSwitchMode }) {
  const [hoverMode, setHoverMode] = (0, import_react13.useState)("");
  const [slider, setSlider] = (0, import_react13.useState)({ left: 0, width: 0, ready: false });
  const listRef = (0, import_react13.useRef)(null);
  const tabRefs = (0, import_react13.useRef)({});
  const shownMode = MODES.find((m) => m.id === (hoverMode || mode)) || MODES[0];
  useIsoLayoutEffect2(() => {
    const measure = () => {
      const el = tabRefs.current && tabRefs.current[mode];
      if (!el) return;
      const left = el.offsetLeft;
      const width = el.offsetWidth;
      setSlider(
        (prev) => prev.ready && prev.left === left && prev.width === width ? prev : { left, width, ready: true }
      );
    };
    measure();
    const raf = requestAnimationFrame(measure);
    let ro = null;
    if (typeof ResizeObserver === "function" && listRef.current) {
      ro = new ResizeObserver(measure);
      ro.observe(listRef.current);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
    };
  }, [mode, dueCount]);
  return /* @__PURE__ */ import_react13.default.createElement("div", { className: "eg-srs-bar", "data-nodrag": "true" }, /* @__PURE__ */ import_react13.default.createElement(
    "div",
    {
      ref: listRef,
      className: "eg-srs-modes" + (slider.ready ? " has-slider" : ""),
      role: "tablist",
      "aria-label": "出词模式",
      onMouseLeave: () => setHoverMode("")
    },
    slider.ready ? /* @__PURE__ */ import_react13.default.createElement(
      "span",
      {
        className: "eg-srs-indicator",
        "aria-hidden": "true",
        style: { transform: "translateX(" + slider.left + "px)", width: slider.width + "px" }
      }
    ) : null,
    MODES.map((m) => /* @__PURE__ */ import_react13.default.createElement(
      "button",
      {
        key: m.id,
        ref: (el) => {
          tabRefs.current[m.id] = el;
        },
        type: "button",
        role: "tab",
        "aria-selected": mode === m.id ? "true" : "false",
        className: "eg-srs-mode" + (mode === m.id ? " active" : ""),
        title: m.title,
        disabled: busy,
        onMouseEnter: () => setHoverMode(m.id),
        onFocus: () => setHoverMode(m.id),
        onBlur: () => setHoverMode((prev) => prev === m.id ? "" : prev),
        onClick: () => onSwitchMode(m.id)
      },
      m.label,
      m.id === "review" && dueCount > 0 ? /* @__PURE__ */ import_react13.default.createElement("span", { className: "eg-srs-due" }, String(dueCount)) : null
    ))
  ), /* @__PURE__ */ import_react13.default.createElement("div", { className: "eg-srs-hint" }, shownMode.title), liveStats || bankLabel ? /* @__PURE__ */ import_react13.default.createElement("div", { className: "eg-srs-meta", title: "词库可在「设置 → 单词词库」切换" }, [bankLabel, liveStats ? "学习中 " + learningCount : "", liveStats ? "已掌握 " + masteredCount : ""].filter(Boolean).join(" · ")) : null);
}

// src/client/features/word/LetterGrid.jsx
var import_react14 = __toESM(require("react"), 1);
function LetterGrid({ cells, answered, ok, reference, busy, inputRefs, onSetCell, onKey }) {
  const target = String(reference || "").toLowerCase().replace(/[^a-z]/g, "");
  const letterGap = cells.length > 7 ? 8 : 10;
  const letterFont = cells.length > 12 ? 15 : cells.length > 9 ? 17 : 22;
  return /* @__PURE__ */ import_react14.default.createElement(
    "div",
    {
      className: "eg-letters" + (answered ? " answered" + (ok ? " is-ok" : " is-bad") : ""),
      style: { gap: letterGap }
    },
    cells.map((ch, i) => {
      let cls = "eg-letter";
      if (answered) cls += ok ? " ok" : " bad";
      return /* @__PURE__ */ import_react14.default.createElement(
        "input",
        {
          key: i,
          ref: (el) => {
            inputRefs.current[i] = el;
          },
          className: cls,
          value: answered ? ch || target[i] || "" : ch,
          style: { fontSize: letterFont, "--i": i },
          maxLength: 1,
          inputMode: "text",
          autoCapitalize: "off",
          autoComplete: "off",
          autoCorrect: "off",
          spellCheck: false,
          disabled: answered || busy,
          "aria-label": "第 " + (i + 1) + " 个字母",
          onChange: (e) => onSetCell(i, e.target.value),
          onKeyDown: (e) => onKey(i, e)
        }
      );
    })
  );
}

// src/client/features/word/WordFeedback.jsx
var import_react15 = __toESM(require("react"), 1);
function PhoneticRow({ uk, us, phonetic }) {
  if (!uk && !us && !phonetic) return null;
  if (uk || us) {
    return /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-phonetics", "aria-label": "英美音标" }, uk ? /* @__PURE__ */ import_react15.default.createElement("span", { className: "eg-phonetic" }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "eg-phonetic-tag" }, "英"), /* @__PURE__ */ import_react15.default.createElement("span", { className: "eg-phonetic-ipa" }, "/" + uk + "/")) : null, us ? /* @__PURE__ */ import_react15.default.createElement("span", { className: "eg-phonetic" }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "eg-phonetic-tag" }, "美"), /* @__PURE__ */ import_react15.default.createElement("span", { className: "eg-phonetic-ipa" }, "/" + us + "/")) : null);
  }
  return /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-phonetics", "aria-label": "音标" }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "eg-phonetic" }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "eg-phonetic-ipa" }, "/" + phonetic + "/")));
}
function WordFeedback({ res, revealed, busy, rateBusy, onRate }) {
  if (!res) return null;
  if (res.correct) {
    return /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-fb ok" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-fb-top" }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "eg-fb-status" }, "拼对了"), res.srs && res.srs.nextReviewText ? /* @__PURE__ */ import_react15.default.createElement("span", { className: "eg-srs-next" }, res.srs.nextReviewText) : null), res.srs && res.srs.canRate && res.srs.ratingPreviews ? /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-fsrs-rate", role: "group", "aria-label": "记忆体感评分（快捷键 1 / 2 / 3）" }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "eg-fsrs-rate-lbl" }, "记忆体感"), /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-fsrs-rate-btns" }, FSRS_RATINGS.map((opt) => {
      const preview = res.srs.ratingPreviews[opt.key];
      if (!preview) return null;
      const active = res.srs.rating === opt.rating;
      return /* @__PURE__ */ import_react15.default.createElement(
        "button",
        {
          key: opt.key,
          type: "button",
          className: "eg-fsrs-btn" + (active ? " active" : ""),
          "aria-pressed": active ? "true" : "false",
          disabled: busy || rateBusy,
          title: "快捷键 " + opt.keyHint + "：" + opt.label + "（" + preview.text + "）",
          onClick: () => onRate(opt.rating)
        },
        /* @__PURE__ */ import_react15.default.createElement("kbd", { className: "eg-fsrs-key" }, opt.keyHint),
        /* @__PURE__ */ import_react15.default.createElement("span", { className: "eg-fsrs-lbl" }, opt.label),
        /* @__PURE__ */ import_react15.default.createElement("span", { className: "eg-fsrs-iv" }, preview.text)
      );
    }))) : null, res.reference && /[^a-zA-Z]/.test(res.reference) ? /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-fb-ref" }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "lbl" }, "正确拼写"), res.reference) : null, /* @__PURE__ */ import_react15.default.createElement(PhoneticRow, { uk: res.uk, us: res.us, phonetic: res.phonetic }), /* @__PURE__ */ import_react15.default.createElement(ExampleBlock, { example: res.example, exampleZh: res.exampleZh, word: res.reference, highlight: true }));
  }
  return /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-fb bad" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-collapse eg-word-miss-wrap" + (!revealed ? " open" : ""), "aria-hidden": revealed ? "true" : "false" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-collapse-inner" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-word-miss" }, "拼写有误，可再试一次或查看答案 · " + (res.srs && res.srs.nextReviewText || "5 分钟后再次巩固")))), /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-collapse eg-word-reveal" + (revealed ? " open" : ""), "aria-hidden": revealed ? "false" : "true" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-collapse-inner" }, /* @__PURE__ */ import_react15.default.createElement("div", { className: "eg-fb-ref" }, /* @__PURE__ */ import_react15.default.createElement("span", { className: "lbl" }, "正确拼写"), res.reference), /* @__PURE__ */ import_react15.default.createElement(PhoneticRow, { uk: res.uk, us: res.us, phonetic: res.phonetic }), /* @__PURE__ */ import_react15.default.createElement(ExampleBlock, { example: res.example, exampleZh: res.exampleZh, word: res.reference, highlight: true }))));
}

// src/client/features/word/WordPractice.jsx
function WordPractice({ bankRev = 0 } = {}) {
  const {
    item,
    cells,
    res,
    revealed,
    busy,
    rateBusy,
    error,
    mode,
    refs,
    liveStats,
    dueCount,
    learningCount,
    masteredCount,
    bankLabel,
    load,
    rate,
    switchMode,
    submit,
    markMastered,
    retry,
    toggleReveal,
    setCell,
    onKey
  } = useWordPractice({ bankRev });
  const topBar = /* @__PURE__ */ import_react16.default.createElement(
    WordTopBar,
    {
      mode,
      dueCount,
      busy,
      liveStats,
      learningCount,
      masteredCount,
      bankLabel,
      onSwitchMode: switchMode
    }
  );
  if (!item) {
    return /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-word" }, topBar, /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-word-main" }, error ? /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-err" }, error) : /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-loading" }, /* @__PURE__ */ import_react16.default.createElement("span", { className: "eg-spin" }), "正在取词…"), error ? /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-foot" }, /* @__PURE__ */ import_react16.default.createElement("button", { className: "eg-btn primary", onClick: () => load(), disabled: busy }, "重试")) : null));
  }
  if (item.done) {
    return /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-word" }, topBar, /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-word-main" }, /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-srs-done", key: "done-" + mode }, /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-srs-done-title" }, "到期单词已全部复习完成"), /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-srs-done-sub" }, (bankLabel ? bankLabel + "：" : "当前词库：") + "学习中 " + learningCount + " 词 · 已掌握 " + masteredCount + " 词"), /* @__PURE__ */ import_react16.default.createElement("button", { type: "button", className: "eg-btn primary", disabled: busy, onClick: () => switchMode("smart") }, "切回智能模式继续学习"))));
  }
  const answered = !!res;
  const ok = answered && !!res.correct;
  const srsInfo = item.srs || null;
  const activeSrs = res && res.srs || srsInfo;
  const srsFam = activeSrs ? Number(activeSrs.familiarity) || 0 : 0;
  const srsMaxFam = activeSrs && Number(activeSrs.maxFamiliarity) || 5;
  const showDots = srsInfo && srsInfo.kind !== "new" && srsFam > 0;
  const cleanMeaning = formatMeaning(item.zh);
  const meaningClass = "eg-zh" + (cleanMeaning.length > 28 ? " is-xlong" : cleanMeaning.length > 16 ? " is-long" : "");
  const footerActions = answered ? /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-word-foot" }, ok ? /* @__PURE__ */ import_react16.default.createElement(import_react16.default.Fragment, null, /* @__PURE__ */ import_react16.default.createElement(
    "button",
    {
      className: "eg-btn primary",
      onClick: () => load(),
      disabled: busy,
      title: "回车继续",
      "aria-keyshortcuts": "Enter"
    },
    "下一个"
  ), !(res.srs && res.srs.mastered) ? /* @__PURE__ */ import_react16.default.createElement("button", { className: "eg-btn", onClick: markMastered, disabled: busy, title: "太简单，直接标为已掌握" }, "已掌握") : null) : /* @__PURE__ */ import_react16.default.createElement(import_react16.default.Fragment, null, /* @__PURE__ */ import_react16.default.createElement("button", { className: "eg-btn primary", onClick: retry, disabled: busy }, "再试一次"), /* @__PURE__ */ import_react16.default.createElement(
    "button",
    {
      className: "eg-btn",
      onClick: toggleReveal,
      disabled: busy,
      "aria-expanded": revealed ? "true" : "false"
    },
    revealed ? "收起答案" : "显示答案"
  ), /* @__PURE__ */ import_react16.default.createElement("button", { className: "eg-btn", onClick: () => load(), disabled: busy }, "下一个"))) : /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-word-foot" }, /* @__PURE__ */ import_react16.default.createElement(
    "button",
    {
      className: "eg-btn primary" + (busy ? " is-loading" : ""),
      onClick: submit,
      onPointerDown: bounceButton,
      disabled: busy || cells.some((c) => !c)
    },
    "提交"
  ), /* @__PURE__ */ import_react16.default.createElement("button", { className: "eg-btn", onClick: () => load(), disabled: busy }, "换一个"), /* @__PURE__ */ import_react16.default.createElement("button", { className: "eg-btn", onClick: markMastered, disabled: busy, title: "太简单，直接标为已掌握" }, "已掌握"), /* @__PURE__ */ import_react16.default.createElement("span", { className: "eg-kbd", title: "回车提交" }, /* @__PURE__ */ import_react16.default.createElement("kbd", null, "↵")));
  return /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-word" }, topBar, /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-word-main" }, /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-word-stage", key: item.id }, /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-word-meta" }, item.pos ? /* @__PURE__ */ import_react16.default.createElement("span", { className: "eg-pos-text", title: "词性提示" }, formatPos(item.pos)) : null, item.pos ? /* @__PURE__ */ import_react16.default.createElement("span", { className: "eg-meta-sep", "aria-hidden": "true" }, "·") : null, /* @__PURE__ */ import_react16.default.createElement(
    "span",
    {
      className: "eg-srs-tag" + (srsInfo && srsInfo.kind === "review" ? " is-review" : ""),
      title: memoryTooltip(srsInfo)
    },
    memoryLabel(srsInfo),
    showDots ? /* @__PURE__ */ import_react16.default.createElement("span", { className: "eg-srs-dots", "aria-hidden": "true" }, Array.from({ length: srsMaxFam }, (_, idx) => /* @__PURE__ */ import_react16.default.createElement("i", { key: idx, className: "eg-srs-dot" + (idx < srsFam ? " on" : "") }))) : null,
    srsInfo && srsInfo.isHardWord ? /* @__PURE__ */ import_react16.default.createElement("span", { className: "eg-srs-hard", title: "高难度或多次遗忘词汇" }, "易错") : null
  )), /* @__PURE__ */ import_react16.default.createElement("div", { className: meaningClass }, cleanMeaning), !answered ? /* @__PURE__ */ import_react16.default.createElement(ExampleBlock, { example: item.example }) : null, /* @__PURE__ */ import_react16.default.createElement(
    LetterGrid,
    {
      cells,
      answered,
      ok,
      reference: res && res.reference,
      busy,
      inputRefs: refs,
      onSetCell: setCell,
      onKey
    }
  ), error ? /* @__PURE__ */ import_react16.default.createElement("div", { className: "eg-err" }, error) : null, /* @__PURE__ */ import_react16.default.createElement(WordFeedback, { res, revealed, busy, rateBusy, onRate: rate }))), footerActions);
}

// src/client/features/report/useDailyReport.js
var import_react17 = require("react");
function useDailyReport({ open, active }) {
  const [report, setReport] = (0, import_react17.useState)(null);
  const [loading, setLoading] = (0, import_react17.useState)(false);
  const [enriching, setEnriching] = (0, import_react17.useState)(false);
  const [enrichError, setEnrichError] = (0, import_react17.useState)("");
  const [error, setError] = (0, import_react17.useState)("");
  const genRef = (0, import_react17.useRef)(0);
  const abortRef = (0, import_react17.useRef)(null);
  const enrichAbortRef = (0, import_react17.useRef)(null);
  const startedRef = (0, import_react17.useRef)(false);
  const reportRef = (0, import_react17.useRef)(null);
  (0, import_react17.useEffect)(() => {
    reportRef.current = report;
  }, [report]);
  (0, import_react17.useEffect)(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (enrichAbortRef.current) enrichAbortRef.current.abort();
    };
  }, []);
  const runEnrich = (0, import_react17.useCallback)(async (target, gen) => {
    if (!target || target.fallback || target.enriched !== false) return;
    if (enrichAbortRef.current) enrichAbortRef.current.abort();
    const ac = new AbortController();
    enrichAbortRef.current = ac;
    setEnriching(true);
    setEnrichError("");
    try {
      const next = await api("/report/enrich", {
        method: "POST",
        body: JSON.stringify({ date: target.date, id: target.id }),
        signal: ac.signal
      });
      if (gen !== genRef.current || ac.signal.aborted) return;
      if (target.id && next && next.id && next.id !== target.id) return;
      setReport(next);
    } catch (e) {
      if (gen !== genRef.current || ac.signal.aborted || e && e.name === "AbortError") return;
      const msg = String(e && e.message || "");
      setEnrichError(/timed out/i.test(msg) ? "后台补全超时，请点击重试" : msg || "译文与练习加载失败");
    } finally {
      if (enrichAbortRef.current === ac) enrichAbortRef.current = null;
      if (gen === genRef.current) setEnriching(false);
    }
  }, []);
  const refresh = (0, import_react17.useCallback)(
    async (force) => {
      const gen = ++genRef.current;
      if (abortRef.current) abortRef.current.abort();
      if (enrichAbortRef.current) {
        enrichAbortRef.current.abort();
        enrichAbortRef.current = null;
      }
      const ac = new AbortController();
      abortRef.current = ac;
      startedRef.current = true;
      setLoading(true);
      setEnriching(false);
      setEnrichError("");
      setError("");
      if (force) setReport(null);
      try {
        const next = force ? await api("/report/refresh", { method: "POST", signal: ac.signal }) : await api("/report", { signal: ac.signal });
        if (gen !== genRef.current || ac.signal.aborted) return;
        setReport(next);
        if (next && !next.fallback && next.enriched === false) {
          runEnrich(next, gen);
        }
      } catch (e) {
        if (gen !== genRef.current || ac.signal.aborted || e && e.name === "AbortError") return;
        setError(e.message || "文章加载失败");
      } finally {
        if (abortRef.current === ac) abortRef.current = null;
        if (gen === genRef.current) setLoading(false);
      }
    },
    [runEnrich]
  );
  const retryEnrich = (0, import_react17.useCallback)(() => {
    const current = reportRef.current;
    if (!current || current.fallback || current.enriched !== false) return;
    runEnrich(current, genRef.current);
  }, [runEnrich]);
  (0, import_react17.useEffect)(() => {
    if (open && active && !report && !loading && !error && !startedRef.current) {
      refresh(false);
    }
  }, [open, active, report, loading, error, refresh]);
  (0, import_react17.useEffect)(() => {
    if (!open && error) {
      startedRef.current = false;
      setError("");
    }
  }, [open, error]);
  const invalidate = (0, import_react17.useCallback)(() => {
    genRef.current += 1;
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (enrichAbortRef.current) {
      enrichAbortRef.current.abort();
      enrichAbortRef.current = null;
    }
    startedRef.current = false;
    setReport(null);
    setError("");
    setEnrichError("");
    setLoading(false);
    setEnriching(false);
  }, []);
  return { report, loading, enriching, enrichError, error, refresh, retryEnrich, invalidate };
}

// src/client/features/report/Report.jsx
var import_react22 = __toESM(require("react"), 1);

// src/client/features/report/highlight.js
function segmentReportParagraphs(paragraphs, highlights, options = {}) {
  const list = Array.isArray(paragraphs) ? paragraphs : [];
  const firstOnly = options.firstOnly !== false;
  const items = [];
  const byKey = /* @__PURE__ */ new Map();
  for (const raw of Array.isArray(highlights) ? highlights : []) {
    if (!raw || typeof raw !== "object") continue;
    const word = String(raw.word || "").trim().replace(/\s+/g, " ");
    const zh = String(raw.zh || "").trim();
    if (!word || !zh) continue;
    const key = word.toLowerCase();
    if (byKey.has(key)) continue;
    const item = { ...raw, word, zh };
    byKey.set(key, item);
    items.push(item);
  }
  if (!items.length) {
    return {
      segmentsByParagraph: list.map((p) => [{ type: "text", text: String(p || "") }]),
      matchedCount: 0
    };
  }
  items.sort((a, b) => b.word.length - a.word.length);
  let pattern = "";
  try {
    const alts = items.map((i) => escapeRegExp(i.word)).join("|");
    pattern = new RegExp(`(?<![A-Za-z0-9'’-])(?:${alts})(?![A-Za-z0-9'’-])`, "gi");
  } catch {
    return {
      segmentsByParagraph: list.map((p) => [{ type: "text", text: String(p || "") }]),
      matchedCount: 0
    };
  }
  const seenKeys = /* @__PURE__ */ new Set();
  let nextId = 0;
  const segmentsByParagraph = list.map((rawPara) => {
    const source = String(rawPara || "");
    if (!source) return [{ type: "text", text: "" }];
    pattern.lastIndex = 0;
    const segs = [];
    let cursor = 0;
    let m;
    while ((m = pattern.exec(source)) !== null) {
      const matchedText = m[0];
      if (!matchedText) {
        pattern.lastIndex += 1;
        continue;
      }
      const key = matchedText.toLowerCase().replace(/\s+/g, " ");
      const item = byKey.get(key);
      if (!item || firstOnly && seenKeys.has(key)) continue;
      if (m.index > cursor) {
        segs.push({ type: "text", text: source.slice(cursor, m.index) });
      }
      seenKeys.add(key);
      segs.push({ type: "term", id: "hl-" + nextId++, text: matchedText, item });
      cursor = m.index + matchedText.length;
    }
    if (cursor < source.length) {
      segs.push({ type: "text", text: source.slice(cursor) });
    }
    return segs.length ? segs : [{ type: "text", text: source }];
  });
  return { segmentsByParagraph, matchedCount: nextId };
}
function groupSegmentsBySentence(paragraphText, segs, sentences) {
  const source = String(paragraphText || "");
  const list = Array.isArray(sentences) ? sentences : [];
  const parts = Array.isArray(segs) ? segs : [];
  if (!source || !list.length) return null;
  if (parts.map((s) => String(s && s.text || "")).join("") !== source) return null;
  const ranges = [];
  let cursor = 0;
  for (let i = 0; i < list.length; i += 1) {
    const en = String(list[i] && list[i].en || "");
    const at = en ? source.indexOf(en, cursor) : -1;
    if (at < 0) return null;
    ranges.push({ start: at, end: at + en.length, index: i });
    cursor = at + en.length;
  }
  const cutPoints = Array.from(new Set(ranges.flatMap((r) => [r.start, r.end]))).sort((a, b) => a - b);
  const containerAt = (pos) => {
    for (const r of ranges) if (pos >= r.start && pos < r.end) return r.index;
    return -1;
  };
  const pieces = [];
  let offset = 0;
  for (const seg of parts) {
    const start = offset;
    const end = offset + seg.text.length;
    offset = end;
    if (!seg.text) continue;
    if (seg.type === "term") {
      pieces.push({ container: containerAt(start), seg });
      continue;
    }
    let from = start;
    for (const cut of [...cutPoints.filter((c) => c > start && c < end), end]) {
      pieces.push({ container: containerAt(from), seg: { type: "text", text: source.slice(from, cut) } });
      from = cut;
    }
  }
  const groups = [];
  for (const piece of pieces) {
    const last = groups[groups.length - 1];
    if (last && last.container === piece.container) last.segs.push(piece.seg);
    else groups.push({ container: piece.container, segs: [piece.seg] });
  }
  return groups.map(
    (g) => g.container < 0 ? { type: "gap", segs: g.segs } : { type: "sentence", index: g.container, segs: g.segs }
  );
}
function annotateSentenceSegments(sentenceEn, segs, hint = {}) {
  const source = String(sentenceEn || "");
  const parts = Array.isArray(segs) ? segs : [];
  if (!source || !parts.length) return parts;
  if (parts.map((s) => String(s && s.text || "")).join("") !== source) return parts;
  const slashPositions = /* @__PURE__ */ new Set();
  const rawChunks = hint && Array.isArray(hint.chunks) ? hint.chunks : [];
  if (rawChunks.length >= 2) {
    let cursor = 0;
    const ends = [];
    let ok = true;
    for (const raw of rawChunks) {
      const chunk = String(raw || "").replace(/\s+/g, " ").trim();
      while (cursor < source.length && /\s/.test(source[cursor])) cursor += 1;
      if (!chunk || !source.startsWith(chunk, cursor)) {
        ok = false;
        break;
      }
      cursor += chunk.length;
      ends.push(cursor);
    }
    while (cursor < source.length && /\s/.test(source[cursor])) cursor += 1;
    if (ok && cursor === source.length) {
      for (let i = 0; i < ends.length - 1; i += 1) slashPositions.add(ends[i]);
    }
  }
  let coreRanges = [];
  const rawCore = hint && Array.isArray(hint.core) ? hint.core : [];
  if (rawCore.length) {
    const lower = source.toLowerCase();
    let cursor = 0;
    const ranges = [];
    let ok = true;
    for (const raw of rawCore) {
      const piece = String(raw || "").replace(/\s+/g, " ").trim();
      if (!piece) continue;
      let at = source.indexOf(piece, cursor);
      if (at < 0) at = lower.indexOf(piece.toLowerCase(), cursor);
      if (at < 0) {
        ok = false;
        break;
      }
      ranges.push({ start: at, end: at + piece.length });
      cursor = at + piece.length;
    }
    if (ok && ranges.length) coreRanges = ranges;
  }
  if (!slashPositions.size && !coreRanges.length) return parts;
  const out = [];
  const emittedSlashes = /* @__PURE__ */ new Set();
  const maybePushSlash = (pos) => {
    if (slashPositions.has(pos) && !emittedSlashes.has(pos)) {
      emittedSlashes.add(pos);
      out.push({ type: "slash" });
    }
  };
  const isInsideCore = (start, end) => coreRanges.some((r) => start < r.end && end > r.start);
  let offset = 0;
  for (const seg of parts) {
    const text = String(seg && seg.text || "");
    const start = offset;
    const end = offset + text.length;
    offset = end;
    if (!text) continue;
    maybePushSlash(start);
    if (seg.type === "term") {
      out.push({ ...seg, inCore: isInsideCore(start, end) });
      maybePushSlash(end);
      continue;
    }
    const cuts = /* @__PURE__ */ new Set();
    for (const pos of slashPositions) {
      if (pos > start && pos < end) cuts.add(pos);
    }
    for (const r of coreRanges) {
      if (r.start > start && r.start < end) cuts.add(r.start);
      if (r.end > start && r.end < end) cuts.add(r.end);
    }
    const sortedCuts = Array.from(cuts).sort((a, b) => a - b);
    let from = start;
    for (const cut of [...sortedCuts, end]) {
      maybePushSlash(from);
      const sliceText = source.slice(from, cut);
      if (sliceText) {
        out.push({ type: "text", text: sliceText, inCore: isInsideCore(from, cut) });
      }
      from = cut;
    }
    maybePushSlash(end);
  }
  return out;
}

// src/client/features/report/useWordPopover.js
var import_react18 = __toESM(require("react"), 1);
var useIsoLayoutEffect3 = import_react18.default.useLayoutEffect || import_react18.useEffect;
function useWordPopover({ report, reportRef }) {
  const [active, setActive] = (0, import_react18.useState)(null);
  const [popPos, setPopPos] = (0, import_react18.useState)(null);
  const popRef = (0, import_react18.useRef)(null);
  const termRefs = (0, import_react18.useRef)({});
  const closeTimerRef = (0, import_react18.useRef)(null);
  const cancelClose = (0, import_react18.useCallback)(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);
  const scheduleClose = (0, import_react18.useCallback)(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setActive((prev) => prev && !prev.pinned ? null : prev);
    }, 140);
  }, [cancelClose]);
  const reportKey = report ? report.id || `${report.date || ""}|${report.title || ""}|${report.body || ""}` : "";
  (0, import_react18.useEffect)(() => {
    cancelClose();
    setActive(null);
    setPopPos(null);
    termRefs.current = {};
  }, [reportKey, cancelClose]);
  (0, import_react18.useEffect)(() => () => cancelClose(), [cancelClose]);
  (0, import_react18.useEffect)(() => {
    if (!active) return void 0;
    const onPointerDown = (e) => {
      const target = e.target;
      if (popRef.current && target && popRef.current.contains(target)) return;
      if (target && target.closest && target.closest(".eg-rword")) return;
      setActive(null);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setActive(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [active]);
  const updatePopoverPosition = (0, import_react18.useCallback)(() => {
    if (!active) {
      setPopPos(null);
      return;
    }
    const reportEl = reportRef.current;
    const popEl = popRef.current;
    const anchorEl = termRefs.current[active.id];
    if (!reportEl || !popEl || !anchorEl) return;
    const reportRect = reportEl.getBoundingClientRect();
    const anchorRect = anchorEl.getClientRects && anchorEl.getClientRects()[0] || anchorEl.getBoundingClientRect();
    const popWidth = popEl.offsetWidth;
    const popHeight = popEl.offsetHeight;
    if (!reportRect.width || !popWidth || !popHeight) return;
    const scrollEl = reportEl.closest ? reportEl.closest(".eg-body") : null;
    const scrollRect = (scrollEl || document.documentElement).getBoundingClientRect();
    const anchorTop = anchorRect.top - reportRect.top;
    const anchorBottom = anchorRect.bottom - reportRect.top;
    const anchorCenterX = anchorRect.left - reportRect.left + anchorRect.width / 2;
    const gap = 9;
    const spaceAbove = anchorRect.top - scrollRect.top;
    const spaceBelow = scrollRect.bottom - anchorRect.bottom;
    const placement = spaceAbove < popHeight + gap + 8 && spaceBelow >= spaceAbove ? "below" : "above";
    const top = placement === "below" ? Math.round(anchorBottom + gap) : Math.round(anchorTop - popHeight - gap);
    const maxLeft = Math.max(0, reportRect.width - popWidth);
    const left = Math.round(Math.max(0, Math.min(maxLeft, anchorCenterX - popWidth / 2)));
    const arrowX = Math.round(Math.max(12, Math.min(Math.max(12, popWidth - 12), anchorCenterX - left)));
    setPopPos({ left, top, arrowX, placement });
  }, [active, reportRef]);
  useIsoLayoutEffect3(() => {
    updatePopoverPosition();
    if (!active) return void 0;
    window.addEventListener("resize", updatePopoverPosition);
    let ro = null;
    if (typeof ResizeObserver === "function" && reportRef.current) {
      ro = new ResizeObserver(updatePopoverPosition);
      ro.observe(reportRef.current);
    }
    return () => {
      window.removeEventListener("resize", updatePopoverPosition);
      if (ro) ro.disconnect();
    };
  }, [active, reportRef, updatePopoverPosition]);
  const handleTermEnter = (0, import_react18.useCallback)(
    (seg) => {
      cancelClose();
      setActive((prev) => prev && prev.pinned ? prev : { id: seg.id, item: seg.item, text: seg.text, pinned: false });
    },
    [cancelClose]
  );
  const handleTermLeave = (0, import_react18.useCallback)(() => {
    scheduleClose();
  }, [scheduleClose]);
  const handleTermClick = (0, import_react18.useCallback)(
    (e, seg) => {
      const sel = typeof window !== "undefined" && window.getSelection ? window.getSelection() : null;
      if (sel && String(sel).trim()) return;
      e.stopPropagation();
      cancelClose();
      setActive(
        (prev) => prev && prev.pinned && prev.id === seg.id ? null : { id: seg.id, item: seg.item, text: seg.text, pinned: true }
      );
    },
    [cancelClose]
  );
  const handleTermFocus = (0, import_react18.useCallback)(
    (seg) => {
      cancelClose();
      setActive((prev) => prev && prev.pinned ? prev : { id: seg.id, item: seg.item, text: seg.text, pinned: false });
    },
    [cancelClose]
  );
  const handleTermBlur = (0, import_react18.useCallback)((e) => {
    if (popRef.current && e.relatedTarget && popRef.current.contains(e.relatedTarget)) return;
    setActive((prev) => prev && !prev.pinned ? null : prev);
  }, []);
  const handleTermKeyDown = (0, import_react18.useCallback)(
    (e, seg) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        cancelClose();
        setActive(
          (prev) => prev && prev.pinned && prev.id === seg.id ? null : { id: seg.id, item: seg.item, text: seg.text, pinned: true }
        );
      }
    },
    [cancelClose]
  );
  const closePopover = (0, import_react18.useCallback)(() => setActive(null), []);
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
      onKeyDown: handleTermKeyDown
    }
  };
}

// src/client/features/report/WordPopover.jsx
var import_react19 = __toESM(require("react"), 1);
function WordPopover({ active, popPos, popRef, onCancelClose, onLeave, onClose }) {
  if (!active) return null;
  const activePos = active.item.pos ? formatPos(active.item.pos) : "";
  const activeLemma = active.item.lemma && active.item.lemma.toLowerCase() !== active.text.toLowerCase() ? active.item.lemma : "";
  return /* @__PURE__ */ import_react19.default.createElement(
    "div",
    {
      ref: popRef,
      className: "eg-rpop" + (popPos ? " is-ready" : "") + (popPos && popPos.placement === "below" ? " is-below" : "") + (active.pinned ? " is-pinned" : ""),
      role: active.pinned ? "dialog" : "tooltip",
      "aria-label": active.text + " 释义",
      style: popPos ? { left: popPos.left + "px", top: popPos.top + "px", "--eg-arrow-x": popPos.arrowX + "px" } : { left: 0, top: 0 },
      onMouseEnter: onCancelClose,
      onMouseLeave: onLeave
    },
    /* @__PURE__ */ import_react19.default.createElement("div", { className: "eg-rpop-head" }, /* @__PURE__ */ import_react19.default.createElement("div", { className: "eg-rpop-title" }, /* @__PURE__ */ import_react19.default.createElement("span", { className: "eg-rpop-word" }, active.text), activeLemma ? /* @__PURE__ */ import_react19.default.createElement("span", { className: "eg-rpop-lemma" }, "→ " + activeLemma) : null), active.pinned ? /* @__PURE__ */ import_react19.default.createElement("button", { type: "button", className: "eg-rpop-close", "aria-label": "关闭释义", onClick: onClose }, "×") : null),
    activePos || active.item.fromBank ? /* @__PURE__ */ import_react19.default.createElement("div", { className: "eg-rpop-tags" }, activePos ? /* @__PURE__ */ import_react19.default.createElement("span", { className: "eg-rpop-pos" }, activePos) : null, active.item.fromBank ? /* @__PURE__ */ import_react19.default.createElement("span", { className: "eg-rpop-bank" }, "词库") : null) : null,
    /* @__PURE__ */ import_react19.default.createElement("div", { className: "eg-rpop-zh" }, active.item.zh)
  );
}

// src/client/features/report/ReportParagraph.jsx
var import_react20 = __toESM(require("react"), 1);
function hasSentenceHint(s) {
  return Boolean(
    s && (Array.isArray(s.chunks) && s.chunks.length >= 2 || Array.isArray(s.core) && s.core.length > 0)
  );
}
function SentenceExplainBox({ exp, onRetry }) {
  const expLoading = !!(exp && exp.loading);
  const expData = exp && exp.data;
  const expErr = exp && exp.error;
  return /* @__PURE__ */ import_react20.default.createElement("div", { className: "eg-rexplain" }, expLoading ? /* @__PURE__ */ import_react20.default.createElement("div", { className: "eg-rexplain-loading" }, /* @__PURE__ */ import_react20.default.createElement("span", { className: "eg-spin" }), "正在解析句型与译法…") : expErr ? /* @__PURE__ */ import_react20.default.createElement("div", { className: "eg-rexplain-err" }, /* @__PURE__ */ import_react20.default.createElement("span", null, expErr), /* @__PURE__ */ import_react20.default.createElement("button", { type: "button", className: "eg-rslot-btn", onClick: onRetry }, "重试")) : expData ? /* @__PURE__ */ import_react20.default.createElement(import_react20.default.Fragment, null, expData.structure ? /* @__PURE__ */ import_react20.default.createElement("div", { className: "eg-rexplain-sec" }, /* @__PURE__ */ import_react20.default.createElement("span", { className: "eg-rexplain-label" }, "句型"), /* @__PURE__ */ import_react20.default.createElement("span", { className: "eg-rexplain-text" }, expData.structure)) : null, expData.points && expData.points.length ? /* @__PURE__ */ import_react20.default.createElement("ul", { className: "eg-rexplain-pts" }, expData.points.map((pt, pi) => /* @__PURE__ */ import_react20.default.createElement("li", { key: pi, className: "eg-rexplain-pt" }, /* @__PURE__ */ import_react20.default.createElement("span", { className: "eg-rexplain-phrase" }, pt.phrase), /* @__PURE__ */ import_react20.default.createElement("span", { className: "eg-rexplain-note" }, pt.note)))) : null, expData.nuance ? /* @__PURE__ */ import_react20.default.createElement("div", { className: "eg-rexplain-sec" }, /* @__PURE__ */ import_react20.default.createElement("span", { className: "eg-rexplain-label" }, "译法"), /* @__PURE__ */ import_react20.default.createElement("span", { className: "eg-rexplain-text" }, expData.nuance)) : null) : null);
}
function ReportParagraph({
  index,
  segs,
  paragraphText,
  info,
  enriching,
  reveal,
  explains,
  activeTermId,
  termRefs,
  onToggleGist,
  onToggleSentence,
  onExplainToggle,
  termHandlers
}) {
  const renderSeg = (seg, j) => {
    if (seg.type === "slash") {
      return /* @__PURE__ */ import_react20.default.createElement("span", { key: "sl-" + j, className: "eg-rslash", "aria-hidden": "true" }, "/");
    }
    if (seg.type !== "term") {
      return seg.inCore ? /* @__PURE__ */ import_react20.default.createElement("span", { key: "c-" + j, className: "eg-rcore" }, seg.text) : seg.text;
    }
    const isActive = activeTermId === seg.id;
    return /* @__PURE__ */ import_react20.default.createElement(
      "mark",
      {
        key: seg.id + "-" + j,
        ref: (el) => {
          if (el) termRefs.current[seg.id] = el;
          else delete termRefs.current[seg.id];
        },
        className: "eg-rword" + (isActive ? " is-active" : "") + (seg.inCore ? " is-core" : ""),
        role: "button",
        tabIndex: 0,
        "aria-expanded": isActive ? "true" : "false",
        onMouseEnter: () => termHandlers.onEnter(seg),
        onMouseLeave: termHandlers.onLeave,
        onClick: (e) => termHandlers.onClick(e, seg),
        onFocus: () => termHandlers.onFocus(seg),
        onBlur: termHandlers.onBlur,
        onKeyDown: (e) => termHandlers.onKeyDown(e, seg)
      },
      seg.text
    );
  };
  if (!info || !info.groups && !info.gist && !enriching) {
    return /* @__PURE__ */ import_react20.default.createElement("p", { className: "eg-rp" }, segs.map(renderSeg));
  }
  const handleSentenceClick = (e, key) => {
    const sel = typeof window !== "undefined" && window.getSelection ? window.getSelection() : null;
    if (sel && String(sel).trim()) return;
    if (e.target && e.target.closest && e.target.closest(".eg-rword")) return;
    onToggleSentence(key);
  };
  const handleSentenceKeyDown = (e, key) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onToggleSentence(key);
    }
  };
  const children = info.groups ? info.groups.map((g, gi) => {
    if (g.type !== "sentence") {
      return /* @__PURE__ */ import_react20.default.createElement(import_react20.default.Fragment, { key: "gap-" + gi }, g.segs.map(renderSeg));
    }
    const n = info.base + g.index;
    const s = info.sentences[g.index] || {};
    const key = "s" + n;
    const canReveal = Boolean(s && s.zh || enriching && s && s.en);
    const isOpen = canReveal && !!reveal[key];
    const segList = isOpen && hasSentenceHint(s) ? annotateSentenceSegments(s.en, g.segs, s) : g.segs;
    return /* @__PURE__ */ import_react20.default.createElement(
      "span",
      {
        key,
        className: "eg-rsent" + (canReveal ? " can-reveal" : "") + (isOpen ? " is-open" : ""),
        tabIndex: canReveal ? 0 : void 0,
        "aria-expanded": canReveal ? isOpen ? "true" : "false" : void 0,
        title: canReveal ? isOpen ? "点击收起本句译文" : "点击查看本句译文" : void 0,
        onClick: canReveal ? (e) => handleSentenceClick(e, key) : void 0,
        onKeyDown: canReveal ? (e) => handleSentenceKeyDown(e, key) : void 0
      },
      segList.map(renderSeg),
      isOpen ? /* @__PURE__ */ import_react20.default.createElement("sup", { className: "eg-rsent-n", "aria-hidden": "true" }, String(n + 1)) : null
    );
  }) : segs.map(renderSeg);
  const gistKey = "g" + index;
  const canShowGist = Boolean(info.gist || enriching);
  const gistOpen = !!(canShowGist && reveal[gistKey]);
  const openSentences = info.sentences.map((s, si) => ({ s, si, n: info.base + si })).filter(({ s, n }) => reveal["s" + n] && (s && s.zh || enriching && s && s.en));
  return /* @__PURE__ */ import_react20.default.createElement(import_react20.default.Fragment, null, /* @__PURE__ */ import_react20.default.createElement("p", { className: "eg-rp" }, children, canShowGist ? /* @__PURE__ */ import_react20.default.createElement(
    "button",
    {
      type: "button",
      className: "eg-rgist-btn",
      "aria-expanded": gistOpen ? "true" : "false",
      title: gistOpen ? "收起本段大意" : "看本段大意（中文）",
      onClick: () => onToggleGist(gistKey)
    },
    "段意"
  ) : null), gistOpen || openSentences.length ? /* @__PURE__ */ import_react20.default.createElement("div", { className: "eg-rslot", "aria-live": "polite" }, gistOpen ? /* @__PURE__ */ import_react20.default.createElement("div", { key: gistKey, className: "eg-rslot-row is-gist" }, /* @__PURE__ */ import_react20.default.createElement("span", { className: "eg-rslot-tag" }, "段意"), info.gist ? /* @__PURE__ */ import_react20.default.createElement("span", { className: "eg-rslot-zh" }, info.gist) : /* @__PURE__ */ import_react20.default.createElement("span", { className: "eg-rslot-zh is-pending" }, /* @__PURE__ */ import_react20.default.createElement("span", { className: "eg-spin" }), "正在加载本段大意…"), /* @__PURE__ */ import_react20.default.createElement("button", { type: "button", className: "eg-rslot-x", "aria-label": "收起段意", onClick: () => onToggleGist(gistKey) }, "×")) : null, openSentences.map(({ s, si, n }) => {
    const skey = "s" + n;
    const exp = explains[skey] || null;
    const expOpen = !!(exp && exp.open);
    const expLoading = !!(exp && exp.loading);
    const explainPayload = { key: skey, pIdx: index, sIdx: si, sentence: s, paragraphText };
    return /* @__PURE__ */ import_react20.default.createElement("div", { key: skey, className: "eg-rslot-row" }, /* @__PURE__ */ import_react20.default.createElement("span", { className: "eg-rslot-tag" }, String(n + 1)), /* @__PURE__ */ import_react20.default.createElement("div", { className: "eg-rslot-body" }, s.zh ? /* @__PURE__ */ import_react20.default.createElement(import_react20.default.Fragment, null, /* @__PURE__ */ import_react20.default.createElement("div", { className: "eg-rslot-zh" }, s.zh), /* @__PURE__ */ import_react20.default.createElement("div", { className: "eg-rslot-tools" }, /* @__PURE__ */ import_react20.default.createElement(
      "button",
      {
        type: "button",
        className: "eg-rslot-btn" + (expOpen ? " is-active" : ""),
        "aria-expanded": expOpen ? "true" : "false",
        disabled: expLoading,
        onClick: () => onExplainToggle(explainPayload)
      },
      expLoading ? "解析中…" : expOpen ? "收起讲解" : "为什么？"
    )), expOpen ? /* @__PURE__ */ import_react20.default.createElement(
      SentenceExplainBox,
      {
        exp,
        onRetry: () => onExplainToggle({ ...explainPayload, retry: true })
      }
    ) : null) : /* @__PURE__ */ import_react20.default.createElement("div", { className: "eg-rslot-zh is-pending" }, /* @__PURE__ */ import_react20.default.createElement("span", { className: "eg-spin" }), "正在加载本句译文…")), /* @__PURE__ */ import_react20.default.createElement(
      "button",
      {
        type: "button",
        className: "eg-rslot-x",
        "aria-label": "收起第 " + (n + 1) + " 句译文",
        onClick: () => onToggleSentence(skey)
      },
      "×"
    ));
  })) : null);
}

// src/client/features/report/ReportPractice.jsx
var import_react21 = __toESM(require("react"), 1);
function ReportPractice({ report, questions, enriching, enrichError, onRetryEnrich }) {
  const [openMap, setOpenMap] = (0, import_react21.useState)({});
  const reportKey = report ? report.id || `${report.date || ""}|${report.title || ""}|${report.body || ""}` : "";
  (0, import_react21.useEffect)(() => {
    setOpenMap({});
  }, [reportKey]);
  if (!questions.length) {
    if (enriching) {
      return /* @__PURE__ */ import_react21.default.createElement("div", { className: "eg-practice" }, /* @__PURE__ */ import_react21.default.createElement("div", { className: "eg-ptitle" }, "练一练"), /* @__PURE__ */ import_react21.default.createElement("div", { className: "eg-practice-pending" }, /* @__PURE__ */ import_react21.default.createElement("span", { className: "eg-spin" }), "正在准备翻译小题…"));
    }
    if (enrichError) {
      return /* @__PURE__ */ import_react21.default.createElement("div", { className: "eg-practice" }, /* @__PURE__ */ import_react21.default.createElement("div", { className: "eg-ptitle" }, "练一练"), /* @__PURE__ */ import_react21.default.createElement("div", { className: "eg-practice-err" }, /* @__PURE__ */ import_react21.default.createElement("span", null, enrichError), onRetryEnrich ? /* @__PURE__ */ import_react21.default.createElement("button", { type: "button", className: "eg-rslot-btn", onClick: onRetryEnrich }, "重试") : null));
    }
    return null;
  }
  return /* @__PURE__ */ import_react21.default.createElement("div", { className: "eg-practice" }, /* @__PURE__ */ import_react21.default.createElement("div", { className: "eg-ptitle" }, "练一练"), questions.map((q, i) => {
    const isOpen = !!openMap[i];
    return /* @__PURE__ */ import_react21.default.createElement("div", { key: i, className: "eg-q" + (isOpen ? " reveal" : "") }, /* @__PURE__ */ import_react21.default.createElement("div", { className: "eg-q-head" }, /* @__PURE__ */ import_react21.default.createElement("span", { className: "eg-q-n" }, String(i + 1)), /* @__PURE__ */ import_react21.default.createElement("span", { className: "eg-q-zh" }, q.zh)), /* @__PURE__ */ import_react21.default.createElement(
      "button",
      {
        className: "eg-q-toggle",
        type: "button",
        "aria-expanded": isOpen ? "true" : "false",
        onClick: () => setOpenMap((prev) => ({ ...prev, [i]: !prev[i] }))
      },
      /* @__PURE__ */ import_react21.default.createElement("span", { className: "caret", "aria-hidden": "true" }, "▸"),
      isOpen ? "收起参考" : "看参考"
    ), /* @__PURE__ */ import_react21.default.createElement("div", { className: "eg-collapse" + (isOpen ? " open" : ""), "aria-hidden": isOpen ? "false" : "true" }, /* @__PURE__ */ import_react21.default.createElement("div", { className: "eg-collapse-inner" }, /* @__PURE__ */ import_react21.default.createElement("div", { className: "eg-q-en" }, q.en))));
  }));
}

// src/client/features/report/Report.jsx
function Report({ report, loading, enriching, enrichError, error, onRefresh, onRetryEnrich }) {
  const [reveal, setReveal] = (0, import_react22.useState)({});
  const [explains, setExplains] = (0, import_react22.useState)({});
  const reportRef = (0, import_react22.useRef)(null);
  const reportGenRef = (0, import_react22.useRef)(0);
  const { active, popPos, popRef, termRefs, cancelClose, closePopover, termHandlers } = useWordPopover({
    report,
    reportRef
  });
  const reportKey = report ? report.id || `${report.date || ""}|${report.title || ""}|${report.body || ""}` : "";
  (0, import_react22.useEffect)(() => {
    reportGenRef.current += 1;
    setReveal({});
    setExplains({});
  }, [reportKey]);
  const body = report ? String(report.body || "") : "";
  const highlights = report && Array.isArray(report.highlights) ? report.highlights : [];
  const paragraphs = (0, import_react22.useMemo)(() => body.split(/\n{2,}/).filter(Boolean), [body]);
  const { segmentsByParagraph, matchedCount } = (0, import_react22.useMemo)(
    () => segmentReportParagraphs(paragraphs, highlights),
    [paragraphs, highlights]
  );
  const structure = (0, import_react22.useMemo)(() => {
    const list = report && Array.isArray(report.paragraphs) ? report.paragraphs : [];
    if (!list.length || list.length !== paragraphs.length) return null;
    let base = 0;
    let revealable = 0;
    const items = segmentsByParagraph.map((segs, i) => {
      const p = list[i] || {};
      const sentences = Array.isArray(p.sentences) ? p.sentences : [];
      const groups = groupSegmentsBySentence(paragraphs[i], segs, sentences);
      const item = { gist: groups && p.gist_zh ? String(p.gist_zh) : "", sentences: groups ? sentences : [], groups, base };
      if (groups) {
        base += sentences.length;
        revealable += sentences.filter((s) => s && s.zh).length;
      }
      return item;
    });
    return revealable || items.some((it) => it.gist) || enriching && items.some((it) => it.groups) ? { items, revealable } : null;
  }, [report, paragraphs, segmentsByParagraph, enriching]);
  const toggleGist = (0, import_react22.useCallback)((key) => {
    setReveal((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  }, []);
  const toggleSentence = (0, import_react22.useCallback)(
    (key) => {
      const wasOpen = !!reveal[key];
      setReveal((prev) => {
        const next = { ...prev };
        if (next[key]) delete next[key];
        else next[key] = true;
        return next;
      });
      if (wasOpen) {
        setExplains((prev) => {
          if (!prev[key] || !prev[key].open) return prev;
          return { ...prev, [key]: { ...prev[key], open: false } };
        });
      }
    },
    [reveal]
  );
  const handleExplainToggle = (0, import_react22.useCallback)(
    async ({ key, pIdx, sIdx, sentence, paragraphText, retry = false }) => {
      const cur = explains[key];
      if (!retry && cur && cur.loading) return;
      if (!retry && cur && cur.open && (cur.data || cur.error)) {
        setExplains((prev) => ({ ...prev, [key]: { ...prev[key], open: false } }));
        return;
      }
      const cached = cur && cur.data || sentence && sentence.explain || null;
      if (!retry && cached) {
        setExplains((prev) => ({ ...prev, [key]: { open: true, loading: false, data: cached, error: "" } }));
        return;
      }
      const gen = reportGenRef.current;
      setExplains((prev) => ({ ...prev, [key]: { open: true, loading: true, data: null, error: "" } }));
      try {
        const res = await api("/report/explain", {
          method: "POST",
          body: JSON.stringify({
            date: report && report.date,
            paragraphIndex: pIdx,
            sentenceIndex: sIdx,
            en: sentence.en,
            zh: sentence.zh || "",
            context: paragraphText,
            level: report && report.level
          })
        });
        if (reportGenRef.current !== gen) return;
        const data = res && res.explain ? res.explain : null;
        setExplains((prev) => ({
          ...prev,
          [key]: data ? { open: true, loading: false, data, error: "" } : { open: true, loading: false, data: null, error: "讲解生成失败，请重试" }
        }));
      } catch (err) {
        if (reportGenRef.current !== gen) return;
        setExplains((prev) => ({
          ...prev,
          [key]: { open: true, loading: false, data: null, error: err && err.message || "讲解生成失败，请重试" }
        }));
      }
    },
    [explains, report]
  );
  if (loading && !report) {
    return /* @__PURE__ */ import_react22.default.createElement("div", { className: "eg-loading is-stage" }, /* @__PURE__ */ import_react22.default.createElement("span", { className: "eg-spin" }), "正在生成今日文章…");
  }
  if (!report) {
    return /* @__PURE__ */ import_react22.default.createElement("div", null, /* @__PURE__ */ import_react22.default.createElement("div", { className: "eg-loading" }, error ? /* @__PURE__ */ import_react22.default.createElement("span", { className: "eg-err" }, error) : "暂无文章。"), /* @__PURE__ */ import_react22.default.createElement("div", { className: "eg-actions" }, /* @__PURE__ */ import_react22.default.createElement("button", { className: "eg-btn primary", onClick: onRefresh }, "生成今日文章")));
  }
  const questions = report.questions || [];
  const wordCount = (body.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
  const meta = [report.date, report.level, wordCount ? wordCount + " 词" : "", matchedCount ? matchedCount + " 个重点词" : ""].filter(Boolean).join(" · ");
  const revealedCount = structure ? structure.items.reduce(
    (sum, it) => sum + it.sentences.filter((s, si) => s && s.zh && reveal["s" + (it.base + si)]).length,
    0
  ) : 0;
  const footHint = enriching ? "中文译文、段意与翻译小题生成中…" : structure ? revealedCount ? `已看 ${revealedCount}/${structure.revealable} 句译文 · 点「为什么？」看语法与译法讲解` : "读不懂时点句子看译文，点「段意」看段落大意" : matchedCount ? "标黄词可悬停或点击查译，可随时换一篇" : "按当前内容方向生成，可随时换一篇";
  return /* @__PURE__ */ import_react22.default.createElement("div", { className: "eg-report", ref: reportRef, "data-nodrag": "true" }, /* @__PURE__ */ import_react22.default.createElement("div", { className: "r-top" }, /* @__PURE__ */ import_react22.default.createElement("h2", { className: "eg-rtitle" }, report.title || "Daily Report")), /* @__PURE__ */ import_react22.default.createElement("div", { className: "eg-rmeta-row" }, meta || enriching ? /* @__PURE__ */ import_react22.default.createElement("div", { className: "eg-rmeta-left" }, meta ? /* @__PURE__ */ import_react22.default.createElement("div", { className: "eg-rmeta" }, meta) : null, enriching ? /* @__PURE__ */ import_react22.default.createElement("span", { className: "eg-renrich-pill", role: "status", "aria-live": "polite" }, /* @__PURE__ */ import_react22.default.createElement("span", { className: "eg-spin" }), "中文译文生成中…") : null) : /* @__PURE__ */ import_react22.default.createElement("span", null), /* @__PURE__ */ import_react22.default.createElement(
    "button",
    {
      type: "button",
      className: "eg-rrefresh",
      onClick: onRefresh,
      disabled: loading,
      title: "重新生成一篇今日文章"
    },
    loading ? "生成中…" : "↻ 换一篇"
  )), report.fallback ? /* @__PURE__ */ import_react22.default.createElement("div", { className: "eg-rnotice" }, /* @__PURE__ */ import_react22.default.createElement("span", { className: "eg-rnotice-text" }, "生成未成功，当前显示内置示例文章", report.fallbackReason ? `（${report.fallbackReason}）` : ""), /* @__PURE__ */ import_react22.default.createElement("button", { type: "button", className: "eg-rslot-btn", onClick: onRefresh, disabled: loading }, "重试")) : null, enrichError && !enriching && !report.fallback ? /* @__PURE__ */ import_react22.default.createElement("div", { className: "eg-rnotice is-err" }, /* @__PURE__ */ import_react22.default.createElement("span", { className: "eg-rnotice-text" }, enrichError), onRetryEnrich ? /* @__PURE__ */ import_react22.default.createElement("button", { type: "button", className: "eg-rslot-btn", onClick: onRetryEnrich }, "重试") : null) : null, error ? /* @__PURE__ */ import_react22.default.createElement("div", { className: "eg-rnotice is-err" }, error) : null, report.summary_zh ? /* @__PURE__ */ import_react22.default.createElement("p", { className: "eg-rsum" }, report.summary_zh) : null, segmentsByParagraph.map((segs, i) => /* @__PURE__ */ import_react22.default.createElement(
    ReportParagraph,
    {
      key: i,
      index: i,
      segs,
      paragraphText: paragraphs[i],
      info: structure ? structure.items[i] : null,
      enriching,
      reveal,
      explains,
      activeTermId: active ? active.id : null,
      termRefs,
      onToggleGist: toggleGist,
      onToggleSentence: toggleSentence,
      onExplainToggle: handleExplainToggle,
      termHandlers
    }
  )), /* @__PURE__ */ import_react22.default.createElement(
    WordPopover,
    {
      active,
      popPos,
      popRef,
      onCancelClose: cancelClose,
      onLeave: termHandlers.onLeave,
      onClose: closePopover
    }
  ), /* @__PURE__ */ import_react22.default.createElement(
    ReportPractice,
    {
      report,
      questions,
      enriching,
      enrichError,
      onRetryEnrich
    }
  ), /* @__PURE__ */ import_react22.default.createElement("div", { className: "eg-report-foot" }, enrichError && !enriching ? /* @__PURE__ */ import_react22.default.createElement("span", { className: "eg-report-foot-err" }, /* @__PURE__ */ import_react22.default.createElement("span", null, enrichError), onRetryEnrich ? /* @__PURE__ */ import_react22.default.createElement("button", { type: "button", className: "eg-rslot-btn", onClick: onRetryEnrich }, "重试") : null) : /* @__PURE__ */ import_react22.default.createElement("span", { className: "eg-report-foot-hint" }, footHint), /* @__PURE__ */ import_react22.default.createElement("button", { type: "button", className: "eg-btn", onClick: onRefresh, onPointerDown: bounceButton, disabled: loading }, loading ? "生成中…" : "↻ 换一篇")));
}

// src/client/features/dashboard/Dashboard.jsx
var import_react25 = __toESM(require("react"), 1);

// src/client/features/dashboard/heatmap.js
function pad2(n) {
  return String(n).padStart(2, "0");
}
function dayStr(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}
function levelOf(n) {
  const count = Number(n) || 0;
  if (count > 60) return 4;
  if (count >= 31) return 3;
  if (count >= 11) return 2;
  if (count >= 1) return 1;
  return 0;
}
function parseDay(str) {
  if (typeof str === "string" && /^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const d = /* @__PURE__ */ new Date(str + "T00:00:00");
    if (!Number.isNaN(d.getTime())) return d;
  }
  const now = /* @__PURE__ */ new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
function buildContributionGrid({ todayStr, range = "last-year", activityMap = {} } = {}) {
  const today = parseDay(todayStr);
  const todayKey = dayStr(today);
  const map = activityMap && typeof activityMap === "object" ? activityMap : {};
  const isYear = typeof range === "string" && /^\d{4}$/.test(range);
  let startDate;
  let endDate;
  let gridStart;
  let gridEnd;
  if (isYear) {
    const yr = Number(range);
    startDate = new Date(yr, 0, 1);
    endDate = new Date(yr, 11, 31);
    gridStart = new Date(yr, 0, 1 - startDate.getDay());
    gridEnd = new Date(yr, 11, 31 + (6 - endDate.getDay()));
  } else {
    const endSunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    startDate = new Date(endSunday.getFullYear(), endSunday.getMonth(), endSunday.getDate() - 52 * 7);
    endDate = today;
    gridStart = startDate;
    gridEnd = new Date(endSunday.getFullYear(), endSunday.getMonth(), endSunday.getDate() + 6);
  }
  const weeks = [];
  let rangeTotal = 0;
  let rangeDays = 0;
  for (let cur = new Date(gridStart.getTime()); cur <= gridEnd; ) {
    const col = [];
    for (let row = 0; row < 7; row += 1) {
      const date = new Date(cur.getTime());
      const key = dayStr(date);
      const out = date < startDate || date > endDate;
      const future = key > todayKey;
      const act = !out ? map[key] || null : null;
      const total = act ? Number(act.total) || 0 : 0;
      const level = !out ? levelOf(total) : 0;
      if (!out && act && total > 0) {
        rangeTotal += total;
        rangeDays += 1;
      }
      col.push({
        key,
        date,
        out,
        future,
        isToday: !out && key === todayKey,
        activity: act,
        level
      });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(col);
  }
  const monthLabels = [];
  let lastCol = -10;
  for (let colIdx = 0; colIdx < weeks.length; colIdx += 1) {
    const col = weeks[colIdx];
    let targetCell = col.find((c) => !c.out && c.date.getDate() === 1);
    if (!targetCell && colIdx === 0) {
      targetCell = col.find((c) => !c.out);
    }
    if (!targetCell) continue;
    if (colIdx - lastCol < 3) continue;
    monthLabels.push({
      col: colIdx,
      label: `${targetCell.date.getMonth() + 1}月`
    });
    lastCol = colIdx;
  }
  return {
    weeks,
    monthLabels,
    rangeTotal,
    rangeDays,
    startKey: dayStr(startDate),
    endKey: dayStr(endDate)
  };
}
function getPageItems(totalPages, currentPage) {
  const total = Math.max(1, Math.floor(Number(totalPages) || 1));
  const current = Math.max(1, Math.min(total, Math.floor(Number(currentPage) || 1)));
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = /* @__PURE__ */ new Set([1, total, current - 1, current, current + 1]);
  const sorted = Array.from(pages).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const items = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) items.push("...");
    items.push(p);
    prev = p;
  }
  return items;
}

// src/client/features/dashboard/ContributionCard.jsx
var import_react23 = __toESM(require("react"), 1);
var DOW_LABELS = ["", "一", "", "三", "", "五", ""];
var useIsoLayoutEffect4 = import_react23.default.useLayoutEffect || import_react23.useEffect;
function ContributionCard({ range, rangeLabel, grid, onSelectDay }) {
  const [tip, setTip] = (0, import_react23.useState)(null);
  const cardRef = (0, import_react23.useRef)(null);
  const scrollRef = (0, import_react23.useRef)(null);
  useIsoLayoutEffect4(() => {
    setTip(null);
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [range, grid]);
  const showTip = (e, cell) => {
    const cardEl = cardRef.current;
    const cellEl = e.currentTarget;
    if (!cardEl || !cellEl) return;
    const cardRect = cardEl.getBoundingClientRect();
    const cellRect = cellEl.getBoundingClientRect();
    const rawX = cellRect.left - cardRect.left + cellRect.width / 2;
    const pad = Math.min(82, Math.max(40, cardRect.width * 0.24));
    const x = Math.round(Math.max(pad, Math.min(Math.max(pad, cardRect.width - pad), rawX)));
    const y = Math.round(cellRect.top - cardRect.top);
    setTip({ x, y, cell });
  };
  const hideTip = () => setTip(null);
  const tipCell = tip ? tip.cell : null;
  const tipAct = tipCell && tipCell.activity;
  const tipText = tipCell ? tipAct ? tipCell.key + " · 单词 " + tipAct.words + " · 句子 " + tipAct.phrases : tipCell.key + " · 无学习记录" : "";
  return /* @__PURE__ */ import_react23.default.createElement("div", { className: "eg-cal-card", ref: cardRef, "data-nodrag": "true" }, /* @__PURE__ */ import_react23.default.createElement("div", { className: "eg-gh-head" }, rangeLabel + "共完成 " + grid.rangeTotal + " 项练习 · " + grid.rangeDays + " 天"), /* @__PURE__ */ import_react23.default.createElement("div", { className: "eg-gh-wrap" }, /* @__PURE__ */ import_react23.default.createElement("div", { className: "eg-gh-dows", "aria-hidden": "true" }, DOW_LABELS.map((lbl, i) => /* @__PURE__ */ import_react23.default.createElement("span", { key: i }, lbl))), /* @__PURE__ */ import_react23.default.createElement("div", { className: "eg-gh-scroll", ref: scrollRef }, /* @__PURE__ */ import_react23.default.createElement("div", { className: "eg-gh-inner" }, /* @__PURE__ */ import_react23.default.createElement("div", { className: "eg-gh-months", style: { width: grid.weeks.length * 11 - 2 + "px" } }, grid.monthLabels.map((m) => /* @__PURE__ */ import_react23.default.createElement("span", { key: m.col, className: "eg-gh-month", style: { left: m.col * 11 + "px" } }, m.label))), /* @__PURE__ */ import_react23.default.createElement("div", { className: "eg-gh-grid", role: "grid", "aria-label": rangeLabel + "学习热力图" }, grid.weeks.map((week, ci) => /* @__PURE__ */ import_react23.default.createElement("div", { className: "eg-gh-col", key: ci }, week.map((cell, ri) => {
    if (cell.out) {
      return /* @__PURE__ */ import_react23.default.createElement("span", { className: "eg-gh-cell out", key: ri, "aria-hidden": "true" });
    }
    const has = Boolean(cell.activity && cell.activity.total > 0);
    const cls = ["eg-gh-cell", "l" + cell.level];
    if (has) cls.push("has");
    if (cell.isToday) cls.push("today");
    return /* @__PURE__ */ import_react23.default.createElement(
      "button",
      {
        key: cell.key,
        type: "button",
        className: cls.join(" "),
        "aria-label": cell.activity ? cell.key + " 单词 " + cell.activity.words + " 句子 " + cell.activity.phrases : cell.key + " 无学习记录",
        onMouseEnter: (e) => showTip(e, cell),
        onMouseLeave: hideTip,
        onFocus: (e) => showTip(e, cell),
        onBlur: hideTip,
        onClick: has ? () => onSelectDay(cell.key) : void 0
      }
    );
  }))))))), /* @__PURE__ */ import_react23.default.createElement("div", { className: "eg-gh-foot" }, /* @__PURE__ */ import_react23.default.createElement("span", { className: "eg-gh-hint" }, "点击绿色方块定位当日记录"), /* @__PURE__ */ import_react23.default.createElement("div", { className: "eg-dash-legend" }, "少", /* @__PURE__ */ import_react23.default.createElement("i", { className: "l0" }), /* @__PURE__ */ import_react23.default.createElement("i", { className: "l1" }), /* @__PURE__ */ import_react23.default.createElement("i", { className: "l2" }), /* @__PURE__ */ import_react23.default.createElement("i", { className: "l3" }), /* @__PURE__ */ import_react23.default.createElement("i", { className: "l4" }), "多")), tip ? /* @__PURE__ */ import_react23.default.createElement("div", { className: "eg-gh-tip", role: "tooltip", style: { left: tip.x + "px", top: tip.y + "px" } }, tipText) : null);
}

// src/client/features/dashboard/DailyHistoryList.jsx
var import_react24 = __toESM(require("react"), 1);
var WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
var WORD_LIMIT = 5;
var PHRASE_LIMIT = 3;
function DailyHistoryList({
  pageRecords,
  totalFilteredCount,
  safePage,
  totalPages,
  pageItems,
  flashDay,
  histHeadRef,
  onGoPage
}) {
  const [expanded, setExpanded] = (0, import_react24.useState)({});
  const closeTimersRef = (0, import_react24.useRef)({});
  (0, import_react24.useEffect)(() => {
    return () => {
      const timers = closeTimersRef.current;
      for (const k of Object.keys(timers)) clearTimeout(timers[k]);
    };
  }, []);
  const toggleGroup = (key, extraCount = 0) => {
    const timers = closeTimersRef.current;
    if (timers[key]) {
      clearTimeout(timers[key]);
      delete timers[key];
    }
    if (expanded[key] === "open") {
      if (prefersReducedMotion()) {
        setExpanded((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        return;
      }
      setExpanded((prev) => ({ ...prev, [key]: "closing" }));
      const delay = Math.min(260, 150 + Math.min(extraCount, 8) * 14 + 20);
      timers[key] = setTimeout(() => {
        delete timers[key];
        setExpanded((prev) => {
          if (prev[key] !== "closing") return prev;
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }, delay);
    } else {
      setExpanded((prev) => ({ ...prev, [key]: "open" }));
    }
  };
  const renderWordChip = (w, key, animCls, animStyle) => /* @__PURE__ */ import_react24.default.createElement("span", { className: "eg-wchip " + (w.ok ? "ok" : "bad") + animCls, style: animStyle, key, title: w.ok ? "拼对了" : "没拼对" }, /* @__PURE__ */ import_react24.default.createElement("span", { className: "w" }, w.en), w.zh ? /* @__PURE__ */ import_react24.default.createElement("span", { className: "m" }, w.zh) : null);
  const renderPhraseRow = (p, key, animCls, animStyle) => /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-sent " + (p.ok ? "ok" : "bad") + animCls, style: animStyle, key }, /* @__PURE__ */ import_react24.default.createElement("span", { className: "mark" }, p.ok ? "✓" : "✗"), /* @__PURE__ */ import_react24.default.createElement("div", { className: "body" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "zh" }, p.zh), p.en ? /* @__PURE__ */ import_react24.default.createElement("div", { className: "en" }, p.en) : null));
  const renderMoreBtn = (key, total, limit, state) => total > limit ? /* @__PURE__ */ import_react24.default.createElement(
    "button",
    {
      className: "eg-more",
      key: "more",
      "aria-expanded": state === "open" ? "true" : "false",
      onClick: () => toggleGroup(key, total - limit)
    },
    state === "open" ? "收起" : "展开全部 · 共 " + total + " 条"
  ) : null;
  return /* @__PURE__ */ import_react24.default.createElement("div", null, /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-hist-bar", ref: histHeadRef }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-hist-title" }, "每日学习记录"), /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-hist-meta" }, "共 " + totalFilteredCount + " 天" + (totalPages > 1 ? " · 第 " + safePage + " / " + totalPages + " 页" : ""))), /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-hist" }, pageRecords.map((rec) => {
    const dt = /* @__PURE__ */ new Date(rec.day + "T00:00:00");
    const wd = WEEKDAYS[dt.getDay()];
    const t = rec.totals || {};
    const allWords = rec.words || [];
    const allPhrases = rec.phrases || [];
    const wKey = rec.day + ":w";
    const pKey = rec.day + ":p";
    const wState = expanded[wKey];
    const pState = expanded[pKey];
    const headWords = allWords.slice(0, WORD_LIMIT);
    const extraWords = allWords.slice(WORD_LIMIT);
    const headPhrases = allPhrases.slice(0, PHRASE_LIMIT);
    const extraPhrases = allPhrases.slice(PHRASE_LIMIT);
    return /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-hist-day" + (flashDay === rec.day ? " is-flash" : ""), id: "eg-hist-" + rec.day, key: rec.day }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-hist-head" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-hist-date" }, dt.getMonth() + 1 + "月" + dt.getDate() + "日", /* @__PURE__ */ import_react24.default.createElement("span", { className: "wd" }, "周" + wd)), /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-hist-count" }, "单词 " + (t.words || 0) + " · 句子 " + (t.phrases || 0))), allWords.length ? /* @__PURE__ */ import_react24.default.createElement("div", null, /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-hist-sub" }, "单词"), /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-wchips" }, headWords.map((w, i) => renderWordChip(w, "w" + i, "", void 0))), extraWords.length && (wState === "open" || wState === "closing") ? /* @__PURE__ */ import_react24.default.createElement(
      "div",
      {
        className: "eg-extra-collapse" + (wState === "open" ? " open" : ""),
        "aria-hidden": wState === "open" ? "false" : "true"
      },
      /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-extra-inner" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-wchips eg-extra-wchips" }, extraWords.map((w, idx) => {
        const animCls = wState === "open" ? " is-enter" : " is-leave";
        const animStyle = wState === "open" ? { "--i": Math.min(idx, 18) } : { "--ri": Math.min(extraWords.length - 1 - idx, 8) };
        return renderWordChip(w, "we" + idx, animCls, animStyle);
      })))
    ) : null, renderMoreBtn(wKey, allWords.length, WORD_LIMIT, wState)) : null, allPhrases.length ? /* @__PURE__ */ import_react24.default.createElement("div", null, /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-hist-sub" }, "句子"), /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-sents" }, headPhrases.map((p, i) => renderPhraseRow(p, "p" + i, "", void 0))), extraPhrases.length && (pState === "open" || pState === "closing") ? /* @__PURE__ */ import_react24.default.createElement(
      "div",
      {
        className: "eg-extra-collapse" + (pState === "open" ? " open" : ""),
        "aria-hidden": pState === "open" ? "false" : "true"
      },
      /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-extra-inner" }, /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-sents eg-extra-sents" }, extraPhrases.map((p, idx) => {
        const animCls = pState === "open" ? " is-enter" : " is-leave";
        const animStyle = pState === "open" ? { "--i": Math.min(idx, 12) } : { "--ri": Math.min(extraPhrases.length - 1 - idx, 8) };
        return renderPhraseRow(p, "pe" + idx, animCls, animStyle);
      })))
    ) : null, renderMoreBtn(pKey, allPhrases.length, PHRASE_LIMIT, pState)) : null);
  })), totalPages > 1 ? /* @__PURE__ */ import_react24.default.createElement("div", { className: "eg-pager", role: "navigation", "aria-label": "学习记录分页" }, /* @__PURE__ */ import_react24.default.createElement("button", { type: "button", className: "eg-pagebtn", disabled: safePage <= 1, onClick: () => onGoPage(safePage - 1) }, "‹ 上一页"), pageItems.map(
    (it, i) => it === "..." ? /* @__PURE__ */ import_react24.default.createElement("span", { className: "eg-page-dots", key: "dots-" + i }, "…") : /* @__PURE__ */ import_react24.default.createElement(
      "button",
      {
        type: "button",
        key: it,
        className: "eg-pagebtn" + (it === safePage ? " active" : ""),
        "aria-current": it === safePage ? "page" : void 0,
        onClick: () => onGoPage(it)
      },
      String(it)
    )
  ), /* @__PURE__ */ import_react24.default.createElement(
    "button",
    {
      type: "button",
      className: "eg-pagebtn",
      disabled: safePage >= totalPages,
      onClick: () => onGoPage(safePage + 1)
    },
    "下一页 ›"
  )) : null);
}

// src/client/features/dashboard/Dashboard.jsx
var PAGE_SIZE = 5;
var useIsoLayoutEffect5 = import_react25.default.useLayoutEffect || import_react25.useEffect;
var cachedDashboard = null;
function invalidateDashboardCache() {
  cachedDashboard = null;
}
function Dashboard() {
  const [data, setData] = (0, import_react25.useState)(() => cachedDashboard);
  const [loading, setLoading] = (0, import_react25.useState)(() => !cachedDashboard);
  const [error, setError] = (0, import_react25.useState)("");
  const [range, setRange] = (0, import_react25.useState)("last-year");
  const [page, setPage] = (0, import_react25.useState)(1);
  const [flashDay, setFlashDay] = (0, import_react25.useState)("");
  const flashTimerRef = (0, import_react25.useRef)(null);
  const pendingJumpRef = (0, import_react25.useRef)("");
  const histHeadRef = (0, import_react25.useRef)(null);
  (0, import_react25.useEffect)(() => {
    return () => clearTimeout(flashTimerRef.current);
  }, []);
  const load = (0, import_react25.useCallback)(async () => {
    if (!cachedDashboard) setLoading(true);
    setError("");
    try {
      const next = await api("/dashboard");
      cachedDashboard = next;
      setData(next);
    } catch (e) {
      setError(e.message || "看板加载失败");
    } finally {
      setLoading(false);
    }
  }, []);
  (0, import_react25.useEffect)(() => {
    load();
  }, [load]);
  const activity = (0, import_react25.useMemo)(() => {
    const map = {};
    if (data && Array.isArray(data.activity)) {
      for (const a of data.activity) map[a.day] = a;
    }
    return map;
  }, [data]);
  const today = data ? data.today : null;
  const streak = data ? data.streak || 0 : 0;
  const totals = data && data.totals ? data.totals : { days: 0, words: 0, phrases: 0 };
  const years = (0, import_react25.useMemo)(() => {
    const set = /* @__PURE__ */ new Set();
    const currentYear = (today || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)).slice(0, 4);
    if (/^\d{4}$/.test(currentYear)) set.add(currentYear);
    for (const key of Object.keys(activity)) {
      const y = key.slice(0, 4);
      if (/^\d{4}$/.test(y)) set.add(y);
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a)).slice(0, 4);
  }, [activity, today]);
  const grid = (0, import_react25.useMemo)(
    () => buildContributionGrid({ todayStr: today, range, activityMap: activity }),
    [today, range, activity]
  );
  const records = (0, import_react25.useMemo)(() => data && Array.isArray(data.days) ? data.days : [], [data]);
  const filteredRecords = (0, import_react25.useMemo)(
    () => records.filter((r) => {
      const day = String(r && r.day || "");
      return day >= grid.startKey && day <= grid.endKey;
    }),
    [records, grid.startKey, grid.endKey]
  );
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const pageRecords = (0, import_react25.useMemo)(
    () => filteredRecords.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredRecords, safePage]
  );
  const pageItems = (0, import_react25.useMemo)(() => getPageItems(totalPages, safePage), [totalPages, safePage]);
  useIsoLayoutEffect5(() => {
    setPage(1);
  }, [range, data]);
  const scrollAndFlash = (0, import_react25.useCallback)((day) => {
    try {
      const el = document.getElementById("eg-hist-" + day);
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "start", behavior: "smooth" });
    } catch {
    }
    setFlashDay("");
    clearTimeout(flashTimerRef.current);
    setTimeout(() => {
      setFlashDay(day);
      flashTimerRef.current = setTimeout(() => setFlashDay(""), 1200);
    }, 20);
  }, []);
  (0, import_react25.useEffect)(() => {
    const pendingDay = pendingJumpRef.current;
    if (!pendingDay) return;
    if (!pageRecords.some((r) => r.day === pendingDay)) return;
    pendingJumpRef.current = "";
    scrollAndFlash(pendingDay);
  }, [safePage, pageRecords, scrollAndFlash]);
  const jumpTo = (day) => {
    const idx = filteredRecords.findIndex((r) => r.day === day);
    if (idx < 0) return;
    const targetPage = Math.floor(idx / PAGE_SIZE) + 1;
    if (targetPage !== safePage) {
      pendingJumpRef.current = day;
      setPage(targetPage);
    } else {
      pendingJumpRef.current = "";
      scrollAndFlash(day);
    }
  };
  const goPage = (nextPage) => {
    const target = Math.max(1, Math.min(totalPages, nextPage));
    if (target === safePage) return;
    pendingJumpRef.current = "";
    setPage(target);
    try {
      if (histHeadRef.current && histHeadRef.current.scrollIntoView) {
        histHeadRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    } catch {
    }
  };
  if (loading && !data) {
    return /* @__PURE__ */ import_react25.default.createElement("div", { className: "eg-dash" }, /* @__PURE__ */ import_react25.default.createElement("div", { className: "eg-loading" }, /* @__PURE__ */ import_react25.default.createElement("span", { className: "eg-spin" }), "正在加载看板…"));
  }
  const rangeLabel = range === "last-year" ? "近一年" : range + " 年";
  return /* @__PURE__ */ import_react25.default.createElement("div", { className: "eg-dash" }, /* @__PURE__ */ import_react25.default.createElement("div", { className: "eg-dash-top" }, /* @__PURE__ */ import_react25.default.createElement("div", { className: "eg-dash-title" }, "学习看板"), /* @__PURE__ */ import_react25.default.createElement("div", { className: "eg-dash-ranges", role: "tablist", "aria-label": "统计范围" }, /* @__PURE__ */ import_react25.default.createElement(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": range === "last-year" ? "true" : "false",
      className: "eg-rangebtn" + (range === "last-year" ? " active" : ""),
      onClick: () => setRange("last-year")
    },
    "近一年"
  ), years.map((y) => /* @__PURE__ */ import_react25.default.createElement(
    "button",
    {
      key: y,
      type: "button",
      role: "tab",
      "aria-selected": range === y ? "true" : "false",
      className: "eg-rangebtn" + (range === y ? " active" : ""),
      onClick: () => setRange(y)
    },
    y
  )))), /* @__PURE__ */ import_react25.default.createElement("div", { className: "eg-dash-sum" }, /* @__PURE__ */ import_react25.default.createElement("div", { className: "eg-stat" }, /* @__PURE__ */ import_react25.default.createElement("b", null, streak), /* @__PURE__ */ import_react25.default.createElement("span", { title: "连续学习天数" }, "连续")), /* @__PURE__ */ import_react25.default.createElement("div", { className: "eg-stat" }, /* @__PURE__ */ import_react25.default.createElement("b", null, totals.words || 0), /* @__PURE__ */ import_react25.default.createElement("span", { title: "累计单词" }, "单词")), /* @__PURE__ */ import_react25.default.createElement("div", { className: "eg-stat" }, /* @__PURE__ */ import_react25.default.createElement("b", null, totals.phrases || 0), /* @__PURE__ */ import_react25.default.createElement("span", { title: "累计句子" }, "句子")), /* @__PURE__ */ import_react25.default.createElement("div", { className: "eg-stat" }, /* @__PURE__ */ import_react25.default.createElement("b", null, totals.days || 0), /* @__PURE__ */ import_react25.default.createElement("span", { title: "累计学习天数" }, "累计"))), /* @__PURE__ */ import_react25.default.createElement(ContributionCard, { range, rangeLabel, grid, onSelectDay: jumpTo }), error ? /* @__PURE__ */ import_react25.default.createElement("div", { className: "eg-dash-error" }, error) : null, filteredRecords.length ? /* @__PURE__ */ import_react25.default.createElement(
    DailyHistoryList,
    {
      pageRecords,
      totalFilteredCount: filteredRecords.length,
      safePage,
      totalPages,
      pageItems,
      flashDay,
      histHeadRef,
      onGoPage: goPage
    }
  ) : /* @__PURE__ */ import_react25.default.createElement("div", { className: "eg-dash-empty" }, loading ? "正在加载…" : records.length ? rangeLabel + "还没有详细学习记录。" : "还没有学习记录，去练几题吧。"));
}

// src/client/features/settings/SettingsPanel.jsx
var import_react33 = __toESM(require("react"), 1);

// src/client/features/word/WordBankImport.jsx
var import_react26 = __toESM(require("react"), 1);
function WordBankImport({ onClose, onImported }) {
  const [name, setName] = (0, import_react26.useState)("");
  const [filename, setFilename] = (0, import_react26.useState)("");
  const [content, setContent] = (0, import_react26.useState)("");
  const [preview, setPreview] = (0, import_react26.useState)(null);
  const [busy, setBusy] = (0, import_react26.useState)(false);
  const [error, setError] = (0, import_react26.useState)("");
  const [over, setOver] = (0, import_react26.useState)(false);
  const fileRef = (0, import_react26.useRef)(null);
  const readFile = (0, import_react26.useCallback)(async (file) => {
    if (!file) return;
    setError("");
    try {
      const buf = await file.arrayBuffer();
      let text = "";
      try {
        text = new TextDecoder("utf-8", { fatal: true }).decode(buf);
      } catch {
        text = new TextDecoder("gbk").decode(buf);
      }
      setContent(text);
      setFilename(file.name || "");
      setName((prev) => prev || String(file.name || "").replace(/\.[^.]+$/, "").slice(0, 60));
      setPreview(null);
    } catch (e) {
      setError("读取文件失败：" + (e.message || e));
    }
  }, []);
  const doPreview = (0, import_react26.useCallback)(async () => {
    if (!content.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      setPreview(await api("/wordbanks/preview", { method: "POST", body: JSON.stringify({ content, filename }) }));
    } catch (e) {
      setError(e.message || "解析失败");
    } finally {
      setBusy(false);
    }
  }, [content, filename, busy]);
  const doImport = (0, import_react26.useCallback)(async () => {
    if (!preview || !preview.valid || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await api("/wordbanks/import", { method: "POST", body: JSON.stringify({ name, filename, content }) });
      if (res.summary) store.setStats(res.summary);
      onImported(res);
    } catch (e) {
      setError(e.message || "导入失败");
    } finally {
      setBusy(false);
    }
  }, [preview, busy, name, filename, content, onImported]);
  const onDrop = (e) => {
    e.preventDefault();
    setOver(false);
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) readFile(file);
  };
  return /* @__PURE__ */ import_react26.default.createElement("div", { className: "eg-import", "data-nodrag": "true" }, /* @__PURE__ */ import_react26.default.createElement("div", { className: "eg-import-head" }, /* @__PURE__ */ import_react26.default.createElement("div", null, /* @__PURE__ */ import_react26.default.createElement("div", { className: "eg-import-title" }, "导入词库"), /* @__PURE__ */ import_react26.default.createElement("div", { className: "eg-import-sub" }, "CSV/TSV/TXT/JSON")), /* @__PURE__ */ import_react26.default.createElement("div", { className: "eg-import-actions" }, /* @__PURE__ */ import_react26.default.createElement(
    "button",
    {
      className: "eg-filebtn",
      onClick: () => {
        try {
          if (fileRef.current) fileRef.current.click();
        } catch {
        }
      }
    },
    filename ? "换文件" : "选择文件"
  ), /* @__PURE__ */ import_react26.default.createElement("button", { className: "eg-import-back", onClick: onClose }, "← 返回"))), /* @__PURE__ */ import_react26.default.createElement("div", { className: "eg-field" }, /* @__PURE__ */ import_react26.default.createElement("label", { htmlFor: "eg-bank-name" }, "词库名称"), /* @__PURE__ */ import_react26.default.createElement(
    "input",
    {
      id: "eg-bank-name",
      className: "eg-text",
      value: name,
      maxLength: 60,
      placeholder: "例如：CET-6 核心词",
      onChange: (e) => setName(e.target.value)
    }
  )), /* @__PURE__ */ import_react26.default.createElement(
    "div",
    {
      className: "eg-textarea-wrap" + (over ? " over" : ""),
      onDragEnter: (e) => {
        e.preventDefault();
        setOver(true);
      },
      onDragOver: (e) => {
        e.preventDefault();
        setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop
    },
    /* @__PURE__ */ import_react26.default.createElement(
      "textarea",
      {
        className: "eg-textarea",
        value: content,
        placeholder: "把 CSV / TSV / TXT / JSON 内容粘贴到这里，或把文件拖进来…",
        onChange: (e) => {
          setContent(e.target.value);
          setFilename("");
          setPreview(null);
        }
      }
    ),
    /* @__PURE__ */ import_react26.default.createElement(
      "input",
      {
        ref: fileRef,
        type: "file",
        accept: ".csv,.tsv,.txt,.json,text/csv,text/tab-separated-values,application/json",
        style: { display: "none" },
        onChange: (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) readFile(file);
          e.target.value = "";
        }
      }
    )
  ), /* @__PURE__ */ import_react26.default.createElement("div", { className: "eg-import-foot" }, /* @__PURE__ */ import_react26.default.createElement("button", { className: "eg-btn primary", onClick: doPreview, disabled: busy || !content.trim() }, busy ? "解析中…" : "解析预览"), /* @__PURE__ */ import_react26.default.createElement("button", { className: "eg-btn ghost", onClick: doImport, disabled: busy || !preview || !preview.valid }, preview && preview.valid ? "导入 " + preview.valid + " 条" : "导入")), error ? /* @__PURE__ */ import_react26.default.createElement("div", { className: "eg-err" }, error) : null, preview ? /* @__PURE__ */ import_react26.default.createElement("div", null, /* @__PURE__ */ import_react26.default.createElement("div", { className: "eg-preview" }, /* @__PURE__ */ import_react26.default.createElement("div", { className: "eg-preview-top" }, /* @__PURE__ */ import_react26.default.createElement("strong", null, "识别到 " + preview.valid + " 条"), /* @__PURE__ */ import_react26.default.createElement("span", null, String(preview.format || "").toUpperCase() + (preview.hasHeader ? " · 含表头" : "") + (preview.skippedCount ? " · 跳过 " + preview.skippedCount + " 行" : ""))), (preview.sample || []).map((item, i) => {
    const ph = item.uk || item.us ? [item.uk ? "英 /" + item.uk + "/" : "", item.us ? "美 /" + item.us + "/" : ""].filter(Boolean).join(" · ") : item.phonetic ? "/" + item.phonetic + "/" : "";
    return /* @__PURE__ */ import_react26.default.createElement("div", { className: "eg-preview-row", key: i }, /* @__PURE__ */ import_react26.default.createElement("span", { className: "w" }, item.word, ph ? /* @__PURE__ */ import_react26.default.createElement("span", { className: "ph" }, ph) : null), /* @__PURE__ */ import_react26.default.createElement("span", { className: "m" }, item.meaning), item.example ? /* @__PURE__ */ import_react26.default.createElement("span", { className: "ex" }, item.example) : null);
  })), preview.errors && preview.errors.length ? /* @__PURE__ */ import_react26.default.createElement("div", { className: "eg-preview-errors" }, preview.errors.map((e, i) => /* @__PURE__ */ import_react26.default.createElement("div", { className: "er", key: i }, "第 " + e.line + " 行：" + e.reason))) : null) : null);
}

// src/client/features/settings/useSettings.js
var import_react27 = require("react");
var cachedSettings = null;
var cachedBanks = null;
var FALLBACK_LEVELS = [
  { id: "A1", label: "A1", desc: "入门", detail: "约小学至初中水平 · 简短句式与日常基础词汇，适合零基础起步" },
  { id: "A2", label: "A2", desc: "基础", detail: "约初中至高中入门 · 常见生活话题与直白表达，轻松建立阅读语感" },
  { id: "B1", label: "B1", desc: "进阶", detail: "约高考 / 大学四级（CET-4）· 清晰自然的实用表达，日常与职场阅读主力" },
  { id: "B2", label: "B2", desc: "熟练", detail: "约大学六级（CET-6）/ 雅思 6.0–6.5 · 句式更丰富，流畅阅读技术博客与行业资讯" },
  { id: "C1", label: "C1", desc: "高级", detail: "约雅思 7.0–7.5 / 托福 95+ · 地道外刊文风，含精准词汇与复杂长难句" },
  { id: "C2", label: "C2", desc: "精通", detail: "约雅思 8.0+ / 母语外刊水准 · 细腻修辞、高阶词汇与深度评论风格" }
];
var FALLBACK_RETENTIONS = [
  { id: 0.85, label: "85%", desc: "轻松", detail: "复习间隔更长、每日复习负担最轻，适合长期泛背积累" },
  { id: 0.9, label: "90%", desc: "均衡", detail: "FSRS 官方推荐默认值，在记忆牢固度与复习量之间取得最佳平衡" },
  { id: 0.93, label: "93%", desc: "强化", detail: "复习频率适度提高、遗忘率更低，适合四六级 / 雅思 / 托福备考" },
  { id: 0.95, label: "95%", desc: "极致", detail: "高频巩固以维持极高记住率，适合考前冲刺（每日复习量明显增加）" }
];
var FALLBACK_REASONING_EFFORTS = [
  { id: "off", label: "关闭", desc: "极速", detail: "关闭思考过程，生成文章、出题与讲解响应最快（推荐）" },
  { id: "low", label: "低", desc: "轻量", detail: "少量思考，在保持较快响应的同时略微提升表达准确度" },
  { id: "medium", label: "中", desc: "均衡", detail: "适度思考，兼顾响应速度与句式、译文及讲解质量" },
  { id: "high", label: "高", desc: "深度", detail: "深度思考，表达更细腻严谨，但等待时间会明显变长" },
  { id: "auto", label: "跟随", desc: "默认", detail: "不覆盖思考强度，跟随 DSH 当前默认模型的思考设置" }
];
function shortBankName2(name) {
  return String(name || "").replace(/^内置\s*·\s*/, "");
}
function useSettings({ onTopicChange, onPhraseConfigChange, onReportConfigChange, onWordBankChange }) {
  const shared = useShared();
  const [data, setData] = (0, import_react27.useState)(() => cachedSettings);
  const [bankData, setBankData] = (0, import_react27.useState)(() => cachedBanks);
  const [bankNotice, setBankNotice] = (0, import_react27.useState)("");
  const [error, setError] = (0, import_react27.useState)("");
  const [loading, setLoading] = (0, import_react27.useState)(() => !cachedSettings);
  const queueRef = (0, import_react27.useRef)(Promise.resolve());
  const seqRef = (0, import_react27.useRef)(0);
  const lastConfirmedRef = (0, import_react27.useRef)(cachedSettings);
  const customTopicsRef = (0, import_react27.useRef)(
    cachedSettings && cachedSettings.settings && cachedSettings.settings.customTopics || []
  );
  const bankQueueRef = (0, import_react27.useRef)(Promise.resolve());
  const bankSeqRef = (0, import_react27.useRef)(0);
  const lastConfirmedBanksRef = (0, import_react27.useRef)(cachedBanks);
  const load = (0, import_react27.useCallback)(async () => {
    if (!cachedSettings) setLoading(true);
    try {
      const [settingsRes, banksRes] = await Promise.all([
        api("/settings"),
        api("/wordbanks").catch(() => null)
      ]);
      cachedSettings = settingsRes;
      lastConfirmedRef.current = settingsRes;
      customTopicsRef.current = settingsRes && settingsRes.settings && settingsRes.settings.customTopics || [];
      setData(settingsRes);
      store.setSettings(settingsRes.settings);
      if (banksRes && Array.isArray(banksRes.banks)) {
        cachedBanks = banksRes;
        lastConfirmedBanksRef.current = banksRes;
        setBankData(banksRes);
      }
      setError("");
    } catch (e) {
      setError(e.message || "设置加载失败");
    } finally {
      setLoading(false);
    }
  }, []);
  (0, import_react27.useEffect)(() => {
    load();
  }, [load]);
  const save = (0, import_react27.useCallback)(
    (patchOrBuilder, changeScope, optimisticOverride) => {
      const seq = ++seqRef.current;
      setError("");
      const optimisticPatch = optimisticOverride !== void 0 ? optimisticOverride : typeof patchOrBuilder === "function" ? null : patchOrBuilder;
      const scalarPatch = {};
      for (const key of ["confetti", "sessionLink", "bankLink", "bankRetries", "reportLevel", "topicId", "fsrsRetention", "reasoningEffort"]) {
        if (optimisticPatch && optimisticPatch[key] !== void 0) scalarPatch[key] = optimisticPatch[key];
      }
      const hasOptimisticTopics = Boolean(optimisticPatch && Array.isArray(optimisticPatch.customTopics));
      if (Object.keys(scalarPatch).length || hasOptimisticTopics) {
        if (Object.keys(scalarPatch).length) store.setSettings(scalarPatch);
        setData((prev) => {
          if (!prev || !prev.settings) return prev;
          const nextSettings = { ...prev.settings, ...scalarPatch };
          let nextDirections = prev.directions;
          if (hasOptimisticTopics) {
            nextSettings.customTopics = optimisticPatch.customTopics;
            const keepIds = new Set(optimisticPatch.customTopics.map((item) => item.id).filter(Boolean));
            if (Array.isArray(prev.directions)) {
              nextDirections = prev.directions.filter((item) => item.builtin !== false || keepIds.has(item.id));
            }
            if (nextDirections && !nextDirections.some((item) => item.id === nextSettings.topicId)) {
              nextSettings.topicId = "ai";
            }
            store.setSettings({ customTopics: nextSettings.customTopics, topicId: nextSettings.topicId });
          }
          const next = { ...prev, settings: nextSettings, directions: nextDirections };
          cachedSettings = next;
          return next;
        });
      }
      const task = queueRef.current.then(async () => {
        try {
          const baseSettings = lastConfirmedRef.current && lastConfirmedRef.current.settings || null;
          const patch = typeof patchOrBuilder === "function" ? patchOrBuilder(baseSettings) : patchOrBuilder;
          const result = await api("/settings", {
            method: "POST",
            body: JSON.stringify(patch)
          });
          lastConfirmedRef.current = result;
          customTopicsRef.current = result && result.settings && result.settings.customTopics || [];
          if (seq === seqRef.current) {
            cachedSettings = result;
            setData(result);
            store.setSettings(result.settings);
          }
          if (changeScope === true || changeScope === "topic") {
            if (typeof onTopicChange === "function") onTopicChange();
          } else if (changeScope === "phrase") {
            if (typeof onPhraseConfigChange === "function") onPhraseConfigChange();
          } else if (changeScope === "report") {
            if (typeof onReportConfigChange === "function") onReportConfigChange();
          }
          return true;
        } catch (e) {
          if (lastConfirmedRef.current && lastConfirmedRef.current.settings) {
            customTopicsRef.current = lastConfirmedRef.current.settings.customTopics || [];
          }
          if (seq === seqRef.current && lastConfirmedRef.current) {
            cachedSettings = lastConfirmedRef.current;
            setData(lastConfirmedRef.current);
            store.setSettings(lastConfirmedRef.current.settings);
          }
          setError(e.message || "设置保存失败");
          return false;
        }
      });
      queueRef.current = task.catch(() => false);
      return task;
    },
    [onTopicChange, onPhraseConfigChange, onReportConfigChange]
  );
  const settings = data ? data.settings : shared.settings;
  const directions = data ? data.directions : [];
  const levels = (data && Array.isArray(data.levels) && data.levels.length ? data.levels : FALLBACK_LEVELS).map((item) => {
    const fb = FALLBACK_LEVELS.find((f) => f.id === item.id);
    return item.detail || !fb ? item : { ...item, detail: fb.detail };
  });
  const retentions = (data && Array.isArray(data.retentions) && data.retentions.length ? data.retentions : FALLBACK_RETENTIONS).map((item) => {
    const fb = FALLBACK_RETENTIONS.find((f) => f.id === item.id);
    return item.detail || !fb ? item : { ...item, detail: fb.detail };
  });
  const reasoningEfforts = (data && Array.isArray(data.reasoningEfforts) && data.reasoningEfforts.length ? data.reasoningEfforts : FALLBACK_REASONING_EFFORTS).map((item) => {
    const fb = FALLBACK_REASONING_EFFORTS.find((f) => f.id === item.id);
    return item.detail || !fb ? item : { ...item, detail: fb.detail };
  });
  const customTopics = settings.customTopics || [];
  const activeId = settings.topicId;
  const activeLevel = settings.reportLevel || "B1";
  const activeRetention = Number.isFinite(Number(settings.fsrsRetention)) ? Number(settings.fsrsRetention) : 0.9;
  const activeReasoningEffort = settings.reasoningEffort || "off";
  const chooseDirection = (id) => {
    if (id === activeId) return;
    save({ topicId: id }, true);
  };
  const chooseReportLevel = (id) => {
    if (id === activeLevel) return;
    save({ reportLevel: id }, "report");
  };
  const chooseRetention = (value) => {
    if (value === activeRetention) return;
    save({ fsrsRetention: value }, false);
  };
  const chooseReasoningEffort = (value) => {
    if (!value || value === activeReasoningEffort) return;
    save({ reasoningEffort: value }, false);
  };
  const addCustom = (rawLabel) => {
    const label = String(rawLabel || "").trim();
    if (!label) return Promise.resolve(false);
    return save(
      (latest) => {
        const base = latest && Array.isArray(latest.customTopics) ? latest.customTopics : customTopicsRef.current;
        return { customTopics: base.concat({ label }) };
      },
      false,
      null
    );
  };
  const removeCustom = (id) => {
    const nextTopics = customTopicsRef.current.filter((item) => item.id !== id);
    customTopicsRef.current = nextTopics;
    save(
      (latest) => {
        const base = latest && Array.isArray(latest.customTopics) ? latest.customTopics : customTopicsRef.current;
        return { customTopics: base.filter((item) => item.id !== id) };
      },
      id === activeId,
      { customTopics: nextTopics }
    );
  };
  const setRetries = (value) => {
    const next = Math.max(0, Math.min(5, Number(value) || 0));
    if (next === settings.bankRetries) return;
    save({ bankRetries: next }, false);
  };
  const banks = bankData && Array.isArray(bankData.banks) ? bankData.banks : [];
  const activeBankId = bankData && bankData.active || "builtin";
  const builtinBanks = banks.filter((b) => b.builtin !== false);
  const customBanks = banks.filter((b) => b.builtin === false);
  const activeBankObj = banks.find((b) => b.id === activeBankId);
  const chooseBank = (id) => {
    if (!id || id === activeBankId) return void 0;
    const seq = ++bankSeqRef.current;
    setError("");
    setBankNotice("");
    setBankData((cur) => {
      if (!cur) return cur;
      const next = { ...cur, active: id };
      cachedBanks = next;
      return next;
    });
    const task = bankQueueRef.current.then(async () => {
      try {
        const res = await api("/wordbanks/active", { method: "POST", body: JSON.stringify({ id }) });
        const base = lastConfirmedBanksRef.current || cachedBanks;
        if (base) {
          lastConfirmedBanksRef.current = { ...base, active: res && res.active || id };
        }
        if (seq === bankSeqRef.current) {
          if (lastConfirmedBanksRef.current) {
            cachedBanks = lastConfirmedBanksRef.current;
            setBankData(lastConfirmedBanksRef.current);
          }
          if (res.summary) store.setStats(res.summary);
          if (typeof onWordBankChange === "function") onWordBankChange();
        }
      } catch (e) {
        if (seq === bankSeqRef.current) {
          const rollback = lastConfirmedBanksRef.current;
          if (rollback) {
            cachedBanks = rollback;
            setBankData(rollback);
          }
          setError(e.message || "切换词库失败");
        }
      }
    });
    bankQueueRef.current = task.catch(() => {
    });
    return task;
  };
  const removeBank = async (id) => {
    const wasActive = id === activeBankId;
    setError("");
    setBankNotice("");
    try {
      const res = await api("/wordbanks/delete", { method: "POST", body: JSON.stringify({ id }) });
      const next = { active: res.active, banks: Array.isArray(res.banks) ? res.banks : banks.filter((b) => b.id !== id) };
      cachedBanks = next;
      lastConfirmedBanksRef.current = next;
      setBankData(next);
      if (res.summary) store.setStats(res.summary);
      if (wasActive && typeof onWordBankChange === "function") onWordBankChange();
    } catch (e) {
      setError(e.message || "删除词库失败");
    }
  };
  const handleBankImported = async (res) => {
    setBankNotice("已导入「" + res.bank.name + "」" + res.bank.count + " 条");
    try {
      const banksRes = await api("/wordbanks");
      if (banksRes && Array.isArray(banksRes.banks)) {
        cachedBanks = banksRes;
        lastConfirmedBanksRef.current = banksRes;
        setBankData(banksRes);
      }
    } catch {
    }
    if (typeof onWordBankChange === "function") onWordBankChange();
  };
  return {
    data,
    loading,
    error,
    setError,
    settings,
    directions,
    levels,
    retentions,
    reasoningEfforts,
    customTopics,
    activeId,
    activeLevel,
    activeRetention,
    activeReasoningEffort,
    banks,
    activeBankId,
    builtinBanks,
    customBanks,
    activeBankObj,
    bankNotice,
    setBankNotice,
    save,
    chooseDirection,
    chooseReportLevel,
    chooseRetention,
    chooseReasoningEffort,
    addCustom,
    removeCustom,
    setRetries,
    chooseBank,
    removeBank,
    handleBankImported
  };
}

// src/client/features/settings/PracticePrefsSection.jsx
var import_react28 = __toESM(require("react"), 1);
function PracticePrefsSection({
  settings,
  reasoningEfforts,
  activeReasoningEffort,
  onSave,
  onSetRetries,
  onChooseReasoningEffort
}) {
  const effortOptions = Array.isArray(reasoningEfforts) ? reasoningEfforts : [];
  const selectableEfforts = effortOptions.filter((item) => item.id !== "off");
  const currentEffort = activeReasoningEffort || "off";
  const thinkingOn = currentEffort !== "off";
  const lastEnabledRef = (0, import_react28.useRef)("low");
  const [hoverEffort, setHoverEffort] = (0, import_react28.useState)(null);
  (0, import_react28.useEffect)(() => {
    if (currentEffort && currentEffort !== "off") {
      lastEnabledRef.current = currentEffort;
    }
  }, [currentEffort]);
  const activeEffortObj = selectableEfforts.find((item) => item.id === currentEffort) || selectableEfforts[0] || null;
  const shownEffortObj = (hoverEffort ? selectableEfforts.find((item) => item.id === hoverEffort) : null) || activeEffortObj;
  return /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-section" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-section-head" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-section-label" }, "练习偏好")), /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-card" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-row" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-head" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-info" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-title" }, "庆祝效果"), /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-desc" }, "答对时从四周喷射彩带。")), /* @__PURE__ */ import_react28.default.createElement(
    "button",
    {
      type: "button",
      className: "eg-switch",
      role: "switch",
      "aria-checked": settings.confetti ? "true" : "false",
      "aria-label": "彩带庆祝",
      onClick: () => onSave({ confetti: !settings.confetti }, false)
    }
  ))), /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-row" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-head" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-info" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-title" }, "深度思考"), /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-desc" }, "关闭后将跳过思考过程以大幅加快文章生成、出题与讲解速度；开启后可按需调节模型思考强度（仅对支持思考的模型生效）。")), /* @__PURE__ */ import_react28.default.createElement(
    "button",
    {
      type: "button",
      className: "eg-switch",
      role: "switch",
      "aria-checked": thinkingOn ? "true" : "false",
      "aria-label": "深度思考",
      onClick: () => onChooseReasoningEffort(thinkingOn ? "off" : lastEnabledRef.current || "low")
    }
  )), /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-collapse" + (thinkingOn ? " open" : ""), "aria-hidden": thinkingOn ? "false" : "true" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-collapse-inner" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-sub is-stack" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-effort-head" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-sub-title" }, "思考强度"), activeEffortObj ? /* @__PURE__ */ import_react28.default.createElement("span", { className: "eg-effort-badge" }, activeEffortObj.label + (activeEffortObj.desc ? " · " + activeEffortObj.desc : "")) : null), /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-effort-list", onMouseLeave: () => setHoverEffort(null) }, selectableEfforts.map((item) => {
    const isActive = item.id === currentEffort;
    return /* @__PURE__ */ import_react28.default.createElement(
      "button",
      {
        type: "button",
        key: item.id,
        className: "eg-effort-btn" + (isActive ? " active" : ""),
        "aria-pressed": isActive ? "true" : "false",
        tabIndex: thinkingOn ? void 0 : -1,
        title: item.label + (item.desc ? " · " + item.desc : ""),
        onMouseEnter: () => setHoverEffort(item.id),
        onFocus: () => setHoverEffort(item.id),
        onBlur: () => setHoverEffort((prev) => prev === item.id ? null : prev),
        onClick: () => onChooseReasoningEffort(item.id)
      },
      /* @__PURE__ */ import_react28.default.createElement("span", { className: "eg-effort-label" }, item.label),
      item.desc ? /* @__PURE__ */ import_react28.default.createElement("span", { className: "eg-effort-desc" }, item.desc) : null
    );
  })), shownEffortObj && shownEffortObj.detail ? /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-effort-detail" }, shownEffortObj.detail) : null)))), /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-row" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-head" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-info" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-title" }, "会话关联"), /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-desc" }, "开启后，短语训练会读取当前会话并截取部分对话内容作为翻译素材（自动过滤代码与过长文本），不再关注词库关联和内容方向；当前会话暂无可用内容时自动回退。")), /* @__PURE__ */ import_react28.default.createElement(
    "button",
    {
      type: "button",
      className: "eg-switch",
      role: "switch",
      "aria-checked": settings.sessionLink ? "true" : "false",
      "aria-label": "会话关联",
      onClick: () => onSave({ sessionLink: !settings.sessionLink }, "phrase")
    }
  ))), /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-row" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-head" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-info" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-title" }, "词库关联"), /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-desc" }, "开启后，短语出题和今日文章会从当前词库挑词，自然融入句子和文章（不硬塞）。")), /* @__PURE__ */ import_react28.default.createElement(
    "button",
    {
      type: "button",
      className: "eg-switch",
      role: "switch",
      "aria-checked": settings.bankLink ? "true" : "false",
      "aria-label": "词库关联",
      onClick: () => onSave({ bankLink: !settings.bankLink }, true)
    }
  )), settings.sessionLink ? /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-note" }, "已开启会话关联：短语训练优先按当前会话出题，词库关联仅用于今日文章或无可用会话时兜底。") : null, /* @__PURE__ */ import_react28.default.createElement(
    "div",
    {
      className: "eg-collapse" + (settings.bankLink ? " open" : ""),
      "aria-hidden": settings.bankLink ? "false" : "true"
    },
    /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-collapse-inner" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-sub" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-info" }, /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-sub-title" }, "重试次数"), /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-setting-desc" }, "生成的句子或文章没用到词库词时，再试几次（0–5）。")), /* @__PURE__ */ import_react28.default.createElement("div", { className: "eg-stepper" }, /* @__PURE__ */ import_react28.default.createElement(
      "button",
      {
        type: "button",
        className: "eg-stepbtn",
        "aria-label": "减少重试次数",
        tabIndex: settings.bankLink ? void 0 : -1,
        disabled: !settings.bankLink || settings.bankRetries <= 0,
        onClick: () => onSetRetries(settings.bankRetries - 1)
      },
      "−"
    ), /* @__PURE__ */ import_react28.default.createElement("span", { className: "eg-stepper-value" }, String(settings.bankRetries)), /* @__PURE__ */ import_react28.default.createElement(
      "button",
      {
        type: "button",
        className: "eg-stepbtn",
        "aria-label": "增加重试次数",
        tabIndex: settings.bankLink ? void 0 : -1,
        disabled: !settings.bankLink || settings.bankRetries >= 5,
        onClick: () => onSetRetries(settings.bankRetries + 1)
      },
      "+"
    ))))
  ))));
}

// src/client/features/settings/WordBankSection.jsx
var import_react29 = __toESM(require("react"), 1);
function WordBankSection({
  activeBankId,
  activeBankObj,
  builtinBanks,
  customBanks,
  bankNotice,
  onChooseBank,
  onRemoveBank,
  onStartImport
}) {
  return /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-setting-section" }, /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-section-head" }, /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-section-label" }, "单词词库"), activeBankObj ? /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-active-badge", title: "当前词库：" + activeBankObj.name }, /* @__PURE__ */ import_react29.default.createElement("span", null, shortBankName2(activeBankObj.name) + " · " + activeBankObj.count + " 词")) : null), /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-setting-card" }, /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-setting-row" }, /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-setting-desc eg-lead" }, "选择单词训练与词库关联使用的词库；记忆进度跨词库通用。"), builtinBanks.length ? /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-bank-list" }, builtinBanks.map((b) => /* @__PURE__ */ import_react29.default.createElement(
    "button",
    {
      type: "button",
      key: b.id,
      className: "eg-bank-item" + (b.id === activeBankId ? " active" : ""),
      "aria-pressed": b.id === activeBankId ? "true" : "false",
      title: b.name + "（" + b.count + " 词）",
      onClick: () => onChooseBank(b.id)
    },
    /* @__PURE__ */ import_react29.default.createElement("span", { className: "eg-bank-name" }, shortBankName2(b.name)),
    /* @__PURE__ */ import_react29.default.createElement("span", { className: "eg-bank-cnt" }, b.count + " 词")
  ))) : null), /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-setting-row" }, /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-custom-head" }, /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-sub-title" }, "自定义词库"), /* @__PURE__ */ import_react29.default.createElement("button", { type: "button", className: "eg-bankbtn", onClick: onStartImport }, "+ 导入词库")), /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-setting-desc" }, "支持导入 CSV / TSV / TXT / JSON 词表，导入后自动切换，不影响内置词库。"), bankNotice ? /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-notice eg-bank-notice" }, bankNotice) : null, customBanks.length ? /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-custom-chips" }, customBanks.map((b) => /* @__PURE__ */ import_react29.default.createElement("div", { className: "eg-custom-chip" + (b.id === activeBankId ? " active" : ""), key: b.id }, /* @__PURE__ */ import_react29.default.createElement(
    "button",
    {
      type: "button",
      className: "eg-custom-select",
      "aria-pressed": b.id === activeBankId ? "true" : "false",
      title: b.name + "（" + b.count + " 词）",
      onClick: () => onChooseBank(b.id)
    },
    b.name + "（" + b.count + "）"
  ), /* @__PURE__ */ import_react29.default.createElement(
    "button",
    {
      type: "button",
      className: "eg-custom-remove",
      title: "删除词库",
      "aria-label": "删除 " + b.name,
      onClick: () => onRemoveBank(b.id)
    },
    "×"
  )))) : null)));
}

// src/client/features/settings/ChoiceCardSection.jsx
var import_react30 = __toESM(require("react"), 1);
function ChoiceCardSection({
  title,
  badgePrefix,
  lead,
  listClassName,
  items,
  activeId,
  fallbackActiveItem,
  onSelect
}) {
  const [hoverId, setHoverId] = (0, import_react30.useState)(null);
  const activeItem = items.find((item) => item.id === activeId) || fallbackActiveItem;
  const shownItem = (hoverId !== null ? items.find((item) => item.id === hoverId) : null) || activeItem;
  return /* @__PURE__ */ import_react30.default.createElement("div", { className: "eg-setting-section" }, /* @__PURE__ */ import_react30.default.createElement("div", { className: "eg-section-head" }, /* @__PURE__ */ import_react30.default.createElement("div", { className: "eg-section-label" }, title), activeItem ? /* @__PURE__ */ import_react30.default.createElement(
    "div",
    {
      className: "eg-active-badge",
      title: badgePrefix + "：" + activeItem.label + (activeItem.desc ? " · " + activeItem.desc : "")
    },
    /* @__PURE__ */ import_react30.default.createElement("span", null, activeItem.label + (activeItem.desc ? " · " + activeItem.desc : ""))
  ) : null), /* @__PURE__ */ import_react30.default.createElement("div", { className: "eg-setting-card" }, /* @__PURE__ */ import_react30.default.createElement("div", { className: "eg-setting-row" }, /* @__PURE__ */ import_react30.default.createElement("div", { className: "eg-setting-desc eg-lead" }, lead), /* @__PURE__ */ import_react30.default.createElement("div", { className: listClassName, onMouseLeave: () => setHoverId(null) }, items.map((item) => /* @__PURE__ */ import_react30.default.createElement(
    "button",
    {
      type: "button",
      key: String(item.id),
      className: "eg-level" + (item.id === activeId ? " active" : ""),
      "aria-pressed": item.id === activeId ? "true" : "false",
      title: item.label + (item.desc ? " · " + item.desc : ""),
      onMouseEnter: () => setHoverId(item.id),
      onFocus: () => setHoverId(item.id),
      onBlur: () => setHoverId((prev) => prev === item.id ? null : prev),
      onClick: () => onSelect(item.id)
    },
    /* @__PURE__ */ import_react30.default.createElement("span", { className: "eg-level-code" }, item.label),
    item.desc ? /* @__PURE__ */ import_react30.default.createElement("span", { className: "eg-level-desc" }, item.desc) : null
  ))), shownItem && shownItem.detail ? /* @__PURE__ */ import_react30.default.createElement("div", { className: "eg-level-detail" }, /* @__PURE__ */ import_react30.default.createElement("strong", null, shownItem.label + (shownItem.desc ? " " + shownItem.desc : "")), /* @__PURE__ */ import_react30.default.createElement("span", null, shownItem.detail)) : null)));
}

// src/client/features/settings/DirectionSection.jsx
var import_react31 = __toESM(require("react"), 1);
function DirectionSection({
  sessionLink,
  activeId,
  activeDirection,
  builtinDirections,
  customDirections,
  customTopicsCount,
  onChooseDirection,
  onAddCustom,
  onRemoveCustom
}) {
  const [draft, setDraft] = (0, import_react31.useState)("");
  const [adding, setAdding] = (0, import_react31.useState)(false);
  const handleAdd = async () => {
    const label = draft.trim();
    if (!label || adding) return;
    setAdding(true);
    try {
      const ok = await onAddCustom(label);
      if (ok) setDraft("");
    } finally {
      setAdding(false);
    }
  };
  return /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-setting-section" }, /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-section-head" }, /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-section-label" }, "内容方向"), activeDirection ? /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-active-badge", title: "当前方向：" + activeDirection.label }, /* @__PURE__ */ import_react31.default.createElement("span", null, activeDirection.label)) : null), /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-setting-card" }, /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-setting-row" }, /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-setting-desc eg-lead" }, sessionLink ? "已开启会话关联，短语训练优先按当前会话出题；内容方向用于今日文章及无可用会话时兜底。" : "用于生成短语和今日文章；切换后下一题、下一篇生效。"), /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-direction-list" }, builtinDirections.map((item) => /* @__PURE__ */ import_react31.default.createElement(
    "button",
    {
      type: "button",
      key: item.id,
      className: "eg-direction" + (item.id === activeId ? " active" : ""),
      "aria-pressed": item.id === activeId ? "true" : "false",
      title: item.label,
      onClick: () => onChooseDirection(item.id)
    },
    item.label
  )))), /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-setting-row" }, /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-custom-head" }, /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-sub-title" }, "自定义方向"), /* @__PURE__ */ import_react31.default.createElement("span", { className: "eg-custom-count" }, customTopicsCount ? customTopicsCount + " / 40" : "最多 40 个")), /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-setting-desc" }, "添加你自己的主题，点击即可切换，与内置方向一样用于生成内容。"), customDirections.length ? /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-custom-chips" }, customDirections.map((item) => /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-custom-chip" + (item.id === activeId ? " active" : ""), key: item.id }, /* @__PURE__ */ import_react31.default.createElement(
    "button",
    {
      type: "button",
      className: "eg-custom-select",
      "aria-pressed": item.id === activeId ? "true" : "false",
      title: item.label,
      onClick: () => onChooseDirection(item.id)
    },
    item.label
  ), /* @__PURE__ */ import_react31.default.createElement(
    "button",
    {
      type: "button",
      className: "eg-custom-remove",
      title: "删除方向",
      "aria-label": "删除 " + item.label,
      onClick: () => onRemoveCustom(item.id)
    },
    "×"
  )))) : null, /* @__PURE__ */ import_react31.default.createElement("div", { className: "eg-addrow" }, /* @__PURE__ */ import_react31.default.createElement(
    "input",
    {
      className: "eg-text",
      value: draft,
      maxLength: 40,
      placeholder: "例如：摄影与视觉",
      "aria-label": "自定义方向名称",
      onChange: (e) => setDraft(e.target.value),
      onKeyDown: (e) => {
        if (e.key === "Enter") handleAdd();
      }
    }
  ), /* @__PURE__ */ import_react31.default.createElement("button", { type: "button", className: "eg-btn primary", disabled: adding || !draft.trim(), onClick: handleAdd }, "添加")))));
}

// src/client/features/settings/DataCleanupSection.jsx
var import_react32 = __toESM(require("react"), 1);
var CLEANUP_RANGES = [
  { id: "7d", label: "7 天前" },
  { id: "30d", label: "30 天前" },
  { id: "90d", label: "90 天前" },
  { id: "365d", label: "一年前" },
  { id: "all", label: "全部记录" }
];
function DataCleanupSection({ onDataCleared, onError }) {
  const [cleanRange, setCleanRange] = (0, import_react32.useState)("30d");
  const [clearMemory, setClearMemory] = (0, import_react32.useState)(false);
  const [cleanPreview, setCleanPreview] = (0, import_react32.useState)(null);
  const [cleanBusy, setCleanBusy] = (0, import_react32.useState)(false);
  const [cleanNotice, setCleanNotice] = (0, import_react32.useState)("");
  const startCleanupPreview = async () => {
    if (cleanBusy) return;
    setCleanBusy(true);
    onError("");
    setCleanNotice("");
    try {
      const preview = await api("/data/preview", {
        method: "POST",
        body: JSON.stringify({ range: cleanRange, clearMemory })
      });
      setCleanPreview(preview);
    } catch (e) {
      onError(e.message || "统计可清理数据失败");
    } finally {
      setCleanBusy(false);
    }
  };
  const confirmCleanup = async () => {
    if (cleanBusy) return;
    setCleanBusy(true);
    onError("");
    try {
      const res = await api("/data/clear", {
        method: "POST",
        body: JSON.stringify({ range: cleanRange, clearMemory })
      });
      if (res.summary) store.setStats(res.summary);
      setCleanPreview(null);
      const rm = res && res.removed || {};
      const parts = [];
      if (rm.recordDays) parts.push(rm.recordDays + " 天学习记录");
      if (rm.reports) parts.push(rm.reports + " 篇缓存文章");
      if (rm.memoryWords) parts.push(rm.memoryWords + " 个单词记忆进度");
      setCleanNotice(parts.length ? "已清理：" + parts.join("、") : "已清理完成");
      if (typeof onDataCleared === "function") onDataCleared({ range: cleanRange, clearMemory });
    } catch (e) {
      onError(e.message || "清理数据失败");
    } finally {
      setCleanBusy(false);
    }
  };
  const totalItems = cleanPreview ? (cleanPreview.recordDays || 0) + (cleanPreview.reports || 0) + (cleanPreview.memoryWords || 0) : 0;
  const rangeObj = cleanPreview ? CLEANUP_RANGES.find((r) => r.id === cleanPreview.range) : null;
  const summaryParts = [];
  if (cleanPreview) {
    if (cleanPreview.recordDays) summaryParts.push(cleanPreview.recordDays + " 天学习记录");
    if (cleanPreview.reports) summaryParts.push(cleanPreview.reports + " 篇缓存文章");
    if (cleanPreview.memoryWords) summaryParts.push(cleanPreview.memoryWords + " 个单词记忆进度");
  }
  return /* @__PURE__ */ import_react32.default.createElement("div", { className: "eg-setting-section" }, /* @__PURE__ */ import_react32.default.createElement("div", { className: "eg-section-head" }, /* @__PURE__ */ import_react32.default.createElement("div", { className: "eg-section-label" }, "数据管理")), /* @__PURE__ */ import_react32.default.createElement("div", { className: "eg-setting-card" }, /* @__PURE__ */ import_react32.default.createElement("div", { className: "eg-setting-row" }, /* @__PURE__ */ import_react32.default.createElement("div", { className: "eg-setting-desc eg-lead" }, "按时间清理历史学习记录与文章缓存；不会删除你的偏好设置和自定义词库。"), /* @__PURE__ */ import_react32.default.createElement("div", { className: "eg-clean-ranges" }, CLEANUP_RANGES.map((item) => /* @__PURE__ */ import_react32.default.createElement(
    "button",
    {
      type: "button",
      key: item.id,
      className: "eg-clean-range" + (item.id === cleanRange ? " active" : "") + (item.id === "all" ? " is-danger" : ""),
      "aria-pressed": item.id === cleanRange ? "true" : "false",
      disabled: cleanBusy,
      onClick: () => {
        setCleanRange(item.id);
        setCleanPreview(null);
        setCleanNotice("");
      }
    },
    item.label
  ))), /* @__PURE__ */ import_react32.default.createElement("div", { className: "eg-clean-foot" }, /* @__PURE__ */ import_react32.default.createElement("label", { className: "eg-clean-check" }, /* @__PURE__ */ import_react32.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: clearMemory,
      disabled: cleanBusy,
      onChange: (e) => {
        setClearMemory(e.target.checked);
        setCleanPreview(null);
        setCleanNotice("");
      }
    }
  ), /* @__PURE__ */ import_react32.default.createElement("span", null, "同时清除对应时间段内学习中的记忆进度（已掌握单词仅在「全部记录」时清除）")), !cleanPreview ? /* @__PURE__ */ import_react32.default.createElement("button", { type: "button", className: "eg-btn danger", disabled: cleanBusy, onClick: startCleanupPreview }, cleanBusy ? "统计中…" : "清理数据") : null), cleanPreview ? /* @__PURE__ */ import_react32.default.createElement("div", { className: "eg-clean-confirm" }, /* @__PURE__ */ import_react32.default.createElement("div", { className: "eg-clean-confirm-text" }, totalItems > 0 ? "将清除「" + (rangeObj ? rangeObj.label : cleanPreview.range) + "」范围内：" + summaryParts.join("、") + "，操作不可恢复。" : "所选范围内暂无可清理的学习记录或缓存文章。"), /* @__PURE__ */ import_react32.default.createElement("div", { className: "eg-clean-confirm-actions" }, /* @__PURE__ */ import_react32.default.createElement("button", { type: "button", className: "eg-btn", disabled: cleanBusy, onClick: () => setCleanPreview(null) }, "取消"), totalItems > 0 ? /* @__PURE__ */ import_react32.default.createElement("button", { type: "button", className: "eg-btn danger", disabled: cleanBusy, onClick: confirmCleanup }, cleanBusy ? "清理中…" : "确认清理") : null)) : null, cleanNotice ? /* @__PURE__ */ import_react32.default.createElement("div", { className: "eg-notice eg-clean-notice" }, cleanNotice) : null)));
}

// src/client/features/settings/SettingsPanel.jsx
function SettingsPanel({ onTopicChange, onPhraseConfigChange, onReportConfigChange, onWordBankChange, onDataCleared }) {
  const [importing, setImporting] = (0, import_react33.useState)(false);
  const {
    data,
    loading,
    error,
    setError,
    settings,
    directions,
    levels,
    retentions,
    reasoningEfforts,
    customTopics,
    activeId,
    activeLevel,
    activeRetention,
    activeReasoningEffort,
    activeBankId,
    builtinBanks,
    customBanks,
    activeBankObj,
    bankNotice,
    setBankNotice,
    save,
    chooseDirection,
    chooseReportLevel,
    chooseRetention,
    chooseReasoningEffort,
    addCustom,
    removeCustom,
    setRetries,
    chooseBank,
    removeBank,
    handleBankImported
  } = useSettings({ onTopicChange, onPhraseConfigChange, onReportConfigChange, onWordBankChange });
  if (loading && !data) {
    return /* @__PURE__ */ import_react33.default.createElement("div", { className: "eg-settings" }, /* @__PURE__ */ import_react33.default.createElement("div", { className: "eg-settings-loading" }, /* @__PURE__ */ import_react33.default.createElement("span", { className: "eg-spin" }), "正在加载设置…"), error ? /* @__PURE__ */ import_react33.default.createElement("div", { className: "eg-settings-error" }, error) : null);
  }
  if (importing) {
    return /* @__PURE__ */ import_react33.default.createElement(
      WordBankImport,
      {
        onClose: () => setImporting(false),
        onImported: (res) => {
          setImporting(false);
          return handleBankImported(res);
        }
      }
    );
  }
  const builtinDirections = directions.filter((item) => item.builtin !== false);
  const customDirections = directions.filter((item) => item.builtin === false);
  const activeDirection = directions.find((item) => item.id === activeId);
  const fallbackLevel = levels[2] || { id: activeLevel, label: activeLevel, desc: "", detail: "" };
  const fallbackRetention = retentions.find((item) => item.id === 0.9) || { id: activeRetention, label: Math.round(activeRetention * 100) + "%", desc: "自定义", detail: "目标记忆保留率越高，复习安排越紧密。" };
  return /* @__PURE__ */ import_react33.default.createElement("div", { className: "eg-settings" }, /* @__PURE__ */ import_react33.default.createElement(
    PracticePrefsSection,
    {
      settings,
      reasoningEfforts,
      activeReasoningEffort,
      onSave: save,
      onSetRetries: setRetries,
      onChooseReasoningEffort: chooseReasoningEffort
    }
  ), /* @__PURE__ */ import_react33.default.createElement(
    WordBankSection,
    {
      activeBankId,
      activeBankObj,
      builtinBanks,
      customBanks,
      bankNotice,
      onChooseBank: chooseBank,
      onRemoveBank: removeBank,
      onStartImport: () => {
        setBankNotice("");
        setImporting(true);
      }
    }
  ), /* @__PURE__ */ import_react33.default.createElement(
    ChoiceCardSection,
    {
      title: "记忆调度（FSRS）",
      badgePrefix: "目标记住率",
      lead: "设置单词训练的目标记忆保留率；数值越高，系统会在遗忘前更早安排复习（修改后对后续复习生效）。",
      listClassName: "eg-retention-list",
      items: retentions,
      activeId: activeRetention,
      fallbackActiveItem: fallbackRetention,
      onSelect: chooseRetention
    }
  ), /* @__PURE__ */ import_react33.default.createElement(
    ChoiceCardSection,
    {
      title: "文章难度",
      badgePrefix: "当前难度",
      lead: "控制今日文章的词汇与句式难度（CEFR）；切换后下次进入或换一篇生效。",
      listClassName: "eg-level-list",
      items: levels,
      activeId: activeLevel,
      fallbackActiveItem: fallbackLevel,
      onSelect: chooseReportLevel
    }
  ), /* @__PURE__ */ import_react33.default.createElement(
    DirectionSection,
    {
      sessionLink: settings.sessionLink,
      activeId,
      activeDirection,
      builtinDirections,
      customDirections,
      customTopicsCount: customTopics.length,
      onChooseDirection: chooseDirection,
      onAddCustom: addCustom,
      onRemoveCustom: removeCustom
    }
  ), /* @__PURE__ */ import_react33.default.createElement(DataCleanupSection, { onDataCleared, onError: setError }), error ? /* @__PURE__ */ import_react33.default.createElement("div", { className: "eg-settings-error" }, error) : null);
}

// src/client/shell/EnglishGymBoard.jsx
var useIsoLayoutEffect6 = import_react34.default.useLayoutEffect || import_react34.useEffect;
var TABS = [
  { id: "word", label: "单词训练" },
  { id: "drill", label: "短语训练" },
  { id: "report", label: "今日文章" },
  { id: "dashboard", label: "看板" },
  { id: "settings", label: "设置" }
];
function EnglishGymBoard() {
  useStyle();
  const shared = useShared();
  const [tab, setTab] = (0, import_react34.useState)("word");
  const open = shared.open;
  const [mounted, setMounted] = (0, import_react34.useState)(open);
  const [closing, setClosing] = (0, import_react34.useState)(false);
  const tabRefs = (0, import_react34.useRef)({});
  const bodyRef = (0, import_react34.useRef)(null);
  const [slider, setSlider] = (0, import_react34.useState)({ left: 0, width: 0, ready: false });
  const [confettiKey, setConfettiKey] = (0, import_react34.useState)(0);
  const [wordBankRev, setWordBankRev] = (0, import_react34.useState)(0);
  const lastBurstRef = (0, import_react34.useRef)(shared.burst || 0);
  const lastWordReqTickRef = (0, import_react34.useRef)(0);
  const settingsLoadedRef = (0, import_react34.useRef)(false);
  const {
    geom,
    onPanelDown,
    onPanelMove,
    onPanelUp,
    onResizeDown,
    onResizeMove,
    onResizeUp
  } = useBoardGeom(open);
  const drill = usePhraseDrill({ open, active: tab === "drill" });
  const dailyReport = useDailyReport({ open, active: tab === "report" });
  (0, import_react34.useEffect)(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return void 0;
    }
    if (!mounted) return void 0;
    if (prefersReducedMotion()) {
      setMounted(false);
      setClosing(false);
      return void 0;
    }
    setClosing(true);
    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, 145);
    return () => clearTimeout(timer);
  }, [open, mounted]);
  useIsoLayoutEffect6(() => {
    if (!mounted) return void 0;
    const measure = () => {
      const el = tabRefs.current && tabRefs.current[tab];
      if (!el) return;
      const pad = Math.min(5, Math.floor(el.offsetWidth * 0.16));
      const left = el.offsetLeft + pad;
      const width = Math.max(14, el.offsetWidth - pad * 2);
      setSlider((prev) => prev.ready && prev.left === left && prev.width === width ? prev : { left, width, ready: true });
    };
    measure();
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [tab, mounted, geom.w]);
  useIsoLayoutEffect6(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [tab]);
  (0, import_react34.useEffect)(() => {
    if (!open || settingsLoadedRef.current) return;
    settingsLoadedRef.current = true;
    api("/settings").then((result) => store.setSettings(result.settings)).catch(() => {
      settingsLoadedRef.current = false;
    });
  }, [open]);
  (0, import_react34.useEffect)(() => {
    const burst = shared.burst || 0;
    if (!burst || burst === lastBurstRef.current) return;
    lastBurstRef.current = burst;
    setConfettiKey(burst);
    const timer = setTimeout(() => setConfettiKey(0), 1400);
    return () => clearTimeout(timer);
  }, [shared.burst]);
  (0, import_react34.useEffect)(() => {
    const req = shared.wordModeRequest;
    if (!req || !req.tick || req.tick === lastWordReqTickRef.current) return;
    lastWordReqTickRef.current = req.tick;
    setTab("word");
  }, [shared.wordModeRequest]);
  (0, import_react34.useEffect)(() => {
    if (open || !store.stats) refreshStats();
  }, [open]);
  (0, import_react34.useEffect)(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !e.defaultPrevented) store.setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  if (!mounted) return null;
  return /* @__PURE__ */ import_react34.default.createElement(
    "div",
    {
      className: "eg-panel" + (closing ? " is-closing" : ""),
      role: "dialog",
      "aria-label": "English Gym",
      style: { left: geom.x, top: geom.y, width: geom.w, height: geom.h },
      onPointerDown: onPanelDown,
      onPointerMove: onPanelMove,
      onPointerUp: onPanelUp,
      onPointerCancel: onPanelUp
    },
    /* @__PURE__ */ import_react34.default.createElement("div", { className: "eg-head" }, /* @__PURE__ */ import_react34.default.createElement("span", { className: "eg-grip", "aria-hidden": "true" }, "⠿"), /* @__PURE__ */ import_react34.default.createElement("div", { className: "eg-tabs" + (slider.ready ? " has-slider" : "") }, TABS.map((t) => /* @__PURE__ */ import_react34.default.createElement(
      "button",
      {
        key: t.id,
        ref: (el) => {
          tabRefs.current[t.id] = el;
        },
        className: "eg-tab" + (tab === t.id ? " active" : ""),
        onClick: () => setTab(t.id)
      },
      t.label
    )), slider.ready ? /* @__PURE__ */ import_react34.default.createElement(
      "span",
      {
        className: "eg-tab-indicator",
        "aria-hidden": "true",
        style: { transform: "translateX(" + slider.left + "px)", width: slider.width + "px" }
      }
    ) : null), /* @__PURE__ */ import_react34.default.createElement("div", { className: "eg-head-right" }, /* @__PURE__ */ import_react34.default.createElement("button", { className: "eg-close", onClick: () => store.setOpen(false), title: "收起" }, "✕"))),
    /* @__PURE__ */ import_react34.default.createElement("div", { className: "eg-body", ref: bodyRef }, /* @__PURE__ */ import_react34.default.createElement("div", { className: "eg-view", key: tab }, tab === "drill" ? /* @__PURE__ */ import_react34.default.createElement("div", { className: "eg-drill" }, /* @__PURE__ */ import_react34.default.createElement(
      Drill,
      {
        key: drill.card ? drill.card.id : drill.feedback ? "fb" : "loading",
        card: drill.card,
        answer: drill.answer,
        setAnswer: drill.setAnswer,
        submittedAnswer: drill.submittedAnswer,
        feedback: drill.feedback,
        attempt: drill.attempt,
        prevScore: drill.prevScore,
        retryFocusTick: drill.retryFocusTick,
        busy: drill.busy,
        error: drill.error,
        onSubmit: drill.submit,
        onRetry: drill.retry,
        onNext: drill.next
      }
    )) : tab === "word" ? /* @__PURE__ */ import_react34.default.createElement(WordPractice, { key: "word", bankRev: wordBankRev }) : tab === "report" ? /* @__PURE__ */ import_react34.default.createElement(
      Report,
      {
        report: dailyReport.report,
        loading: dailyReport.loading,
        enriching: dailyReport.enriching,
        enrichError: dailyReport.enrichError,
        error: dailyReport.error,
        onRefresh: () => dailyReport.refresh(true),
        onRetryEnrich: dailyReport.retryEnrich
      }
    ) : tab === "dashboard" ? /* @__PURE__ */ import_react34.default.createElement(Dashboard, { key: "dashboard" }) : /* @__PURE__ */ import_react34.default.createElement(
      SettingsPanel,
      {
        onPhraseConfigChange: drill.reset,
        onReportConfigChange: dailyReport.invalidate,
        onWordBankChange: () => {
          setWordBankRev((n) => n + 1);
          drill.reset();
          dailyReport.invalidate();
        },
        onDataCleared: ({ range, clearMemory } = {}) => {
          invalidateDashboardCache();
          if (clearMemory || range === "all") setWordBankRev((n) => n + 1);
          if (range === "all") {
            drill.reset();
            dailyReport.invalidate();
          }
          refreshStats();
        },
        onTopicChange: () => {
          drill.reset();
          dailyReport.invalidate();
        }
      }
    ))),
    confettiKey ? /* @__PURE__ */ import_react34.default.createElement(Confetti, { key: confettiKey }) : null,
    /* @__PURE__ */ import_react34.default.createElement(
      "div",
      {
        className: "eg-resize",
        onPointerDown: onResizeDown,
        onPointerMove: onResizeMove,
        onPointerUp: onResizeUp,
        onPointerCancel: onResizeUp,
        title: "拖动缩放"
      }
    )
  );
}

// src/client/index.js
var inject = ["slots"];
function apply(ctx) {
  ctx.slots.inject(
    "conversation.composer.dock",
    () => ctx.slots.register(
      { name: "conversation.composer.dock", id: "dsh-english-gym.pill", order: 20 },
      EnglishGymPill
    )
  );
  ctx.slots.inject(
    "shell.overlay",
    () => ctx.slots.register(
      { name: "shell.overlay", id: "dsh-english-gym.board", order: 20 },
      EnglishGymBoard
    )
  );
}
    return module.exports;
  },
});
