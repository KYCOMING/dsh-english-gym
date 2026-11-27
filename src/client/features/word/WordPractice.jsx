import React from 'react'
import { formatMeaning, formatPos } from '../../core/text.js'
import { bounceButton } from '../../components/motion.js'
import { ExampleBlock } from './ExampleBlock.jsx'
import { memoryLabel, memoryTooltip } from './srsFormat.js'
import { useWordPractice } from './useWordPractice.js'
import { WordTopBar } from './WordTopBar.jsx'
import { LetterGrid } from './LetterGrid.jsx'
import { WordFeedback } from './WordFeedback.jsx'

// Static word bank drill: FSRS-6 SRS + Chinese gloss + one underline per letter.
export function WordPractice({ bankRev = 0 } = {}) {
  const {
    item,
    cells,
    res,
    revealed,
    busy,
    rateBusy,
    error,
    mode,
    refs,
    liveStats,
    dueCount,
    learningCount,
    masteredCount,
    bankLabel,
    load,
    rate,
    switchMode,
    submit,
    markMastered,
    retry,
    toggleReveal,
    setCell,
    onKey,
  } = useWordPractice({ bankRev })

  const topBar = (
    <WordTopBar
      mode={mode}
      dueCount={dueCount}
      busy={busy}
      liveStats={liveStats}
      learningCount={learningCount}
      masteredCount={masteredCount}
      bankLabel={bankLabel}
      onSwitchMode={switchMode}
    />
  )

  if (!item) {
    return (
      <div className="eg-word">
        {topBar}
        <div className="eg-word-main">
          {error ? (
            <div className="eg-err">{error}</div>
          ) : (
            <div className="eg-loading">
              <span className="eg-spin" />
              正在取词…
            </div>
          )}
          {error ? (
            <div className="eg-foot">
              <button className="eg-btn primary" onClick={() => load()} disabled={busy}>
                重试
              </button>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  if (item.done) {
    return (
      <div className="eg-word">
        {topBar}
        <div className="eg-word-main">
          <div className="eg-srs-done">
            <div className="eg-srs-done-title">到期单词已全部复习完成</div>
            <div className="eg-srs-done-sub">
              {(bankLabel ? bankLabel + '：' : '当前词库：') + '学习中 ' + learningCount + ' 词 · 已掌握 ' + masteredCount + ' 词'}
            </div>
            <button type="button" className="eg-btn primary" disabled={busy} onClick={() => switchMode('smart')}>
              切回智能模式继续学习
            </button>
          </div>
        </div>
      </div>
    )
  }

  const answered = !!res
  const ok = answered && !!res.correct
  const srsInfo = item.srs || null
  const activeSrs = (res && res.srs) || srsInfo
  const srsFam = activeSrs ? Number(activeSrs.familiarity) || 0 : 0
  const srsMaxFam = (activeSrs && Number(activeSrs.maxFamiliarity)) || 5
  const showDots = srsInfo && srsInfo.kind !== 'new' && srsFam > 0
  const cleanMeaning = formatMeaning(item.zh)
  const meaningClass = 'eg-zh' + (cleanMeaning.length > 28 ? ' is-xlong' : cleanMeaning.length > 16 ? ' is-long' : '')

  const footerActions = answered ? (
    <div className="eg-word-foot">
      {ok ? (
        <>
          <button
            className="eg-btn primary"
            onClick={() => load()}
            disabled={busy}
            title="回车继续"
            aria-keyshortcuts="Enter"
          >
            下一个
          </button>
          {!(res.srs && res.srs.mastered) ? (
            <button className="eg-btn" onClick={markMastered} disabled={busy} title="太简单，直接标为已掌握">
              已掌握
            </button>
          ) : null}
        </>
      ) : (
        <>
          <button className="eg-btn primary" onClick={retry} disabled={busy}>
            再试一次
          </button>
          <button
            className="eg-btn"
            onClick={toggleReveal}
            disabled={busy}
            aria-expanded={revealed ? 'true' : 'false'}
          >
            {revealed ? '收起答案' : '显示答案'}
          </button>
          <button className="eg-btn" onClick={() => load()} disabled={busy}>
            下一个
          </button>
        </>
      )}
    </div>
  ) : (
    <div className="eg-word-foot">
      <button
        className={'eg-btn primary' + (busy ? ' is-loading' : '')}
        onClick={submit}
        onPointerDown={bounceButton}
        disabled={busy || cells.some((c) => !c)}
      >
        提交
      </button>
      <button className="eg-btn" onClick={() => load()} disabled={busy}>
        换一个
      </button>
      <button className="eg-btn" onClick={markMastered} disabled={busy} title="太简单，直接标为已掌握">
        已掌握
      </button>
      <span className="eg-kbd" title="回车提交">
        <kbd>↵</kbd>
      </span>
    </div>
  )

  return (
    <div className="eg-word">
      {topBar}
      <div className="eg-word-main">
        <div className="eg-word-stage" key={item.id}>
          <div className="eg-word-meta">
            {item.pos ? (
              <span className="eg-pos-text" title="词性提示">
                {formatPos(item.pos)}
              </span>
            ) : null}
            {item.pos ? (
              <span className="eg-meta-sep" aria-hidden="true">
                ·
              </span>
            ) : null}
            <span
              className={'eg-srs-tag' + (srsInfo && srsInfo.kind === 'review' ? ' is-review' : '')}
              title={memoryTooltip(srsInfo)}
            >
              {memoryLabel(srsInfo)}
              {showDots ? (
                <span className="eg-srs-dots" aria-hidden="true">
                  {Array.from({ length: srsMaxFam }, (_, idx) => (
                    <i key={idx} className={'eg-srs-dot' + (idx < srsFam ? ' on' : '')} />
                  ))}
                </span>
              ) : null}
              {srsInfo && srsInfo.isHardWord ? (
                <span className="eg-srs-hard" title="高难度或多次遗忘词汇">
                  易错
                </span>
              ) : null}
            </span>
          </div>
          <div className={meaningClass}>{cleanMeaning}</div>
          {!answered ? <ExampleBlock example={item.example} /> : null}
          <LetterGrid
            cells={cells}
            answered={answered}
            ok={ok}
            reference={res && res.reference}
            busy={busy}
            inputRefs={refs}
            onSetCell={setCell}
            onKey={onKey}
          />
          {error ? <div className="eg-err">{error}</div> : null}
          <WordFeedback res={res} revealed={revealed} busy={busy} rateBusy={rateBusy} onRate={rate} />
        </div>
      </div>
      {footerActions}
    </div>
  )
}
