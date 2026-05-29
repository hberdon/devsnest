import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { type CategoryId } from '@/tools/registry'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useDevTools } from '@/store/devtools.context'
import { useLang } from '@/store/lang.context'
import { useTheme } from '@/store/theme.context'
import { useLocalizedRegistry } from '@/hooks/useLocalizedRegistry'
import { ToolName } from '@/components/ToolName'
import s from './Sidebar.module.css'

const DEFAULT_EXPANDED = new Set<CategoryId>(['conv'])

export function Sidebar() {
  const [collapsed, setCollapsed]         = useLocalStorage('sidebar-collapsed', false)
  const [expanded, setExpanded]           = useState<Set<CategoryId>>(DEFAULT_EXPANDED)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const location  = useLocation()
  const { pinned } = useDevTools()
  const { t } = useLang()
  const { mode, setMode, palette, palettes, setPalette } = useTheme()
  const { visibleCategories: CATEGORIES } = useLocalizedRegistry()
  const activeToolId = location.pathname.startsWith('/tools/')
    ? location.pathname.slice('/tools/'.length)
    : null

  function toggleCategory(id: CategoryId) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── Collapsed ─────────────────────────────────────────────────────────────
  if (collapsed) {
    return (
      <aside className={`${s.sidebar} ${s.collapsed}`}>
        {/* Logo */}
        <button className={s.logoBadge} style={{ marginBottom: 6 }} onClick={() => setCollapsed(false)} aria-label={t.expand}>
          {'</>'}
        </button>

        {/* Anclados */}
        {pinned.length > 0 && (
          <div className={s.collapsedPinned}>
            <Icon name="pin-fill" size={11} color="var(--color-err)" />
            {pinned.slice(0, 3).map(entry => (
              <Link
                key={entry.id}
                to={`/tools/${entry.toolId}`}
                title={entry.toolName}
                aria-label={entry.toolName}
                className={`${s.railCell} ${s.railCellPinned} ${entry.toolId === activeToolId ? s.railActive : ''}`}
              >
                <span className={s.railBadge}>{entry.badge}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Separador — entre anclados y categorías */}
        <div className={s.separator} />

        {/* Categorías */}
        <div className={s.collapsedCats}>
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
            type="button"
            className={`${s.railCell} ${s.railDashed} ${s.railCellFooter}`}
            title={t.expand}
            aria-label={t.expand}
            onClick={() => setCollapsed(false)}
          >
            <Icon name="cat-conv" size={14} />
          </button>
          <button
            className={`${s.railCell} ${s.railCellTheme}`}
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            title={mode === 'light' ? 'Dark mode' : 'Light mode'}
            aria-label={mode === 'light' ? 'Dark mode' : 'Light mode'}
          >
            <Icon name={mode === 'light' ? 'sun' : 'moon'} size={16} />
          </button>
          {(() => {
            const activePalette = palettes.find(p => p.id === palette)
            const dot = activePalette ? (mode === 'dark' ? activePalette.dark : activePalette.light) : 'var(--color-accent)'
            return (
              <button
                className={s.collapsedDotBtn}
                title="Cambiar paleta"
                aria-label="Cambiar paleta"
                onClick={() => setCollapsed(false)}
              >
                <span className={s.collapsedDot} style={{ background: dot }} />
              </button>
            )
          })()}
        </div>
      </aside>
    )
  }

  // ── Expanded ───────────────────────────────────────────────────────────────
  return (
    <aside className={`${s.sidebar} ${s.expanded}`}>
      <div className={s.logoRow}>
        <Link to="/" className={s.logoLink}>
          <div className={s.logoBadge}>{'</>'}</div>
          <span className={s.logoWordmark}>devsnest</span>
        </Link>
        <button className={s.collapseBtn} title={t.collapseAll} onClick={() => setCollapsed(true)}>
          <Icon name="cat-conv" size={14} />
        </button>
      </div>

      {pinned.length > 0 && (
        <div>
          <div className={s.sectionHeader}>
            <span>{t.pinned}</span>
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
                <span className={s.flex1}>{entry.toolName}</span>
                <Icon name="pin-fill" size={11} color="var(--color-err)" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className={s.categories}>
        <div className={s.sectionHeader}>
          <span>{t.categories}</span>
          <button
            className={s.collapseAllBtn}
            title={expanded.size > 0 ? t.collapseAll : t.expandAll}
            onClick={() => setExpanded(expanded.size > 0 ? new Set() : new Set(CATEGORIES.map(c => c.id)))}
          >
            <Icon name={expanded.size > 0 ? 'chev-d' : 'chev-r'} size={12} />
          </button>
        </div>
        <div className={s.categoriesScroll}>
          {CATEGORIES.map(cat => {
            const isOpen        = expanded.has(cat.id)
            const hasActiveTool = cat.tools.some(t => t.id === activeToolId)
            return (
              <div key={cat.id}>
                <button
                  type="button"
                  className={s.catRow}
                  onClick={() => toggleCategory(cat.id)}
                  style={{ fontWeight: hasActiveTool ? 600 : undefined }}
                >
                  <Icon name="chev-d" size={15} className={`${s.catChev} ${isOpen ? s.open : s.closed}`} />
                  <Icon name={cat.icon} size={15} />
                  <span className={s.flex1}>{cat.name}</span>
                  <span className={s.catToolCount}>{cat.tools.length}</span>
                </button>
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
                          <ToolName name={tool.name} className={tool.name.includes('↔') ? s.inlineToolName : s.flex1} />
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

      {/* ── Theme Picker ─────────────────────────────────────────────────── */}
      {showThemePicker && (
        <div className={s.themePickerPanel}>
          <span className={s.themePickerTitle}>Tema</span>
          {palettes.map(p => {
            const isActive = palette === p.id
            const dot = mode === 'dark' ? p.dark : p.light
            return (
              <div key={p.id} className={`${s.themePickerRow} ${isActive ? s.themePickerRowActive : ''}`}>
                <button
                  type="button"
                  className={s.themePickerPaletteBtn}
                  onClick={() => setPalette(p.id)}
                  aria-pressed={isActive}
                >
                  <span className={s.themePickerDot} style={{ background: dot }} />
                  <span>{p.label}</span>
                </button>
                <div className={s.themePickerModeToggle}>
                  <button
                    type="button"
                    className={`${s.themePickerModeBtn} ${isActive && mode === 'light' ? s.themePickerModeBtnActive : ''}`}
                    onClick={() => { setPalette(p.id); setMode('light') }}
                    aria-label="Light mode"
                  ><Icon name="sun" size={11} /></button>
                  <button
                    type="button"
                    className={`${s.themePickerModeBtn} ${isActive && mode === 'dark' ? s.themePickerModeBtnActive : ''}`}
                    onClick={() => { setPalette(p.id); setMode('dark') }}
                    aria-label="Dark mode"
                  ><Icon name="moon" size={11} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className={s.footer}>
        <button
          type="button"
          className={`${s.settingsBtn} ${showThemePicker ? s.settingsBtnActive : ''}`}
          title={showThemePicker ? 'Cerrar' : 'Cambiar tema'}
          aria-label="Cambiar tema"
          aria-expanded={showThemePicker}
          onClick={() => setShowThemePicker(v => !v)}
        >
          <Icon name="settings" size={14} />
        </button>
      </div>
    </aside>
  )
}
