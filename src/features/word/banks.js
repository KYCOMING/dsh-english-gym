import fs from 'node:fs'
import path from 'node:path'
import { ensureDir, readJson, writeJson } from '../../core/store.js'
import { CET4_WORD_BANK } from './data/cet4.js'
import { CET6_WORD_BANK } from './data/cet6.js'
import { IELTS_WORD_BANK } from './data/ielts.js'
import { TOEFL_WORD_BANK } from './data/toefl.js'

export const BUILTIN_BANK_ID = 'builtin'

function toEntries(bank) {
  return bank.map(([en, zh, pos]) => ({ word: en, meaning: zh, pos: pos || '' }))
}

const BUILTIN_BANKS = [
  { id: BUILTIN_BANK_ID, name: '内置 · CET4', entries: toEntries(CET4_WORD_BANK) },
  { id: 'builtin-cet6', name: '内置 · 英语六级', entries: toEntries(CET6_WORD_BANK) },
  { id: 'builtin-ielts', name: '内置 · 雅思', entries: toEntries(IELTS_WORD_BANK) },
  { id: 'builtin-toefl', name: '内置 · 托福', entries: toEntries(TOEFL_WORD_BANK) },
]

function getBuiltinBank(id) {
  return BUILTIN_BANKS.find((bank) => bank.id === id)
}

export function isBuiltinBankId(id) {
  return Boolean(getBuiltinBank(id))
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
  const banks = BUILTIN_BANKS.map((bank) => ({
    id: bank.id,
    name: bank.name,
    count: bank.entries.length,
    source: 'builtin',
    createdAt: null,
    builtin: true,
  }))
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
  const builtin = getBuiltinBank(id || BUILTIN_BANK_ID)
  if (builtin) return builtin
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
