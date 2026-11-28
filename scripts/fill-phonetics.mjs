#!/usr/bin/env node
/**
 * Offline backfill of UK & US IPA phonetics into src/features/word/data/*.json.
 *
 * Uses open-source dictionaries cached outside the repo (default /tmp/dsh-phonetics-cache):
 *   1. open-dict-data/ipa-dict (en_UK.txt, en_US.txt) — primary source
 *   2. KyleBing/english-vocabulary (kylebing/*.json|*.jsonl) — fallback for missing uk/us
 *   3. skywind3000/ECDICT (ecdict.mini.csv or ecdict.csv) — fallback for missing uk
 *
 * Usage:
 *   node scripts/fill-phonetics.mjs [--dict-dir /tmp/dsh-phonetics-cache] [--bank all] [--dry-run] [--force]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isCleanPhonetic, normalizePhonetic } from '../src/shared/text.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = path.join(ROOT, 'src/features/word/data')

const BANKS = {
  cet4: { file: 'cet4.json' },
  cet6: { file: 'cet6.json' },
  ielts: { file: 'ielts.json' },
  toefl: { file: 'toefl.json' },
}

const args = parseArgs(process.argv.slice(2))
const dicts = loadDictionaries(args.dictDir)

const bankNames = args.bank === 'all' ? Object.keys(BANKS) : args.bank.split(',').map((s) => s.trim()).filter(Boolean)
for (const name of bankNames) {
  if (!BANKS[name]) {
    console.error(`unknown bank: ${name} (use cet4|cet6|ielts|toefl|all)`)
    process.exit(1)
  }
}

let grandTotal = 0
let grandUk = 0
let grandUs = 0
let grandBoth = 0

for (const name of bankNames) {
  const file = path.join(DATA_DIR, BANKS[name].file)
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (!data || !Array.isArray(data.entries)) {
    console.error(`invalid bank file: ${file}`)
    process.exit(1)
  }

  let ukCount = 0
  let usCount = 0
  let bothCount = 0
  let ukFromIpaDict = 0
  let usFromIpaDict = 0
  let ukFromKyle = 0
  let usFromKyle = 0
  let ukFromEcdict = 0
  const missingBoth = []
  const missingUk = []
  const missingUs = []

  const nextEntries = data.entries.map((entry) => {
    const key = String(entry.word || '').trim().toLowerCase()
    const existingUk = !args.force && entry.uk ? normalizePhonetic(entry.uk) : ''
    const existingUs = !args.force && entry.us ? normalizePhonetic(entry.us) : ''

    let uk = isCleanPhonetic(existingUk) ? existingUk : ''
    let us = isCleanPhonetic(existingUs) ? existingUs : ''

    if (!uk) {
      if (dicts.ipaUk.has(key)) {
        uk = dicts.ipaUk.get(key)
        ukFromIpaDict += 1
      } else if (dicts.kyleUk.has(key)) {
        uk = dicts.kyleUk.get(key)
        ukFromKyle += 1
      } else if (dicts.ecdictUk.has(key)) {
        uk = dicts.ecdictUk.get(key)
        ukFromEcdict += 1
      }
    }

    if (!us) {
      if (dicts.ipaUs.has(key)) {
        us = dicts.ipaUs.get(key)
        usFromIpaDict += 1
      } else if (dicts.kyleUs.has(key)) {
        us = dicts.kyleUs.get(key)
        usFromKyle += 1
      }
    }

    if (uk) ukCount += 1
    else missingUk.push(entry.word)
    if (us) usCount += 1
    else missingUs.push(entry.word)
    if (uk && us) bothCount += 1
    if (!uk && !us) missingBoth.push(entry.word)

    const out = {
      word: entry.word,
      meaning: entry.meaning,
      pos: entry.pos || '',
    }
    if (uk) out.uk = uk
    if (us) out.us = us
    out.example = entry.example || ''
    out.exampleZh = entry.exampleZh || ''
    return out
  })

  const total = nextEntries.length
  grandTotal += total
  grandUk += ukCount
  grandUs += usCount
  grandBoth += bothCount

  const pct = (n) => (total ? ((n / total) * 100).toFixed(1) : '0.0')
  console.log(
    `[${name.padEnd(5)}] ${String(total).padStart(5)} words | ` +
      `UK ${ukCount} (${pct(ukCount)}%) [ipa-dict:${ukFromIpaDict}, kyle:${ukFromKyle}, ecdict:${ukFromEcdict}] | ` +
      `US ${usCount} (${pct(usCount)}%) [ipa-dict:${usFromIpaDict}, kyle:${usFromKyle}] | ` +
      `both ${bothCount} (${pct(bothCount)}%)`,
  )
  if (missingUk.length) console.log(`  missing UK (${missingUk.length}): ${missingUk.slice(0, 8).join(', ')}`)
  if (missingUs.length) console.log(`  missing US (${missingUs.length}): ${missingUs.slice(0, 8).join(', ')}`)
  if (missingBoth.length) console.log(`  missing both (${missingBoth.length}): ${missingBoth.slice(0, 8).join(', ')}`)

  if (!args.dryRun) {
    writeBankFile(file, { name: data.name, source: data.source, entries: nextEntries })
  }
}

const grandPct = (n) => (grandTotal ? ((n / grandTotal) * 100).toFixed(1) : '0.0')
console.log(
  `total ${grandTotal} words | UK ${grandUk} (${grandPct(grandUk)}%) | US ${grandUs} (${grandPct(grandUs)}%) | both ${grandBoth} (${grandPct(grandBoth)}%)${args.dryRun ? ' [dry-run]' : ''}`,
)

function loadDictionaries(dictDir) {
  const ipaUk = loadIpaDict(path.join(dictDir, 'en_UK.txt'))
  const ipaUs = loadIpaDict(path.join(dictDir, 'en_US.txt'))
  const { kyleUk, kyleUs } = loadKyleBingDir(path.join(dictDir, 'kylebing'))
  const ecdictUk = loadEcdict(dictDir)

  console.log(
    `[dicts] ipa-dict UK=${ipaUk.size}, US=${ipaUs.size} | kylebing UK=${kyleUk.size}, US=${kyleUs.size} | ecdict UK=${ecdictUk.size}`,
  )
  return { ipaUk, ipaUs, kyleUk, kyleUs, ecdictUk }
}

function cleanCandidateIpa(raw) {
  if (!raw) return ''
  const first = String(raw).split(/[;；,]/)[0]
  const norm = normalizePhonetic(first)
  return isCleanPhonetic(norm) ? norm : ''
}

function loadIpaDict(file) {
  const map = new Map()
  if (!fs.existsSync(file)) return map
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    if (!line) continue
    const tab = line.indexOf('\t')
    if (tab <= 0) continue
    const word = line.slice(0, tab).trim().toLowerCase()
    if (!word || map.has(word)) continue
    const ipa = cleanCandidateIpa(line.slice(tab + 1))
    if (ipa) map.set(word, ipa)
  }
  return map
}

function loadKyleBingDir(dir) {
  const kyleUk = new Map()
  const kyleUs = new Map()
  if (!fs.existsSync(dir)) return { kyleUk, kyleUs }
  const files = walkFiles(dir).filter((f) => f.endsWith('.jsonl') || f.endsWith('.json'))
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8').trim()
    if (!raw) continue
    const rows = []
    if (file.endsWith('.jsonl')) {
      for (const line of raw.split(/\r?\n/)) {
        if (!line.trim()) continue
        try {
          rows.push(JSON.parse(line))
        } catch {
          /* ignore malformed line */
        }
      }
    } else {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) rows.push(...parsed)
        else if (parsed && Array.isArray(parsed.entries)) rows.push(...parsed.entries)
        else if (parsed && Array.isArray(parsed.words)) rows.push(...parsed.words)
      } catch {
        /* ignore malformed json */
      }
    }
    for (const row of rows) {
      if (!row || typeof row !== 'object') continue
      const inner = row.content && row.content.word && row.content.word.content ? row.content.word.content : null
      const head = row.headWord || row.word || (row.content && row.content.word && row.content.word.wordHead) || ''
      const key = String(head).trim().toLowerCase()
      if (!key) continue
      const ukRaw = (inner && inner.ukphone) || row.ukphone || row.uk || ''
      const usRaw = (inner && inner.usphone) || row.usphone || row.us || ''
      if (!kyleUk.has(key)) {
        const uk = cleanCandidateIpa(ukRaw)
        if (uk) kyleUk.set(key, uk)
      }
      if (!kyleUs.has(key)) {
        const us = cleanCandidateIpa(usRaw)
        if (us) kyleUs.set(key, us)
      }
    }
  }
  return { kyleUk, kyleUs }
}

