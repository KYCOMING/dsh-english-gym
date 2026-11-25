import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { gradeAnswer } from '../src/features/phrase/grade.js'
import { createPhraseService } from '../src/features/phrase/service.js'
import { createSettingsService } from '../src/features/settings/service.js'
import { loadState } from '../src/core/store.js'

test('gradeAnswer short-circuits blank input without invoking LLM', async () => {
  let llmCalls = 0
  const ctx = {
    get(name) {
      if (name === 'llm') {
        return {
          async *stream() {
            llmCalls += 1
            yield { type: 'text-delta', text: '{}' }
          },
        }
      }
      return null
    },
  }
  const res = await gradeAnswer(ctx, { provider: 'mock', model: 'mock' }, { zh: '测试句子', reference: 'Test sentence.', answer: '   ' })
  assert.equal(res.correct, false)
  assert.equal(res.score, 0)
  assert.equal(llmCalls, 0)
})

test('createPhraseService rejects blank checkAnswer with 400 and does not write dead review queue on miss', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-phrase-clean-'))
  try {
    let llmCalls = 0
    const ctx = {
      get(name) {
        if (name === 'llm') {
          return {
            async *stream(opts) {
              llmCalls += 1
              const prompt = opts.messages[0].content[0].text
              const isGrade = prompt.includes('Learner answer:')
              const payload = isGrade
                ? JSON.stringify({ correct: false, score: 25, corrected: 'We need reliable backups.', tip: '再试试。', highlights: [] })
                : JSON.stringify({ zh: '我们需要可靠的备份。', en: 'We need reliable backups.', hint: 'reliable backups' })
              yield { type: 'text-delta', text: payload }
              yield { type: 'finish', reason: { kind: 'stop' } }
            },
          }
        }
        return null
      },
    }
    const conf = { level: 'B1', topic: 'AI and technology', provider: 'mock', model: 'mock-model' }
    createSettingsService({ dir, conf }).update({ bankLink: false })
    const svc = createPhraseService({ ctx, conf, dir })
    const card = await svc.nextQuestion({ sessionId: '' })
    assert.equal(card.mode, undefined)
    assert.equal(llmCalls, 1)

    await assert.rejects(
      () => svc.checkAnswer({ id: card.id, answer: '   ' }),
      (err) => err && err.status === 400,
    )
    assert.equal(llmCalls, 1)
    assert.equal(loadState(dir).totals.answered, 0)

    const miss = await svc.checkAnswer({ id: card.id, answer: 'something completely unrelated' })
    assert.equal(miss.correct, false)
    assert.equal(llmCalls, 2)

    const state = loadState(dir)
    assert.equal(state.totals.answered, 1)
    assert.equal(state.review, undefined)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
