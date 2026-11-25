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

// src/client/shell/EnglishGymPill.js
var import_react3 = __toESM(require("react"), 1);

// src/client/core/style.js
var import_react = require("react");

// src/client/styles/tokens.css
var tokens_default = '/* Hallmark · component: english-gym panel · genre: editorial · theme: in-place (dsh tokens) · states: 8 · contrast: pass · v3.0.0\n * critique: the drill is a study desk — crisp sans for Chinese & UI, Charter/Georgia for English reading, tactile micro-motion throughout.\n * waive: none\n */\n.eg-root, .eg-panel {\n  --eg-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;\n  --eg-en: "Charter", "Iowan Old Style", "Georgia", "Times New Roman", "PingFang SC", serif;\n  --eg-serif: var(--eg-en);\n  --eg-ink: var(--dsw-alias-label-primary, #1f2328);\n  --eg-ink-2: var(--dsw-alias-label-secondary, #5a6069);\n  --eg-bg: var(--dsw-alias-bg-layer-1, #ffffff);\n  --eg-bg-2: var(--dsw-alias-bg-layer-2, rgba(23, 26, 31, .045));\n  --eg-bg-3: color-mix(in srgb, var(--eg-ink) 8%, transparent);\n  --eg-line: var(--dsw-alias-border-l1, rgba(23, 26, 31, .12));\n  --eg-line-2: var(--dsw-alias-border-l2, rgba(23, 26, 31, .24));\n  --eg-accent: var(--dsw-alias-brand-primary, #2f6fed);\n  --eg-accent-ink: var(--eg-accent);\n  --eg-on-accent: #ffffff;\n  --eg-ok: var(--dsw-alias-state-success-primary, #1a7f37);\n  --eg-bad: var(--dsw-alias-state-error-primary, #cf222e);\n  --eg-warn: var(--dsw-alias-state-warn-primary, #bf8700);\n  --eg-warn-strong: var(--eg-warn);\n  --eg-hl-bg: color-mix(in srgb, #f5c518 28%, transparent);\n  --eg-hl-bg-active: color-mix(in srgb, #f5c518 46%, transparent);\n  --eg-hl-line: color-mix(in srgb, var(--eg-warn) 58%, transparent);\n  --eg-r: 16px;\n  --eg-r-sm: 10px;\n  --eg-shadow: 0 20px 56px rgba(17, 22, 31, .22), 0 2px 8px rgba(17, 22, 31, .08);\n  --eg-dur: .16s;\n  --eg-ease: cubic-bezier(.22, 1, .36, 1);\n  --eg-spring: cubic-bezier(.34, 1.45, .64, 1);\n  --eg-fs-xs: 12px; --eg-fs-sm: 13px; --eg-fs-md: 15px; --eg-fs-lg: 19px; --eg-fs-xl: 32px;\n  --eg-confetti-1: var(--eg-accent); --eg-confetti-2: var(--eg-bad); --eg-confetti-3: var(--eg-ok);\n  --eg-confetti-4: var(--eg-warn); --eg-confetti-5: #c9407e; --eg-confetti-6: #1b7c83;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.eg-root { font: var(--eg-fs-sm)/1.5 var(--eg-font); color: var(--eg-ink); }\n/* place the composer-strip pill at the far right of the dock row (after the context meter) */\n.eg-root.eg-entry { order: 999; flex: 0 0 auto; }\n.eg-root *, .eg-panel * { box-sizing: border-box; }\n\n';

// src/client/styles/shell.css
var shell_default = '/* ===== pill (composer strip) ===== */\n.eg-pill {\n  display: flex; align-items: center; gap: 9px; width: 100%;\n  padding: 7px 10px; background: transparent; border: none; border-radius: 10px;\n  color: var(--eg-ink-2); font-family: var(--eg-font); font-size: var(--eg-fs-sm); text-align: left; cursor: pointer;\n  transition: background var(--eg-dur) ease, transform .12s ease;\n}\n.eg-pill:hover { background: var(--eg-bg-2); }\n.eg-pill:active { transform: scale(.985); }\n.eg-pill:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-mono {\n  width: 22px; height: 22px; border-radius: 7px; flex: 0 0 auto;\n  background: var(--eg-accent); color: var(--eg-on-accent);\n  display: flex; align-items: center; justify-content: center;\n  font: 700 var(--eg-fs-xs)/1 var(--eg-font); letter-spacing: .02em;\n}\n.eg-wordmark { font-weight: 650; color: var(--eg-ink); letter-spacing: .01em; }\n.eg-streak { color: var(--eg-ink-2); font-variant-numeric: tabular-nums; }\n.eg-chip {\n  display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; height: 20px; border-radius: 999px;\n  background: var(--eg-bg-3); color: var(--eg-ink-2); font-size: 11.5px; font-weight: 600; font-variant-numeric: tabular-nums;\n}\n.eg-chip.warn {\n  background: color-mix(in srgb, var(--eg-warn) 14%, transparent);\n  border: 1px solid color-mix(in srgb, var(--eg-warn) 32%, transparent);\n  color: var(--eg-warn);\n}\n.eg-chev { margin-left: auto; opacity: .7; font-size: var(--eg-fs-xs); transition: transform .2s var(--eg-ease); }\n.eg-pill[aria-expanded="true"] .eg-chev { transform: rotate(90deg); }\n\n/* ===== panel ===== */\n.eg-panel {\n  position: fixed; z-index: 2147483000; pointer-events: auto;\n  -webkit-app-region: no-drag; app-region: no-drag;\n  display: flex; flex-direction: column;\n  background: var(--eg-bg); border: 1px solid var(--eg-line); border-radius: var(--eg-r);\n  box-shadow: var(--eg-shadow); overflow: hidden;\n  font: var(--eg-fs-sm)/1.5 var(--eg-font); color: var(--eg-ink);\n  transform-origin: bottom center; animation: eg-pop .2s var(--eg-ease) both;\n}\n.eg-panel.is-closing {\n  animation: eg-pop-out .14s cubic-bezier(.4, 0, 1, 1) forwards;\n  pointer-events: none;\n}\n@keyframes eg-pop { from { opacity: 0; transform: scale(.95) translateY(8px); } to { opacity: 1; transform: none; } }\n@keyframes eg-pop-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: scale(.96) translateY(6px); } }\n.eg-head {\n  display: flex; align-items: center; gap: 5px; padding: 9px 8px 9px 10px;\n  border-bottom: 1px solid var(--eg-line); flex: 0 0 auto; cursor: move; user-select: none; touch-action: none;\n  background: var(--eg-bg); position: relative;\n}\n.eg-grip { color: var(--eg-ink-2); opacity: .7; font-size: var(--eg-fs-xs); letter-spacing: -2px; cursor: grab; width: 10px; flex: 0 0 auto; transition: opacity var(--eg-dur) ease; }\n.eg-head:hover .eg-grip { opacity: 1; }\n.eg-tabs { position: relative; display: flex; flex-wrap: nowrap; align-items: center; gap: 0; margin-left: 0; min-width: 0; flex: 0 1 auto; }\n.eg-tab {\n  position: relative; padding: 5px 5px; border: none; background: transparent; cursor: pointer; white-space: nowrap;\n  color: var(--eg-ink-2); font: 600 var(--eg-fs-xs)/1.2 var(--eg-font); border-radius: 7px;\n  transition: color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-tab:hover { color: var(--eg-ink); background: var(--eg-bg-2); }\n.eg-tab:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-tab.active { color: var(--eg-ink); }\n.eg-tabs:not(.has-slider) .eg-tab.active::after {\n  content: ""; position: absolute; left: 5px; right: 5px; bottom: -10px; height: 2px; border-radius: 2px; background: var(--eg-accent);\n}\n.eg-tab-indicator {\n  position: absolute; left: 0; bottom: -10px; height: 2px; border-radius: 2px;\n  background: var(--eg-accent); pointer-events: none;\n  transition: transform .24s var(--eg-ease), width .24s var(--eg-ease), opacity .16s ease;\n  will-change: transform, width;\n}\n.eg-head-right { margin-left: auto; display: flex; align-items: center; gap: 6px; }\n.eg-close { appearance: none; -webkit-appearance: none;\n  border: none; background: transparent; color: var(--eg-ink-2); cursor: pointer;\n  width: 26px; height: 26px; border-radius: 7px; font-size: 14px; line-height: 1; display: flex; align-items: center; justify-content: center;\n  transition: background var(--eg-dur) ease, color var(--eg-dur) ease, transform .14s ease;\n}\n.eg-close:hover { background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-close:active { transform: scale(.9); }\n.eg-close:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-body { padding: 20px 22px 0; overflow-y: auto; flex: 1 1 auto; display: flex; flex-direction: column; }\n.eg-body:has(> .eg-view > .eg-word),\n.eg-body:has(.eg-fb.is-phrase) {\n  overflow-y: hidden;\n}\n.eg-body > * { width: 100%; max-width: 640px; margin-left: auto; margin-right: auto; }\n\n/* ===== shared motion primitives ===== */\n.eg-view {\n  width: 100%; max-width: 640px; margin-left: auto; margin-right: auto;\n  display: flex; flex-direction: column; flex: 1 0 auto; padding-bottom: 24px;\n}\n.eg-view > * {\n  animation: eg-view-in .18s var(--eg-ease) both;\n}\n.eg-view:has(> .eg-word),\n.eg-view:has(.eg-fb.is-phrase) {\n  flex: 1 1 0; min-height: 0;\n}\n.eg-stage-in { animation: eg-stage-in .22s var(--eg-ease) both; }\n@keyframes eg-view-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n@keyframes eg-stage-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }\n.eg-collapse {\n  display: grid; grid-template-rows: 0fr; opacity: 0;\n  transition: grid-template-rows .24s var(--eg-ease), opacity .2s ease;\n}\n.eg-collapse.open { grid-template-rows: 1fr; opacity: 1; }\n.eg-collapse-inner { overflow: hidden; min-height: 0; }\n\n/* ===== misc ===== */\n.eg-loading { display: flex; align-items: center; gap: 9px; color: var(--eg-ink-2); padding: 10px 0; font-size: var(--eg-fs-sm); }\n.eg-loading.is-stage {\n  flex: 1 1 auto; width: 100%; min-height: 180px;\n  flex-direction: column; justify-content: center; gap: 14px;\n  padding: 0 0 14px; text-align: center;\n  font-size: 14px; font-weight: 500; color: var(--eg-ink-2);\n}\n.eg-spin { display: inline-block; width: 15px; height: 15px; border: 2px solid var(--eg-line-2); border-top-color: var(--eg-accent); border-radius: 50%; animation: eg-spin .7s linear infinite; }\n.eg-loading.is-stage .eg-spin { width: 28px; height: 28px; border-width: 2.5px; }\n@keyframes eg-spin { to { transform: rotate(360deg); } }\n.eg-resize { position: absolute; right: 0; bottom: 0; width: 18px; height: 18px; cursor: nwse-resize; touch-action: none; }\n.eg-resize::after { content: ""; position: absolute; right: 4px; bottom: 4px; width: 9px; height: 9px; border-right: 2px solid var(--eg-line-2); border-bottom: 2px solid var(--eg-line-2); border-bottom-right-radius: 3px; opacity: .7; transition: opacity var(--eg-dur) ease; }\n.eg-resize:hover::after { opacity: 1; }\n\n';

