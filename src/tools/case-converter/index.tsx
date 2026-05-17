import { useState } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useLang } from '@/store/lang.context'
import s from './case.module.css'
import ts from '@/tools/tool.module.css'

function words(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

const CASES = [
  { id: 'camel',    label: 'camelCase',         fn: (t: string) => { const w = words(t); return w[0].toLowerCase() + w.slice(1).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('') } },
  { id: 'pascal',   label: 'PascalCase',         fn: (t: string) => words(t).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('') },
  { id: 'snake',    label: 'snake_case',         fn: (t: string) => words(t).map(w => w.toLowerCase()).join('_') },
  { id: 'screaming',label: 'SCREAMING_SNAKE',    fn: (t: string) => words(t).map(w => w.toUpperCase()).join('_') },
  { id: 'kebab',    label: 'kebab-case',         fn: (t: string) => words(t).map(w => w.toLowerCase()).join('-') },
  { id: 'title',    label: 'Title Case',         fn: (t: string) => words(t).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ') },
  { id: 'lower',    label: 'lower case',         fn: (t: string) => t.toLowerCase() },
  { id: 'upper',    label: 'UPPER CASE',         fn: (t: string) => t.toUpperCase() },
  { id: 'dot',      label: 'dot.case',           fn: (t: string) => words(t).map(w => w.toLowerCase()).join('.') },
  { id: 'path',     label: 'path/case',          fn: (t: string) => words(t).map(w => w.toLowerCase()).join('/') },
] as const

export default function CaseConverter() {
  const [input,  setInput]  = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const { addToHistory } = useDevTools()
  const { t } = useLang()

  function copyCase(id: string, value: string) {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 1200)
    if (input) {
      addToHistory({
        toolId: 'case-converter', toolName: 'Case Converter', badge: 'Aa',
        categoryName: 'Utilidades',
        description: `"${input.slice(0, 20)}" → ${CASES.find(c => c.id === id)?.label ?? id}`,
      })
    }
  }

  return (
    <ToolLayout toolId="case-converter">
      <div className={s.layout}>
        <div className={s.inputSection}>
          <label className={s.label}>{t.caseInput}</label>
          <input
            className={s.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t.casePlaceholder}
            spellCheck={false}
          />
        </div>

        <div className={s.grid}>
          {CASES.map(({ id, label, fn }) => {
            const value = input ? fn(input) : ''
            return (
              <div key={id} className={s.caseCard}>
                <span className={s.caseLabel}>{label}</span>
                <code className={s.caseValue}>{value || <span className={s.empty}>—</span>}</code>
                <button
                  className={`${ts.actionBtn} ${s.copyBtn}`}
                  onClick={() => copyCase(id, value)}
                  disabled={!value}
                >
                  {copied === id ? t.tcCopied : t.tcCopy}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </ToolLayout>
  )
}
