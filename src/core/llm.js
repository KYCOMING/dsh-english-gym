/** Thin helpers over the DSH llm service. All failures bubble up as Errors. */

export const REASONING_EFFORT_RANK = ['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max']

const MODEL_REASONING_CACHE = new WeakMap()
const MODEL_REASONING_TTL_MS = 60_000
const REJECTED_EFFORT_CACHE = new WeakMap()
const REJECTED_EFFORT_TTL_MS = 5 * 60_000

function isEffortRejected(llm, provider, model, effort) {
  const map = REJECTED_EFFORT_CACHE.get(llm)
  if (!map) return false
  const key = `${provider}\0${model}\0${effort}`
  const expiresAt = map.get(key)
  if (!expiresAt) return false
  if (expiresAt <= Date.now()) {
    map.delete(key)
    return false
  }
  return true
}

function markEffortRejected(llm, provider, model, effort) {
  let map = REJECTED_EFFORT_CACHE.get(llm)
  if (!map) {
    map = new Map()
    REJECTED_EFFORT_CACHE.set(llm, map)
  }
  map.set(`${provider}\0${model}\0${effort}`, Date.now() + REJECTED_EFFORT_TTL_MS)
}

function isReasoningOptionError(err) {
  const msg = String((err && err.message) || err || '')
  if (!msg || /timed out|aborted/i.test(msg)) return false
  return /reason|think|effort|unsupported|unknown.*(?:param|field|option)|invalid.*(?:param|field|option|request)|bad request|\b400\b|empty model output/i.test(
    msg,
  )
}

/**
 * Pick the requested reasoning effort if supported by the model, otherwise fall
 * back to the closest supported effort (lowest for `off`, lowest non-off for `low`,
 * nearest rank otherwise).
 *
 * @param {string} requested
 * @param {Array<string | {id?:string}>} supportedEfforts
 * @returns {string | undefined}
 */
export function selectSupportedEffort(requested, supportedEfforts) {
  const supported = []
  const seen = new Set()
  for (const item of Array.isArray(supportedEfforts) ? supportedEfforts : []) {
    const id = (typeof item === 'string' ? item : item && typeof item.id === 'string' ? item.id : '')
      .trim()
      .toLowerCase()
    if (!id || seen.has(id)) continue
    seen.add(id)
    supported.push(id)
  }
  if (!supported.length) return undefined

  const req = String(requested || '').trim().toLowerCase()
  if (supported.includes(req)) return req
  if (req === 'off') return supported[0]

  const nonOff = supported.filter((id) => id !== 'off')
  if (!nonOff.length) return supported[0]
  if (req === 'low') return nonOff.includes('minimal') ? 'minimal' : nonOff[0]

  const rankOf = (id) => {
    const idx = REASONING_EFFORT_RANK.indexOf(id)
    return idx >= 0 ? idx : Number.POSITIVE_INFINITY
  }
  const reqRankIdx = REASONING_EFFORT_RANK.indexOf(req)
  const targetRank = reqRankIdx >= 0 ? reqRankIdx : REASONING_EFFORT_RANK.indexOf('medium')

  let best = nonOff[0]
  let bestRank = rankOf(best)
  let bestDist = Math.abs(bestRank - targetRank)
  for (let i = 1; i < nonOff.length; i += 1) {
    const id = nonOff[i]
    const r = rankOf(id)
    const dist = Math.abs(r - targetRank)
    if (dist < bestDist || (dist === bestDist && r < bestRank)) {
      best = id
      bestRank = r
      bestDist = dist
    }
  }
  return best
}

async function resolveModelReasoning(llm, provider, model) {
  if (!llm) return null
  const resolver =
    typeof llm.resolveModelInfo === 'function'
      ? llm.resolveModelInfo
      : typeof llm.resolveModel === 'function'
        ? llm.resolveModel
        : null
  if (!resolver) return null
  let perLlm = MODEL_REASONING_CACHE.get(llm)
  if (!perLlm) {
    perLlm = new Map()
    MODEL_REASONING_CACHE.set(llm, perLlm)
  }
  const key = `${provider}\0${model}`
  const hit = perLlm.get(key)
  if (hit && hit.expiresAt > Date.now()) return hit.value

  try {
    const info = await resolver.call(llm, provider, model)
    if (!info || typeof info !== 'object') return null
    if (!info.reasoning || typeof info.reasoning !== 'object') return null
    const rawEfforts = Array.isArray(info.reasoning.efforts) ? info.reasoning.efforts : []
    const efforts = rawEfforts
      .map((item) => (typeof item === 'string' ? item : item && typeof item.id === 'string' ? item.id : ''))
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    const value = { efforts }
    perLlm.set(key, { expiresAt: Date.now() + MODEL_REASONING_TTL_MS, value })
    return value
  } catch {
    return null
  }
}

