/** Minimal Node request/response helpers for the widget's JSON API. */

export function readBody(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 5_000_000) req.destroy()
    })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch {
        resolve({})
      }
    })
    req.on('error', () => resolve({}))
  })
}

export function sendJson(res, status, obj) {
  let body
  try {
    body = JSON.stringify(obj)
  } catch {
    body = JSON.stringify({ error: 'serialization failed' })
  }
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(body)
}

export function startSse(res) {
  res.statusCode = 200
  res.setHeader('content-type', 'text/event-stream; charset=utf-8')
  res.setHeader('cache-control', 'no-cache, no-transform')
  res.setHeader('connection', 'keep-alive')
  res.setHeader('x-accel-buffering', 'no')
  if (res.socket && typeof res.socket.setNoDelay === 'function') res.socket.setNoDelay(true)
  if (typeof res.flushHeaders === 'function') res.flushHeaders()
  if (!res.writableEnded && !res.destroyed) {
    res.write(': ok\n\n')
    if (typeof res.flush === 'function') res.flush()
  }
}

export function sendSse(res, event, data) {
  if (!res || res.writableEnded || res.destroyed) return
  let json
  try {
    json = JSON.stringify(data)
  } catch {
    json = '{}'
  }
  res.write(`event: ${event}\ndata: ${json}\n\n`)
  if (typeof res.flush === 'function') res.flush()
}
