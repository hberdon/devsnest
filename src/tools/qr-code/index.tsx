import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/store/lang.context'
import s from './qr.module.css'
import ts from '@/tools/tool.module.css'

export default function QRCodeTool() {
  const [input,   setInput]   = useState('')
  const [dataUrl, setDataUrl] = useState('')
  const [error,   setError]   = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { addToHistory } = useDevTools()
  const { t } = useLang()

  const debouncedInput = useDebounce(input, 600)

  useEffect(() => {
    if (!debouncedInput) { setDataUrl(''); setError(''); return }
    QRCode.toDataURL(debouncedInput, {
      errorCorrectionLevel: 'M',
      width: 300,
      margin: 2,
      color: { dark: '#15102b', light: '#ffffff' },
    }).then(url => {
      setDataUrl(url)
      setError('')
      addToHistory({
        toolId: 'qr-code', toolName: 'QR Code', badge: '▣',
        categoryName: 'Generadores',
        description: `QR: ${debouncedInput.length > 40 ? debouncedInput.slice(0, 40) + '…' : debouncedInput}`,
      })
    }).catch(e => {
      setError(e instanceof Error ? e.message : 'Error generando QR')
      setDataUrl('')
    })
  }, [debouncedInput]) // eslint-disable-line react-hooks/exhaustive-deps

  function download() {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'qrcode.png'
    a.click()
  }

  return (
    <ToolLayout toolId="qr-code">
      <div className={s.layout}>
        <div className={s.inputSection}>
          <label className={s.inputLabel}>{t.qrTextOrUrl}</label>
          <textarea
            className={`${ts.textarea} ${s.inputArea}`}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="https://ejemplo.com o cualquier texto…"
            spellCheck={false}
            rows={3}
          />
          {error && <span className={ts.error}>{error}</span>}
        </div>

        <div className={s.qrBox}>
          {dataUrl ? (
            <>
              <img src={dataUrl} alt="QR Code" className={s.qrImg} ref={canvasRef as unknown as React.RefObject<HTMLImageElement>} />
              <button className={s.downloadBtn} onClick={download}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {t.qrDownload}
              </button>
            </>
          ) : (
            <div className={s.placeholder}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                <rect x="5" y="5" width="3" height="3" fill="var(--color-muted)"/>
                <rect x="16" y="5" width="3" height="3" fill="var(--color-muted)"/>
                <rect x="5" y="16" width="3" height="3" fill="var(--color-muted)"/>
                <path d="M14 14h3v3h-3z M17 17h3v3h-3z M14 20h3"/>
              </svg>
              <span className={s.placeholderText}>{t.qrEmpty}</span>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
