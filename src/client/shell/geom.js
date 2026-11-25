import { clamp } from '../components/motion.js'

export const GEOM_KEY = 'eg-board-geom-v3'
export const MIN_TOP = 44
export const EDGE_PAD = 8

export function loadGeom() {
  try {
    const g = JSON.parse(localStorage.getItem(GEOM_KEY) || 'null')
    if (g && g.w && g.h) return g
  } catch {
    /* ignore */
  }
  return null
}

export function fitGeom(g) {
  const vw = window.innerWidth || 1200
  const vh = window.innerHeight || 800
  const w = clamp(g.w, 240, Math.max(240, vw - EDGE_PAD * 2))
  const h = clamp(g.h, 170, Math.max(170, vh - MIN_TOP - EDGE_PAD))
  const x = clamp(g.x, EDGE_PAD, Math.max(EDGE_PAD, vw - w - EDGE_PAD))
  const y = clamp(g.y, MIN_TOP, Math.max(MIN_TOP, vh - 44))
  return { x, y, w, h }
}

// Default placement: sit just above the "English Gym" pill, horizontally
// centred on it. Falls back to bottom-centre when the pill isn't mounted.
export function pillAnchorGeom() {
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
