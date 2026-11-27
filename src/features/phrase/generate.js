import { completeText, extractJson } from '../../core/llm.js'
import { SEED_QUESTIONS } from './seed.js'
import { formatCandidateList, usedBankWords } from '../word/sample.js'

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
 * When `sessionContext` is provided, grounds the sentence in the learner's
 * current conversation workflow instead of `topic` and `words`.
 * @returns {Promise<{zh:string, en:string, hint:string, used:string[], fallback?:boolean}>}
 */
export async function generateQuestion(ctx, config, { level, topic, words, sessionContext, avoid, reasoningEffort } = {}) {
  const lvl = pickLevel(level, config && config.level)
  const excerpt = typeof sessionContext === 'string' ? sessionContext.trim() : ''
  const avoidList = Array.isArray(avoid) ? avoid.map((s) => String(s || '').trim()).filter(Boolean).slice(0, 6) : []
  const candidates = excerpt ? [] : Array.isArray(words) ? words : []

  let prompt = ''
  if (excerpt) {
    prompt =
      `Create ONE Chinese sentence for a Chinese learner to translate into English, grounded in the learner's current conversation below.\n` +
      `CEFR level: ${lvl}.\n` +
      `Goal: write a practical, natural sentence (6-16 English words) that reflects the workflow, task, problem, or discussion in this conversation — something the learner could genuinely say or write in English in this context.\n` +
      `Privacy & clarity: NEVER copy private filenames, code identifiers, variable names, URLs, secrets, or niche proper nouns verbatim; generalize them into clean, natural English.\n` +
      `Also give a short ENGLISH hint that genuinely helps a Chinese learner: the 1-3 key English words, ` +
      `phrases or collocations the answer should use (e.g. "reproduce the bug; roll back"), plus optionally ` +
      `a brief English sentence frame. English only, never the full translation, max ~15 words.\n` +
      `Conversation excerpt:\n${excerpt}\n`
    if (avoidList.length) {
      prompt +=
        `Do NOT repeat or closely paraphrase these recent practice sentences; pick a fresh angle or detail:\n` +
        avoidList.map((s) => `- ${s}`).join('\n') +
        '\n'
    }
  } else {
    const theme = topic || (config && config.topic) || 'AI and technology'
    prompt =
      `Create ONE Chinese sentence for a Chinese learner to translate into English.\n` +
      `CEFR level: ${lvl}.\n` +
      `Theme: ${theme} (the English sentence should be natural, idiomatic, and practical).\n` +
      `Length: 6-16 words. Avoid proper nouns and ambiguity.\n` +
      `Also give a short ENGLISH hint that genuinely helps a Chinese learner: the 1-3 key English words, ` +
      `phrases or collocations the answer should use (e.g. "business trip; get to know"), plus optionally ` +
      `a brief English sentence frame. English only, never the full translation, max ~15 words.\n`
    if (candidates.length) {
      prompt +=
        `Optional vocabulary from the learner's current word bank. Weave 2-4 of these into the English sentence ` +
        `ONLY where they fit naturally; skip the rest, never force them, and never list or mention them:\n` +
        `${formatCandidateList(candidates)}\n`
    }
  }
  prompt += 'Reply with ONLY this JSON: {"zh": "...", "en": "...", "hint": "..."}'

  try {
    const text = await completeText(ctx, config, {
      system: QUESTION_SYSTEM,
      prompt,
      temperature: 0.8,
      maxTokens: 700,
      reasoningEffort,
    })
    const parsed = extractJson(text)
    if (parsed && parsed.zh && parsed.en) {
      const en = String(parsed.en).trim()
      return {
        zh: String(parsed.zh).trim(),
        en,
        hint: parsed.hint ? String(parsed.hint).trim() : '',
        used: candidates.length ? usedBankWords(en, candidates) : [],
      }
    }
  } catch {
    /* fall back to seed */
  }
  return { ...seedQuestion(), used: [], fallback: true }
}
