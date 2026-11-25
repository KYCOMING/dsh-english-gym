import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { buildDashboard, currentStreak, touchStreak } from '../src/features/activity/service.js'
import { createWordService } from '../src/features/word/service.js'
import { createPhraseService } from '../src/features/phrase/service.js'
import { createSettingsService } from '../src/features/settings/service.js'
import { dayKey, loadState, saveState, yesterdayKey } from '../src/core/store.js'

test('touchStreak and currentStreak track consecutive days and expire after missed days', () => {
  const day1 = new Date('2026-11-23T10:00:00')
  const day2 = new Date('2026-11-24T10:00:00')
  const day4 = new Date('2026-11-26T10:00:00')
  const state = { streak: { count: 0, lastActiveDay: null } }

  touchStreak(state, day1)
  assert.deepEqual(state.streak, { count: 1, lastActiveDay: '2026-11-23' })
  assert.equal(currentStreak(state, day1), 1)
  assert.equal(currentStreak(state, day2), 1)

  touchStreak(state, day2)
  assert.deepEqual(state.streak, { count: 2, lastActiveDay: '2026-11-24' })

  // Repeating on the same day keeps count = 2
  touchStreak(state, day2)
  assert.deepEqual(state.streak, { count: 2, lastActiveDay: '2026-11-24' })

  // Missing 2026-11-25 expires the streak on 2026-11-26 without waiting for another study event
  assert.equal(currentStreak(state, day4), 0)
  touchStreak(state, day4)
  assert.deepEqual(state.streak, { count: 1, lastActiveDay: '2026-11-26' })
})

test('word practice updates streak and buildDashboard expires stale streaks', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-word-streak-'))
  try {
    const staleState = loadState(dir)
    staleState.streak = { count: 7, lastActiveDay: '2020-01-01' }
    saveState(dir, staleState)
    assert.equal(buildDashboard(loadState(dir)).streak, 0)

    const wordSvc = createWordService({ dir })
    wordSvc.importBank({ name: 'Streak Bank', content: 'compact\t紧凑的\n' })
    const q = wordSvc.nextWord({ mode: 'new' })
    wordSvc.checkWord({ id: q.id, answer: 'compact' })

    const updated = loadState(dir)
    assert.deepEqual(updated.streak, { count: 1, lastActiveDay: dayKey() })
    assert.equal(buildDashboard(updated).streak, 1)

    // Set lastActiveDay to yesterday and check another study event advances to 2
    updated.streak = { count: 1, lastActiveDay: yesterdayKey() }
    saveState(dir, updated)
    const q2 = wordSvc.nextWord({ mode: 'smart' })
    wordSvc.checkWord({ id: q2.id, answer: 'compact' })
    assert.equal(loadState(dir).streak.count, 2)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('createPhraseService preserves concurrent state changes made while LLM is in flight', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-phrase-race-'))
  try {
    const conf = { level: 'B1', topic: 'AI and technology', provider: 'mock', model: 'mock-model' }
    const settingsSvc = createSettingsService({ dir, conf })
    settingsSvc.update({ bankLink: false })

    let phase = 'idle'
    const mockCtx = {
      get(name) {
        if (name === 'llm') {
          return {
            async *stream() {
              // Simulate a concurrent user action (changing settings + studying a word) during LLM latency
              if (phase === 'next') {
                settingsSvc.update({ reportLevel: 'C2' })
              } else if (phase === 'check') {
                const st = loadState(dir)
                st.word.answered += 5
                st.word.correct += 4
                st.wordMemory.concurrent = { stage: 2, dueAt: Date.now() + 60_000, lastAt: Date.now(), reps: 1, lapses: 0, mastered: false }
                saveState(dir, st)
              }
              const payload =
                phase === 'next'
                  ? JSON.stringify({ zh: '我们需要更快的响应。', en: 'We need a faster response.', hint: 'faster response' })
                  : JSON.stringify({
                      correct: true,
                      score: 92,
                      corrected: 'We need faster responses.',
                      tip: '表达不错。',
                      highlights: [],
                    })
              yield { type: 'text-delta', text: payload }
              yield { type: 'finish', reason: { kind: 'stop' } }
            },
          }
        }
        return null
      },
    }

    const phraseSvc = createPhraseService({ ctx: mockCtx, conf, dir, getTopic: () => settingsSvc.getTopic() })

    phase = 'next'
    const card = await phraseSvc.nextQuestion({ mode: 'new' })
    assert.equal(loadState(dir).settings.reportLevel, 'C2')
    assert.ok(loadState(dir).pending[card.id])

    phase = 'check'
    const graded = await phraseSvc.checkAnswer({ id: card.id, answer: 'We need faster responses.' })
    assert.equal(graded.correct, true)

    const finalState = loadState(dir)
    assert.equal(finalState.settings.reportLevel, 'C2')
    assert.equal(finalState.word.answered, 5)
    assert.equal(finalState.word.correct, 4)
    assert.ok(finalState.wordMemory.concurrent)
    assert.equal(finalState.totals.answered, 1)
    assert.equal(finalState.streak.count, 1)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
