import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Lang, type Translations } from '@/i18n/translations'

interface LangCtx {
  lang: Lang
  t:    Translations
  setLang: (l: Lang) => void
}

const Ctx = createContext<LangCtx | null>(null)

function getSavedLang(): Lang {
  const saved = localStorage.getItem('devsnest-lang')
  return saved === 'en' ? 'en' : 'es'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getSavedLang)

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('devsnest-lang', l)
  }

  return (
    <Ctx.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLang must be inside LangProvider')
  return ctx
}
