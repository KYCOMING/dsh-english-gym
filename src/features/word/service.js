import { randomUUID } from 'node:crypto'
import { loadState, saveState } from '../../core/store.js'
import { normalize, scrubExample } from '../../shared/text.js'
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
import { normalizeFsrsRetention } from '../settings/service.js'
import {
  applyWordReview,
  FSRS_RATING,
  inspectWordMemory,
  markWordMastered,
  normalizeRating,
  normalizeWordKey,
  pickWordSrs,
  previewWordRatings,
  summarizeBankMemory,
} from './srs.js'

const spellingKey = (en) => normalize(en).replace(/[^a-z]/g, '')
const letterCount = (en) => spellingKey(en).length

function pruneWordPending(state) {
  const entries = Object.entries(state.wordPending || {})
  if (entries.length <= 10) return
  entries.sort((a, b) => String(a[1].createdAt || '').localeCompare(String(b[1].createdAt || '')))
  const remove = entries.length - 10
  for (let i = 0; i < remove; i += 1) delete state.wordPending[entries[i][0]]
}

/** Word spelling drill + word-bank management. */
export function createWordService({ dir }) {
  function nextWord(options = {}) {
    const state = loadState(dir)
    const bank = resolveActiveBank(dir, state)
    if (!bank || !Array.isArray(bank.entries) || !bank.entries.length) {
      const error = new Error('词库数据缺失或为空，请检查词库文件或重新安装插件。')
      error.status = 500
      throw error
    }
    const mode = options && (options.mode === 'review' || options.mode === 'new') ? options.mode : 'smart'
    const now = Date.now()
    const srsStats = summarizeBankMemory(bank.entries, state.wordMemory, now)
    const pick = pickWordSrs(bank.entries, state.wordMemory, {
      mode,
      recent: state.wordRecent,
      reviewStreak: state.wordReviewStreak || 0,
      now,
    })

    if (!pick.entry) {
      return {
        done: true,
        reason: pick.reason || 'no_due',
        mode,
        bankSize: bank.entries.length,
        bankId: bank.id,
        bankName: bank.name,
        srsStats,
      }
    }

    const picked = pick.entry
    const id = randomUUID()
    state.wordPending[id] = {
      en: picked.word,
      zh: picked.meaning,
      pos: picked.pos || '',
      uk: picked.uk || '',
      us: picked.us || '',
      phonetic: picked.phonetic || '',
      example: picked.example || '',
      exampleZh: picked.exampleZh || '',
      bankId: bank.id,
      createdAt: new Date().toISOString(),
      hadMiss: false,
      missRecorded: false,
      checked: false,
    }
    pruneWordPending(state)
    state.wordRecent.push(picked.word)
    if (state.wordRecent.length > 200) state.wordRecent = state.wordRecent.slice(-200)
    state.wordReviewStreak = pick.nextReviewStreak
    saveState(dir, state)

    const mem = state.wordMemory[normalizeWordKey(picked.word)] || null
    return {
      id,
      zh: picked.meaning,
      pos: picked.pos || '',
      letters: letterCount(picked.word),
      // The full sentence stays server-side until the answer is checked.
      example: scrubExample(picked.word, picked.example || ''),
      bankSize: bank.entries.length,
      bankId: bank.id,
      bankName: bank.name,
      mode,
      srsStats,
      srs: {
        kind: pick.kind,
        ...inspectWordMemory(mem, now),
      },
    }
  }

  function buildCheckSrsPayload(outcome, ratingPreviews) {
    return {
      rating: outcome.rating,
      state: outcome.state,
      stability: outcome.stability,
      difficulty: outcome.difficulty,
      retrievability: outcome.retrievability,
      familiarity: outcome.familiarity,
      maxFamiliarity: outcome.maxFamiliarity,
      mastered: outcome.mastered,
      nextIntervalMs: outcome.nextIntervalMs,
      nextReviewText: outcome.nextReviewText,
      clean: outcome.clean,
      early: Boolean(outcome.early),
      canRate: Boolean(ratingPreviews),
      ratingPreviews,
    }
  }

  function checkWord({ id, answer, revealed } = {}) {
    const state = loadState(dir)
    const pending = id ? state.wordPending[id] : null
    if (!pending || pending.checked) {
      const error = new Error('题目已过期，请点“换一个”重新开始。')
      error.status = 409
      throw error
    }
    const typed = spellingKey(answer || '')
    const target = spellingKey(pending.en)
    const correct = typed === target && typed.length > 0
    const now = Date.now()
    const key = normalizeWordKey(pending.en)
    const clean = correct && !pending.hadMiss && !revealed
    const requestRetention = normalizeFsrsRetention(state.settings && state.settings.fsrsRetention)
    const beforeMem = state.wordMemory[key] ? { ...state.wordMemory[key] } : null
    const outcome = applyWordReview(beforeMem, {
      correct,
      clean,
      rating: correct && clean ? FSRS_RATING.GOOD : FSRS_RATING.AGAIN,
      countLapse: !correct && !pending.missRecorded,
      now,
      requestRetention,
    })
    state.wordMemory[key] = outcome.memory

    const ratingPreviews =
      correct && clean && !outcome.early && !outcome.wasMastered
        ? previewWordRatings(beforeMem, { now, requestRetention })
        : null

    state.word.answered = (state.word.answered || 0) + 1
    if (correct) state.word.correct = (state.word.correct || 0) + 1
    recordStudy(state, 'word', { en: pending.en, zh: pending.zh, pos: pending.pos || '', ok: correct })
    // Keep a missed word pending so “再试一次” can re-check without double-counting lapses.
    // On clean correct answers with rating previews, keep snapshot for optional /word/rate adjustment.
    if (correct) {
      if (ratingPreviews) {
        pending.checked = true
        pending.beforeMem = beforeMem
        pending.checkedAt = now
        pending.retention = requestRetention
        pending.rating = outcome.rating
      } else {
        delete state.wordPending[id]
      }
    } else {
      pending.hadMiss = true
      pending.missRecorded = true
    }

    const bank = resolveActiveBank(dir, state)
    const srsStats = summarizeBankMemory(bank ? bank.entries : [], state.wordMemory, now)
    saveState(dir, state)

    return {
      correct,
      reference: pending.en,
      zh: pending.zh,
      pos: pending.pos || '',
      uk: pending.uk || '',
      us: pending.us || '',
      phonetic: pending.phonetic || '',
      letters: letterCount(pending.en),
      example: pending.example || '',
      exampleZh: pending.exampleZh || '',
      srs: buildCheckSrsPayload(outcome, ratingPreviews),
      srsStats,
    }
  }

  function rateWord({ id, rating } = {}) {
    const normRating = normalizeRating(rating, 0)
    if (normRating !== FSRS_RATING.HARD && normRating !== FSRS_RATING.GOOD && normRating !== FSRS_RATING.EASY) {
      return { ok: false, status: 400, body: { error: '无效的评分档位' } }
    }
    const state = loadState(dir)
    const pending = id ? state.wordPending[id] : null
    if (!pending || !pending.checked) {
      return { ok: false, status: 409, body: { error: '当前题目已过期，无法调整评分' } }
    }
    const key = normalizeWordKey(pending.en)
    const now = Number.isFinite(Number(pending.checkedAt)) ? Number(pending.checkedAt) : Date.now()
    const requestRetention = normalizeFsrsRetention(
      pending.retention !== undefined ? pending.retention : state.settings && state.settings.fsrsRetention,
    )
    const outcome = applyWordReview(pending.beforeMem || null, {
      correct: true,
      clean: true,
      rating: normRating,
      now,
      requestRetention,
    })
    state.wordMemory[key] = outcome.memory
    pending.rating = normRating

    const ratingPreviews = previewWordRatings(pending.beforeMem || null, { now, requestRetention })
    const bank = resolveActiveBank(dir, state)
    const srsStats = summarizeBankMemory(bank ? bank.entries : [], state.wordMemory, Date.now())
    saveState(dir, state)

    return {
      ok: true,
      status: 200,
      body: {
        ok: true,
        srs: buildCheckSrsPayload(outcome, ratingPreviews),
        srsStats,
      },
    }
  }

  function markMastered({ id, word } = {}) {
    const state = loadState(dir)
    const pending = id ? state.wordPending[id] : null
    const targetWord = (pending && pending.en) || String(word || '').trim()
    if (!targetWord) {
      return { ok: false, status: 400, body: { error: '缺少单词' } }
    }
    const now = Date.now()
    const key = normalizeWordKey(targetWord)
    state.wordMemory[key] = markWordMastered(state.wordMemory[key], now)
    if (pending) delete state.wordPending[id]
    const bank = resolveActiveBank(dir, state)
    const srsStats = summarizeBankMemory(bank ? bank.entries : [], state.wordMemory, now)
    saveState(dir, state)
    return {
      ok: true,
      status: 200,
      body: {
        ok: true,
        word: targetWord,
        srsStats,
      },
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

  return { nextWord, checkWord, rateWord, markMastered, listBanks, previewImport, importBank, setActiveBank, deleteBank }
}
