import React, { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../../components/motion.js'

export const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const WORD_LIMIT = 5
const PHRASE_LIMIT = 3

export function DailyHistoryList({
  pageRecords,
  totalFilteredCount,
  safePage,
  totalPages,
  pageItems,
  flashDay,
  histHeadRef,
  onGoPage,
}) {
  const [expanded, setExpanded] = useState({})
  const closeTimersRef = useRef({})

  useEffect(() => {
    return () => {
      const timers = closeTimersRef.current
      for (const k of Object.keys(timers)) clearTimeout(timers[k])
    }
  }, [])

  const toggleGroup = (key, extraCount = 0) => {
    const timers = closeTimersRef.current
    if (timers[key]) {
      clearTimeout(timers[key])
      delete timers[key]
    }
    if (expanded[key] === 'open') {
      if (prefersReducedMotion()) {
        setExpanded((prev) => {
          const next = { ...prev }
          delete next[key]
          return next
        })
        return
      }
      setExpanded((prev) => ({ ...prev, [key]: 'closing' }))
      const delay = Math.min(260, 150 + Math.min(extraCount, 8) * 14 + 20)
      timers[key] = setTimeout(() => {
        delete timers[key]
        setExpanded((prev) => {
          if (prev[key] !== 'closing') return prev
          const next = { ...prev }
          delete next[key]
          return next
        })
      }, delay)
    } else {
      setExpanded((prev) => ({ ...prev, [key]: 'open' }))
    }
  }

  const renderWordChip = (w, key, animCls, animStyle) => (
    <span className={'eg-wchip ' + (w.ok ? 'ok' : 'bad') + animCls} style={animStyle} key={key} title={w.ok ? '拼对了' : '没拼对'}>
      <span className="w">{w.en}</span>
      {w.zh ? <span className="m">{w.zh}</span> : null}
    </span>
  )

  const renderPhraseRow = (p, key, animCls, animStyle) => (
    <div className={'eg-sent ' + (p.ok ? 'ok' : 'bad') + animCls} style={animStyle} key={key}>
      <span className="mark">{p.ok ? '✓' : '✗'}</span>
      <div className="body">
        <div className="zh">{p.zh}</div>
        {p.en ? <div className="en">{p.en}</div> : null}
      </div>
    </div>
  )

  const renderMoreBtn = (key, total, limit, state) =>
    total > limit ? (
      <button
        className="eg-more"
        key="more"
        aria-expanded={state === 'open' ? 'true' : 'false'}
        onClick={() => toggleGroup(key, total - limit)}
      >
        {state === 'open' ? '收起' : '展开全部 · 共 ' + total + ' 条'}
      </button>
    ) : null

  return (
    <div>
      <div className="eg-hist-bar" ref={histHeadRef}>
        <div className="eg-hist-title">每日学习记录</div>
        <div className="eg-hist-meta">
          {'共 ' + totalFilteredCount + ' 天' + (totalPages > 1 ? ' · 第 ' + safePage + ' / ' + totalPages + ' 页' : '')}
        </div>
      </div>
      <div className="eg-hist">
        {pageRecords.map((rec) => {
          const dt = new Date(rec.day + 'T00:00:00')
          const wd = WEEKDAYS[dt.getDay()]
          const t = rec.totals || {}
          const allWords = rec.words || []
          const allPhrases = rec.phrases || []
          const wKey = rec.day + ':w'
          const pKey = rec.day + ':p'
          const wState = expanded[wKey]
          const pState = expanded[pKey]
          const headWords = allWords.slice(0, WORD_LIMIT)
          const extraWords = allWords.slice(WORD_LIMIT)
          const headPhrases = allPhrases.slice(0, PHRASE_LIMIT)
          const extraPhrases = allPhrases.slice(PHRASE_LIMIT)

          return (
            <div className={'eg-hist-day' + (flashDay === rec.day ? ' is-flash' : '')} id={'eg-hist-' + rec.day} key={rec.day}>
              <div className="eg-hist-head">
                <div className="eg-hist-date">
                  {dt.getMonth() + 1 + '月' + dt.getDate() + '日'}
                  <span className="wd">{'周' + wd}</span>
                </div>
                <div className="eg-hist-count">{'单词 ' + (t.words || 0) + ' · 句子 ' + (t.phrases || 0)}</div>
              </div>
              {allWords.length ? (
                <div>
                  <div className="eg-hist-sub">单词</div>
                  <div className="eg-wchips">{headWords.map((w, i) => renderWordChip(w, 'w' + i, '', undefined))}</div>
                  {extraWords.length && (wState === 'open' || wState === 'closing') ? (
                    <div
                      className={'eg-extra-collapse' + (wState === 'open' ? ' open' : '')}
                      aria-hidden={wState === 'open' ? 'false' : 'true'}
                    >
                      <div className="eg-extra-inner">
                        <div className="eg-wchips eg-extra-wchips">
                          {extraWords.map((w, idx) => {
                            const animCls = wState === 'open' ? ' is-enter' : ' is-leave'
                            const animStyle =
                              wState === 'open'
                                ? { '--i': Math.min(idx, 18) }
                                : { '--ri': Math.min(extraWords.length - 1 - idx, 8) }
                            return renderWordChip(w, 'we' + idx, animCls, animStyle)
                          })}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {renderMoreBtn(wKey, allWords.length, WORD_LIMIT, wState)}
                </div>
              ) : null}
              {allPhrases.length ? (
                <div>
                  <div className="eg-hist-sub">句子</div>
                  <div className="eg-sents">{headPhrases.map((p, i) => renderPhraseRow(p, 'p' + i, '', undefined))}</div>
                  {extraPhrases.length && (pState === 'open' || pState === 'closing') ? (
                    <div
                      className={'eg-extra-collapse' + (pState === 'open' ? ' open' : '')}
                      aria-hidden={pState === 'open' ? 'false' : 'true'}
                    >
                      <div className="eg-extra-inner">
                        <div className="eg-sents eg-extra-sents">
                          {extraPhrases.map((p, idx) => {
                            const animCls = pState === 'open' ? ' is-enter' : ' is-leave'
                            const animStyle =
                              pState === 'open'
                                ? { '--i': Math.min(idx, 12) }
                                : { '--ri': Math.min(extraPhrases.length - 1 - idx, 8) }
                            return renderPhraseRow(p, 'pe' + idx, animCls, animStyle)
                          })}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {renderMoreBtn(pKey, allPhrases.length, PHRASE_LIMIT, pState)}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
      {totalPages > 1 ? (
        <div className="eg-pager" role="navigation" aria-label="学习记录分页">
          <button type="button" className="eg-pagebtn" disabled={safePage <= 1} onClick={() => onGoPage(safePage - 1)}>
            ‹ 上一页
          </button>
          {pageItems.map((it, i) =>
            it === '...' ? (
              <span className="eg-page-dots" key={'dots-' + i}>
                …
              </span>
            ) : (
              <button
                type="button"
                key={it}
                className={'eg-pagebtn' + (it === safePage ? ' active' : '')}
                aria-current={it === safePage ? 'page' : undefined}
                onClick={() => onGoPage(it)}
              >
                {String(it)}
              </button>
            ),
          )}
          <button
            type="button"
            className="eg-pagebtn"
            disabled={safePage >= totalPages}
            onClick={() => onGoPage(safePage + 1)}
          >
            下一页 ›
          </button>
        </div>
      ) : null}
    </div>
  )
}
