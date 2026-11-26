import { completeText, extractJson } from '../../core/llm.js'
import { FALLBACK_REPORT } from './fallback.js'
import { normalizeReportHighlights } from './highlights.js'
import { REPORT_SCHEMA, joinParagraphs, normalizeReportParagraphs } from './structure.js'
import { formatCandidateList, usedBankWords } from '../word/sample.js'

function pickLevel(level, fallback) {
  return typeof level === 'string' && level.trim() ? level.trim() : fallback || 'B1'
}

const LEVEL_STYLE = {
  A1: 'very simple short sentences and basic everyday vocabulary',
  A2: 'simple, direct sentences and common practical vocabulary',
  B1: 'clear, natural prose with useful everyday expressions',
  B2: 'fluent, nuanced prose with varied sentence structures and mid-advanced vocabulary',
  C1: 'sophisticated, idiomatic editorial prose with precise vocabulary and complex clauses',
  C2: 'native-level, publication-grade prose with subtle nuance, rich idioms, and advanced vocabulary',
}

const REPORT_SYSTEM =
  'You write short, engaging English reading material for Chinese learners. Reply with JSON only.'

/**
 * Generate (or reuse) today's AI/tech English mini-report.
 * @returns {Promise<{date:string, level:string, title:string, body:string, paragraphs:Array<{gist_zh:string, sentences:Array<{en:string, zh:string, chunks?:string[], core?:string[]}>}>, summary_zh:string, questions:Array<{zh:string,en:string}>}>}
 */
export async function generateReport(ctx, config, { level, date, topic, words } = {}) {
  const lvl = pickLevel(level, config && config.level)
  const levelGuide = LEVEL_STYLE[lvl.toUpperCase()] || LEVEL_STYLE.B1
  const theme = topic || (config && config.topic) || 'AI and technology'
  const day = date || new Date().toISOString().slice(0, 10)
  const candidates = Array.isArray(words) ? words : []
  let prompt =
    `Write a short English article for ${day} about ${theme}, for a Chinese learner at CEFR ${lvl}.\n` +
    'Requirements:\n' +
    '- A catchy English title (4-8 words).\n' +
    `- A 180-240 word English article in 3 short paragraphs using ${levelGuide}. Informative and strictly level-appropriate.\n` +
    '  Return the article as "paragraphs" (in order). Each paragraph has "gist_zh" (a one-line Simplified Chinese gist of that ' +
    'paragraph, <= 30 chars) and "sentences": the paragraph split into its sentences in order, each with "en" (the exact English ' +
    'sentence) and "zh" (a faithful, natural Simplified Chinese translation of that one sentence only). For sentences with ~10+ ' +
    'words or multiple clauses, also include "chunks" (2-5 exact consecutive substrings of "en" splitting it into natural reading ' +
    'sense groups, covering every word and punctuation mark of "en" verbatim in order) and "core" (1-2 short exact substrings of ' +
    '"en" in order showing the main clause subject + predicate skeleton, strictly shorter than "en"); omit "chunks" and "core" on ' +
    'very short simple sentences.\n' +
    '- 3 Chinese sentences based on the article, each with its natural English reference sentence (for translation practice).\n' +
    '- A one-line summary in Simplified Chinese.\n' +
    '- 6-8 key vocabulary highlights from the article (about 2-3 per paragraph — keep it selective, never over-highlight). ' +
    'Prefer single words plus at most 1-2 high-value short phrases/collocations useful for a CEFR ' + lvl + ' Chinese learner; ' +
    'skip ultra-basic words, numbers, and proper nouns. Each "word" MUST be the exact substring as written in one "en" sentence; ' +
    'give a concise in-context Simplified Chinese gloss in "zh" (<= 20 chars), short "pos" (n, v, adj, adv, phrase), and optional "lemma" when inflected.\n'
  if (candidates.length) {
    prompt +=
      `Optional vocabulary from the learner's current word bank. Naturally incorporate 4-6 of these where they ` +
      `fit the topic; skip any that feel forced, never mention or list them, keep the article level-appropriate. ` +
      `Include the incorporated word-bank words among the 6-8 "highlights" first, then fill the rest up to 6-8 total:\n` +
      `${formatCandidateList(candidates)}\n`
  }
  prompt +=
    'Reply with ONLY this JSON: {"title":"...","paragraphs":[{"gist_zh":"...","sentences":[{"en":"...","zh":"...","chunks":["..."],"core":["..."]}]}],"summary_zh":"...","highlights":[{"word":"...","lemma":"...","pos":"...","zh":"..."}],"questions":[{"zh":"...","en":"..."}]}'

  try {
    const text = await completeText(ctx, config, {
      system: REPORT_SYSTEM,
      prompt,
      temperature: 0.6,
      maxTokens: 6000,
    })
    const parsed = extractJson(text)
    // Prefer structured paragraphs (enables progressive translation); accept a plain "body" as a fallback.
    const paragraphs = parsed ? normalizeReportParagraphs(parsed.paragraphs) : null
    const body = paragraphs ? joinParagraphs(paragraphs) : parsed && parsed.body ? String(parsed.body).trim() : ''
    if (parsed && parsed.title && body) {
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
        body,
        paragraphs: paragraphs || [],
        schema: REPORT_SCHEMA,
        summary_zh: parsed.summary_zh ? String(parsed.summary_zh).trim() : '',
        highlights: normalizeReportHighlights(parsed.highlights, body, candidates),
        questions: questions.length ? questions : FALLBACK_REPORT.questions,
        bankWords: usedBankWords(body, candidates),
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
    paragraphs: FALLBACK_REPORT.paragraphs,
    schema: REPORT_SCHEMA,
    summary_zh: FALLBACK_REPORT.summary_zh,
    highlights: Array.isArray(FALLBACK_REPORT.highlights) ? FALLBACK_REPORT.highlights : [],
    questions: FALLBACK_REPORT.questions,
    bankWords: [],
    fallback: true,
  }
}
