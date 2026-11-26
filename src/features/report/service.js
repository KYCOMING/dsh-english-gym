import { dayKey, loadReport, loadState, saveReport } from '../../core/store.js'
import { generateReport } from './generate.js'
import { explainReportSentence, normalizeExplanation } from './explain.js'
import { REPORT_SCHEMA } from './structure.js'
import { normalizeSettings } from '../settings/service.js'
import { pickBankCandidates } from '../word/sample.js'
import { pruneOldReports } from '../activity/cleanup.js'

/** Daily AI/tech report: cache per day, generate on demand, warm in the background. */
export function createReportService({ ctx, conf, dir, getTopic, getReportLevel }) {
  const reportInflight = new Map()
  const explainInflight = new Map()

  async function getReport(force) {
    const day = dayKey()
    const state = loadState(dir)
    const opts = normalizeSettings(state.settings)
    const bankLink = opts.bankLink !== false
    const bankId = bankLink ? state.wordBankId || 'builtin' : null
    const level = typeof getReportLevel === 'function' ? getReportLevel() : conf.level
    const topic = typeof getTopic === 'function' ? getTopic() : conf.topic

    if (!force) {
      const cached = loadReport(dir, day)
      if (
        cached &&
        cached.body &&
        !cached.fallback &&
        (cached.schema || 1) >= REPORT_SCHEMA &&
        cached.level === level &&
        cached.topic === topic
      ) {
        // Reuse today's report only if it was generated for the same difficulty, topic, and word-bank mode.
        if (bankLink) {
          if (cached.bankLink === true && cached.bankId === bankId) return cached
        } else if (cached.bankLink !== true) {
          return cached
        }
      }
    }

    const key = `${day}|${level}|${topic}|${bankLink ? bankId : 'off'}`
    if (reportInflight.has(key)) return reportInflight.get(key)
    const job = (async () => {
      const words = bankLink ? pickBankCandidates(dir, state, 30) : []
      const retries = bankLink ? opts.bankRetries : 0
      let best = null
      let last = null
      for (let attempt = 0; attempt <= retries; attempt += 1) {
        const r = await generateReport(ctx, conf, { level, date: day, topic, words })
        last = r
        if (!r || r.fallback) break
        const usedCount = Array.isArray(r.bankWords) ? r.bankWords.length : 0
        const bestCount = best && Array.isArray(best.bankWords) ? best.bankWords.length : -1
        if (!best || usedCount > bestCount) best = r
        if (!words.length || usedCount >= 2) break
      }
      const report = best || last
      report.topic = topic
      report.bankLink = bankLink
      report.bankId = bankId
      if (!Array.isArray(report.bankWords)) report.bankWords = []
      if (!report.fallback) {
        saveReport(dir, day, report)
        try {
          pruneOldReports(dir, 90)
        } catch {
          /* ignore */
        }
      }
      return report
    })()
    reportInflight.set(key, job)
    try {
      return await job
    } finally {
      reportInflight.delete(key)
    }
  }

  async function explainSentence(payload = {}) {
    const cleanText = (v) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim()
    const en = cleanText(payload.en).slice(0, 1000)
    if (!en) {
      const err = new Error('missing sentence')
      err.status = 400
      throw err
    }
    const zh = cleanText(payload.zh).slice(0, 1000)
    const context = cleanText(payload.context).slice(0, 1200)
    const day =
      typeof payload.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(payload.date.trim())
        ? payload.date.trim()
        : dayKey()
    const lvl =
      typeof payload.level === 'string' && payload.level.trim()
        ? payload.level.trim()
        : typeof getReportLevel === 'function'
          ? getReportLevel()
          : conf.level
    const pIdx = Number.isInteger(payload.paragraphIndex) ? payload.paragraphIndex : -1
    const sIdx = Number.isInteger(payload.sentenceIndex) ? payload.sentenceIndex : -1

    const findSentence = (report) => {
      const paras = report && Array.isArray(report.paragraphs) ? report.paragraphs : []
      if (pIdx >= 0 && sIdx >= 0 && paras[pIdx] && Array.isArray(paras[pIdx].sentences)) {
        const direct = paras[pIdx].sentences[sIdx]
        if (direct && cleanText(direct.en) === en) return direct
      }
      for (const p of paras) {
        if (!p || !Array.isArray(p.sentences)) continue
        for (const s of p.sentences) {
          if (s && cleanText(s.en) === en) return s
        }
      }
      return null
    }

    const cached = loadReport(dir, day)
    if (cached && !cached.fallback) {
      const hit = findSentence(cached)
      const normalized = hit ? normalizeExplanation(hit.explain) : null
      if (normalized) return { explain: normalized, cached: true }
    }

    const key = `${en}\0${zh}\0${lvl}`
    let job = explainInflight.get(key)
    if (!job) {
      job = (async () => {
        const explain = await explainReportSentence(ctx, conf, { en, zh, context, level: lvl })
        const latest = loadReport(dir, day)
        if (latest && !latest.fallback) {
          const target = findSentence(latest)
          if (target) {
            target.explain = explain
            saveReport(dir, day, latest)
          }
        }
        return explain
      })()
      explainInflight.set(key, job)
    }

    try {
      const explain = await job
      return { explain, cached: false }
    } finally {
      if (explainInflight.get(key) === job) explainInflight.delete(key)
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

  return { getReport, explainSentence, startDailyReporter }
}
