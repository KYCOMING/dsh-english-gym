import fs from 'node:fs'
import path from 'node:path'
import { ensureDir, readJson, writeJson } from '../../core/store.js'

export const BUILTIN_BANK_ID = 'builtin'

const BUILTIN_FILES = [
  { id: BUILTIN_BANK_ID, name: '内置 · CET4', file: './data/cet4.json' },
  { id: 'builtin-cet6', name: '内置 · 英语六级', file: './data/cet6.json' },
  { id: 'builtin-ielts', name: '内置 · 雅思', file: './data/ielts.json' },
  { id: 'builtin-toefl', name: '内置 · 托福', file: './data/toefl.json' },
]

const builtinCache = new Map()

function normalizeEntry(row) {
  if (!row || typeof row !== 'object') return null
  const word = String(row.word || '').trim()
  const meaning = String(row.meaning || '').trim()
  if (!word || !meaning) return null
  return {
    word,
    meaning,
    pos: String(row.pos || '').trim(),
    example: String(row.example || '').trim(),
    exampleZh: String(row.exampleZh || row.example_zh || '').trim(),
  }
}

function loadBuiltin(meta) {
  const cached = builtinCache.get(meta.id)
  if (cached) return cached
  const data = readJson(new URL(meta.file, import.meta.url), null)
  const rows = data && Array.isArray(data.entries) ? data.entries : []
  const bank = {
    id: meta.id,
    name: (data && typeof data.name === 'string' && data.name) || meta.name,
    source: (data && typeof data.source === 'string' && data.source) || 'builtin',
    entries: rows.map(normalizeEntry).filter(Boolean),
  }
  builtinCache.set(meta.id, bank)
  return bank
}

function getBuiltinMeta(id) {
  return BUILTIN_FILES.find((meta) => meta.id === id)
}

export function isBuiltinBankId(id) {
  return Boolean(getBuiltinMeta(id))
}

export function wordbanksDir(dir) {
  return path.join(dir, 'wordbanks')
}

function bankFile(dir, id) {
  return path.join(wordbanksDir(dir), `${id}.json`)
}

export function isValidBankId(id) {
  return typeof id === 'string' && /^wb-[a-z0-9-]{4,64}$/.test(id)
}

export function listWordBanks(dir) {
  const banks = BUILTIN_FILES.map((meta) => {
    const bank = loadBuiltin(meta)
    return {
      id: bank.id,
      name: bank.name,
      count: bank.entries.length,
      source: 'builtin',
      createdAt: null,
      builtin: true,
    }
  })
  const folder = wordbanksDir(dir)
  let files = []
  try {
    files = fs.readdirSync(folder).filter((name) => name.endsWith('.json'))
  } catch {
    files = []
  }
  for (const file of files) {
    const data = readJson(path.join(folder, file), null)
    if (!data || !Array.isArray(data.entries) || !data.id) continue
    banks.push({
      id: data.id,
      name: data.name || '未命名词库',
      count: data.entries.length,
      source: data.source || 'import',
      createdAt: data.createdAt || null,
      builtin: false,
    })
  }
  banks.sort((a, b) => {
    if (a.builtin && b.builtin) return 0
    if (a.builtin) return -1
    if (b.builtin) return 1
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
  })
  return banks
}

export function loadWordBank(dir, id) {
  const meta = getBuiltinMeta(id || BUILTIN_BANK_ID)
  if (meta) return loadBuiltin(meta)
  if (!isValidBankId(id)) return null
  const data = readJson(bankFile(dir, id), null)
  if (!data || !Array.isArray(data.entries)) return null
  return { id: data.id, name: data.name || '未命名词库', entries: data.entries }
}

export function saveWordBank(dir, bank) {
  ensureDir(wordbanksDir(dir))
  const payload = {
    id: bank.id,
    name: bank.name,
    source: bank.source || 'import',
    createdAt: bank.createdAt || new Date().toISOString(),
    entries: bank.entries,
  }
  writeJson(bankFile(dir, bank.id), payload)
  return payload
}

export function deleteWordBank(dir, id) {
  if (isBuiltinBankId(id) || !isValidBankId(id)) return false
  try {
    fs.unlinkSync(bankFile(dir, id))
    return true
  } catch {
    return false
  }
}

/** The active bank, falling back to the built-in bank when it vanished. */
export function resolveActiveBank(dir, state) {
  const bank = loadWordBank(dir, state && state.wordBankId)
  if (bank) return bank
  return loadWordBank(dir, BUILTIN_BANK_ID)
}

export function makeBankId() {
  return `wb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}