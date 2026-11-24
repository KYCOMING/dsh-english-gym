#!/usr/bin/env node
/**
 * One-off generator for built-in word-bank example sentences.
 *
 * Uses an OpenAI-compatible /chat/completions endpoint (DeepSeek, OpenAI,
 * Moonshot, local vLLM, ...). Results are written straight back into
 * src/features/word/data/*.json, so the shipped plugin stays offline-only.
 *
 *   EXAMPLE_LLM_API_KEY=... EXAMPLE_LLM_MODEL=... node scripts/gen-examples.mjs --bank cet4 --limit 20
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { extractJson } from '../src/core/llm.js'
import { isCleanExample } from '../src/shared/text.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = path.join(ROOT, 'src/features/word/data')
const FAILURE_FILE = path.join(ROOT, 'scripts/example-failures.jsonl')
const LOCK_FILE = path.join(ROOT, 'scripts/.gen.lock')
const OVERRIDES_FILE = path.join(ROOT, 'scripts/overrides.json')

const BANKS = {
  cet4: { file: 'cet4.json', level: 'A2/B1' },
  cet6: { file: 'cet6.json', level: 'B2' },
  ielts: { file: 'ielts.json', level: 'B2' },
  toefl: { file: 'toefl.json', level: 'C1' },
}

const BASE = (process.env.EXAMPLE_LLM_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '')
const API_KEY = process.env.EXAMPLE_LLM_API_KEY || ''
const MODEL = process.env.EXAMPLE_LLM_MODEL || ''

const args = parseArgs(process.argv.slice(2))
const loaded = new Map()
const dirty = new Set()
let seenExamples = new Set()
let jsonMode = true
let halted = false
let batchesDone = 0
let consecutiveBatchErrors = 0

main().catch((error) => {
  console.error((error && error.stack) || error)
  flushAll()
  releaseLock()
  process.exit(1)
})

async function main() {
  const names = args.bank === 'all' ? Object.keys(BANKS) : args.bank.split(',').map((s) => s.trim()).filter(Boolean)
  for (const name of names) {
    if (!BANKS[name]) fail(`unknown bank: ${name} (use cet4|cet6|ielts|toefl|all)`)
  }
  if (!args.dryRun) {
    if (!API_KEY || !MODEL) fail('set EXAMPLE_LLM_API_KEY and EXAMPLE_LLM_MODEL (or use --dry-run)')
    acquireLock()
  }
  process.on('SIGINT', () => {
    console.log('\ninterrupted, flushing…')
    flushAll()
    releaseLock()
    process.exit(130)
  })
  process.on('exit', releaseLock)

  const totals = { ok: 0, failed: 0 }
  for (const name of names) {
    const stats = await processBank(name)
    totals.ok += stats.ok
    totals.failed += stats.failed
    if (halted) break
  }
  flushAll()
  releaseLock()
  console.log(`done: ok=${totals.ok} failed=${totals.failed}${args.dryRun ? ' (dry-run)' : ''}`)
  if (halted) process.exit(1)
}

async function processBank(name) {
  const meta = BANKS[name]
  const file = path.join(DATA_DIR, meta.file)
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (!data || !Array.isArray(data.entries)) fail(`invalid bank file: ${file}`)

  const overrides = (loadOverrides()[name]) || {}
  for (const entry of data.entries) {
    const override = overrides[entry.word]
    if (override && isCleanExample(entry.word, override.example, override.exampleZh)) {
      entry.example = override.example
      entry.exampleZh = override.exampleZh
    }
  }

  let pending = args.force
    ? data.entries.slice()
    : data.entries.filter((entry) => !isCleanExample(entry.word, entry.example, entry.exampleZh))
  if (args.retryFailed) {
    const failedWords = readFailureWords(name)
    pending = pending.filter((entry) => failedWords.has(entry.word))
  }
  if (args.limit > 0) pending = pending.slice(0, args.limit)

  console.log(`[${name}] ${data.entries.length} words, ${pending.length} to generate`)
  if (!pending.length) return { ok: 0, failed: 0 }
  if (args.dryRun) {
    const sample = pending.slice(0, args.batch)
    console.log(JSON.stringify(buildMessages(sample, meta.level), null, 2))
    return { ok: 0, failed: 0 }
  }

  const pendingWords = new Set(pending.map((entry) => entry.word))
  seenExamples = new Set(
    data.entries
      .filter((entry) => !pendingWords.has(entry.word) && entry.example)
      .map((entry) => entry.example.toLowerCase()),
  )

  loaded.set(name, { file, data })
  dirty.add(name)
  const stats = { ok: 0, failed: 0 }
  const batches = chunk(pending, args.batch)
  const tasks = batches.map((batch, index) => async () => {
    try {
      await processBatch(name, batch, stats)
      consecutiveBatchErrors = 0
    } catch (error) {
      // A single bad/flaky response must not abort the whole bank: record the
      // still-missing words and keep going; a rerun will retry them.
      consecutiveBatchErrors += 1
      console.error(`[${name}] batch ${index + 1}/${batches.length} failed: ${String(error.message).slice(0, 200)}`)
      for (const entry of batch) {
        if (!isCleanExample(entry.word, entry.example, entry.exampleZh)) {
          stats.failed += 1
          recordFailure(name, entry, `request failed: ${String(error.message).slice(0, 100)}`)
        }
      }
      if (consecutiveBatchErrors >= 5 && !halted) {
        halted = true
        console.error('5 consecutive batch errors, stopping')
      }
    }
    batchesDone += 1
    dirty.add(name)
    if (batchesDone % 5 === 0) flushAll()
    if ((index + 1) % 10 === 0) {
      console.log(`[${name}] batch ${index + 1}/${batches.length}, ok=${stats.ok} failed=${stats.failed}`)
    }
  })
  await runPool(tasks, args.concurrency)
  flushAll()
  return stats
}

async function processBatch(name, entries, stats) {
  let remaining = entries
  for (let round = 0; round < 3 && remaining.length; round += 1) {
    // Reasoning models can burn most of the budget before writing the JSON,
    // so leave generous headroom per item.
    const text = await complete(
      buildMessages(remaining, BANKS[name].level),
      Math.max(4096, remaining.length * 400),
    )
    const parsed = parseItems(text)
    const next = []
    for (const entry of remaining) {
      const item = parsed.get(entry.word)
      if (!item || !isCleanExample(entry.word, item.example, item.exampleZh)) {
        next.push(entry)
        continue
      }
      const key = item.example.toLowerCase()
      if (seenExamples.has(key)) {
        next.push(entry)
        continue
      }
      seenExamples.add(key)
      entry.example = item.example
      entry.exampleZh = item.exampleZh
      stats.ok += 1
    }
    remaining = next
    if (remaining.length && round < 2) await sleep(250)
  }
  for (const entry of remaining) {
    stats.failed += 1
    recordFailure(name, entry, 'no valid example returned')
  }
  if (stats.failed >= args.maxFailures && !halted) {
    halted = true
    console.error(`reached --max-failures (${args.maxFailures}), stopping`)
  }
}

function buildMessages(entries, level) {
  const system = [
    "You write example sentences for a Chinese learner's English spelling drill.",
    'Rules for every item:',
    `1. Write ONE natural, self-contained English sentence of 8-16 words at CEFR ${level}.`,
    '2. Use the target word in EXACTLY the given form, exactly once. Never inflect it and never use it inside another word (for "decide" do not write "decided", "decision" or "undecided").',
    "3. Do not let the target word's letters appear inside any other word of the sentence.",
    '4. Use plain ASCII and standard punctuation; end the sentence with . ? or !.',
    '5. Give a faithful, natural Simplified Chinese translation that contains NO Latin letters.',
    '6. Do not mention the drill, the word, or the translation inside the sentence.',
    'Reply with JSON only, one object per input id, in the same order:',
    '{"items":[{"id":"...","example":"...","exampleZh":"..."}]}',
    'Few-shot: {"items":[{"id":"borrow","example":"Could I borrow your notebook for the weekend?","exampleZh":"周末我能借你的笔记本用一下吗？"}]}',
  ].join('\n')
  const items = entries.map((entry) => ({
    id: entry.word,
    word: entry.word,
    pos: entry.pos || '',
    meaning: entry.meaning,
  }))
  return [
    { role: 'system', content: system },
    { role: 'user', content: JSON.stringify({ level, items }) },
  ]
}

function parseItems(text) {
  const data = extractJson(text)
  const map = new Map()
  if (!data || !Array.isArray(data.items)) return map
  for (const item of data.items) {
    if (!item || typeof item.id !== 'string') continue
    const example = String(item.example || '').replace(/\s+/g, ' ').trim()
    const exampleZh = String(item.exampleZh || item.example_zh || '').replace(/\s+/g, ' ').trim()
    map.set(item.id, { example, exampleZh })
  }
  return map
}

async function complete(messages, maxTokens) {
  return withRetry(async () => {
    const payload = {
      model: MODEL,
      messages,
      temperature: 0.3,
      max_tokens: Math.max(512, maxTokens),
    }
    if (jsonMode) payload.response_format = { type: 'json_object' }
    let response
    try {
      response = await fetchOnce(payload)
    } catch (error) {
      if (jsonMode && (error.status === 400 || error.status === 422)) {
        jsonMode = false
        delete payload.response_format
        response = await fetchOnce(payload)
      } else {
        throw error
      }
    }
    const text =
      response &&
      response.choices &&
      response.choices[0] &&
      response.choices[0].message &&
      response.choices[0].message.content
    if (!text) throw new Error('empty model output')
    return String(text)
  })
}

async function fetchOnce(payload) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 60000)
  try {
    const response = await fetch(`${BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    if (!response.ok) {
      const body = await response.text().catch(() => '')
      const error = new Error(`HTTP ${response.status} ${body.slice(0, 400)}`)
      error.status = response.status
      throw error
    }
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

async function withRetry(fn, attempts = 3) {
  let lastError
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      const status = error && error.status
      const retryable = !status || status === 429 || status >= 500
      if (attempt === attempts - 1 || !retryable) throw error
      const wait = 1000 * 2 ** attempt
      console.warn(`  retry in ${wait}ms: ${String(error.message).slice(0, 120)}`)
      await sleep(wait)
    }
  }
  throw lastError
}

async function runPool(tasks, concurrency) {
  let index = 0
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (index < tasks.length && !halted) {
      const current = index
      index += 1
      await tasks[current]()
    }
  })
  await Promise.all(workers)
}

function chunk(items, size) {
  const out = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
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

function flushAll() {
  for (const [name, state] of loaded) {
    if (!dirty.has(name)) continue
    writeBankFile(state.file, state.data)
    dirty.delete(name)
  }
}

function loadOverrides() {
  try {
    return JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf8'))
  } catch {
    return {}
  }
}

function recordFailure(bank, entry, reason) {
  const record = { bank, word: entry.word, reason: reason || 'no valid example returned', at: new Date().toISOString() }
  fs.appendFileSync(FAILURE_FILE, JSON.stringify(record) + '\n')
}

function readFailureWords(bank) {
  const words = new Set()
  if (!fs.existsSync(FAILURE_FILE)) return words
  for (const line of fs.readFileSync(FAILURE_FILE, 'utf8').split('\n')) {
    if (!line.trim()) continue
    try {
      const record = JSON.parse(line)
      if (record.bank === bank && record.word) words.add(record.word)
    } catch {
      /* ignore malformed line */
    }
  }
  return words
}

