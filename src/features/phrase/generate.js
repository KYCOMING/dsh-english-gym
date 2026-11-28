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
  'You generate concise English practice material for Chinese learners. Follow the exact 3-line output format with no extra commentary.'

function skipWs(str, pos) {
  let i = pos
  while (i < str.length && /\s/.test(str[i])) i += 1
  return i
}

function readJsonString(str, quotePos) {
  let out = ''
  let i = quotePos + 1
  while (i < str.length) {
    const ch = str[i]
    if (ch === '"') {
      return { value: out, complete: true, nextIndex: i + 1 }
    }
    if (ch === '\\') {
      if (i + 1 >= str.length) {
        return { value: out, complete: false, nextIndex: str.length }
      }
      const esc = str[i + 1]
      if (esc === '"') {
        out += '"'
        i += 2
      } else if (esc === '\\') {
        out += '\\'
        i += 2
      } else if (esc === '/') {
        out += '/'
        i += 2
      } else if (esc === 'b') {
        out += '\b'
        i += 2
      } else if (esc === 'f') {
        out += '\f'
        i += 2
      } else if (esc === 'n') {
        out += '\n'
        i += 2
      } else if (esc === 'r') {
        out += '\r'
        i += 2
      } else if (esc === 't') {
        out += '\t'
        i += 2
      } else if (esc === 'u') {
        if (i + 6 > str.length) {
          const partialHex = str.slice(i + 2)
          if (/^[0-9a-fA-F]*$/.test(partialHex)) {
            return { value: out, complete: false, nextIndex: str.length }
          }
          out += 'u'
          i += 2
        } else {
          const hex = str.slice(i + 2, i + 6)
          if (/^[0-9a-fA-F]{4}$/.test(hex)) {
            out += String.fromCharCode(parseInt(hex, 16))
            i += 6
          } else {
            out += 'u'
            i += 2
          }
        }
      } else {
        out += esc
        i += 2
      }
      continue
    }
    out += ch
    i += 1
  }
  return { value: out, complete: false, nextIndex: str.length }
}

function skipJsonValue(str, pos) {
  const i = skipWs(str, pos)
  if (i >= str.length) return { complete: false, nextIndex: str.length }
  const ch = str[i]
  if (ch === '"') {
    const res = readJsonString(str, i)
    return { complete: res.complete, nextIndex: res.nextIndex }
  }
  if (ch === '{' || ch === '[') {
    let depth = 0
    let inStr = false
    let esc = false
    for (let k = i; k < str.length; k += 1) {
      const c = str[k]
      if (inStr) {
        if (esc) esc = false
        else if (c === '\\') esc = true
        else if (c === '"') inStr = false
        continue
      }
      if (c === '"') {
        inStr = true
      } else if (c === '{' || c === '[') {
        depth += 1
      } else if (c === '}' || c === ']') {
        depth -= 1
        if (depth === 0) return { complete: true, nextIndex: k + 1 }
      }
    }
    return { complete: false, nextIndex: str.length }
  }
  let k = i
  while (k < str.length) {
    const c = str[k]
    if (c === ',' || c === '}' || c === ']' || /\s/.test(c)) {
      return { complete: true, nextIndex: k }
    }
    k += 1
  }
  return { complete: false, nextIndex: str.length }
}

/**
 * Incrementally extract a top-level JSON string field from a partially streamed response.
 * Holds back incomplete escape sequences and ignores nested/quoted keys in other fields.
 * @returns {{ value: string, complete: boolean } | null}
 */
