import { type ReactNode, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { LangPicker } from '@/components/LangPicker'
import { CmdKButton } from '@/components/CmdKButton'
import { SplitModeContext, type SplitMode } from '@/components/SplitPane'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useDevTools } from '@/store/devtools.context'
import { useLang } from '@/store/lang.context'
import { useLocalizedRegistry } from '@/hooks/useLocalizedRegistry'
import { ToolName } from '@/components/ToolName'
import s from './ToolLayout.module.css'

interface ToolLayoutProps {
  toolId: string
  children: ReactNode
  actions?: ReactNode
  hideSplit?: boolean
}

export function ToolLayout({ toolId, children, actions, hideSplit }: ToolLayoutProps) {
  const { getToolById, getCategoryById } = useLocalizedRegistry()
  const tool     = getToolById(toolId)
  const category = tool ? getCategoryById(tool.categoryId) : undefined
  const { pinned, pinTool, unpin } = useDevTools()
  const { t } = useLang()
  const [splitMode, setSplitMode] = useLocalStorage<SplitMode>(`split-${toolId}`, 'v')

  const isPinned = pinned.some(e => e.toolId === toolId)

  useEffect(() => {
    if (!tool) return
    const title = `${tool.name} — devsnest`
    const desc  = `${tool.description} — devsnest`
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc)
    return () => {
      document.title = 'devsnest'
      document.querySelector('meta[name="description"]')?.setAttribute('content', '28 herramientas para desarrolladores: JSON, JWT, Base64, UUID, Regex, SQL, QR y más. Sin cuenta, sin backend, 100% en tu navegador.')
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'devsnest — 28 herramientas para devs')
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', 'JSON, JWT, Base64, UUID, Regex, SQL, QR y más. Sin cuenta, 100% en tu navegador.')
    }
  }, [tool?.name, tool?.description])

  function handlePinToggle() {
    const entry = pinned.find(e => e.toolId === toolId)
    if (isPinned && entry) {
      unpin(entry.id)
    } else if (tool && category) {
      pinTool(toolId, { toolName: tool.name, badge: tool.badge, categoryName: category.name })
    }
  }

  if (!tool) return <div style={{ padding: 32, color: 'var(--color-muted)' }}>{t.toolNotFound}</div>

  return (
    <SplitModeContext.Provider value={splitMode}>
      <div className={s.layout}>
        {/* Breadcrumb */}
        <nav className={s.breadcrumb}>
          <Link to="/">{t.home}</Link>
          <span>›</span>
          <span>{category?.name}</span>
          <span>›</span>
          <ToolName name={tool.name} className={s.breadcrumbActive} />
          <div className={s.breadcrumbActions}>
            <CmdKButton className={s.searchBtn} label={t.searchTool} iconSize={14} />
            <LangPicker />
          </div>
        </nav>

        {/* Header */}
        <div className={s.header}>
          <div className={s.badge}>{tool.badge}</div>
          <div className={s.titleBlock}>
            <div className={s.titleRow}>
              <ToolName name={tool.name} large />
              <button
                className={`${s.pinBtn} ${isPinned ? s.pinned : ''}`}
                title={isPinned ? t.unpin : t.pin}
                onClick={handlePinToggle}
              >
                <Icon name="pin-fill" size={18} strokeWidth={2} />
              </button>
            </div>
            <div className={s.subtitle}>{tool.description}</div>
          </div>

          <div className={s.actions}>
            {actions}
            {!hideSplit && (
              <div className={s.splitToggle}>
                <button
                  className={`${s.splitBtn} ${splitMode === 'v' ? s.splitActive : ''}`}
                  title={t.splitV}
                  onClick={() => setSplitMode('v')}
                >
                  <Icon name="split-v" size={14} color={splitMode === 'v' ? 'var(--color-surface)' : 'var(--color-ink)'} />
                </button>
                <button
                  className={`${s.splitBtn} ${splitMode === 'h' ? s.splitActive : ''}`}
                  title={t.splitH}
                  onClick={() => setSplitMode('h')}
                >
                  <Icon name="split-h" size={14} color={splitMode === 'h' ? 'var(--color-surface)' : 'var(--color-ink)'} />
                </button>
              </div>
            )}
            <button className={s.moreBtn} title={t.moreOptions}>
              <Icon name="more" size={16} color="var(--color-ink2)" />
            </button>
          </div>
        </div>

        {/* Tool body */}
        <div className={s.body}>
          {children}
        </div>
      </div>
    </SplitModeContext.Provider>
  )
}
