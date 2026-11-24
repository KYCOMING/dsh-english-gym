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
