/**
 * Read a short, sanitized natural-language excerpt from the active DSH session
 * to ground phrase translation prompts in the learner's current work context.
 *
 * Uses only optional host services (`sessions` for live in-memory sessions,
 * `sessionQuery` for persisted/cold sessions) and returns '' whenever none are
 * available or the conversation has too little natural-language text.
 */

const MAX_MESSAGES = 6
const MAX_MESSAGE_CHARS = 220
const MAX_TOTAL_CHARS = 760
const MIN_MEANINGFUL_CHARS = 12

function extractTextFromBlocks(content) {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  const parts = []
  for (const block of content) {
    if (!block || typeof block !== 'object') continue
    if (block.type === 'text' && typeof block.text === 'string' && block.text.trim()) {
      parts.push(block.text)
    }
  }
  return parts.join('\n')
}

/** Strip code blocks, URLs, paths, secrets, and markup; keep readable prose. */
export function cleanSessionText(raw) {
  let text = String(raw || '')
  if (!text) return ''
  // Remove fenced code blocks and long inline code spans.
  text = text.replace(/```[\s\S]*?```/g, ' ')
  text = text.replace(/`[^`]{24,}`/g, ' ')
  // Remove XML-style system/wrapper tags sometimes embedded in prompts.
  text = text.replace(/<([a-zA-Z][\w:-]*)[^>]*>[\s\S]*?<\/\1>/g, (m, tag) =>
    /^(system|reminder|context|tool|attachment|metadata|thinking|user_settings)/i.test(tag) ? ' ' : m,
  )
  text = text.replace(/<\/?[a-zA-Z][\w:-]*(?:\s[^>]*)?>/g, ' ')
  // Redact URLs, deep local file paths, and token/key-like strings.
  text = text.replace(/https?:\/\/\S+/gi, ' ')
  text = text.replace(/(?:^|\s)(?:\/[\w.@+-]+){3,}/g, ' ')
  text = text.replace(/[A-Za-z]:\\[^\s]+/g, ' ')
  text = text.replace(/\b(?:sk|pk|gh[pousr]|xox[baprs])-[A-Za-z0-9_-]{10,}\b/g, ' ')
  text = text.replace(/\b[A-Za-z0-9+/_=-]{32,}\b/g, ' ')
  // Strip lightweight markdown formatting markers while keeping the words.
  text = text.replace(/^[#>*\-\d.]+\s+/gm, '')
  text = text.replace(/[*_~`]+/g, '')
  text = text.replace(/\s+/g, ' ').trim()
  return text
}

function meaningfulLength(text) {
  const matches = String(text || '').match(/[\u4e00-\u9fffA-Za-z]/g)
  return matches ? matches.length : 0
}

function clipText(text, maxChars) {
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars - 1).trimEnd() + '…'
}

function extractTurnsFromEvents(events) {
  const turns = []
  for (const event of events || []) {
    if (!event || typeof event !== 'object') continue
    if (event.type === 'user/message') {
      const data = event.data
      if (!data) continue
      if (data.source && data.source.kind && data.source.kind !== 'user') continue
      const text = cleanSessionText(extractTextFromBlocks(data.content))
      if (meaningfulLength(text) >= 4) turns.push({ role: 'User', text })
    } else if (event.type === 'assistant/message') {
      const msg = event.data && event.data.message
      if (!msg) continue
      const text = cleanSessionText(extractTextFromBlocks(msg.content))
      if (meaningfulLength(text) >= 6) turns.push({ role: 'Assistant', text })
    }
  }
  return turns
}

function extractTurnsFromMessages(messages) {
  const turns = []
  for (const msg of messages || []) {
    if (!msg || typeof msg !== 'object') continue
    if (msg.role === 'user') {
      if (msg.source && msg.source.kind && msg.source.kind !== 'user') continue
      const text = cleanSessionText(extractTextFromBlocks(msg.content))
      if (meaningfulLength(text) >= 4) turns.push({ role: 'User', text })
    } else if (msg.role === 'assistant') {
      const text = cleanSessionText(extractTextFromBlocks(msg.content))
      if (meaningfulLength(text) >= 6) turns.push({ role: 'Assistant', text })
    }
  }
  return turns
}

/** Format recent turns into a bounded excerpt suitable for prompt grounding. */
export function buildSessionExcerpt(turns) {
  if (!Array.isArray(turns) || !turns.length) return ''
  const selected = []
  let totalChars = 0
  for (let i = turns.length - 1; i >= 0 && selected.length < MAX_MESSAGES; i -= 1) {
    const item = turns[i]
    const clipped = clipText(item.text, MAX_MESSAGE_CHARS)
    const line = `${item.role}: ${clipped}`
    if (selected.length > 0 && totalChars + line.length + 1 > MAX_TOTAL_CHARS) break
    selected.push(line)
    totalChars += line.length + 1
  }
  if (!selected.length) return ''
  selected.reverse()
  const excerpt = selected.join('\n')
  return meaningfulLength(excerpt) >= MIN_MEANINGFUL_CHARS ? excerpt : ''
}

/**
 * Read recent conversation turns for `sessionId` from DSH's live SessionStore
 * or persisted SessionQueryEngine, returning a cleaned short excerpt or ''.
 */
export async function readSessionExcerpt(ctx, sessionId) {
  const id = typeof sessionId === 'string' ? sessionId.trim() : ''
  if (!id || !ctx || typeof ctx.get !== 'function') return ''

  let turns = []
  try {
    const sessions = ctx.get('sessions')
    const live = sessions && typeof sessions.get === 'function' ? sessions.get(id) : null
    if (live) {
      if (typeof live.snapshotEvents === 'function') {
        turns = extractTurnsFromEvents(live.snapshotEvents())
      } else if (typeof live.deriveMessages === 'function') {
        turns = extractTurnsFromMessages(live.deriveMessages())
      }
    }
  } catch {
    /* fall through to sessionQuery */
  }

  if (!turns.length) {
    try {
      const sessionQuery = ctx.get('sessionQuery')
      if (sessionQuery && typeof sessionQuery.readSurface === 'function') {
        const snap = await sessionQuery.readSurface(id)
        if (snap && Array.isArray(snap.events)) {
          turns = extractTurnsFromEvents(snap.events)
        }
      }
    } catch {
      /* treat as unavailable */
    }
  }

  return buildSessionExcerpt(turns)
}
