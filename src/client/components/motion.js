import { useEffect, useState } from 'react'

export const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)

// Small springy "tap" on the submit button: add a class for one animation
// cycle so the button compresses and bounces back even after pointer-up.
export function bounceButton(e) {
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

export function prefersReducedMotion() {
  try {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  } catch {
    return false
  }
}

export function popElement(el, cls, ms) {
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

export function useCountUp(target, active) {
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
