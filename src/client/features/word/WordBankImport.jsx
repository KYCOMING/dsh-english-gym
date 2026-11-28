import React, { useCallback, useRef, useState } from 'react'
import { api } from '../../core/api.js'
import { store } from '../../core/store.js'

// Import a user word bank: file picker / drag-and-drop / paste, with a
// server-side parse preview (same parser as the real import).
export function WordBankImport({ onClose, onImported }) {
  const [name, setName] = useState('')
  const [filename, setFilename] = useState('')
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [over, setOver] = useState(false)
  const fileRef = useRef(null)

  const readFile = useCallback(async (file) => {
    if (!file) return
    setError('')
    try {
      const buf = await file.arrayBuffer()
      let text = ''
      try {
        text = new TextDecoder('utf-8', { fatal: true }).decode(buf)
      } catch {
        text = new TextDecoder('gbk').decode(buf)
      }
      setContent(text)
      setFilename(file.name || '')
      setName((prev) => prev || String(file.name || '').replace(/\.[^.]+$/, '').slice(0, 60))
      setPreview(null)
    } catch (e) {
      setError('读取文件失败：' + (e.message || e))
    }
  }, [])

  const doPreview = useCallback(async () => {
    if (!content.trim() || busy) return
    setBusy(true)
    setError('')
    try {
      setPreview(await api('/wordbanks/preview', { method: 'POST', body: JSON.stringify({ content, filename }) }))
    } catch (e) {
      setError(e.message || '解析失败')
    } finally {
      setBusy(false)
    }
  }, [content, filename, busy])

  const doImport = useCallback(async () => {
    if (!preview || !preview.valid || busy) return
    setBusy(true)
    setError('')
    try {
      const res = await api('/wordbanks/import', { method: 'POST', body: JSON.stringify({ name, filename, content }) })
      if (res.summary) store.setStats(res.summary)
      onImported(res)
    } catch (e) {
      setError(e.message || '导入失败')
    } finally {
      setBusy(false)
    }
  }, [preview, busy, name, filename, content, onImported])

  const onDrop = (e) => {
    e.preventDefault()
    setOver(false)
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]
    if (file) readFile(file)
  }

  return (
    <div className="eg-import" data-nodrag="true">
      <div className="eg-import-head">
        <div>
          <div className="eg-import-title">导入词库</div>
          <div className="eg-import-sub">CSV/TSV/TXT/JSON</div>
        </div>
        <div className="eg-import-actions">
          <button
            className="eg-filebtn"
            onClick={() => {
              try {
                if (fileRef.current) fileRef.current.click()
              } catch {
                /* ignore */
              }
            }}
          >
            {filename ? '换文件' : '选择文件'}
          </button>
          <button className="eg-import-back" onClick={onClose}>
            ← 返回
          </button>
        </div>
      </div>
      <div className="eg-field">
        <label htmlFor="eg-bank-name">词库名称</label>
        <input
          id="eg-bank-name"
          className="eg-text"
          value={name}
          maxLength={60}
          placeholder="例如：CET-6 核心词"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div
        className={'eg-textarea-wrap' + (over ? ' over' : '')}
        onDragEnter={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        <textarea
          className="eg-textarea"
          value={content}
          placeholder="把 CSV / TSV / TXT / JSON 内容粘贴到这里，或把文件拖进来…"
          onChange={(e) => {
            setContent(e.target.value)
            setFilename('')
            setPreview(null)
          }}
        />
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.tsv,.txt,.json,text/csv,text/tab-separated-values,application/json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files && e.target.files[0]
            if (file) readFile(file)
            e.target.value = ''
          }}
        />
      </div>
      <div className="eg-import-foot">
        <button className="eg-btn primary" onClick={doPreview} disabled={busy || !content.trim()}>
          {busy ? '解析中…' : '解析预览'}
        </button>
        <button className="eg-btn ghost" onClick={doImport} disabled={busy || !preview || !preview.valid}>
          {preview && preview.valid ? '导入 ' + preview.valid + ' 条' : '导入'}
        </button>
      </div>
      {error ? <div className="eg-err">{error}</div> : null}
      {preview ? (
        <div>
          <div className="eg-preview">
            <div className="eg-preview-top">
              <strong>{'识别到 ' + preview.valid + ' 条'}</strong>
              <span>
                {String(preview.format || '').toUpperCase() +
                  (preview.hasHeader ? ' · 含表头' : '') +
                  (preview.skippedCount ? ' · 跳过 ' + preview.skippedCount + ' 行' : '')}
              </span>
            </div>
            {(preview.sample || []).map((item, i) => {
              const ph =
                item.uk || item.us
                  ? [item.uk ? '英 /' + item.uk + '/' : '', item.us ? '美 /' + item.us + '/' : '']
                      .filter(Boolean)
                      .join(' · ')
                  : item.phonetic
                    ? '/' + item.phonetic + '/'
                    : ''
              return (
                <div className="eg-preview-row" key={i}>
                  <span className="w">
                    {item.word}
                    {ph ? <span className="ph">{ph}</span> : null}
                  </span>
                  <span className="m">{item.meaning}</span>
                  {item.example ? <span className="ex">{item.example}</span> : null}
                </div>
              )
            })}
          </div>
          {preview.errors && preview.errors.length ? (
            <div className="eg-preview-errors">
              {preview.errors.map((e, i) => (
                <div className="er" key={i}>
                  {'第 ' + e.line + ' 行：' + e.reason}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
