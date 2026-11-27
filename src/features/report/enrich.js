import { completeText, extractJson } from '../../core/llm.js'
import { normalizeCore } from './structure.js'

const HAS_CJK = /[\u4e00-\u9fff]/

function clean(value) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim()
}

const ENRICH_SYSTEM = 'You are an English-to-Chinese reading assistant. Reply with compact JSON only.'

/**
 * Merge Phase 2 enrichment (paragraph gists, sentence translations, main-clause
 * core skeletons, and practice questions) onto a Phase 1 report without
 * touching `en`, `chunks`, or existing sentence `explain` payloads.
 *
 * @returns {{report:object, addedZh:number, addedGists:number, addedQuestions:number}}
 */
export function mergeReportEnrichment(report, raw) {
  const base = report && typeof report === 'object' ? report : {}
  const srcParagraphs = Array.isArray(base.paragraphs) ? base.paragraphs : []
  const rawObj = raw && typeof raw === 'object' ? raw : null
  const rawParagraphs = rawObj && Array.isArray(rawObj.paragraphs) ? rawObj.paragraphs : []

  let addedZh = 0
  let addedGists = 0

  const nextParagraphs = srcParagraphs.map((p, pi) => {
    const rawPara = rawParagraphs[pi]
    const rpArray = Array.isArray(rawPara) ? rawPara : null
    const rp = !rpArray && rawPara && typeof rawPara === 'object' ? rawPara : null
    const rawGist = rp ? clean(rp.gist_zh || rp.gist) : ''
    const nextGist = HAS_CJK.test(rawGist) ? rawGist.slice(0, 80) : clean(p.gist_zh)
    if (HAS_CJK.test(rawGist)) addedGists += 1

    const zhArr = rpArray || (rp && (Array.isArray(rp.zh) ? rp.zh : Array.isArray(rp.translations) ? rp.translations : null))
    const coreArr = rp && Array.isArray(rp.core) ? rp.core : null
    const objSents = rp && Array.isArray(rp.sentences) ? rp.sentences : null

    const nextSentences = (Array.isArray(p.sentences) ? p.sentences : []).map((s, si) => {
      const sentItem = objSents ? objSents[si] : null
      const objSent = sentItem && typeof sentItem === 'object' ? sentItem : null
      const rawZh = clean(zhArr ? zhArr[si] : typeof sentItem === 'string' ? sentItem : objSent ? objSent.zh : '')
      const validZh = HAS_CJK.test(rawZh) ? rawZh.slice(0, 240) : ''
      if (validZh) addedZh += 1

      const rawCore = coreArr ? coreArr[si] : objSent ? objSent.core : null
      const core = normalizeCore(rawCore, s.en)

      const merged = {
        en: s.en,
        zh: validZh || clean(s.zh),
      }
      if (Array.isArray(s.chunks) && s.chunks.length >= 2) merged.chunks = s.chunks
      if (core.length >= 1) merged.core = core
      else if (Array.isArray(s.core) && s.core.length >= 1) merged.core = s.core
      if (s.explain) merged.explain = s.explain
      return merged
    })

    return {
      gist_zh: nextGist,
      sentences: nextSentences,
    }
  })

  const parsedQuestions =
    rawObj && Array.isArray(rawObj.questions)
      ? rawObj.questions
          .filter((q) => q && q.zh && q.en)
          .slice(0, 5)
          .map((q) => ({ zh: clean(q.zh).slice(0, 240), en: clean(q.en).slice(0, 320) }))
      : []
  const addedQuestions = parsedQuestions.length
  const nextQuestions = addedQuestions ? parsedQuestions : Array.isArray(base.questions) ? base.questions : []

  return {
    report: {
      ...base,
      paragraphs: nextParagraphs,
      questions: nextQuestions,
      enriched: true,
    },
    addedZh,
    addedGists,
    addedQuestions,
  }
}

/**
 * Generate Phase 2 enrichment for a Phase 1 report: paragraph gists, sentence
 * translations, main-clause cores, and 3 practice questions.
 */
export async function enrichReportContent(ctx, config, report, { reasoningEffort } = {}) {
  const srcParagraphs = Array.isArray(report && report.paragraphs) ? report.paragraphs : []
  if (!srcParagraphs.length) {
    return { ...(report || {}), enriched: true }
  }

  const inputSentences = srcParagraphs.map((p) => (Array.isArray(p.sentences) ? p.sentences.map((s) => s.en) : []))
  const lvl = clean(report && report.level) || (config && config.level) || 'B1'
  const title = clean(report && report.title) || 'Daily Report'

  const prompt =
    `Article (${lvl}): "${title}"\n` +
    `Sentences by paragraph (JSON):\n${JSON.stringify(inputSentences)}\n\n` +
    'For each paragraph above in the exact same order, provide:\n' +
    '- "gist_zh": one-line Simplified Chinese gist (<= 30 chars).\n' +
    '- "zh": array of faithful, natural Simplified Chinese translations matching each sentence 1:1 in order (avoid double quotes inside translations).\n' +
    '- "core" (optional): only for paragraphs with complex sentences (~14+ words or multiple clauses), an array matching "zh" with 1-2 short exact main-clause skeleton substrings per complex sentence (null for short ones); omit "core" completely for paragraphs with only short simple sentences.\n' +
    '- "questions": 3 Chinese sentences based on the article, each with its natural English reference sentence (for translation practice).\n' +
    'Reply with ONLY this JSON: {"paragraphs":[{"gist_zh":"...","zh":["..."],"core":[["..."],null]}],"questions":[{"zh":"...","en":"..."}]}'

  const text = await completeText(ctx, config, {
    system: ENRICH_SYSTEM,
    prompt,
    temperature: 0.3,
    maxTokens: 6000,
    timeoutMs: 90_000,
    purpose: 'english-gym-report-enrich',
    reasoningEffort,
  })

  const parsed = extractJson(text)
  const { report: merged, addedZh, addedGists, addedQuestions } = mergeReportEnrichment(report, parsed)
  if (!parsed || (addedZh === 0 && addedGists === 0 && addedQuestions === 0)) {
    throw new Error('译文与练习解析失败，请重试')
  }
  return merged
}
