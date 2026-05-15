import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface CmdKStore {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const Ctx = createContext<CmdKStore | null>(null)

export function CmdKProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open   = useCallback(() => setIsOpen(true), [])
  const close  = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(v => !v), [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        toggle()
      }
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggle, close])

  return <Ctx.Provider value={{ isOpen, open, close, toggle }}>{children}</Ctx.Provider>
}

export function useCmdK(): CmdKStore {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCmdK must be used inside CmdKProvider')
  return ctx
}
