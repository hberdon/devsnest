import { useState, useEffect } from 'react'
import { format as formatSQL } from 'sql-formatter'
import { SplitPane } from '@/components/SplitPane'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { humanSize } from '@/tools/utils/formatters'
import s from '@/tools/tool.module.css'

type Dialect = 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'tsql'

const DIALECTS: { id: Dialect; label: string }[] = [
  { id: 'sql',        label: 'SQL'    },
  { id: 'mysql',      label: 'MySQL'  },
  { id: 'postgresql', label: 'PG'     },
  { id: 'sqlite',     label: 'SQLite' },
  { id: 'tsql',       label: 'T-SQL'  },
]

function doFormat(input: string, dialect: Dialect): { ok: true; output: string; size: number } | { ok: false; error: string } {
  if (!input.trim()) return { ok: true, output: '', size: 0 }
  try {
    const output = formatSQL(input, { language: dialect, tabWidth: 2, keywordCase: 'upper' })
    return { ok: true, output, size: new TextEncoder().encode(output).length }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'SQL inválido' }
  }
}

export default function SQL() {
  const [input,   setInput]   = useState('')
  const [dialect, setDialect] = useState<Dialect>('sql')
  const { addToHistory } = useDevTools()

  const result = doFormat(input, dialect)
  const output     = result.ok ? result.output : ''
  const error      = !result.ok ? result.error : ''
  const outputMeta = result.ok && result.size > 0 ? humanSize(result.size) : ''

  const debouncedInput = useDebounce(input, 1500)
  useEffect(() => {
    if (!debouncedInput || !output) return
    addToHistory({
      toolId: 'sql', toolName: 'SQL', badge: 'SQL',
      categoryName: 'Formateadores',
      description: `${dialect.toUpperCase()} formateado · ${humanSize(new TextEncoder().encode(debouncedInput).length)}`,
    })
  }, [debouncedInput]) // eslint-disable-line react-hooks/exhaustive-deps

  const dialectControl = (
    <div className={s.segmented}>
      {DIALECTS.map(d => (
        <button
          key={d.id}
          className={`${s.segmentBtn} ${dialect === d.id ? s.segmentActive : ''}`}
          onClick={() => setDialect(d.id)}
        >{d.label}</button>
      ))}
    </div>
  )

  return (
    <ToolLayout toolId="sql" actions={dialectControl}>
      <SplitPane
        primary={{
          label: 'SQL',
          onPaste: () => navigator.clipboard.readText().then(setInput).catch(() => {}),
          content: (
            <textarea
              className={s.textarea}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={'SELECT u.id, u.name FROM users u WHERE u.active = 1 ORDER BY u.name;'}
              spellCheck={false}
            />
          ),
          footer: <span className={s.autoNote}>auto-formatea</span>,
        }}
        secondary={{
          label: 'Formateado',
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
