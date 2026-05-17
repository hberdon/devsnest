import { useRef, useState, useEffect } from 'react'
import { Icon } from '@/components/Icon'
import { useLang } from '@/store/lang.context'
import type { Lang } from '@/i18n/translations'
import s from './LangPicker.module.css'

const LANGS: { id: Lang; code: string; label: string }[] = [
  { id: 'es', code: 'ES', label: 'Español' },
  { id: 'en', code: 'EN', label: 'English' },
]

export function LangPicker() {
  const { lang, setLang } = useLang()
  const [open, setOpen]   = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className={s.wrap} ref={ref}>
      <button
        className={s.btn}
        onClick={() => setOpen(v => !v)}
        title="Idioma / Language"
      >
        <Icon name="globe" size={14} color="currentColor" />
        <Icon name="chev-d" size={11} color="currentColor" className={open ? s.chevOpen : s.chev} />
      </button>

      {open && (
        <div className={s.dropdown}>
          {LANGS.map(l => (
            <button
              key={l.id}
              className={`${s.option} ${l.id === lang ? s.active : ''}`}
              onClick={() => { setLang(l.id); setOpen(false) }}
            >
              <span className={s.code}>{l.code}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
