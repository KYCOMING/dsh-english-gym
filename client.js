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
var tokens_default = '/* Hallmark · component: english-gym panel · genre: editorial · theme: in-place (dsh tokens) · states: 8 · contrast: pass · v3.0.0\n * critique: the drill is a study desk — crisp sans for Chinese & UI, Charter/Georgia for English reading, tactile micro-motion throughout.\n * waive: none\n */\n.eg-root, .eg-panel {\n  --eg-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;\n  --eg-en: "Charter", "Iowan Old Style", "Georgia", "Times New Roman", "PingFang SC", serif;\n  --eg-serif: var(--eg-en);\n  --eg-ink: var(--dsw-alias-label-primary, #1f2328);\n  --eg-ink-2: var(--dsw-alias-label-secondary, #5a6069);\n  --eg-bg: var(--dsw-alias-bg-layer-1, #ffffff);\n  --eg-bg-2: var(--dsw-alias-bg-layer-2, rgba(23, 26, 31, .045));\n  --eg-bg-3: color-mix(in srgb, var(--eg-ink) 8%, transparent);\n  --eg-line: var(--dsw-alias-border-l1, rgba(23, 26, 31, .12));\n  --eg-line-2: var(--dsw-alias-border-l2, rgba(23, 26, 31, .24));\n  --eg-accent: var(--dsw-alias-brand-primary, #2f6fed);\n  --eg-accent-ink: var(--eg-accent);\n  --eg-on-accent: #ffffff;\n  --eg-ok: var(--dsw-alias-state-success-primary, #1a7f37);\n  --eg-bad: var(--dsw-alias-state-error-primary, #cf222e);\n  --eg-warn: var(--dsw-alias-state-warn-primary, #bf8700);\n  --eg-warn-strong: var(--eg-warn);\n  --eg-r: 16px;\n  --eg-r-sm: 10px;\n  --eg-shadow: 0 20px 56px rgba(17, 22, 31, .22), 0 2px 8px rgba(17, 22, 31, .08);\n  --eg-dur: .16s;\n  --eg-ease: cubic-bezier(.22, 1, .36, 1);\n  --eg-spring: cubic-bezier(.34, 1.45, .64, 1);\n  --eg-fs-xs: 12px; --eg-fs-sm: 13px; --eg-fs-md: 15px; --eg-fs-lg: 19px; --eg-fs-xl: 32px;\n  --eg-confetti-1: var(--eg-accent); --eg-confetti-2: var(--eg-bad); --eg-confetti-3: var(--eg-ok);\n  --eg-confetti-4: var(--eg-warn); --eg-confetti-5: #c9407e; --eg-confetti-6: #1b7c83;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.eg-root { font: var(--eg-fs-sm)/1.5 var(--eg-font); color: var(--eg-ink); }\n/* place the composer-strip pill at the far right of the dock row (after the context meter) */\n.eg-root.eg-entry { order: 999; flex: 0 0 auto; }\n.eg-root *, .eg-panel * { box-sizing: border-box; }\n\n';

// src/client/styles/shell.css
var shell_default = '/* ===== pill (composer strip) ===== */\n.eg-pill {\n  display: flex; align-items: center; gap: 9px; width: 100%;\n  padding: 7px 10px; background: transparent; border: none; border-radius: 10px;\n  color: var(--eg-ink-2); font-family: var(--eg-font); font-size: var(--eg-fs-sm); text-align: left; cursor: pointer;\n  transition: background var(--eg-dur) ease, transform .12s ease;\n}\n.eg-pill:hover { background: var(--eg-bg-2); }\n.eg-pill:active { transform: scale(.985); }\n.eg-pill:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-mono {\n  width: 22px; height: 22px; border-radius: 7px; flex: 0 0 auto;\n  background: var(--eg-accent); color: var(--eg-on-accent);\n  display: flex; align-items: center; justify-content: center;\n  font: 700 var(--eg-fs-xs)/1 var(--eg-font); letter-spacing: .02em;\n}\n.eg-wordmark { font-weight: 650; color: var(--eg-ink); letter-spacing: .01em; }\n.eg-streak { color: var(--eg-ink-2); font-variant-numeric: tabular-nums; }\n.eg-chip {\n  display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; height: 20px; border-radius: 999px;\n  background: var(--eg-bg-3); color: var(--eg-ink-2); font-size: 11.5px; font-weight: 600; font-variant-numeric: tabular-nums;\n}\n.eg-chip.warn {\n  background: color-mix(in srgb, var(--eg-warn) 14%, transparent);\n  border: 1px solid color-mix(in srgb, var(--eg-warn) 32%, transparent);\n  color: var(--eg-warn);\n}\n.eg-chev { margin-left: auto; opacity: .7; font-size: var(--eg-fs-xs); transition: transform .2s var(--eg-ease); }\n.eg-pill[aria-expanded="true"] .eg-chev { transform: rotate(90deg); }\n\n/* ===== panel ===== */\n.eg-panel {\n  position: fixed; z-index: 2147483000; pointer-events: auto;\n  -webkit-app-region: no-drag; app-region: no-drag;\n  display: flex; flex-direction: column;\n  background: var(--eg-bg); border: 1px solid var(--eg-line); border-radius: var(--eg-r);\n  box-shadow: var(--eg-shadow); overflow: hidden;\n  font: var(--eg-fs-sm)/1.5 var(--eg-font); color: var(--eg-ink);\n  transform-origin: bottom center; animation: eg-pop .2s var(--eg-ease) both;\n}\n.eg-panel.is-closing {\n  animation: eg-pop-out .14s cubic-bezier(.4, 0, 1, 1) forwards;\n  pointer-events: none;\n}\n@keyframes eg-pop { from { opacity: 0; transform: scale(.95) translateY(8px); } to { opacity: 1; transform: none; } }\n@keyframes eg-pop-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: scale(.96) translateY(6px); } }\n.eg-head {\n  display: flex; align-items: center; gap: 5px; padding: 9px 8px 9px 10px;\n  border-bottom: 1px solid var(--eg-line); flex: 0 0 auto; cursor: move; user-select: none; touch-action: none;\n  background: var(--eg-bg); position: relative;\n}\n.eg-grip { color: var(--eg-ink-2); opacity: .7; font-size: var(--eg-fs-xs); letter-spacing: -2px; cursor: grab; width: 10px; flex: 0 0 auto; transition: opacity var(--eg-dur) ease; }\n.eg-head:hover .eg-grip { opacity: 1; }\n.eg-tabs { position: relative; display: flex; flex-wrap: nowrap; align-items: center; gap: 0; margin-left: 0; min-width: 0; flex: 0 1 auto; }\n.eg-tab {\n  position: relative; padding: 5px 5px; border: none; background: transparent; cursor: pointer; white-space: nowrap;\n  color: var(--eg-ink-2); font: 600 var(--eg-fs-xs)/1.2 var(--eg-font); border-radius: 7px;\n  transition: color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-tab:hover { color: var(--eg-ink); background: var(--eg-bg-2); }\n.eg-tab:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-tab.active { color: var(--eg-ink); }\n.eg-tabs:not(.has-slider) .eg-tab.active::after {\n  content: ""; position: absolute; left: 5px; right: 5px; bottom: -10px; height: 2px; border-radius: 2px; background: var(--eg-accent);\n}\n.eg-tab-indicator {\n  position: absolute; left: 0; bottom: -10px; height: 2px; border-radius: 2px;\n  background: var(--eg-accent); pointer-events: none;\n  transition: transform .24s var(--eg-ease), width .24s var(--eg-ease), opacity .16s ease;\n  will-change: transform, width;\n}\n.eg-head-right { margin-left: auto; display: flex; align-items: center; gap: 6px; }\n.eg-close { appearance: none; -webkit-appearance: none;\n  border: none; background: transparent; color: var(--eg-ink-2); cursor: pointer;\n  width: 26px; height: 26px; border-radius: 7px; font-size: 14px; line-height: 1; display: flex; align-items: center; justify-content: center;\n  transition: background var(--eg-dur) ease, color var(--eg-dur) ease, transform .14s ease;\n}\n.eg-close:hover { background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-close:active { transform: scale(.9); }\n.eg-close:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-body { padding: 20px 22px 0; overflow-y: auto; flex: 1 1 auto; display: flex; flex-direction: column; }\n.eg-body:has(> .eg-view > .eg-word),\n.eg-body:has(.eg-fb.is-phrase) {\n  overflow-y: hidden;\n}\n.eg-body > * { width: 100%; max-width: 640px; margin-left: auto; margin-right: auto; }\n\n/* ===== shared motion primitives ===== */\n.eg-view {\n  width: 100%; max-width: 640px; margin-left: auto; margin-right: auto;\n  display: flex; flex-direction: column; flex: 1 0 auto; padding-bottom: 24px;\n}\n.eg-view > * {\n  animation: eg-view-in .18s var(--eg-ease) both;\n}\n.eg-view:has(> .eg-word),\n.eg-view:has(.eg-fb.is-phrase) {\n  flex: 1 1 0; min-height: 0;\n}\n.eg-stage-in { animation: eg-stage-in .22s var(--eg-ease) both; }\n@keyframes eg-view-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n@keyframes eg-stage-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }\n.eg-collapse {\n  display: grid; grid-template-rows: 0fr; opacity: 0;\n  transition: grid-template-rows .24s var(--eg-ease), opacity .2s ease;\n}\n.eg-collapse.open { grid-template-rows: 1fr; opacity: 1; }\n.eg-collapse-inner { overflow: hidden; min-height: 0; }\n\n/* ===== misc ===== */\n.eg-loading { display: flex; align-items: center; gap: 9px; color: var(--eg-ink-2); padding: 10px 0; font-size: var(--eg-fs-sm); }\n.eg-loading.is-stage {\n  flex: 1 1 auto; width: 100%; min-height: 180px;\n  flex-direction: column; justify-content: center; gap: 14px;\n  padding: 0 0 14px; text-align: center;\n  font-size: 14px; font-weight: 500; color: var(--eg-ink-2);\n}\n.eg-spin { display: inline-block; width: 15px; height: 15px; border: 2px solid var(--eg-line-2); border-top-color: var(--eg-accent); border-radius: 50%; animation: eg-spin .7s linear infinite; }\n.eg-loading.is-stage .eg-spin { width: 28px; height: 28px; border-width: 2.5px; }\n@keyframes eg-spin { to { transform: rotate(360deg); } }\n.eg-resize { position: absolute; right: 0; bottom: 0; width: 18px; height: 18px; cursor: nwse-resize; touch-action: none; }\n.eg-resize::after { content: ""; position: absolute; right: 4px; bottom: 4px; width: 9px; height: 9px; border-right: 2px solid var(--eg-line-2); border-bottom: 2px solid var(--eg-line-2); border-bottom-right-radius: 3px; opacity: .7; transition: opacity var(--eg-dur) ease; }\n.eg-resize:hover::after { opacity: 1; }\n\n';

