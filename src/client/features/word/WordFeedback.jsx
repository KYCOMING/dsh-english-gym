import React from 'react'
import { ExampleBlock } from './ExampleBlock.jsx'
import { FSRS_RATINGS } from './srsFormat.js'

function PhoneticRow({ uk, us, phonetic }) {
  if (!uk && !us && !phonetic) return null
  if (uk || us) {
    return (
      <div className="eg-phonetics" aria-label="英美音标">
        {uk ? (
          <span className="eg-phonetic">
            <span className="eg-phonetic-tag">英</span>
            <span className="eg-phonetic-ipa">{'/' + uk + '/'}</span>
          </span>
        ) : null}
        {us ? (
          <span className="eg-phonetic">
            <span className="eg-phonetic-tag">美</span>
            <span className="eg-phonetic-ipa">{'/' + us + '/'}</span>
          </span>
        ) : null}
      </div>
    )
  }
  return (
    <div className="eg-phonetics" aria-label="音标">
      <span className="eg-phonetic">
        <span className="eg-phonetic-ipa">{'/' + phonetic + '/'}</span>
      </span>
    </div>
  )
}

export function WordFeedback({ res, revealed, busy, rateBusy, onRate }) {
  if (!res) return null

  if (res.correct) {
    return (
      <div className="eg-fb ok">
        <div className="eg-fb-top">
          <span className="eg-fb-status">拼对了</span>
          {res.srs && res.srs.nextReviewText ? <span className="eg-srs-next">{res.srs.nextReviewText}</span> : null}
        </div>
        {res.srs && res.srs.canRate && res.srs.ratingPreviews ? (
          <div className="eg-fsrs-rate" role="group" aria-label="记忆体感评分（快捷键 1 / 2 / 3）">
            <span className="eg-fsrs-rate-lbl">记忆体感</span>
            <div className="eg-fsrs-rate-btns">
              {FSRS_RATINGS.map((opt) => {
                const preview = res.srs.ratingPreviews[opt.key]
                if (!preview) return null
                const active = res.srs.rating === opt.rating
                return (
                  <button
                    key={opt.key}
                    type="button"
                    className={'eg-fsrs-btn' + (active ? ' active' : '')}
                    aria-pressed={active ? 'true' : 'false'}
                    disabled={busy || rateBusy}
                    title={'快捷键 ' + opt.keyHint + '：' + opt.label + '（' + preview.text + '）'}
                    onClick={() => onRate(opt.rating)}
                  >
                    <kbd className="eg-fsrs-key">{opt.keyHint}</kbd>
                    <span className="eg-fsrs-lbl">{opt.label}</span>
                    <span className="eg-fsrs-iv">{preview.text}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
        {res.reference && /[^a-zA-Z]/.test(res.reference) ? (
          <div className="eg-fb-ref">
            <span className="lbl">正确拼写</span>
            {res.reference}
          </div>
        ) : null}
        <PhoneticRow uk={res.uk} us={res.us} phonetic={res.phonetic} />
        <ExampleBlock example={res.example} exampleZh={res.exampleZh} word={res.reference} highlight={true} />
      </div>
    )
  }

  return (
    <div className="eg-fb bad">
      <div className={'eg-collapse eg-word-miss-wrap' + (!revealed ? ' open' : '')} aria-hidden={revealed ? 'true' : 'false'}>
        <div className="eg-collapse-inner">
          <div className="eg-word-miss">
            {'拼写有误，可再试一次或查看答案 · ' + ((res.srs && res.srs.nextReviewText) || '5 分钟后再次巩固')}
          </div>
        </div>
      </div>
      <div className={'eg-collapse eg-word-reveal' + (revealed ? ' open' : '')} aria-hidden={revealed ? 'false' : 'true'}>
        <div className="eg-collapse-inner">
          <div className="eg-fb-ref">
            <span className="lbl">正确拼写</span>
            {res.reference}
          </div>
          <PhoneticRow uk={res.uk} us={res.us} phonetic={res.phonetic} />
          <ExampleBlock example={res.example} exampleZh={res.exampleZh} word={res.reference} highlight={true} />
        </div>
      </div>
    </div>
  )
}