// src/client/styles/phrase.css
var phrase_default = '/* ===== drill ===== */\n.eg-cap { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); font-weight: 600; letter-spacing: .02em; }\n.eg-zh {\n  margin-top: 14px; font-family: var(--eg-font); font-size: 18px; line-height: 1.6; font-weight: 650;\n  letter-spacing: -.005em; color: var(--eg-ink); overflow-wrap: break-word;\n}\n.eg-hintbtn { appearance: none; -webkit-appearance: none;\n  margin-top: 14px; display: inline-flex; align-items: center; gap: 6px; min-height: 30px; padding: 5px 11px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg); border-radius: 999px;\n  color: var(--eg-ink-2); font: 600 var(--eg-fs-xs)/1 var(--eg-font); cursor: pointer;\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-hintbtn:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-hintbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-hintbtn .caret { display: inline-block; transition: transform .22s var(--eg-ease); }\n.eg-hintbtn[aria-expanded="true"] .caret { transform: rotate(90deg); }\n.eg-hint-collapse { width: 100%; }\n.eg-hintbox {\n  max-width: 520px; margin: 10px auto 0; padding: 2px 8px;\n  color: var(--eg-ink-2); font-family: var(--eg-en); font-size: var(--eg-fs-sm); line-height: 1.6;\n  text-align: center; overflow-wrap: break-word;\n}\n.eg-inputwrap { position: relative; margin-top: 22px; }\n.eg-input {\n  --eg-line-h: 40px;\n  --eg-rule-color: var(--eg-line-2);\n  display: block;\n  width: 100%;\n  height: var(--eg-line-h);\n  min-height: var(--eg-line-h);\n  resize: none;\n  overflow: hidden;\n  padding: 0 4px;\n  border: none;\n  border-radius: 0;\n  background-color: transparent;\n  background-image: repeating-linear-gradient(\n    to bottom,\n    transparent 0,\n    transparent calc(var(--eg-line-h) - 1.5px),\n    var(--eg-rule-color) calc(var(--eg-line-h) - 1.5px),\n    var(--eg-rule-color) var(--eg-line-h)\n  );\n  background-size: 100% var(--eg-line-h);\n  background-position: 0 0;\n  background-attachment: local;\n  color: var(--eg-ink);\n  font: 400 16px/var(--eg-line-h) var(--eg-font);\n  outline: none;\n  transition: color var(--eg-dur) ease;\n}\n.eg-input::placeholder { color: var(--eg-ink-2); opacity: .68; }\n.eg-input:hover { --eg-rule-color: var(--eg-ink-2); }\n.eg-input:focus { --eg-rule-color: var(--eg-accent); background-color: transparent; box-shadow: none; }\n.eg-input.error { --eg-rule-color: var(--eg-bad); box-shadow: none; }\n.eg-foot { display: flex; align-items: center; gap: 10px; margin-top: 16px; }\n.eg-foot .eg-kbd { margin-left: auto; }\n.eg-err { color: var(--eg-bad); font-size: var(--eg-fs-xs); margin-top: 8px; }\n.eg-kbd { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); white-space: nowrap; }\n.eg-kbd kbd {\n  font: 600 11.5px/1 var(--eg-font); padding: 2px 5px; border: 1px solid var(--eg-line); border-bottom-width: 2px;\n  border-radius: 4px; background: var(--eg-bg); color: var(--eg-ink-2);\n}\n.eg-actions { display: flex; gap: 8px; margin-top: 16px; }\n.eg-btn {\n  display: inline-flex; align-items: center; justify-content: center; gap: 6px;\n  min-height: 36px; min-width: 76px; padding: 0 15px; border-radius: var(--eg-r-sm); cursor: pointer;\n  appearance: none; -webkit-appearance: none;\n  font: 600 var(--eg-fs-sm)/1 var(--eg-font);\n  transition: background var(--eg-dur) ease, filter var(--eg-dur) ease, border-color var(--eg-dur) ease, transform .26s var(--eg-spring);\n  border: 1px solid var(--eg-line-2); background: var(--eg-bg); color: var(--eg-ink);\n}\n.eg-btn:hover { background: var(--eg-bg-2); }\n.eg-btn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-btn:active { transform: scale(.94); transition-duration: .06s; }\n.eg-btn.is-bouncing { animation: eg-btn-bounce .34s var(--eg-spring); }\n@keyframes eg-btn-bounce {\n  0% { transform: scale(.93); }\n  55% { transform: scale(1.04); }\n  100% { transform: scale(1); }\n}\n.eg-btn.primary { border-color: transparent; background: var(--eg-accent); color: var(--eg-on-accent); }\n.eg-btn.primary:hover { filter: brightness(1.08); }\n.eg-btn:disabled { opacity: .48; cursor: not-allowed; pointer-events: none; }\n.eg-btn.primary:disabled { background: var(--eg-accent); color: var(--eg-on-accent); border-color: transparent; }\n.eg-btn:not(.primary):disabled { background: var(--eg-bg-2); color: var(--eg-ink-2); border-color: var(--eg-line); }\n.eg-btn.primary.is-loading { color: transparent; position: relative; }\n.eg-btn.primary.is-loading::after {\n  content: ""; position: absolute; width: 15px; height: 15px; border-radius: 50%;\n  border: 2px solid rgba(255, 255, 255, .45); border-top-color: #fff; animation: eg-spin .7s linear infinite;\n}\n.eg-btn.ghost { border-color: transparent; background: transparent; color: var(--eg-ink-2); padding: 0 10px; }\n.eg-btn.ghost:hover { background: var(--eg-bg-2); color: var(--eg-ink); }\n\n/* ===== confetti ===== */\n.eg-confetti { position: absolute; inset: 0; z-index: 6; pointer-events: none; overflow: hidden; border-radius: inherit; }\n.eg-confetti-piece {\n  position: absolute; display: block; border-radius: 1.5px; opacity: 0;\n  transform: translate(-50%, -50%) rotate(var(--r0, 0deg));\n  animation: eg-confetti-fly var(--dur, 900ms) cubic-bezier(.15, .7, .3, 1) var(--delay, 0ms) forwards;\n  will-change: transform, opacity;\n}\n@keyframes eg-confetti-fly {\n  0%   { opacity: 1; transform: translate(-50%, -50%) rotate(var(--r0, 0deg)) scale(.65); }\n  18%  { opacity: 1; }\n  100% { opacity: 0; transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, 0px))) rotate(calc(var(--r0, 0deg) + var(--rot, 360deg))) scale(1); }\n}\n\n/* ===== feedback ===== */\n.eg-fb {\n  --eg-tone: var(--eg-line-2);\n  margin-top: 8px; padding: 18px 20px; border: 1px solid var(--eg-line);\n  border-top: 3px solid var(--eg-line); border-radius: 12px; background: var(--eg-bg);\n  text-align: left; animation: eg-stage-in .24s var(--eg-ease) both;\n}\n.eg-fb.ok { --eg-tone: var(--eg-ok); border-top-color: var(--eg-ok); }\n.eg-fb.warn { --eg-tone: var(--eg-warn); border-top-color: var(--eg-warn); }\n.eg-fb.bad { --eg-tone: var(--eg-bad); border-top-color: var(--eg-bad); }\n.eg-fb-top { display: flex; align-items: baseline; gap: 10px; }\n.eg-score { font: 700 var(--eg-fs-xl)/1 var(--eg-font); font-variant-numeric: tabular-nums; letter-spacing: -.02em; color: var(--eg-tone); }\n.eg-score small { font-size: var(--eg-fs-xs); font-weight: 700; opacity: .9; color: inherit; margin-left: 2px; }\n.eg-fb-status { font-weight: 700; font-size: 16px; color: var(--eg-tone); line-height: 1.25; }\n.eg-fb-ref {\n  margin-top: 14px; padding: 12px 14px; border-radius: 10px; background: var(--eg-bg-2);\n  font-family: var(--eg-en); font-size: 17px; line-height: 1.65; color: var(--eg-ink); overflow-wrap: break-word;\n  animation: eg-view-in .24s var(--eg-ease) .05s both;\n}\n.eg-fb-ref .lbl { display: block; font: 600 11.5px/1 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em; margin-bottom: 6px; }\n.eg-fb-tip {\n  margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.65;\n  display: flex; gap: 8px; align-items: flex-start;\n  animation: eg-view-in .24s var(--eg-ease) .1s both;\n}\n.eg-fb-tip .b {\n  padding: 2px 7px; border-radius: 6px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  color: var(--eg-ink); font-size: 11px; font-weight: 650; line-height: 1.3;\n  white-space: nowrap; flex: 0 0 auto; margin-top: 2px;\n}\n.eg-fb-actions { margin-top: 16px; display: flex; gap: 10px; animation: eg-view-in .24s var(--eg-ease) .14s both; }\n\n/* phrase feedback card (editorial study-desk breakdown) */\n.eg-fb.is-phrase {\n  container-type: inline-size;\n  display: flex; flex-direction: column;\n  flex: 0 1 auto; min-height: 0; max-height: 100%;\n  margin-top: 0; padding: 0; border-radius: 14px; overflow: hidden;\n  border: 1px solid color-mix(in srgb, var(--eg-tone) 24%, var(--eg-line));\n  border-top: 1px solid color-mix(in srgb, var(--eg-tone) 24%, var(--eg-line));\n  background: var(--eg-bg);\n  box-shadow: 0 4px 18px color-mix(in srgb, var(--eg-tone) 6%, rgba(17, 22, 31, .05));\n}\n.eg-fb-hero {\n  flex: 0 0 auto;\n  display: flex; align-items: center; gap: 12px; padding: 12px 16px;\n  background: linear-gradient(135deg, color-mix(in srgb, var(--eg-tone) 11%, var(--eg-bg)) 0%, color-mix(in srgb, var(--eg-tone) 2.5%, var(--eg-bg)) 100%);\n  border-bottom: 1px solid color-mix(in srgb, var(--eg-tone) 16%, var(--eg-line));\n}\n.eg-ring {\n  position: relative; width: 50px; height: 50px; flex: 0 0 auto;\n  display: flex; align-items: center; justify-content: center;\n}\n.eg-ring svg { width: 50px; height: 50px; display: block; }\n.eg-ring-track { fill: var(--eg-bg); stroke: color-mix(in srgb, var(--eg-tone) 16%, var(--eg-line)); stroke-width: 3.8; }\n.eg-ring-arc {\n  fill: none; stroke: var(--eg-tone); stroke-width: 3.8; stroke-linecap: round;\n  transform: rotate(-90deg); transform-origin: 50% 50%;\n  transition: stroke-dashoffset .55s var(--eg-ease);\n}\n.eg-ring-val {\n  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;\n  color: var(--eg-tone); font-variant-numeric: tabular-nums; pointer-events: none;\n}\n.eg-ring-val strong { font: 750 16px/1 var(--eg-font); letter-spacing: -.03em; }\n.eg-ring-val small { font: 650 9px/1 var(--eg-font); opacity: .78; margin-top: 2px; }\n.eg-fb-verdict { min-width: 0; flex: 1 1 auto; }\n.eg-fb-headline { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; }\n.eg-fb-pill {\n  display: inline-flex; align-items: center; gap: 3px;\n  padding: 2px 8px; border-radius: 999px;\n  background: var(--eg-bg); border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font: 600 11px/1.35 var(--eg-font); font-variant-numeric: tabular-nums;\n}\n.eg-fb-pill.tone {\n  background: color-mix(in srgb, var(--eg-tone) 12%, var(--eg-bg));\n  border-color: color-mix(in srgb, var(--eg-tone) 28%, transparent);\n  color: var(--eg-tone);\n}\n.eg-fb-pill.up {\n  background: color-mix(in srgb, var(--eg-ok) 12%, var(--eg-bg));\n  border-color: color-mix(in srgb, var(--eg-ok) 28%, transparent);\n  color: var(--eg-ok);\n}\n.eg-fb-sub { margin-top: 3px; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.45; }\n.eg-fb-body {\n  flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain;\n  padding: 12px 16px 14px; display: flex; flex-direction: column; gap: 9px;\n}\n.eg-fb-prompt {\n  display: flex; align-items: baseline; gap: 9px;\n  padding-bottom: 9px; border-bottom: 1px dashed var(--eg-line);\n}\n.eg-fb-tag {\n  flex: 0 0 auto; padding: 2px 7px; border-radius: 5px;\n  background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font: 650 11px/1.35 var(--eg-font); letter-spacing: .02em;\n}\n.eg-fb-zh { font-size: 14px; font-weight: 600; color: var(--eg-ink); line-height: 1.55; overflow-wrap: break-word; min-width: 0; }\n.eg-fb-boxhead { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 5px; flex-wrap: wrap; }\n.eg-fb-boxhead-left { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; min-width: 0; }\n.eg-fb.is-phrase .lbl {\n  display: inline-flex; align-items: center; gap: 5px; margin-bottom: 0;\n  font: 650 11.5px/1.2 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em;\n}\n.eg-fb-mine {\n  padding: 9px 12px; border-radius: 10px;\n  border: 1px solid color-mix(in srgb, var(--eg-tone) 22%, var(--eg-line));\n  border-left: 3px solid var(--eg-tone);\n  background: color-mix(in srgb, var(--eg-tone) 4%, var(--eg-bg));\n  animation: eg-view-in .22s var(--eg-ease) .03s both;\n}\n.eg-fb-mine .lbl { color: var(--eg-tone); }\n.eg-fb-mine-text { font-family: var(--eg-en); font-size: 14.5px; line-height: 1.55; color: var(--eg-ink); overflow-wrap: break-word; }\n.eg-fb-mine-text.empty { font-family: var(--eg-font); font-size: var(--eg-fs-sm); color: var(--eg-ink-2); font-style: italic; }\n.eg-fb.is-phrase .eg-fb-ref {\n  margin-top: 0; padding: 10px 13px; border-radius: 10px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg-2);\n  font-family: var(--eg-font); font-size: var(--eg-fs-sm); line-height: 1.5;\n  animation: eg-view-in .24s var(--eg-ease) .06s both;\n}\n.eg-fb-ref-text { font-family: var(--eg-en); font-size: 16px; line-height: 1.6; color: var(--eg-ink); overflow-wrap: break-word; }\n.eg-fb-banktag {\n  display: inline-flex; align-items: center; padding: 1px 7px; border-radius: 999px;\n  background: color-mix(in srgb, var(--eg-accent) 10%, var(--eg-bg));\n  border: 1px solid color-mix(in srgb, var(--eg-accent) 22%, transparent);\n  color: var(--eg-ink-2); font: 600 10.5px/1.4 var(--eg-font);\n}\n.eg-copybtn {\n  appearance: none; -webkit-appearance: none;\n  display: inline-flex; align-items: center; gap: 4px;\n  height: 24px; padding: 0 8px; border-radius: 6px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg); color: var(--eg-ink-2);\n  font: 600 11px/1 var(--eg-font); cursor: pointer;\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-copybtn:hover { border-color: var(--eg-line-2); color: var(--eg-ink); }\n.eg-copybtn.copied { border-color: color-mix(in srgb, var(--eg-ok) 40%, transparent); color: var(--eg-ok); }\n.eg-copybtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-fb-corr {\n  padding: 9px 12px; border-radius: 10px;\n  border: 1px solid color-mix(in srgb, var(--eg-accent) 22%, var(--eg-line));\n  border-left: 3px solid var(--eg-accent);\n  background: color-mix(in srgb, var(--eg-accent) 4%, var(--eg-bg));\n  animation: eg-view-in .24s var(--eg-ease) .08s both;\n}\n.eg-fb-corr-text { font-family: var(--eg-en); font-size: 15px; line-height: 1.55; color: var(--eg-ink); overflow-wrap: break-word; }\n.eg-fb.is-phrase .eg-fb-tip {\n  margin-top: 0; padding: 9px 12px; border-radius: 10px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg);\n  color: var(--eg-ink); font-size: var(--eg-fs-sm); line-height: 1.6;\n  display: flex; gap: 9px; align-items: flex-start;\n  animation: eg-view-in .24s var(--eg-ease) .1s both;\n}\n.eg-fb.is-phrase .eg-fb-tip .b {\n  background: color-mix(in srgb, var(--eg-tone) 11%, var(--eg-bg));\n  border-color: color-mix(in srgb, var(--eg-tone) 26%, transparent);\n  color: var(--eg-tone); margin-top: 2px;\n}\n.eg-fb-hl { display: flex; flex-direction: column; gap: 6px; animation: eg-view-in .24s var(--eg-ease) .12s both; }\n.eg-fb-hl-lbl { font: 650 11.5px/1.2 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em; }\n.eg-fb-hl-list { display: flex; flex-wrap: wrap; gap: 6px; }\n.eg-hl-chip {\n  display: inline-flex; align-items: baseline; gap: 6px; padding: 4px 10px; border-radius: 8px;\n  background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  font-size: var(--eg-fs-xs); line-height: 1.4; max-width: 100%;\n}\n.eg-hl-chip .en { font-family: var(--eg-en); font-weight: 700; font-size: 13px; color: var(--eg-ink); }\n.eg-hl-chip .zh { color: var(--eg-ink-2); }\n.eg-fb.is-phrase .eg-fb-actions {\n  flex: 0 0 auto;\n  margin-top: 0; padding: 10px 16px;\n  border-top: 1px solid var(--eg-line); background: var(--eg-bg-2);\n  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;\n}\n.eg-fb.is-phrase .eg-fb-actions .eg-kbd { margin-left: auto; }\n@container (max-width: 340px) {\n  .eg-fb-hero { padding: 11px 13px; gap: 10px; }\n  .eg-fb-body { padding: 11px 13px 12px; }\n  .eg-fb.is-phrase .eg-fb-actions { padding: 10px 13px; }\n  .eg-fb.is-phrase .eg-fb-actions .eg-kbd { display: none; }\n}\n.eg-cap-row { display: inline-flex; align-items: center; justify-content: center; gap: 7px; flex-wrap: wrap; }\n.eg-attempt-pill, .eg-source-pill {\n  display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 999px;\n  background: color-mix(in srgb, var(--eg-accent) 10%, var(--eg-bg));\n  border: 1px solid color-mix(in srgb, var(--eg-accent) 22%, transparent);\n  color: var(--eg-ink-2); font: 600 11px/1.3 var(--eg-font); font-variant-numeric: tabular-nums;\n}\n.eg-source-pill { color: var(--eg-ink); }\n.eg-source-pill::before {\n  content: ""; width: 6px; height: 6px; border-radius: 50%; flex: 0 0 auto;\n  background: var(--eg-accent);\n}\n\n/* phrase drill: centred prompt, left-aligned reading feedback */\n.eg-drill { flex: 1 0 auto; width: 100%; max-width: 640px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; padding-top: 0; }\n.eg-view:has(.eg-fb.is-phrase) .eg-drill { flex: 1 1 0; min-height: 0; }\n.eg-drill > div { width: 100%; }\n.eg-drill-stage { width: 100%; margin: auto 0; padding: 12px 0 22px; }\n.eg-drill .eg-zh { max-width: 540px; margin-left: auto; margin-right: auto; text-wrap: balance; }\n.eg-drill .eg-cap { justify-content: center; }\n.eg-drill .eg-foot { justify-content: center; width: 100%; margin-top: 22px; }\n.eg-drill .eg-foot .eg-kbd { margin-left: 0; }\n.eg-drill .eg-inputwrap { width: 100%; max-width: 520px; margin: 22px auto 0; }\n.eg-drill .eg-input { text-align: left; }\n.eg-drill .eg-err { text-align: center; }\n\n';

// src/client/styles/report.css
var report_default = '/* ===== report ===== */\n.eg-report { position: relative; text-align: left; width: 100%; }\n.eg-report .r-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }\n.eg-rtitle {\n  font-family: var(--eg-en); font-size: 22px; line-height: 1.32; font-weight: 700;\n  letter-spacing: -.01em; margin: 0; overflow-wrap: break-word; min-width: 0; text-align: left; color: var(--eg-ink);\n}\n.eg-rmeta-row {\n  display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;\n  margin-top: 9px;\n}\n.eg-rmeta {\n  display: inline-flex; align-items: center; gap: 6px;\n  padding: 3px 10px; border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font-size: 11.5px; font-weight: 600; font-variant-numeric: tabular-nums;\n}\n.eg-rrefresh {\n  appearance: none; -webkit-appearance: none;\n  display: inline-flex; align-items: center; gap: 5px;\n  height: 26px; padding: 0 10px; border-radius: 999px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg); color: var(--eg-ink-2);\n  font: 600 11.5px/1 var(--eg-font); cursor: pointer;\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease, transform .14s ease;\n}\n.eg-rrefresh:hover:not(:disabled) { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-rrefresh:active:not(:disabled) { transform: scale(.96); }\n.eg-rrefresh:disabled { opacity: .48; cursor: not-allowed; }\n.eg-rrefresh:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-rsum {\n  margin: 14px 0 0; padding: 11px 14px;\n  border: 1px solid var(--eg-line); border-left: 3px solid var(--eg-accent); border-radius: 10px;\n  background: var(--eg-bg-2); color: var(--eg-ink-2);\n  font-family: var(--eg-font); font-size: var(--eg-fs-sm); line-height: 1.65; text-align: left;\n}\n.eg-rp {\n  margin: 15px 0 0; width: 100%;\n  font-family: var(--eg-en); font-size: 15.5px; line-height: 1.78; color: var(--eg-ink); text-align: left;\n}\n.eg-rword {\n  display: inline;\n  padding: 0 3px;\n  border-radius: 4px;\n  background: var(--eg-hl-bg);\n  color: inherit;\n  border-bottom: 1.5px dotted var(--eg-hl-line);\n  cursor: pointer;\n  transition: background var(--eg-dur) ease, border-color var(--eg-dur) ease;\n}\n.eg-rword:hover,\n.eg-rword.is-active {\n  background: var(--eg-hl-bg-active);\n  border-bottom-style: solid;\n  border-bottom-color: var(--eg-warn);\n}\n.eg-rword:focus-visible {\n  outline: 2px solid var(--eg-accent);\n  outline-offset: 1px;\n}\n.eg-rpop {\n  position: absolute;\n  z-index: 20;\n  width: max-content;\n  min-width: 152px;\n  max-width: min(244px, 100%);\n  padding: 10px 16px;\n  border-radius: 10px;\n  border: 1px solid var(--eg-line-2);\n  background: var(--eg-bg);\n  box-shadow: 0 10px 28px rgba(17, 22, 31, .16), 0 2px 6px rgba(17, 22, 31, .08);\n  color: var(--eg-ink);\n  text-align: center;\n  visibility: hidden;\n  pointer-events: auto;\n}\n.eg-rpop.is-pinned {\n  padding-left: 24px;\n  padding-right: 24px;\n}\n.eg-rpop.is-ready {\n  visibility: visible;\n  animation: eg-rpop-in .14s var(--eg-ease) both;\n}\n@keyframes eg-rpop-in {\n  from { opacity: 0; transform: translateY(4px) scale(.97); }\n  to { opacity: 1; transform: none; }\n}\n.eg-rpop::after {\n  content: "";\n  position: absolute;\n  left: var(--eg-arrow-x, 20px);\n  bottom: -5px;\n  width: 8px;\n  height: 8px;\n  background: var(--eg-bg);\n  border-right: 1px solid var(--eg-line-2);\n  border-bottom: 1px solid var(--eg-line-2);\n  transform: translateX(-50%) rotate(45deg);\n}\n.eg-rpop.is-below::after {\n  bottom: auto;\n  top: -5px;\n  border-right: none;\n  border-bottom: none;\n  border-left: 1px solid var(--eg-line-2);\n  border-top: 1px solid var(--eg-line-2);\n}\n.eg-rpop-head {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.eg-rpop-title {\n  display: flex;\n  align-items: baseline;\n  justify-content: center;\n  flex-wrap: wrap;\n  gap: 5px;\n  min-width: 0;\n}\n.eg-rpop-word {\n  font-family: var(--eg-en);\n  font-size: 14.5px;\n  font-weight: 700;\n  line-height: 1.3;\n  color: var(--eg-ink);\n  overflow-wrap: anywhere;\n}\n.eg-rpop-lemma {\n  font-family: var(--eg-en);\n  font-size: 11.5px;\n  color: var(--eg-ink-2);\n}\n.eg-rpop-close {\n  appearance: none; -webkit-appearance: none;\n  position: absolute;\n  top: 6px;\n  right: 6px;\n  width: 18px;\n  height: 18px;\n  margin: 0;\n  padding: 0;\n  border: none;\n  border-radius: 5px;\n  background: transparent;\n  color: var(--eg-ink-2);\n  font: 600 13px/1 var(--eg-font);\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  transition: background var(--eg-dur) ease, color var(--eg-dur) ease;\n}\n.eg-rpop-close:hover { background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-rpop-close:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-rpop-tags {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-wrap: wrap;\n  gap: 5px;\n  margin-top: 4px;\n}\n.eg-rpop-pos,\n.eg-rpop-bank {\n  display: inline-flex;\n  align-items: center;\n  padding: 1px 6px;\n  border-radius: 999px;\n  font: 600 10.5px/1.35 var(--eg-font);\n}\n.eg-rpop-pos {\n  background: var(--eg-bg-2);\n  border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2);\n}\n.eg-rpop-bank {\n  background: color-mix(in srgb, var(--eg-accent) 10%, var(--eg-bg));\n  border: 1px solid color-mix(in srgb, var(--eg-accent) 24%, transparent);\n  color: var(--eg-accent-ink);\n}\n.eg-rpop-zh {\n  margin-top: 5px;\n  font: 500 var(--eg-fs-xs)/1.5 var(--eg-font);\n  color: var(--eg-ink);\n  text-align: center;\n  overflow-wrap: anywhere;\n}\n.eg-practice { margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--eg-line); }\n.eg-ptitle {\n  display: flex; align-items: center; justify-content: flex-start; gap: 7px;\n  font-size: var(--eg-fs-xs); font-weight: 650; letter-spacing: .03em; color: var(--eg-ink-2);\n  margin-bottom: 10px;\n}\n.eg-q {\n  margin: 0; padding: 13px 15px; border: 1px solid var(--eg-line); border-radius: 11px;\n  background: var(--eg-bg); transition: border-color var(--eg-dur) ease;\n}\n.eg-q + .eg-q { margin-top: 10px; }\n.eg-q.reveal { border-color: var(--eg-line-2); }\n.eg-q-head { display: flex; gap: 9px; align-items: flex-start; justify-content: flex-start; text-align: left; }\n.eg-q-n {\n  flex: 0 0 auto; width: 20px; height: 20px; margin-top: 1px; border-radius: 6px;\n  background: var(--eg-bg-2); border: 1px solid var(--eg-line); color: var(--eg-ink);\n  display: inline-flex; align-items: center; justify-content: center;\n  font: 700 11px/1 var(--eg-font); font-variant-numeric: tabular-nums;\n}\n.eg-q-zh { font-size: var(--eg-fs-sm); font-weight: 500; line-height: 1.6; color: var(--eg-ink); text-align: left; }\n.eg-q-toggle {\n  appearance: none; -webkit-appearance: none;\n  margin-top: 10px; display: inline-flex; align-items: center; gap: 5px;\n  min-height: 27px; padding: 4px 10px; border-radius: 7px;\n  background: var(--eg-bg); border: 1px solid var(--eg-line); color: var(--eg-ink-2);\n  cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font);\n  transition: background var(--eg-dur) ease, color var(--eg-dur) ease, border-color var(--eg-dur) ease;\n}\n.eg-q-toggle:hover { background: var(--eg-bg-2); border-color: var(--eg-line-2); color: var(--eg-ink); }\n.eg-q-toggle:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-q-toggle .caret { display: inline-block; transition: transform .22s var(--eg-ease); }\n.eg-q.reveal .eg-q-toggle .caret { transform: rotate(90deg); }\n.eg-q-en {\n  margin-top: 10px; padding: 10px 13px; border-radius: 8px;\n  border: 1px solid var(--eg-line); border-left: 2.5px solid var(--eg-accent);\n  background: var(--eg-bg-2); font-family: var(--eg-en); font-size: 14.5px; line-height: 1.6;\n  color: var(--eg-ink); text-align: left;\n}\n.eg-report-foot {\n  margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--eg-line);\n  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;\n}\n.eg-report-foot-hint { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.4; }\n.eg-report .eg-actions { justify-content: flex-start; margin-top: 18px; }\n\n';

