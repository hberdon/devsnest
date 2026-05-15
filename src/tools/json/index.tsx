import { useState, useEffect } from 'react'
import { SplitPane } from '@/components/SplitPane'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { formatJSON, humanSize, type IndentSize } from '@/tools/utils/formatters'
import s from '@/tools/tool.module.css'

export default function JSONFormatter() {
  const [input,  setInput]  = useState('')
  const [indent, setIndent] = useState<IndentSize>(2)
  const { addToHistory } = useDevTools()

  const result = formatJSON(input, indent)
  const output    = result.ok ? result.output : ''
  const error     = !result.ok ? result.error : ''
  const outputMeta = result.ok && result.size > 0 ? humanSize(result.size) : ''

  const debouncedInput = useDebounce(input, 1500)
  useEffect(() => {
    if (!debouncedInput || !output) return
    addToHistory({
      toolId: 'json', toolName: 'JSON', badge: '{ }',
      categoryName: 'Formateadores',
      description: `Formateado · ${humanSize(new TextEncoder().encode(debouncedInput).length)}`,
    })
  }, [debouncedInput]) // eslint-disable-line react-hooks/exhaustive-deps

  const indentControl = (
    <div className={s.segmented}>
      {(['2', '4', 'tab'] as const).map(v => (
        <button
          key={v}
          className={`${s.segmentBtn} ${String(indent) === v ? s.segmentActive : ''}`}
          onClick={() => setIndent(v === 'tab' ? 'tab' : Number(v) as IndentSize)}
        >{v === 'tab' ? 'Tab' : `${v} esp`}</button>
      ))}
    </div>
  )

  return (
    <ToolLayout toolId="json" actions={indentControl}>
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
          footer: <span className={s.autoNote}>auto-formatea</span>,
        }}
        secondary={{
          label: 'Resultado',
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
