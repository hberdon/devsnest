import { useState, useEffect } from 'react'
import { SplitPane } from '@/components/SplitPane'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/store/lang.context'
import { formatCSS, humanSize } from '@/tools/utils/formatters'
import s from '@/tools/tool.module.css'

export default function CSSFormatter() {
  const [input, setInput] = useState('')
  const { addToHistory } = useDevTools()
  const { t } = useLang()

  const result = formatCSS(input)
  const output     = result.ok ? result.output : ''
  const error      = !result.ok ? result.error : ''
  const outputMeta = result.ok && result.size > 0 ? humanSize(result.size) : ''

  const debouncedInput = useDebounce(input, 1500)
  useEffect(() => {
    if (!debouncedInput || !output) return
    addToHistory({
      toolId: 'css-scss', toolName: 'CSS / SCSS', badge: 'CSS',
      categoryName: 'Formateadores',
      description: `Formateado · ${humanSize(new TextEncoder().encode(debouncedInput).length)}`,
    })
  }, [debouncedInput]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ToolLayout toolId="css-scss" hideSplit>
      <SplitPane
        primary={{
          label: 'CSS / SCSS',
          onPaste: () => navigator.clipboard.readText().then(setInput).catch(() => {}),
          content: (
            <textarea
              className={s.textarea}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={'.selector{color:red;font-size:14px;margin:0 auto}'}
              spellCheck={false}
            />
          ),
          footer: <span className={s.autoNote}>{t.tcAutoFormats}</span>,
        }}
        secondary={{
          label: t.cssFormatted,
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
