import { useState, useRef } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { Icon } from '@/components/Icon'
import { useLang } from '@/store/lang.context'
import s from './PdfBase64.module.css'

type Mode = 'encode' | 'decode'

function formatBytes(n: number): string {
  return n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`
}

function stripPrefix(s: string): string {
  return s.replace(/^data:[^;]+;base64,/, '').trim()
}

export default function PdfBase64() {
  const [mode, setMode]         = useState<Mode>('encode')
  const [b64, setB64]           = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [copied, setCopied]     = useState(false)
  const [withPrefix, setWithPrefix] = useState(false)
  const [b64Input, setB64Input] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const { t } = useLang()

  function loadFile(file: File) {
    setFileName(file.name)
    setFileSize(file.size)
    const reader = new FileReader()
    reader.onload = e => {
      const dataUrl = e.target?.result as string
      setB64(withPrefix ? dataUrl : stripPrefix(dataUrl))
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type === 'application/pdf' || file?.name.endsWith('.pdf')) loadFile(file)
  }

  function handleCopy() {
    navigator.clipboard.writeText(b64).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function handleDownload() {
    const raw = stripPrefix(b64Input.trim())
    const bytes = Uint8Array.from(atob(raw), c => c.charCodeAt(0))
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Recompute output when withPrefix toggle changes
  function togglePrefix() {
    setWithPrefix(v => {
      if (b64) {
        const wasPrefix = v
        const raw = wasPrefix ? stripPrefix(b64) : b64
        setB64(wasPrefix ? raw : `data:application/pdf;base64,${raw}`)
      }
      return !v
    })
  }

  const isValidInput = (() => {
    const raw = b64Input.trim()
    if (!raw) return false
    try { atob(stripPrefix(raw)); return true } catch { return false }
  })()

  return (
    <ToolLayout toolId="pdf-base64" hideSplit>
      <div className={s.container}>

        <div className={s.segmented}>
          <button className={`${s.seg} ${mode === 'encode' ? s.segActive : ''}`} onClick={() => setMode('encode')}>
            {t.pdfFileToB64}
          </button>
          <button className={`${s.seg} ${mode === 'decode' ? s.segActive : ''}`} onClick={() => setMode('decode')}>
            {t.pdfB64ToFile}
          </button>
        </div>

        {mode === 'encode' ? (
          <div className={s.panel}>
            <div
              className={s.dropzone}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])}
              />
              {fileName ? (
                <div className={s.fileInfo}>
                  <span className={s.pdfIcon}>PDF</span>
                  <div className={s.fileMeta}>
                    <span className={s.fileNameText}>{fileName}</span>
                    <span className={s.fileSizeText}>{formatBytes(fileSize)}</span>
                  </div>
                </div>
              ) : (
                <div className={s.dropHint}>
                  <Icon name="upload" size={28} color="var(--color-muted)" />
                  <span className={s.dropText}>{t.pdfDropHint}</span>
                  <span className={s.dropSub}>{t.pdfDropSub}</span>
                </div>
              )}
            </div>

            {b64 && (
              <>
                <div className={s.outputBar}>
                  <label className={s.checkLabel}>
                    <span className={`${s.checkBox} ${withPrefix ? s.checked : ''}`} onClick={togglePrefix} />
                    {t.imgWithPrefix}
                  </label>
                  <button className={s.btn} onClick={handleCopy}>
                    {copied ? t.tcCopied : <><Icon name="copy" size={13} />{t.tcCopy}</>}
                  </button>
                </div>
                <div className={s.b64Output}>{b64}</div>
              </>
            )}
          </div>
        ) : (
          <div className={s.panel}>
            <div className={s.inputLabel}>{t.pdfPasteB64}</div>
            <textarea
              className={s.textarea}
              value={b64Input}
              onChange={e => setB64Input(e.target.value)}
              placeholder={t.pdfB64Placeholder}
              spellCheck={false}
            />
            <div className={s.decodeBar}>
              {b64Input.trim() && !isValidInput && (
                <span className={s.decodeError}>{t.pdfInvalid}</span>
              )}
              <button
                className={s.btn}
                onClick={handleDownload}
                disabled={!isValidInput}
              >
                <Icon name="download" size={13} />{t.pdfDownload}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
