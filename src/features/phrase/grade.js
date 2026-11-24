import { completeText, extractJson } from '../../core/llm.js'
import { normalize, tokenOverlap } from '../../shared/text.js'

export function localGrade(answer, reference) {
  const ans = normalize(answer)
  const ref = normalize(reference)
  if (!ans) return { correct: false, exact: false, similarity: 0 }
  const exact = ans === ref
  const similarity = tokenOverlap(ans, ref)
  return { correct: exact || similarity >= 0.85, exact, similarity }
}

const GRADER_SYSTEM =
  'You are a strict but encouraging English teacher. You grade a Chinese learner\'s English translation. ' +
  'Accept natural, meaning-preserving variants; reject wrong meaning or clear grammar mistakes. Reply with JSON only.'

/**
 * Grade one answer. Exact matches skip the model; otherwise ask the model, with a
 * deterministic fuzzy fallback if no model is available.
 * @returns {Promise<{correct:boolean, exact:boolean, score:number, reference:string, tip:string, corrected?:string}>}
 */
export async function gradeAnswer(ctx, config, { zh, reference, answer }) {
  const local = localGrade(answer, reference)
  if (local.exact) {
    return { correct: true, exact: true, score: 100, reference, tip: '完全正确 ✅', corrected: reference }
  }

  const prompt =
    `Chinese: ${zh}\n` +
    `Reference English: ${reference}\n` +
    `Learner answer: ${answer}\n\n` +
    'Decide whether the learner answer is a correct, natural English translation of the Chinese with the same meaning. ' +
    'Minor style differences are acceptable; wrong meaning or clear grammar errors are not. ' +
    'Reply with ONLY this JSON: {"correct": true|false, "score": 0-100, "corrected": "a natural correct English version", "tip": "one short sentence of feedback in Simplified Chinese"}'

  try {
    const text = await completeText(ctx, config, {
      system: GRADER_SYSTEM,
      prompt,
      temperature: 0,
      maxTokens: 600,
    })
    const parsed = extractJson(text)
    if (parsed && typeof parsed.correct === 'boolean') {
      const score = Number.isFinite(parsed.score) ? Math.max(0, Math.min(100, Math.round(parsed.score))) : parsed.correct ? 90 : 40
      return {
        correct: parsed.correct,
        exact: false,
        score,
        reference,
        tip: typeof parsed.tip === 'string' && parsed.tip.trim() ? parsed.tip.trim() : parsed.correct ? '意思正确 ✅' : '再想想，注意关键词和语序',
        corrected: typeof parsed.corrected === 'string' && parsed.corrected.trim() ? parsed.corrected.trim() : reference,
      }
    }
  } catch {
    /* fall through to fuzzy result */
  }

  return {
    correct: local.correct,
    exact: false,
    score: Math.round(local.similarity * 100),
    reference,
    tip: local.correct ? '很接近参考答案 ✅' : '与参考答案差别较大，再试一次',
    corrected: reference,
  }
}
