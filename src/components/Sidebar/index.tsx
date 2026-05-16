import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { CATEGORIES, type CategoryId } from '@/tools/registry'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useDevTools } from '@/store/devtools.context'
import { useCmdK } from '@/store/cmd-palette.context'
import { useTheme } from '@/store/theme.context'
import s from './Sidebar.module.css'

const DEFAULT_EXPANDED = new Set<CategoryId>(['conv'])

export function Sidebar() {
  const [collapsed, setCollapsed] = useLocalStorage('sidebar-collapsed', false)
  const [expanded, setExpanded]   = useState<Set<CategoryId>>(DEFAULT_EXPANDED)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { pinned } = useDevTools()
  const { open: openCmdK } = useCmdK()
  const { palette, mode, palettes, setPalette, setMode } = useTheme()

  const isDashboard  = location.pathname === '/'
  const activeToolId = location.pathname.startsWith('/tools/')
    ? location.pathname.slice('/tools/'.length)
    : null

  const currentPalette = palettes.find(p => p.id === palette)!

  function toggleCategory(id: CategoryId) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function cyclePalette() {
    const idx = palettes.findIndex(p => p.id === palette)
    setPalette(palettes[(idx + 1) % palettes.length].id)
  }

  // ── Collapsed ─────────────────────────────────────────────────────────────
  if (collapsed) {
    return (
      <aside className={`${s.sidebar} ${s.collapsed}`}>
        {/* Logo */}
        <div className={s.logoBadge} style={{ cursor: 'pointer', marginBottom: 6 }} onClick={() => setCollapsed(false)}>
          {'</>'}
        </div>

        {/* ⌘K — solo fuera del dashboard */}
        {!isDashboard && (
          <div className={`${s.railCell} ${s.railDashed}`} title="⌘K · Buscar" style={{ height: 36, width: 42 }} onClick={openCmdK}>
            <Icon name="search" size={16} />
          </div>
        )}

        {/* Anclados */}
        {pinned.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Icon name="pin" size={11} color="var(--color-accent2)" strokeWidth={2} />
            {pinned.slice(0, 3).map(entry => (
              <div
                key={entry.id}
                title={entry.toolName}
                className={`${s.railCell} ${entry.toolId === activeToolId ? s.railActive : ''}`}
                style={{ height: 38, width: 42, cursor: 'pointer' }}
                onClick={() => navigate(`/tools/${entry.toolId}`)}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--color-ink)' }}>
                  {entry.badge}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Separador — entre anclados y categorías */}
        <div className={s.separator} />

        {/* Categorías */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, overflow: 'hidden' }}>
          {CATEGORIES.map(cat => {
            const isActive = cat.tools.some(t => t.id === activeToolId)
            return (
              <div
                key={cat.id}
                title={cat.name}
                className={`${s.railCell} ${isActive ? s.railActive : ''}`}
                style={{ height: 42, width: 42 }}
              >
                <Icon name={cat.icon} size={20} />
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className={s.collapsedFooter}>
          <button
            className={s.collapsedDotBtn}
            title={`${currentPalette.label} · Click para cambiar paleta`}
            onClick={cyclePalette}
            style={{ '--dot': mode === 'light' ? currentPalette.light : currentPalette.dark } as React.CSSProperties}
          >
            <span className={s.collapsedDot} />
          </button>
          <button
            className={s.expandBtn}
            title={mode === 'light' ? 'Cambiar a Dark' : 'Cambiar a Light'}
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          >
            {mode === 'light' ? '☀' : '◐'}
          </button>
          <button className={s.expandBtn} title="Expandir sidebar" onClick={() => setCollapsed(false)}>
            <Icon name="sidebar-r" size={14} />
          </button>
        </div>
      </aside>
    )
  }

  // ── Expanded ───────────────────────────────────────────────────────────────
  return (
    <aside className={`${s.sidebar} ${s.expanded}`}>
      <div className={s.logoRow}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', flex: 1 }}>
          <div className={s.logoBadge}>{'</>'}</div>
          <span className={s.logoWordmark}>devsnest</span>
        </Link>
        <button className={s.collapseBtn} title="Colapsar" onClick={() => setCollapsed(true)}>
          <Icon name="sidebar-l" size={14} />
        </button>
      </div>

      {!isDashboard && (
        <button className={s.searchChip} onClick={openCmdK}>
          <Icon name="search" size={13} color="var(--color-muted)" />
          <span>Buscar herramienta</span>
          <span className={s.searchChipKbd}>⌘K</span>
        </button>
      )}

      {pinned.length > 0 && (
        <div>
          <div className={s.sectionHeader}>
            <Icon name="pin" size={12} color="var(--color-accent2)" strokeWidth={2} />
            <span>Anclados</span>
            <span className={s.sectionCount}>{pinned.length}</span>
          </div>
          <div className={s.pinnedSection}>
            {pinned.map(entry => (
              <Link
                key={entry.id}
                to={`/tools/${entry.toolId}`}
                className={`${s.toolRow} ${entry.toolId === activeToolId ? s.toolActive : ''}`}
              >
                <span className={s.toolBadge}>{entry.badge}</span>
                <span style={{ flex: 1 }}>{entry.toolName}</span>
                <Icon name="pin" size={11} color="var(--color-accent2)" strokeWidth={2} />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className={s.categories}>
        <div className={s.sectionHeader}>
          <span>Categorías</span>
        </div>
        <div className={s.categoriesScroll}>
          {CATEGORIES.map(cat => {
            const isOpen        = expanded.has(cat.id)
            const hasActiveTool = cat.tools.some(t => t.id === activeToolId)
            return (
              <div key={cat.id}>
                <div
                  className={s.catRow}
                  onClick={() => toggleCategory(cat.id)}
                  style={{ fontWeight: hasActiveTool ? 600 : undefined }}
                >
                  <Icon name="chev-d" size={12} className={`${s.catChev} ${isOpen ? s.open : s.closed}`} />
                  <Icon name={cat.icon} size={15} />
                  <span style={{ flex: 1 }}>{cat.name}</span>
                  <span className={s.catToolCount}>{cat.tools.length}</span>
                </div>
                {isOpen && (
                  <div className={s.catTools}>
                    {cat.tools.map(tool => {
                      const isActive = tool.id === activeToolId
                      return (
                        <Link
                          key={tool.id}
                          to={`/tools/${tool.id}`}
                          className={`${s.catToolRow} ${isActive ? s.catToolActive : ''}`}
                        >
                          <span className={s.catDot}>·</span>
                          <span style={{ flex: 1 }}>{tool.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Theme picker ─────────────────────────────────────────────────── */}
      <div className={s.footer}>
        <div className={s.themePickerRow}>
          <div className={s.paletteDots}>
            {palettes.map(p => (
              <button
                key={p.id}
                className={`${s.paletteDot} ${palette === p.id ? s.paletteDotActive : ''}`}
                title={p.label}
                onClick={() => setPalette(p.id)}
                style={{ '--dot': mode === 'light' ? p.light : p.dark } as React.CSSProperties}
              />
            ))}
          </div>
          <div className={s.modeToggle}>
            <button
              className={`${s.modeBtn} ${mode === 'light' ? s.modeBtnActive : ''}`}
              onClick={() => setMode('light')}
              title="Light"
            >☀</button>
            <button
              className={`${s.modeBtn} ${mode === 'dark' ? s.modeBtnActive : ''}`}
              onClick={() => setMode('dark')}
              title="Dark"
            >◐</button>
          </div>
        </div>
        <div className={s.themeCurrentLabel}>
          {currentPalette.label} · {mode === 'light' ? 'Light' : 'Dark'}
        </div>
      </div>
    </aside>
  )
}
