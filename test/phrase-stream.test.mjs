import test from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { Readable } from 'node:stream'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { completeText } from '../src/core/llm.js'
import { extractPartialJsonStringField, extractPartialPhraseZh, generateQuestion, parseGeneratedQuestion } from '../src/features/phrase/generate.js'
import { createPhraseService } from '../src/features/phrase/service.js'
import { createSettingsService } from '../src/features/settings/service.js'
import { createWordService } from '../src/features/word/service.js'
import { createEnglishGym } from '../src/host/plugin.js'
import { loadState } from '../src/core/store.js'

function createMockReq(method, url, body) {
  const payload = body === undefined ? '' : typeof body === 'string' ? body : JSON.stringify(body)
  const req = Readable.from(payload ? [Buffer.from(payload, 'utf8')] : [])
  req.method = method
  req.url = url
  return req
}

function createMockRes() {
  const res = new EventEmitter()
  res.statusCode = 200
  res.headers = {}
  res.writableEnded = false
  res.destroyed = false
  res.chunks = []
  res.setHeader = (k, v) => {
    res.headers[k.toLowerCase()] = v
  }
  res.flushHeaders = () => {}
  res.write = (chunk) => {
    res.chunks.push(String(chunk))
    return true
  }
  res.end = (chunk) => {
    if (chunk !== undefined) res.chunks.push(String(chunk))
    res.writableEnded = true
    res.emit('finish')
  }
  res.simulateDisconnect = () => {
    res.destroyed = true
    res.emit('close')
  }
  return res
}

function parseSseFrames(raw) {
  return raw
    .replace(/\r\n/g, '\n')
    .split('\n\n')
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      let event = 'message'
      const dataLines = []
      for (const line of block.split('\n')) {
        if (!line || line.startsWith(':')) continue
        if (line.startsWith('event:')) event = line.slice(6).trim()
        else if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart())
      }
      if (!dataLines.length) return null
      return { event, data: JSON.parse(dataLines.join('\n')) }
    })
    .filter(Boolean)
}

test('extractPartialJsonStringField handles progressive streaming, fences, escapes, and key order', () => {
  assert.equal(extractPartialJsonStringField('', 'zh'), null)
  assert.equal(extractPartialJsonStringField('{"zh": "', 'zh').value, '')
  assert.equal(extractPartialJsonStringField('{"zh": "', 'zh').complete, false)

  // Progressive updates + holding back incomplete escapes
  assert.deepEqual(extractPartialJsonStringField('{"zh": "请先\\', 'zh'), { value: '请先', complete: false })
  assert.deepEqual(extractPartialJsonStringField('{"zh": "请先\\u4f6', 'zh'), { value: '请先', complete: false })
  assert.deepEqual(extractPartialJsonStringField('{"zh": "请先\\u4f60\\n\\"好', 'zh'), {
    value: '请先你\n"好',
    complete: false,
  })
  assert.deepEqual(extractPartialJsonStringField('{"zh": "请先\\u4f60\\n\\"好\\"", "en": "Hi"}', 'zh'), {
    value: '请先你\n"好"',
    complete: true,
  })

  // Markdown fence + leading prose
  const fenced = '好的，题目如下：\n```json\n{"zh": "延迟太高了'
  assert.deepEqual(extractPartialJsonStringField(fenced, 'zh'), { value: '延迟太高了', complete: false })

  // Alternate key order with nested/quoted fake "zh" inside other fields
  const otherOrder = '{"meta": {"zh": "nested"}, "en": "Say \\"zh\\": hello", "zh": "真实中文'
  assert.deepEqual(extractPartialJsonStringField(otherOrder, 'zh'), { value: '真实中文', complete: false })

  const incompletePrev = '{"en": "still streaming \\"zh\\": fake'
  assert.equal(extractPartialJsonStringField(incompletePrev, 'zh'), null)
})

