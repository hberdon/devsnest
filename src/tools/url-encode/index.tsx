import { useState, useEffect } from 'react'
import { Icon } from '@/components/Icon'
import { SplitPane } from '@/components/SplitPane'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/store/lang.context'
import s from '@/tools/tool.module.css'

type Mode      = 'component' | 'uri'
type Direction = 'encode' | 'decode'

function tryEncode(text: string, mode: Mode): string {
  try {
    return mode === 'component' ? encodeURIComponent(text) : encodeURI(text)
  } catch {
    return ''
  }
}

function tryDecode(text: string): { ok: true; text: string } | { ok: false; error: string } {
  try {
    return { ok: true, text: decodeURIComponent(text) }
  } catch {
    return { ok: false, error: 'url_invalid' }
  }
}

export default function URLEncode() {
  const [input, setInput]     = useState('')
  const [mode, setMode]       = useState<Mode>('component')
  const [direction, setDir]   = useState<Direction>('encode')
  const { addToHistory }      = useDevTools()
  const { t } = useLang()
  const debounced             = useDebounce(input, 1500)

  const isEncode = direction === 'encode'

  const result = isEncode
    ? { ok: true as const, text: tryEncode(input, mode) }
    : tryDecode(input)

  const output   = result.ok ? result.text : ''
  const errorMsg = !result.ok ? t.urlInvalid : ''

  useEffect(() => {
    if (!debounced || !output) return
    addToHistory({
      toolId: 'url-encode', toolName: 'URL Encode', badge: 'URL',
      categoryName: 'Conversores',
      description: `${isEncode ? 'Codificó' : 'Decodificó'} · ${mode === 'component' ? 'encodeURIComponent' : 'encodeURI'}`,
    })
  }, [debounced]) // eslint-disable-line react-hooks/exhaustive-deps

  const modeSelector = (
    <div className={s.segmented}>
      <button className={`${s.segmentBtn} ${mode === 'component' ? s.segmentActive : ''}`} onClick={() => setMode('component')}>Component</button>
      <button className={`${s.segmentBtn} ${mode === 'uri' ? s.segmentActive : ''}`} onClick={() => setMode('uri')}>URI</button>
    </div>
  )

  const swapAction = (
    <>
      {modeSelector}
      <button className={s.actionBtn} onClick={() => { setInput(output); setDir(d => d === 'encode' ? 'decode' : 'encode') }}>
        <Icon name="swap" size={14} />
        {isEncode ? 'Encode → Decode' : 'Decode → Encode'}
      </button>
    </>
  )

  return (
    <ToolLayout toolId="url-encode" actions={swapAction}>
      <SplitPane
        primary={{
          label: isEncode ? t.urlInputText : t.urlInputEncoded,
          onPaste: () => navigator.clipboard.readText().then(t => setInput(t)).catch(() => {}),
          content: (
            <textarea
              className={s.textarea}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isEncode ? 'https://example.com/búsqueda?q=hola mundo' : 'https%3A%2F%2Fexample.com%2F…'}
              spellCheck={false}
            />
          ),
        }}
        secondary={{
          label: isEncode ? t.urlOutputEncoded : t.urlOutputDecoded,
          onCopy: output ? () => navigator.clipboard.writeText(output).catch(() => {}) : undefined,
          content: errorMsg
            ? <span className={s.error}>{errorMsg}</span>
            : <div className={s.output}>{output}</div>,
        }}
      />
    </ToolLayout>
  )
}
