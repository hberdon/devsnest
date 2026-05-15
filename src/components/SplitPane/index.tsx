import { createContext, useContext, type ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import s from './SplitPane.module.css'

// ── Split mode context (provided by ToolLayout) ───────────────────────────
export type SplitMode = 'v' | 'h'
export const SplitModeContext = createContext<SplitMode>('v')
export const useSplitMode = () => useContext(SplitModeContext)

// ── Panel config ──────────────────────────────────────────────────────────
export interface PaneConfig {
  label: string
  meta?: string
  content: ReactNode
  footer?: ReactNode
  onCopy?: () => void
  onPaste?: () => void
}

interface SplitPaneProps {
  primary: PaneConfig
  secondary: PaneConfig
}

export function SplitPane({ primary, secondary }: SplitPaneProps) {
  const mode = useSplitMode()

  return (
    <div className={`${s.grid} ${mode === 'v' ? s.vertical : s.horizontal}`}>
      <Panel {...primary} />
      <Panel {...secondary} />
    </div>
  )
}

function Panel({ label, meta, content, footer, onCopy, onPaste }: PaneConfig) {
  return (
    <div className={s.panel}>
      <div className={s.panelHeader}>
        <span className={s.panelLabel}>{label}</span>
        {meta && <span className={s.panelMeta}>{meta}</span>}
        <div className={s.panelActions}>
          {onPaste && (
            <button className={s.panelActionBtn} onClick={onPaste}>
              pegar
            </button>
          )}
          {onCopy && (
            <button className={s.panelActionBtn} onClick={onCopy}>
              <Icon name="copy" size={11} color="currentColor" /> copiar
            </button>
          )}
        </div>
      </div>

      <div className={s.panelContent}>
        {content}
      </div>

      {footer && (
        <div className={s.panelFooter}>
          {footer}
        </div>
      )}
    </div>
  )
}
