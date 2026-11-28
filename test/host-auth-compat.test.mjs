import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createEnglishGym } from '../src/host/plugin.js'

function createMockReq(url = '/api/english-gym/health') {
  return { method: 'GET', url, headers: { host: '127.0.0.1:60160' } }
}

function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value
    },
    end(chunk) {
      if (chunk !== undefined) this.body += String(chunk)
      this.writableEnded = true
    },
  }
}

function createContext(connection) {
  return {
    get(name) {
      if (name === 'connection') return connection
      // The health route only probes llm; all other routes create their
      // services lazily and are not exercised here.
      if (name === 'llm') return null
      if (name === 'agentDefaultModel') return null
      if (name === 'tools') return null
      return null
    },
  }
}

test('host route admits DSH 0.2.2-style requests without a peer argument', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-host-auth-'))
  let admission = { peer: { id: 'owner' } }
  const gym = createEnglishGym(createContext({ admit: () => admission }), { dataDir: dir })

  try {
    // DSH 0.2.2-rc.5 WebRoute handlers receive only (req, res): Connection's
    // admit() must authenticate the request and the route must continue.
    const allowed = createMockRes()
    await gym.route.handler(createMockReq(), allowed)
    assert.equal(allowed.statusCode, 200)
    assert.deepEqual(JSON.parse(allowed.body), { ok: true, llm: false, level: 'B1' })

    // A rejected credential must fail closed with Connection's status.
    admission = { rejection: 403 }
    const forbidden = createMockRes()
    await gym.route.handler(createMockReq(), forbidden)
    assert.equal(forbidden.statusCode, 403)
    assert.deepEqual(JSON.parse(forbidden.body), { error: 'unauthorized' })
  } finally {
    gym.close()
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

test('host route keeps DSH 0.2.3-style pre-admitted Peer path and fails closed without it', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-host-auth-peer-'))
  const gym = createEnglishGym(createContext(undefined), { dataDir: dir })

  try {
    // DSH 0.2.3+ passes the already-admitted owner Peer as the third argument.
    const allowed = createMockRes()
    await gym.route.handler(createMockReq(), allowed, { id: 'owner' })
    assert.equal(allowed.statusCode, 200)

    // Without route-level auth and without a Connection service the route
    // must not become anonymous.
    const missing = createMockRes()
    await gym.route.handler(createMockReq(), missing)
    assert.equal(missing.statusCode, 401)
    assert.deepEqual(JSON.parse(missing.body), { error: 'unauthorized' })
  } finally {
    gym.close()
    fs.rmSync(dir, { recursive: true, force: true })
  }
})