export function extractPartialJsonStringField(raw, fieldName) {
  if (!raw || typeof raw !== 'string' || !fieldName) return null
  const text = raw.replace(/^\uFEFF/, '')
  let start = -1
  const fenceMatch = text.match(/```(?:json)?/i)
  if (fenceMatch && typeof fenceMatch.index === 'number') {
    start = text.indexOf('{', fenceMatch.index + fenceMatch[0].length)
  }
  if (start < 0) start = text.indexOf('{')
  if (start < 0) return null

  let i = skipWs(text, start + 1)
  while (i < text.length) {
    const ch = text[i]
    if (ch === '}') return null
    if (ch === ',') {
      i = skipWs(text, i + 1)
      continue
    }
    if (ch !== '"') return null
    const keyRes = readJsonString(text, i)
    if (!keyRes.complete) return null
    i = skipWs(text, keyRes.nextIndex)
    if (i >= text.length || text[i] !== ':') return null
    i = skipWs(text, i + 1)
    if (i >= text.length) return null

    if (keyRes.value === fieldName) {
      if (text[i] !== '"') return null
      const valRes = readJsonString(text, i)
      return { value: valRes.value, complete: valRes.complete }
    }

    const skipped = skipJsonValue(text, i)
    if (!skipped.complete) return null
    i = skipWs(text, skipped.nextIndex)
  }
  return null
}

function stripOuterQuotes(raw) {
  const s = String(raw || '').trim()
  if (s.length < 2) return s
  if ((s[0] === '"' && s[s.length - 1] === '"') || (s[0] === '“' && s[s.length - 1] === '”') || (s[0] === '「' && s[s.length - 1] === '」')) {
    return s.slice(1, -1).trim()
  }
  return s
}

/**
 * Incrementally extract the Chinese prompt (`zh`) from either plain 3-line output
 * (streaming from token #1) or JSON / fenced JSON output.
 * @returns {{ value: string, complete: boolean } | null}
 */
export function extractPartialPhraseZh(raw) {
  if (!raw || typeof raw !== 'string') return null
  const trimmed = raw.replace(/^\uFEFF/, '').trimStart()
  if (!trimmed) return null

  if (trimmed.startsWith('{')) {
    return extractPartialJsonStringField(raw, 'zh')
  }

  let plain = trimmed
  if (trimmed.startsWith('`')) {
    const firstNl = trimmed.indexOf('\n')
    if (firstNl < 0) return null
    const body = trimmed.slice(firstNl + 1).trimStart()
    if (!body) return null
    if (body.startsWith('{')) {
      return extractPartialJsonStringField(raw, 'zh')
    }
    plain = body.replace(/\n```[\s\S]*$/, '')
  }

  const nl = plain.indexOf('\n')
  const complete = nl >= 0
  let line = (complete ? plain.slice(0, nl) : plain).replace(/\r$/, '').trimStart()
  if (!complete && /^(?:zh?|line(?:\s*1)?|chinese)$/i.test(line)) {
    return null
  }
  line = line.replace(/^(?:zh|line\s*1|chinese|中文)\s*[:：]\s*/i, '').trimStart()
  if (!line) return null

  const quotePairs = { '"': '"', '“': '”', '「': '」' }
  const closeQuote = quotePairs[line[0]]
  if (closeQuote) {
    line = line.slice(1)
    if (complete && line.endsWith(closeQuote)) {
      line = line.slice(0, -1)
    }
  }
  const value = complete ? line.trim() : line.trimStart()
  return value ? { value, complete } : null
}

/**
 * Parse a completed question output in either JSON or 3-line plain-text format.
 * @returns {{ zh: string, en: string, hint: string } | null}
 */
export function parseGeneratedQuestion(text) {
  if (!text || typeof text !== 'string') return null
  const parsed = extractJson(text)
  if (parsed && parsed.zh && parsed.en) {
    return {
      zh: String(parsed.zh).trim(),
      en: String(parsed.en).trim(),
      hint: parsed.hint ? String(parsed.hint).trim() : '',
    }
  }

  let clean = text.replace(/^\uFEFF/, '').trim()
  const fence = clean.match(/^```[^\n]*\n([\s\S]*?)```$/i)
  if (fence) {
    clean = fence[1].trim()
  } else {
    clean = clean.replace(/^```[^\n]*\n/, '').replace(/\n```$/, '').trim()
  }
  const lines = clean
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return null

  let zh = ''
  let en = ''
  let hint = ''
  const otherLines = []

  for (const line of lines) {
    const enMatch = line.match(/^(?:en|english|英文|参考(?:译文|翻译)?|line\s*2)\s*[:：]\s*(.+)$/i)
    if (enMatch && !en) {
      en = enMatch[1].trim()
      continue
    }
    const hintMatch = line.match(/^(?:hint|提示|line\s*3)\s*[:：]\s*(.+)$/i)
    if (hintMatch && !hint) {
      hint = hintMatch[1].trim()
      continue
    }
    const zhMatch = line.match(/^(?:zh|chinese|中文|line\s*1)\s*[:：]\s*(.+)$/i)
    if (zhMatch && !zh) {
      zh = zhMatch[1].trim()
      continue
    }
    otherLines.push(line)
  }

  if (!zh && otherLines.length) {
    zh = otherLines.shift()
  }
  if (!en && otherLines.length) {
    const enIdx = otherLines.findIndex((l) => /[a-zA-Z]/.test(l))
    if (enIdx >= 0) {
      en = otherLines.splice(enIdx, 1)[0]
    }
  }

  zh = stripOuterQuotes(zh)
  en = stripOuterQuotes(en)
  if (!zh || !en) return null
  return { zh, en, hint: hint.trim() }
}

/**
 * Generate one Chinese→English translation prompt.
 * When `sessionContext` is provided, grounds the sentence in the learner's
 * current conversation workflow instead of `topic` and `words`.
 * @returns {Promise<{zh:string, en:string, hint:string, used:string[], fallback?:boolean}>}
 */
export async function generateQuestion(
  ctx,
  config,
  { level, topic, words, sessionContext, avoid, reasoningEffort, signal, onZh, onThinking } = {},
) {
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
  prompt +=
    'Reply in EXACTLY 3 plain lines (no JSON, no markdown, no code fences, no extra text):\n' +
    'Line 1: the Chinese sentence ONLY (no prefix, no quotes)\n' +
    'Line 2: EN: <natural English reference translation>\n' +
    'Line 3: HINT: <short English hint>'

  let lastZh = ''
  let lastComplete = false
  const emitZh = (fullText) => {
    if (typeof onZh !== 'function') return
    const hit = extractPartialPhraseZh(fullText)
    if (!hit) return
    const clean = hit.complete ? hit.value.trim() : hit.value.trimStart()
    if (!clean) return
    if (clean === lastZh && hit.complete === lastComplete) return
    lastZh = clean
    lastComplete = hit.complete
    onZh(clean, hit.complete)
  }

  try {
    const text = await completeText(ctx, config, {
      system: QUESTION_SYSTEM,
      prompt,
      temperature: 0.8,
      maxTokens: 700,
      reasoningEffort,
      signal,
      onThinking,
      onDelta: typeof onZh === 'function' ? (_delta, fullText) => emitZh(fullText) : undefined,
      onReset:
        typeof onZh === 'function'
          ? () => {
              lastZh = ''
              lastComplete = false
            }
          : undefined,
    })
    const parsed = parseGeneratedQuestion(text)
    if (parsed && parsed.zh && parsed.en) {
      return {
        zh: parsed.zh,
        en: parsed.en,
        hint: parsed.hint || '',
        used: candidates.length ? usedBankWords(parsed.en, candidates) : [],
      }
    }
  } catch (err) {
    if (signal && signal.aborted) throw err
    /* fall back to seed */
  }
  return { ...seedQuestion(), used: [], fallback: true }
}