test('extractPartialPhraseZh and parseGeneratedQuestion support 3-line Chinese-first streaming and JSON fallback', () => {
  assert.equal(extractPartialPhraseZh(''), null)
  assert.equal(extractPartialPhraseZh('   '), null)
  assert.equal(extractPartialPhraseZh('ZH'), null)
  assert.equal(extractPartialPhraseZh('Line 1'), null)
  assert.equal(extractPartialPhraseZh('```'), null)

  // Token #1 immediate streaming in plain 3-line mode
  assert.deepEqual(extractPartialPhraseZh('这'), { value: '这', complete: false })
  assert.deepEqual(extractPartialPhraseZh('ZH: "保持低延迟'), { value: '保持低延迟', complete: false })
  assert.deepEqual(extractPartialPhraseZh('ZH: "保持低延迟"\nEN: Keep'), {
    value: '保持低延迟',
    complete: true,
  })

  // JSON fallback still delegates cleanly
  assert.deepEqual(extractPartialPhraseZh('{"zh": "流式'), { value: '流式', complete: false })
  assert.deepEqual(extractPartialPhraseZh('```json\n{"zh": "流式输出"'), { value: '流式输出', complete: true })

  // parseGeneratedQuestion handles 3-line output (with or without ZH: prefix / fences) and JSON
  assert.deepEqual(
    parseGeneratedQuestion('保持低延迟很重要。\nEN: Keeping latency low matters.\nHINT: latency / matter'),
    {
      zh: '保持低延迟很重要。',
      en: 'Keeping latency low matters.',
      hint: 'latency / matter',
    },
  )
  assert.deepEqual(
    parseGeneratedQuestion('```\n中文：「请再试一次」\nEnglish: "Please try again."\n提示：try again\n```'),
    {
      zh: '请再试一次',
      en: 'Please try again.',
      hint: 'try again',
    },
  )
  assert.deepEqual(
    parseGeneratedQuestion('{"zh": "兼容 JSON。", "en": "Compatible with JSON.", "hint": "compatible"}'),
    {
      zh: '兼容 JSON。',
      en: 'Compatible with JSON.',
      hint: 'compatible',
    },
  )
})

test('completeText invokes onDelta progressively and onReset on reasoningEffort retry', async () => {
  const deltas = []
  let resets = 0
  let call = 0
  const ctx = {
    get(name) {
      if (name !== 'llm') return null
      return {
        async *stream(opts) {
          call += 1
          if (call === 1 && opts.reasoningEffort) {
            yield { type: 'text-delta', text: '{"zh": "错误尝试' }
            throw new Error('400 unsupported parameter: reasoningEffort')
          }
          yield { type: 'text-delta', text: '{"zh": "第一段' }
          yield { type: 'text-delta', text: '第二段"}' }
          yield { type: 'finish', reason: { kind: 'stop' } }
        },
      }
    },
  }

  const out = await completeText(
    ctx,
    { provider: 'p', model: 'm-retry' },
    {
      prompt: 'hi',
      reasoningEffort: 'off',
      onDelta(delta, full) {
        deltas.push({ delta, full })
      },
      onReset() {
        resets += 1
        deltas.length = 0
      },
    },
  )

  assert.equal(out, '{"zh": "第一段第二段"}')
  assert.equal(resets, 1)
  assert.deepEqual(deltas, [
    { delta: '{"zh": "第一段', full: '{"zh": "第一段' },
    { delta: '第二段"}', full: '{"zh": "第一段第二段"}' },
  ])
})

test('generateQuestion streams zh before en/hint finish and rethrows on abort without seed fallback', async () => {
  const seenZh = []
  let finishedStream = false
  const ctx = {
    get(name) {
      if (name !== 'llm') return null
      return {
        async *stream() {
          yield { type: 'text-delta', text: '{"zh": "我们需要' }
          assert.equal(finishedStream, false)
          yield { type: 'text-delta', text: '更快地迭代。", ' }
          yield { type: 'text-delta', text: '"en": "We need to iterate faster.", "hint": "iterate faster"}' }
          finishedStream = true
          yield { type: 'finish', reason: { kind: 'stop' } }
        },
      }
    },
  }

  const q = await generateQuestion(
    ctx,
    { provider: 'p', model: 'm', level: 'B1', topic: 'software' },
    {
      onZh(zh, done) {
        seenZh.push({ zh, done, finishedStream })
      },
    },
  )

  assert.equal(q.zh, '我们需要更快地迭代。')
  assert.equal(q.en, 'We need to iterate faster.')
  assert.equal(q.hint, 'iterate faster')
  assert.deepEqual(seenZh, [
    { zh: '我们需要', done: false, finishedStream: false },
    { zh: '我们需要更快地迭代。', done: true, finishedStream: false },
  ])

  const ac = new AbortController()
  const abortCtx = {
    get(name) {
      if (name !== 'llm') return null
      return {
        async *stream() {
          yield { type: 'text-delta', text: '{"zh": "部分' }
          ac.abort()
          yield { type: 'text-delta', text: '内容"}' }
        },
      }
    },
  }
  await assert.rejects(
    () =>
      generateQuestion(
        abortCtx,
        { provider: 'p', model: 'm', level: 'B1' },
        { signal: ac.signal, onZh: () => {} },
      ),
    /aborted/i,
  )
})

