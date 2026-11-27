export const MODES = [
  { id: 'smart', label: '智能', title: '按 FSRS 算法优先复习最易遗忘的到期词，每复习 3 个穿插 1 个新词' },
  { id: 'review', label: '待复习', title: '专注清理当前词库已到复习时间的单词' },
  { id: 'new', label: '新词', title: '跳过到期复习，优先抽取尚未背过的新词' },
]

export const FSRS_RATINGS = [
  { rating: 2, key: 'hard', keyHint: '1', label: '模糊' },
  { rating: 3, key: 'good', keyHint: '2', label: '记得' },
  { rating: 4, key: 'easy', keyHint: '3', label: '很熟' },
]

export function formatStabilityShort(days) {
  const n = Number(days)
  if (!Number.isFinite(n) || n <= 0) return ''
  if (n < 1) return Math.max(1, Math.round(n * 24)) + ' 小时'
  return Math.max(1, Math.round(n)) + ' 天'
}

export function memoryLabel(srs) {
  if (!srs || srs.kind === 'new') return '新词'
  if (srs.kind === 'mastered' || srs.mastered) return '已掌握回顾'
  if (srs.state === 'learning' || srs.state === 'relearning') return '巩固中'
  if (srs.kind === 'upcoming') {
    const st = formatStabilityShort(srs.stability)
    return st ? '提前巩固 · 稳定 ' + st : '提前巩固'
  }
  if (srs.retrievability != null) return '复习 · 记忆 ' + srs.retrievability + '%'
  const st = formatStabilityShort(srs.stability)
  return st ? '复习 · 稳定 ' + st : '复习'
}

export function memoryTooltip(srs) {
  if (!srs || srs.kind === 'new') return '首次学习该词，将按 FSRS 记忆算法安排复习'
  const parts = []
  const st = formatStabilityShort(srs.stability)
  if (st) parts.push('稳定度 ' + st)
  if (srs.difficulty > 0) parts.push('难度 ' + srs.difficulty + '/10')
  if (srs.retrievability != null) parts.push('回忆概率 ' + srs.retrievability + '%')
  parts.push('复习 ' + (srs.reps || 0) + ' 次 / 遗忘 ' + (srs.lapses || 0) + ' 次')
  return parts.join(' · ')
}

export function shortBankName(name) {
  return String(name || '').replace(/^内置\s*·\s*/, '')
}
