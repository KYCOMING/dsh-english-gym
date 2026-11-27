import React, { useEffect, useState } from 'react'

export function ReportPractice({ report, questions }) {
  const [openMap, setOpenMap] = useState({})

  useEffect(() => {
    setOpenMap({})
  }, [report])

  if (!questions.length) return null

  return (
    <div className="eg-practice">
      <div className="eg-ptitle">练一练</div>
      {questions.map((q, i) => {
        const isOpen = !!openMap[i]
        return (
          <div key={i} className={'eg-q' + (isOpen ? ' reveal' : '')}>
            <div className="eg-q-head">
              <span className="eg-q-n">{String(i + 1)}</span>
              <span className="eg-q-zh">{q.zh}</span>
            </div>
            <button
              className="eg-q-toggle"
              type="button"
              aria-expanded={isOpen ? 'true' : 'false'}
              onClick={() => setOpenMap((prev) => ({ ...prev, [i]: !prev[i] }))}
            >
              <span className="caret" aria-hidden="true">
                ▸
              </span>
              {isOpen ? '收起参考' : '看参考'}
            </button>
            <div className={'eg-collapse' + (isOpen ? ' open' : '')} aria-hidden={isOpen ? 'false' : 'true'}>
              <div className="eg-collapse-inner">
                <div className="eg-q-en">{q.en}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
