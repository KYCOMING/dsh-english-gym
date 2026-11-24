import { createEnglishGym } from './src/host/plugin.js'

// host half needs the HTTP carrier; everything else is reached lazily via ctx.get()
export const inject = ['webServer']

/**
 * English Gym host half.
 *
 * Responsibilities:
 *  - persist practice progress + daily reports under $DSH_HOME (plain JSON, no deps)
 *  - expose a small JSON API for the resident widget (composer dock) over ctx.webServer
 *  - generate practice sentences / grade answers / write the daily AI-tech report via ctx.llm
 *  - (optional) register `english_*` tools so the main conversation can drill too
 */
export function apply(ctx, config) {
  const gym = createEnglishGym(ctx, config || {})
  ctx.effect(() => {
    const disposers = []
    // JSON API for the widget
    disposers.push(ctx.webServer.register(gym.route))
    // optional conversational tools (guarded so the widget never breaks on a tools mismatch)
    try {
      const off = gym.registerTools()
      if (off) disposers.push(off)
    } catch (error) {
      console.warn('[english-gym] tool registration skipped:', error && error.message)
    }
    // background daily reporter (best-effort, only if a timer is available)
    disposers.push(gym.startDailyReporter())
    return () => {
      for (const dispose of disposers) {
        try {
          dispose()
        } catch {
          /* ignore */
        }
      }
    }
  })
}
