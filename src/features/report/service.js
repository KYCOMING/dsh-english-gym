import { dayKey, loadReport, saveReport } from '../../core/store.js'
import { generateReport } from './generate.js'

/** Daily AI/tech report: cache per day, generate on demand, warm in the background. */
export function createReportService({ ctx, conf, dir, getTopic }) {
  const reportInflight = new Map()

  async function getReport(force) {
    const day = dayKey()
    if (!force) {
      const cached = loadReport(dir, day)
      if (cached && cached.body) return cached
    }
    if (reportInflight.has(day)) return reportInflight.get(day)
    const job = (async () => {
      const topic = typeof getTopic === 'function' ? getTopic() : conf.topic
      const report = await generateReport(ctx, conf, { level: conf.level, date: day, topic })
      saveReport(dir, day, report)
      return report
    })()
    reportInflight.set(day, job)
    try {
      return await job
    } finally {
      reportInflight.delete(day)
    }
  }

  function startDailyReporter() {
    const reportHour = Number(conf.reportHour)
    const noop = () => {}

    const tick = async () => {
      if (!Number.isFinite(reportHour)) return
      const now = new Date()
      if (now.getHours() < reportHour) return
      const day = dayKey(now)
      if (loadReport(dir, day)) return
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
