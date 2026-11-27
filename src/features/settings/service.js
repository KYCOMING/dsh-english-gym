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

export const REPORT_LEVELS = [
  { id: 'A1', label: 'A1', desc: '入门', detail: '约小学至初中水平 · 简短句式与日常基础词汇，适合零基础起步' },
  { id: 'A2', label: 'A2', desc: '基础', detail: '约初中至高中入门 · 常见生活话题与直白表达，轻松建立阅读语感' },
  { id: 'B1', label: 'B1', desc: '进阶', detail: '约高考 / 大学四级（CET-4）· 清晰自然的实用表达，日常与职场阅读主力' },
  { id: 'B2', label: 'B2', desc: '熟练', detail: '约大学六级（CET-6）/ 雅思 6.0–6.5 · 句式更丰富，流畅阅读技术博客与行业资讯' },
  { id: 'C1', label: 'C1', desc: '高级', detail: '约雅思 7.0–7.5 / 托福 95+ · 地道外刊文风，含精准词汇与复杂长难句' },
  { id: 'C2', label: 'C2', desc: '精通', detail: '约雅思 8.0+ / 母语外刊水准 · 细腻修辞、高阶词汇与深度评论风格' },
]

export function normalizeReportLevel(value, fallback = 'B1') {
  const code = String(value || '').trim().toUpperCase()
  if (REPORT_LEVELS.some((item) => item.id === code)) return code
  const fb = String(fallback || '').trim().toUpperCase()
  if (REPORT_LEVELS.some((item) => item.id === fb)) return fb
  return 'B1'
}

export const FSRS_RETENTIONS = [
  { id: 0.85, label: '85%', desc: '轻松', detail: '复习间隔更长、每日复习负担最轻，适合长期泛背积累' },
  { id: 0.9, label: '90%', desc: '均衡', detail: 'FSRS 官方推荐默认值，在记忆牢固度与复习量之间取得最佳平衡' },
  { id: 0.93, label: '93%', desc: '强化', detail: '复习频率适度提高、遗忘率更低，适合四六级 / 雅思 / 托福备考' },
  { id: 0.95, label: '95%', desc: '极致', detail: '高频巩固以维持极高记住率，适合考前冲刺（每日复习量明显增加）' },
]

export function normalizeFsrsRetention(value, fallback = 0.9) {
  const num = Number(value)
  if (!Number.isFinite(num)) {
    const fb = Number(fallback)
    return Number.isFinite(fb) ? Math.round(Math.min(0.97, Math.max(0.75, fb)) * 100) / 100 : 0.9
  }
  return Math.round(Math.min(0.97, Math.max(0.75, num)) * 100) / 100
}

export const DEFAULT_SETTINGS = {
  confetti: true,
  topicId: 'ai',
  customTopics: [],
  bankLink: true,
  bankRetries: 1,
  sessionLink: false,
  reportLevel: 'B1',
  fsrsRetention: 0.9,
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

export function normalizeSettings(raw, fallbackLevel) {
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
    reportLevel: normalizeReportLevel(source.reportLevel, fallbackLevel || DEFAULT_SETTINGS.reportLevel),
    fsrsRetention: normalizeFsrsRetention(source.fsrsRetention, DEFAULT_SETTINGS.fsrsRetention),
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
  const defaultLevel = normalizeReportLevel(conf && conf.level, DEFAULT_SETTINGS.reportLevel)

  function get() {
    const state = loadState(dir)
    const settings = normalizeSettings(state.settings, defaultLevel)
    return { settings, directions: listDirections(settings), levels: REPORT_LEVELS, retentions: FSRS_RETENTIONS }
  }

  function update(patch) {
    const state = loadState(dir)
    const current = normalizeSettings(state.settings, defaultLevel)
    const next = { ...current, customTopics: current.customTopics.map((item) => ({ ...item })) }
    const body = patch && typeof patch === 'object' ? patch : {}

    if (typeof body.confetti === 'boolean') next.confetti = body.confetti
    if (typeof body.bankLink === 'boolean') next.bankLink = body.bankLink
    if (body.bankRetries !== undefined) next.bankRetries = normalizeBankRetries(body.bankRetries)
    if (typeof body.sessionLink === 'boolean') next.sessionLink = body.sessionLink
    if (typeof body.reportLevel === 'string' && body.reportLevel.trim()) {
      next.reportLevel = normalizeReportLevel(body.reportLevel, next.reportLevel)
    }
    if (body.fsrsRetention !== undefined) {
      next.fsrsRetention = normalizeFsrsRetention(body.fsrsRetention, next.fsrsRetention)
    }
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

  function getReportLevel() {
    return get().settings.reportLevel
  }

  return { get, update, getTopic, getReportLevel }
}
