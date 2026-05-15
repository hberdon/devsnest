import { createContext, useContext, useCallback, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export interface HistoryEntry {
  id: string
  toolId: string
  toolName: string
  badge: string
  categoryName: string
  description: string
  timestamp: string
}

interface DevToolsStore {
  history: HistoryEntry[]
  pinned: HistoryEntry[]
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void
  pin: (id: string) => void
  unpin: (id: string) => void
  removeFromHistory: (id: string) => void
  clearHistory: () => void
}

const Ctx = createContext<DevToolsStore | null>(null)

function formatTimestamp(date: Date): string {
  const day = date.getDate()
  const month = date.toLocaleString('es', { month: 'short' })
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${day} ${month[0].toUpperCase()}${month.slice(1)}, ${h}:${m}`
}

const DEMO_HISTORY: HistoryEntry[] = [
  { id: 'demo-1', toolId: 'jwt-decode',  toolName: 'JWT Decode',    badge: 'JWT', categoryName: 'Conversores', description: 'Decodificó token · alg HS256 · exp 3d', timestamp: '15 May, 09:31' },
  { id: 'demo-2', toolId: 'regex',       toolName: 'Regex Tester',  badge: '.*',  categoryName: 'Utilidades',  description: '12 coincidencias · flags gi',           timestamp: '15 May, 08:55' },
  { id: 'demo-3', toolId: 'uuid-ulid',   toolName: 'UUID / ULID',   badge: 'ID',  categoryName: 'Generadores', description: 'Generó 25 UUID v4',                     timestamp: '15 May, 08:14' },
  { id: 'demo-4', toolId: 'json',        toolName: 'JSON',          badge: '{}',  categoryName: 'Formateadores', description: 'Validó payload · 0 errores · 4 keys', timestamp: '14 May, 17:08' },
  { id: 'demo-5', toolId: 'hash',        toolName: 'Hash MD5 / SHA',badge: '#',   categoryName: 'Generadores', description: 'SHA-256 · 64 chars',                    timestamp: '14 May, 15:22' },
]

const DEMO_PINNED: HistoryEntry[] = [
  { id: 'demo-pin-1', toolId: 'base64', toolName: 'Base64', badge: 'B64', categoryName: 'Conversores', description: 'Codificó · 1.2 KB', timestamp: '15 May, 09:42' },
]

interface StorageState {
  history: HistoryEntry[]
  pinned: HistoryEntry[]
  seeded: boolean
}

export function DevToolsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<StorageState>('devsnest-store', {
    history: DEMO_HISTORY,
    pinned: DEMO_PINNED,
    seeded: true,
  })

  const addToHistory = useCallback((entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: `${entry.toolId}-${Date.now()}`,
      timestamp: formatTimestamp(new Date()),
    }
    setState(prev => ({
      ...prev,
      history: [
        newEntry,
        ...prev.history.filter(e => e.toolId !== entry.toolId),
      ].slice(0, 5),
    }))
  }, [setState])

  const pin = useCallback((id: string) => {
    setState(prev => {
      const entry = prev.history.find(e => e.id === id)
      if (!entry) return prev
      return {
        ...prev,
        pinned: [entry, ...prev.pinned],
        history: prev.history.filter(e => e.id !== id),
      }
    })
  }, [setState])

  const unpin = useCallback((id: string) => {
    setState(prev => {
      const entry = prev.pinned.find(e => e.id === id)
      if (!entry) return prev
      return {
        ...prev,
        pinned: prev.pinned.filter(e => e.id !== id),
        history: [entry, ...prev.history].slice(0, 5),
      }
    })
  }, [setState])

  const removeFromHistory = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      history: prev.history.filter(e => e.id !== id),
    }))
  }, [setState])

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }))
  }, [setState])

  return (
    <Ctx.Provider value={{
      history: state.history,
      pinned: state.pinned,
      addToHistory,
      pin,
      unpin,
      removeFromHistory,
      clearHistory,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useDevTools(): DevToolsStore {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDevTools must be used inside DevToolsProvider')
  return ctx
}
