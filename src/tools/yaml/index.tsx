import { useState, useEffect } from 'react'
import * as yaml from 'js-yaml'
import { SplitPane } from '@/components/SplitPane'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { humanSize } from '@/tools/utils/formatters'
import s from '@/tools/tool.module.css'

function formatYAML(input: string): { ok: true; output: string; size: number } | { ok: false; error: string } {
  if (!input.trim()) return { ok: true, output: '', size: 0 }
  try {
    const parsed = yaml.load(input)
    const output = yaml.dump(parsed, { indent: 2, lineWidth: 120, quotingType: '"' })
    return { ok: true, output: output.trimEnd(), size: new TextEncoder().encode(output).length }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'YAML inválido' }
  }
}

export default function YAMLFormatter() {
  const [input, setInput] = useState('')
  const { addToHistory } = useDevTools()

  const result = formatYAML(input)
  const output     = result.ok ? result.output : ''
  const error      = !result.ok ? result.error : ''
  const outputMeta = result.ok && result.size > 0 ? humanSize(result.size) : ''

  const debouncedInput = useDebounce(input, 1500)
  useEffect(() => {
    if (!debouncedInput || !output) return
    addToHistory({
      toolId: 'yaml', toolName: 'YAML', badge: 'YML',
      categoryName: 'Formateadores',
      description: `Formateado · ${humanSize(new TextEncoder().encode(debouncedInput).length)}`,
    })
  }, [debouncedInput]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ToolLayout toolId="yaml">
      <SplitPane
        primary={{
          label: 'YAML',
          onPaste: () => navigator.clipboard.readText().then(setInput).catch(() => {}),
          content: (
            <textarea
              className={s.textarea}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={'nombre: valor\nlista:\n  - item1\n  - item2'}
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