export function getRoute(ctx, config) {
  let provider = config && config.provider ? String(config.provider) : ''
  let model = config && config.model ? String(config.model) : ''
  let reasoningEffort = ''
  try {
    const svc = ctx.get('agentDefaultModel')
    const selection = svc && typeof svc.currentSelection === 'function' ? svc.currentSelection() : null
    if (selection) {
      provider = provider || selection.provider
      model = model || selection.model
      if (
        selection.provider === provider &&
        selection.model === model &&
        typeof selection.reasoningEffort === 'string' &&
        selection.reasoningEffort.trim()
      ) {
        reasoningEffort = selection.reasoningEffort.trim().toLowerCase()
      }
    }
  } catch {
    /* ignore */
  }
  return reasoningEffort ? { provider, model, reasoningEffort } : { provider, model }
}

export function hasLlm(ctx) {
  const svc = ctx.get('llm')
  return !!(svc && typeof svc.stream === 'function')
}

export const DEFAULT_LLM_TIMEOUT_MS = 45_000

/**
 * Run one non-streaming completion and return the concatenated text.
 * @param {{system?:string, prompt:string, temperature?:number, maxTokens?:number, purpose?:string, reasoningEffort?:string, signal?:AbortSignal, timeoutMs?:number}} req
 */
export async function completeText(ctx, config, req) {
  const llm = ctx.get('llm')
  if (!llm || typeof llm.stream !== 'function') throw new Error('llm service unavailable')
  const route = getRoute(ctx, config)
  const { provider, model } = route
  if (!provider || !model) throw new Error('no model route (set provider/model in config)')

  if (req.signal && req.signal.aborted) {
    throw new Error('model call aborted')
  }

  const rawEffort = req.reasoningEffort !== undefined ? req.reasoningEffort : config && config.reasoningEffort
  const desiredEffort = typeof rawEffort === 'string' ? rawEffort.trim().toLowerCase() : ''
  let resolvedEffort = ''
  if (desiredEffort === 'auto') {
    resolvedEffort = route.reasoningEffort || ''
  } else if (REASONING_EFFORT_RANK.includes(desiredEffort)) {
    const cap = await resolveModelReasoning(llm, provider, model)
    if (cap === null) {
      resolvedEffort = desiredEffort
    } else if (cap.efforts.length > 0) {
      resolvedEffort = selectSupportedEffort(desiredEffort, cap.efforts) || ''
    }
  }

  const timeoutDisabled = req.timeoutMs === 0 || req.timeoutMs === Infinity
  const timeoutMs = timeoutDisabled
    ? 0
    : Number.isFinite(req.timeoutMs) && req.timeoutMs > 0
      ? req.timeoutMs
      : DEFAULT_LLM_TIMEOUT_MS

  const temperature = typeof req.temperature === 'number' ? req.temperature : 0.4
  const maxTokens = typeof req.maxTokens === 'number' ? req.maxTokens : 900

  const ac = new AbortController()
  let idleTimer = null
  let hardTimer = null
  let rejectAbort = null
  const abortPromise = new Promise((_, reject) => {
    rejectAbort = reject
  })
  abortPromise.catch(() => {})

  const triggerAbort = (err) => {
    if (!ac.signal.aborted) ac.abort(err)
    if (rejectAbort) {
      rejectAbort(err)
      rejectAbort = null
    }
  }

  let onExternalAbort = null
  if (req.signal) {
    onExternalAbort = () => triggerAbort(new Error('model call aborted'))
    req.signal.addEventListener('abort', onExternalAbort, { once: true })
  }

  const resetIdleTimer = () => {
    if (idleTimer) {
      clearTimeout(idleTimer)
      idleTimer = null
    }
    if (timeoutMs > 0 && !ac.signal.aborted) {
      idleTimer = setTimeout(() => triggerAbort(new Error('model call timed out')), timeoutMs)
    }
  }

  if (timeoutMs > 0) {
    const hardCapMs = timeoutMs >= 1000 ? Math.max(timeoutMs * 3, 180_000) : timeoutMs * 5
    hardTimer = setTimeout(() => triggerAbort(new Error('model call timed out')), hardCapMs)
  }

  const options = {
    provider,
    model,
    messages: [{ role: 'user', content: [{ type: 'text', text: req.prompt }] }],
    temperature,
    maxTokens,
    purpose: req.purpose || 'english-gym',
    signal: ac.signal,
  }
  if (req.system) options.system = req.system
  if (resolvedEffort && !isEffortRejected(llm, provider, model, resolvedEffort)) {
    options.reasoningEffort = resolvedEffort
  }

  const runStream = async (streamOpts) => {
    let text = ''
    const seen = new Set()
    let finishKind = ''
    let thinkingNotified = false
    let iter = null
    resetIdleTimer()
    try {
      const iterable = llm.stream(streamOpts)
      iter = iterable[Symbol.asyncIterator]()
      while (true) {
        const step = await Promise.race([iter.next(), abortPromise])
        if (!step || step.done) break
        resetIdleTimer()
        const chunk = step.value
        if (!chunk || typeof chunk !== 'object') continue
        if (chunk.type) seen.add(chunk.type)
        if (chunk.type === 'text-delta') {
          if (chunk.text) {
            text += chunk.text
            if (typeof req.onDelta === 'function') {
              try {
                req.onDelta(chunk.text, text)
              } catch {
                /* observer errors must not break the stream */
              }
            }
          }
        } else if (chunk.type === 'finish') {
          const reason = chunk.reason || {}
          finishKind = reason.kind || ''
          if (finishKind === 'length' || finishKind === 'max_tokens' || finishKind === 'max-tokens') {
            console.warn('[english-gym] model output hit maxTokens limit:', streamOpts.maxTokens)
          }
          if (reason.kind === 'error') {
            throw new Error((reason.failure && reason.failure.message) || 'model call failed')
          }
          if (reason.kind === 'aborted') {
            throw new Error('model call aborted')
          }
        } else if (chunk.type && /reason|think/i.test(chunk.type)) {
          if (!thinkingNotified && typeof req.onThinking === 'function') {
            thinkingNotified = true
            try {
              req.onThinking()
            } catch {
              /* observer errors must not break the stream */
            }
          }
        }
      }
    } catch (err) {
      if (ac.signal.aborted && iter && typeof iter.return === 'function') {
        Promise.resolve()
          .then(() => iter.return())
          .catch(() => {})
      }
      throw err
    }

    if (!text) {
      throw new Error('empty model output types=[' + [...seen].join(',') + '] finish=' + finishKind)
    }
    return text
  }

  try {
    return await runStream(options)
  } catch (err) {
    if (options.reasoningEffort && !ac.signal.aborted && isReasoningOptionError(err)) {
      markEffortRejected(llm, provider, model, options.reasoningEffort)
      if (typeof req.onReset === 'function') {
        try {
          req.onReset()
        } catch {
          /* ignore */
        }
      }
      const retryOptions = { ...options, maxTokens: Math.max(options.maxTokens || 900, 4096) }
      delete retryOptions.reasoningEffort
      return await runStream(retryOptions)
    }
    throw err
  } finally {
    rejectAbort = null
    if (idleTimer) clearTimeout(idleTimer)
    if (hardTimer) clearTimeout(hardTimer)
    if (req.signal && onExternalAbort) req.signal.removeEventListener('abort', onExternalAbort)
  }
}

