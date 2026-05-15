import { useState, useEffect } from 'react'
import { Icon } from '@/components/Icon'
import { SplitPane } from '@/components/SplitPane'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import s from '@/tools/tool.module.css'

type Format  = 'hex' | 'binary'
type Direction = 'encode' | 'decode'

function textToHex(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ')
}

function hexToText(hex: string): { ok: true; text: string } | { ok: false; error: string } {
  try {
    const parts = hex.trim().split(/\s+/)
    const bytes = parts.map(h => {
      const n = parseInt(h, 16)
      if (isNaN(n) || h.length > 2) throw new Error()
      return n
    })
    return { ok: true, text: new TextDecoder().decode(new Uint8Array(bytes)) }
  } catch {
    return { ok: false, error: 'Hex inválido — usa bytes separados por espacio (ej: 48 65 6c 6c 6f)' }
  }
}

function textToBinary(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map(b => b.toString(2).padStart(8, '0'))
    .join(' ')
}

function binaryToText(binary: string): { ok: true; text: string } | { ok: false; error: string } {
  try {
    const parts = binary.trim().split(/\s+/)
    const bytes = parts.map(b => {
      const n = parseInt(b, 2)
      if (isNaN(n) || !/^[01]{1,8}$/.test(b)) throw new Error()
      return n
    })
    return { ok: true, text: new TextDecoder().decode(new Uint8Array(bytes)) }
  } catch {
    return { ok: false, error: 'Binario inválido — usa bytes de 8 bits separados por espacio' }
  }
}

export default function HexBinario() {
  const [input, setInput]       = useState('')
  const [format, setFormat]     = useState<Format>('hex')
  const [direction, setDir]     = useState<Direction>('encode')
  const { addToHistory }        = useDevTools()
  const debounced               = useDebounce(input, 1500)

  const isEncode = direction === 'encode'

  const result = isEncode
    ? { ok: true as const, text: format === 'hex' ? textToHex(input) : textToBinary(input) }
    : format === 'hex' ? hexToText(input) : binaryToText(input)

  const output     = result.ok ? result.text : ''
  const errorMsg   = !result.ok ? result.error : ''

  useEffect(() => {
    if (!debounced || !output) return
    addToHistory({
      toolId: 'hex-binario', toolName: 'Hex / Binario', badge: 'HEX',
      categoryName: 'Conversores',
      description: `${isEncode ? 'Texto → ' : ''}${format.toUpperCase()}${isEncode ? '' : ' → Texto'}`,
    })
  }, [debounced]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSwap() {
    setInput(output)
    setDir(d => d === 'encode' ? 'decode' : 'encode')
  }

  const formatSelector = (
    <div className={s.segmented}>
      <button className={`${s.segmentBtn} ${format === 'hex' ? s.segmentActive : ''}`} onClick={() => setFormat('hex')}>HEX</button>
      <button className={`${s.segmentBtn} ${format === 'binary' ? s.segmentActive : ''}`} onClick={() => setFormat('binary')}>BIN</button>
    </div>
  )

  const swapAction = (
    <>
      {formatSelector}
      <button className={s.actionBtn} onClick={handleSwap}>
        <Icon name="swap" size={14} />
        {isEncode ? (format === 'hex' ? 'Texto → Hex' : 'Texto → Bin') : (format === 'hex' ? 'Hex → Texto' : 'Bin → Texto')}
      </button>
    </>
  )

  return (
    <ToolLayout toolId="hex-binario" actions={swapAction}>
      <SplitPane
        primary={{
          label: isEncode ? 'Entrada (texto)' : `Entrada (${format.toUpperCase()})`,
          meta: input ? `${new TextEncoder().encode(input).length} b` : '',
          onPaste: () => navigator.clipboard.readText().then(t => setInput(t)).catch(() => {}),
          content: (
            <textarea
              className={s.textarea}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isEncode ? 'Escribe texto…' : format === 'hex' ? '48 65 6c 6c 6f' : '01001000 01100101…'}
              spellCheck={false}
            />
          ),
        }}
        secondary={{
          label: isEncode ? `Salida (${format.toUpperCase()})` : 'Salida (texto)',
          meta: output ? `${output.split(' ').length} bytes` : '',
          onCopy: output ? () => navigator.clipboard.writeText(output).catch(() => {}) : undefined,
          content: errorMsg
            ? <span className={s.error}>{errorMsg}</span>
            : <div className={s.output}>{output}</div>,
        }}
      />
    </ToolLayout>
  )
}
