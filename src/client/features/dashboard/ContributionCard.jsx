import React, { useEffect, useRef, useState } from 'react'

const DOW_LABELS = ['', '一', '', '三', '', '五', '']
const useIsoLayoutEffect = React.useLayoutEffect || useEffect

export function ContributionCard({ range, rangeLabel, grid, onSelectDay }) {
  const [tip, setTip] = useState(null)
  const cardRef = useRef(null)
  const scrollRef = useRef(null)

  useIsoLayoutEffect(() => {
    setTip(null)
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [range, grid])

  const showTip = (e, cell) => {
    const cardEl = cardRef.current
    const cellEl = e.currentTarget
    if (!cardEl || !cellEl) return
    const cardRect = cardEl.getBoundingClientRect()
    const cellRect = cellEl.getBoundingClientRect()
    const rawX = cellRect.left - cardRect.left + cellRect.width / 2
    const pad = Math.min(82, Math.max(40, cardRect.width * 0.24))
    const x = Math.round(Math.max(pad, Math.min(Math.max(pad, cardRect.width - pad), rawX)))
    const y = Math.round(cellRect.top - cardRect.top)
    setTip({ x, y, cell })
  }

  const hideTip = () => setTip(null)

  const tipCell = tip ? tip.cell : null
  const tipAct = tipCell && tipCell.activity
  const tipText = tipCell
    ? tipAct
      ? tipCell.key + ' · 单词 ' + tipAct.words + ' · 句子 ' + tipAct.phrases
      : tipCell.key + ' · 无学习记录'
    : ''

  return (
    <div className="eg-cal-card" ref={cardRef} data-nodrag="true">
      <div className="eg-gh-head">{rangeLabel + '共完成 ' + grid.rangeTotal + ' 项练习 · ' + grid.rangeDays + ' 天'}</div>
      <div className="eg-gh-wrap">
        <div className="eg-gh-dows" aria-hidden="true">
          {DOW_LABELS.map((lbl, i) => (
            <span key={i}>{lbl}</span>
          ))}
        </div>
        <div className="eg-gh-scroll" ref={scrollRef}>
          <div className="eg-gh-inner">
            <div className="eg-gh-months" style={{ width: grid.weeks.length * 11 - 2 + 'px' }}>
              {grid.monthLabels.map((m) => (
                <span key={m.col} className="eg-gh-month" style={{ left: m.col * 11 + 'px' }}>
                  {m.label}
                </span>
              ))}
            </div>
            <div className="eg-gh-grid" role="grid" aria-label={rangeLabel + '学习热力图'}>
              {grid.weeks.map((week, ci) => (
                <div className="eg-gh-col" key={ci}>
                  {week.map((cell, ri) => {
                    if (cell.out) {
                      return <span className="eg-gh-cell out" key={ri} aria-hidden="true" />
                    }
                    const has = Boolean(cell.activity && cell.activity.total > 0)
                    const cls = ['eg-gh-cell', 'l' + cell.level]
                    if (has) cls.push('has')
                    if (cell.isToday) cls.push('today')
                    return (
                      <button
                        key={cell.key}
                        type="button"
                        className={cls.join(' ')}
                        aria-label={
                          cell.activity
                            ? cell.key + ' 单词 ' + cell.activity.words + ' 句子 ' + cell.activity.phrases
                            : cell.key + ' 无学习记录'
                        }
                        onMouseEnter={(e) => showTip(e, cell)}
                        onMouseLeave={hideTip}
                        onFocus={(e) => showTip(e, cell)}
                        onBlur={hideTip}
                        onClick={has ? () => onSelectDay(cell.key) : undefined}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="eg-gh-foot">
        <span className="eg-gh-hint">点击绿色方块定位当日记录</span>
        <div className="eg-dash-legend">
          少
          <i className="l0" />
          <i className="l1" />
          <i className="l2" />
          <i className="l3" />
          <i className="l4" />
          多
        </div>
      </div>
      {tip ? (
        <div className="eg-gh-tip" role="tooltip" style={{ left: tip.x + 'px', top: tip.y + 'px' }}>
          {tipText}
        </div>
      ) : null}
    </div>
  )
}