function loadEcdict(dictDir) {
  const map = new Map()
  const candidates = ['ecdict.csv', 'ecdict.mini.csv']
  const file = candidates.map((f) => path.join(dictDir, f)).find((f) => fs.existsSync(f))
  if (!file) return map
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  if (!lines.length) return map
  const header = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase())
  const wordIdx = header.indexOf('word')
  const phIdx = header.indexOf('phonetic')
  if (wordIdx < 0 || phIdx < 0) return map
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i]
    if (!line) continue
    const cols = splitCsvLine(line)
    const key = String(cols[wordIdx] || '').trim().toLowerCase()
    if (!key || map.has(key)) continue
    const ipa = cleanCandidateIpa(cols[phIdx])
    if (ipa) map.set(key, ipa)
  }
  return map
}

function splitCsvLine(line) {
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
    } else if (ch === ',') {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out
}

function walkFiles(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walkFiles(full))
    else if (entry.isFile()) out.push(full)
  }
  return out
}

function writeBankFile(file, data) {
  const body = data.entries.map((entry) => JSON.stringify(entry)).join(',\n')
  const text =
    '{\n' +
    `  "name": ${JSON.stringify(data.name || '')},\n` +
    `  "source": ${JSON.stringify(data.source || '')},\n` +
    '  "entries": [\n' +
    body +
    '\n  ]\n}\n'
  const tmp = `${file}.${process.pid}.tmp`
  fs.writeFileSync(tmp, text, 'utf8')
  fs.renameSync(tmp, file)
}

function parseArgs(argv) {
  const out = {
    dictDir: '/tmp/dsh-phonetics-cache',
    bank: 'all',
    dryRun: false,
    force: false,
  }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--dict-dir') out.dictDir = argv[++i] || out.dictDir
    else if (arg === '--bank') out.bank = argv[++i] || out.bank
    else if (arg === '--dry-run') out.dryRun = true
    else if (arg === '--force') out.force = true
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/fill-phonetics.mjs [--dict-dir PATH] [--bank cet4|cet6|ielts|toefl|all] [--dry-run] [--force]')
      process.exit(0)
    } else {
      console.error(`unknown argument: ${arg}`)
      process.exit(1)
    }
  }
  return out
}
