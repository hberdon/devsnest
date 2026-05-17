import { type ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { LangPicker } from '@/components/LangPicker'
import { SplitModeContext, type SplitMode } from '@/components/SplitPane'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useDevTools } from '@/store/devtools.context'
import { useCmdK } from '@/store/cmd-palette.context'
import { useLang } from '@/store/lang.context'
import { useLocalizedRegistry } from '@/hooks/useLocalizedRegistry'
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
  const navigate = useNavigate()
  const { open: openCmdK } = useCmdK()
  const { pinned, pin, unpin } = useDevTools()
  const { t } = useLang()
  const [splitMode, setSplitMode] = useLocalStorage<SplitMode>(`split-${toolId}`, 'v')

  const isPinned = pinned.some(e => e.toolId === toolId)

  useEffect(() => {
    if (tool) document.title = `${tool.name} — devsnest`
    return () => { document.title = 'devsnest' }
  }, [tool?.name]) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePinToggle() {
    const entry = pinned.find(e => e.toolId === toolId)
    if (isPinned && entry) {
      unpin(entry.id)
    } else if (tool && category) {
      // Pin creates an entry. Real usage will be added by addToHistory in the tool.
      // Here we just ensure it's bookmarked.
      pin(toolId)
    }
  }

  if (!tool) return <div style={{ padding: 32, color: 'var(--color-muted)' }}>{t.toolNotFound}</div>

  return (
    <SplitModeContext.Provider value={splitMode}>
      <div className={s.layout}>
        {/* Breadcrumb */}
        <nav className={s.breadcrumb}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>{t.home}</span>
          <span>›</span>
          <span>{category?.name}</span>
          <span>›</span>
          <span className={s.breadcrumbActive}>{tool.name}</span>
          <div className={s.breadcrumbActions}>
            <button className={s.searchBtn} onClick={openCmdK}>
              <Icon name="search" size={14} color="currentColor" />
              <span>{t.searchTool}</span>
              <kbd className={s.searchKbd}>Ctrl+F</kbd>
            </button>
            <LangPicker />
          </div>
        </nav>

        {/* Header */}
        <div className={s.header}>
          <div className={s.badge}>{tool.badge}</div>
          <div className={s.titleBlock}>
            <div className={s.titleRow}>
              <span>{tool.name}</span>
              <button
                className={`${s.pinBtn} ${isPinned ? s.pinned : ''}`}
                title={isPinned ? t.unpin : t.pin}
                onClick={handlePinToggle}
              >
                <Icon name="pin" size={16} strokeWidth={2} />
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
                  <Icon name="split-v" size={14} color={splitMode === 'v' ? '#fff' : 'var(--color-ink)'} />
                </button>
                <button
                  className={`${s.splitBtn} ${splitMode === 'h' ? s.splitActive : ''}`}
                  title={t.splitH}
                  onClick={() => setSplitMode('h')}
                >
                  <Icon name="split-h" size={14} color={splitMode === 'h' ? '#fff' : 'var(--color-ink)'} />
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