test('createPhraseService.nextQuestion streams in topic/session modes, limits bankRetries streaming to attempt 0, handles abort and fallback', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-phrase-stream-svc-'))
  try {
    const conf = { provider: 'mock', model: 'mock', level: 'B1', topic: 'AI and technology' }
    createWordService({ dir }).importBank({ name: 'Stream Bank', content: 'latency\t延迟\n' })
    const settingsSvc = createSettingsService({ dir, conf })
    settingsSvc.update({ bankLink: true, bankRetries: 1, sessionLink: false })

    // 1. Topic mode with bankRetries: attempt 0 misses bank word -> attempt 1 hits; only attempt 0 emits onZh
    let call = 0
    const topicCtx = {
      get(name) {
        if (name !== 'llm') return null
        return {
          async *stream() {
            call += 1
            if (call === 1) {
              yield { type: 'text-delta', text: '{"zh": "系统正在' }
              yield { type: 'text-delta', text: '处理请求。", ' }
              yield { type: 'text-delta', text: '"en": "The system is handling requests.", "hint": "handle"}' }
              yield { type: 'finish', reason: { kind: 'stop' } }
              return
            }
            yield { type: 'text-delta', text: '{"zh": "我们需要降低系统延迟。", ' }
            yield { type: 'text-delta', text: '"en": "We need to reduce system latency.", "hint": "reduce latency"}' }
            yield { type: 'finish', reason: { kind: 'stop' } }
          },
        }
      },
    }

    const topicSvc = createPhraseService({ ctx: topicCtx, conf, dir, getTopic: () => settingsSvc.getTopic() })
    const topicSources = []
    const topicZhEvents = []
    const topicCard = await topicSvc.nextQuestion({
      onSource: (s) => topicSources.push(s),
      onZh: (zh, done) => topicZhEvents.push({ zh, done }),
    })
    assert.deepEqual(topicSources, ['topic'])
    assert.deepEqual(topicZhEvents, [
      { zh: '系统正在', done: false },
      { zh: '系统正在处理请求。', done: true },
    ])
    assert.equal(topicCard.zh, '我们需要降低系统延迟。')
    assert.deepEqual(topicCard.bankWords, ['latency'])
    assert.equal(topicCard.source, 'topic')

    // 2. Session-linked mode
    settingsSvc.update({ sessionLink: true })
    const sessionCtx = {
      get(name) {
        if (name === 'sessions') {
          return {
            get(id) {
              if (id !== 'sess-1') return null
              return {
                snapshotEvents() {
                  return [{ type: 'user/message', data: { content: 'Let us stream the phrase prompt over SSE.' } }]
                },
              }
            },
          }
        }
        if (name === 'llm') {
          return {
            async *stream() {
              yield { type: 'text-delta', text: '{"zh": "让我们通过流式接口' }
              yield { type: 'text-delta', text: '输出短语。", "en": "Let us stream the phrase over SSE.", "hint": "stream"}' }
              yield { type: 'finish', reason: { kind: 'stop' } }
            },
          }
        }
        return null
      },
    }
    const sessionSvc = createPhraseService({ ctx: sessionCtx, conf, dir, getTopic: () => settingsSvc.getTopic() })
    const sessionSources = []
    const sessionZh = []
    const sessionCard = await sessionSvc.nextQuestion({
      sessionId: 'sess-1',
      onSource: (s) => sessionSources.push(s),
      onZh: (zh, done) => sessionZh.push({ zh, done }),
    })
    assert.deepEqual(sessionSources, ['session'])
    assert.equal(sessionCard.source, 'session')
    assert.equal(sessionZh[0].zh, '让我们通过流式接口')

    // 3. Abort skips state.pending write
    const pendingBeforeAbort = Object.keys(loadState(dir).pending).length
    const ac = new AbortController()
    const abortCtx = {
      get(name) {
        if (name !== 'llm') return null
        return {
          async *stream() {
            yield { type: 'text-delta', text: '{"zh": "半截' }
            ac.abort()
            yield { type: 'text-delta', text: '句子"}' }
          },
        }
      },
    }
    const abortSvc = createPhraseService({ ctx: abortCtx, conf, dir, getTopic: () => settingsSvc.getTopic() })
    await assert.rejects(() => abortSvc.nextQuestion({ signal: ac.signal, onZh: () => {} }), /aborted/i)
    assert.equal(Object.keys(loadState(dir).pending).length, pendingBeforeAbort)

    // 4. Non-abort LLM failure falls back to seed question
    settingsSvc.update({ sessionLink: false, bankLink: false })
    const failCtx = {
      get(name) {
        if (name !== 'llm') return null
        return {
          async *stream() {
            throw new Error('upstream down')
          },
        }
      },
    }
    const failSvc = createPhraseService({ ctx: failCtx, conf, dir, getTopic: () => settingsSvc.getTopic() })
    const fbCard = await failSvc.nextQuestion({ onZh: () => {} })
    assert.equal(fbCard.source, 'fallback')
    assert.ok(fbCard.id)
    assert.ok(fbCard.zh)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('HTTP POST /api/english-gym/next/stream streams SSE events without leaking en, supports check and disconnect abort, and preserves POST /next', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-http-stream-'))
  try {
    let mode = 'normal'
    let abortObserved = false
    const ctx = {
      get(name) {
        if (name !== 'llm') return null
        return {
          async *stream(opts) {
            if (mode === 'hang') {
              await new Promise((_, reject) => {
                if (opts.signal) {
                  if (opts.signal.aborted) {
                    abortObserved = true
                    reject(new Error('aborted'))
                    return
                  }
                  opts.signal.addEventListener(
                    'abort',
                    () => {
                      abortObserved = true
                      reject(new Error('aborted'))
                    },
                    { once: true },
                  )
                }
              })
              return
            }
            const prompt = opts.messages[0].content[0].text
            if (prompt.includes('Learner answer:')) {
              yield {
                type: 'text-delta',
                text: JSON.stringify({ correct: true, score: 96, corrected: 'Streaming cuts waiting time.', tip: '很好。', highlights: [] }),
              }
              yield { type: 'finish', reason: { kind: 'stop' } }
              return
            }
            yield { type: 'reasoning-delta', text: 'thinking about a good sentence...' }
            yield { type: 'text-delta', text: '流式输出能减少' }
            yield { type: 'text-delta', text: '等待时间。\nEN: Streaming cuts waiting time.\nHINT: waiting time' }
            yield { type: 'finish', reason: { kind: 'stop' } }
          },
        }
      },
    }

    const gym = createEnglishGym(ctx, { dataDir: dir, provider: 'mock', model: 'mock', level: 'B1' })
    const peer = { id: 'owner' }

    // Turn off bankLink to make generation single-shot
    {
      const req = createMockReq('POST', '/api/english-gym/settings', { bankLink: false })
      const res = createMockRes()
      await gym.route.handler(req, res, peer)
      assert.equal(res.statusCode, 200)
    }

    // 1. SSE stream /next/stream
    const streamReq = createMockReq('POST', '/api/english-gym/next/stream', { sessionId: '' })
    const streamRes = createMockRes()
    await gym.route.handler(streamReq, streamRes, peer)

    assert.equal(streamRes.statusCode, 200)
    assert.match(streamRes.headers['content-type'], /^text\/event-stream/i)
    assert.equal(streamRes.writableEnded, true)

    const rawSse = streamRes.chunks.join('')
    assert.ok(rawSse.startsWith(': ok\n\n'))
    assert.equal(rawSse.includes('Streaming cuts waiting time'), false)
    const frames = parseSseFrames(rawSse)
    assert.deepEqual(frames[0], { event: 'meta', data: { source: 'topic' } })
    assert.deepEqual(frames[1], { event: 'status', data: { stage: 'thinking' } })
    assert.deepEqual(
      frames.filter((f) => f.event === 'zh').map((f) => f.data),
      [
        { zh: '流式输出能减少', done: false },
        { zh: '流式输出能减少等待时间。', done: true },
      ],
    )
    const doneFrame = frames.find((f) => f.event === 'done')
    assert.ok(doneFrame)
    assert.equal('en' in doneFrame.data, false)
    assert.equal(doneFrame.data.zh, '流式输出能减少等待时间。')
    assert.equal(doneFrame.data.hint, 'waiting time')
    assert.ok(doneFrame.data.id)

    // 2. Returned id works with POST /check
    {
      const checkReq = createMockReq('POST', '/api/english-gym/check', {
        id: doneFrame.data.id,
        answer: 'Streaming reduces waiting time.',
      })
      const checkRes = createMockRes()
      await gym.route.handler(checkReq, checkRes, peer)
      assert.equal(checkRes.statusCode, 200)
      const checked = JSON.parse(checkRes.chunks.join(''))
      assert.equal(checked.correct, true)
      assert.equal(checked.reference, 'Streaming cuts waiting time.')
    }

    // 3. POST /next JSON endpoint still works
    {
      const nextReq = createMockReq('POST', '/api/english-gym/next', { sessionId: '' })
      const nextRes = createMockRes()
      await gym.route.handler(nextReq, nextRes, peer)
      assert.equal(nextRes.statusCode, 200)
      const card = JSON.parse(nextRes.chunks.join(''))
      assert.equal(card.zh, '流式输出能减少等待时间。')
      assert.equal('en' in card, false)
    }

    // 4. Client disconnect aborts in-flight stream cleanly without writing pending state
    mode = 'hang'
    const pendingCount = Object.keys(loadState(dir).pending).length
    const hangReq = createMockReq('POST', '/api/english-gym/next/stream', { sessionId: '' })
    const hangRes = createMockRes()
    const handlerPromise = gym.route.handler(hangReq, hangRes, peer)
    await new Promise((r) => setTimeout(r, 20))
    hangRes.simulateDisconnect()
    await handlerPromise
    assert.equal(abortObserved, true)
    assert.equal(Object.keys(loadState(dir).pending).length, pendingCount)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
