/**
 * Word-bank import parser.
 *
 * Accepts the formats people actually export from vocabulary tools:
 *   - CSV  (comma separated, optional quoted fields)
 *   - TSV  (tab separated)
 *   - TXT  (one entry per line: "word<TAB>meaning" / "word,meaning" / "word meaning")
 *   - JSON (array of {word, meaning} objects, [word, meaning] pairs, or
 *           qwerty-learner style {name, trans: [...]})
 *
 * The parser is deliberately dependency-free (the plugin ships without a
 * build step) and tolerant: UTF-8 BOM, CRLF, blank lines and a header row in
 * either English or Chinese are all handled.
 */

const WORD_RE = /^[A-Za-z][A-Za-z'’-]{1,31}$/

const HEADER_ALIASES = {
  word: ['word', 'en', 'english', 'term', 'spelling', '单词', '英文', '英语', '词汇'],
  meaning: ['meaning', 'zh', 'cn', 'chinese', 'definition', 'translation', 'trans', '释义', '中文', '翻译', '意思', '词义'],
  phonetic: ['phonetic', 'ipa', 'pronunciation', '音标', '发音'],
  example: ['example', 'sentence', 'example_en', 'en_example', '英文例句', '例句'],
  exampleZh: ['examplezh', 'example_zh', 'example zh', 'zh_example', 'sentencezh', 'sentence_zh', 'sentence zh', '例句翻译', '例句中文', '句意'],
  pos: ['pos', 'type', 'partofspeech', 'part of speech', '词性', '词类'],
}

export function normalizeWord(value) {
  return String(value || '')
    .trim()
    .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
}

export function normalizeMeaning(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
}

function stripBom(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
}

/** Split one delimited line, honouring double-quoted fields ("a,b" and "" escapes). */
function splitDelimited(line, delimiter) {
  const out = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i += 1
        } else {
          quoted = false
        }
      } else {
        cur += ch
      }
    } else if (ch === '"') {
      quoted = true
    } else if (ch === delimiter) {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out
}

function looksLikeHeader(fields) {
  const normalized = fields.map((f) => normalizeWord(f).toLowerCase())
  const hasWord = normalized.some((f) => HEADER_ALIASES.word.includes(f))
  const hasMeaning = normalized.some((f) => HEADER_ALIASES.meaning.includes(f))
  return hasWord && hasMeaning
}

function headerMapping(fields) {
  const normalized = fields.map((f) => normalizeWord(f).toLowerCase())
  const find = (key) => normalized.findIndex((f) => HEADER_ALIASES[key].includes(f))
  return {
    word: find('word'),
    meaning: find('meaning'),
    pos: find('pos'),
    example: find('example'),
    exampleZh: find('exampleZh'),
  }
}

/** Choose a delimiter from the first meaningful line: tab wins over comma. */
function detectDelimiter(lines) {
  for (const line of lines) {
    if (!line.trim()) continue
    if (line.includes('\t')) return '\t'
    if (line.includes(',')) return ','
    if (line.includes(';')) return ';'
    return ''
  }
  return ''
}

function parseJson(content) {
  let data
  try {
    data = JSON.parse(content)
  } catch {
    return null
  }
  let rows = null
  if (Array.isArray(data)) {
    rows = data
  } else if (data && Array.isArray(data.words)) {
    rows = data.words
  } else if (data && Array.isArray(data.entries)) {
    rows = data.entries
  }
  if (!rows) return null

  const entries = []
  const skipped = []
  rows.forEach((row, index) => {
    let word = ''
    let meaning = ''
    let pos = ''
    let example = ''
    let exampleZh = ''
    if (Array.isArray(row)) {
      word = normalizeWord(row[0])
      meaning = normalizeMeaning(row[1])
      pos = normalizeWord(row[2] || '')
      example = normalizeMeaning(row[3] || '').slice(0, 300)
      exampleZh = normalizeMeaning(row[4] || '').slice(0, 160)
    } else if (row && typeof row === 'object') {
      word = normalizeWord(row.word ?? row.en ?? row.name ?? row.term ?? '')
      const rawMeaning = row.meaning ?? row.zh ?? row.trans ?? row.definition ?? row.translation ?? ''
      meaning = normalizeMeaning(Array.isArray(rawMeaning) ? rawMeaning.join('；') : rawMeaning)
      pos = normalizeWord(row.pos ?? row.type ?? row.partOfSpeech ?? row.part_of_speech ?? '')
      example = normalizeMeaning(row.example ?? row.sentence ?? row.example_en ?? '').slice(0, 300)
      exampleZh = normalizeMeaning(row.exampleZh ?? row.example_zh ?? row.zhExample ?? row.sentenceZh ?? '').slice(0, 160)
    }
    if (!word || !meaning) {
      skipped.push({ line: index + 1, reason: '缺少单词或释义', raw: JSON.stringify(row).slice(0, 120) })
      return
    }
    if (!WORD_RE.test(word)) {
      skipped.push({ line: index + 1, reason: '不是单个英文单词', raw: word.slice(0, 60) })
      return
    }
    entries.push({ word, meaning: meaning.slice(0, 300), pos: pos.slice(0, 24), example, exampleZh })
  })
  return { format: 'json', delimiter: '', hasHeader: false, entries, skipped }
}

