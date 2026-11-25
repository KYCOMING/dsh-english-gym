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

function normalizeHighlights(raw) {
  if (!Array.isArray(raw)) return []
  const out = []
  const seen = new Set()
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const en = typeof item.en === 'string' ? item.en.trim().slice(0, 60) : ''
    const zh = typeof item.zh === 'string' ? item.zh.trim().slice(0, 40) : ''
    if (!en || !zh) continue
    const key = en.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ en, zh })
    if (out.length >= 4) break
  }
  return out
}

/**
 * Grade one answer. Exact matches skip the model; otherwise ask the model, with a
 * deterministic fuzzy fallback if no model is available.
 * @returns {Promise<{correct:boolean, exact:boolean, score:number, reference:string, tip:string, corrected?:string, highlights?:Array<{en:string, zh:string}>}>}
 */
export async function gradeAnswer(ctx, config, { zh, reference, answer }) {
  const local = localGrade(answer, reference)
  if (!normalize(answer)) {
    return { correct: false, exact: false, score: 0, reference, tip: '请先输入你的英文译文再提交。', corrected: reference, highlights: [] }
  }
  if (local.exact) {
    return { correct: true, exact: true, score: 100, reference, tip: '与参考译文完全一致，表达准确自然。', corrected: reference, highlights: [] }
  }

  const prompt =
    `Chinese: ${zh}\n` +
    `Reference English: ${reference}\n` +
    `Learner answer: ${answer}\n\n` +
    'Decide whether the learner answer is a correct, natural English translation of the Chinese with the same meaning. ' +
    'Minor style differences are acceptable; wrong meaning or clear grammar errors are not. ' +
    'If the learner wrote a genuine English attempt that can be improved by minor edits, put that revised version in "corrected"; otherwise set "corrected" to the Reference English. ' +
    'Also extract 2-3 useful English words, phrases, or collocations from the reference sentence with concise Simplified Chinese glosses. ' +
    'Reply with ONLY this JSON: {"correct": true|false, "score": 0-100, "corrected": "revised version of learner English or Reference English", "tip": "1-2 concise sentences of specific feedback in Simplified Chinese", "highlights": [{"en": "useful phrase", "zh": "简短中文释义"}]}'

  try {
    const text = await completeText(ctx, config, {
      system: GRADER_SYSTEM,
      prompt,
      temperature: 0,
      maxTokens: 800,
    })
    const parsed = extractJson(text)
    if (parsed && typeof parsed.correct === 'boolean') {
      const score = Number.isFinite(parsed.score) ? Math.max(0, Math.min(100, Math.round(parsed.score))) : parsed.correct ? 90 : 40
      return {
        correct: parsed.correct,
        exact: false,
        score,
        reference,
        tip: typeof parsed.tip === 'string' && parsed.tip.trim() ? parsed.tip.trim() : parsed.correct ? '意思准确，表达自然。' : '再想想，注意关键词和语序。',
        corrected: typeof parsed.corrected === 'string' && parsed.corrected.trim() ? parsed.corrected.trim() : reference,
        highlights: normalizeHighlights(parsed.highlights),
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
    tip: local.correct ? '很接近参考答案，表达基本准确。' : '与参考答案差别较大，对照参考译文再试一次。',
    corrected: reference,
    highlights: [],
  }
}