// src/client/styles/phrase.css
var phrase_default = '/* ===== drill ===== */\n.eg-cap { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); font-weight: 600; letter-spacing: .02em; }\n.eg-zh {\n  margin-top: 14px; font-family: var(--eg-font); font-size: 18px; line-height: 1.6; font-weight: 650;\n  letter-spacing: -.005em; color: var(--eg-ink); overflow-wrap: break-word;\n}\n.eg-hintbtn { appearance: none; -webkit-appearance: none;\n  margin-top: 14px; display: inline-flex; align-items: center; gap: 6px; min-height: 30px; padding: 5px 11px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg); border-radius: 999px;\n  color: var(--eg-ink-2); font: 600 var(--eg-fs-xs)/1 var(--eg-font); cursor: pointer;\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-hintbtn:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-hintbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-hintbtn .caret { display: inline-block; transition: transform .22s var(--eg-ease); }\n.eg-hintbtn[aria-expanded="true"] .caret { transform: rotate(90deg); }\n.eg-hint-collapse { width: 100%; }\n.eg-hintbox {\n  max-width: 520px; margin: 10px auto 0; padding: 2px 8px;\n  color: var(--eg-ink-2); font-family: var(--eg-en); font-size: var(--eg-fs-sm); line-height: 1.6;\n  text-align: center; overflow-wrap: break-word;\n}\n.eg-inputwrap { position: relative; margin-top: 18px; }\n.eg-input {\n  width: 100%; min-height: 98px; resize: vertical; padding: 12px 14px;\n  border: 1px solid var(--eg-line); border-radius: var(--eg-r-sm);\n  background: var(--eg-bg-2); color: var(--eg-ink);\n  font: var(--eg-fs-md)/1.6 var(--eg-font); outline: none;\n  transition: border-color var(--eg-dur) ease, box-shadow var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-input::placeholder { color: var(--eg-ink-2); opacity: .82; }\n.eg-input:hover { border-color: var(--eg-line-2); }\n.eg-input:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }\n.eg-input.error { border-color: var(--eg-bad); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-bad) 14%, transparent); }\n.eg-foot { display: flex; align-items: center; gap: 10px; margin-top: 16px; }\n.eg-foot .eg-kbd { margin-left: auto; }\n.eg-err { color: var(--eg-bad); font-size: var(--eg-fs-xs); margin-top: 8px; }\n.eg-kbd { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); white-space: nowrap; }\n.eg-kbd kbd {\n  font: 600 11.5px/1 var(--eg-font); padding: 2px 5px; border: 1px solid var(--eg-line); border-bottom-width: 2px;\n  border-radius: 4px; background: var(--eg-bg); color: var(--eg-ink-2);\n}\n.eg-actions { display: flex; gap: 8px; margin-top: 16px; }\n.eg-btn {\n  display: inline-flex; align-items: center; justify-content: center; gap: 6px;\n  min-height: 36px; min-width: 76px; padding: 0 15px; border-radius: var(--eg-r-sm); cursor: pointer;\n  appearance: none; -webkit-appearance: none;\n  font: 600 var(--eg-fs-sm)/1 var(--eg-font);\n  transition: background var(--eg-dur) ease, filter var(--eg-dur) ease, border-color var(--eg-dur) ease, transform .26s var(--eg-spring);\n  border: 1px solid var(--eg-line-2); background: var(--eg-bg); color: var(--eg-ink);\n}\n.eg-btn:hover { background: var(--eg-bg-2); }\n.eg-btn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-btn:active { transform: scale(.94); transition-duration: .06s; }\n.eg-btn.is-bouncing { animation: eg-btn-bounce .34s var(--eg-spring); }\n@keyframes eg-btn-bounce {\n  0% { transform: scale(.93); }\n  55% { transform: scale(1.04); }\n  100% { transform: scale(1); }\n}\n.eg-btn.primary { border-color: transparent; background: var(--eg-accent); color: var(--eg-on-accent); }\n.eg-btn.primary:hover { filter: brightness(1.08); }\n.eg-btn:disabled { opacity: .48; cursor: not-allowed; pointer-events: none; }\n.eg-btn.primary:disabled { background: var(--eg-accent); color: var(--eg-on-accent); border-color: transparent; }\n.eg-btn:not(.primary):disabled { background: var(--eg-bg-2); color: var(--eg-ink-2); border-color: var(--eg-line); }\n.eg-btn.primary.is-loading { color: transparent; position: relative; }\n.eg-btn.primary.is-loading::after {\n  content: ""; position: absolute; width: 15px; height: 15px; border-radius: 50%;\n  border: 2px solid rgba(255, 255, 255, .45); border-top-color: #fff; animation: eg-spin .7s linear infinite;\n}\n.eg-btn.ghost { border-color: transparent; background: transparent; color: var(--eg-ink-2); padding: 0 10px; }\n.eg-btn.ghost:hover { background: var(--eg-bg-2); color: var(--eg-ink); }\n\n/* ===== confetti ===== */\n.eg-confetti { position: absolute; inset: 0; z-index: 6; pointer-events: none; overflow: hidden; border-radius: inherit; }\n.eg-confetti-piece {\n  position: absolute; display: block; border-radius: 1.5px; opacity: 0;\n  transform: translate(-50%, -50%) rotate(var(--r0, 0deg));\n  animation: eg-confetti-fly var(--dur, 900ms) cubic-bezier(.15, .7, .3, 1) var(--delay, 0ms) forwards;\n  will-change: transform, opacity;\n}\n@keyframes eg-confetti-fly {\n  0%   { opacity: 1; transform: translate(-50%, -50%) rotate(var(--r0, 0deg)) scale(.65); }\n  18%  { opacity: 1; }\n  100% { opacity: 0; transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, 0px))) rotate(calc(var(--r0, 0deg) + var(--rot, 360deg))) scale(1); }\n}\n\n/* ===== feedback ===== */\n.eg-fb {\n  --eg-tone: var(--eg-line-2);\n  margin-top: 8px; padding: 18px 20px; border: 1px solid var(--eg-line);\n  border-top: 3px solid var(--eg-line); border-radius: 12px; background: var(--eg-bg);\n  text-align: left; animation: eg-stage-in .24s var(--eg-ease) both;\n}\n.eg-fb.ok { --eg-tone: var(--eg-ok); border-top-color: var(--eg-ok); }\n.eg-fb.warn { --eg-tone: var(--eg-warn); border-top-color: var(--eg-warn); }\n.eg-fb.bad { --eg-tone: var(--eg-bad); border-top-color: var(--eg-bad); }\n.eg-fb-top { display: flex; align-items: baseline; gap: 10px; }\n.eg-score { font: 700 var(--eg-fs-xl)/1 var(--eg-font); font-variant-numeric: tabular-nums; letter-spacing: -.02em; color: var(--eg-tone); }\n.eg-score small { font-size: var(--eg-fs-xs); font-weight: 700; opacity: .9; color: inherit; margin-left: 2px; }\n.eg-fb-status { font-weight: 700; font-size: 16px; color: var(--eg-tone); line-height: 1.25; }\n.eg-fb-ref {\n  margin-top: 14px; padding: 12px 14px; border-radius: 10px; background: var(--eg-bg-2);\n  font-family: var(--eg-en); font-size: 17px; line-height: 1.65; color: var(--eg-ink); overflow-wrap: break-word;\n  animation: eg-view-in .24s var(--eg-ease) .05s both;\n}\n.eg-fb-ref .lbl { display: block; font: 600 11.5px/1 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em; margin-bottom: 6px; }\n.eg-fb-tip {\n  margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.65;\n  display: flex; gap: 8px; align-items: flex-start;\n  animation: eg-view-in .24s var(--eg-ease) .1s both;\n}\n.eg-fb-tip .b {\n  padding: 2px 7px; border-radius: 6px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  color: var(--eg-ink); font-size: 11px; font-weight: 650; line-height: 1.3;\n  white-space: nowrap; flex: 0 0 auto; margin-top: 2px;\n}\n.eg-fb-actions { margin-top: 16px; display: flex; gap: 10px; animation: eg-view-in .24s var(--eg-ease) .14s both; }\n\n/* phrase feedback card (editorial study-desk breakdown) */\n.eg-fb.is-phrase {\n  container-type: inline-size;\n  display: flex; flex-direction: column;\n  flex: 0 1 auto; min-height: 0; max-height: 100%;\n  margin-top: 0; padding: 0; border-radius: 14px; overflow: hidden;\n  border: 1px solid color-mix(in srgb, var(--eg-tone) 24%, var(--eg-line));\n  border-top: 1px solid color-mix(in srgb, var(--eg-tone) 24%, var(--eg-line));\n  background: var(--eg-bg);\n  box-shadow: 0 4px 18px color-mix(in srgb, var(--eg-tone) 6%, rgba(17, 22, 31, .05));\n}\n.eg-fb-hero {\n  flex: 0 0 auto;\n  display: flex; align-items: center; gap: 12px; padding: 12px 16px;\n  background: linear-gradient(135deg, color-mix(in srgb, var(--eg-tone) 11%, var(--eg-bg)) 0%, color-mix(in srgb, var(--eg-tone) 2.5%, var(--eg-bg)) 100%);\n  border-bottom: 1px solid color-mix(in srgb, var(--eg-tone) 16%, var(--eg-line));\n}\n.eg-ring {\n  position: relative; width: 50px; height: 50px; flex: 0 0 auto;\n  display: flex; align-items: center; justify-content: center;\n}\n.eg-ring svg { width: 50px; height: 50px; display: block; }\n.eg-ring-track { fill: var(--eg-bg); stroke: color-mix(in srgb, var(--eg-tone) 16%, var(--eg-line)); stroke-width: 3.8; }\n.eg-ring-arc {\n  fill: none; stroke: var(--eg-tone); stroke-width: 3.8; stroke-linecap: round;\n  transform: rotate(-90deg); transform-origin: 50% 50%;\n  transition: stroke-dashoffset .55s var(--eg-ease);\n}\n.eg-ring-val {\n  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;\n  color: var(--eg-tone); font-variant-numeric: tabular-nums; pointer-events: none;\n}\n.eg-ring-val strong { font: 750 16px/1 var(--eg-font); letter-spacing: -.03em; }\n.eg-ring-val small { font: 650 9px/1 var(--eg-font); opacity: .78; margin-top: 2px; }\n.eg-fb-verdict { min-width: 0; flex: 1 1 auto; }\n.eg-fb-headline { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; }\n.eg-fb-pill {\n  display: inline-flex; align-items: center; gap: 3px;\n  padding: 2px 8px; border-radius: 999px;\n  background: var(--eg-bg); border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font: 600 11px/1.35 var(--eg-font); font-variant-numeric: tabular-nums;\n}\n.eg-fb-pill.tone {\n  background: color-mix(in srgb, var(--eg-tone) 12%, var(--eg-bg));\n  border-color: color-mix(in srgb, var(--eg-tone) 28%, transparent);\n  color: var(--eg-tone);\n}\n.eg-fb-pill.up {\n  background: color-mix(in srgb, var(--eg-ok) 12%, var(--eg-bg));\n  border-color: color-mix(in srgb, var(--eg-ok) 28%, transparent);\n  color: var(--eg-ok);\n}\n.eg-fb-sub { margin-top: 3px; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.45; }\n.eg-fb-body {\n  flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain;\n  padding: 12px 16px 14px; display: flex; flex-direction: column; gap: 9px;\n}\n.eg-fb-prompt {\n  display: flex; align-items: baseline; gap: 9px;\n  padding-bottom: 9px; border-bottom: 1px dashed var(--eg-line);\n}\n.eg-fb-tag {\n  flex: 0 0 auto; padding: 2px 7px; border-radius: 5px;\n  background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font: 650 11px/1.35 var(--eg-font); letter-spacing: .02em;\n}\n.eg-fb-zh { font-size: 14px; font-weight: 600; color: var(--eg-ink); line-height: 1.55; overflow-wrap: break-word; min-width: 0; }\n.eg-fb-boxhead { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 5px; flex-wrap: wrap; }\n.eg-fb-boxhead-left { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; min-width: 0; }\n.eg-fb.is-phrase .lbl {\n  display: inline-flex; align-items: center; gap: 5px; margin-bottom: 0;\n  font: 650 11.5px/1.2 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em;\n}\n.eg-fb-mine {\n  padding: 9px 12px; border-radius: 10px;\n  border: 1px solid color-mix(in srgb, var(--eg-tone) 22%, var(--eg-line));\n  border-left: 3px solid var(--eg-tone);\n  background: color-mix(in srgb, var(--eg-tone) 4%, var(--eg-bg));\n  animation: eg-view-in .22s var(--eg-ease) .03s both;\n}\n.eg-fb-mine .lbl { color: var(--eg-tone); }\n.eg-fb-mine-text { font-family: var(--eg-en); font-size: 14.5px; line-height: 1.55; color: var(--eg-ink); overflow-wrap: break-word; }\n.eg-fb-mine-text.empty { font-family: var(--eg-font); font-size: var(--eg-fs-sm); color: var(--eg-ink-2); font-style: italic; }\n.eg-fb.is-phrase .eg-fb-ref {\n  margin-top: 0; padding: 10px 13px; border-radius: 10px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg-2);\n  font-family: var(--eg-font); font-size: var(--eg-fs-sm); line-height: 1.5;\n  animation: eg-view-in .24s var(--eg-ease) .06s both;\n}\n.eg-fb-ref-text { font-family: var(--eg-en); font-size: 16px; line-height: 1.6; color: var(--eg-ink); overflow-wrap: break-word; }\n.eg-fb-banktag {\n  display: inline-flex; align-items: center; padding: 1px 7px; border-radius: 999px;\n  background: color-mix(in srgb, var(--eg-accent) 10%, var(--eg-bg));\n  border: 1px solid color-mix(in srgb, var(--eg-accent) 22%, transparent);\n  color: var(--eg-ink-2); font: 600 10.5px/1.4 var(--eg-font);\n}\n.eg-copybtn {\n  appearance: none; -webkit-appearance: none;\n  display: inline-flex; align-items: center; gap: 4px;\n  height: 24px; padding: 0 8px; border-radius: 6px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg); color: var(--eg-ink-2);\n  font: 600 11px/1 var(--eg-font); cursor: pointer;\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-copybtn:hover { border-color: var(--eg-line-2); color: var(--eg-ink); }\n.eg-copybtn.copied { border-color: color-mix(in srgb, var(--eg-ok) 40%, transparent); color: var(--eg-ok); }\n.eg-copybtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-fb-corr {\n  padding: 9px 12px; border-radius: 10px;\n  border: 1px solid color-mix(in srgb, var(--eg-accent) 22%, var(--eg-line));\n  border-left: 3px solid var(--eg-accent);\n  background: color-mix(in srgb, var(--eg-accent) 4%, var(--eg-bg));\n  animation: eg-view-in .24s var(--eg-ease) .08s both;\n}\n.eg-fb-corr-text { font-family: var(--eg-en); font-size: 15px; line-height: 1.55; color: var(--eg-ink); overflow-wrap: break-word; }\n.eg-fb.is-phrase .eg-fb-tip {\n  margin-top: 0; padding: 9px 12px; border-radius: 10px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg);\n  color: var(--eg-ink); font-size: var(--eg-fs-sm); line-height: 1.6;\n  display: flex; gap: 9px; align-items: flex-start;\n  animation: eg-view-in .24s var(--eg-ease) .1s both;\n}\n.eg-fb.is-phrase .eg-fb-tip .b {\n  background: color-mix(in srgb, var(--eg-tone) 11%, var(--eg-bg));\n  border-color: color-mix(in srgb, var(--eg-tone) 26%, transparent);\n  color: var(--eg-tone); margin-top: 2px;\n}\n.eg-fb-hl { display: flex; flex-direction: column; gap: 6px; animation: eg-view-in .24s var(--eg-ease) .12s both; }\n.eg-fb-hl-lbl { font: 650 11.5px/1.2 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em; }\n.eg-fb-hl-list { display: flex; flex-wrap: wrap; gap: 6px; }\n.eg-hl-chip {\n  display: inline-flex; align-items: baseline; gap: 6px; padding: 4px 10px; border-radius: 8px;\n  background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  font-size: var(--eg-fs-xs); line-height: 1.4; max-width: 100%;\n}\n.eg-hl-chip .en { font-family: var(--eg-en); font-weight: 700; font-size: 13px; color: var(--eg-ink); }\n.eg-hl-chip .zh { color: var(--eg-ink-2); }\n.eg-fb.is-phrase .eg-fb-actions {\n  flex: 0 0 auto;\n  margin-top: 0; padding: 10px 16px;\n  border-top: 1px solid var(--eg-line); background: var(--eg-bg-2);\n  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;\n}\n.eg-fb.is-phrase .eg-fb-actions .eg-kbd { margin-left: auto; }\n@container (max-width: 340px) {\n  .eg-fb-hero { padding: 11px 13px; gap: 10px; }\n  .eg-fb-body { padding: 11px 13px 12px; }\n  .eg-fb.is-phrase .eg-fb-actions { padding: 10px 13px; }\n  .eg-fb.is-phrase .eg-fb-actions .eg-kbd { display: none; }\n}\n.eg-cap-row { display: inline-flex; align-items: center; justify-content: center; gap: 7px; flex-wrap: wrap; }\n.eg-attempt-pill, .eg-source-pill {\n  display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 999px;\n  background: color-mix(in srgb, var(--eg-accent) 10%, var(--eg-bg));\n  border: 1px solid color-mix(in srgb, var(--eg-accent) 22%, transparent);\n  color: var(--eg-ink-2); font: 600 11px/1.3 var(--eg-font); font-variant-numeric: tabular-nums;\n}\n.eg-source-pill { color: var(--eg-ink); }\n.eg-source-pill::before {\n  content: ""; width: 6px; height: 6px; border-radius: 50%; flex: 0 0 auto;\n  background: var(--eg-accent);\n}\n\n/* phrase drill: centred prompt, left-aligned reading feedback */\n.eg-drill { flex: 1 0 auto; width: 100%; max-width: 640px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; padding-top: 10px; }\n.eg-view:has(.eg-fb.is-phrase) .eg-drill { flex: 1 1 0; min-height: 0; }\n.eg-drill > div { width: 100%; }\n.eg-drill .eg-cap { justify-content: center; }\n.eg-drill .eg-foot { justify-content: center; width: 100%; }\n.eg-drill .eg-foot .eg-kbd { margin-left: 0; }\n.eg-drill .eg-inputwrap { width: 100%; }\n.eg-drill .eg-input { text-align: left; }\n.eg-drill .eg-err { text-align: center; }\n\n';

