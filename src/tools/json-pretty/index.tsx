import { useState, useEffect } from 'react'
import { SplitPane } from '@/components/SplitPane'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/store/lang.context'
import { formatJSON, minifyJSON, humanSize, type IndentSize } from '@/tools/utils/formatters'
import s from '@/tools/tool.module.css'

export default function JSONPretty() {
  const [input,  setInput]  = useState('')
  const [indent, setIndent] = useState<IndentSize>(2)
  const [minify, setMinify] = useState(false)
  const { addToHistory } = useDevTools()
  const { t } = useLang()

  const result = minify ? minifyJSON(input) : formatJSON(input, indent)
  const output     = result.ok ? result.output : ''
  const error      = !result.ok ? result.error : ''
  const outputMeta = result.ok && result.size > 0 ? humanSize(result.size) : ''

  const debouncedInput = useDebounce(input, 1500)
  useEffect(() => {
    if (!debouncedInput || !output) return
    addToHistory({
      toolId: 'json-pretty', toolName: 'JSON Pretty', badge: 'JSP',
      categoryName: 'Formateadores',
      description: minify ? `${t.jpMinifiedLabel} · ${outputMeta}` : `${t.jpPrettyLabel} · indent ${indent}`,
    })
  }, [debouncedInput]) // eslint-disable-line react-hooks/exhaustive-deps

  const actions = (
    <>
      <div className={s.segmented}>
        {(['2', '4', 'tab'] as const).map(v => (
          <button
            key={v}
            className={`${s.segmentBtn} ${!minify && String(indent) === v ? s.segmentActive : ''}`}
            onClick={() => { setMinify(false); setIndent(v === 'tab' ? 'tab' : Number(v) as IndentSize) }}
          >{v === 'tab' ? t.xpTab : `${v} ${t.xpSpaces}`}</button>
        ))}
      </div>
      <button
        className={`${s.actionBtn} ${minify ? s.segmentActive : ''}`}
        style={minify ? { background: 'var(--color-ink)', color: '#fff' } : undefined}
        onClick={() => setMinify(v => !v)}
      >
          {t.tcMinify}
      </button>
    </>
  )

  return (
    <ToolLayout toolId="json-pretty" actions={actions}>
      <SplitPane
        primary={{
          label: 'JSON',
          onPaste: () => navigator.clipboard.readText().then(setInput).catch(() => {}),
          content: (
            <textarea
              className={s.textarea}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='{ "clave": "valor" }'
              spellCheck={false}
            />
          ),
          footer: <span className={s.autoNote}>{t.tcAutoFormats}</span>,
        }}
        secondary={{
          label: minify ? t.jpMinifiedLabel : t.jpPrettyLabel,
          meta: outputMeta,
          onCopy: output ? () => navigator.clipboard.writeText(output).catch(() => {}) : undefined,
          content: error
            ? <span className={s.error}>{error}</span>
            : <div className={s.output}>{output}</div>,
        }}
      />
    </ToolLayout>
  )
}
