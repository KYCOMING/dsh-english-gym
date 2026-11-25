import React, { useEffect, useState } from 'react'
import { bounceButton } from '../../components/motion.js'

export function Report({ report, loading, error, onRefresh }) {
  const [openMap, setOpenMap] = useState({})
  useEffect(() => {
    setOpenMap({})
  }, [report])

  if (loading && !report) {
    return React.createElement(
      'div',
      { className: 'eg-loading is-stage' },
      React.createElement('span', { className: 'eg-spin' }),
      '正在生成今日报告…',
    )
  }
  if (!report) {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'eg-loading' },
        error ? React.createElement('span', { className: 'eg-err' }, error) : '暂无报告。',
      ),
      React.createElement(
        'div',
        { className: 'eg-actions' },
        React.createElement('button', { className: 'eg-btn primary', onClick: onRefresh }, '生成今日报告'),
      ),
    )
  }
  const paragraphs = String(report.body || '').split(/\n{2,}/).filter(Boolean)
  const questions = report.questions || []
  const wordCount = (String(report.body || '').match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length
  const meta = [report.date, report.level, wordCount ? wordCount + ' 词' : ''].filter(Boolean).join(' · ')
  return React.createElement(
    'div',
    { className: 'eg-report', 'data-nodrag': 'true' },
    React.createElement('div', { className: 'r-top' }, React.createElement('h2', { className: 'eg-rtitle' }, report.title || 'Daily Report')),
    React.createElement(
      'div',
      { className: 'eg-rmeta-row' },
      meta ? React.createElement('div', { className: 'eg-rmeta' }, meta) : React.createElement('span', null),
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'eg-rrefresh',
          onClick: onRefresh,
          disabled: loading,
          title: '重新生成一篇今日报告',
        },
        loading ? '生成中…' : '↻ 换一篇',
      ),
    ),
    report.summary_zh ? React.createElement('p', { className: 'eg-rsum' }, report.summary_zh) : null,
    paragraphs.map((p, i) => React.createElement('p', { key: i, className: 'eg-rp' }, p)),
    questions.length
      ? React.createElement(
          'div',
          { className: 'eg-practice' },
          React.createElement('div', { className: 'eg-ptitle' }, '练一练'),
          questions.map((q, i) => {
            const isOpen = !!openMap[i]
            return React.createElement(
              'div',
              { key: i, className: 'eg-q' + (isOpen ? ' reveal' : '') },
              React.createElement(
                'div',
                { className: 'eg-q-head' },
                React.createElement('span', { className: 'eg-q-n' }, String(i + 1)),
                React.createElement('span', { className: 'eg-q-zh' }, q.zh),
              ),
              React.createElement(
                'button',
                {
                  className: 'eg-q-toggle',
                  type: 'button',
                  'aria-expanded': isOpen ? 'true' : 'false',
                  onClick: () => setOpenMap((prev) => ({ ...prev, [i]: !prev[i] })),
                },
                React.createElement('span', { className: 'caret', 'aria-hidden': 'true' }, '▸'),
                isOpen ? '收起参考' : '看参考',
              ),
              React.createElement(
                'div',
                { className: 'eg-collapse' + (isOpen ? ' open' : ''), 'aria-hidden': isOpen ? 'false' : 'true' },
                React.createElement(
                  'div',
                  { className: 'eg-collapse-inner' },
                  React.createElement('div', { className: 'eg-q-en' }, q.en),
                ),
              ),
            )
          }),
        )
      : null,
    React.createElement(
      'div',
      { className: 'eg-report-foot' },
      React.createElement('span', { className: 'eg-report-foot-hint' }, '按当前内容方向生成，可随时换一篇'),
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'eg-btn',
          onClick: onRefresh,
          onPointerDown: bounceButton,
          disabled: loading,
        },
        loading ? '生成中…' : '↻ 换一篇',
      ),
    ),
  )
}
