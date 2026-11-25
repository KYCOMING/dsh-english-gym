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
