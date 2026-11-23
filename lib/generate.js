import { completeText, extractJson } from './llm.js'
import { SEED_QUESTIONS, FALLBACK_REPORT } from './seed.js'

function pickLevel(level, fallback) {
  return typeof level === 'string' && level.trim() ? level.trim() : fallback || 'B1'
}

/** Random built-in question, used as a fallback when generation fails. */
export function seedQuestion() {
  return SEED_QUESTIONS[Math.floor(Math.random() * SEED_QUESTIONS.length)]
}

const QUESTION_SYSTEM =
  'You generate concise English practice material for Chinese learners. Reply with JSON only.'

/**
 * Generate one Chinese→English translation prompt.
 * @returns {Promise<{zh:string, en:string, hint:string}>}
 */
export async function generateQuestion(ctx, config, { level, topic } = {}) {
  const lvl = pickLevel(level, config && config.level)
  const theme = topic || (config && config.topic) || 'AI and technology'
  const prompt =
    `Create ONE Chinese sentence for a Chinese learner to translate into English.\n` +
    `CEFR level: ${lvl}.\n` +
    `Theme: ${theme} (the English sentence should be natural, useful workplace / tech English).\n` +
    `Length: 6-16 words. Avoid proper nouns and ambiguity.\n` +
    `Also give a short Chinese hint (a key word or structure, 2-8 Chinese characters or a short phrase).\n` +
    'Reply with ONLY this JSON: {"zh": "...", "en": "...", "hint": "..."}'

  try {
    const text = await completeText(ctx, config, {
      system: QUESTION_SYSTEM,
      prompt,
      temperature: 0.8,
      maxTokens: 700,
    })
    const parsed = extractJson(text)
    if (parsed && parsed.zh && parsed.en) {
      return {
        zh: String(parsed.zh).trim(),
        en: String(parsed.en).trim(),
        hint: parsed.hint ? String(parsed.hint).trim() : '',
      }
    }
  } catch {
    /* fall back to seed */
  }
  return seedQuestion()
}

const REPORT_SYSTEM =
  'You write short, engaging English reading material for Chinese tech workers who are learning English. Reply with JSON only.'

/**
 * Generate (or reuse) today's AI/tech English mini-report.
 * @returns {Promise<{date:string, level:string, title:string, body:string, summary_zh:string, questions:Array<{zh:string,en:string}>}>}
 */
export async function generateReport(ctx, config, { level, date, topic } = {}) {
  const lvl = pickLevel(level, config && config.level)
  const theme = topic || (config && config.topic) || 'AI and technology'
  const day = date || new Date().toISOString().slice(0, 10)
  const prompt =
    `Write an English mini-report for ${day} about ${theme}, for a Chinese learner at CEFR ${lvl}.\n` +
    'Requirements:\n' +
    '- A catchy English title (4-8 words).\n' +
    '- A 180-240 word English article in 3 short paragraphs. Clear, natural, informative, level-appropriate.\n' +
    '- 3 Chinese sentences based on the article, each with its natural English reference sentence (for translation practice).\n' +
    '- A one-line summary in Simplified Chinese.\n' +
    'Reply with ONLY this JSON: {"title":"...","body":"...","summary_zh":"...","questions":[{"zh":"...","en":"..."}]}'

  try {
    const text = await completeText(ctx, config, {
      system: REPORT_SYSTEM,
      prompt,
      temperature: 0.6,
      maxTokens: 4000,
    })
    const parsed = extractJson(text)
    if (parsed && parsed.title && parsed.body) {
      const questions = Array.isArray(parsed.questions)
        ? parsed.questions
            .filter((q) => q && q.zh && q.en)
            .slice(0, 5)
            .map((q) => ({ zh: String(q.zh).trim(), en: String(q.en).trim() }))
        : []
      return {
        date: day,
        level: lvl,
        title: String(parsed.title).trim(),
        body: String(parsed.body).trim(),
        summary_zh: parsed.summary_zh ? String(parsed.summary_zh).trim() : '',
        questions: questions.length ? questions : FALLBACK_REPORT.questions,
      }
    }
  } catch {
    /* fall back to built-in report */
  }
  return {
    date: day,
    level: lvl,
    title: FALLBACK_REPORT.title,
    body: FALLBACK_REPORT.body,
    summary_zh: FALLBACK_REPORT.summary_zh,
    questions: FALLBACK_REPORT.questions,
  }
}