// src/client/styles/report.css
var report_default = "/* ===== report ===== */\n.eg-report { text-align: left; width: 100%; }\n.eg-report .r-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }\n.eg-rtitle {\n  font-family: var(--eg-en); font-size: 22px; line-height: 1.32; font-weight: 700;\n  letter-spacing: -.01em; margin: 0; overflow-wrap: break-word; min-width: 0; text-align: left; color: var(--eg-ink);\n}\n.eg-rmeta-row {\n  display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;\n  margin-top: 9px;\n}\n.eg-rmeta {\n  display: inline-flex; align-items: center; gap: 6px;\n  padding: 3px 10px; border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font-size: 11.5px; font-weight: 600; font-variant-numeric: tabular-nums;\n}\n.eg-rrefresh {\n  appearance: none; -webkit-appearance: none;\n  display: inline-flex; align-items: center; gap: 5px;\n  height: 26px; padding: 0 10px; border-radius: 999px;\n  border: 1px solid var(--eg-line); background: var(--eg-bg); color: var(--eg-ink-2);\n  font: 600 11.5px/1 var(--eg-font); cursor: pointer;\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease, transform .14s ease;\n}\n.eg-rrefresh:hover:not(:disabled) { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-rrefresh:active:not(:disabled) { transform: scale(.96); }\n.eg-rrefresh:disabled { opacity: .48; cursor: not-allowed; }\n.eg-rrefresh:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-rsum {\n  margin: 14px 0 0; padding: 11px 14px;\n  border: 1px solid var(--eg-line); border-left: 3px solid var(--eg-accent); border-radius: 10px;\n  background: var(--eg-bg-2); color: var(--eg-ink-2);\n  font-family: var(--eg-font); font-size: var(--eg-fs-sm); line-height: 1.65; text-align: left;\n}\n.eg-rp {\n  margin: 15px 0 0; width: 100%;\n  font-family: var(--eg-en); font-size: 15.5px; line-height: 1.78; color: var(--eg-ink); text-align: left;\n}\n.eg-practice { margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--eg-line); }\n.eg-ptitle {\n  display: flex; align-items: center; justify-content: flex-start; gap: 7px;\n  font-size: var(--eg-fs-xs); font-weight: 650; letter-spacing: .03em; color: var(--eg-ink-2);\n  margin-bottom: 10px;\n}\n.eg-q {\n  margin: 0; padding: 13px 15px; border: 1px solid var(--eg-line); border-radius: 11px;\n  background: var(--eg-bg); transition: border-color var(--eg-dur) ease;\n}\n.eg-q + .eg-q { margin-top: 10px; }\n.eg-q.reveal { border-color: var(--eg-line-2); }\n.eg-q-head { display: flex; gap: 9px; align-items: flex-start; justify-content: flex-start; text-align: left; }\n.eg-q-n {\n  flex: 0 0 auto; width: 20px; height: 20px; margin-top: 1px; border-radius: 6px;\n  background: var(--eg-bg-2); border: 1px solid var(--eg-line); color: var(--eg-ink);\n  display: inline-flex; align-items: center; justify-content: center;\n  font: 700 11px/1 var(--eg-font); font-variant-numeric: tabular-nums;\n}\n.eg-q-zh { font-size: var(--eg-fs-sm); font-weight: 500; line-height: 1.6; color: var(--eg-ink); text-align: left; }\n.eg-q-toggle {\n  appearance: none; -webkit-appearance: none;\n  margin-top: 10px; display: inline-flex; align-items: center; gap: 5px;\n  min-height: 27px; padding: 4px 10px; border-radius: 7px;\n  background: var(--eg-bg); border: 1px solid var(--eg-line); color: var(--eg-ink-2);\n  cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font);\n  transition: background var(--eg-dur) ease, color var(--eg-dur) ease, border-color var(--eg-dur) ease;\n}\n.eg-q-toggle:hover { background: var(--eg-bg-2); border-color: var(--eg-line-2); color: var(--eg-ink); }\n.eg-q-toggle:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 2px; }\n.eg-q-toggle .caret { display: inline-block; transition: transform .22s var(--eg-ease); }\n.eg-q.reveal .eg-q-toggle .caret { transform: rotate(90deg); }\n.eg-q-en {\n  margin-top: 10px; padding: 10px 13px; border-radius: 8px;\n  border: 1px solid var(--eg-line); border-left: 2.5px solid var(--eg-accent);\n  background: var(--eg-bg-2); font-family: var(--eg-en); font-size: 14.5px; line-height: 1.6;\n  color: var(--eg-ink); text-align: left;\n}\n.eg-report-foot {\n  margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--eg-line);\n  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;\n}\n.eg-report-foot-hint { color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.4; }\n.eg-report .eg-actions { justify-content: flex-start; margin-top: 18px; }\n\n";