function parseText(content) {
  const lines = stripBom(content).replace(/\r\n?/g, '\n').split('\n')
  const delimiter = detectDelimiter(lines)
  const entries = []
  const skipped = []
  let hasHeader = false
  let mapping = { word: 0, meaning: 1, pos: -1, example: -1, exampleZh: -1 }
  let firstDataLineSeen = false

  lines.forEach((line, index) => {
    if (!line.trim()) return
    let fields
    if (delimiter) {
      fields = splitDelimited(line, delimiter)
    } else {
      // Plain text: split "word  meaning" at the first run of whitespace.
      const match = line.match(/^(\S+)\s+(.+)$/)
      fields = match ? [match[1], match[2]] : [line]
    }
    fields = fields.map((f) => f.trim())

    if (!firstDataLineSeen) {
      firstDataLineSeen = true
      if (looksLikeHeader(fields)) {
        hasHeader = true
        mapping = headerMapping(fields)
        if (mapping.word < 0 || mapping.meaning < 0) {
          mapping = { word: 0, meaning: 1, pos: -1, example: -1, exampleZh: -1 }
        }
        return
      }
    }

    const word = normalizeWord(fields[mapping.word] ?? '')
    const meaning = normalizeMeaning(fields[mapping.meaning] ?? '')
    const pos = mapping.pos >= 0 ? normalizeWord(fields[mapping.pos] ?? '').slice(0, 24) : ''
    const example = mapping.example >= 0 ? normalizeMeaning(fields[mapping.example] ?? '').slice(0, 300) : ''
    const exampleZh = mapping.exampleZh >= 0 ? normalizeMeaning(fields[mapping.exampleZh] ?? '').slice(0, 160) : ''
    if (!word || !meaning) {
      skipped.push({ line: index + 1, reason: '缺少单词或释义', raw: line.slice(0, 120) })
      return
    }
    if (!WORD_RE.test(word)) {
      skipped.push({ line: index + 1, reason: '不是单个英文单词', raw: word.slice(0, 60) })
      return
    }
    entries.push({ word, meaning: meaning.slice(0, 300), pos, example, exampleZh })
  })

  return {
    format: delimiter === '\t' ? 'tsv' : delimiter ? 'csv' : 'txt',
    delimiter: delimiter === '\t' ? 'tab' : delimiter === ',' ? 'comma' : delimiter === ';' ? 'semicolon' : 'whitespace',
    hasHeader,
    entries,
    skipped,
  }
}

/**
 * Parse raw text into normalized word entries.
 * Returns { format, delimiter, hasHeader, entries, skipped, total }.
 */
export function parseWordBank(content) {
  const text = stripBom(String(content || '')).trim()
  if (!text) {
    return { format: 'empty', delimiter: '', hasHeader: false, entries: [], skipped: [], total: 0 }
  }

  let result = null
  if (text.startsWith('[') || text.startsWith('{')) result = parseJson(text)
  if (!result) result = parseText(text)

  // Dedupe within the file (case-insensitive), keep the first occurrence.
  const seen = new Set()
  const entries = []
  for (const entry of result.entries) {
    const key = entry.word.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    entries.push(entry)
  }

  return {
    format: result.format,
    delimiter: result.delimiter,
    hasHeader: result.hasHeader,
    entries,
    skipped: result.skipped,
    total: entries.length + result.skipped.length,
  }
}

/** Small payload for the client preview table. */
export function summarizeParse(result, sampleLimit = 5) {
  return {
    format: result.format,
    delimiter: result.delimiter,
    hasHeader: result.hasHeader,
    total: result.total,
    valid: result.entries.length,
    skippedCount: result.skipped.length,
    sample: result.entries.slice(0, sampleLimit),
    errors: result.skipped.slice(0, 8),
  }
}
