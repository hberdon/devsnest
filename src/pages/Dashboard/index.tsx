import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { LangPicker } from '@/components/LangPicker'
import type { ToolMeta } from '@/tools/registry'
import { useDevTools, type HistoryEntry } from '@/store/devtools.context'
import { useLang } from '@/store/lang.context'
import { useLocalizedRegistry } from '@/hooks/useLocalizedRegistry'
import s from './Dashboard.module.css'

// ── Search utils ───────────────────────────────────────────────────────────

function score(tool: ToolMeta, q: string): number {
  if (!q) return 1
  const name  = tool.name.toLowerCase()
  const desc  = tool.description.toLowerCase()
  const badge = tool.badge.toLowerCase()
  const query = q.toLowerCase()
  if (name === query)         return 10
  if (badge === query)        return 9
  if (name.startsWith(query)) return 8
  if (name.includes(query))   return 6
  if (desc.includes(query))   return 3
  return 0
}

function highlight(text: string, query: string): ReactNode {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className={s.mark}>{text.slice(idx, idx + query.length)}</mark>
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
      id={`result-${tool.id}`}
      role="option"
      aria-selected={isSelected}
      className={`${s.resultRow} ${isSelected ? s.resultSelected : ''}`}
      onMouseDown={e => { e.preventDefault(); onClick() }}
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

// ── Hero search — input directo, dropdown cuelga de él ────────────────────

function HeroSearch() {
  const [query,    setQuery]    = useState('')
  const [selected, setSelected] = useState(0)
  const [focused,  setFocused]  = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { t } = useLang()
  const { allTools } = useLocalizedRegistry()

  const results = useMemo(() =>
    allTools
      .map(tool => ({ tool, score: score(tool, query) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.tool),
    [allTools, query]
  )

  const top    = results[0]
  const others = results.slice(1, 8)

  const close = useCallback(() => {
    setFocused(false)
    setQuery('')
    setSelected(0)
    inputRef.current?.blur()
  }, [])

  const goTo = useCallback((toolId: string) => {
    navigate(`/tools/${toolId}`)
    close()
  }, [navigate, close])

  useEffect(() => {
    if (!focused) return
    const total = results.length
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(i => Math.min(i + 1, total - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(i => Math.max(i - 1, 0)) }
      if (e.key === 'Enter')     { e.preventDefault(); if (results[selected]) goTo(results[selected].id) }
      if (e.key === 'Escape')    { e.preventDefault(); close() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focused, results, selected, goTo, close])

  return (
    <div className={s.searchWrap}>
      {focused && <div className={s.searchBackdrop} onMouseDown={close} />}

      <div className={`${s.heroSearch} ${focused ? s.heroSearchFocused : ''}`}>
        <Icon name="search" size={20} color="var(--color-muted)" />
        <input
          ref={inputRef}
          className={s.heroInput}
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(0) }}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setQuery(''); setSelected(0) }}
          placeholder={t.searchPlaceholder}
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={focused}
          aria-controls="hero-search-results"
          aria-activedescendant={focused && results[selected] ? `result-${results[selected].id}` : undefined}
        />
        {query
          ? <button className={s.clearBtn} onMouseDown={e => { e.preventDefault(); setQuery(''); setSelected(0); inputRef.current?.focus() }}>
              <Icon name="close" size={13} />
            </button>
          : <kbd className={s.searchKbd}>⌘K</kbd>
        }
      </div>

      {focused && (
        <div className={s.inlinePalette}>
          <div className={s.paletteResults} role="listbox" id="hero-search-results">
            {results.length === 0 ? (
              <div className={s.noResults}>{t.cmdNoResults} «{query}»</div>
            ) : (
              <>
                {top && (
                  <>
                    <div className={s.sectionLabel}>{t.cmdBestMatch}</div>
                    <ResultRow tool={top} query={query} isSelected={selected === 0} showEnter onClick={() => goTo(top.id)} />
                  </>
                )}
                {others.length > 0 && (
                  <>
                    <div className={s.sectionLabel}>{t.cmdOthers}</div>
                    {others.map((tool, i) => (
                      <ResultRow key={tool.id} tool={tool} query={query} isSelected={selected === i + 1} onClick={() => goTo(tool.id)} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
          <div className={s.paletteFooter}>
            <span><span className={s.footerKbd}>↑↓</span> {t.cmdNavigate}</span>
            <span><span className={s.footerKbd}>↵</span> {t.cmdOpen}</span>
            <span><span className={s.footerKbd}>esc</span> {t.cmdClose}</span>
            <span className={s.footerCount}>{results.length} / {allTools.length}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── History row ────────────────────────────────────────────────────────────

interface HistoryRowProps {
  entry: HistoryEntry
  isPinned: boolean
  onPin?: () => void
  onUnpin?: () => void
  onRemove?: () => void
  onReopen?: () => void
}

function HistoryRow({ entry, isPinned, onPin, onUnpin, onRemove, onReopen }: HistoryRowProps) {
  const { t } = useLang()
  const handleCopy = () => navigator.clipboard.writeText(entry.description).catch(() => {})
  return (
    <div className={s.row}>
      <div className={`${s.rowBadge} ${isPinned ? s.pinned : s.regular}`}>{entry.badge}</div>
      <span className={s.rowName}>{entry.toolName}</span>
      <span className={s.rowCat}>{entry.categoryName}</span>
      <span className={s.rowDesc}>· {entry.description}</span>
      <span className={s.rowTime}>{entry.timestamp}</span>
      <div className={s.rowActions}>
        <button className={s.actionBtn} title={t.openTool} onClick={onReopen}><Icon name="chev-r" size={12} /></button>
        <button className={s.actionBtn} title={t.copyResult} onClick={handleCopy}><Icon name="copy" size={12} /></button>
        <button className={`${s.actionBtn} ${isPinned ? s.pinActive : ''}`} title={isPinned ? t.unpin : t.pin} onClick={isPinned ? onUnpin : onPin}>
          <Icon name="pin-fill" size={14} color={isPinned ? 'var(--color-surface)' : 'var(--color-err)'} strokeWidth={2} />
        </button>
        {!isPinned && <button className={s.actionBtn} title={t.removeTool} onClick={onRemove}><Icon name="close" size={12} /></button>}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { history, pinned, pin, unpin, removeFromHistory, clearHistory } = useDevTools()
  const navigate = useNavigate()
  const { t } = useLang()

  return (
    <div className={s.page}>
      <div className={s.topBar}>
        <LangPicker />
      </div>

      <div className={s.hero}>
        <h1 className={s.heroTitle}>{t.heroTitle}</h1>
        <p className={s.heroSub}>{t.heroSub}</p>
        <HeroSearch />
      </div>

      {pinned.length > 0 && (
        <div className={s.section}>
          <div className={s.sectionHeader}>
            <Icon name="pin-fill" size={17} color="var(--color-err)" strokeWidth={2} />
            <span className={s.sectionTitle}>{t.pinned}</span>
            <span className={s.sectionNote}>{t.alsoInSidebar}</span>
            <span className={s.sectionCount}>{pinned.length}</span>
          </div>
          <div className={s.list}>
            {pinned.map((entry, i) => (
              <div key={entry.id} className={i < pinned.length - 1 ? s.listDivider : undefined}>
                <HistoryRow entry={entry} isPinned onUnpin={() => unpin(entry.id)} onReopen={() => navigate(`/tools/${entry.toolId}`)} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={s.section}>
        <div className={s.sectionHeader}>
          <Icon name="clock" size={15} color="var(--color-ink)" />
          <span className={s.sectionTitle}>{t.history}</span>
          <span className={s.sectionNote}>{t.historyLastN} {Math.min(8, history.length)}</span>
          {history.length > 0 && <button className={s.clearHistBtn} onClick={clearHistory}>{t.clearHistory}</button>}
        </div>
        {history.length > 0 ? (
          <div className={s.list}>
            {history.slice(0, 8).map((entry, i, arr) => (
              <div key={entry.id} className={i < arr.length - 1 ? s.listDivider : undefined}>
                <HistoryRow entry={entry} isPinned={false} onPin={() => pin(entry.id)} onRemove={() => removeFromHistory(entry.id)} onReopen={() => navigate(`/tools/${entry.toolId}`)} />
              </div>
            ))}
          </div>
        ) : (
          <div className={s.empty}>{t.noHistory}</div>
        )}
      </div>

      <div className={s.annotation}>
        ↑ click en 📌 mueve la fila a &quot;Anclados&quot;.<br />pruébalo.
      </div>
    </div>
  )
}