// src/client/styles/word.css
var word_default = "/* ===== word training ===== */\n.eg-letters { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }\n.eg-letters.is-bad { animation: eg-shake .32s cubic-bezier(.36, .07, .19, .97) both; }\n@keyframes eg-shake {\n  0%, 100% { transform: translateX(0); }\n  20% { transform: translateX(-5px); }\n  42% { transform: translateX(5px); }\n  64% { transform: translateX(-3px); }\n  84% { transform: translateX(2px); }\n}\n.eg-letter {\n  flex: 1 1 0; min-width: 8px; max-width: 38px; width: auto; height: 48px; padding: 0; text-align: center;\n  border: none; border-bottom: 2px solid var(--eg-line-2); border-radius: 6px 6px 0 0;\n  background: transparent; color: var(--eg-ink);\n  font: 600 22px/1 var(--eg-font); text-transform: lowercase; outline: none;\n  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, color var(--eg-dur) ease, box-shadow var(--eg-dur) ease, transform .14s var(--eg-spring);\n}\n.eg-letter:hover { border-bottom-color: var(--eg-ink-2); background: var(--eg-bg-2); }\n.eg-letter:focus { border-bottom-color: var(--eg-accent); background: var(--eg-bg-2); box-shadow: 0 3px 0 -1px color-mix(in srgb, var(--eg-accent) 26%, transparent); }\n.eg-letter.is-pop { animation: eg-letter-pop .16s var(--eg-spring); }\n@keyframes eg-letter-pop {\n  0% { transform: scale(.9); }\n  55% { transform: scale(1.1); }\n  100% { transform: scale(1); }\n}\n.eg-letter.ok { border-bottom-color: var(--eg-ok); color: var(--eg-ok); }\n.eg-letters.is-ok .eg-letter.ok {\n  animation: eg-letter-ok .34s var(--eg-spring) calc(var(--i, 0) * 34ms) both;\n}\n@keyframes eg-letter-ok {\n  0% { transform: translateY(0) scale(1); }\n  45% { transform: translateY(-5px) scale(1.08); }\n  100% { transform: translateY(0) scale(1); }\n}\n.eg-letter.bad { border-bottom-color: var(--eg-bad); color: var(--eg-bad); }\n.eg-letters.answered .eg-letter { cursor: default; }\n/* word training: centred column */\n.eg-word {\n  container-type: inline-size;\n  width: 100%; max-width: 640px; margin-left: auto; margin-right: auto;\n  height: 100%; min-height: 0; display: flex; flex-direction: column; align-items: stretch; text-align: center;\n}\n.eg-word-main { flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; min-height: 0; overflow-y: auto; padding: 10px 0 14px; }\n.eg-word-stage { width: 100%; display: flex; flex-direction: column; align-items: center; }\n.eg-word .eg-pos {\n  display: inline-flex; align-items: center; margin: 0 0 4px; padding: 3px 10px;\n  border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line);\n  color: var(--eg-ink-2); font: 600 11.5px/1.2 var(--eg-font);\n}\n.eg-word .eg-zh { font-family: var(--eg-font); font-size: 26px; font-weight: 700; letter-spacing: -.01em; line-height: 1.4; margin-top: 6px; color: var(--eg-ink); }\n.eg-word .eg-letters { justify-content: center; margin-top: 18px; width: 100%; }\n.eg-word .eg-foot { justify-content: center; width: 100%; margin-top: 24px; }\n.eg-word .eg-foot .eg-kbd { margin-left: 0; }\n.eg-word .eg-fb {\n  width: 100%; text-align: center; margin-top: 14px; padding: 0; border: none; border-radius: 0; background: transparent;\n}\n.eg-word .eg-fb-top { justify-content: center; }\n.eg-word .eg-fb-actions { justify-content: center; }\n.eg-word .eg-fb > .eg-fb-actions:first-child { margin-top: 0; gap: 8px; flex-wrap: wrap; justify-content: center; }\n.eg-word .eg-fb-actions .eg-btn { padding: 0 10px; }\n.eg-word-miss { margin-top: 12px; font-size: var(--eg-fs-xs); font-weight: 550; color: var(--eg-bad); animation: eg-view-in .2s var(--eg-ease) both; }\n.eg-word-reveal { width: 100%; }\n.eg-word-foot { flex: 0 0 auto; display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--eg-line); }\n.eg-word-foot .eg-btn { padding: 0 12px; }\n.eg-word .eg-fb-ref {\n  margin-top: 8px; padding: 0; background: transparent; font-family: var(--eg-en); font-size: 24px; font-weight: 600; text-align: center;\n}\n.eg-word .eg-eg {\n  width: 100%; max-width: 480px; margin: 12px auto 0; padding: 12px 16px;\n  border: 1px solid var(--eg-line); border-radius: 10px; background: var(--eg-bg-2); text-align: center;\n  transition: background var(--eg-dur) ease, border-color var(--eg-dur) ease;\n}\n.eg-word .eg-eg.done { animation: eg-view-in .22s var(--eg-ease) both; }\n.eg-word .eg-eg-en { font: 15px/1.65 var(--eg-en); color: var(--eg-ink); overflow-wrap: anywhere; }\n.eg-word .eg-eg-zh { margin-top: 5px; font: var(--eg-fs-xs)/1.6 var(--eg-font); color: var(--eg-ink-2); }\n.eg-eg-hit {\n  padding: 1px 4px; border-radius: 4px;\n  background: color-mix(in srgb, var(--eg-accent) 13%, transparent);\n  color: var(--eg-ink); font-weight: 700;\n}\n/* ===== word bank bar ===== */\n.eg-bankbar { width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; padding: 0 0 11px; margin: 0 0 10px; border-bottom: 1px solid var(--eg-line); }\n.eg-banklabel { flex: 0 0 auto; font-size: var(--eg-fs-xs); font-weight: 600; color: var(--eg-ink-2); }\n@container (max-width: 315px) {\n  .eg-banklabel { display: none; }\n}\n.eg-select {\n  flex: 1 1 auto; min-width: 0; max-width: 280px; height: 34px; padding: 0 26px 0 12px; border: 1px solid var(--eg-line);\n  border-radius: 999px; background: var(--eg-bg-2); color: var(--eg-ink); cursor: pointer;\n  font: 600 var(--eg-fs-xs)/1 var(--eg-font); outline: none; appearance: none;\n  background-image: linear-gradient(45deg, transparent 50%, var(--eg-ink-2) 50%), linear-gradient(135deg, var(--eg-ink-2) 50%, transparent 50%);\n  background-position: calc(100% - 13px) 13px, calc(100% - 9px) 13px; background-size: 4px 4px, 4px 4px; background-repeat: no-repeat;\n  transition: border-color var(--eg-dur) ease, background-color var(--eg-dur) ease;\n}\n.eg-select:hover { border-color: var(--eg-line-2); }\n.eg-select:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-bankbtn { appearance: none; -webkit-appearance: none;\n  flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; gap: 4px;\n  min-height: 34px; padding: 0 12px; border: 1px solid var(--eg-line); border-radius: 999px;\n  background: var(--eg-bg); color: var(--eg-ink-2); cursor: pointer;\n  font: 600 var(--eg-fs-xs)/1 var(--eg-font);\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease, transform .14s ease;\n}\n.eg-bankbtn:hover { border-color: var(--eg-line-2); color: var(--eg-ink); background: var(--eg-bg-2); }\n.eg-bankbtn:active { transform: scale(.95); }\n.eg-bankbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-notice { margin: 0 0 12px; padding: 8px 11px; border-radius: 9px; background: color-mix(in srgb, var(--eg-ok) 9%, transparent); border: 1px solid color-mix(in srgb, var(--eg-ok) 28%, transparent); color: var(--eg-ink); font-size: var(--eg-fs-xs); line-height: 1.5; animation: eg-view-in .2s var(--eg-ease) both; }\n\n/* ===== word bank import ===== */\n.eg-import { width: 100%; max-width: 520px; margin: 0 auto; text-align: left; animation: eg-view-in .2s var(--eg-ease) both; }\n.eg-import-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }\n.eg-import-title { font-size: var(--eg-fs-md); font-weight: 700; color: var(--eg-ink); line-height: 1.3; }\n.eg-import-actions { flex: 0 0 auto; display: flex; align-items: center; gap: 6px; }\n.eg-import-back, .eg-filebtn { appearance: none; -webkit-appearance: none;\n  flex: 0 0 auto; display: inline-flex; align-items: center; min-height: 30px; padding: 4px 10px;\n  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg);\n  color: var(--eg-ink-2); cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font); white-space: nowrap;\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-import-back:hover, .eg-filebtn:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-import-back:focus-visible, .eg-filebtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-import-sub { margin-top: 4px; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); line-height: 1.5; }\n.eg-field { margin-top: 10px; }\n.eg-field label { display: block; margin-bottom: 6px; font-size: var(--eg-fs-xs); font-weight: 600; color: var(--eg-ink-2); }\n.eg-text {\n  width: 100%; height: 34px; padding: 0 11px; border: 1px solid var(--eg-line); border-radius: 8px;\n  background: var(--eg-bg-2); color: var(--eg-ink); font: var(--eg-fs-sm)/1 var(--eg-font); outline: none;\n  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, box-shadow var(--eg-dur) ease;\n}\n.eg-text:hover { border-color: var(--eg-line-2); }\n.eg-text:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }\n.eg-textarea-wrap { position: relative; margin-top: 10px; }\n.eg-textarea {\n  width: 100%; min-height: 86px; resize: vertical; padding: 9px 11px; border: 1px solid var(--eg-line); border-radius: 10px;\n  background: var(--eg-bg-2); color: var(--eg-ink); font: var(--eg-fs-xs)/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; outline: none;\n  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease, box-shadow var(--eg-dur) ease;\n}\n.eg-textarea-wrap.over .eg-textarea, .eg-textarea-wrap:hover .eg-textarea { border-color: var(--eg-accent); background: color-mix(in srgb, var(--eg-accent) 5%, var(--eg-bg-2)); }\n.eg-textarea:focus { border-color: var(--eg-accent); background: var(--eg-bg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 16%, transparent); }\n.eg-preview { margin-top: 12px; border: 1px solid var(--eg-line); border-radius: 10px; overflow: hidden; animation: eg-view-in .2s var(--eg-ease) both; }\n.eg-preview-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px; background: var(--eg-bg-2); font-size: var(--eg-fs-xs); color: var(--eg-ink-2); }\n.eg-preview-top strong { color: var(--eg-ink); }\n.eg-preview-row { display: flex; flex-wrap: wrap; gap: 10px; padding: 7px 10px; border-top: 1px solid var(--eg-line); font-size: var(--eg-fs-xs); line-height: 1.5; }\n.eg-preview-row .w { flex: 0 0 38%; font-weight: 650; overflow-wrap: anywhere; }\n.eg-preview-row .m { flex: 1 1 auto; color: var(--eg-ink-2); overflow-wrap: anywhere; }\n.eg-preview-row .ex { flex: 1 0 100%; color: var(--eg-ink-2); font-family: var(--eg-en); font-style: italic; overflow-wrap: anywhere; }\n.eg-preview-errors { margin-top: 8px; padding: 8px 10px; border-radius: 8px; background: color-mix(in srgb, var(--eg-bad) 7%, transparent); border: 1px solid color-mix(in srgb, var(--eg-bad) 24%, transparent); }\n.eg-preview-errors .er { font-size: var(--eg-fs-xs); line-height: 1.55; color: var(--eg-bad); }\n.eg-import-foot { display: flex; gap: 8px; margin-top: 10px; }\n\n";

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

