import { useEffect, useReducer } from 'react'
import { api } from './api.js'

// Shared state between the inline pill and the floating board.
export const store = {
  open: false,
  stats: null,
  sessionId: '',
  settings: { confetti: true, topicId: 'ai', customTopics: [], bankLink: true, bankRetries: 1, sessionLink: false },
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
  setSessionId(id) {
    const next = typeof id === 'string' ? id : ''
    if (this.sessionId === next) return
    this.sessionId = next
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

export async function refreshStats() {
  try {
    store.setStats(await api('/state'))
  } catch {
    /* ignore */
  }
}

export function useShared() {
  const [, force] = useReducer((x) => x + 1, 0)
  useEffect(() => store.subscribe(force), [])
  return store
}
