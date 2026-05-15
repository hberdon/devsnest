import { useState, useEffect } from 'react'
import { Icon } from '@/components/Icon'
import { SplitPane } from '@/components/SplitPane'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import s from './Base64.module.css'

// ── Encode / decode helpers ────────────────────────────────────────────────
function encode(text: string, urlSafe: boolean, noPadding: boolean): string {
  if (!text) return ''
  const bytes  = new TextEncoder().encode(text)
  const binary = Array.from(bytes, b => String.fromCharCode(b)).join('')
  let result   = btoa(binary)
  if (urlSafe)  result = result.replace(/\+/g, '-').replace(/\//g, '_')
  if (noPadding) result = result.replace(/=/g, '')
  return result
}

function decode(b64: string): { ok: true; text: string } | { ok: false; error: string } {
  try {
    const normalized = b64.replace(/-/g, '+').replace(/_/g, '/')
    const padded     = normalized + '='.repeat((4 - normalized.length % 4) % 4)
    const binary     = atob(padded)
    const bytes      = Uint8Array.from(binary, c => c.charCodeAt(0))
    return { ok: true, text: new TextDecoder().decode(bytes) }
  } catch {
    return { ok: false, error: 'Base64 inválido' }
  }
}

function byteSize(text: string): string {
  const b = new TextEncoder().encode(text).length
  return b < 1024 ? `${b} b` : `${(b / 1024).toFixed(1)} KB`
}

// ── Component ──────────────────────────────────────────────────────────────
export default function Base64() {
  const [input,    setInput]    = useState('')
  const [direction, setDir]    = useState<'encode' | 'decode'>('encode')
  const [urlSafe,  setUrlSafe] = useState(false)
  const [noPad,    setNoPad]   = useState(false)
  const { addToHistory } = useDevTools()

  const isEncode = direction === 'encode'

  // Computed output
  const output = isEncode
    ? encode(input, urlSafe, noPad)
    : (decode(input).ok ? (decode(input) as { ok: true; text: string }).text : '')
  const decodeError = !isEncode && input ? (decode(input).ok ? '' : (decode(input) as { ok: false; error: string }).error) : ''

  // Register in history after user settles (1.5s debounce)
  const debouncedInput = useDebounce(input, 1500)
  useEffect(() => {
    if (!debouncedInput || !output) return
    addToHistory({
      toolId:       'base64',
      toolName:     'Base64',
      badge:        'B64',
      categoryName: 'Conversores',
      description:  `${isEncode ? 'Codificó' : 'Decodificó'} · ${byteSize(debouncedInput)}`,
    })
  }, [debouncedInput]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSwap() {
    setInput(output)
    setDir(d => d === 'encode' ? 'decode' : 'encode')
  }

  function handleCopyOutput() {
    navigator.clipboard.writeText(output).catch(() => {})
  }

  function handlePasteInput() {
    navigator.clipboard.readText().then(text => setInput(text)).catch(() => {})
  }

  const inputMeta  = input  ? `UTF-8 · ${byteSize(input)}`  : ''
  const outputMeta = output ? byteSize(output) : ''

  const checkboxFooter = (
    <>
      <label className={s.checkbox}>
        <span className={`${s.checkboxBox} ${urlSafe ? s.checked : ''}`} onClick={() => setUrlSafe(v => !v)} />
        URL-safe
      </label>
      <label className={s.checkbox}>
        <span className={`${s.checkboxBox} ${noPad ? s.checked : ''}`} onClick={() => setNoPad(v => !v)} />
        Sin padding
      </label>
      <span className={s.autoNote}>auto-actualiza</span>
    </>
  )

  const swapAction = (
    <button className={s.swapBtn} onClick={handleSwap}>
      <Icon name="swap" size={14} />
      {isEncode ? 'Encode → Decode' : 'Decode → Encode'}
    </button>
  )

  return (
    <ToolLayout toolId="base64" actions={swapAction}>
      <SplitPane
        primary={{
          label:   isEncode ? 'Entrada (texto)' : 'Entrada (Base64)',
          meta:    inputMeta,
          onPaste: handlePasteInput,
          content: (
            <textarea
              className={s.textarea}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isEncode ? 'Escribe o pega texto…' : 'Pega el Base64 aquí…'}
              spellCheck={false}
            />
          ),
          footer: checkboxFooter,
        }}
        secondary={{
          label:  isEncode ? 'Salida (Base64)' : 'Salida (texto)',
          meta:   outputMeta,
          onCopy: output ? handleCopyOutput : undefined,
          content: decodeError
            ? <span className={s.error}>{decodeError}</span>
            : <div className={s.output}>{output}</div>,
        }}
      />
    </ToolLayout>
  )
}
