import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { type CategoryId } from '@/tools/registry'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useDevTools } from '@/store/devtools.context'
import { useLang } from '@/store/lang.context'
import { useLocalizedRegistry } from '@/hooks/useLocalizedRegistry'
import s from './Sidebar.module.css'

const DEFAULT_EXPANDED = new Set<CategoryId>(['conv'])

export function Sidebar() {
  const [collapsed, setCollapsed] = useLocalStorage('sidebar-collapsed', false)
  const [expanded, setExpanded]   = useState<Set<CategoryId>>(DEFAULT_EXPANDED)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { pinned } = useDevTools()
  const { t } = useLang()
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
        <div className={s.logoBadge} style={{ cursor: 'pointer', marginBottom: 6 }} onClick={() => setCollapsed(false)}>
          {'</>'}
        </div>

        {/* Anclados */}
        {pinned.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Icon name="pin-fill" size={11} color="#dc2626" />
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
          <div
            className={`${s.railCell} ${s.railDashed}`}
            style={{ height: 34, width: 42, cursor: 'pointer' }}
            title={t.expand}
            onClick={() => setCollapsed(false)}
          >
            <Icon name="cat-conv" size={14} />
          </div>
          <div className={s.collapsedAvatar}>JD</div>
        </div>
      </aside>
    )
  }

  // ── Expanded ───────────────────────────────────────────────────────────────
  return (
    <aside className={`${s.sidebar} ${s.expanded}`}>
      <div className={s.logoRow}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit', flex: 1 }}>
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
                <span style={{ flex: 1 }}>{entry.toolName}</span>
                <Icon name="pin-fill" size={11} color="#dc2626" />
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
                <div
                  className={s.catRow}
                  onClick={() => toggleCategory(cat.id)}
                  style={{ fontWeight: hasActiveTool ? 600 : undefined }}
                >
                  <Icon name="chev-d" size={15} className={`${s.catChev} ${isOpen ? s.open : s.closed}`} />
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
                          {(tool.id === 'img-base64' || tool.id === 'pdf-base64')
                            ? <Icon name="cat-conv" size={11} color="var(--color-muted)" />
                            : <span className={s.catDot}>·</span>
                          }
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

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className={s.footer}>
        <div className={s.avatar}>JD</div>
        <div className={s.footerInfo}>
          <div className={s.footerName}>Jane Dev</div>
          <div className={s.footerPlan}>Plan free</div>
        </div>
        <button className={s.settingsBtn} title="Ajustes">
          <Icon name="settings" size={14} />
        </button>
      </div>
    </aside>
  )
}
