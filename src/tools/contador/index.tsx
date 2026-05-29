import { useState, useMemo } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/store/lang.context'
import s from './contador.module.css'
import ts from '@/tools/tool.module.css'

interface Stats {
  chars:       number
  charsNoSpc:  number
  words:       number
  lines:       number
  sentences:   number
  bytes:       number
  readMinutes: number
}

function computeStats(text: string): Stats {
  const chars      = text.length
  const charsNoSpc = text.replace(/\s/g, '').length
  const words      = text.trim() ? text.trim().split(/\s+/).length : 0
  const lines      = text ? text.split('\n').length : 0
  const sentences  = text.trim() ? (text.match(/[.!?]+/g) ?? []).length : 0
  const bytes      = new TextEncoder().encode(text).length
  const readMinutes = Math.ceil(words / 200)
  return { chars, charsNoSpc, words, lines, sentences, bytes, readMinutes }
}

export default function Contador() {
  const [input, setInput] = useState('')
  const { addToHistory } = useDevTools()
  const { t, lang } = useLang()
  const locale = lang === 'es' ? 'es' : 'en'

  const STAT_ROWS: { key: keyof Stats; label: string; format?: (n: number) => string }[] = [
    { key: 'chars',       label: t.cntChars },
    { key: 'charsNoSpc',  label: t.cntNoSpaces },
    { key: 'words',       label: t.cntWords },
    { key: 'lines',       label: t.cntLines },
    { key: 'sentences',   label: t.cntSentences },
    { key: 'bytes',       label: t.cntBytesLabel, format: n => n < 1024 ? `${n} B` : `${(n/1024).toFixed(1)} KB` },
    { key: 'readMinutes', label: t.cntReading,    format: n => n <= 1 ? t.cntLess1Min : `~${n} min` },
  ]

  const stats = useMemo(() => computeStats(input), [input])

  const debouncedInput = useDebounce(input, 1500)
  useMemo(() => {
    if (!debouncedInput) return
    addToHistory({
      toolId: 'contador', toolName: 'Contador', badge: '∑',
      categoryName: 'Utilidades',
      description: `${stats.words} palabras · ${stats.chars} chars`,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput])

  return (
    <ToolLayout toolId="contador" hideSplit>
      <div className={s.layout}>
        <div className={s.textSection}>
          <textarea
            className={`${ts.textarea} ${s.textArea}`}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t.cntPlaceholder}
            spellCheck={false}
          />
        </div>

        <div className={s.statsGrid}>
          {STAT_ROWS.map(({ key, label, format }) => (
            <div key={key} className={s.statCard}>
              <span className={s.statValue}>
                {format ? format(stats[key]) : stats[key].toLocaleString(locale)}
              </span>
              <span className={s.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
