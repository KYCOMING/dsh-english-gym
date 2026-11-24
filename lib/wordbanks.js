import fs from 'node:fs'
import path from 'node:path'
import { ensureDir, readJson, writeJson } from './store.js'
import { WORD_BANK } from './wordbank.js'

export const BUILTIN_BANK_ID = 'builtin'
const BUILTIN_NAME = '内置 · CET4'

const BUILTIN_ENTRIES = WORD_BANK.map(([en, zh, pos]) => ({ word: en, meaning: zh, pos: pos || '' }))

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
  const banks = [
    {
      id: BUILTIN_BANK_ID,
      name: BUILTIN_NAME,
      count: BUILTIN_ENTRIES.length,
      source: 'builtin',
      createdAt: null,
      builtin: true,
    },
  ]
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
    if (a.builtin) return -1
    if (b.builtin) return 1
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
  })
  return banks
}

export function loadWordBank(dir, id) {
  if (!id || id === BUILTIN_BANK_ID) {
    return { id: BUILTIN_BANK_ID, name: BUILTIN_NAME, entries: BUILTIN_ENTRIES }
  }
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
  if (!isValidBankId(id)) return false
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
