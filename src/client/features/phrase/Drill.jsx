import React, { useCallback, useEffect, useRef, useState } from 'react'
import { bounceButton } from '../../components/motion.js'
import { PhraseFeedback } from './PhraseFeedback.jsx'

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
  streaming,
  error,
  onSubmit,
  onRetry,
  onNext,
}) {
  const [hintOpen, setHintOpen] = useState(false)
  const inputRef = useRef(null)
  const isStreaming = Boolean(streaming || (card && card.streaming))
  const canSubmit = !busy && !isStreaming && Boolean(card && card.id) && Boolean(answer.trim())
  const cardKey = card ? card.turnKey || card.id : ''

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
  }, [answer, cardKey, feedback, syncInputHeight])

  useEffect(() => {
    const el = inputRef.current
    if (!el || typeof ResizeObserver !== 'function') return undefined
    const ro = new ResizeObserver(syncInputHeight)
    ro.observe(el)
    return () => ro.disconnect()
  }, [cardKey, feedback, syncInputHeight])

  // Focus and select the previous draft when returning from “再试一次”.
  useEffect(() => {
    if (!retryFocusTick || feedback || !card) return undefined
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

  if (feedback) {
    return (
      <PhraseFeedback
        card={card}
        answer={answer}
        submittedAnswer={submittedAnswer}
        feedback={feedback}
        attempt={attempt}
        prevScore={prevScore}
        busy={busy}
        onRetry={onRetry}
        onNext={onNext}
      />
    )
  }

  if (!card) {
    if (error) {
      return (
        <div>
          <div className="eg-err">{error}</div>
          <div className="eg-foot">
            <button className="eg-btn primary" onClick={onNext} disabled={busy || streaming}>
              重试
            </button>
          </div>
        </div>
      )
    }
    return (
      <div className="eg-loading is-stage">
        <span className="eg-spin" />
        正在出题…
      </div>
    )
  }

  return (
    <div className="eg-drill-stage">
      <div className="eg-cap eg-cap-row">
        <span>把这句话译成英文</span>
        {isStreaming ? (
          <span className="eg-stream-pill">{card.stage === 'thinking' ? '思考中…' : '出题中…'}</span>
        ) : null}
        {card.source === 'session' ? (
          <span className="eg-source-pill" title="根据当前会话内容生成">
            结合当前会话
          </span>
        ) : null}
        {attempt > 0 ? <span className="eg-attempt-pill">{'第 ' + (attempt + 1) + ' 次尝试'}</span> : null}
      </div>
      <div className={'eg-zh' + (isStreaming && !card.zh ? ' is-pending' : '')} aria-busy={isStreaming ? 'true' : undefined}>
        {card.zh || (card.stage === 'thinking' ? '正在构思短语…' : '正在生成短语…')}
        {isStreaming && !card.zhDone ? <span className="eg-stream-caret" aria-hidden="true" /> : null}
      </div>
      {card.hint ? (
        <>
          <button
            className="eg-hintbtn"
            aria-expanded={hintOpen ? 'true' : 'false'}
            onClick={() => setHintOpen((v) => !v)}
            type="button"
          >
            <span className="caret" aria-hidden="true">
              ▸
            </span>
            提示
          </button>
          <div
            className={'eg-collapse eg-hint-collapse' + (hintOpen ? ' open' : '')}
            aria-hidden={hintOpen ? 'false' : 'true'}
          >
            <div className="eg-collapse-inner">
              <div className="eg-hintbox">{card.hint}</div>
            </div>
          </div>
        </>
      ) : null}
      <div className="eg-inputwrap">
        <textarea
          ref={inputRef}
          rows={1}
          className={'eg-input' + (error ? ' error' : '')}
          value={answer}
          placeholder="在这里写下你的英文…"
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229 || e.altKey) return
            if (e.shiftKey) return
            e.preventDefault()
            if (canSubmit) onSubmit()
          }}
        />
      </div>
      {error ? <div className="eg-err">{error}</div> : null}
      <div className="eg-foot">
        <button
          className={'eg-btn primary' + (busy ? ' is-loading' : '')}
          onClick={onSubmit}
          onPointerDown={bounceButton}
          disabled={!canSubmit}
        >
          提交
        </button>
        <button className="eg-btn" onClick={onNext} disabled={busy}>
          换一题
        </button>
        <span className="eg-kbd" title="回车提交（Shift + Enter 换行）">
          <kbd>↵</kbd>
        </span>
      </div>
    </div>
  )
}
