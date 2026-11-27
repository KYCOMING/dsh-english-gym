import React, { useState } from 'react'
import { WordBankImport } from '../word/WordBankImport.jsx'
import { useSettings } from './useSettings.js'
import { PracticePrefsSection } from './PracticePrefsSection.jsx'
import { WordBankSection } from './WordBankSection.jsx'
import { ChoiceCardSection } from './ChoiceCardSection.jsx'
import { DirectionSection } from './DirectionSection.jsx'
import { DataCleanupSection } from './DataCleanupSection.jsx'

// Settings tab: celebration toggle + session/bank links + word bank + FSRS retention + report level + content directions + data cleanup.
export function SettingsPanel({ onTopicChange, onPhraseConfigChange, onReportConfigChange, onWordBankChange, onDataCleared }) {
  const [importing, setImporting] = useState(false)
  const {
    data,
    loading,
    error,
    setError,
    settings,
    directions,
    levels,
    retentions,
    reasoningEfforts,
    customTopics,
    activeId,
    activeLevel,
    activeRetention,
    activeReasoningEffort,
    activeBankId,
    builtinBanks,
    customBanks,
    activeBankObj,
    bankNotice,
    setBankNotice,
    save,
    chooseDirection,
    chooseReportLevel,
    chooseRetention,
    chooseReasoningEffort,
    addCustom,
    removeCustom,
    setRetries,
    chooseBank,
    removeBank,
    handleBankImported,
  } = useSettings({ onTopicChange, onPhraseConfigChange, onReportConfigChange, onWordBankChange })

  if (loading && !data) {
    return (
      <div className="eg-settings">
        <div className="eg-settings-loading">
          <span className="eg-spin" />
          正在加载设置…
        </div>
        {error ? <div className="eg-settings-error">{error}</div> : null}
      </div>
    )
  }

  if (importing) {
    return (
      <WordBankImport
        onClose={() => setImporting(false)}
        onImported={(res) => {
          setImporting(false)
          return handleBankImported(res)
        }}
      />
    )
  }

  const builtinDirections = directions.filter((item) => item.builtin !== false)
  const customDirections = directions.filter((item) => item.builtin === false)
  const activeDirection = directions.find((item) => item.id === activeId)
  const fallbackLevel = levels[2] || { id: activeLevel, label: activeLevel, desc: '', detail: '' }
  const fallbackRetention =
    retentions.find((item) => item.id === 0.9) ||
    { id: activeRetention, label: Math.round(activeRetention * 100) + '%', desc: '自定义', detail: '目标记忆保留率越高，复习安排越紧密。' }

  return (
    <div className="eg-settings">
      <PracticePrefsSection
        settings={settings}
        reasoningEfforts={reasoningEfforts}
        activeReasoningEffort={activeReasoningEffort}
        onSave={save}
        onSetRetries={setRetries}
        onChooseReasoningEffort={chooseReasoningEffort}
      />
      <WordBankSection
        activeBankId={activeBankId}
        activeBankObj={activeBankObj}
        builtinBanks={builtinBanks}
        customBanks={customBanks}
        bankNotice={bankNotice}
        onChooseBank={chooseBank}
        onRemoveBank={removeBank}
        onStartImport={() => {
          setBankNotice('')
          setImporting(true)
        }}
      />
      <ChoiceCardSection
        title="记忆调度（FSRS）"
        badgePrefix="目标记住率"
        lead="设置单词训练的目标记忆保留率；数值越高，系统会在遗忘前更早安排复习（修改后对后续复习生效）。"
        listClassName="eg-retention-list"
        items={retentions}
        activeId={activeRetention}
        fallbackActiveItem={fallbackRetention}
        onSelect={chooseRetention}
      />
      <ChoiceCardSection
        title="文章难度"
        badgePrefix="当前难度"
        lead="控制今日文章的词汇与句式难度（CEFR）；切换后下次进入或换一篇生效。"
        listClassName="eg-level-list"
        items={levels}
        activeId={activeLevel}
        fallbackActiveItem={fallbackLevel}
        onSelect={chooseReportLevel}
      />
      <DirectionSection
        sessionLink={settings.sessionLink}
        activeId={activeId}
        activeDirection={activeDirection}
        builtinDirections={builtinDirections}
        customDirections={customDirections}
        customTopicsCount={customTopics.length}
        onChooseDirection={chooseDirection}
        onAddCustom={addCustom}
        onRemoveCustom={removeCustom}
      />
      <DataCleanupSection onDataCleared={onDataCleared} onError={setError} />
      {error ? <div className="eg-settings-error">{error}</div> : null}
    </div>
  )
}
