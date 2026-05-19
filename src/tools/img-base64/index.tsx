import { useState, useRef } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { Icon } from '@/components/Icon'
import { useLang } from '@/store/lang.context'
import s from './ImgBase64.module.css'

type Mode = 'encode' | 'decode'

interface ImgInfo {
  name: string
  mime: string
  sizeBytes: number
  w: number
  h: number
}

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

function fmtBytes(n: number): string {
  return n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`
}

function getMimeLabel(dataUrl: string): string {
  const m = dataUrl.match(/^data:([^;]+);/)
  return m ? m[1] : 'image/png'
}

export default function ImgBase64() {
  const [mode, setMode]           = useState<Mode>('encode')
  const [dataUrl, setDataUrl]     = useState('')
  const [info, setInfo]           = useState<ImgInfo | null>(null)
  const [withPrefix, setWithPrefix] = useState(false)
  const [b64Input, setB64Input]   = useState('')
  const [copied, setCopied]       = useState(false)
  const [imgError, setImgError]   = useState(false)
  const [decodeInfo, setDecodeInfo] = useState<{ w: number; h: number } | null>(null)
  const [lightbox, setLightbox]   = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { t } = useLang()

  function loadFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      const url = e.target?.result as string
      setDataUrl(url)
      const img = new Image()
      img.onload = () => {
        setInfo({ name: file.name, mime: getMimeLabel(url), sizeBytes: file.size, w: img.naturalWidth, h: img.naturalHeight })
      }
      img.src = url
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

  function handleDecodeImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    setDecodeInfo({ w: img.naturalWidth, h: img.naturalHeight })
  }

  const displayB64 = dataUrl ? (withPrefix ? dataUrl : stripPrefix(dataUrl)) : ''
  const previewSrc = b64Input.trim() ? toDataUrl(b64Input.trim()) : ''

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
            {!dataUrl ? (
              <div
                className={s.dropzone}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
                <div className={s.dropHint}>
                  <Icon name="upload" size={28} color="var(--color-muted)" />
                  <span className={s.dropText}>{t.imgDropHint}</span>
                  <span className={s.dropSub}>{t.imgDropSub}</span>
                </div>
              </div>
            ) : (
              <div className={s.fileStrip}>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
                <img src={dataUrl} className={s.thumb} alt="thumbnail" onClick={() => setLightbox(true)} title="Click para ampliar" />
                {info && (
                  <div className={s.imgInfo}>
                    <div className={s.infoRow}><span className={s.infoKey}>Nombre</span><span className={s.infoVal}>{info.name}</span></div>
                    <div className={s.infoRow}><span className={s.infoKey}>Tipo</span><span className={s.infoVal}>{info.mime}</span></div>
                    <div className={s.infoRow}><span className={s.infoKey}>Dimensiones</span><span className={s.infoVal}>{info.w} × {info.h} px</span></div>
                    <div className={s.infoRow}><span className={s.infoKey}>Tamaño</span><span className={s.infoVal}>{fmtBytes(info.sizeBytes)}</span></div>
                    <div className={s.infoActions}>
                      <button className={s.changeBtn} onClick={() => fileRef.current?.click()}>
                        <Icon name="upload" size={12} />{t.imgChange}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {dataUrl && (
              <>
                <div className={s.outputBar}>
                  <button className={s.btn} onClick={handleCopy}>
                    {copied ? t.tcCopied : <><Icon name="copy" size={13} />{t.tcCopy}</>}
                  </button>
                  <label className={s.checkLabel}>
                    <span className={`${s.checkBox} ${withPrefix ? s.checked : ''}`} onClick={() => setWithPrefix(v => !v)} />
                    {t.imgWithPrefix}
                  </label>
                </div>
                <textarea className={s.b64Output} value={displayB64} readOnly spellCheck={false} />
              </>
            )}
          </div>
        ) : (
          <div className={s.panel}>
            <div className={s.inputLabel}>{t.imgPasteB64}</div>
            <textarea
              className={s.textarea}
              value={b64Input}
              onChange={e => { setB64Input(e.target.value); setImgError(false); setDecodeInfo(null) }}
              placeholder={t.imgB64Placeholder}
              spellCheck={false}
            />
            {previewSrc && (
              <div className={s.fileStrip}>
                {!imgError ? (
                  <img src={previewSrc} className={s.thumb} alt="decoded"
                    onClick={() => setLightbox(true)} title="Click para ampliar"
                    onLoad={handleDecodeImgLoad}
                    onError={() => setImgError(true)} />
                ) : (
                  <span className={s.decodeError}>{t.imgInvalid}</span>
                )}
                {decodeInfo && !imgError && (
                  <div className={s.imgInfo}>
                    <div className={s.infoRow}><span className={s.infoKey}>Tipo</span><span className={s.infoVal}>{guessMime(stripPrefix(b64Input.trim()))}</span></div>
                    <div className={s.infoRow}><span className={s.infoKey}>Dimensiones</span><span className={s.infoVal}>{decodeInfo.w} × {decodeInfo.h} px</span></div>
                    <div className={s.infoRow}><span className={s.infoKey}>Base64</span><span className={s.infoVal}>{fmtBytes(Math.ceil(stripPrefix(b64Input.trim()).length * 0.75))}</span></div>
                    <div className={s.infoActions}>
                      <button className={s.btn} onClick={handleDownload}>
                        <Icon name="download" size={13} />{t.imgDownload}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {lightbox && (
        <div className={s.lightboxBackdrop} onClick={() => setLightbox(false)}>
          <img src={mode === 'encode' ? dataUrl : previewSrc} className={s.lightboxImg}
            alt="full size" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </ToolLayout>
  )
}
