import { type ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { SplitModeContext, type SplitMode } from '@/components/SplitPane'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useDevTools } from '@/store/devtools.context'
import { useCmdK } from '@/store/cmd-palette.context'
import { getToolById, getCategoryById } from '@/tools/registry'
import s from './ToolLayout.module.css'

interface ToolLayoutProps {
  toolId: string
  children: ReactNode
  actions?: ReactNode
}

export function ToolLayout({ toolId, children, actions }: ToolLayoutProps) {
  const tool     = getToolById(toolId)
  const category = tool ? getCategoryById(tool.categoryId) : undefined
  const navigate = useNavigate()
  const { open: openCmdK } = useCmdK()
  const { pinned, pin, unpin } = useDevTools()
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

  if (!tool) return <div style={{ padding: 32, color: 'var(--color-muted)' }}>Herramienta no encontrada</div>

  return (
    <SplitModeContext.Provider value={splitMode}>
      <div className={s.layout}>
        {/* Breadcrumb */}
        <nav className={s.breadcrumb}>
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Inicio
          </span>
          <span>›</span>
          <span>{category?.name}</span>
          <span>›</span>
          <span className={s.breadcrumbActive}>{tool.name}</span>
          <button className={s.breadcrumbKbd} onClick={openCmdK}>
            ⌘K para buscar
          </button>
        </nav>

        {/* Header */}
        <div className={s.header}>
          <div className={s.badge}>{tool.badge}</div>
          <div className={s.titleBlock}>
            <div className={s.titleRow}>
              <span>{tool.name}</span>
              <button
                className={`${s.pinBtn} ${isPinned ? s.pinned : ''}`}
                title={isPinned ? 'Quitar de anclados' : 'Anclar'}
                onClick={handlePinToggle}
              >
                <Icon name="pin" size={16} strokeWidth={2} />
              </button>
            </div>
            <div className={s.subtitle}>{tool.description}</div>
          </div>

          <div className={s.actions}>
            {actions}
            <div className={s.splitToggle}>
              <button
                className={`${s.splitBtn} ${splitMode === 'v' ? s.splitActive : ''}`}
                title="Vertical (lado a lado)"
                onClick={() => setSplitMode('v')}
              >
                <Icon name="split-v" size={14} color={splitMode === 'v' ? '#fff' : 'var(--color-ink)'} />
              </button>
              <button
                className={`${s.splitBtn} ${splitMode === 'h' ? s.splitActive : ''}`}
                title="Horizontal (apilado)"
                onClick={() => setSplitMode('h')}
              >
                <Icon name="split-h" size={14} color={splitMode === 'h' ? '#fff' : 'var(--color-ink)'} />
              </button>
            </div>
            <button className={s.moreBtn} title="Más opciones">
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