`;

// src/client/styles/dashboard.css
var dashboard_default = "/* ===== dashboard ===== */\n.eg-dash { container-type: inline-size; display: flex; flex-direction: column; }\n.eg-dash-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; }\n.eg-dash-title { font: 700 15px/1.2 var(--eg-font); color: var(--eg-ink); white-space: nowrap; }\n.eg-dash-nav { display: flex; align-items: center; justify-content: center; gap: 4px; flex: 1 1 100%; }\n@container (min-width: 340px) {\n  .eg-dash-nav { flex: 0 0 auto; justify-content: flex-end; }\n}\n.eg-navbtn {\n  appearance: none; -webkit-appearance: none; width: 28px; height: 28px; padding: 0;\n  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg); color: var(--eg-ink-2);\n  cursor: pointer; font: 600 15px/1 var(--eg-font); display: inline-flex; align-items: center; justify-content: center;\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease, transform .12s ease;\n}\n.eg-navbtn:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-navbtn:active { transform: scale(.93); }\n.eg-navbtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-month { min-width: 86px; text-align: center; font: 600 var(--eg-fs-sm)/1 var(--eg-font); font-variant-numeric: tabular-nums; color: var(--eg-ink); }\n.eg-todaybtn {\n  appearance: none; -webkit-appearance: none; height: 28px; padding: 0 9px;\n  border: 1px solid var(--eg-line); border-radius: 8px; background: var(--eg-bg); color: var(--eg-ink-2);\n  cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font);\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease, transform .12s ease;\n}\n.eg-todaybtn:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-todaybtn:active { transform: scale(.95); }\n.eg-todaybtn:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-dash-sum { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin: 14px 0 2px; }\n.eg-stat {\n  min-width: 0; border: 1px solid var(--eg-line); border-radius: 11px; padding: 10px 6px;\n  text-align: center; background: var(--eg-bg);\n  transition: border-color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-stat:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); }\n.eg-stat b { display: block; font: 700 18px/1.15 var(--eg-font); font-variant-numeric: tabular-nums; color: var(--eg-ink); }\n.eg-stat span { display: block; margin-top: 3px; font-size: 11.5px; color: var(--eg-ink-2); }\n.eg-cal-card { margin-top: 12px; padding: 12px; border: 1px solid var(--eg-line); border-radius: 12px; background: var(--eg-bg); }\n.eg-cal { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px; }\n.eg-cal .dow { text-align: center; font: 600 11.5px/1 var(--eg-font); color: var(--eg-ink-2); padding: 0 0 4px; }\n.eg-day {\n  position: relative; aspect-ratio: 1 / 1; border-radius: 8px; border: 1px solid transparent;\n  background: var(--eg-bg-2);\n  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px;\n  font: 600 var(--eg-fs-xs)/1 var(--eg-font); color: var(--eg-ink-2); font-variant-numeric: tabular-nums;\n  transition: transform .16s var(--eg-spring), box-shadow .16s ease, border-color .16s ease;\n}\n.eg-day.blank { background: transparent; border-color: transparent; }\n.eg-day .cnt { font-size: 10px; font-weight: 650; opacity: .88; letter-spacing: 0; line-height: 1; }\n.eg-day.l1 { background: color-mix(in srgb, var(--eg-ok) 18%, var(--eg-bg)); color: var(--eg-ink); }\n.eg-day.l2 { background: color-mix(in srgb, var(--eg-ok) 38%, var(--eg-bg)); color: var(--eg-ink); }\n.eg-day.l3 { background: color-mix(in srgb, var(--eg-ok) 68%, var(--eg-bg)); color: #ffffff; }\n.eg-day.l4 { background: var(--eg-ok); color: #ffffff; }\n.eg-day.today { border-color: var(--eg-ok); box-shadow: inset 0 0 0 1px var(--eg-ok); }\n.eg-day.has { cursor: pointer; }\n.eg-day.has:hover { transform: translateY(-1px) scale(1.06); box-shadow: 0 3px 10px rgba(0, 0, 0, .12); z-index: 1; }\n.eg-day.has:active { transform: scale(.96); }\n.eg-day.has:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-dash-legend { display: flex; align-items: center; justify-content: flex-end; gap: 5px; margin-top: 10px; font-size: 11px; color: var(--eg-ink-2); }\n.eg-dash-legend i { width: 11px; height: 11px; border-radius: 3px; background: var(--eg-bg-2); display: inline-block; }\n.eg-dash-legend i.l1 { background: color-mix(in srgb, var(--eg-ok) 18%, var(--eg-bg)); }\n.eg-dash-legend i.l2 { background: color-mix(in srgb, var(--eg-ok) 38%, var(--eg-bg)); }\n.eg-dash-legend i.l3 { background: color-mix(in srgb, var(--eg-ok) 68%, var(--eg-bg)); }\n.eg-dash-legend i.l4 { background: var(--eg-ok); }\n.eg-hist-title { margin: 20px 0 8px; padding: 0 2px; font: 650 var(--eg-fs-xs)/1.3 var(--eg-font); letter-spacing: .03em; color: var(--eg-ink-2); }\n.eg-hist { display: flex; flex-direction: column; gap: 10px; }\n.eg-hist-day {\n  padding: 13px 15px; border: 1px solid var(--eg-line); border-radius: 12px; background: var(--eg-bg);\n  transition: border-color .25s ease, box-shadow .25s ease;\n}\n.eg-hist-day.is-flash { animation: eg-flash-ring 1.15s var(--eg-ease) both; }\n@keyframes eg-flash-ring {\n  0% { border-color: var(--eg-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 22%, transparent); }\n  70% { border-color: var(--eg-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--eg-accent) 12%, transparent); }\n  100% { border-color: var(--eg-line); box-shadow: none; }\n}\n.eg-hist-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 4px; }\n.eg-hist-date { font: 650 14px/1.3 var(--eg-font); color: var(--eg-ink); }\n.eg-hist-date .wd { margin-left: 6px; font-weight: 500; color: var(--eg-ink-2); font-size: var(--eg-fs-xs); }\n.eg-hist-count { flex: 0 0 auto; color: var(--eg-ink-2); font-size: 11.5px; font-variant-numeric: tabular-nums; }\n.eg-hist-sub { margin: 11px 0 6px; font: 600 11.5px/1 var(--eg-font); color: var(--eg-ink-2); letter-spacing: .02em; }\n.eg-wchips { display: flex; flex-wrap: wrap; gap: 6px; }\n.eg-wchip { display: inline-flex; align-items: baseline; gap: 5px; padding: 3px 9px; border-radius: 999px; background: var(--eg-bg-2); border: 1px solid var(--eg-line); font-size: var(--eg-fs-xs); max-width: 100%; }\n.eg-wchip .w { font-weight: 650; color: var(--eg-ink); }\n.eg-wchip .m { color: var(--eg-ink-2); overflow-wrap: anywhere; }\n.eg-wchip.ok { border-color: color-mix(in srgb, var(--eg-ok) 42%, var(--eg-line)); }\n.eg-wchip.bad { border-color: color-mix(in srgb, var(--eg-bad) 42%, var(--eg-line)); }\n.eg-sents { display: flex; flex-direction: column; }\n.eg-more {\n  align-self: flex-start; margin: 9px 0 1px; padding: 4px 10px;\n  border: 1px solid var(--eg-line); border-radius: 999px; background: var(--eg-bg);\n  color: var(--eg-ink-2); cursor: pointer; font: 600 var(--eg-fs-xs)/1 var(--eg-font);\n  transition: border-color var(--eg-dur) ease, color var(--eg-dur) ease, background var(--eg-dur) ease;\n}\n.eg-more:hover { border-color: var(--eg-line-2); background: var(--eg-bg-2); color: var(--eg-ink); }\n.eg-more:focus-visible { outline: 2px solid var(--eg-accent); outline-offset: 1px; }\n.eg-sent { display: flex; gap: 8px; padding: 8px 0; border-top: 1px dashed var(--eg-line); }\n.eg-sent:first-child { border-top: none; padding-top: 4px; }\n.eg-sent:last-child { padding-bottom: 2px; }\n.eg-sent .mark { flex: 0 0 auto; width: 14px; font-weight: 700; font-size: var(--eg-fs-sm); line-height: 1.55; }\n.eg-sent.ok .mark { color: var(--eg-ok); }\n.eg-sent.bad .mark { color: var(--eg-bad); }\n.eg-sent .body { flex: 1 1 auto; min-width: 0; }\n.eg-sent .zh { font-size: var(--eg-fs-sm); line-height: 1.55; color: var(--eg-ink); }\n.eg-sent .en { margin-top: 3px; font-family: var(--eg-en); font-size: 13.5px; line-height: 1.55; color: var(--eg-ink-2); overflow-wrap: break-word; }\n.eg-dash-empty { padding: 30px 0; text-align: center; color: var(--eg-ink-2); font-size: var(--eg-fs-sm); line-height: 1.7; }\n.eg-dash-error { margin-top: 10px; color: var(--eg-bad); font-size: var(--eg-fs-xs); }\n\n";

// src/client/styles/reduced-motion.css
var reduced_motion_default = "@media (prefers-reduced-motion: reduce) {\n  .eg-panel, .eg-panel.is-closing, .eg-view, .eg-view > *, .eg-stage-in, .eg-fb, .eg-fb-ref, .eg-fb-tip, .eg-fb-actions,\n  .eg-fb-mine, .eg-fb-corr, .eg-fb-hl,\n  .eg-letters.is-bad, .eg-letter.is-pop, .eg-letters.is-ok .eg-letter.ok, .eg-hist-day.is-flash,\n  .eg-notice, .eg-import, .eg-preview, .eg-word-miss, .eg-word .eg-eg.done { animation: none !important; }\n  .eg-confetti { display: none; }\n  .eg-root *, .eg-panel * { transition: none !important; }\n}\n";

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
  settings: { confetti: true, topicId: "ai", customTopics: [], bankLink: true, bankRetries: 1, sessionLink: false },
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
      stats && stats.reviewCount > 0 ? import_react3.default.createElement("span", { className: "eg-chip warn" }, "待复习 " + stats.reviewCount) : null,
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
  const h4 = clamp(g.h, 170, Math.max(170, vh - MIN_TOP - EDGE_PAD));
  const x = clamp(g.x, EDGE_PAD, Math.max(EDGE_PAD, vw - w - EDGE_PAD));
  const y = clamp(g.y, MIN_TOP, Math.max(MIN_TOP, vh - 44));
  return { x, y, w, h: h4 };
}
function pillAnchorGeom() {
  const vw = window.innerWidth || 1200;
  const vh = window.innerHeight || 800;
  const w = 340;
  const h4 = 440;
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
  return fitGeom({ w, h: h4, x: Math.round(cx - w / 2), y: Math.round(bottom - h4) });
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
    const h4 = clamp(d.g0.h + (e.clientY - d.sy), 170, Math.max(170, maxH));
    setGeom({ x: d.g0.x, y: d.g0.y, w, h: h4 });
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
  int: "感叹词"
};
function formatPos(pos) {
  const parts = String(pos || "").toLowerCase().split(/[\/,&\s]+/).map((p) => p.replace(/\.+$/, "")).filter(Boolean).map((p) => p === "vt" || p === "vi" ? "v" : p);
  const unique = [...new Set(parts)];
  if (!unique.length) return "";
  return unique.map((p) => POS_LABELS[p] ? POS_LABELS[p] + " " + p + "." : p).join(" / ");
}
function escapeRegExp(text) {
  return String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
    null,
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
      import_react9.default.createElement("button", { className: "eg-btn ghost", onClick: onNext, disabled: busy }, "换一题"),
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
var import_react12 = __toESM(require("react"), 1);

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

// src/client/features/word/WordBankImport.js
var import_react11 = __toESM(require("react"), 1);
var h2 = import_react11.default.createElement;
function WordBankImport({ onClose, onImported }) {
  const [name, setName] = (0, import_react11.useState)("");
  const [filename, setFilename] = (0, import_react11.useState)("");
  const [content, setContent] = (0, import_react11.useState)("");
  const [preview, setPreview] = (0, import_react11.useState)(null);
  const [busy, setBusy] = (0, import_react11.useState)(false);
  const [error, setError] = (0, import_react11.useState)("");
  const [over, setOver] = (0, import_react11.useState)(false);
  const fileRef = (0, import_react11.useRef)(null);
  const readFile = (0, import_react11.useCallback)(async (file) => {
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
  const doPreview = (0, import_react11.useCallback)(async () => {
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
  const doImport = (0, import_react11.useCallback)(async () => {
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

// src/client/features/word/WordPractice.js
var h3 = import_react12.default.createElement;
var cachedWord = { item: null, cells: [], res: null, revealed: false, banks: null, bankId: "" };
function WordPractice() {
  const [item, setItem] = (0, import_react12.useState)(() => cachedWord.item);
  const [cells, setCells] = (0, import_react12.useState)(() => cachedWord.cells);
  const [res, setRes] = (0, import_react12.useState)(() => cachedWord.res);
  const [revealed, setRevealed] = (0, import_react12.useState)(() => cachedWord.revealed);
  const [busy, setBusy] = (0, import_react12.useState)(false);
  const [error, setError] = (0, import_react12.useState)("");
  const [banks, setBanks] = (0, import_react12.useState)(() => cachedWord.banks);
  const [bankId, setBankId] = (0, import_react12.useState)(() => cachedWord.bankId);
  const [view, setView] = (0, import_react12.useState)("practice");
  const [notice, setNotice] = (0, import_react12.useState)("");
  const [switching, setSwitching] = (0, import_react12.useState)(false);
  const refs = (0, import_react12.useRef)([]);
  const inFlight = (0, import_react12.useRef)(false);
  (0, import_react12.useEffect)(() => {
    cachedWord.item = item;
    cachedWord.cells = cells;
    cachedWord.res = res;
    cachedWord.revealed = revealed;
    cachedWord.banks = banks;
    cachedWord.bankId = bankId;
  }, [item, cells, res, revealed, banks, bankId]);
  const load = (0, import_react12.useCallback)(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    setRes(null);
    setRevealed(false);
    try {
      const data = await api("/word/next", { method: "POST", body: "{}" });
      setItem(data);
      setCells(new Array(Math.max(0, data.letters || 0)).fill(""));
      setTimeout(() => {
        try {
          if (refs.current[0]) refs.current[0].focus();
        } catch {
        }
      }, 0);
    } catch (e) {
      setError(e.message || "出题失败");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }, []);
  (0, import_react12.useEffect)(() => {
    if (!cachedWord.item) load();
  }, [load]);
  (0, import_react12.useEffect)(() => {
    if (!res || !res.correct || view !== "practice") return void 0;
    const onKeyDown = (e) => {
      if (e.key !== "Enter" || e.isComposing) return;
      const el = e.target;
      if (el && el.closest && el.closest("textarea, input:not([disabled]), select, button")) return;
      e.preventDefault();
      load();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [res, view, load]);
  const loadBanks = (0, import_react12.useCallback)(async () => {
    try {
      const data = await api("/wordbanks");
      setBanks(Array.isArray(data.banks) ? data.banks : []);
      setBankId(data.active || "builtin");
    } catch {
    }
  }, []);
  (0, import_react12.useEffect)(() => {
    if (!cachedWord.banks) loadBanks();
  }, [loadBanks]);
  const switchBank = (0, import_react12.useCallback)(
    async (e) => {
      const id = e.target.value;
      if (!id || id === bankId) return;
      setSwitching(true);
      setError("");
      setNotice("");
      try {
        const data = await api("/wordbanks/active", { method: "POST", body: JSON.stringify({ id }) });
        setBankId(data.active);
        if (data.summary) store.setStats(data.summary);
        await load();
      } catch (err) {
        setError(err.message || "切换词库失败");
      } finally {
        setSwitching(false);
      }
    },
    [bankId, load]
  );
  const onImported = (0, import_react12.useCallback)(
    (result) => {
      setNotice("已导入「" + result.bank.name + "」" + result.bank.count + " 条");
      setView("practice");
      loadBanks();
      load();
    },
    [loadBanks, load]
  );
  const submit = (0, import_react12.useCallback)(async () => {
    if (!item || busy || res) return;
    if (cells.some((c) => !c)) return;
    setBusy(true);
    setError("");
    setRevealed(false);
    try {
      const r = await api("/word/check", {
        method: "POST",
        body: JSON.stringify({ id: item.id, answer: cells.join("") })
      });
      setRes(r);
      if (r.correct) store.celebrate();
      if (r.summary) store.setStats(r.summary);
    } catch (e) {
      setError(e.message || "判分失败");
    } finally {
      setBusy(false);
    }
  }, [item, cells, busy, res]);
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
  if (view === "import") {
    return h3(WordBankImport, { onClose: () => setView("practice"), onImported });
  }
  if (!item) {
    return import_react12.default.createElement(
      "div",
      null,
      error ? import_react12.default.createElement("div", { className: "eg-err" }, error) : import_react12.default.createElement(
        "div",
        { className: "eg-loading" },
        import_react12.default.createElement("span", { className: "eg-spin" }),
        "正在取词…"
      ),
      error ? import_react12.default.createElement(
        "div",
        { className: "eg-foot" },
        import_react12.default.createElement("button", { className: "eg-btn primary", onClick: load, disabled: busy }, "重试")
      ) : null
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
    return import_react12.default.createElement("input", {
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
  const footerActions = answered ? import_react12.default.createElement(
    "div",
    { className: "eg-word-foot" },
    ok ? import_react12.default.createElement("button", { className: "eg-btn primary", onClick: load, disabled: busy, title: "回车继续", "aria-keyshortcuts": "Enter" }, "下一个") : [
      import_react12.default.createElement("button", { key: "retry", className: "eg-btn primary", onClick: retry, disabled: busy }, "再试一次"),
      import_react12.default.createElement(
        "button",
        {
          key: "reveal",
          className: "eg-btn",
          onClick: () => setRevealed((v) => !v),
          disabled: busy,
          "aria-expanded": revealed ? "true" : "false"
        },
        revealed ? "收起答案" : "显示答案"
      ),
      import_react12.default.createElement("button", { key: "next", className: "eg-btn", onClick: load, disabled: busy }, "下一个")
    ]
  ) : item ? import_react12.default.createElement(
    "div",
    { className: "eg-word-foot" },
    import_react12.default.createElement(
      "button",
      {
        className: "eg-btn primary" + (busy ? " is-loading" : ""),
        onClick: submit,
        onPointerDown: bounceButton,
        disabled: busy || cells.some((c) => !c)
      },
      "提交"
    ),
    import_react12.default.createElement("button", { className: "eg-btn ghost", onClick: load, disabled: busy }, "换一个"),
    import_react12.default.createElement(
      "span",
      { className: "eg-kbd", title: "回车提交" },
      import_react12.default.createElement("kbd", null, "↵")
    )
  ) : null;
  return import_react12.default.createElement(
    "div",
    { className: "eg-word" },
    import_react12.default.createElement(
      "div",
      { className: "eg-bankbar", "data-nodrag": "true" },
      import_react12.default.createElement("span", { className: "eg-banklabel" }, "词库"),
      import_react12.default.createElement(
        "select",
        {
          className: "eg-select",
          value: bankId || "",
          disabled: switching || !banks,
          onChange: switchBank,
          title: "切换单词词库"
        },
        (banks || []).map(
          (b) => import_react12.default.createElement("option", { key: b.id, value: b.id }, b.name + "（" + b.count + "）")
        )
      ),
      import_react12.default.createElement(
        "button",
        { className: "eg-bankbtn", onClick: () => {
          setNotice("");
          setView("import");
        } },
        import_react12.default.createElement("span", { className: "eg-plus", "aria-hidden": "true" }, "+"),
        "导入"
      )
    ),
    notice ? import_react12.default.createElement("div", { className: "eg-notice" }, notice) : null,
    import_react12.default.createElement(
      "div",
      { className: "eg-word-main" },
      import_react12.default.createElement(
        "div",
        { className: "eg-word-stage", key: item.id },
        item.pos ? import_react12.default.createElement("div", { className: "eg-pos", title: "词性提示" }, formatPos(item.pos)) : null,
        import_react12.default.createElement("div", { className: "eg-zh" }, item.zh),
        !answered ? import_react12.default.createElement(ExampleBlock, { example: item.example }) : null,
        import_react12.default.createElement(
          "div",
          {
            className: "eg-letters" + (answered ? " answered" + (ok ? " is-ok" : " is-bad") : ""),
            style: { gap: letterGap }
          },
          cellsNodes
        ),
        error ? import_react12.default.createElement("div", { className: "eg-err" }, error) : null,
        answered ? ok ? import_react12.default.createElement(
          "div",
          { className: "eg-fb ok" },
          import_react12.default.createElement(
            "div",
            { className: "eg-fb-top" },
            import_react12.default.createElement("span", { className: "eg-fb-status" }, "拼对了")
          ),
          import_react12.default.createElement(
            "div",
            { className: "eg-fb-ref" },
            import_react12.default.createElement("span", { className: "lbl" }, "正确拼写"),
            res.reference
          ),
          import_react12.default.createElement(ExampleBlock, {
            example: res.example,
            exampleZh: res.exampleZh,
            word: res.reference,
            highlight: true
          })
        ) : import_react12.default.createElement(
          "div",
          { className: "eg-fb bad" },
          !revealed ? import_react12.default.createElement("div", { className: "eg-word-miss" }, "拼写有误，可再试一次或查看答案") : null,
          import_react12.default.createElement(
            "div",
            {
              className: "eg-collapse eg-word-reveal" + (revealed ? " open" : ""),
              "aria-hidden": revealed ? "false" : "true"
            },
            import_react12.default.createElement(
              "div",
              { className: "eg-collapse-inner" },
              import_react12.default.createElement(
                "div",
                { className: "eg-fb-ref" },
                import_react12.default.createElement("span", { className: "lbl" }, "正确拼写"),
                res.reference
              ),
              import_react12.default.createElement(ExampleBlock, {
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
var import_react13 = require("react");
function useDailyReport({ open, active }) {
  const [report, setReport] = (0, import_react13.useState)(null);
  const [loading, setLoading] = (0, import_react13.useState)(false);
  const [error, setError] = (0, import_react13.useState)("");
  const staleRef = (0, import_react13.useRef)(false);
  const refresh = (0, import_react13.useCallback)(async (force) => {
    setLoading(true);
    setError("");
    if (force) setReport(null);
    try {
      setReport(force ? await api("/report/refresh", { method: "POST" }) : await api("/report"));
    } catch (e) {
      setError(e.message || "报告加载失败");
    } finally {
      setLoading(false);
    }
  }, []);
  (0, import_react13.useEffect)(() => {
    if (open && active && !report && !loading) {
      const force = staleRef.current;
      staleRef.current = false;
      refresh(force);
    }
  }, [open, active, report, loading, refresh]);
  const invalidate = (0, import_react13.useCallback)(() => {
    setReport(null);
    setError("");
    staleRef.current = true;
  }, []);
  return { report, loading, error, refresh, invalidate };
}

// src/client/features/report/Report.js
var import_react14 = __toESM(require("react"), 1);
function Report({ report, loading, error, onRefresh }) {
  const [openMap, setOpenMap] = (0, import_react14.useState)({});
  (0, import_react14.useEffect)(() => {
    setOpenMap({});
  }, [report]);
  if (loading && !report) {
    return import_react14.default.createElement(
      "div",
      { className: "eg-loading is-stage" },
      import_react14.default.createElement("span", { className: "eg-spin" }),
      "正在生成今日报告…"
    );
  }
  if (!report) {
    return import_react14.default.createElement(
      "div",
      null,
      import_react14.default.createElement(
        "div",
        { className: "eg-loading" },
        error ? import_react14.default.createElement("span", { className: "eg-err" }, error) : "暂无报告。"
      ),
      import_react14.default.createElement(
        "div",
        { className: "eg-actions" },
        import_react14.default.createElement("button", { className: "eg-btn primary", onClick: onRefresh }, "生成今日报告")
      )
    );
  }
  const paragraphs = String(report.body || "").split(/\n{2,}/).filter(Boolean);
  const questions = report.questions || [];
  const wordCount = (String(report.body || "").match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
  const meta = [report.date, report.level, wordCount ? wordCount + " 词" : ""].filter(Boolean).join(" · ");
  return import_react14.default.createElement(
    "div",
    { className: "eg-report", "data-nodrag": "true" },
    import_react14.default.createElement("div", { className: "r-top" }, import_react14.default.createElement("h2", { className: "eg-rtitle" }, report.title || "Daily Report")),
    import_react14.default.createElement(
      "div",
      { className: "eg-rmeta-row" },
      meta ? import_react14.default.createElement("div", { className: "eg-rmeta" }, meta) : import_react14.default.createElement("span", null),
      import_react14.default.createElement(
        "button",
        {
          type: "button",
          className: "eg-rrefresh",
          onClick: onRefresh,
          disabled: loading,
          title: "重新生成一篇今日报告"
        },
        loading ? "生成中…" : "↻ 换一篇"
      )
    ),
    report.summary_zh ? import_react14.default.createElement("p", { className: "eg-rsum" }, report.summary_zh) : null,
    paragraphs.map((p, i) => import_react14.default.createElement("p", { key: i, className: "eg-rp" }, p)),
    questions.length ? import_react14.default.createElement(
      "div",
      { className: "eg-practice" },
      import_react14.default.createElement("div", { className: "eg-ptitle" }, "练一练"),
      questions.map((q, i) => {
        const isOpen = !!openMap[i];
        return import_react14.default.createElement(
          "div",
          { key: i, className: "eg-q" + (isOpen ? " reveal" : "") },
          import_react14.default.createElement(
            "div",
            { className: "eg-q-head" },
            import_react14.default.createElement("span", { className: "eg-q-n" }, String(i + 1)),
            import_react14.default.createElement("span", { className: "eg-q-zh" }, q.zh)
          ),
          import_react14.default.createElement(
            "button",
            {
              className: "eg-q-toggle",
              type: "button",
              "aria-expanded": isOpen ? "true" : "false",
              onClick: () => setOpenMap((prev) => ({ ...prev, [i]: !prev[i] }))
            },
            import_react14.default.createElement("span", { className: "caret", "aria-hidden": "true" }, "▸"),
            isOpen ? "收起参考" : "看参考"
          ),
          import_react14.default.createElement(
            "div",
            { className: "eg-collapse" + (isOpen ? " open" : ""), "aria-hidden": isOpen ? "false" : "true" },
            import_react14.default.createElement(
              "div",
              { className: "eg-collapse-inner" },
              import_react14.default.createElement("div", { className: "eg-q-en" }, q.en)
            )
          )
        );
      })
    ) : null,
    import_react14.default.createElement(
      "div",
      { className: "eg-report-foot" },
      import_react14.default.createElement("span", { className: "eg-report-foot-hint" }, "按当前内容方向生成，可随时换一篇"),
      import_react14.default.createElement(
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
var import_react15 = __toESM(require("react"), 1);
var WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
function pad2(n) {
  return String(n).padStart(2, "0");
}
var cachedDashboard = null;
function Dashboard() {
  const [data, setData] = (0, import_react15.useState)(() => cachedDashboard);
  const [loading, setLoading] = (0, import_react15.useState)(() => !cachedDashboard);
  const [error, setError] = (0, import_react15.useState)("");
  const [cursor, setCursor] = (0, import_react15.useState)(() => {
    const d = /* @__PURE__ */ new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [expanded, setExpanded] = (0, import_react15.useState)({});
  const [flashDay, setFlashDay] = (0, import_react15.useState)("");
  const flashTimerRef = (0, import_react15.useRef)(null);
  const toggleGroup = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  const WORD_LIMIT = 10;
  const PHRASE_LIMIT = 5;
  (0, import_react15.useEffect)(() => {
    return () => clearTimeout(flashTimerRef.current);
  }, []);
  const load = (0, import_react15.useCallback)(async () => {
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
  (0, import_react15.useEffect)(() => {
    load();
  }, [load]);
  const activity = {};
  if (data && Array.isArray(data.activity)) {
    for (const a of data.activity) activity[a.day] = a;
  }
  const records = data && Array.isArray(data.days) ? data.days : [];
  const today = data ? data.today : null;
  const streak = data ? data.streak || 0 : 0;
  const totals = data && data.totals ? data.totals : { days: 0, words: 0, phrases: 0 };
  const { y, m } = cursor;
  const startDow = (new Date(y, m, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const dayStr = (d) => y + "-" + pad2(m + 1) + "-" + pad2(d);
  const levelOf = (n) => n > 60 ? 4 : n >= 31 ? 3 : n >= 11 ? 2 : n >= 1 ? 1 : 0;
  const goMonth = (delta) => setCursor((c) => {
    let mm = c.m + delta;
    let yy = c.y;
    if (mm < 0) {
      mm = 11;
      yy -= 1;
    }
    if (mm > 11) {
      mm = 0;
      yy += 1;
    }
    return { y: yy, m: mm };
  });
  const goToday = () => {
    const d = /* @__PURE__ */ new Date();
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  };
  const jumpTo = (day) => {
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
  };
  const dowNodes = ["一", "二", "三", "四", "五", "六", "日"].map(
    (w, i) => import_react15.default.createElement("div", { className: "dow", key: "dow" + i }, w)
  );
  const cellNodes = cells.map((d, i) => {
    if (!d) return import_react15.default.createElement("div", { className: "eg-day blank", key: "b" + i });
    const key = dayStr(d);
    const a = activity[key];
    const lv = a ? levelOf(a.total) : 0;
    const cls = ["eg-day"];
    if (lv) cls.push("l" + lv, "has");
    if (key === today) cls.push("today");
    return import_react15.default.createElement(
      "div",
      {
        key,
        className: cls.join(" "),
        title: a ? key + " · 单词 " + a.words + " · 句子 " + a.phrases : key,
        onClick: a ? () => jumpTo(key) : void 0,
        role: a ? "button" : void 0,
        tabIndex: a ? 0 : void 0,
        onKeyDown: a ? (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            jumpTo(key);
          }
        } : void 0
      },
      import_react15.default.createElement("span", { className: "n" }, d),
      a ? import_react15.default.createElement("span", { className: "cnt" }, a.total) : null
    );
  });
  const recordNodes = records.map((rec) => {
    const dt = /* @__PURE__ */ new Date(rec.day + "T00:00:00");
    const wd = WEEKDAYS[dt.getDay()];
    const t = rec.totals || {};
    const allWords = rec.words || [];
    const allPhrases = rec.phrases || [];
    const wKey = rec.day + ":w";
    const pKey = rec.day + ":p";
    const words = expanded[wKey] ? allWords : allWords.slice(0, WORD_LIMIT);
    const phrases = expanded[pKey] ? allPhrases : allPhrases.slice(0, PHRASE_LIMIT);
    const moreBtn = (key, total, limit, open) => total > limit ? import_react15.default.createElement(
      "button",
      { className: "eg-more", key: "more", onClick: () => toggleGroup(key) },
      open ? "收起" : "展开全部 · 共 " + total + " 条"
    ) : null;
    return import_react15.default.createElement(
      "div",
      { className: "eg-hist-day" + (flashDay === rec.day ? " is-flash" : ""), id: "eg-hist-" + rec.day, key: rec.day },
      import_react15.default.createElement(
        "div",
        { className: "eg-hist-head" },
        import_react15.default.createElement(
          "div",
          { className: "eg-hist-date" },
          dt.getMonth() + 1 + "月" + dt.getDate() + "日",
          import_react15.default.createElement("span", { className: "wd" }, "周" + wd)
        ),
        import_react15.default.createElement("div", { className: "eg-hist-count" }, "单词 " + (t.words || 0) + " · 句子 " + (t.phrases || 0))
      ),
      allWords.length ? import_react15.default.createElement(
        "div",
        null,
        import_react15.default.createElement("div", { className: "eg-hist-sub" }, "单词"),
        import_react15.default.createElement(
          "div",
          { className: "eg-wchips" },
          words.map(
            (w, i) => import_react15.default.createElement(
              "span",
              { className: "eg-wchip " + (w.ok ? "ok" : "bad"), key: "w" + i, title: w.ok ? "拼对了" : "没拼对" },
              import_react15.default.createElement("span", { className: "w" }, w.en),
              w.zh ? import_react15.default.createElement("span", { className: "m" }, w.zh) : null
            )
          )
        ),
        moreBtn(wKey, allWords.length, WORD_LIMIT, !!expanded[wKey])
      ) : null,
      allPhrases.length ? import_react15.default.createElement(
        "div",
        null,
        import_react15.default.createElement("div", { className: "eg-hist-sub" }, "句子"),
        import_react15.default.createElement(
          "div",
          { className: "eg-sents" },
          phrases.map(
            (p, i) => import_react15.default.createElement(
              "div",
              { className: "eg-sent " + (p.ok ? "ok" : "bad"), key: "p" + i },
              import_react15.default.createElement("span", { className: "mark" }, p.ok ? "✓" : "✗"),
              import_react15.default.createElement(
                "div",
                { className: "body" },
                import_react15.default.createElement("div", { className: "zh" }, p.zh),
                p.en ? import_react15.default.createElement("div", { className: "en" }, p.en) : null
              )
            )
          )
        ),
        moreBtn(pKey, allPhrases.length, PHRASE_LIMIT, !!expanded[pKey])
      ) : null
    );
  });
  if (loading && !data) {
    return import_react15.default.createElement(
      "div",
      { className: "eg-dash" },
      import_react15.default.createElement("div", { className: "eg-loading" }, import_react15.default.createElement("span", { className: "eg-spin" }), "正在加载看板…")
    );
  }
  return import_react15.default.createElement(
    "div",
    { className: "eg-dash" },
    import_react15.default.createElement(
      "div",
      { className: "eg-dash-top" },
      import_react15.default.createElement("div", { className: "eg-dash-title" }, "学习看板"),
      import_react15.default.createElement(
        "div",
        { className: "eg-dash-nav" },
        import_react15.default.createElement("button", { className: "eg-navbtn", onClick: () => goMonth(-1), "aria-label": "上个月", title: "上个月" }, "‹"),
        import_react15.default.createElement("span", { className: "eg-month" }, y + " 年 " + (m + 1) + " 月"),
        import_react15.default.createElement("button", { className: "eg-navbtn", onClick: () => goMonth(1), "aria-label": "下个月", title: "下个月" }, "›"),
        import_react15.default.createElement("button", { className: "eg-todaybtn", onClick: goToday, title: "回到今天" }, "今天")
      )
    ),
    import_react15.default.createElement(
      "div",
      { className: "eg-dash-sum" },
      import_react15.default.createElement("div", { className: "eg-stat" }, import_react15.default.createElement("b", null, streak), import_react15.default.createElement("span", { title: "连续学习天数" }, "连续")),
      import_react15.default.createElement("div", { className: "eg-stat" }, import_react15.default.createElement("b", null, totals.words || 0), import_react15.default.createElement("span", { title: "累计单词" }, "单词")),
      import_react15.default.createElement("div", { className: "eg-stat" }, import_react15.default.createElement("b", null, totals.phrases || 0), import_react15.default.createElement("span", { title: "累计句子" }, "句子")),
      import_react15.default.createElement("div", { className: "eg-stat" }, import_react15.default.createElement("b", null, totals.days || 0), import_react15.default.createElement("span", { title: "累计学习天数" }, "累计"))
    ),
    import_react15.default.createElement(
      "div",
      { className: "eg-cal-card" },
      import_react15.default.createElement("div", { className: "eg-cal" }, dowNodes.concat(cellNodes)),
      import_react15.default.createElement(
        "div",
        { className: "eg-dash-legend" },
        "少",
        import_react15.default.createElement("i", { className: "l1" }),
        import_react15.default.createElement("i", { className: "l2" }),
        import_react15.default.createElement("i", { className: "l3" }),
        import_react15.default.createElement("i", { className: "l4" }),
        "多"
      )
    ),
    error ? import_react15.default.createElement("div", { className: "eg-dash-error" }, error) : null,
    records.length ? import_react15.default.createElement(
      "div",
      null,
      import_react15.default.createElement("div", { className: "eg-hist-title" }, "每日学习记录"),
      import_react15.default.createElement("div", { className: "eg-hist" }, recordNodes)
    ) : import_react15.default.createElement("div", { className: "eg-dash-empty" }, loading ? "正在加载…" : "还没有学习记录，去练几题吧。")
  );
}

// src/client/features/settings/SettingsPanel.js
var import_react16 = __toESM(require("react"), 1);
var cachedSettings = null;
function SettingsPanel({ onTopicChange, onPhraseConfigChange }) {
  const shared = useShared();
  const [data, setData] = (0, import_react16.useState)(() => cachedSettings);
  const [busy, setBusy] = (0, import_react16.useState)(false);
  const [error, setError] = (0, import_react16.useState)("");
  const [draft, setDraft] = (0, import_react16.useState)("");
  const [loading, setLoading] = (0, import_react16.useState)(() => !cachedSettings);
  const load = (0, import_react16.useCallback)(async () => {
    if (!cachedSettings) setLoading(true);
    try {
      const result = await api("/settings");
      cachedSettings = result;
      setData(result);
      store.setSettings(result.settings);
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
    async (patch, changeScope) => {
      if (busy) return false;
      setBusy(true);
      setError("");
      try {
        const result = await api("/settings", {
          method: "POST",
          body: JSON.stringify(patch)
        });
        cachedSettings = result;
        setData(result);
        store.setSettings(result.settings);
        if (changeScope === true || changeScope === "topic") {
          if (typeof onTopicChange === "function") onTopicChange();
        } else if (changeScope === "phrase") {
          if (typeof onPhraseConfigChange === "function") onPhraseConfigChange();
        }
        return true;
      } catch (e) {
        setError(e.message || "设置保存失败");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [busy, onTopicChange, onPhraseConfigChange]
  );
  const settings = data ? data.settings : shared.settings;
  const directions = data ? data.directions : [];
  const customTopics = settings.customTopics || [];
  const activeId = settings.topicId;
  const chooseDirection = (id) => {
    if (busy || id === activeId) return;
    save({ topicId: id }, true);
  };
  const addCustom = async () => {
    const label = draft.trim();
    if (!label || busy) return;
    const ok = await save({ customTopics: customTopics.concat({ label }) }, true);
    if (ok) setDraft("");
  };
  const removeCustom = (id) => {
    if (busy) return;
    save({ customTopics: customTopics.filter((item) => item.id !== id) }, true);
  };
  const setRetries = (value) => {
    if (busy) return;
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
              disabled: busy,
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
              disabled: busy,
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
                "开启后，短语出题和今日报告会从当前词库挑词，自然融入句子和文章（不硬塞）。"
              )
            ),
            import_react16.default.createElement("button", {
              type: "button",
              className: "eg-switch",
              role: "switch",
              "aria-checked": settings.bankLink ? "true" : "false",
              "aria-label": "词库关联",
              disabled: busy,
              onClick: () => save({ bankLink: !settings.bankLink }, false)
            })
          ),
          settings.sessionLink ? import_react16.default.createElement(
            "div",
            { className: "eg-setting-note" },
            "已开启会话关联：短语训练优先按当前会话出题，词库关联仅用于今日报告或无可用会话时兜底。"
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
                      disabled: busy || !settings.bankLink || settings.bankRetries <= 0,
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
                      disabled: busy || !settings.bankLink || settings.bankRetries >= 5,
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
            settings.sessionLink ? "已开启会话关联，短语训练优先按当前会话出题；内容方向用于今日报告及无可用会话时兜底。" : "用于生成短语和今日报告；切换后下一题、下一篇生效。"
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
                  disabled: busy,
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
                    disabled: busy,
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
                    disabled: busy,
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
                disabled: busy || !draft.trim(),
                onClick: addCustom
              },
              "添加"
            )
          )
        )
      )
    ),
    error ? import_react16.default.createElement("div", { className: "eg-settings-error" }, error) : null
  );
}

// src/client/shell/EnglishGymBoard.js
var useIsoLayoutEffect = import_react17.default.useLayoutEffect || import_react17.useEffect;
var TABS = [
  { id: "word", label: "单词训练" },
  { id: "drill", label: "短语训练" },
  { id: "report", label: "今日报告" },
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
  const lastBurstRef = (0, import_react17.useRef)(shared.burst || 0);
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
  useIsoLayoutEffect(() => {
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
  useIsoLayoutEffect(() => {
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
    if (!store.stats) refreshStats();
  }, []);
  (0, import_react17.useEffect)(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") store.setOpen(false);
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
        ) : tab === "word" ? import_react17.default.createElement(WordPractice, { key: "word" }) : tab === "report" ? import_react17.default.createElement(Report, {
          report: dailyReport.report,
          loading: dailyReport.loading,
          error: dailyReport.error,
          onRefresh: () => dailyReport.refresh(true)
        }) : tab === "dashboard" ? import_react17.default.createElement(Dashboard, { key: "dashboard" }) : import_react17.default.createElement(SettingsPanel, {
          onPhraseConfigChange: drill.reset,
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
