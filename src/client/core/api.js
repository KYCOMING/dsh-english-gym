export const API = '/api/english-gym'

export async function api(path, options) {
  const res = await fetch(API + path, {
    headers: { 'content-type': 'application/json' },
    ...(options || {}),
  })
  let data = null
  try {
    data = await res.json()
  } catch {
    data = {}
  }
  if (!res.ok) {
    const message = (data && data.error) || 'HTTP ' + res.status
    const error = new Error(message)
    error.status = res.status
    throw error
  }
  return data
}

export async function apiStream(path, { method = 'POST', body, signal, onEvent } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: {
      'content-type': 'application/json',
      accept: 'text/event-stream',
    },
    body,
    signal,
  })
  if (!res.ok) {
    let data = null
    try {
      data = await res.json()
    } catch {
      data = {}
    }
    const message = (data && data.error) || 'HTTP ' + res.status
    const error = new Error(message)
    error.status = res.status
    throw error
  }

  const contentType = (res.headers && res.headers.get && res.headers.get('content-type')) || ''
  if (!contentType.includes('text/event-stream') || !res.body || typeof res.body.getReader !== 'function') {
    let data = null
    try {
      data = await res.json()
    } catch {
      data = {}
    }
    if (typeof onEvent === 'function') onEvent('done', data)
    return data
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let finalData = null
  let hasDone = false
  let streamError = null

  const dispatchBlock = (block) => {
    const trimmed = block.trim()
    if (!trimmed) return
    let eventName = 'message'
    const dataLines = []
    for (const line of trimmed.split('\n')) {
      if (!line || line.startsWith(':')) continue
      if (line.startsWith('event:')) {
        eventName = line.slice(6).trim()
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trimStart())
      }
    }
    if (!dataLines.length) return
    const rawData = dataLines.join('\n')
    let parsed = rawData
    try {
      parsed = JSON.parse(rawData)
    } catch {
      /* keep raw string */
    }
    if (eventName === 'error') {
      streamError = new Error((parsed && parsed.error) || '流式出题失败')
    } else if (eventName === 'done') {
      hasDone = true
      finalData = parsed
    }
    if (typeof onEvent === 'function') onEvent(eventName, parsed)
  }

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      if (value) {
        buffer = (buffer + decoder.decode(value, { stream: true })).replace(/\r\n/g, '\n')
        let sep = buffer.indexOf('\n\n')
        while (sep >= 0) {
          const block = buffer.slice(0, sep)
          buffer = buffer.slice(sep + 2)
          dispatchBlock(block)
          sep = buffer.indexOf('\n\n')
        }
      }
    }
    const rest = decoder.decode()
    if (rest) buffer = (buffer + rest).replace(/\r\n/g, '\n')
    if (buffer.trim()) {
      for (const block of buffer.split('\n\n')) {
        dispatchBlock(block)
      }
    }
  } finally {
    if (typeof reader.releaseLock === 'function') {
      try {
        reader.releaseLock()
      } catch {
        /* ignore */
      }
    }
  }

  if (streamError) throw streamError
  if (!hasDone) throw new Error('流式响应意外中断')
  return finalData
}
