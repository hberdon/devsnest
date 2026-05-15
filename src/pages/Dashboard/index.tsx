import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { ALL_TOOLS, type ToolMeta } from '@/tools/registry'
import { useDevTools, type HistoryEntry } from '@/store/devtools.context'
import s from './Dashboard.module.css'

// ── Inline search ──────────────────────────────────────────────────────────

function searchTools(q: string): ToolMeta[] {
  const t = q.trim().toLowerCase()
  if (!t) return []
  return ALL_TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(t) ||
    tool.description.toLowerCase().includes(t) ||
    tool.badge.toLowerCase().includes(t)
  ).slice(0, 8)
}

function HeroSearch() {
  const [query,    setQuery]    = useState('')
  const [active,   setActive]   = useState(-1)
  const [focused,  setFocused]  = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const results = searchTools(query)
  const showDrop = focused && query.trim() !== ''

  const go = useCallback((tool: ToolMeta) => {
    setQuery('')
    setActive(-1)
    navigate(`/tools/${tool.id}`)
  }, [navigate])

  function onKey(e: React.KeyboardEvent) {
    if (!showDrop) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(v => Math.min(v + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(v => Math.max(v - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const tool = active >= 0 ? results[active] : results[0]
      if (tool) go(tool)
    } else if (e.key === 'Escape') {
      setQuery('')
      setActive(-1)
      inputRef.current?.blur()
    }
  }

  return (
    <div className={s.searchWrap}>
      <div className={`${s.searchBox} ${focused ? s.searchFocused : ''}`}>
        <Icon name="search" size={20} color="var(--color-muted)" />
        <input
          ref={inputRef}
          className={s.searchInput}
          value={query}
          onChange={e => { setQuery(e.target.value); setActive(-1) }}
          onKeyDown={onKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="convertir base64, formatear json, generar uuid…"
          autoComplete="off"
          spellCheck={false}
        />
        {query
          ? <button className={s.clearBtn} onMouseDown={e => { e.preventDefault(); setQuery(''); setActive(-1); inputRef.current?.focus() }}>
              <Icon name="close" size={13} />
            </button>
          : <span className={s.searchKbd}>⌘F en sidebar</span>
        }
      </div>

      {showDrop && (
        <div className={s.dropdown}>
          {results.length === 0 ? (
            <div className={s.dropEmpty}>Sin resultados para «{query}»</div>
          ) : (
            results.map((tool, i) => (
              <div
                key={tool.id}
                className={`${s.dropItem} ${i === active ? s.dropActive : ''}`}
                onMouseDown={e => { e.preventDefault(); go(tool) }}
                onMouseEnter={() => setActive(i)}
              >
                <span className={s.dropBadge}>{tool.badge}</span>
                <span className={s.dropName}>{tool.name}</span>
                <span className={s.dropCat}>{tool.categoryId}</span>
                <span className={s.dropDesc}>{tool.description}</span>
                <Icon name="arrow-r" size={13} color="var(--color-muted)" />
              </div>
            ))
          )}
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
  const handleCopy = () => navigator.clipboard.writeText(entry.description).catch(() => {})
  return (
    <div className={s.row}>
      <div className={`${s.rowBadge} ${isPinned ? s.pinned : s.regular}`}>{entry.badge}</div>
      <span className={s.rowName}>{entry.toolName}</span>
      <span className={s.rowCat}>{entry.categoryName}</span>
      <span className={s.rowDesc}>· {entry.description}</span>
      <span className={s.rowTime}>{entry.timestamp}</span>
      <div className={s.rowActions}>
        <button className={s.actionBtn} title="Abrir" onClick={onReopen}><Icon name="chev-r" size={12} /></button>
        <button className={s.actionBtn} title="Copiar resultado" onClick={handleCopy}><Icon name="copy" size={12} /></button>
        <button className={`${s.actionBtn} ${isPinned ? s.pinActive : ''}`} title={isPinned ? 'Quitar de anclados' : 'Anclar'} onClick={isPinned ? onUnpin : onPin}>
          <Icon name="pin" size={12} color={isPinned ? '#fff' : 'currentColor'} strokeWidth={2} />
        </button>
        {!isPinned && <button className={s.actionBtn} title="Eliminar" onClick={onRemove}><Icon name="close" size={12} /></button>}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { history, pinned, pin, unpin, removeFromHistory, clearHistory } = useDevTools()
  const navigate = useNavigate()

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1 className={s.heroTitle}>Hola, dev 👋</h1>
        <p className={s.heroSub}>28 herramientas · sin cuenta · todo se procesa en tu navegador</p>
        <HeroSearch />
      </div>

      {pinned.length > 0 && (
        <div className={s.section}>
          <div className={s.sectionHeader}>
            <Icon name="pin" size={15} color="var(--color-accent2)" strokeWidth={2} />
            <span className={s.sectionTitle}>Anclados</span>
            <span className={s.sectionNote}>· también en la barra lateral</span>
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
          <span className={s.sectionTitle}>Historial</span>
          <span className={s.sectionNote}>· últimos {Math.min(5, history.length)}</span>
          {history.length > 0 && <button className={s.clearHistBtn} onClick={clearHistory}>Limpiar historial</button>}
        </div>
        {history.length > 0 ? (
          <div className={s.list}>
            {history.slice(0, 5).map((entry, i, arr) => (
              <div key={entry.id} className={i < arr.length - 1 ? s.listDivider : undefined}>
                <HistoryRow entry={entry} isPinned={false} onPin={() => pin(entry.id)} onRemove={() => removeFromHistory(entry.id)} onReopen={() => navigate(`/tools/${entry.toolId}`)} />
              </div>
            ))}
          </div>
        ) : (
          <div className={s.empty}>Sin actividad reciente — usa una herramienta y aparecerá aquí.</div>
        )}
      </div>

      <div className={s.annotation}>
        ↑ click en 📌 mueve la fila a &quot;Anclados&quot;.<br />pruébalo.
      </div>
    </div>
  )
}
