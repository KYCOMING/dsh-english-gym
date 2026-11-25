import { clamp } from '../../components/motion.js'

export function phraseVerdict(feedback) {
  const score = clamp(Number(feedback && feedback.score) || 0, 0, 100)
  if (feedback && feedback.correct) {
    if (feedback.exact || score >= 98) {
      return { tone: 'ok', title: '完全正确', sub: '表达精准自然，无可挑剔。' }
    }
    if (score >= 88) {
      return { tone: 'ok', title: '表达地道', sub: '语义准确，用词自然流畅。' }
    }
    return { tone: 'ok', title: '译得不错', sub: '核心意思到位，可对照参考打磨细节。' }
  }
  if (score >= 55) {
    return { tone: 'warn', title: '还差一点', sub: '方向已接近，修正细节后再试一次。' }
  }
  if (score > 0) {
    return { tone: 'bad', title: '还需调整', sub: '语义或语法有偏差，对照参考重练一遍。' }
  }
  return { tone: 'bad', title: '暂未得分', sub: '对照原句和参考译文，重新组织英文再试一次。' }
}
