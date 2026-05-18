import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type PaletteId =
  | 'vivid'
  | 'sky-slate'
  | 'royal-gold'
  | 'cobalt-lime'
  | 'navy-coral'
  | 'midnight-cyan'
  | 'indigo-coral'
  | 'teal-amber'

export type Mode = 'light' | 'dark'
export type Theme = `${PaletteId}-${Mode}`

export interface PaletteDef {
  id:    PaletteId
  label: string
  light: string  // accent hex for light mode dot
  dark:  string  // accent hex for dark mode dot
}

export const PALETTE_DEFS: PaletteDef[] = [
  { id: 'vivid',         label: 'Mint',            light: '#047857', dark: '#34d399' },
  { id: 'sky-slate',     label: 'Sky & Slate',     light: '#0ea5e9', dark: '#38bdf8' },
  { id: 'royal-gold',    label: 'Royal & Gold',    light: '#3730a3', dark: '#818cf8' },
  { id: 'cobalt-lime',   label: 'Cobalt & Lime',   light: '#005bea', dark: '#4d9eff' },
  { id: 'navy-coral',    label: 'Navy & Coral',    light: '#1e3a8a', dark: '#60a5fa' },
  { id: 'midnight-cyan', label: 'Midnight & Cyan', light: '#0050d8', dark: '#4d82ff' },
  { id: 'indigo-coral',  label: 'Indigo & Coral',  light: '#4361ee', dark: '#4361ee' },
  { id: 'teal-amber',    label: 'Teal & Amber',    light: '#0fa3b1', dark: '#0fa3b1' },
]

const VALID_PALETTES = PALETTE_DEFS.map(p => p.id)

function parseSaved(saved: string | null): { palette: PaletteId; mode: Mode } {
  if (!saved) return { palette: 'vivid', mode: 'light' }
  const parts  = saved.split('-')
  const mode   = parts.at(-1) as Mode
  const palette = parts.slice(0, -1).join('-') as PaletteId
  if ((mode === 'light' || mode === 'dark') && VALID_PALETTES.includes(palette)) {
    return { palette, mode }
  }
  return { palette: 'vivid', mode: 'light' }
}

interface ThemeCtx {
  theme:      Theme
  palette:    PaletteId
  mode:       Mode
  palettes:   PaletteDef[]
  setPalette: (p: PaletteId) => void
  setMode:    (m: Mode) => void
}

const Ctx = createContext<ThemeCtx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<PaletteId>(() =>
    parseSaved(localStorage.getItem('devsnest-theme')).palette
  )
  const [mode, setModeState] = useState<Mode>(() =>
    parseSaved(localStorage.getItem('devsnest-theme')).mode
  )

  const theme: Theme = `${palette}-${mode}`

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('devsnest-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function setPalette(p: PaletteId) { setPaletteState(p) }
  function setMode(m: Mode)         { setModeState(m) }

  return (
    <Ctx.Provider value={{ theme, palette, mode, palettes: PALETTE_DEFS, setPalette, setMode }}>
      {children}
    </Ctx.Provider>
  )
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