// src/client/styles/word.css
var word_default = "/* ===== word training ===== */\n.eg-letters { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }\n.eg-letters.is-bad { animation: eg-shake .32s cubic-bezier(.36, .07, .19, .97) both; }\n@keyframes eg-shake {\n  0%, 100% { transform: translateX(0); }\n  20% { transform: translateX(-5px); }\n  42% { transform: translateX(5px); }\n  64% { transform: translateX(-3px); }\n  84% { transform: translateX(2px); }\n}\n.eg-letter {\n  flex: 1 1 0; min-width: 8px; max-width: 38px; width: auto; height: 48px; padding: 0; text-align: center;\n  border: none; border-bottom: 2px solid var(--eg-line-2); border-radius: 6px 6px 0 0;\n  background: transparent; color: var(--eg-ink);\n  font: 600 22px/1 var(--eg-font); text-transform: lowercase; outline: none;\n  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, color var(--eg-dur) ease, box-shadow var(--eg-dur) ease, transform .14s var(--eg-spring);\n}\n.eg-letter:hover { border-bottom-color: var(--eg-ink-2); background: var(--eg-bg-2); }\n.eg-letter:focus { border-bottom-color: var(--eg-accent); background: var(--eg-bg-2); box-shadow: 0 3px 0 -1px color-mix(in srgb, var(--eg-accent) 26%, transparent); }\n.eg-letter.is-pop { animation: eg-letter-pop .16s var(--eg-spring); }\n@keyframes eg-letter-pop {\n  0% { transform: scale(.9); }\n  55% { transform: scale(1.1); }\n  100% { transform: scale(1); }\n}\n.eg-letter.ok { border-bottom-color: var(--eg-ok); color: var(--eg-ok); }\n.eg-letters.is-ok .eg-letter.ok {\n  animation: eg-letter-ok .34s var(--eg-spring) calc(var(--i, 0) * 34ms) both;\n}\n@keyframes eg-letter-ok {\n  0% { transform: translateY(0) scale(1); }\n  45% { transform: translateY(-5px) scale(1.08); }\n  100% { transform: translateY(0) scale(1); }\n}\n.eg-letter.bad { border-bottom-color: var(--eg-bad); color: var(--eg-bad); }\n.eg-letters.answered .eg-letter { cursor: default; }\n/* word training: centred column */\n.eg-word {\n  container-type: inline-size;\n  width: 100%; max-width: 640px; margin-left: auto; margin-right: auto;\n  height: 100%; min-height: 0; display: flex; flex-direction: column; align-items: stretch; text-align: center;\n}\n.eg-word-main { flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; min-height: 0; overflow-y: auto; padding: 10px 0 14px; }\n.eg-word-stage { width: 100%; margin: auto 0; display: flex; flex-direction: column; align-items: center; }\n.eg-word .eg-pos {\n  display: inline-flex; align-items: center; margin: 0 0 4px; padding: 3px 10px;\n  border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font: 600 11.5px/1.2 var(--eg-font);\n}\n.eg-word .eg-zh {\n  max-width: 500px;\n  font-family: var(--eg-font); font-size: 23px; font-weight: 700; letter-spacing: -.01em; line-height: 1.42;\n  margin-top: 6px; color: var(--eg-ink); text-wrap: balance; overflow-wrap: break-word;\n}\n.eg-word .eg-zh.is-long { font-size: 20px; }\n.eg-word .eg-zh.is-xlong { font-size: 18px; line-height: 1.48; }\n.eg-word .eg-letters { justify-content: center; margin-top: 18px; width: 100%; }\n.eg-word .eg-foot { justify-content: center; width: 100%; margin-top: 24px; }\n.eg-word .eg-foot .eg-kbd { margin-left: 0; }\n.eg-word .eg-fb {\n  width: 100%; text-align: center; margin-top: 14px; padding: 0; border: none; border-radius: 0; background: transparent;\n}\n.eg-word .eg-fb-top { justify-content: center; align-items: center; flex-wrap: wrap; gap: 8px; }\n.eg-word .eg-fb-actions { justify-content: center; }\n.eg-word .eg-fb > .eg-fb-actions:first-child { margin-top: 0; gap: 8px; flex-wrap: wrap; justify-content: center; }\n.eg-word .eg-fb-actions .eg-btn { padding: 0 10px; }\n.eg-word-miss { margin-top: 12px; font-size: var(--eg-fs-xs); font-weight: 550; color: var(--eg-bad); animation: eg-view-in .2s var(--eg-ease) both; }\n.eg-word-reveal { width: 100%; }\n.eg-word-foot { flex: 0 0 auto; display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--eg-line); }\n.eg-word-foot .eg-btn { padding: 0 12px; }\n.eg-word .eg-fb-ref {\n  margin-top: 8px; padding: 0; background: transparent; font-family: var(--eg-en); font-size: 24px; font-weight: 600; text-align: center;\n}\n.eg-word .eg-eg {\n  width: 100%; max-width: 480px; margin: 12px auto 0; padding: 10px 15px;\n  border: none; border-radius: 10px; background: var(--eg-bg-2); text-align: center;\n  transition: background var(--eg-dur) ease;\n}\n.eg-word .eg-eg.done { animation: eg-view-in .22s var(--eg-ease) both; }\n.eg-word .eg-eg-en { font: 15px/1.65 var(--eg-en); color: var(--eg-ink); overflow-wrap: anywhere; }\n.eg-word .eg-eg-zh { margin-top: 5px; font: var(--eg-fs-xs)/1.6 var(--eg-font); color: var(--eg-ink-2); }\n.eg-eg-hit {\n  padding: 1px 4px; border-radius: 4px;\n  background: color-mix(in srgb, var(--eg-accent) 13%, transparent);\n  color: var(--eg-ink); font-weight: 700;\n}\n/* ===== word bank bar ===== */\n.eg-bankbar { width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; padding: 0 0 10px; margin: 0; border-bottom: 1px solid var(--eg-line); }\n.eg-srs-bar {\n  width: 100%; display: flex; flex-direction: column; align-items: center; gap: 5px;\n  padding: 2px 2px 10px; margin: 0 0 6px; border-bottom: 1px solid var(--eg-line);\n}\n.eg-srs-hint {\n  font: 400 11px/1.4 var(--eg-font); color: var(--eg-ink-2); text-align: center;\n}\n.eg-srs-meta {\n  font: 500 11px/1.3 var(--eg-font); color: var(--eg-ink-2); font-variant-numeric: tabular-nums;\n  opacity: .82; text-align: center;\n}\n.eg-srs-modes {\n  display: inline-flex; align-items: center; gap: 3px; padding: 2px;\n  border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n}\n.eg-srs-mode {\n  appearance: none; -webkit-appearance: none;\n  display: inline-flex; align-items: center; gap: 5px; height: 24px; padding: 0 10px;\n  border: none; border-radius: 999px; background: transparent; color: var(--eg-ink-2);\n  font: 600 11.5px/1 var(--eg-font); cursor: pointer; white-space: nowrap;\n  transition: background var(--eg-dur) ease, color var(--eg-dur) ease;\n}\n.eg-srs-mode:hover:not(.active):not(:disabled) { color: var(--eg-ink); }\n.eg-srs-mode.active { background: var(--eg-bg); color: var(--eg-ink); box-shadow: 0 1px 2px rgba(17, 22, 31, .08); }\n.eg-srs-mode:disabled { opacity: .6; cursor: not-allowed; }\n.eg-srs-mode:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-srs-due {\n  display: inline-flex; align-items: center; justify-content: center;\n  min-width: 16px; height: 16px; padding: 0 4px; border-radius: 999px;\n  background: color-mix(in srgb, var(--eg-warn) 18%, transparent);\n  color: var(--eg-warn); font: 700 10.5px/1 var(--eg-font); font-variant-numeric: tabular-nums;\n}\n.eg-word-meta {\n  display: inline-flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 6px; margin: 0 0 2px;\n  color: var(--eg-ink-2); font: 500 12px/1.3 var(--eg-font);\n}\n.eg-pos-text { color: var(--eg-ink-2); }\n.eg-meta-sep { opacity: .45; }\n.eg-srs-tag {\n  display: inline-flex; align-items: center; gap: 6px;\n  color: var(--eg-ink-2); font: 500 12px/1.3 var(--eg-font);\n}\n.eg-srs-tag.is-review {\n  color: var(--eg-warn); font-weight: 600;\n}\n.eg-srs-dots { display: inline-flex; align-items: center; gap: 2.5px; }\n.eg-srs-dot {\n  width: 4.5px; height: 4.5px; border-radius: 50%; background: var(--eg-line-2); display: inline-block;\n}\n.eg-srs-dot.on { background: currentColor; }\n.eg-srs-next {\n  display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 999px;\n  background: color-mix(in srgb, var(--eg-ok) 12%, var(--eg-bg));\n  border: 1px solid color-mix(in srgb, var(--eg-ok) 26%, transparent);\n  color: var(--eg-ok); font: 600 11.5px/1.3 var(--eg-font);\n}\n.eg-srs-done {\n  margin: 28px auto 0; padding: 22px 20px; max-width: 380px; width: 100%;\n  border: 1px solid var(--eg-line); border-radius: 12px; background: var(--eg-bg-2);\n  display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center;\n}\n.eg-srs-done-title { font: 700 15px/1.35 var(--eg-font); color: var(--eg-ink); }\n.eg-srs-done-sub { font: 500 var(--eg-fs-xs)/1.5 var(--eg-font); color: var(--eg-ink-2); font-variant-numeric: tabular-nums; }\n.eg-banklabel { flex: 0 0 auto; font-size: var(--eg-fs-xs); font-weight: 600; color: var(--eg-ink-2); }\n@container (max-width: 315px) {\n  .eg-banklabel { display: none; }\n}\n.eg-select {\n  flex: 1 1 auto; min-width: 0; max-width: 280px; height: 34px; padding: 0 26px 0 12px; border: 1px solid var(--eg-line);\n  border-radius: 999px; background: var(--eg-bg-2); color: var(--eg-ink); cursor: pointer;\n  font: 600 var(--eg-fs-xs)/1 var(--eg-font); outline: none; appearance: none;\n  background-image: linear-gradient(45deg, transparent 50%, var(--eg-ink-2) 50%), linear-gradient(135deg, var(--eg-ink-2) 50%, transparent 50%);\n  background-position: calc(100% - 13px) 13px, calc(100% - 9px) 13px; background-size: 4px 4px, 4px 4px; background-repeat: no-repeat;\n  transition: border-color var(--eg-dur) ease, background-color var(--eg-dur) ease;\n}\n.eg-select:hover { border-color: var(--eg-line-2); }\n.eg-select:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-bankbtn { appearance: none; -webkit-appearance: none;\n  flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; gap: 4px;\n  min-height: 34px; padding: 0 12px; border: 1px solid var(--eg-line); border-radius: 999px;\n  background: var(--eg-bg); color: var(--eg-ink-2); cursor: pointer;\n  font: 600 var(--eg-fs-xs)/1 var(--eg-font);\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease, transform .14s ease;\n}\n.eg-bankbtn:hover { border-color: var(--eg-line-2); color: var(--eg-ink); background: var(--eg-bg-2); }\n.eg-bankbtn:active { transform: scale(.95); }\n.eg-bankbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-notice { margin: 0 0 12px; padding: 8px 11px; border-radius: 9px; background: color-mix(in srgb, var(--eg-ok) 9%, transparent); border: 1px solid color-mix(in srgb, var(--eg-ok) 28%, transparent); color: var(--eg-ink); font-size: var(--eg-fs-xs); line-height: 1.5; animation: eg-view-in .2s var(--eg-ease) both; }\n\n/* ===== word bank import ===== */\n.eg-import { width: 100%; max-width: 520px; margin: 0 auto; text-align: left; animation: eg-view-in .2s var(--eg-ease) both; }\n.eg-import-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }\n.eg-import-title { font-size: var(--eg-fs-md); font-weight: 700; color: var(--eg-ink); line-height: 1.3; }\n.eg-import-actions { flex: 0 0 auto; display: flex; align-items: center; gap: 6px; }\n.eg-import-back, .eg-filebtn { appearance: none; -webkit-appearance: none;\n  flex: 0 0 auto; display: inline-flex; align-items: center; min-height: 30px; padding: 4px 10px;\n  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg);\n  color: var(--eg-ink-2); cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font); white-space: nowrap;\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-import-back:hover, .eg-filebtn:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-import-back:focus-visible, .eg-filebtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-import-sub { margin-top: 4px; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.5; }\n.eg-field { margin-top: 10px; }\n.eg-field label { display: block; margin-bottom: 6px; font-size: var(--eg-fs-xs); font-weight: 600; color: var(--eg-ink-2); }\n.eg-text {\n  width: 100%; height: 34px; padding: 0 11px; border: 1px solid var(--eg-line); border-radius: 8px;\n  background: var(--eg-bg-2); color: var(--eg-ink); font: var(--eg-fs-sm)/1 var(--eg-font); outline: none;\n  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, box-shadow var(--eg-dur) ease;\n}\n.eg-text:hover { border-color: var(--eg-line-2); }\n.eg-text:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }\n.eg-textarea-wrap { position: relative; margin-top: 10px; }\n.eg-textarea {\n  width: 100%; min-height: 86px; resize: vertical; padding: 9px 11px; border: 1px solid var(--eg-line); border-radius: 10px;\n  background: var(--eg-bg-2); color: var(--eg-ink); font: var(--eg-fs-xs)/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; outline: none;\n  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, box-shadow var(--eg-dur) ease;\n}\n.eg-textarea-wrap.over .eg-textarea, .eg-textarea-wrap:hover .eg-textarea { border-color: var(--eg-accent); background: color-mix(in srgb, var(--eg-accent) 5%, var(--eg-bg-2)); }\n.eg-textarea:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }\n.eg-preview { margin-top: 12px; border: 1px solid var(--eg-line); border-radius: 10px; overflow: hidden; animation: eg-view-in .2s var(--eg-ease) both; }\n.eg-preview-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px; background: var(--eg-bg-2); font-size: var(--eg-fs-xs); color: var(--eg-ink-2); }\n.eg-preview-top strong { color: var(--eg-ink); }\n.eg-preview-row { display: flex; flex-wrap: wrap; gap: 10px; padding: 7px 10px; border-top: 1px solid var(--eg-line); font-size: var(--eg-fs-xs); line-height: 1.5; }\n.eg-preview-row .w { flex: 0 0 38%; font-weight: 650; overflow-wrap: anywhere; }\n.eg-preview-row .m { flex: 1 1 auto; color: var(--eg-ink-2); overflow-wrap: anywhere; }\n.eg-preview-row .ex { flex: 1 0 100%; color: var(--eg-ink-2); font-family: var(--eg-en); font-style: italic; overflow-wrap: anywhere; }\n.eg-preview-errors { margin-top: 8px; padding: 8px 10px; border-radius: 8px; background: color-mix(in srgb, var(--eg-bad) 7%, transparent); border: 1px solid color-mix(in srgb, var(--eg-bad) 24%, transparent); }\n.eg-preview-errors .er { font-size: var(--eg-fs-xs); line-height: 1.55; color: var(--eg-bad); }\n.eg-import-foot { display: flex; gap: 8px; margin-top: 10px; }\n\n";

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
@container (min-width: 440px) {
  .eg-direction-list { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .eg-bank-list { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .eg-level-list { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; }
}
@container (max-width: 279px) {
  .eg-direction-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .eg-bank-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .eg-level-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
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
var reduced_motion_default = "@media (prefers-reduced-motion: reduce) {\n  .eg-panel, .eg-panel.is-closing, .eg-view, .eg-view > *, .eg-stage-in, .eg-fb, .eg-fb-ref, .eg-fb-tip, .eg-fb-actions,\n  .eg-fb-mine, .eg-fb-corr, .eg-fb-hl,\n  .eg-letters.is-bad, .eg-letter.is-pop, .eg-letters.is-ok .eg-letter.ok, .eg-hist-day.is-flash,\n  .eg-notice, .eg-import, .eg-preview, .eg-word-miss, .eg-word .eg-eg.done, .eg-rpop.is-ready, .eg-wchip.is-enter, .eg-wchip.is-leave, .eg-sent.is-enter, .eg-sent.is-leave { animation: none !important; }\n  .eg-confetti { display: none; }\n  .eg-root *, .eg-panel * { transition: none !important; }\n}\n";

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
  settings: { confetti: true, topicId: "ai", customTopics: [], bankLink: true, bankRetries: 1, sessionLink: false, reportLevel: "B1" },
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

// src/client/shell/EnglishGymPill.js
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
  }, []);
  const stats = shared.stats;
  return import_react3.default.createElement(
    "div",
    { className: "eg-root eg-entry" },
    import_react3.default.createElement(
      "button",
      {
        className: "eg-pill",
        onClick: () => store.toggle(),
        title: "English Gym — 短语造句 + 单词拼写",
        "aria-expanded": shared.open ? "true" : "false"
      },
      import_react3.default.createElement("span", { className: "eg-mono" }, "EG"),
      import_react3.default.createElement("span", { className: "eg-wordmark" }, "English Gym"),
      stats && stats.streakDays > 0 ? import_react3.default.createElement("span", { className: "eg-streak" }, "连续 " + stats.streakDays + " 天") : null,
      stats && stats.reviewCount > 0 ? import_react3.default.createElement(
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
      import_react3.default.createElement("span", { className: "eg-chev", "aria-hidden": "true" }, "▸")
    )
  );
}

// src/client/shell/EnglishGymBoard.js
var import_react17 = __toESM(require("react"), 1);

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

// src/client/components/Confetti.js
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
  return import_react5.default.createElement(
    "div",
    { className: "eg-confetti", "aria-hidden": "true" },
    pieces.map((piece) => import_react5.default.createElement("span", { key: piece.key, className: "eg-confetti-piece", style: piece.style }))
  );
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
  const h3 = clamp(g.h, 170, Math.max(170, vh - MIN_TOP - EDGE_PAD));
  const x = clamp(g.x, EDGE_PAD, Math.max(EDGE_PAD, vw - w - EDGE_PAD));
  const y = clamp(g.y, MIN_TOP, Math.max(MIN_TOP, vh - 44));
  return { x, y, w, h: h3 };
}
function pillAnchorGeom() {
  const vw = window.innerWidth || 1200;
  const vh = window.innerHeight || 800;
  const w = 340;
  const h3 = 440;
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
  return fitGeom({ w, h: h3, x: Math.round(cx - w / 2), y: Math.round(bottom - h3) });
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
    const h3 = clamp(d.g0.h + (e.clientY - d.sy), 170, Math.max(170, maxH));
    setGeom({ x: d.g0.x, y: d.g0.y, w, h: h3 });
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
  const inFlightRef = (0, import_react7.useRef)(false);
  const loadNext = (0, import_react7.useCallback)(async (mode) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setBusy(true);
    setError("");
    try {
      const data = await api("/next", {
        method: "POST",
        body: JSON.stringify({ mode: mode || "new", sessionId: store.sessionId || "" })
      });
      setCard(data);
      setAnswer("");
      setSubmittedAnswer("");
      setFeedback(null);
      setAttempt(0);
      setPrevScore(null);
      setRetryFocusTick(0);
      lastScoreRef.current = null;
    } catch (e) {
      setError(e.message || "出题失败");
    } finally {
      inFlightRef.current = false;
      setBusy(false);
    }
  }, []);
  (0, import_react7.useEffect)(() => {
    if (open && active && !card && !feedback && !startedRef.current) {
      startedRef.current = true;
      loadNext("new");
    }
  }, [open, active, card, feedback, loadNext]);
  const submit = (0, import_react7.useCallback)(async () => {
    if (!card || busy) return;
    const currentAnswer = answer;
    setBusy(true);
    setError("");
    try {
      const res = await api("/check", {
        method: "POST",
        body: JSON.stringify({ id: card.id, answer: currentAnswer })
      });
      setSubmittedAnswer(currentAnswer);
      setPrevScore(lastScoreRef.current);
      lastScoreRef.current = Number.isFinite(Number(res.score)) ? Number(res.score) : 0;
      setAttempt((n) => n + 1);
      setFeedback(res);
      if (res.correct) store.celebrate();
      if (res.summary) store.setStats(res.summary);
    } catch (e) {
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
      setBusy(false);
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
    loadNext("new");
  }, [loadNext]);
  const reset = (0, import_react7.useCallback)(() => {
    setCard(null);
    setFeedback(null);
    setAnswer("");
    setSubmittedAnswer("");
    setAttempt(0);
    setPrevScore(null);
    setRetryFocusTick(0);
    setError("");
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

// src/client/features/phrase/Drill.js
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

// src/client/components/ScoreRing.js
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
  return import_react8.default.createElement(
    "div",
    { className: "eg-ring", "aria-label": "得分 " + clamped + " 分" },
    import_react8.default.createElement(
      "svg",
      { viewBox: "0 0 50 50", "aria-hidden": "true" },
      import_react8.default.createElement("circle", { className: "eg-ring-track", cx: 25, cy: 25, r }),
      clamped > 0 ? import_react8.default.createElement("circle", {
        className: "eg-ring-arc",
        cx: 25,
        cy: 25,
        r,
        strokeDasharray: c.toFixed(2),
        strokeDashoffset: offset.toFixed(2)
      }) : null
    ),
    import_react8.default.createElement(
      "span",
      { className: "eg-ring-val" },
      import_react8.default.createElement("strong", null, displayScore),
      import_react8.default.createElement("small", null, "分")
    )
  );
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

// src/client/features/phrase/Drill.js
var useIsoLayoutEffect = import_react9.default.useLayoutEffect || import_react9.useEffect;
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
  const [hintOpen, setHintOpen] = (0, import_react9.useState)(false);
  const [copied, setCopied] = (0, import_react9.useState)(false);
  const inputRef = (0, import_react9.useRef)(null);
  const copyTimerRef = (0, import_react9.useRef)(null);
  const displayScore = useCountUp(feedback ? feedback.score : 0, !!feedback);
  (0, import_react9.useEffect)(() => {
    setCopied(false);
    return () => clearTimeout(copyTimerRef.current);
  }, [feedback]);
  const syncInputHeight = (0, import_react9.useCallback)(() => {
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
  (0, import_react9.useEffect)(() => {
    const el = inputRef.current;
    if (!el || typeof ResizeObserver !== "function") return void 0;
    const ro = new ResizeObserver(syncInputHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, [card, feedback, syncInputHeight]);
  (0, import_react9.useEffect)(() => {
    if (!retryFocusTick || feedback || !card) return;
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
    const ok = await copyToClipboard(feedback.reference);
    if (!ok) return;
    setCopied(true);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 1600);
  };
  if (feedback) {
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
    return import_react9.default.createElement(
      "div",
      { className: "eg-fb is-phrase " + verdict.tone, "data-nodrag": "true" },
      import_react9.default.createElement(
        "div",
        { className: "eg-fb-hero" },
        import_react9.default.createElement(ScoreRing, { score, displayScore }),
        import_react9.default.createElement(
          "div",
          { className: "eg-fb-verdict" },
          import_react9.default.createElement(
            "div",
            { className: "eg-fb-headline" },
            import_react9.default.createElement("span", { className: "eg-fb-status" }, verdict.title),
            feedback.exact ? import_react9.default.createElement("span", { className: "eg-fb-pill tone" }, "完全匹配") : null,
            fromSession ? import_react9.default.createElement("span", { className: "eg-fb-pill" }, "结合当前会话") : null,
            attempt > 1 ? import_react9.default.createElement("span", { className: "eg-fb-pill" }, "第 " + attempt + " 次尝试") : null,
            delta > 0 ? import_react9.default.createElement("span", { className: "eg-fb-pill up" }, "↑ +" + delta + " 分") : null
          ),
          import_react9.default.createElement("div", { className: "eg-fb-sub" }, verdict.sub)
        )
      ),
      import_react9.default.createElement(
        "div",
        { className: "eg-fb-body" },
        promptZh ? import_react9.default.createElement(
          "div",
          { className: "eg-fb-prompt" },
          import_react9.default.createElement("span", { className: "eg-fb-tag" }, "原句"),
          import_react9.default.createElement("span", { className: "eg-fb-zh" }, promptZh)
        ) : null,
        import_react9.default.createElement(
          "div",
          { className: "eg-fb-mine" },
          import_react9.default.createElement(
            "div",
            { className: "eg-fb-boxhead" },
            import_react9.default.createElement(
              "span",
              { className: "lbl" },
              import_react9.default.createElement("span", { "aria-hidden": "true" }, ok ? "✓" : "✗"),
              "你的作答"
            )
          ),
          import_react9.default.createElement(
            "div",
            { className: "eg-fb-mine-text" + (mine ? "" : " empty") },
            mine || "（未输入有效内容）"
          )
        ),
        import_react9.default.createElement(
          "div",
          { className: "eg-fb-ref" },
          import_react9.default.createElement(
            "div",
            { className: "eg-fb-boxhead" },
            import_react9.default.createElement(
              "div",
              { className: "eg-fb-boxhead-left" },
              import_react9.default.createElement("span", { className: "lbl" }, "参考译文"),
              bankWords.length ? import_react9.default.createElement("span", { className: "eg-fb-banktag", title: "融入的词库词" }, "词库 · " + bankWords.join(" / ")) : null
            ),
            reference ? import_react9.default.createElement(
              "button",
              {
                type: "button",
                className: "eg-copybtn" + (copied ? " copied" : ""),
                onClick: handleCopy,
                title: "复制参考译文"
              },
              copied ? "已复制 ✓" : "复制"
            ) : null
          ),
          import_react9.default.createElement(
            "div",
            { className: "eg-fb-ref-text" },
            refParts.map(
              (part, i) => i % 2 ? import_react9.default.createElement("mark", { className: "eg-eg-hit", key: i }, part) : import_react9.default.createElement("span", { key: i }, part)
            )
          )
        ),
        showCorrected ? import_react9.default.createElement(
          "div",
          { className: "eg-fb-corr" },
          import_react9.default.createElement(
            "div",
            { className: "eg-fb-boxhead" },
            import_react9.default.createElement("span", { className: "lbl" }, "贴近你思路的改写")
          ),
          import_react9.default.createElement("div", { className: "eg-fb-corr-text" }, corrected)
        ) : null,
        feedback.tip ? import_react9.default.createElement(
          "div",
          { className: "eg-fb-tip" },
          import_react9.default.createElement("span", { className: "b" }, "点评"),
          import_react9.default.createElement("span", null, feedback.tip)
        ) : null,
        highlights.length ? import_react9.default.createElement(
          "div",
          { className: "eg-fb-hl" },
          import_react9.default.createElement("div", { className: "eg-fb-hl-lbl" }, "核心表达"),
          import_react9.default.createElement(
            "div",
            { className: "eg-fb-hl-list" },
            highlights.map(
              (item, i) => import_react9.default.createElement(
                "span",
                { className: "eg-hl-chip", key: i },
                import_react9.default.createElement("span", { className: "en" }, item.en),
                import_react9.default.createElement("span", { className: "zh" }, item.zh)
              )
            )
          )
        ) : null
      ),
      import_react9.default.createElement(
        "div",
        { className: "eg-fb-actions" },
        ok ? [
          import_react9.default.createElement(
            "button",
            {
              key: "next",
              className: "eg-btn primary",
              onClick: onNext,
              onPointerDown: bounceButton,
              disabled: busy,
              title: "回车下一题",
              "aria-keyshortcuts": "Enter"
            },
            "下一题 →"
          ),
          canRetry ? import_react9.default.createElement(
            "button",
            { key: "retry", className: "eg-btn", onClick: onRetry, disabled: busy },
            "↺ 再试一次"
          ) : null
        ] : [
          canRetry ? import_react9.default.createElement(
            "button",
            {
              key: "retry",
              className: "eg-btn primary",
              onClick: onRetry,
              onPointerDown: bounceButton,
              disabled: busy,
              title: "回车再试一次",
              "aria-keyshortcuts": "Enter"
            },
            "↺ 再试一次"
          ) : null,
          import_react9.default.createElement(
            "button",
            { key: "next", className: canRetry ? "eg-btn" : "eg-btn primary", onClick: onNext, disabled: busy },
            "下一题 →"
          )
        ],
        import_react9.default.createElement(
          "span",
          { className: "eg-kbd", title: ok ? "按 Enter 进入下一题" : "按 Enter 再试一次" },
          import_react9.default.createElement("kbd", null, "↵"),
          " ",
          ok ? "下一题" : "再试"
        )
      )
    );
  }
  if (!card) {
    if (error) {
      return import_react9.default.createElement(
        "div",
        null,
        import_react9.default.createElement("div", { className: "eg-err" }, error),
        import_react9.default.createElement(
          "div",
          { className: "eg-foot" },
          import_react9.default.createElement("button", { className: "eg-btn primary", onClick: onNext, disabled: busy }, "重试")
        )
      );
    }
    return import_react9.default.createElement(
      "div",
      { className: "eg-loading is-stage" },
      import_react9.default.createElement("span", { className: "eg-spin" }),
      "正在出题…"
    );
  }
  return import_react9.default.createElement(
    "div",
    { className: "eg-drill-stage" },
    import_react9.default.createElement(
      "div",
      { className: "eg-cap eg-cap-row" },
      import_react9.default.createElement("span", null, "把这句话译成英文"),
      card.source === "session" ? import_react9.default.createElement("span", { className: "eg-source-pill", title: "根据当前会话内容生成" }, "结合当前会话") : null,
      attempt > 0 ? import_react9.default.createElement("span", { className: "eg-attempt-pill" }, "第 " + (attempt + 1) + " 次尝试") : null
    ),
    import_react9.default.createElement("div", { className: "eg-zh" }, card.zh),
    card.hint ? import_react9.default.createElement(
      import_react9.default.Fragment,
      null,
      import_react9.default.createElement(
        "button",
        {
          className: "eg-hintbtn",
          "aria-expanded": hintOpen ? "true" : "false",
          onClick: () => setHintOpen((v) => !v),
          type: "button"
        },
        import_react9.default.createElement("span", { className: "caret", "aria-hidden": "true" }, "▸"),
        "提示"
      ),
      import_react9.default.createElement(
        "div",
        {
          className: "eg-collapse eg-hint-collapse" + (hintOpen ? " open" : ""),
          "aria-hidden": hintOpen ? "false" : "true"
        },
        import_react9.default.createElement(
          "div",
          { className: "eg-collapse-inner" },
          import_react9.default.createElement("div", { className: "eg-hintbox" }, card.hint)
        )
      )
    ) : null,
    import_react9.default.createElement(
      "div",
      { className: "eg-inputwrap" },
      import_react9.default.createElement("textarea", {
        ref: inputRef,
        rows: 1,
        className: "eg-input" + (error ? " error" : ""),
        value: answer,
        placeholder: "在这里写下你的英文…",
        onChange: (e) => setAnswer(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onSubmit();
          }
        }
      })
    ),
    error ? import_react9.default.createElement("div", { className: "eg-err" }, error) : null,
    import_react9.default.createElement(
      "div",
      { className: "eg-foot" },
      import_react9.default.createElement(
        "button",
        {
          className: "eg-btn primary" + (busy ? " is-loading" : ""),
          onClick: onSubmit,
          onPointerDown: bounceButton,
          disabled: busy || !answer.trim()
        },
        "提交"
      ),
      import_react9.default.createElement("button", { className: "eg-btn", onClick: onNext, disabled: busy }, "换一题"),
      import_react9.default.createElement(
        "span",
        { className: "eg-kbd", title: "⌘/Ctrl + Enter 提交" },
        import_react9.default.createElement("kbd", null, "⌘"),
        " ",
        import_react9.default.createElement("kbd", null, "↵")
      )
    )
  );
}

// src/client/features/word/WordPractice.js
var import_react11 = __toESM(require("react"), 1);

// src/client/features/word/ExampleBlock.js
var import_react10 = __toESM(require("react"), 1);
var h = import_react10.default.createElement;
function ExampleBlock({ example, exampleZh, word, highlight }) {
  const en = String(example || "");
  const zh = String(exampleZh || "");
  if (!en && !zh) return null;
  const parts = en && highlight && word ? splitByWord(en, word) : [en];
  return h(
    "div",
    { className: "eg-eg" + (highlight ? " done" : "") },
    en ? h(
      "div",
      { className: "eg-eg-en" },
      parts.map(
        (part, i) => i % 2 ? h("mark", { className: "eg-eg-hit", key: i }, part) : h("span", { key: i }, part)
      )
    ) : null,
    zh ? h("div", { className: "eg-eg-zh" }, zh) : null
  );
}

// src/client/features/word/WordPractice.js
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
var MODES = [
  { id: "smart", label: "智能", title: "按艾宾浩斯曲线优先复习到期词，每复习 3 个穿插 1 个新词" },
  { id: "review", label: "待复习", title: "专注清理当前词库已到复习时间的单词" },
  { id: "new", label: "新词", title: "跳过到期复习，优先抽取尚未背过的新词" }
];
function stageLabel(srs) {
  if (!srs) return "新词";
  if (srs.kind === "new") return "新词";
  if (srs.kind === "mastered" || srs.mastered) return "已掌握回顾";
  if (srs.kind === "upcoming") return "提前巩固 · 第 " + ((srs.stage || 0) + 1) + " 阶";
  return "复习 · 第 " + ((srs.stage || 0) + 1) + " 阶";
}
function shortBankName(name) {
  return String(name || "").replace(/^内置\s*·\s*/, "");
}
function WordPractice({ bankRev = 0 } = {}) {
  const shared = useShared();
  const [item, setItem] = (0, import_react11.useState)(() => cachedWord.item);
  const [cells, setCells] = (0, import_react11.useState)(() => cachedWord.cells);
  const [res, setRes] = (0, import_react11.useState)(() => cachedWord.res);
  const [revealed, setRevealed] = (0, import_react11.useState)(() => cachedWord.revealed);
  const [busy, setBusy] = (0, import_react11.useState)(false);
  const [error, setError] = (0, import_react11.useState)("");
  const [mode, setMode] = (0, import_react11.useState)(() => cachedWord.mode);
  const [hoverMode, setHoverMode] = (0, import_react11.useState)("");
  const [srsStats, setSrsStats] = (0, import_react11.useState)(() => cachedWord.srsStats);
  const refs = (0, import_react11.useRef)([]);
  const inFlight = (0, import_react11.useRef)(false);
  const revealedEverRef = (0, import_react11.useRef)(cachedWord.revealedEver);
  const modeRef = (0, import_react11.useRef)(mode);
  modeRef.current = mode;
  (0, import_react11.useEffect)(() => {
    cachedWord.item = item;
    cachedWord.cells = cells;
    cachedWord.res = res;
    cachedWord.revealed = revealed;
    cachedWord.revealedEver = revealedEverRef.current;
    cachedWord.mode = mode;
    cachedWord.srsStats = srsStats;
  }, [item, cells, res, revealed, mode, srsStats]);
  const load = (0, import_react11.useCallback)(async (requestedMode) => {
    if (inFlight.current) return;
    const targetMode = requestedMode === "review" || requestedMode === "new" || requestedMode === "smart" ? requestedMode : modeRef.current;
    inFlight.current = true;
    setBusy(true);
    setError("");
    setRes(null);
    setRevealed(false);
    revealedEverRef.current = false;
    try {
      const data = await api("/word/next", {
        method: "POST",
        body: JSON.stringify({ mode: targetMode })
      });
      if (data.srsStats) setSrsStats(data.srsStats);
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
      setError(e.message || "出题失败");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }, []);
  (0, import_react11.useEffect)(() => {
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
  (0, import_react11.useEffect)(() => {
    if (!res || !res.correct) return void 0;
    const onKeyDown = (e) => {
      if (e.key !== "Enter" || e.isComposing) return;
      const el = e.target;
      if (el && el.closest && el.closest("textarea, input:not([disabled]), select, button")) return;
      e.preventDefault();
      load();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [res, load]);
  const switchMode = (0, import_react11.useCallback)(
    (nextMode) => {
      if (busy || nextMode === modeRef.current) return;
      setMode(nextMode);
      modeRef.current = nextMode;
      load(nextMode);
    },
    [busy, load]
  );
  const submit = (0, import_react11.useCallback)(async () => {
    if (!item || item.done || busy || res) return;
    if (cells.some((c) => !c)) return;
    setBusy(true);
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
    } catch (e) {
      setError(e.message || "判分失败");
    } finally {
      setBusy(false);
    }
  }, [item, cells, busy, res]);
  const markMastered = (0, import_react11.useCallback)(async () => {
    if (!item || item.done || busy) return;
    setBusy(true);
    setError("");
    try {
      const r = await api("/word/master", {
        method: "POST",
        body: JSON.stringify({ id: item.id, word: res && res.reference || "" })
      });
      if (r.srsStats) setSrsStats(r.srsStats);
      if (r.summary) store.setStats(r.summary);
      inFlight.current = false;
      setBusy(false);
      load(modeRef.current);
    } catch (e) {
      setError(e.message || "操作失败");
      setBusy(false);
    }
  }, [item, res, busy, load]);
  const retry = (0, import_react11.useCallback)(() => {
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
  const toggleReveal = (0, import_react11.useCallback)(() => {
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
  const liveStats = srsStats || shared.stats && shared.stats.wordSrs || null;
  const dueCount = liveStats ? Number(liveStats.due) || 0 : 0;
  const learningCount = liveStats ? Number(liveStats.learning) || 0 : 0;
  const masteredCount = liveStats ? Number(liveStats.mastered) || 0 : 0;
  const bankLabel = shortBankName(item && item.bankName || shared.stats && shared.stats.wordBank && shared.stats.wordBank.name || "");
  const shownMode = MODES.find((m) => m.id === (hoverMode || mode)) || MODES[0];
  const topBar = import_react11.default.createElement(
    "div",
    { className: "eg-srs-bar", "data-nodrag": "true" },
    import_react11.default.createElement(
      "div",
      {
        className: "eg-srs-modes",
        role: "tablist",
        "aria-label": "出词模式",
        onMouseLeave: () => setHoverMode("")
      },
      MODES.map(
        (m) => import_react11.default.createElement(
          "button",
          {
            key: m.id,
            type: "button",
            role: "tab",
            "aria-selected": mode === m.id ? "true" : "false",
            className: "eg-srs-mode" + (mode === m.id ? " active" : ""),
            title: m.title,
            disabled: busy,
            onMouseEnter: () => setHoverMode(m.id),
            onFocus: () => setHoverMode(m.id),
            onBlur: () => setHoverMode((prev) => prev === m.id ? "" : prev),
            onClick: () => switchMode(m.id)
          },
          m.label,
          m.id === "review" && dueCount > 0 ? import_react11.default.createElement("span", { className: "eg-srs-due" }, String(dueCount)) : null
        )
      )
    ),
    import_react11.default.createElement("div", { className: "eg-srs-hint" }, shownMode.title),
    liveStats || bankLabel ? import_react11.default.createElement(
      "div",
      { className: "eg-srs-meta", title: "词库可在「设置 → 单词词库」切换" },
      [
        bankLabel,
        liveStats ? "学习中 " + learningCount : "",
        liveStats ? "已掌握 " + masteredCount : ""
      ].filter(Boolean).join(" · ")
    ) : null
  );
  if (!item) {
    return import_react11.default.createElement(
      "div",
      { className: "eg-word" },
      topBar,
      import_react11.default.createElement(
        "div",
        { className: "eg-word-main" },
        error ? import_react11.default.createElement("div", { className: "eg-err" }, error) : import_react11.default.createElement(
          "div",
          { className: "eg-loading" },
          import_react11.default.createElement("span", { className: "eg-spin" }),
          "正在取词…"
        ),
        error ? import_react11.default.createElement(
          "div",
          { className: "eg-foot" },
          import_react11.default.createElement("button", { className: "eg-btn primary", onClick: () => load(), disabled: busy }, "重试")
        ) : null
      )
    );
  }
  if (item.done) {
    return import_react11.default.createElement(
      "div",
      { className: "eg-word" },
      topBar,
      import_react11.default.createElement(
        "div",
        { className: "eg-word-main" },
        import_react11.default.createElement(
          "div",
          { className: "eg-srs-done" },
          import_react11.default.createElement("div", { className: "eg-srs-done-title" }, "到期单词已全部复习完成"),
          import_react11.default.createElement(
            "div",
            { className: "eg-srs-done-sub" },
            (bankLabel ? bankLabel + "：" : "当前词库：") + "学习中 " + learningCount + " 词 · 已掌握 " + masteredCount + " 词"
          ),
          import_react11.default.createElement(
            "button",
            {
              type: "button",
              className: "eg-btn primary",
              disabled: busy,
              onClick: () => switchMode("smart")
            },
            "切回智能模式继续学习"
          )
        )
      )
    );
  }
  const answered = !!res;
  const ok = answered && !!res.correct;
  const target = String(res && res.reference || "").toLowerCase();
  const letterGap = cells.length > 7 ? 8 : 10;
  const letterFont = cells.length > 12 ? 15 : cells.length > 9 ? 17 : 22;
  const cellsNodes = cells.map((ch, i) => {
    let cls = "eg-letter";
    if (answered) cls += ok ? " ok" : " bad";
    return import_react11.default.createElement("input", {
      key: i,
      ref: (el) => {
        refs.current[i] = el;
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
      onChange: (e) => setCell(i, e.target.value),
      onKeyDown: (e) => onKey(i, e)
    });
  });
  const srsInfo = item.srs || null;
  const srsStage = srsInfo ? Number(srsInfo.stage) || 0 : 0;
  const srsMax = srsInfo && Number(srsInfo.maxStage) || 9;
  const showDots = srsInfo && srsInfo.kind !== "new" && srsStage > 0;
  const cleanMeaning = formatMeaning(item.zh);
  const meaningClass = "eg-zh" + (cleanMeaning.length > 28 ? " is-xlong" : cleanMeaning.length > 16 ? " is-long" : "");
  const footerActions = answered ? import_react11.default.createElement(
    "div",
    { className: "eg-word-foot" },
    ok ? [
      import_react11.default.createElement(
        "button",
        { key: "next", className: "eg-btn primary", onClick: () => load(), disabled: busy, title: "回车继续", "aria-keyshortcuts": "Enter" },
        "下一个"
      ),
      !(res.srs && res.srs.mastered) ? import_react11.default.createElement(
        "button",
        { key: "master", className: "eg-btn", onClick: markMastered, disabled: busy, title: "太简单，直接标为已掌握" },
        "已掌握"
      ) : null
    ] : [
      import_react11.default.createElement("button", { key: "retry", className: "eg-btn primary", onClick: retry, disabled: busy }, "再试一次"),
      import_react11.default.createElement(
        "button",
        {
          key: "reveal",
          className: "eg-btn",
          onClick: toggleReveal,
          disabled: busy,
          "aria-expanded": revealed ? "true" : "false"
        },
        revealed ? "收起答案" : "显示答案"
      ),
      import_react11.default.createElement("button", { key: "next", className: "eg-btn", onClick: () => load(), disabled: busy }, "下一个")
    ]
  ) : item ? import_react11.default.createElement(
    "div",
    { className: "eg-word-foot" },
    import_react11.default.createElement(
      "button",
      {
        className: "eg-btn primary" + (busy ? " is-loading" : ""),
        onClick: submit,
        onPointerDown: bounceButton,
        disabled: busy || cells.some((c) => !c)
      },
      "提交"
    ),
    import_react11.default.createElement("button", { className: "eg-btn", onClick: () => load(), disabled: busy }, "换一个"),
    import_react11.default.createElement(
      "button",
      { className: "eg-btn", onClick: markMastered, disabled: busy, title: "太简单，直接标为已掌握" },
      "已掌握"
    ),
    import_react11.default.createElement(
      "span",
      { className: "eg-kbd", title: "回车提交" },
      import_react11.default.createElement("kbd", null, "↵")
    )
  ) : null;
  return import_react11.default.createElement(
    "div",
    { className: "eg-word" },
    topBar,
    import_react11.default.createElement(
      "div",
      { className: "eg-word-main" },
      import_react11.default.createElement(
        "div",
        { className: "eg-word-stage", key: item.id },
        import_react11.default.createElement(
          "div",
          { className: "eg-word-meta" },
          item.pos ? import_react11.default.createElement("span", { className: "eg-pos-text", title: "词性提示" }, formatPos(item.pos)) : null,
          item.pos ? import_react11.default.createElement("span", { className: "eg-meta-sep", "aria-hidden": "true" }, "·") : null,
          import_react11.default.createElement(
            "span",
            { className: "eg-srs-tag" + (srsInfo && srsInfo.kind === "review" ? " is-review" : "") },
            stageLabel(srsInfo),
            showDots ? import_react11.default.createElement(
              "span",
              { className: "eg-srs-dots", "aria-hidden": "true" },
              Array.from(
                { length: srsMax },
                (_, idx) => import_react11.default.createElement("i", { key: idx, className: "eg-srs-dot" + (idx < srsStage ? " on" : "") })
              )
            ) : null
          )
        ),
        import_react11.default.createElement("div", { className: meaningClass }, cleanMeaning),
        !answered ? import_react11.default.createElement(ExampleBlock, { example: item.example }) : null,
        import_react11.default.createElement(
          "div",
          {
            className: "eg-letters" + (answered ? " answered" + (ok ? " is-ok" : " is-bad") : ""),
            style: { gap: letterGap }
          },
          cellsNodes
        ),
        error ? import_react11.default.createElement("div", { className: "eg-err" }, error) : null,
        answered ? ok ? import_react11.default.createElement(
          "div",
          { className: "eg-fb ok" },
          import_react11.default.createElement(
            "div",
            { className: "eg-fb-top" },
            import_react11.default.createElement("span", { className: "eg-fb-status" }, "拼对了"),
            res.srs && res.srs.nextReviewText ? import_react11.default.createElement("span", { className: "eg-srs-next" }, res.srs.nextReviewText) : null
          ),
          import_react11.default.createElement(
            "div",
            { className: "eg-fb-ref" },
            import_react11.default.createElement("span", { className: "lbl" }, "正确拼写"),
            res.reference
          ),
          import_react11.default.createElement(ExampleBlock, {
            example: res.example,
            exampleZh: res.exampleZh,
            word: res.reference,
            highlight: true
          })
        ) : import_react11.default.createElement(
          "div",
          { className: "eg-fb bad" },
          !revealed ? import_react11.default.createElement("div", { className: "eg-word-miss" }, "拼写有误，可再试一次或查看答案 · 5 分钟后再次巩固") : null,
          import_react11.default.createElement(
            "div",
            {
              className: "eg-collapse eg-word-reveal" + (revealed ? " open" : ""),
              "aria-hidden": revealed ? "false" : "true"
            },
            import_react11.default.createElement(
              "div",
              { className: "eg-collapse-inner" },
              import_react11.default.createElement(
                "div",
                { className: "eg-fb-ref" },
                import_react11.default.createElement("span", { className: "lbl" }, "正确拼写"),
                res.reference
              ),
              import_react11.default.createElement(ExampleBlock, {
                example: res.example,
                exampleZh: res.exampleZh,
                word: res.reference,
                highlight: true
              })
            )
          )
        ) : null
      )
    ),
    footerActions
  );
}

// src/client/features/report/useDailyReport.js
var import_react12 = require("react");
function useDailyReport({ open, active }) {
  const [report, setReport] = (0, import_react12.useState)(null);
  const [loading, setLoading] = (0, import_react12.useState)(false);
  const [error, setError] = (0, import_react12.useState)("");
  const staleRef = (0, import_react12.useRef)(false);
  const refresh = (0, import_react12.useCallback)(async (force) => {
    setLoading(true);
    setError("");
    if (force) setReport(null);
    try {
      setReport(force ? await api("/report/refresh", { method: "POST" }) : await api("/report"));
    } catch (e) {
      setError(e.message || "文章加载失败");
    } finally {
      setLoading(false);
    }
  }, []);
  (0, import_react12.useEffect)(() => {
    if (open && active && !report && !loading) {
      const force = staleRef.current;
      staleRef.current = false;
      refresh(force);
    }
  }, [open, active, report, loading, refresh]);
  const invalidate = (0, import_react12.useCallback)(() => {
    setReport(null);
    setError("");
    staleRef.current = true;
  }, []);
  return { report, loading, error, refresh, invalidate };
}

// src/client/features/report/Report.js
var import_react13 = __toESM(require("react"), 1);

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

// src/client/features/report/Report.js
var useIsoLayoutEffect2 = import_react13.default.useLayoutEffect || import_react13.useEffect;
function Report({ report, loading, error, onRefresh }) {
  const [openMap, setOpenMap] = (0, import_react13.useState)({});
  const [active, setActive] = (0, import_react13.useState)(null);
  const [popPos, setPopPos] = (0, import_react13.useState)(null);
  const reportRef = (0, import_react13.useRef)(null);
  const popRef = (0, import_react13.useRef)(null);
  const termRefs = (0, import_react13.useRef)({});
  const closeTimerRef = (0, import_react13.useRef)(null);
  const cancelClose = (0, import_react13.useCallback)(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);
  const scheduleClose = (0, import_react13.useCallback)(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setActive((prev) => prev && !prev.pinned ? null : prev);
    }, 140);
  }, [cancelClose]);
  (0, import_react13.useEffect)(() => {
    cancelClose();
    setOpenMap({});
    setActive(null);
    setPopPos(null);
    termRefs.current = {};
  }, [report, cancelClose]);
  (0, import_react13.useEffect)(() => () => cancelClose(), [cancelClose]);
  (0, import_react13.useEffect)(() => {
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
  const updatePopoverPosition = (0, import_react13.useCallback)(() => {
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
  }, [active]);
  useIsoLayoutEffect2(() => {
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
  }, [active, updatePopoverPosition]);
  const body = report ? String(report.body || "") : "";
  const highlights = report && Array.isArray(report.highlights) ? report.highlights : [];
  const paragraphs = (0, import_react13.useMemo)(() => body.split(/\n{2,}/).filter(Boolean), [body]);
  const { segmentsByParagraph, matchedCount } = (0, import_react13.useMemo)(
    () => segmentReportParagraphs(paragraphs, highlights),
    [paragraphs, highlights]
  );
  if (loading && !report) {
    return import_react13.default.createElement(
      "div",
      { className: "eg-loading is-stage" },
      import_react13.default.createElement("span", { className: "eg-spin" }),
      "正在生成今日文章…"
    );
  }
  if (!report) {
    return import_react13.default.createElement(
      "div",
      null,
      import_react13.default.createElement(
        "div",
        { className: "eg-loading" },
        error ? import_react13.default.createElement("span", { className: "eg-err" }, error) : "暂无文章。"
      ),
      import_react13.default.createElement(
        "div",
        { className: "eg-actions" },
        import_react13.default.createElement("button", { className: "eg-btn primary", onClick: onRefresh }, "生成今日文章")
      )
    );
  }
  const questions = report.questions || [];
  const wordCount = (body.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
  const meta = [
    report.date,
    report.level,
    wordCount ? wordCount + " 词" : "",
    matchedCount ? matchedCount + " 个重点词" : ""
  ].filter(Boolean).join(" · ");
  const handleTermEnter = (seg) => {
    cancelClose();
    setActive((prev) => prev && prev.pinned ? prev : { id: seg.id, item: seg.item, text: seg.text, pinned: false });
  };
  const handleTermLeave = () => {
    scheduleClose();
  };
  const handleTermClick = (e, seg) => {
    const sel = typeof window !== "undefined" && window.getSelection ? window.getSelection() : null;
    if (sel && String(sel).trim()) return;
    e.stopPropagation();
    cancelClose();
    setActive(
      (prev) => prev && prev.pinned && prev.id === seg.id ? null : { id: seg.id, item: seg.item, text: seg.text, pinned: true }
    );
  };
  const handleTermFocus = (seg) => {
    cancelClose();
    setActive((prev) => prev && prev.pinned ? prev : { id: seg.id, item: seg.item, text: seg.text, pinned: false });
  };
  const handleTermBlur = (e) => {
    if (popRef.current && e.relatedTarget && popRef.current.contains(e.relatedTarget)) return;
    setActive((prev) => prev && !prev.pinned ? null : prev);
  };
  const handleTermKeyDown = (e, seg) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      cancelClose();
      setActive(
        (prev) => prev && prev.pinned && prev.id === seg.id ? null : { id: seg.id, item: seg.item, text: seg.text, pinned: true }
      );
    }
  };
  const activePos = active && active.item.pos ? formatPos(active.item.pos) : "";
  const activeLemma = active && active.item.lemma && active.item.lemma.toLowerCase() !== active.text.toLowerCase() ? active.item.lemma : "";
  return import_react13.default.createElement(
    "div",
    { className: "eg-report", ref: reportRef, "data-nodrag": "true" },
    import_react13.default.createElement("div", { className: "r-top" }, import_react13.default.createElement("h2", { className: "eg-rtitle" }, report.title || "Daily Report")),
    import_react13.default.createElement(
      "div",
      { className: "eg-rmeta-row" },
      meta ? import_react13.default.createElement("div", { className: "eg-rmeta" }, meta) : import_react13.default.createElement("span", null),
      import_react13.default.createElement(
        "button",
        {
          type: "button",
          className: "eg-rrefresh",
          onClick: onRefresh,
          disabled: loading,
          title: "重新生成一篇今日文章"
        },
        loading ? "生成中…" : "↻ 换一篇"
      )
    ),
    report.summary_zh ? import_react13.default.createElement("p", { className: "eg-rsum" }, report.summary_zh) : null,
    segmentsByParagraph.map(
      (segs, i) => import_react13.default.createElement(
        "p",
        { key: i, className: "eg-rp" },
        segs.map((seg, j) => {
          if (seg.type !== "term") return seg.text;
          const isActive = !!(active && active.id === seg.id);
          return import_react13.default.createElement(
            "mark",
            {
              key: seg.id + "-" + j,
              ref: (el) => {
                if (el) termRefs.current[seg.id] = el;
                else delete termRefs.current[seg.id];
              },
              className: "eg-rword" + (isActive ? " is-active" : ""),
              role: "button",
              tabIndex: 0,
              "aria-expanded": isActive ? "true" : "false",
              onMouseEnter: () => handleTermEnter(seg),
              onMouseLeave: handleTermLeave,
              onClick: (e) => handleTermClick(e, seg),
              onFocus: () => handleTermFocus(seg),
              onBlur: handleTermBlur,
              onKeyDown: (e) => handleTermKeyDown(e, seg)
            },
            seg.text
          );
        })
      )
    ),
    active ? import_react13.default.createElement(
      "div",
      {
        ref: popRef,
        className: "eg-rpop" + (popPos ? " is-ready" : "") + (popPos && popPos.placement === "below" ? " is-below" : "") + (active.pinned ? " is-pinned" : ""),
        role: active.pinned ? "dialog" : "tooltip",
        "aria-label": active.text + " 释义",
        style: popPos ? {
          left: popPos.left + "px",
          top: popPos.top + "px",
          "--eg-arrow-x": popPos.arrowX + "px"
        } : { left: 0, top: 0 },
        onMouseEnter: cancelClose,
        onMouseLeave: handleTermLeave
      },
      import_react13.default.createElement(
        "div",
        { className: "eg-rpop-head" },
        import_react13.default.createElement(
          "div",
          { className: "eg-rpop-title" },
          import_react13.default.createElement("span", { className: "eg-rpop-word" }, active.text),
          activeLemma ? import_react13.default.createElement("span", { className: "eg-rpop-lemma" }, "→ " + activeLemma) : null
        ),
        active.pinned ? import_react13.default.createElement(
          "button",
          {
            type: "button",
            className: "eg-rpop-close",
            "aria-label": "关闭释义",
            onClick: () => setActive(null)
          },
          "×"
        ) : null
      ),
      activePos || active.item.fromBank ? import_react13.default.createElement(
        "div",
        { className: "eg-rpop-tags" },
        activePos ? import_react13.default.createElement("span", { className: "eg-rpop-pos" }, activePos) : null,
        active.item.fromBank ? import_react13.default.createElement("span", { className: "eg-rpop-bank" }, "词库") : null
      ) : null,
      import_react13.default.createElement("div", { className: "eg-rpop-zh" }, active.item.zh)
    ) : null,
    questions.length ? import_react13.default.createElement(
      "div",
      { className: "eg-practice" },
      import_react13.default.createElement("div", { className: "eg-ptitle" }, "练一练"),
      questions.map((q, i) => {
        const isOpen = !!openMap[i];
        return import_react13.default.createElement(
          "div",
          { key: i, className: "eg-q" + (isOpen ? " reveal" : "") },
          import_react13.default.createElement(
            "div",
            { className: "eg-q-head" },
            import_react13.default.createElement("span", { className: "eg-q-n" }, String(i + 1)),
            import_react13.default.createElement("span", { className: "eg-q-zh" }, q.zh)
          ),
          import_react13.default.createElement(
            "button",
            {
              className: "eg-q-toggle",
              type: "button",
              "aria-expanded": isOpen ? "true" : "false",
              onClick: () => setOpenMap((prev) => ({ ...prev, [i]: !prev[i] }))
            },
            import_react13.default.createElement("span", { className: "caret", "aria-hidden": "true" }, "▸"),
            isOpen ? "收起参考" : "看参考"
          ),
          import_react13.default.createElement(
            "div",
            { className: "eg-collapse" + (isOpen ? " open" : ""), "aria-hidden": isOpen ? "false" : "true" },
            import_react13.default.createElement(
              "div",
              { className: "eg-collapse-inner" },
              import_react13.default.createElement("div", { className: "eg-q-en" }, q.en)
            )
          )
        );
      })
    ) : null,
    import_react13.default.createElement(
      "div",
      { className: "eg-report-foot" },
      import_react13.default.createElement(
        "span",
        { className: "eg-report-foot-hint" },
        matchedCount ? "标黄词可悬停或点击查译，可随时换一篇" : "按当前内容方向生成，可随时换一篇"
      ),
      import_react13.default.createElement(
        "button",
        {
          type: "button",
          className: "eg-btn",
          onClick: onRefresh,
          onPointerDown: bounceButton,
          disabled: loading
        },
        loading ? "生成中…" : "↻ 换一篇"
      )
    )
  );
}

// src/client/features/dashboard/Dashboard.js
var import_react14 = __toESM(require("react"), 1);

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
    rangeDays
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

// src/client/features/dashboard/Dashboard.js
var WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
var DOW_LABELS = ["", "一", "", "三", "", "五", ""];
var PAGE_SIZE = 5;
var useIsoLayoutEffect3 = import_react14.default.useLayoutEffect || import_react14.useEffect;
var cachedDashboard = null;
function invalidateDashboardCache() {
  cachedDashboard = null;
}
function Dashboard() {
  const [data, setData] = (0, import_react14.useState)(() => cachedDashboard);
  const [loading, setLoading] = (0, import_react14.useState)(() => !cachedDashboard);
  const [error, setError] = (0, import_react14.useState)("");
  const [range, setRange] = (0, import_react14.useState)("last-year");
  const [page, setPage] = (0, import_react14.useState)(1);
  const [expanded, setExpanded] = (0, import_react14.useState)({});
  const [flashDay, setFlashDay] = (0, import_react14.useState)("");
  const [tip, setTip] = (0, import_react14.useState)(null);
  const flashTimerRef = (0, import_react14.useRef)(null);
  const closeTimersRef = (0, import_react14.useRef)({});
  const pendingJumpRef = (0, import_react14.useRef)("");
  const cardRef = (0, import_react14.useRef)(null);
  const scrollRef = (0, import_react14.useRef)(null);
  const histHeadRef = (0, import_react14.useRef)(null);
  const WORD_LIMIT = 5;
  const PHRASE_LIMIT = 3;
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
  (0, import_react14.useEffect)(() => {
    return () => {
      clearTimeout(flashTimerRef.current);
      const timers = closeTimersRef.current;
      for (const k of Object.keys(timers)) clearTimeout(timers[k]);
    };
  }, []);
  const load = (0, import_react14.useCallback)(async () => {
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
  (0, import_react14.useEffect)(() => {
    load();
  }, [load]);
  const activity = (0, import_react14.useMemo)(() => {
    const map = {};
    if (data && Array.isArray(data.activity)) {
      for (const a of data.activity) map[a.day] = a;
    }
    return map;
  }, [data]);
  const records = (0, import_react14.useMemo)(() => data && Array.isArray(data.days) ? data.days : [], [data]);
  const filteredRecords = (0, import_react14.useMemo)(() => {
    if (/^\d{4}$/.test(range)) return records.filter((r) => String(r.day || "").startsWith(range + "-"));
    return records;
  }, [records, range]);
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const pageRecords = (0, import_react14.useMemo)(
    () => filteredRecords.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredRecords, safePage]
  );
  const pageItems = (0, import_react14.useMemo)(() => getPageItems(totalPages, safePage), [totalPages, safePage]);
  const today = data ? data.today : null;
  const streak = data ? data.streak || 0 : 0;
  const totals = data && data.totals ? data.totals : { days: 0, words: 0, phrases: 0 };
  const years = (0, import_react14.useMemo)(() => {
    const set = /* @__PURE__ */ new Set();
    const currentYear = (today || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)).slice(0, 4);
    if (/^\d{4}$/.test(currentYear)) set.add(currentYear);
    for (const key of Object.keys(activity)) {
      const y = key.slice(0, 4);
      if (/^\d{4}$/.test(y)) set.add(y);
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a)).slice(0, 4);
  }, [activity, today]);
  const grid = (0, import_react14.useMemo)(
    () => buildContributionGrid({ todayStr: today, range, activityMap: activity }),
    [today, range, activity]
  );
  useIsoLayoutEffect3(() => {
    setTip(null);
    setPage(1);
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [range, data]);
  const scrollAndFlash = (0, import_react14.useCallback)((day) => {
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
  (0, import_react14.useEffect)(() => {
    const pendingDay = pendingJumpRef.current;
    if (!pendingDay) return;
    if (!pageRecords.some((r) => r.day === pendingDay)) return;
    pendingJumpRef.current = "";
    scrollAndFlash(pendingDay);
  }, [safePage, pageRecords, scrollAndFlash]);
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
  const recordNodes = pageRecords.map((rec) => {
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
    const moreBtn = (key, total, limit, state) => total > limit ? import_react14.default.createElement(
      "button",
      {
        className: "eg-more",
        key: "more",
        "aria-expanded": state === "open" ? "true" : "false",
        onClick: () => toggleGroup(key, total - limit)
      },
      state === "open" ? "收起" : "展开全部 · 共 " + total + " 条"
    ) : null;
    const renderWordChip = (w, key, animCls, animStyle) => import_react14.default.createElement(
      "span",
      {
        className: "eg-wchip " + (w.ok ? "ok" : "bad") + animCls,
        style: animStyle,
        key,
        title: w.ok ? "拼对了" : "没拼对"
      },
      import_react14.default.createElement("span", { className: "w" }, w.en),
      w.zh ? import_react14.default.createElement("span", { className: "m" }, w.zh) : null
    );
    const renderPhraseRow = (p, key, animCls, animStyle) => import_react14.default.createElement(
      "div",
      {
        className: "eg-sent " + (p.ok ? "ok" : "bad") + animCls,
        style: animStyle,
        key
      },
      import_react14.default.createElement("span", { className: "mark" }, p.ok ? "✓" : "✗"),
      import_react14.default.createElement(
        "div",
        { className: "body" },
        import_react14.default.createElement("div", { className: "zh" }, p.zh),
        p.en ? import_react14.default.createElement("div", { className: "en" }, p.en) : null
      )
    );
    return import_react14.default.createElement(
      "div",
      { className: "eg-hist-day" + (flashDay === rec.day ? " is-flash" : ""), id: "eg-hist-" + rec.day, key: rec.day },
      import_react14.default.createElement(
        "div",
        { className: "eg-hist-head" },
        import_react14.default.createElement(
          "div",
          { className: "eg-hist-date" },
          dt.getMonth() + 1 + "月" + dt.getDate() + "日",
          import_react14.default.createElement("span", { className: "wd" }, "周" + wd)
        ),
        import_react14.default.createElement("div", { className: "eg-hist-count" }, "单词 " + (t.words || 0) + " · 句子 " + (t.phrases || 0))
      ),
      allWords.length ? import_react14.default.createElement(
        "div",
        null,
        import_react14.default.createElement("div", { className: "eg-hist-sub" }, "单词"),
        import_react14.default.createElement(
          "div",
          { className: "eg-wchips" },
          headWords.map((w, i) => renderWordChip(w, "w" + i, "", void 0))
        ),
        extraWords.length && (wState === "open" || wState === "closing") ? import_react14.default.createElement(
          "div",
          {
            className: "eg-extra-collapse" + (wState === "open" ? " open" : ""),
            "aria-hidden": wState === "open" ? "false" : "true"
          },
          import_react14.default.createElement(
            "div",
            { className: "eg-extra-inner" },
            import_react14.default.createElement(
              "div",
              { className: "eg-wchips eg-extra-wchips" },
              extraWords.map((w, idx) => {
                const animCls = wState === "open" ? " is-enter" : " is-leave";
                const animStyle = wState === "open" ? { "--i": Math.min(idx, 18) } : { "--ri": Math.min(extraWords.length - 1 - idx, 8) };
                return renderWordChip(w, "we" + idx, animCls, animStyle);
              })
            )
          )
        ) : null,
        moreBtn(wKey, allWords.length, WORD_LIMIT, wState)
      ) : null,
      allPhrases.length ? import_react14.default.createElement(
        "div",
        null,
        import_react14.default.createElement("div", { className: "eg-hist-sub" }, "句子"),
        import_react14.default.createElement(
          "div",
          { className: "eg-sents" },
          headPhrases.map((p, i) => renderPhraseRow(p, "p" + i, "", void 0))
        ),
        extraPhrases.length && (pState === "open" || pState === "closing") ? import_react14.default.createElement(
          "div",
          {
            className: "eg-extra-collapse" + (pState === "open" ? " open" : ""),
            "aria-hidden": pState === "open" ? "false" : "true"
          },
          import_react14.default.createElement(
            "div",
            { className: "eg-extra-inner" },
            import_react14.default.createElement(
              "div",
              { className: "eg-sents eg-extra-sents" },
              extraPhrases.map((p, idx) => {
                const animCls = pState === "open" ? " is-enter" : " is-leave";
                const animStyle = pState === "open" ? { "--i": Math.min(idx, 12) } : { "--ri": Math.min(extraPhrases.length - 1 - idx, 8) };
                return renderPhraseRow(p, "pe" + idx, animCls, animStyle);
              })
            )
          )
        ) : null,
        moreBtn(pKey, allPhrases.length, PHRASE_LIMIT, pState)
      ) : null
    );
  });
  if (loading && !data) {
    return import_react14.default.createElement(
      "div",
      { className: "eg-dash" },
      import_react14.default.createElement("div", { className: "eg-loading" }, import_react14.default.createElement("span", { className: "eg-spin" }), "正在加载看板…")
    );
  }
  const rangeLabel = range === "last-year" ? "近一年" : range + " 年";
  const tipCell = tip ? tip.cell : null;
  const tipAct = tipCell && tipCell.activity;
  const tipText = tipCell ? tipAct ? tipCell.key + " · 单词 " + tipAct.words + " · 句子 " + tipAct.phrases : tipCell.key + " · 无学习记录" : "";
  return import_react14.default.createElement(
    "div",
    { className: "eg-dash" },
    import_react14.default.createElement(
      "div",
      { className: "eg-dash-top" },
      import_react14.default.createElement("div", { className: "eg-dash-title" }, "学习看板"),
      import_react14.default.createElement(
        "div",
        { className: "eg-dash-ranges", role: "tablist", "aria-label": "统计范围" },
        import_react14.default.createElement(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": range === "last-year" ? "true" : "false",
            className: "eg-rangebtn" + (range === "last-year" ? " active" : ""),
            onClick: () => setRange("last-year")
          },
          "近一年"
        ),
        years.map(
          (y) => import_react14.default.createElement(
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
          )
        )
      )
    ),
    import_react14.default.createElement(
      "div",
      { className: "eg-dash-sum" },
      import_react14.default.createElement("div", { className: "eg-stat" }, import_react14.default.createElement("b", null, streak), import_react14.default.createElement("span", { title: "连续学习天数" }, "连续")),
      import_react14.default.createElement("div", { className: "eg-stat" }, import_react14.default.createElement("b", null, totals.words || 0), import_react14.default.createElement("span", { title: "累计单词" }, "单词")),
      import_react14.default.createElement("div", { className: "eg-stat" }, import_react14.default.createElement("b", null, totals.phrases || 0), import_react14.default.createElement("span", { title: "累计句子" }, "句子")),
      import_react14.default.createElement("div", { className: "eg-stat" }, import_react14.default.createElement("b", null, totals.days || 0), import_react14.default.createElement("span", { title: "累计学习天数" }, "累计"))
    ),
    import_react14.default.createElement(
      "div",
      { className: "eg-cal-card", ref: cardRef, "data-nodrag": "true" },
      import_react14.default.createElement(
        "div",
        { className: "eg-gh-head" },
        rangeLabel + "共完成 " + grid.rangeTotal + " 项练习 · " + grid.rangeDays + " 天"
      ),
      import_react14.default.createElement(
        "div",
        { className: "eg-gh-wrap" },
        import_react14.default.createElement(
          "div",
          { className: "eg-gh-dows", "aria-hidden": "true" },
          DOW_LABELS.map((lbl, i) => import_react14.default.createElement("span", { key: i }, lbl))
        ),
        import_react14.default.createElement(
          "div",
          { className: "eg-gh-scroll", ref: scrollRef },
          import_react14.default.createElement(
            "div",
            { className: "eg-gh-inner" },
            import_react14.default.createElement(
              "div",
              { className: "eg-gh-months", style: { width: grid.weeks.length * 11 - 2 + "px" } },
              grid.monthLabels.map(
                (m) => import_react14.default.createElement(
                  "span",
                  { key: m.col, className: "eg-gh-month", style: { left: m.col * 11 + "px" } },
                  m.label
                )
              )
            ),
            import_react14.default.createElement(
              "div",
              { className: "eg-gh-grid", role: "grid", "aria-label": rangeLabel + "学习热力图" },
              grid.weeks.map(
                (week, ci) => import_react14.default.createElement(
                  "div",
                  { className: "eg-gh-col", key: ci },
                  week.map((cell, ri) => {
                    if (cell.out) {
                      return import_react14.default.createElement("span", { className: "eg-gh-cell out", key: ri, "aria-hidden": "true" });
                    }
                    const has = Boolean(cell.activity && cell.activity.total > 0);
                    const cls = ["eg-gh-cell", "l" + cell.level];
                    if (has) cls.push("has");
                    if (cell.isToday) cls.push("today");
                    return import_react14.default.createElement("button", {
                      key: cell.key,
                      type: "button",
                      className: cls.join(" "),
                      "aria-label": cell.activity ? cell.key + " 单词 " + cell.activity.words + " 句子 " + cell.activity.phrases : cell.key + " 无学习记录",
                      onMouseEnter: (e) => showTip(e, cell),
                      onMouseLeave: hideTip,
                      onFocus: (e) => showTip(e, cell),
                      onBlur: hideTip,
                      onClick: has ? () => jumpTo(cell.key) : void 0
                    });
                  })
                )
              )
            )
          )
        )
      ),
      import_react14.default.createElement(
        "div",
        { className: "eg-gh-foot" },
        import_react14.default.createElement("span", { className: "eg-gh-hint" }, "点击绿色方块定位当日记录"),
        import_react14.default.createElement(
          "div",
          { className: "eg-dash-legend" },
          "少",
          import_react14.default.createElement("i", { className: "l0" }),
          import_react14.default.createElement("i", { className: "l1" }),
          import_react14.default.createElement("i", { className: "l2" }),
          import_react14.default.createElement("i", { className: "l3" }),
          import_react14.default.createElement("i", { className: "l4" }),
          "多"
        )
      ),
      tip ? import_react14.default.createElement(
        "div",
        {
          className: "eg-gh-tip",
          role: "tooltip",
          style: { left: tip.x + "px", top: tip.y + "px" }
        },
        tipText
      ) : null
    ),
    error ? import_react14.default.createElement("div", { className: "eg-dash-error" }, error) : null,
    filteredRecords.length ? import_react14.default.createElement(
      "div",
      null,
      import_react14.default.createElement(
        "div",
        { className: "eg-hist-bar", ref: histHeadRef },
        import_react14.default.createElement("div", { className: "eg-hist-title" }, "每日学习记录"),
        import_react14.default.createElement(
          "div",
          { className: "eg-hist-meta" },
          "共 " + filteredRecords.length + " 天" + (totalPages > 1 ? " · 第 " + safePage + " / " + totalPages + " 页" : "")
        )
      ),
      import_react14.default.createElement("div", { className: "eg-hist" }, recordNodes),
      totalPages > 1 ? import_react14.default.createElement(
        "div",
        { className: "eg-pager", role: "navigation", "aria-label": "学习记录分页" },
        import_react14.default.createElement(
          "button",
          {
            type: "button",
            className: "eg-pagebtn",
            disabled: safePage <= 1,
            onClick: () => goPage(safePage - 1)
          },
          "‹ 上一页"
        ),
        pageItems.map(
          (it, i) => it === "..." ? import_react14.default.createElement("span", { className: "eg-page-dots", key: "dots-" + i }, "…") : import_react14.default.createElement(
            "button",
            {
              type: "button",
              key: it,
              className: "eg-pagebtn" + (it === safePage ? " active" : ""),
              "aria-current": it === safePage ? "page" : void 0,
              onClick: () => goPage(it)
            },
            String(it)
          )
        ),
        import_react14.default.createElement(
          "button",
          {
            type: "button",
            className: "eg-pagebtn",
            disabled: safePage >= totalPages,
            onClick: () => goPage(safePage + 1)
          },
          "下一页 ›"
        )
      ) : null
    ) : import_react14.default.createElement(
      "div",
      { className: "eg-dash-empty" },
      loading ? "正在加载…" : records.length ? range + " 年还没有详细学习记录。" : "还没有学习记录，去练几题吧。"
    )
  );
}

// src/client/features/settings/SettingsPanel.js
var import_react16 = __toESM(require("react"), 1);

// src/client/features/word/WordBankImport.js
var import_react15 = __toESM(require("react"), 1);
var h2 = import_react15.default.createElement;
function WordBankImport({ onClose, onImported }) {
  const [name, setName] = (0, import_react15.useState)("");
  const [filename, setFilename] = (0, import_react15.useState)("");
  const [content, setContent] = (0, import_react15.useState)("");
  const [preview, setPreview] = (0, import_react15.useState)(null);
  const [busy, setBusy] = (0, import_react15.useState)(false);
  const [error, setError] = (0, import_react15.useState)("");
  const [over, setOver] = (0, import_react15.useState)(false);
  const fileRef = (0, import_react15.useRef)(null);
  const readFile = (0, import_react15.useCallback)(async (file) => {
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
  const doPreview = (0, import_react15.useCallback)(async () => {
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
  const doImport = (0, import_react15.useCallback)(async () => {
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
  return h2(
    "div",
    { className: "eg-import", "data-nodrag": "true" },
    h2(
      "div",
      { className: "eg-import-head" },
      h2(
        "div",
        null,
        h2("div", { className: "eg-import-title" }, "导入词库"),
        h2("div", { className: "eg-import-sub" }, "CSV/TSV/TXT/JSON")
      ),
      h2(
        "div",
        { className: "eg-import-actions" },
        h2(
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
        ),
        h2("button", { className: "eg-import-back", onClick: onClose }, "← 返回")
      )
    ),
    h2(
      "div",
      { className: "eg-field" },
      h2("label", { htmlFor: "eg-bank-name" }, "词库名称"),
      h2("input", {
        id: "eg-bank-name",
        className: "eg-text",
        value: name,
        maxLength: 60,
        placeholder: "例如：CET-6 核心词",
        onChange: (e) => setName(e.target.value)
      })
    ),
    h2(
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
      h2("textarea", {
        className: "eg-textarea",
        value: content,
        placeholder: "把 CSV / TSV / TXT / JSON 内容粘贴到这里，或把文件拖进来…",
        onChange: (e) => {
          setContent(e.target.value);
          setFilename("");
          setPreview(null);
        }
      }),
      h2("input", {
        ref: fileRef,
        type: "file",
        accept: ".csv,.tsv,.txt,.json,text/csv,text/tab-separated-values,application/json",
        style: { display: "none" },
        onChange: (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) readFile(file);
          e.target.value = "";
        }
      })
    ),
    h2(
      "div",
      { className: "eg-import-foot" },
      h2(
        "button",
        { className: "eg-btn primary", onClick: doPreview, disabled: busy || !content.trim() },
        busy ? "解析中…" : "解析预览"
      ),
      h2(
        "button",
        { className: "eg-btn ghost", onClick: doImport, disabled: busy || !preview || !preview.valid },
        preview && preview.valid ? "导入 " + preview.valid + " 条" : "导入"
      )
    ),
    error ? h2("div", { className: "eg-err" }, error) : null,
    preview ? h2(
      "div",
      null,
      h2(
        "div",
        { className: "eg-preview" },
        h2(
          "div",
          { className: "eg-preview-top" },
          h2("strong", null, "识别到 " + preview.valid + " 条"),
          h2(
            "span",
            null,
            String(preview.format || "").toUpperCase() + (preview.hasHeader ? " · 含表头" : "") + (preview.skippedCount ? " · 跳过 " + preview.skippedCount + " 行" : "")
          )
        ),
        (preview.sample || []).map(
          (item, i) => h2(
            "div",
            { className: "eg-preview-row", key: i },
            h2("span", { className: "w" }, item.word),
            h2("span", { className: "m" }, item.meaning),
            item.example ? h2("span", { className: "ex" }, item.example) : null
          )
        )
      ),
      preview.errors && preview.errors.length ? h2(
        "div",
        { className: "eg-preview-errors" },
        preview.errors.map((e, i) => h2("div", { className: "er", key: i }, "第 " + e.line + " 行：" + e.reason))
      ) : null
    ) : null
  );
}

// src/client/features/settings/SettingsPanel.js
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
var CLEANUP_RANGES = [
  { id: "7d", label: "7 天前" },
  { id: "30d", label: "30 天前" },
  { id: "90d", label: "90 天前" },
  { id: "365d", label: "一年前" },
  { id: "all", label: "全部记录" }
];
function SettingsPanel({ onTopicChange, onPhraseConfigChange, onReportConfigChange, onWordBankChange, onDataCleared }) {
  const shared = useShared();
  const [data, setData] = (0, import_react16.useState)(() => cachedSettings);
  const [bankData, setBankData] = (0, import_react16.useState)(() => cachedBanks);
  const [importing, setImporting] = (0, import_react16.useState)(false);
  const [bankNotice, setBankNotice] = (0, import_react16.useState)("");
  const [cleanRange, setCleanRange] = (0, import_react16.useState)("30d");
  const [clearMemory, setClearMemory] = (0, import_react16.useState)(false);
  const [cleanPreview, setCleanPreview] = (0, import_react16.useState)(null);
  const [cleanBusy, setCleanBusy] = (0, import_react16.useState)(false);
  const [cleanNotice, setCleanNotice] = (0, import_react16.useState)("");
  const [adding, setAdding] = (0, import_react16.useState)(false);
  const [error, setError] = (0, import_react16.useState)("");
  const [draft, setDraft] = (0, import_react16.useState)("");
  const [hoverLevel, setHoverLevel] = (0, import_react16.useState)("");
  const [loading, setLoading] = (0, import_react16.useState)(() => !cachedSettings);
  const queueRef = (0, import_react16.useRef)(Promise.resolve());
  const seqRef = (0, import_react16.useRef)(0);
  const lastConfirmedRef = (0, import_react16.useRef)(cachedSettings);
  const load = (0, import_react16.useCallback)(async () => {
    if (!cachedSettings) setLoading(true);
    try {
      const [settingsRes, banksRes] = await Promise.all([
        api("/settings"),
        api("/wordbanks").catch(() => null)
      ]);
      cachedSettings = settingsRes;
      lastConfirmedRef.current = settingsRes;
      setData(settingsRes);
      store.setSettings(settingsRes.settings);
      if (banksRes && Array.isArray(banksRes.banks)) {
        cachedBanks = banksRes;
        setBankData(banksRes);
      }
      setError("");
    } catch (e) {
      setError(e.message || "设置加载失败");
    } finally {
      setLoading(false);
    }
  }, []);
  (0, import_react16.useEffect)(() => {
    load();
  }, [load]);
  const save = (0, import_react16.useCallback)(
    (patch, changeScope) => {
      const seq = ++seqRef.current;
      setError("");
      const scalarPatch = {};
      for (const key of ["confetti", "sessionLink", "bankLink", "bankRetries", "reportLevel", "topicId"]) {
        if (patch && patch[key] !== void 0) scalarPatch[key] = patch[key];
      }
      if (Object.keys(scalarPatch).length) {
        store.setSettings(scalarPatch);
        setData((prev) => {
          if (!prev || !prev.settings) return prev;
          const next = { ...prev, settings: { ...prev.settings, ...scalarPatch } };
          cachedSettings = next;
          return next;
        });
      }
      const task = queueRef.current.then(async () => {
        try {
          const result = await api("/settings", {
            method: "POST",
            body: JSON.stringify(patch)
          });
          lastConfirmedRef.current = result;
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
  const customTopics = settings.customTopics || [];
  const activeId = settings.topicId;
  const activeLevel = settings.reportLevel || "B1";
  const chooseDirection = (id) => {
    if (id === activeId) return;
    save({ topicId: id }, true);
  };
  const chooseReportLevel = (id) => {
    if (id === activeLevel) return;
    save({ reportLevel: id }, "report");
  };
  const addCustom = async () => {
    const label = draft.trim();
    if (!label || adding) return;
    setAdding(true);
    try {
      const ok = await save({ customTopics: customTopics.concat({ label }) }, true);
      if (ok) setDraft("");
    } finally {
      setAdding(false);
    }
  };
  const removeCustom = (id) => {
    save({ customTopics: customTopics.filter((item) => item.id !== id) }, true);
  };
  const setRetries = (value) => {
    const next = Math.max(0, Math.min(5, Number(value) || 0));
    if (next === settings.bankRetries) return;
    save({ bankRetries: next }, false);
  };
  if (loading && !data) {
    return import_react16.default.createElement(
      "div",
      { className: "eg-settings" },
      import_react16.default.createElement(
        "div",
        { className: "eg-settings-loading" },
        import_react16.default.createElement("span", { className: "eg-spin" }),
        "正在加载设置…"
      ),
      error ? import_react16.default.createElement("div", { className: "eg-settings-error" }, error) : null
    );
  }
  const builtinDirections = directions.filter((item) => item.builtin !== false);
  const customDirections = directions.filter((item) => item.builtin === false);
  const activeDirection = directions.find((item) => item.id === activeId);
  const activeLevelObj = levels.find((item) => item.id === activeLevel) || levels[2] || { id: activeLevel, label: activeLevel, desc: "", detail: "" };
  const shownLevelObj = levels.find((item) => item.id === (hoverLevel || activeLevel)) || activeLevelObj;
  const banks = bankData && Array.isArray(bankData.banks) ? bankData.banks : [];
  const activeBankId = bankData && bankData.active || "builtin";
  const builtinBanks = banks.filter((b) => b.builtin !== false);
  const customBanks = banks.filter((b) => b.builtin === false);
  const activeBankObj = banks.find((b) => b.id === activeBankId);
  const shortBankName2 = (name) => String(name || "").replace(/^内置\s*·\s*/, "");
  const chooseBank = async (id) => {
    if (!id || id === activeBankId) return;
    const prev = bankData;
    setError("");
    setBankNotice("");
    setBankData((cur) => {
      if (!cur) return cur;
      const next = { ...cur, active: id };
      cachedBanks = next;
      return next;
    });
    try {
      const res = await api("/wordbanks/active", { method: "POST", body: JSON.stringify({ id }) });
      if (res.summary) store.setStats(res.summary);
      if (typeof onWordBankChange === "function") onWordBankChange();
    } catch (e) {
      cachedBanks = prev;
      setBankData(prev);
      setError(e.message || "切换词库失败");
    }
  };
  const removeBank = async (id) => {
    setError("");
    setBankNotice("");
    try {
      const res = await api("/wordbanks/delete", { method: "POST", body: JSON.stringify({ id }) });
      const next = { active: res.active, banks: Array.isArray(res.banks) ? res.banks : banks.filter((b) => b.id !== id) };
      cachedBanks = next;
      setBankData(next);
      if (res.summary) store.setStats(res.summary);
      if (typeof onWordBankChange === "function") onWordBankChange();
    } catch (e) {
      setError(e.message || "删除词库失败");
    }
  };
  const handleBankImported = async (res) => {
    setImporting(false);
    setBankNotice("已导入「" + res.bank.name + "」" + res.bank.count + " 条");
    try {
      const banksRes = await api("/wordbanks");
      if (banksRes && Array.isArray(banksRes.banks)) {
        cachedBanks = banksRes;
        setBankData(banksRes);
      }
    } catch {
    }
    if (typeof onWordBankChange === "function") onWordBankChange();
  };
  const startCleanupPreview = async () => {
    if (cleanBusy) return;
    setCleanBusy(true);
    setError("");
    setCleanNotice("");
    try {
      const preview = await api("/data/preview", {
        method: "POST",
        body: JSON.stringify({ range: cleanRange, clearMemory })
      });
      setCleanPreview(preview);
    } catch (e) {
      setError(e.message || "统计可清理数据失败");
    } finally {
      setCleanBusy(false);
    }
  };
  const confirmCleanup = async () => {
    if (cleanBusy) return;
    setCleanBusy(true);
    setError("");
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
      setError(e.message || "清理数据失败");
    } finally {
      setCleanBusy(false);
    }
  };
  if (importing) {
    return import_react16.default.createElement(WordBankImport, {
      onClose: () => setImporting(false),
      onImported: handleBankImported
    });
  }
  return import_react16.default.createElement(
    "div",
    { className: "eg-settings" },
    import_react16.default.createElement(
      "div",
      { className: "eg-setting-section" },
      import_react16.default.createElement(
        "div",
        { className: "eg-section-head" },
        import_react16.default.createElement("div", { className: "eg-section-label" }, "练习偏好")
      ),
      import_react16.default.createElement(
        "div",
        { className: "eg-setting-card" },
        import_react16.default.createElement(
          "div",
          { className: "eg-setting-row" },
          import_react16.default.createElement(
            "div",
            { className: "eg-setting-head" },
            import_react16.default.createElement(
              "div",
              { className: "eg-setting-info" },
              import_react16.default.createElement("div", { className: "eg-setting-title" }, "庆祝效果"),
              import_react16.default.createElement("div", { className: "eg-setting-desc" }, "答对时从四周喷射彩带。")
            ),
            import_react16.default.createElement("button", {
              type: "button",
              className: "eg-switch",
              role: "switch",
              "aria-checked": settings.confetti ? "true" : "false",
              "aria-label": "彩带庆祝",
              onClick: () => save({ confetti: !settings.confetti }, false)
            })
          )
        ),
        import_react16.default.createElement(
          "div",
          { className: "eg-setting-row" },
          import_react16.default.createElement(
            "div",
            { className: "eg-setting-head" },
            import_react16.default.createElement(
              "div",
              { className: "eg-setting-info" },
              import_react16.default.createElement("div", { className: "eg-setting-title" }, "会话关联"),
              import_react16.default.createElement(
                "div",
                { className: "eg-setting-desc" },
                "开启后，短语训练会读取当前会话并截取部分对话内容作为翻译素材（自动过滤代码与过长文本），不再关注词库关联和内容方向；当前会话暂无可用内容时自动回退。"
              )
            ),
            import_react16.default.createElement("button", {
              type: "button",
              className: "eg-switch",
              role: "switch",
              "aria-checked": settings.sessionLink ? "true" : "false",
              "aria-label": "会话关联",
              onClick: () => save({ sessionLink: !settings.sessionLink }, "phrase")
            })
          )
        ),
        import_react16.default.createElement(
          "div",
          { className: "eg-setting-row" },
          import_react16.default.createElement(
            "div",
            { className: "eg-setting-head" },
            import_react16.default.createElement(
              "div",
              { className: "eg-setting-info" },
              import_react16.default.createElement("div", { className: "eg-setting-title" }, "词库关联"),
              import_react16.default.createElement(
                "div",
                { className: "eg-setting-desc" },
                "开启后，短语出题和今日文章会从当前词库挑词，自然融入句子和文章（不硬塞）。"
              )
            ),
            import_react16.default.createElement("button", {
              type: "button",
              className: "eg-switch",
              role: "switch",
              "aria-checked": settings.bankLink ? "true" : "false",
              "aria-label": "词库关联",
              onClick: () => save({ bankLink: !settings.bankLink }, false)
            })
          ),
          settings.sessionLink ? import_react16.default.createElement(
            "div",
            { className: "eg-setting-note" },
            "已开启会话关联：短语训练优先按当前会话出题，词库关联仅用于今日文章或无可用会话时兜底。"
          ) : null,
          import_react16.default.createElement(
            "div",
            {
              className: "eg-collapse" + (settings.bankLink ? " open" : ""),
              "aria-hidden": settings.bankLink ? "false" : "true"
            },
            import_react16.default.createElement(
              "div",
              { className: "eg-collapse-inner" },
              import_react16.default.createElement(
                "div",
                { className: "eg-setting-sub" },
                import_react16.default.createElement(
                  "div",
                  { className: "eg-setting-info" },
                  import_react16.default.createElement("div", { className: "eg-sub-title" }, "重试次数"),
                  import_react16.default.createElement(
                    "div",
                    { className: "eg-setting-desc" },
                    "生成的句子或文章没用到词库词时，再试几次（0–5）。"
                  )
                ),
                import_react16.default.createElement(
                  "div",
                  { className: "eg-stepper" },
                  import_react16.default.createElement(
                    "button",
                    {
                      type: "button",
                      className: "eg-stepbtn",
                      "aria-label": "减少重试次数",
                      tabIndex: settings.bankLink ? void 0 : -1,
                      disabled: !settings.bankLink || settings.bankRetries <= 0,
                      onClick: () => setRetries(settings.bankRetries - 1)
                    },
                    "−"
                  ),
                  import_react16.default.createElement("span", { className: "eg-stepper-value" }, String(settings.bankRetries)),
                  import_react16.default.createElement(
                    "button",
                    {
                      type: "button",
                      className: "eg-stepbtn",
                      "aria-label": "增加重试次数",
                      tabIndex: settings.bankLink ? void 0 : -1,
                      disabled: !settings.bankLink || settings.bankRetries >= 5,
                      onClick: () => setRetries(settings.bankRetries + 1)
                    },
                    "+"
                  )
                )
              )
            )
          )
        )
      )
    ),
    import_react16.default.createElement(
      "div",
      { className: "eg-setting-section" },
      import_react16.default.createElement(
        "div",
        { className: "eg-section-head" },
        import_react16.default.createElement("div", { className: "eg-section-label" }, "单词词库"),
        activeBankObj ? import_react16.default.createElement(
          "div",
          { className: "eg-active-badge", title: "当前词库：" + activeBankObj.name },
          import_react16.default.createElement("span", null, shortBankName2(activeBankObj.name) + " · " + activeBankObj.count + " 词")
        ) : null
      ),
      import_react16.default.createElement(
        "div",
        { className: "eg-setting-card" },
        import_react16.default.createElement(
          "div",
          { className: "eg-setting-row" },
          import_react16.default.createElement(
            "div",
            { className: "eg-setting-desc eg-lead" },
            "选择单词训练与词库关联使用的词库；记忆进度跨词库通用。"
          ),
          builtinBanks.length ? import_react16.default.createElement(
            "div",
            { className: "eg-bank-list" },
            builtinBanks.map(
              (b) => import_react16.default.createElement(
                "button",
                {
                  type: "button",
                  key: b.id,
                  className: "eg-bank-item" + (b.id === activeBankId ? " active" : ""),
                  "aria-pressed": b.id === activeBankId ? "true" : "false",
                  title: b.name + "（" + b.count + " 词）",
                  onClick: () => chooseBank(b.id)
                },
                import_react16.default.createElement("span", { className: "eg-bank-name" }, shortBankName2(b.name)),
                import_react16.default.createElement("span", { className: "eg-bank-cnt" }, b.count + " 词")
              )
            )
          ) : null
        ),
        import_react16.default.createElement(
          "div",
          { className: "eg-setting-row" },
          import_react16.default.createElement(
            "div",
            { className: "eg-custom-head" },
            import_react16.default.createElement("div", { className: "eg-sub-title" }, "自定义词库"),
            import_react16.default.createElement(
              "button",
              {
                type: "button",
                className: "eg-bankbtn",
                onClick: () => {
                  setBankNotice("");
                  setImporting(true);
                }
              },
              "+ 导入词库"
            )
          ),
          import_react16.default.createElement(
            "div",
            { className: "eg-setting-desc" },
            "支持导入 CSV / TSV / TXT / JSON 词表，导入后自动切换，不影响内置词库。"
          ),
          bankNotice ? import_react16.default.createElement("div", { className: "eg-notice eg-bank-notice" }, bankNotice) : null,
          customBanks.length ? import_react16.default.createElement(
            "div",
            { className: "eg-custom-chips" },
            customBanks.map(
              (b) => import_react16.default.createElement(
                "div",
                {
                  className: "eg-custom-chip" + (b.id === activeBankId ? " active" : ""),
                  key: b.id
                },
                import_react16.default.createElement(
                  "button",
                  {
                    type: "button",
                    className: "eg-custom-select",
                    "aria-pressed": b.id === activeBankId ? "true" : "false",
                    title: b.name + "（" + b.count + " 词）",
                    onClick: () => chooseBank(b.id)
                  },
                  b.name + "（" + b.count + "）"
                ),
                import_react16.default.createElement(
                  "button",
                  {
                    type: "button",
                    className: "eg-custom-remove",
                    title: "删除词库",
                    "aria-label": "删除 " + b.name,
                    onClick: () => removeBank(b.id)
                  },
                  "×"
                )
              )
            )
          ) : null
        )
      )
    ),
    import_react16.default.createElement(
      "div",
      { className: "eg-setting-section" },
      import_react16.default.createElement(
        "div",
        { className: "eg-section-head" },
        import_react16.default.createElement("div", { className: "eg-section-label" }, "文章难度"),
        activeLevelObj ? import_react16.default.createElement(
          "div",
          { className: "eg-active-badge", title: "当前难度：" + activeLevelObj.label + (activeLevelObj.desc ? " · " + activeLevelObj.desc : "") },
          import_react16.default.createElement("span", null, activeLevelObj.label + (activeLevelObj.desc ? " · " + activeLevelObj.desc : ""))
        ) : null
      ),
      import_react16.default.createElement(
        "div",
        { className: "eg-setting-card" },
        import_react16.default.createElement(
          "div",
          { className: "eg-setting-row" },
          import_react16.default.createElement(
            "div",
            { className: "eg-setting-desc eg-lead" },
            "控制今日文章的词汇与句式难度（CEFR）；切换后下次进入或换一篇生效。"
          ),
          import_react16.default.createElement(
            "div",
            {
              className: "eg-level-list",
              onMouseLeave: () => setHoverLevel("")
            },
            levels.map(
              (item) => import_react16.default.createElement(
                "button",
                {
                  type: "button",
                  key: item.id,
                  className: "eg-level" + (item.id === activeLevel ? " active" : ""),
                  "aria-pressed": item.id === activeLevel ? "true" : "false",
                  title: item.label + (item.desc ? " · " + item.desc : ""),
                  onMouseEnter: () => setHoverLevel(item.id),
                  onFocus: () => setHoverLevel(item.id),
                  onBlur: () => setHoverLevel((prev) => prev === item.id ? "" : prev),
                  onClick: () => chooseReportLevel(item.id)
                },
                import_react16.default.createElement("span", { className: "eg-level-code" }, item.label),
                item.desc ? import_react16.default.createElement("span", { className: "eg-level-desc" }, item.desc) : null
              )
            )
          ),
          shownLevelObj && shownLevelObj.detail ? import_react16.default.createElement(
            "div",
            { className: "eg-level-detail" },
            import_react16.default.createElement(
              "strong",
              null,
              shownLevelObj.label + (shownLevelObj.desc ? " " + shownLevelObj.desc : "")
            ),
            import_react16.default.createElement("span", null, shownLevelObj.detail)
          ) : null
        )
      )
    ),
    import_react16.default.createElement(
      "div",
      { className: "eg-setting-section" },
      import_react16.default.createElement(
        "div",
        { className: "eg-section-head" },
        import_react16.default.createElement("div", { className: "eg-section-label" }, "内容方向"),
        activeDirection ? import_react16.default.createElement(
          "div",
          { className: "eg-active-badge", title: "当前方向：" + activeDirection.label },
          import_react16.default.createElement("span", null, activeDirection.label)
        ) : null
      ),
      import_react16.default.createElement(
        "div",
        { className: "eg-setting-card" },
        import_react16.default.createElement(
          "div",
          { className: "eg-setting-row" },
          import_react16.default.createElement(
            "div",
            { className: "eg-setting-desc eg-lead" },
            settings.sessionLink ? "已开启会话关联，短语训练优先按当前会话出题；内容方向用于今日文章及无可用会话时兜底。" : "用于生成短语和今日文章；切换后下一题、下一篇生效。"
          ),
          import_react16.default.createElement(
            "div",
            { className: "eg-direction-list" },
            builtinDirections.map(
              (item) => import_react16.default.createElement(
                "button",
                {
                  type: "button",
                  key: item.id,
                  className: "eg-direction" + (item.id === activeId ? " active" : ""),
                  "aria-pressed": item.id === activeId ? "true" : "false",
                  title: item.label,
                  onClick: () => chooseDirection(item.id)
                },
                item.label
              )
            )
          )
        ),
        import_react16.default.createElement(
          "div",
          { className: "eg-setting-row" },
          import_react16.default.createElement(
            "div",
            { className: "eg-custom-head" },
            import_react16.default.createElement("div", { className: "eg-sub-title" }, "自定义方向"),
            import_react16.default.createElement(
              "span",
              { className: "eg-custom-count" },
              customTopics.length ? customTopics.length + " / 40" : "最多 40 个"
            )
          ),
          import_react16.default.createElement(
            "div",
            { className: "eg-setting-desc" },
            "添加你自己的主题，点击即可切换，与内置方向一样用于生成内容。"
          ),
          customDirections.length ? import_react16.default.createElement(
            "div",
            { className: "eg-custom-chips" },
            customDirections.map(
              (item) => import_react16.default.createElement(
                "div",
                {
                  className: "eg-custom-chip" + (item.id === activeId ? " active" : ""),
                  key: item.id
                },
                import_react16.default.createElement(
                  "button",
                  {
                    type: "button",
                    className: "eg-custom-select",
                    "aria-pressed": item.id === activeId ? "true" : "false",
                    title: item.label,
                    onClick: () => chooseDirection(item.id)
                  },
                  item.label
                ),
                import_react16.default.createElement(
                  "button",
                  {
                    type: "button",
                    className: "eg-custom-remove",
                    title: "删除方向",
                    "aria-label": "删除 " + item.label,
                    onClick: () => removeCustom(item.id)
                  },
                  "×"
                )
              )
            )
          ) : null,
          import_react16.default.createElement(
            "div",
            { className: "eg-addrow" },
            import_react16.default.createElement("input", {
              className: "eg-text",
              value: draft,
              maxLength: 40,
              placeholder: "例如：摄影与视觉",
              "aria-label": "自定义方向名称",
              onChange: (e) => setDraft(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") addCustom();
              }
            }),
            import_react16.default.createElement(
              "button",
              {
                type: "button",
                className: "eg-btn primary",
                disabled: adding || !draft.trim(),
                onClick: addCustom
              },
              "添加"
            )
          )
        )
      )
    ),
    import_react16.default.createElement(
      "div",
      { className: "eg-setting-section" },
      import_react16.default.createElement(
        "div",
        { className: "eg-section-head" },
        import_react16.default.createElement("div", { className: "eg-section-label" }, "数据管理")
      ),
      import_react16.default.createElement(
        "div",
        { className: "eg-setting-card" },
        import_react16.default.createElement(
          "div",
          { className: "eg-setting-row" },
          import_react16.default.createElement(
            "div",
            { className: "eg-setting-desc eg-lead" },
            "按时间清理历史学习记录与文章缓存；不会删除你的偏好设置和自定义词库。"
          ),
          import_react16.default.createElement(
            "div",
            { className: "eg-clean-ranges" },
            CLEANUP_RANGES.map(
              (item) => import_react16.default.createElement(
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
              )
            )
          ),
          import_react16.default.createElement(
            "div",
            { className: "eg-clean-foot" },
            import_react16.default.createElement(
              "label",
              { className: "eg-clean-check" },
              import_react16.default.createElement("input", {
                type: "checkbox",
                checked: clearMemory,
                disabled: cleanBusy,
                onChange: (e) => {
                  setClearMemory(e.target.checked);
                  setCleanPreview(null);
                  setCleanNotice("");
                }
              }),
              import_react16.default.createElement("span", null, "同时清除对应时间段的艾宾浩斯记忆进度（默认保留）")
            ),
            !cleanPreview ? import_react16.default.createElement(
              "button",
              {
                type: "button",
                className: "eg-btn danger",
                disabled: cleanBusy,
                onClick: startCleanupPreview
              },
              cleanBusy ? "统计中…" : "清理数据"
            ) : null
          ),
          cleanPreview ? (() => {
            const totalItems = (cleanPreview.recordDays || 0) + (cleanPreview.reports || 0) + (cleanPreview.memoryWords || 0);
            const rangeObj = CLEANUP_RANGES.find((r) => r.id === cleanPreview.range);
            const summaryParts = [];
            if (cleanPreview.recordDays) summaryParts.push(cleanPreview.recordDays + " 天学习记录");
            if (cleanPreview.reports) summaryParts.push(cleanPreview.reports + " 篇缓存文章");
            if (cleanPreview.memoryWords) summaryParts.push(cleanPreview.memoryWords + " 个单词记忆进度");
            return import_react16.default.createElement(
              "div",
              { className: "eg-clean-confirm" },
              import_react16.default.createElement(
                "div",
                { className: "eg-clean-confirm-text" },
                totalItems > 0 ? "将清除「" + (rangeObj ? rangeObj.label : cleanPreview.range) + "」范围内：" + summaryParts.join("、") + "，操作不可恢复。" : "所选范围内暂无可清理的学习记录或缓存文章。"
              ),
              import_react16.default.createElement(
                "div",
                { className: "eg-clean-confirm-actions" },
                import_react16.default.createElement(
                  "button",
                  {
                    type: "button",
                    className: "eg-btn",
                    disabled: cleanBusy,
                    onClick: () => setCleanPreview(null)
                  },
                  "取消"
                ),
                totalItems > 0 ? import_react16.default.createElement(
                  "button",
                  {
                    type: "button",
                    className: "eg-btn danger",
                    disabled: cleanBusy,
                    onClick: confirmCleanup
                  },
                  cleanBusy ? "清理中…" : "确认清理"
                ) : null
              )
            );
          })() : null,
          cleanNotice ? import_react16.default.createElement("div", { className: "eg-notice eg-clean-notice" }, cleanNotice) : null
        )
      )
    ),
    error ? import_react16.default.createElement("div", { className: "eg-settings-error" }, error) : null
  );
}

// src/client/shell/EnglishGymBoard.js
var useIsoLayoutEffect4 = import_react17.default.useLayoutEffect || import_react17.useEffect;
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
  const [tab, setTab] = (0, import_react17.useState)("word");
  const open = shared.open;
  const [mounted, setMounted] = (0, import_react17.useState)(open);
  const [closing, setClosing] = (0, import_react17.useState)(false);
  const tabRefs = (0, import_react17.useRef)({});
  const bodyRef = (0, import_react17.useRef)(null);
  const [slider, setSlider] = (0, import_react17.useState)({ left: 0, width: 0, ready: false });
  const [confettiKey, setConfettiKey] = (0, import_react17.useState)(0);
  const [wordBankRev, setWordBankRev] = (0, import_react17.useState)(0);
  const lastBurstRef = (0, import_react17.useRef)(shared.burst || 0);
  const lastWordReqTickRef = (0, import_react17.useRef)(0);
  const settingsLoadedRef = (0, import_react17.useRef)(false);
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
  (0, import_react17.useEffect)(() => {
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
  useIsoLayoutEffect4(() => {
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
  useIsoLayoutEffect4(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [tab]);
  (0, import_react17.useEffect)(() => {
    if (!open || settingsLoadedRef.current) return;
    settingsLoadedRef.current = true;
    api("/settings").then((result) => store.setSettings(result.settings)).catch(() => {
      settingsLoadedRef.current = false;
    });
  }, [open]);
  (0, import_react17.useEffect)(() => {
    const burst = shared.burst || 0;
    if (!burst || burst === lastBurstRef.current) return;
    lastBurstRef.current = burst;
    setConfettiKey(burst);
    const timer = setTimeout(() => setConfettiKey(0), 1400);
    return () => clearTimeout(timer);
  }, [shared.burst]);
  (0, import_react17.useEffect)(() => {
    const req = shared.wordModeRequest;
    if (!req || !req.tick || req.tick === lastWordReqTickRef.current) return;
    lastWordReqTickRef.current = req.tick;
    setTab("word");
  }, [shared.wordModeRequest]);
  (0, import_react17.useEffect)(() => {
    if (open || !store.stats) refreshStats();
  }, [open]);
  (0, import_react17.useEffect)(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !e.defaultPrevented) store.setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  if (!mounted) return null;
  return import_react17.default.createElement(
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
    import_react17.default.createElement(
      "div",
      { className: "eg-head" },
      import_react17.default.createElement("span", { className: "eg-grip", "aria-hidden": "true" }, "⠿"),
      import_react17.default.createElement(
        "div",
        { className: "eg-tabs" + (slider.ready ? " has-slider" : "") },
        TABS.map(
          (t) => import_react17.default.createElement(
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
          )
        ),
        slider.ready ? import_react17.default.createElement("span", {
          className: "eg-tab-indicator",
          "aria-hidden": "true",
          style: { transform: "translateX(" + slider.left + "px)", width: slider.width + "px" }
        }) : null
      ),
      import_react17.default.createElement(
        "div",
        { className: "eg-head-right" },
        import_react17.default.createElement("button", { className: "eg-close", onClick: () => store.setOpen(false), title: "收起" }, "✕")
      )
    ),
    import_react17.default.createElement(
      "div",
      { className: "eg-body", ref: bodyRef },
      import_react17.default.createElement(
        "div",
        { className: "eg-view", key: tab },
        tab === "drill" ? import_react17.default.createElement(
          "div",
          { className: "eg-drill" },
          import_react17.default.createElement(Drill, {
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
          })
        ) : tab === "word" ? import_react17.default.createElement(WordPractice, { key: "word", bankRev: wordBankRev }) : tab === "report" ? import_react17.default.createElement(Report, {
          report: dailyReport.report,
          loading: dailyReport.loading,
          error: dailyReport.error,
          onRefresh: () => dailyReport.refresh(true)
        }) : tab === "dashboard" ? import_react17.default.createElement(Dashboard, { key: "dashboard" }) : import_react17.default.createElement(SettingsPanel, {
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
            if (range === "all") dailyReport.invalidate();
            refreshStats();
          },
          onTopicChange: () => {
            drill.reset();
            dailyReport.invalidate();
          }
        })
      )
    ),
    confettiKey ? import_react17.default.createElement(Confetti, { key: confettiKey }) : null,
    import_react17.default.createElement("div", {
      className: "eg-resize",
      onPointerDown: onResizeDown,
      onPointerMove: onResizeMove,
      onPointerUp: onResizeUp,
      onPointerCancel: onResizeUp,
      title: "拖动缩放"
    })
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
