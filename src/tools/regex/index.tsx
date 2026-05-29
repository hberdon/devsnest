import { useState, useMemo } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/store/lang.context'
import s from './regex.module.css'
import ts from '@/tools/tool.module.css'

const ALL_FLAGS = ['g', 'i', 'm', 's'] as const
type Flag = typeof ALL_FLAGS[number]

interface RegexResult {
  matches: RegExpExecArray[]
  highlighted: { text: string; match: boolean }[]
  error?: string
}

function runRegex(pattern: string, flags: Set<Flag>, input: string): RegexResult {
  if (!pattern || !input) return { matches: [], highlighted: [{ text: input, match: false }] }
  try {
    const flagStr = [...flags].join('')
    const re      = new RegExp(pattern, flagStr.includes('g') ? flagStr : flagStr + 'g')
    const matches: RegExpExecArray[] = []
    let m: RegExpExecArray | null
    re.lastIndex = 0
    while ((m = re.exec(input)) !== null) {
      matches.push(m)
      if (m[0].length === 0) re.lastIndex++
    }
    // Build highlighted segments
    const segments: { text: string; match: boolean }[] = []
    let last = 0
    for (const match of matches) {
      if (match.index > last) segments.push({ text: input.slice(last, match.index), match: false })
      segments.push({ text: match[0], match: true })
      last = match.index + match[0].length
    }
    if (last < input.length) segments.push({ text: input.slice(last), match: false })
    return { matches, highlighted: segments.length ? segments : [{ text: input, match: false }] }
  } catch (e) {
    return { matches: [], highlighted: [{ text: input, match: false }], error: e instanceof Error ? e.message : 'regex_invalid' }
  }
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags,   setFlags]   = useState<Set<Flag>>(new Set(['g']))
  const [input,   setInput]   = useState('')
  const { addToHistory } = useDevTools()
  const { t } = useLang()

  const debouncedPattern = useDebounce(pattern, 400)
  const result = useMemo(() => runRegex(debouncedPattern, flags, input), [debouncedPattern, flags, input])

  const debouncedInput = useDebounce(input, 1500)
  useMemo(() => {
    if (!debouncedInput || !debouncedPattern || result.error) return
    if (result.matches.length > 0) {
      addToHistory({
        toolId: 'regex', toolName: 'Regex Tester', badge: '.*',
        categoryName: 'Utilidades',
        description: `/${debouncedPattern}/ → ${result.matches.length} coincidencias`,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput])

  function toggleFlag(f: Flag) {
    setFlags(prev => {
      const next = new Set(prev)
      next.has(f) ? next.delete(f) : next.add(f)
      return next
    })
  }

  return (
    <ToolLayout toolId="regex" hideSplit>
      <div className={s.layout}>
        {/* Pattern input */}
        <div className={s.patternRow}>
          <span className={s.slash}>/</span>
          <input
            className={s.patternInput}
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="[A-Z]\w+"
            spellCheck={false}
          />
          <span className={s.slash}>/</span>
          <div className={s.flags}>
            {ALL_FLAGS.map(f => (
              <button
                key={f}
                className={`${s.flagBtn} ${flags.has(f) ? s.flagActive : ''}`}
                onClick={() => toggleFlag(f)}
                title={{ g: t.regexGlobal, i: t.regexCaseInsensitive, m: t.regexMultiline, s: t.regexDotAll }[f]}
              >{f}</button>
            ))}
          </div>
        </div>
        {result.error && <span className={ts.error}>{result.error === 'regex_invalid' ? t.regexInvalid : result.error}</span>}

        {/* Test string */}
        <div className={s.section}>
          <div className={s.sectionLabel}>{t.regexInput}</div>
          <textarea
            className={`${ts.textarea} ${s.testArea}`}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t.regexInputPlaceholder}
            spellCheck={false}
          />
        </div>

        {/* Highlighted result */}
        {input && (
          <div className={s.section}>
            <div className={s.sectionLabel}>
              {t.regexMatches}
              {result.matches.length > 0 && <span className={s.matchCount}>{result.matches.length}</span>}
            </div>
            <div className={s.highlighted}>
              {result.highlighted.map((seg, i) =>
                seg.match
                  ? <mark key={i} className={s.mark}>{seg.text}</mark>
                  : <span key={i}>{seg.text}</span>
              )}
            </div>
          </div>
        )}

        {/* Groups */}
        {result.matches.length > 0 && result.matches[0].length > 1 && (
          <div className={s.section}>
            <div className={s.sectionLabel}>{t.regexGroups}</div>
            <div className={s.groups}>
              {result.matches[0].slice(1).map((g, i) => (
                <div key={i} className={s.groupRow}>
                  <span className={s.groupIdx}>#{i + 1}</span>
                  <code className={s.groupVal}>{g ?? <em>undefined</em>}</code>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
