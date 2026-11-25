import React, { useCallback, useEffect, useRef, useState } from 'react'
import { copyToClipboard, normalizeEnglish, splitByTerms } from '../../core/text.js'
import { bounceButton, clamp, useCountUp } from '../../components/motion.js'
import { ScoreRing } from '../../components/ScoreRing.js'
import { phraseVerdict } from './verdict.js'

const useIsoLayoutEffect = React.useLayoutEffect || useEffect
const INPUT_LINE_HEIGHT = 40

export function Drill({
  card,
  answer,
  setAnswer,
  submittedAnswer,
  feedback,
  attempt,
  prevScore,
  retryFocusTick,
  busy,
  error,
  onSubmit,
  onRetry,
  onNext,
}) {
  const [hintOpen, setHintOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)
  const copyTimerRef = useRef(null)
  const displayScore = useCountUp(feedback ? feedback.score : 0, !!feedback)

  useEffect(() => {
    setCopied(false)
    return () => clearTimeout(copyTimerRef.current)
  }, [feedback])

  const syncInputHeight = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = INPUT_LINE_HEIGHT + 'px'
    const lines = Math.max(1, Math.min(6, Math.ceil((el.scrollHeight - 2) / INPUT_LINE_HEIGHT)))
    el.style.height = lines * INPUT_LINE_HEIGHT + 'px'
    el.style.overflowY = lines >= 6 ? 'auto' : 'hidden'
  }, [])

  useIsoLayoutEffect(() => {
    syncInputHeight()
  }, [answer, card, feedback, syncInputHeight])

  useEffect(() => {
    const el = inputRef.current
    if (!el || typeof ResizeObserver !== 'function') return undefined
    const ro = new ResizeObserver(syncInputHeight)
    ro.observe(el)
    return () => ro.disconnect()
  }, [card, feedback, syncInputHeight])

  // Focus and select the previous draft when returning from “再试一次”.
  useEffect(() => {
    if (!retryFocusTick || feedback || !card) return
    const timer = setTimeout(() => {
      try {
        const el = inputRef.current
        if (el) {
          el.focus()
          if (el.select) el.select()
        }
      } catch {
        /* ignore */
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [retryFocusTick, feedback, card])

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

  if (feedback) {
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

    return React.createElement(
      'div',
      { className: 'eg-fb is-phrase ' + verdict.tone, 'data-nodrag': 'true' },
      React.createElement(
        'div',
        { className: 'eg-fb-hero' },
        React.createElement(ScoreRing, { score, displayScore }),
        React.createElement(
          'div',
          { className: 'eg-fb-verdict' },
          React.createElement(
            'div',
            { className: 'eg-fb-headline' },
            React.createElement('span', { className: 'eg-fb-status' }, verdict.title),
            feedback.exact ? React.createElement('span', { className: 'eg-fb-pill tone' }, '完全匹配') : null,
            fromSession ? React.createElement('span', { className: 'eg-fb-pill' }, '结合当前会话') : null,
            attempt > 1 ? React.createElement('span', { className: 'eg-fb-pill' }, '第 ' + attempt + ' 次尝试') : null,
            delta > 0 ? React.createElement('span', { className: 'eg-fb-pill up' }, '↑ +' + delta + ' 分') : null,
          ),
          React.createElement('div', { className: 'eg-fb-sub' }, verdict.sub),
        ),
      ),
      React.createElement(
        'div',
        { className: 'eg-fb-body' },
        promptZh
          ? React.createElement(
              'div',
              { className: 'eg-fb-prompt' },
              React.createElement('span', { className: 'eg-fb-tag' }, '原句'),
              React.createElement('span', { className: 'eg-fb-zh' }, promptZh),
            )
          : null,
        React.createElement(
          'div',
          { className: 'eg-fb-mine' },
          React.createElement(
            'div',
            { className: 'eg-fb-boxhead' },
            React.createElement(
              'span',
              { className: 'lbl' },
              React.createElement('span', { 'aria-hidden': 'true' }, ok ? '✓' : '✗'),
              '你的作答',
            ),
          ),
          React.createElement(
            'div',
            { className: 'eg-fb-mine-text' + (mine ? '' : ' empty') },
            mine || '（未输入有效内容）',
          ),
        ),
        React.createElement(
          'div',
          { className: 'eg-fb-ref' },
          React.createElement(
            'div',
            { className: 'eg-fb-boxhead' },
            React.createElement(
              'div',
              { className: 'eg-fb-boxhead-left' },
              React.createElement('span', { className: 'lbl' }, '参考译文'),
              bankWords.length
                ? React.createElement('span', { className: 'eg-fb-banktag', title: '融入的词库词' }, '词库 · ' + bankWords.join(' / '))
                : null,
            ),
            reference
              ? React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'eg-copybtn' + (copied ? ' copied' : ''),
                    onClick: handleCopy,
                    title: '复制参考译文',
                  },
                  copied ? '已复制 ✓' : '复制',
                )
              : null,
          ),
          React.createElement(
            'div',
            { className: 'eg-fb-ref-text' },
            refParts.map((part, i) =>
              i % 2 ? React.createElement('mark', { className: 'eg-eg-hit', key: i }, part) : React.createElement('span', { key: i }, part),
            ),
          ),
        ),
        showCorrected
          ? React.createElement(
              'div',
              { className: 'eg-fb-corr' },
              React.createElement(
                'div',
                { className: 'eg-fb-boxhead' },
                React.createElement('span', { className: 'lbl' }, '贴近你思路的改写'),
              ),
              React.createElement('div', { className: 'eg-fb-corr-text' }, corrected),
            )
          : null,
        feedback.tip
          ? React.createElement(
              'div',
              { className: 'eg-fb-tip' },
              React.createElement('span', { className: 'b' }, '点评'),
              React.createElement('span', null, feedback.tip),
            )
          : null,
        highlights.length
          ? React.createElement(
              'div',
              { className: 'eg-fb-hl' },
              React.createElement('div', { className: 'eg-fb-hl-lbl' }, '核心表达'),
              React.createElement(
                'div',
                { className: 'eg-fb-hl-list' },
                highlights.map((item, i) =>
                  React.createElement(
                    'span',
                    { className: 'eg-hl-chip', key: i },
                    React.createElement('span', { className: 'en' }, item.en),
                    React.createElement('span', { className: 'zh' }, item.zh),
                  ),
                ),
              ),
            )
          : null,
      ),
      React.createElement(
        'div',
        { className: 'eg-fb-actions' },
        ok
          ? [
              React.createElement(
                'button',
                {
                  key: 'next',
                  className: 'eg-btn primary',
                  onClick: onNext,
                  onPointerDown: bounceButton,
                  disabled: busy,
                  title: '回车下一题',
                  'aria-keyshortcuts': 'Enter',
                },
                '下一题 →',
              ),
              canRetry
                ? React.createElement(
                    'button',
                    { key: 'retry', className: 'eg-btn', onClick: onRetry, disabled: busy },
                    '↺ 再试一次',
                  )
                : null,
            ]
          : [
              canRetry
                ? React.createElement(
                    'button',
                    {
                      key: 'retry',
                      className: 'eg-btn primary',
                      onClick: onRetry,
                      onPointerDown: bounceButton,
                      disabled: busy,
                      title: '回车再试一次',
                      'aria-keyshortcuts': 'Enter',
                    },
                    '↺ 再试一次',
                  )
                : null,
              React.createElement(
                'button',
                { key: 'next', className: canRetry ? 'eg-btn' : 'eg-btn primary', onClick: onNext, disabled: busy },
                '下一题 →',
              ),
            ],
        React.createElement(
          'span',
          { className: 'eg-kbd', title: ok ? '按 Enter 进入下一题' : '按 Enter 再试一次' },
          React.createElement('kbd', null, '↵'),
          ' ',
          ok ? '下一题' : '再试',
        ),
      ),
    )
  }

  if (!card) {
    if (error) {
      return React.createElement(
        'div',
        null,
        React.createElement('div', { className: 'eg-err' }, error),
        React.createElement(
          'div',
          { className: 'eg-foot' },
          React.createElement('button', { className: 'eg-btn primary', onClick: onNext, disabled: busy }, '重试'),
        ),
      )
    }
    return React.createElement(
      'div',
      { className: 'eg-loading is-stage' },
      React.createElement('span', { className: 'eg-spin' }),
      '正在出题…',
    )
  }

  return React.createElement(
    'div',
    { className: 'eg-drill-stage' },
    React.createElement(
      'div',
      { className: 'eg-cap eg-cap-row' },
      React.createElement('span', null, '把这句话译成英文'),
      card.source === 'session'
        ? React.createElement('span', { className: 'eg-source-pill', title: '根据当前会话内容生成' }, '结合当前会话')
        : null,
      attempt > 0 ? React.createElement('span', { className: 'eg-attempt-pill' }, '第 ' + (attempt + 1) + ' 次尝试') : null,
    ),
    React.createElement('div', { className: 'eg-zh' }, card.zh),
    card.hint
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement(
            'button',
            {
              className: 'eg-hintbtn',
              'aria-expanded': hintOpen ? 'true' : 'false',
              onClick: () => setHintOpen((v) => !v),
              type: 'button',
            },
            React.createElement('span', { className: 'caret', 'aria-hidden': 'true' }, '▸'),
            '提示',
          ),
          React.createElement(
            'div',
            {
              className: 'eg-collapse eg-hint-collapse' + (hintOpen ? ' open' : ''),
              'aria-hidden': hintOpen ? 'false' : 'true',
            },
            React.createElement(
              'div',
              { className: 'eg-collapse-inner' },
              React.createElement('div', { className: 'eg-hintbox' }, card.hint),
            ),
          ),
        )
      : null,
    React.createElement(
      'div',
      { className: 'eg-inputwrap' },
      React.createElement('textarea', {
        ref: inputRef,
        rows: 1,
        className: 'eg-input' + (error ? ' error' : ''),
        value: answer,
        placeholder: '在这里写下你的英文…',
        onChange: (e) => setAnswer(e.target.value),
        onKeyDown: (e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            if (answer.trim()) onSubmit()
          }
        },
      }),
    ),
    error ? React.createElement('div', { className: 'eg-err' }, error) : null,
    React.createElement(
      'div',
      { className: 'eg-foot' },
      React.createElement(
        'button',
        {
          className: 'eg-btn primary' + (busy ? ' is-loading' : ''),
          onClick: onSubmit,
          onPointerDown: bounceButton,
          disabled: busy || !answer.trim(),
        },
        '提交',
      ),
      React.createElement('button', { className: 'eg-btn', onClick: onNext, disabled: busy }, '换一题'),
      React.createElement(
        'span',
        { className: 'eg-kbd', title: '⌘/Ctrl + Enter 提交' },
        React.createElement('kbd', null, '⌘'),
        ' ',
        React.createElement('kbd', null, '↵'),
      ),
    ),
  )
}