/**
 * Escape raw control characters (newlines/tabs) that appear INSIDE JSON string
 * literals. Models often emit multi-paragraph text with real line breaks, which
 * makes JSON.parse fail. Also drops trailing commas.
 */
export function repairJson(t) {
  let out = ''
  let inStr = false
  let esc = false
  for (let i = 0; i < t.length; i += 1) {
    const ch = t[i]
    if (inStr) {
      if (esc) {
        out += ch
        esc = false
        continue
      }
      if (ch === '\\') {
        out += ch
        esc = true
        continue
      }
      if (ch === '"') {
        out += ch
        inStr = false
        continue
      }
      if (ch === '\n') {
        out += '\\n'
        continue
      }
      if (ch === '\r') {
        out += '\\r'
        continue
      }
      if (ch === '\t') {
        out += '\\t'
        continue
      }
      out += ch
    } else {
      if (ch === '/' && t[i + 1] === '/') {
        while (i < t.length && t[i] !== '\n') i += 1
        if (i < t.length) out += '\n'
        continue
      }
      out += ch
      if (ch === '"') inStr = true
    }
  }
  return out.replace(/,\s*([}\]])/g, '$1')
}

function extractBalancedJsonObject(str) {
  const start = str.indexOf('{')
  if (start < 0) return ''
  let depth = 0
  let inStr = false
  let esc = false
  for (let i = start; i < str.length; i += 1) {
    const ch = str[i]
    if (inStr) {
      if (esc) {
        esc = false
      } else if (ch === '\\') {
        esc = true
      } else if (ch === '"') {
        inStr = false
      }
      continue
    }
    if (ch === '"') {
      inStr = true
    } else if (ch === '{') {
      depth += 1
    } else if (ch === '}') {
      depth -= 1
      if (depth === 0) return str.slice(start, i + 1)
    }
  }
  return ''
}

function tryParseJsonObject(raw) {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    try {
      return JSON.parse(repairJson(raw))
    } catch {
      return null
    }
  }
}

/** Pull the first JSON object out of an LLM reply (tolerates code fences / prose). */
export function extractJson(text) {
  if (!text || typeof text !== 'string') return null
  let t = text.replace(/^\uFEFF/, '').trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) t = fence[1].trim()
  const start = t.indexOf('{')
  const end = t.lastIndexOf('}')
  const sliced = start >= 0 && end > start ? t.slice(start, end + 1) : t
  const direct = tryParseJsonObject(sliced)
  if (direct) return direct
  const balanced = extractBalancedJsonObject(t)
  if (balanced && balanced !== sliced) {
    return tryParseJsonObject(balanced)
  }
  return null
}
