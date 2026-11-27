import React from 'react'
import { shortBankName } from './useSettings.js'

export function WordBankSection({
  activeBankId,
  activeBankObj,
  builtinBanks,
  customBanks,
  bankNotice,
  onChooseBank,
  onRemoveBank,
  onStartImport,
}) {
  return (
    <div className="eg-setting-section">
      <div className="eg-section-head">
        <div className="eg-section-label">单词词库</div>
        {activeBankObj ? (
          <div className="eg-active-badge" title={'当前词库：' + activeBankObj.name}>
            <span>{shortBankName(activeBankObj.name) + ' · ' + activeBankObj.count + ' 词'}</span>
          </div>
        ) : null}
      </div>
      <div className="eg-setting-card">
        <div className="eg-setting-row">
          <div className="eg-setting-desc eg-lead">选择单词训练与词库关联使用的词库；记忆进度跨词库通用。</div>
          {builtinBanks.length ? (
            <div className="eg-bank-list">
              {builtinBanks.map((b) => (
                <button
                  type="button"
                  key={b.id}
                  className={'eg-bank-item' + (b.id === activeBankId ? ' active' : '')}
                  aria-pressed={b.id === activeBankId ? 'true' : 'false'}
                  title={b.name + '（' + b.count + ' 词）'}
                  onClick={() => onChooseBank(b.id)}
                >
                  <span className="eg-bank-name">{shortBankName(b.name)}</span>
                  <span className="eg-bank-cnt">{b.count + ' 词'}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="eg-setting-row">
          <div className="eg-custom-head">
            <div className="eg-sub-title">自定义词库</div>
            <button type="button" className="eg-bankbtn" onClick={onStartImport}>
              + 导入词库
            </button>
          </div>
          <div className="eg-setting-desc">支持导入 CSV / TSV / TXT / JSON 词表，导入后自动切换，不影响内置词库。</div>
          {bankNotice ? <div className="eg-notice eg-bank-notice">{bankNotice}</div> : null}
          {customBanks.length ? (
            <div className="eg-custom-chips">
              {customBanks.map((b) => (
                <div className={'eg-custom-chip' + (b.id === activeBankId ? ' active' : '')} key={b.id}>
                  <button
                    type="button"
                    className="eg-custom-select"
                    aria-pressed={b.id === activeBankId ? 'true' : 'false'}
                    title={b.name + '（' + b.count + ' 词）'}
                    onClick={() => onChooseBank(b.id)}
                  >
                    {b.name + '（' + b.count + '）'}
                  </button>
                  <button
                    type="button"
                    className="eg-custom-remove"
                    title="删除词库"
                    aria-label={'删除 ' + b.name}
                    onClick={() => onRemoveBank(b.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
