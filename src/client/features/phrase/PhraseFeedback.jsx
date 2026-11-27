import React, { useEffect, useRef, useState } from 'react'
import { copyToClipboard, normalizeEnglish, splitByTerms } from '../../core/text.js'
import { bounceButton, clamp, useCountUp } from '../../components/motion.js'
import { ScoreRing } from '../../components/ScoreRing.jsx'
import { phraseVerdict } from './verdict.js'

export function PhraseFeedback({
  card,
  answer,
  submittedAnswer,
  feedback,
  attempt,
  prevScore,
  busy,
  onRetry,
  onNext,
}) {
  const [copied, setCopied] = useState(false)
  const copyTimerRef = useRef(null)
  const displayScore = useCountUp(feedback ? feedback.score : 0, !!feedback)

  useEffect(() => {
    setCopied(false)
    return () => clearTimeout(copyTimerRef.current)
  }, [feedback])

  // Enter triggers the primary action on the feedback card (retry when missed, next when passed).
  useEffect(() => {
    if (!feedback || busy) return undefined
    const onKeyDown = (e) => {
      if (e.key !== 'Enter' || e.isComposing || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
      const el = e.target
      if (el && el.closest && el.closest('textarea, input, select, button, a')) return
      e.preventDefault()
      if (feedback.correct) onNext()
      else if (onRetry) onRetry()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [feedback, busy, onNext, onRetry])

  const handleCopy = async () => {
    if (!feedback || !feedback.reference) return
    const ok = await copyToClipboard(feedback.reference)
    if (!ok) return
    setCopied(true)
    clearTimeout(copyTimerRef.current)
    copyTimerRef.current = setTimeout(() => setCopied(false), 1600)
  }

  const ok = !!feedback.correct
  const verdict = phraseVerdict(feedback)
  const promptZh = feedback.zh || (card && card.zh) || ''
  const mine = String(submittedAnswer !== undefined ? submittedAnswer : answer || '').trim()
  const reference = feedback.reference || ''
  const corrected = feedback.corrected || ''
  const score = clamp(Number(feedback.score) || 0, 0, 100)
  const hasEnglishAttempt = /[a-zA-Z]{2,}/.test(mine)
  const showCorrected =
    score >= 40 &&
    hasEnglishAttempt &&
    corrected &&
    normalizeEnglish(corrected) !== normalizeEnglish(reference) &&
    normalizeEnglish(corrected) !== normalizeEnglish(mine)
  const bankWords =
    Array.isArray(feedback.bankWords) && feedback.bankWords.length
      ? feedback.bankWords
      : card && Array.isArray(card.bankWords)
        ? card.bankWords
        : []
  const refParts = reference && bankWords.length ? splitByTerms(reference, bankWords) : [reference || '—']
  const highlights = Array.isArray(feedback.highlights) ? feedback.highlights : []
  const delta = prevScore !== null && prevScore !== undefined ? score - prevScore : 0
  const canRetry = !!(card && onRetry)
  const fromSession = (feedback.source || (card && card.source)) === 'session'

  return (
    <div className={'eg-fb is-phrase ' + verdict.tone} data-nodrag="true">
      <div className="eg-fb-hero">
        <ScoreRing score={score} displayScore={displayScore} />
        <div className="eg-fb-verdict">
          <div className="eg-fb-headline">
            <span className="eg-fb-status">{verdict.title}</span>
            {feedback.exact ? <span className="eg-fb-pill tone">完全匹配</span> : null}
            {fromSession ? <span className="eg-fb-pill">结合当前会话</span> : null}
            {attempt > 1 ? <span className="eg-fb-pill">{'第 ' + attempt + ' 次尝试'}</span> : null}
            {delta > 0 ? <span className="eg-fb-pill up">{'↑ +' + delta + ' 分'}</span> : null}
          </div>
          <div className="eg-fb-sub">{verdict.sub}</div>
        </div>
      </div>
      <div className="eg-fb-body">
        {promptZh ? (
          <div className="eg-fb-prompt">
            <span className="eg-fb-tag">原句</span>
            <span className="eg-fb-zh">{promptZh}</span>
          </div>
        ) : null}
        <div className="eg-fb-mine">
          <div className="eg-fb-boxhead">
            <span className="lbl">
              <span aria-hidden="true">{ok ? '✓' : '✗'}</span>
              你的作答
            </span>
          </div>
          <div className={'eg-fb-mine-text' + (mine ? '' : ' empty')}>{mine || '（未输入有效内容）'}</div>
        </div>
        <div className="eg-fb-ref">
          <div className="eg-fb-boxhead">
            <div className="eg-fb-boxhead-left">
              <span className="lbl">参考译文</span>
              {bankWords.length ? (
                <span className="eg-fb-banktag" title="融入的词库词">
                  {'词库 · ' + bankWords.join(' / ')}
                </span>
              ) : null}
            </div>
            {reference ? (
              <button
                type="button"
                className={'eg-copybtn' + (copied ? ' copied' : '')}
                onClick={handleCopy}
                title="复制参考译文"
              >
                {copied ? '已复制 ✓' : '复制'}
              </button>
            ) : null}
          </div>
          <div className="eg-fb-ref-text">
            {refParts.map((part, i) =>
              i % 2 ? (
                <mark className="eg-eg-hit" key={i}>
                  {part}
                </mark>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </div>
        </div>
        {showCorrected ? (
          <div className="eg-fb-corr">
            <div className="eg-fb-boxhead">
              <span className="lbl">贴近你思路的改写</span>
            </div>
            <div className="eg-fb-corr-text">{corrected}</div>
          </div>
        ) : null}
        {feedback.tip ? (
          <div className="eg-fb-tip">
            <span className="b">点评</span>
            <span>{feedback.tip}</span>
          </div>
        ) : null}
        {highlights.length ? (
          <div className="eg-fb-hl">
            <div className="eg-fb-hl-lbl">核心表达</div>
            <div className="eg-fb-hl-list">
              {highlights.map((item, i) => (
                <span className="eg-hl-chip" key={i}>
                  <span className="en">{item.en}</span>
                  <span className="zh">{item.zh}</span>
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="eg-fb-actions">
        {ok ? (
          <>
            <button
              className="eg-btn primary"
              onClick={onNext}
              onPointerDown={bounceButton}
              disabled={busy}
              title="回车下一题"
              aria-keyshortcuts="Enter"
            >
              下一题 →
            </button>
            {canRetry ? (
              <button className="eg-btn" onClick={onRetry} disabled={busy}>
                ↺ 再试一次
              </button>
            ) : null}
          </>
        ) : (
          <>
            {canRetry ? (
              <button
                className="eg-btn primary"
                onClick={onRetry}
                onPointerDown={bounceButton}
                disabled={busy}
                title="回车再试一次"
                aria-keyshortcuts="Enter"
              >
                ↺ 再试一次
              </button>
            ) : null}
            <button className={canRetry ? 'eg-btn' : 'eg-btn primary'} onClick={onNext} disabled={busy}>
              下一题 →
            </button>
          </>
        )}
        <span className="eg-kbd" title={ok ? '按 Enter 进入下一题' : '按 Enter 再试一次'}>
          <kbd>↵</kbd> {ok ? '下一题' : '再试'}
        </span>
      </div>
    </div>
  )
}
