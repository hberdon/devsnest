import { useEffect, useState } from 'react'
import s from './ShortcutsModal.module.css'

const SHORTCUTS = [
  { keys: ['⌘', 'F'],   desc: 'Abrir paleta de búsqueda'   },
  { keys: ['?'],         desc: 'Mostrar atajos de teclado'  },
  { keys: ['Esc'],       desc: 'Cerrar overlay / paleta'    },
  { keys: ['↑', '↓'],   desc: 'Navegar resultados (paleta)' },
  { keys: ['↵'],         desc: 'Abrir herramienta (paleta)' },
]

export function ShortcutsModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === '?') { e.preventDefault(); setOpen(v => !v) }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!open) return null

  return (
    <div className={s.backdrop} onClick={() => setOpen(false)}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>
        <div className={s.header}>
          <span className={s.title}>Atajos de teclado</span>
          <button className={s.closeBtn} onClick={() => setOpen(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className={s.list}>
          {SHORTCUTS.map((sc, i) => (
            <div key={i} className={s.row}>
              <div className={s.keys}>
                {sc.keys.map((k, j) => (
                  <span key={j} className={s.kbd}>{k}</span>
                ))}
              </div>
              <span className={s.desc}>{sc.desc}</span>
            </div>
          ))}
        </div>
        <div className={s.footer}>Pulsa <span className={s.kbd}>?</span> o <span className={s.kbd}>Esc</span> para cerrar</div>
      </div>
    </div>
  )
}
