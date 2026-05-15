import { useState, useEffect } from 'react'
import { marked } from 'marked'
import { SplitPane } from '@/components/SplitPane'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { humanSize } from '@/tools/utils/formatters'
import s from './md.module.css'
import ts from '@/tools/tool.module.css'

marked.setOptions({ breaks: true })

export default function Markdown() {
  const [input, setInput] = useState('')
  const { addToHistory } = useDevTools()

  const html = input ? (marked.parse(input) as string) : ''

  const debouncedInput = useDebounce(input, 1500)
  useEffect(() => {
    if (!debouncedInput || !html) return
    addToHistory({
      toolId: 'markdown', toolName: 'Markdown', badge: 'MD',
      categoryName: 'Formateadores',
      description: `Preview · ${humanSize(new TextEncoder().encode(debouncedInput).length)}`,
    })
  }, [debouncedInput]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ToolLayout toolId="markdown">
      <SplitPane
        primary={{
          label: 'Markdown',
          onPaste: () => navigator.clipboard.readText().then(setInput).catch(() => {}),
          content: (
            <textarea
              className={ts.textarea}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={'# Título\n\nEscribe **markdown** aquí…'}
              spellCheck={false}
            />
          ),
          footer: <span className={ts.autoNote}>preview en vivo</span>,
        }}
        secondary={{
          label: 'Preview',
          meta: input ? humanSize(new TextEncoder().encode(input).length) : '',
          onCopy: html ? () => navigator.clipboard.writeText(html).catch(() => {}) : undefined,
          content: (
            <div
              className={s.preview}
              dangerouslySetInnerHTML={{ __html: html || '<span style="color:var(--color-muted);font-size:13px">El preview aparecerá aquí</span>' }}
            />
          ),
        }}
      />
    </ToolLayout>
  )
}
