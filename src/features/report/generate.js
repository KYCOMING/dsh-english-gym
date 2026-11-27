import { randomUUID } from 'node:crypto'
import { completeText, extractJson } from '../../core/llm.js'
import { FALLBACK_REPORT } from './fallback.js'
import { normalizeReportHighlights } from './highlights.js'
import { REPORT_SCHEMA, joinParagraphs, normalizeReportParagraphs } from './structure.js'
import { formatCompactCandidateList, usedBankWords } from '../word/sample.js'

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
  'You write short, engaging English reading material for Chinese learners. Reply with compact JSON only.'

function looksTruncatedJson(raw) {
  const s = String(raw || '')
  const open = s.indexOf('{')
  if (open < 0) return false
  if (!s.includes('}')) return true
  let depth = 0
  let inStr = false
  let esc = false
  for (let i = open; i < s.length; i += 1) {
    const ch = s[i]
    if (inStr) {
      if (esc) esc = false
      else if (ch === '\\') esc = true
      else if (ch === '"') inStr = false
    } else if (ch === '"') {
      inStr = true
    } else if (ch === '{') {
      depth += 1
    } else if (ch === '}') {
      depth -= 1
      if (depth === 0) return false
    }
  }
  return depth > 0
}

/**
 * Generate Phase 1 of today's AI/tech English mini-report (title, summary,
 * chunk-delimited English paragraphs, and vocabulary highlights).
 * @returns {Promise<{id?:string, enriched?:boolean, date:string, level:string, title:string, body:string, paragraphs:Array<{gist_zh:string, sentences:Array<{en:string, zh:string, chunks?:string[], core?:string[]}>}>, summary_zh:string, questions:Array<{zh:string,en:string}>}>}
 */
export async function generateReport(ctx, config, { level, date, topic, words, reasoningEffort } = {}) {
  const lvl = pickLevel(level, config && config.level)
  const levelGuide = LEVEL_STYLE[lvl.toUpperCase()] || LEVEL_STYLE.B1
  const theme = topic || (config && config.topic) || 'AI and technology'
  const day = date || new Date().toISOString().slice(0, 10)
  const candidates = Array.isArray(words) ? words : []
  let prompt =
    `Write a short English article for ${day} about ${theme}, for a Chinese learner at CEFR ${lvl}.\n` +
    'Requirements:\n' +
    '- "title": catchy English title (4-8 words).\n' +
    '- "summary_zh": one-line Simplified Chinese summary (<= 35 chars).\n' +
    `- "paragraphs": 3 short paragraphs totaling 180-240 words using ${levelGuide}, returned as an array of 3 paragraph strings ["...", "...", "..."]. ` +
    'For sentences with ~10+ words or multiple clauses, insert " | " inside the sentence to mark 2-4 natural reading sense groups (never split mid-word or leave bare punctuation alone); omit "|" on short simple sentences. ' +
    'Do not use double quotes inside English sentences (use single quotes if needed).\n' +
    '- "highlights": 6-8 key vocabulary items (~2-3 per paragraph; skip ultra-basic words, numbers, and proper nouns). ' +
    'Each "word" MUST be an exact substring from the article (without "|"), with concise in-context "zh" (<= 20 chars), short "pos" (n, v, adj, adv, phrase), and optional "lemma" when inflected.\n'
  if (candidates.length) {
    prompt +=
      `Word bank (naturally weave 3-5 where they fit; never force; list incorporated ones in "highlights" first): ` +
      `${formatCompactCandidateList(candidates)}\n`
  }
  prompt +=
    'Reply with ONLY this JSON: {"title":"...","summary_zh":"...","paragraphs":["Paragraph 1 with | chunks.","Paragraph 2...","Paragraph 3..."],"highlights":[{"word":"...","lemma":"...","pos":"...","zh":"..."}]}'

  let fallbackReason = ''
  try {
    let lastText = ''
    let lastParsed = null
    let lastTitle = ''
    for (let parseAttempt = 0; parseAttempt < 2; parseAttempt += 1) {
      const text = await completeText(ctx, config, {
        system: REPORT_SYSTEM,
        prompt,
        temperature: 0.6,
        maxTokens: 6000,
        timeoutMs: 90_000,
        purpose: 'english-gym-report',
        reasoningEffort,
      })
      lastText = text
      const parsed = extractJson(text)
      lastParsed = parsed
      // Prefer structured paragraphs (enables progressive translation); accept a plain "body" as a fallback.
      const title = parsed && (parsed.title || parsed.headline) ? String(parsed.title || parsed.headline).trim() : ''
      lastTitle = title
      const paragraphs = parsed ? normalizeReportParagraphs(parsed.paragraphs) : null
      const body = paragraphs ? joinParagraphs(paragraphs) : parsed && parsed.body ? String(parsed.body).trim() : ''
      if (parsed && title && body) {
        const questions = Array.isArray(parsed.questions)
          ? parsed.questions
              .filter((q) => q && q.zh && q.en)
              .slice(0, 5)
              .map((q) => ({ zh: String(q.zh).trim(), en: String(q.en).trim() }))
          : []
        const highlights = normalizeReportHighlights(parsed.highlights, body, candidates)
        const enriched =
          !paragraphs || !paragraphs.length
            ? true
            : paragraphs.every((p) => Boolean(p.gist_zh) && p.sentences.every((s) => Boolean(s.zh))) && questions.length > 0
        return {
          id: randomUUID(),
          enriched,
          date: day,
          level: lvl,
          title,
          body,
          paragraphs: paragraphs || [],
          schema: REPORT_SCHEMA,
          summary_zh: parsed.summary_zh ? String(parsed.summary_zh).trim() : '',
          highlights,
          questions,
          bankWords: usedBankWords(body, candidates, highlights),
        }
      }
      if (parseAttempt === 0 && !parsed) {
        console.warn('[english-gym] generateReport unparseable attempt 1, retrying; len=', String(text || '').length)
        continue
      }
      break
    }
    if (!lastParsed) {
      console.warn(
        '[english-gym] generateReport unparseable output len=',
        String(lastText || '').length,
        String(lastText || '').slice(0, 240),
      )
      fallbackReason = looksTruncatedJson(lastText) ? '模型输出被截断，JSON 不完整' : '模型返回 JSON 解析失败'
    } else {
      console.warn('[english-gym] generateReport invalid shape keys=', Object.keys(lastParsed))
      fallbackReason = !lastTitle ? '模型返回缺少标题' : '模型返回缺少正文'
    }
  } catch (err) {
    console.warn('[english-gym] generateReport failed:', err && err.message ? err.message : err)
    fallbackReason = String((err && err.message) || '模型调用失败').slice(0, 160)
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
    ...(fallbackReason ? { fallbackReason } : {}),
  }
}
