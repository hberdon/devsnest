import { useState, useEffect, useRef, useDeferredValue, useMemo, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import type { ToolMeta } from '@/tools/registry'
import { useCmdK } from '@/store/cmd-palette.context'
import { useLang } from '@/store/lang.context'
import { useLocalizedRegistry } from '@/hooks/useLocalizedRegistry'
import s from './CommandPalette.module.css'

// ── Scoring + highlight ────────────────────────────────────────────────────

function score(tool: ToolMeta, q: string): number {
  if (!q) return 1
  const name  = tool.name.toLowerCase()
  const desc  = tool.description.toLowerCase()
  const badge = tool.badge.toLowerCase()
  const query = q.toLowerCase()
  if (name === query)            return 10
  if (badge === query)           return 9
  if (name.startsWith(query))    return 8
  if (name.includes(query))      return 6
  if (desc.includes(query))      return 3
  return 0
}

function highlight(text: string, query: string): ReactNode {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

// ── ResultRow ─────────────────────────────────────────────────────────────

interface ResultRowProps {
  tool: ToolMeta
  query: string
  isSelected: boolean
  showEnter?: boolean
  onClick: () => void
}

function ResultRow({ tool, query, isSelected, showEnter, onClick }: ResultRowProps) {
  return (
    <div
      className={`${s.resultRow} ${isSelected ? s.selected : ''}`}
      onClick={onClick}
    >
      <span className={s.resultBadge}>{tool.badge}</span>
      <div className={s.resultInfo}>
        <div className={s.resultName}>{highlight(tool.name, query)}</div>
        <div className={s.resultSub}>{tool.categoryId} · {tool.description}</div>
      </div>
      {showEnter && isSelected && <span className={s.enterBadge}>↵</span>}
    </div>
  )
}

// ── PaletteContent — shared inner UI, usable inline or inside a modal ─────

interface PaletteContentProps {
  onClose: () => void
}

export function PaletteContent({ onClose }: PaletteContentProps) {
  const [query, setQuery]       = useState('')
  const deferredQuery           = useDeferredValue(query)
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { t } = useLang()
  const { allTools: ALL_TOOLS } = useLocalizedRegistry()

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  const results = useMemo(() =>
    ALL_TOOLS
      .map(tool => ({ tool, score: score(tool, deferredQuery) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.tool),
    [ALL_TOOLS, deferredQuery]
  )

  const top    = results[0]
  const others = results.slice(1, 8)

  function goTo(toolId: string) {
    navigate(`/tools/${toolId}`)
    onClose()
  }

  useEffect(() => {
    const total = results.length
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(i => Math.min(i + 1, total - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(i => Math.max(i - 1, 0)) }
      if (e.key === 'Enter')     { e.preventDefault(); if (results[selected]) goTo(results[selected].id) }
      if (e.key === 'Escape')    { e.preventDefault(); onClose() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [results, selected]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className={s.inputRow}>
        <Icon name="search" size={18} color="var(--color-ink)" />
        <input
          ref={inputRef}
          className={s.input}
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(0) }}
          placeholder={t.cmdPlaceholder}
          aria-label={t.cmdPaletteLabel}
        />
        <span className={s.escBadge}>esc</span>
      </div>

      <div className={s.results}>
        {results.length === 0 ? (
          <div className={s.noResults}>{t.cmdNoResults} «{deferredQuery}»</div>
        ) : (
          <>
            {top && (
              <>
                <div className={s.sectionLabel}>{t.cmdBestMatch}</div>
                <ResultRow tool={top} query={deferredQuery} isSelected={selected === 0} showEnter onClick={() => goTo(top.id)} />
              </>
            )}
            {others.length > 0 && (
              <>
                <div className={s.sectionLabel}>{t.cmdOthers}</div>
                {others.map((tool, i) => (
                  <ResultRow key={tool.id} tool={tool} query={deferredQuery} isSelected={selected === i + 1} onClick={() => goTo(tool.id)} />
                ))}
              </>
            )}
          </>
        )}
      </div>

      <div className={s.footer}>
        <span><span className={s.footerKbd}>↑↓</span> {t.cmdNavigate}</span>
        <span><span className={s.footerKbd}>↵</span> {t.cmdOpen}</span>
        <span><span className={s.footerKbd}>esc</span> {t.cmdClose}</span>
        <span className={s.footerCount}>{results.length} / {ALL_TOOLS.length}</span>
      </div>
    </>
  )
}

// ── CommandPalette — modal wrapper ────────────────────────────────────────

export function CommandPalette() {
  const { isOpen, close } = useCmdK()

  if (!isOpen) return null

  return (
    <div className={s.overlay} onMouseDown={e => { if (e.target === e.currentTarget) close() }}>
      <div
        className={s.palette}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={e => { if (e.key === 'Tab') e.preventDefault() }}
      >
        <PaletteContent onClose={close} />
      </div>
    </div>
  )
}
