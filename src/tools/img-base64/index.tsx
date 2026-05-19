import { useState, useRef } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { Icon } from '@/components/Icon'
import { useLang } from '@/store/lang.context'
import s from './ImgBase64.module.css'

type Mode = 'encode' | 'decode'

function stripPrefix(dataUrl: string): string {
  return dataUrl.replace(/^data:[^;]+;base64,/, '')
}

function guessMime(b64: string): string {
  const h = b64.slice(0, 6)
  if (h.startsWith('/9j/'))  return 'image/jpeg'
  if (h.startsWith('iVBO'))  return 'image/png'
  if (h.startsWith('R0lG'))  return 'image/gif'
  if (h.startsWith('UklG'))  return 'image/webp'
  if (h.startsWith('PHN2') || h.startsWith('PD94')) return 'image/svg+xml'
  return 'image/png'
}

function toDataUrl(raw: string): string {
  const trimmed = raw.trim()
  return trimmed.startsWith('data:') ? trimmed : `data:${guessMime(trimmed)};base64,${trimmed}`
}

export default function ImgBase64() {
  const [mode, setMode] = useState<Mode>('encode')
  const [dataUrl, setDataUrl]     = useState('')
  const [fileName, setFileName]   = useState('')
  const [withPrefix, setWithPrefix] = useState(false)
  const [b64Input, setB64Input]   = useState('')
  const [copied, setCopied]       = useState(false)
  const [imgError, setImgError]   = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { t } = useLang()

  function loadFile(file: File) {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = e => {
      setDataUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) loadFile(file)
  }

  function handleCopy() {
    const text = withPrefix ? dataUrl : stripPrefix(dataUrl)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function handleDownload() {
    const src = toDataUrl(b64Input.trim())
    const a = document.createElement('a')
    a.href = src
    a.download = 'image'
    a.click()
  }

  const displayB64 = dataUrl ? (withPrefix ? dataUrl : stripPrefix(dataUrl)) : ''
  const previewSrc  = b64Input.trim() ? toDataUrl(b64Input.trim()) : ''

  return (
    <ToolLayout toolId="img-base64" hideSplit>
      <div className={s.container}>

        <div className={s.segmented}>
          <button className={`${s.seg} ${mode === 'encode' ? s.segActive : ''}`} onClick={() => setMode('encode')}>
            {t.imgFileToB64}
          </button>
          <button className={`${s.seg} ${mode === 'decode' ? s.segActive : ''}`} onClick={() => setMode('decode')}>
            {t.imgB64ToFile}
          </button>
        </div>

        {mode === 'encode' ? (
          <div className={s.panel}>
            <div
              className={`${s.dropzone} ${dataUrl ? s.dropzoneHasImage : ''}`}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])}
              />
              {dataUrl ? (
                <img src={dataUrl} className={s.previewImg} alt="preview" />
              ) : (
                <div className={s.dropHint}>
                  <Icon name="upload" size={28} color="var(--color-muted)" />
                  <span className={s.dropText}>{t.imgDropHint}</span>
                  <span className={s.dropSub}>{t.imgDropSub}</span>
                </div>
              )}
            </div>

            {dataUrl && (
              <>
                <div className={s.outputBar}>
                  {fileName && <span className={s.metaChip}>{fileName}</span>}
                  <label className={s.checkLabel}>
                    <span className={`${s.checkBox} ${withPrefix ? s.checked : ''}`} onClick={() => setWithPrefix(v => !v)} />
                    {t.imgWithPrefix}
                  </label>
                  <button className={s.btn} onClick={handleCopy}>
                    {copied ? t.tcCopied : <><Icon name="copy" size={13} />{t.tcCopy}</>}
                  </button>
                </div>
                <div className={s.b64Output}>{displayB64}</div>
              </>
            )}
          </div>
        ) : (
          <div className={s.panel}>
            <div className={s.inputLabel}>{t.imgPasteB64}</div>
            <textarea
              className={s.textarea}
              value={b64Input}
              onChange={e => { setB64Input(e.target.value); setImgError(false) }}
              placeholder={t.imgB64Placeholder}
              spellCheck={false}
            />
            {previewSrc && (
              <div className={s.decodeResult}>
                {!imgError ? (
                  <img
                    src={previewSrc}
                    className={s.previewImg}
                    alt="decoded"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className={s.decodeError}>{t.imgInvalid}</div>
                )}
                {!imgError && (
                  <button className={s.btn} onClick={handleDownload}>
                    <Icon name="download" size={13} />{t.imgDownload}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
