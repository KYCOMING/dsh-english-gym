import { completeText, extractJson } from '../../core/llm.js'
import { SEED_QUESTIONS } from './seed.js'

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