function acquireLock() {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const fd = fs.openSync(LOCK_FILE, 'wx')
      fs.writeFileSync(fd, String(process.pid))
      fs.closeSync(fd)
      return
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
      let pid = 0
      try {
        pid = Number(fs.readFileSync(LOCK_FILE, 'utf8').trim())
      } catch {
        pid = 0
      }
      if (pid && isProcessAlive(pid)) fail(`another run is active (pid ${pid}); remove ${LOCK_FILE} if stale`)
      try {
        fs.unlinkSync(LOCK_FILE)
      } catch {
        /* ignore */
      }
    }
  }
  throw new Error('could not acquire generation lock')
}

function releaseLock() {
  try {
    fs.unlinkSync(LOCK_FILE)
  } catch {
    /* ignore */
  }
}

function isProcessAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

function parseArgs(argv) {
  const out = {
    bank: 'all',
    limit: 0,
    batch: 20,
    concurrency: 4,
    dryRun: false,
    retryFailed: false,
    force: false,
    maxFailures: 50,
  }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--bank') out.bank = argv[++i] || out.bank
    else if (arg === '--limit') out.limit = Number(argv[++i]) || 0
    else if (arg === '--batch') out.batch = Math.max(1, Number(argv[++i]) || 20)
    else if (arg === '--concurrency') out.concurrency = Math.max(1, Number(argv[++i]) || 4)
    else if (arg === '--max-failures') out.maxFailures = Math.max(1, Number(argv[++i]) || 50)
    else if (arg === '--dry-run') out.dryRun = true
    else if (arg === '--retry-failed') out.retryFailed = true
    else if (arg === '--force') out.force = true
    else if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    } else {
      fail(`unknown argument: ${arg}`)
    }
  }
  if (out.force && out.retryFailed) fail('--force and --retry-failed cannot be combined')
  return out
}

function printHelp() {
  console.log(`Usage: node scripts/gen-examples.mjs [options]
  --bank cet4|cet6|ielts|toefl|all   default: all
  --limit N                          per-bank cap for a smoke run
  --batch N                          words per request (default 20)
  --concurrency N                    parallel requests (default 4)
  --dry-run                          print the first prompt; no network/writes
  --retry-failed                     only retry words in scripts/example-failures.jsonl
  --force                            regenerate words that already have an example
  --max-failures N                   stop after N failed words (default 50)

Env: EXAMPLE_LLM_BASE_URL (default https://api.openai.com/v1)
     EXAMPLE_LLM_API_KEY
     EXAMPLE_LLM_MODEL`)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function fail(message) {
  console.error(message)
  process.exit(1)
}