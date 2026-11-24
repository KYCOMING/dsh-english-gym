import { randomUUID } from 'node:crypto'
import { loadState, saveState } from '../../core/store.js'
import { normalize } from '../../shared/text.js'
import { recordStudy } from '../activity/service.js'
import {
  BUILTIN_BANK_ID,
  deleteWordBank,
  isBuiltinBankId,
  listWordBanks,
  loadWordBank,
  makeBankId,
  resolveActiveBank,
  saveWordBank,
} from './banks.js'
import { parseWordBank, summarizeParse } from './import.js'

const letterCount = (en) => String(en).replace(/[^a-zA-Z]/g, '').length

function pickWord(state, entries) {
  const recent = new Set(state.wordRecent || [])
  const pool = entries.filter((w) => !recent.has(w.word))
  const src = pool.length ? pool : entries
  return src[Math.floor(Math.random() * src.length)]
}

function pruneWordPending(state) {
  const entries = Object.entries(state.wordPending || {})
  if (entries.length <= 10) return
  entries.sort((a, b) => String(a[1].createdAt || '').localeCompare(String(b[1].createdAt || '')))
  const remove = entries.length - 10
  for (let i = 0; i < remove; i += 1) delete state.wordPending[entries[i][0]]
}

/** Word spelling drill + word-bank management. */
export function createWordService({ dir }) {
  function nextWord() {
    const state = loadState(dir)
    const bank = resolveActiveBank(dir, state)
    const picked = pickWord(state, bank.entries)
    const id = randomUUID()
    state.wordPending[id] = {
      en: picked.word,
      zh: picked.meaning,
      pos: picked.pos || '',
      bankId: bank.id,
      createdAt: new Date().toISOString(),
    }
    pruneWordPending(state)
    state.wordRecent.push(picked.word)
    if (state.wordRecent.length > 200) state.wordRecent = state.wordRecent.slice(-200)
    saveState(dir, state)
    return {
      id,
      zh: picked.meaning,
      pos: picked.pos || '',
      letters: letterCount(picked.word),
      bankSize: bank.entries.length,
      bankId: bank.id,
      bankName: bank.name,
    }
  }

  function checkWord({ id, answer }) {
    const state = loadState(dir)
    const pending = id ? state.wordPending[id] : null
    if (!pending) {
      const error = new Error('题目已过期，请点“换一个”重新开始。')
      error.status = 409
      throw error
    }
    const typed = normalize(answer || '').replace(/\s+/g, '')
    const target = normalize(pending.en).replace(/\s+/g, '')
    const correct = typed === target && typed.length > 0
    state.word.answered = (state.word.answered || 0) + 1
    if (correct) state.word.correct = (state.word.correct || 0) + 1
    recordStudy(state, 'word', { en: pending.en, zh: pending.zh, pos: pending.pos || '', ok: correct })
    // Keep a missed word pending so “再试一次” can re-check the same word.
    if (correct) delete state.wordPending[id]
    saveState(dir, state)
    return {
      correct,
      reference: pending.en,
      zh: pending.zh,
      pos: pending.pos || '',
      letters: letterCount(pending.en),
    }
  }

  function listBanks() {
    const state = loadState(dir)
    const active = resolveActiveBank(dir, state)
    return { active: active.id, banks: listWordBanks(dir) }
  }

  function previewImport(content) {
    return summarizeParse(parseWordBank(content))
  }

  function importBank({ name, filename, content }) {
    const parsed = parseWordBank(content)
    if (!parsed.entries.length) {
      return {
        ok: false,
        status: 400,
        body: { error: '没有识别到有效词条，请检查文件格式', report: summarizeParse(parsed) },
      }
    }
    const fallbackName = String(filename || '')
      .replace(/\.[^.]+$/, '')
      .trim()
    const bankName =
      String(name || fallbackName || '我的词库')
        .trim()
        .slice(0, 60) || '我的词库'
    const bank = {
      id: makeBankId(),
      name: bankName,
      source: String(filename || 'paste').slice(0, 200),
      createdAt: new Date().toISOString(),
      entries: parsed.entries,
    }
    saveWordBank(dir, bank)
    const state = loadState(dir)
    state.wordBankId = bank.id
    saveState(dir, state)
    return {
      ok: true,
      status: 200,
      body: {
        ok: true,
        bank: { id: bank.id, name: bank.name, count: bank.entries.length },
        report: summarizeParse(parsed, 8),
      },
    }
  }

  function setActiveBank(id) {
    if (!id) return { ok: false, status: 400, body: { error: '缺少词库 id' } }
    const bank = loadWordBank(dir, id)
    if (!bank) return { ok: false, status: 404, body: { error: '词库不存在' } }
    const state = loadState(dir)
    state.wordBankId = bank.id
    saveState(dir, state)
    return {
      ok: true,
      status: 200,
      body: {
        ok: true,
        active: bank.id,
        bank: { id: bank.id, name: bank.name, count: bank.entries.length },
      },
    }
  }

  function deleteBank(id) {
    if (!id || isBuiltinBankId(id)) return { ok: false, status: 400, body: { error: '内置词库不能删除' } }
    const state = loadState(dir)
    const removed = deleteWordBank(dir, id)
    if (!removed) return { ok: false, status: 404, body: { error: '词库不存在' } }
    if (state.wordBankId === id) {
      state.wordBankId = BUILTIN_BANK_ID
      saveState(dir, state)
    }
    return { ok: true, status: 200, body: { ok: true, active: state.wordBankId, banks: listWordBanks(dir) } }
  }

  return { nextWord, checkWord, listBanks, previewImport, importBank, setActiveBank, deleteBank }
}
