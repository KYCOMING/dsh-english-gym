import { dayKey, loadReport, loadState, saveReport } from '../../core/store.js'
import { generateReport } from './generate.js'
import { normalizeSettings } from '../settings/service.js'
import { pickBankCandidates } from '../word/sample.js'

/** Daily AI/tech report: cache per day, generate on demand, warm in the background. */
export function createReportService({ ctx, conf, dir, getTopic, getReportLevel }) {
  const reportInflight = new Map()

  async function getReport(force) {
    const day = dayKey()
    const state = loadState(dir)
    const opts = normalizeSettings(state.settings)
    const bankLink = opts.bankLink !== false
    const bankId = bankLink ? state.wordBankId || 'builtin' : null
    const level = typeof getReportLevel === 'function' ? getReportLevel() : conf.level

    if (!force) {
      const cached = loadReport(dir, day)
      if (cached && cached.body && cached.level === level) {
        // Reuse today's report only if it was generated for the same difficulty and word-bank mode.
        if (bankLink) {
          if (cached.bankLink === true && cached.bankId === bankId) return cached
        } else if (cached.bankLink !== true) {
          return cached
        }
      }
    }

    const key = `${day}|${level}|${bankLink ? bankId : 'off'}`
    if (reportInflight.has(key)) return reportInflight.get(key)
    const job = (async () => {
      const topic = typeof getTopic === 'function' ? getTopic() : conf.topic
      const words = bankLink ? pickBankCandidates(dir, state, 30) : []
      const retries = bankLink ? opts.bankRetries : 0
      let report = null
      for (let attempt = 0; attempt <= retries; attempt += 1) {
        report = await generateReport(ctx, conf, { level, date: day, topic, words })
        if (!report || report.fallback) break
        const used = Array.isArray(report.bankWords) ? report.bankWords : []
        if (!words.length || used.length >= 2) break
      }
      report.bankLink = bankLink
      report.bankId = bankId
      if (!Array.isArray(report.bankWords)) report.bankWords = []
      saveReport(dir, day, report)
      return report
    })()
    reportInflight.set(key, job)
    try {
      return await job
    } finally {
      reportInflight.delete(key)
    }
  }

  function startDailyReporter() {
    const reportHour = Number(conf.reportHour)
    const noop = () => {}

    const tick = async () => {
      if (!Number.isFinite(reportHour)) return
      const now = new Date()
      if (now.getHours() < reportHour) return
      // getReport(false) reuses a valid cached report and only calls the model
      // when today's report is missing or the word-bank mode changed.
      try {
        await getReport(false)
      } catch {
        /* ignore, retry next tick */
      }
    }

    const interval = setInterval(() => {
      tick().catch(noop)
    }, 30 * 60 * 1000)
    const warm = setTimeout(() => {
      tick().catch(noop)
    }, 20 * 1000)
    if (interval && typeof interval.unref === 'function') interval.unref()
    if (warm && typeof warm.unref === 'function') warm.unref()

    return () => {
      clearInterval(interval)
      clearTimeout(warm)
    }
  }

  return { getReport, startDailyReporter }
}
