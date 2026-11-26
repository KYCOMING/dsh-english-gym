import { completeText, extractJson } from '../../core/llm.js'

const HAS_CJK = /[\u4e00-\u9fff]/

function clean(value) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim()
}

const EXPLAIN_SYSTEM =
  'You are a concise English-to-Chinese reading coach for Chinese learners. ' +
  'Explain sentence structure, key expressions, and why the sentence is translated that way in Simplified Chinese. ' +
  'Reply with JSON only.'

/**
 * Validate and normalize an on-demand sentence translation explanation.
 *
 * @returns {{structure:string, points:Array<{phrase:string, note:string}>, nuance:string} | null}
 */
export function normalizeExplanation(raw) {
  if (!raw || typeof raw !== 'object') return null

  const rawStructure = clean(raw.structure)
  const structure = HAS_CJK.test(rawStructure) ? rawStructure.slice(0, 240) : ''

  const points = []
  for (const item of Array.isArray(raw.points) ? raw.points : []) {
    if (!item || typeof item !== 'object') continue
    if (points.length >= 4) break
    const phrase = clean(item.phrase).slice(0, 60)
    const note = clean(item.note).slice(0, 160)
    if (!phrase || !HAS_CJK.test(note)) continue
    points.push({ phrase, note })
  }

  const rawNuance = clean(raw.nuance)
  const nuance = HAS_CJK.test(rawNuance) ? rawNuance.slice(0, 240) : ''

  if (!structure && !points.length && !nuance) return null
  return { structure, points, nuance }
}

/**
 * Request an on-demand explanation of sentence grammar and translation choices.
 */
export async function explainReportSentence(ctx, config, { en, zh, context, level } = {}) {
  const lvl = (typeof level === 'string' && level.trim()) || (config && config.level) || 'B1'
  const sentenceEn = clean(en).slice(0, 1000)
  const sentenceZh = clean(zh).slice(0, 1000)
  const ctxText = clean(context).slice(0, 1200)

  let prompt = `Target CEFR level: ${lvl}\nEnglish sentence: ${sentenceEn}\n`
  if (sentenceZh) prompt += `Chinese translation: ${sentenceZh}\n`
  if (ctxText) prompt += `Paragraph context: ${ctxText}\n`
  prompt +=
    'Explain clearly and concisely why this sentence is structured and translated this way for a Chinese learner. No greetings or filler.\n' +
    'Include 1-3 high-value items in "points".\n' +
    'Reply with ONLY this JSON: {"structure":"1-2句简明拆解主干与从句/修饰关系","points":[{"phrase":"原句中的关键词/短语/语法点","note":"简短中文点拨及译法原因"}],"nuance":"1句说明为什么这样译（语序调整、词义引申或中文表达习惯）"}'

  const text = await completeText(ctx, config, {
    system: EXPLAIN_SYSTEM,
    prompt,
    temperature: 0.3,
    maxTokens: 900,
    purpose: 'english-gym-explain',
  })

  const parsed = extractJson(text)
  const normalized = normalizeExplanation(parsed)
  if (!normalized) {
    throw new Error('讲解解析失败，请重试')
  }
  return normalized
}
