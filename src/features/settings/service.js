import { loadState, saveState } from '../../core/store.js'

/**
 * Built-in content directions. `label` is what the widget shows; `topic` is
 * what generation prompts receive. Keep them short: they go into every
 * question/report prompt.
 */
export const BUILTIN_TOPICS = [
  { id: 'ai', label: 'AI 与技术', topic: 'AI and technology' },
  { id: 'software', label: '软件开发', topic: 'software development and engineering' },
  { id: 'data', label: '数据与算法', topic: 'data science and algorithms' },
  { id: 'product', label: '产品与设计', topic: 'product design and user experience' },
  { id: 'workplace', label: '职场沟通', topic: 'workplace communication and career' },
  { id: 'business', label: '商业与创业', topic: 'business, startups and entrepreneurship' },
  { id: 'science', label: '科学探索', topic: 'science and discovery' },
  { id: 'health', label: '健康与生活', topic: 'health and everyday life' },
  { id: 'environment', label: '环境与能源', topic: 'environment and energy' },
  { id: 'education', label: '教育与学习', topic: 'education and learning' },
  { id: 'finance', label: '金融与经济', topic: 'finance and economy' },
  { id: 'culture', label: '文化与旅行', topic: 'culture and travel' },
]

export const DEFAULT_SETTINGS = {
  confetti: true,
  topicId: 'ai',
  customTopics: [],
  bankLink: true,
  bankRetries: 1,
  sessionLink: false,
}

export const MAX_BANK_RETRIES = 5

export function normalizeBankRetries(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return DEFAULT_SETTINGS.bankRetries
  return Math.max(0, Math.min(MAX_BANK_RETRIES, Math.round(num)))
}

const CUSTOM_ID_RE = /^ct-[a-z0-9-]{4,64}$/
const MAX_CUSTOM_TOPICS = 40
const MAX_LABEL_LENGTH = 40

function makeCustomId() {
  return `ct-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function cleanLabel(value) {
  return String(value == null ? '' : value).trim().replace(/\s+/g, ' ').slice(0, MAX_LABEL_LENGTH)
}

/** Keep only well-formed custom directions, assign ids, and dedupe by label. */
export function normalizeCustomTopics(list) {
  if (!Array.isArray(list)) return []
  const seen = new Set()
  const result = []
  for (const raw of list) {
    const value = typeof raw === 'string' ? { label: raw } : raw || {}
    const label = cleanLabel(value.label || value.topic || value.name)
    if (!label) continue
    const key = label.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    const id = typeof value.id === 'string' && CUSTOM_ID_RE.test(value.id) ? value.id : makeCustomId()
    result.push({ id, label, topic: label })
    if (result.length >= MAX_CUSTOM_TOPICS) break
  }
  return result
}

export function normalizeSettings(raw) {
  const source = raw && typeof raw === 'object' ? raw : {}
  const customTopics = normalizeCustomTopics(source.customTopics)
  let topicId = typeof source.topicId === 'string' && source.topicId ? source.topicId : DEFAULT_SETTINGS.topicId
  if (![...BUILTIN_TOPICS, ...customTopics].some((item) => item.id === topicId)) {
    topicId = DEFAULT_SETTINGS.topicId
  }
  return {
    confetti: source.confetti !== false,
    topicId,
    customTopics,
    bankLink: source.bankLink !== false,
    bankRetries: normalizeBankRetries(source.bankRetries),
    sessionLink: source.sessionLink === true,
  }
}

export function listDirections(settings) {
  const normalized = normalizeSettings(settings)
  return [
    ...BUILTIN_TOPICS.map((item) => ({ ...item, builtin: true })),
    ...normalized.customTopics.map((item) => ({ ...item, builtin: false })),
  ]
}

export function selectedTopic(settings, fallback) {
  const normalized = normalizeSettings(settings)
  const match = listDirections(normalized).find((item) => item.id === normalized.topicId)
  if (match) return match.topic
  return fallback || 'AI and technology'
}

export function createSettingsService({ dir, conf }) {
  function get() {
    const state = loadState(dir)
    const settings = normalizeSettings(state.settings)
    return { settings, directions: listDirections(settings) }
  }

  function update(patch) {
    const state = loadState(dir)
    const current = normalizeSettings(state.settings)
    const next = { ...current, customTopics: current.customTopics.map((item) => ({ ...item })) }
    const body = patch && typeof patch === 'object' ? patch : {}

    if (typeof body.confetti === 'boolean') next.confetti = body.confetti
    if (typeof body.bankLink === 'boolean') next.bankLink = body.bankLink
    if (body.bankRetries !== undefined) next.bankRetries = normalizeBankRetries(body.bankRetries)
    if (typeof body.sessionLink === 'boolean') next.sessionLink = body.sessionLink
    if (Array.isArray(body.customTopics)) next.customTopics = normalizeCustomTopics(body.customTopics)
    if (typeof body.topicId === 'string' && body.topicId) {
      const known = listDirections(next).some((item) => item.id === body.topicId)
      if (known) next.topicId = body.topicId
    }
    // Removing the selected custom direction must not leave a dangling id.
    if (!listDirections(next).some((item) => item.id === next.topicId)) {
      next.topicId = BUILTIN_TOPICS[0].id
    }
    state.settings = next
    saveState(dir, state)
    return get()
  }

  function getTopic() {
    const { settings } = get()
    return selectedTopic(settings, conf && conf.topic)
  }

  return { get, update, getTopic }
}
