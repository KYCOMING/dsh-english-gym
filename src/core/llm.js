/** Thin helpers over the DSH llm service. All failures bubble up as Errors. */

export function getRoute(ctx, config) {
  let provider = config && config.provider ? String(config.provider) : ''
  let model = config && config.model ? String(config.model) : ''
  if (!provider || !model) {
    try {
      const svc = ctx.get('agentDefaultModel')
      const selection = svc && typeof svc.currentSelection === 'function' ? svc.currentSelection() : null
      if (selection) {
        provider = provider || selection.provider
        model = model || selection.model
      }
    } catch {
      /* ignore */
    }
  }
  return { provider, model }
}

export function hasLlm(ctx) {
  const svc = ctx.get('llm')
  return !!(svc && typeof svc.stream === 'function')
}

export const DEFAULT_LLM_TIMEOUT_MS = 45_000

/**
 * Run one non-streaming completion and return the concatenated text.
 * @param {{system?:string, prompt:string, temperature?:number, maxTokens?:number, purpose?:string, signal?:AbortSignal, timeoutMs?:number}} req
 */
export async function completeText(ctx, config, req) {
  const llm = ctx.get('llm')
  if (!llm || typeof llm.stream !== 'function') throw new Error('llm service unavailable')
  const { provider, model } = getRoute(ctx, config)
  if (!provider || !model) throw new Error('no model route (set provider/model in config)')

  if (req.signal && req.signal.aborted) {
    throw new Error('model call aborted')
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
  let timer = null
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

  if (timeoutMs > 0) {
    timer = setTimeout(() => triggerAbort(new Error('model call timed out')), timeoutMs)
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

  let text = ''
  const seen = new Set()
  let finishKind = ''
  let iter = null
  try {
    const iterable = llm.stream(options)
    iter = iterable[Symbol.asyncIterator]()
    while (true) {
      const step = await Promise.race([iter.next(), abortPromise])
      if (!step || step.done) break
      const chunk = step.value
      if (!chunk || typeof chunk !== 'object') continue
      if (chunk.type) seen.add(chunk.type)
      if (chunk.type === 'text-delta') {
        text += chunk.text || ''
      } else if (chunk.type === 'finish') {
        const reason = chunk.reason || {}
        finishKind = reason.kind || ''
        if (reason.kind === 'error') {
          throw new Error((reason.failure && reason.failure.message) || 'model call failed')
        }
        if (reason.kind === 'aborted') {
          throw new Error('model call aborted')
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
  } finally {
    rejectAbort = null
    if (timer) clearTimeout(timer)
    if (req.signal && onExternalAbort) req.signal.removeEventListener('abort', onExternalAbort)
  }

  if (!text) {
    throw new Error('empty model output types=[' + [...seen].join(',') + '] finish=' + finishKind)
  }
  return text
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
      out += ch
      if (ch === '"') inStr = true
    }
  }
  return out.replace(/,\s*([}\]])/g, '$1')
}

/** Pull the first JSON object out of an LLM reply (tolerates code fences / prose). */
export function extractJson(text) {
  if (!text || typeof text !== 'string') return null
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) t = fence[1].trim()
  const start = t.indexOf('{')
  const end = t.lastIndexOf('}')
  if (start >= 0 && end > start) t = t.slice(start, end + 1)
  try {
    return JSON.parse(t)
  } catch {
    try {
      return JSON.parse(repairJson(t))
    } catch {
      return null
    }
  }
}
