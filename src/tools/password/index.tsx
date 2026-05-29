import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useLang } from '@/store/lang.context'
import s from './pw.module.css'
import ts from '@/tools/tool.module.css'

const UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER   = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS  = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

interface Config { length: number; upper: boolean; lower: boolean; digits: boolean; symbols: boolean }

function genPassword(cfg: Config): string {
  const pool = [
    cfg.upper   ? UPPER   : '',
    cfg.lower   ? LOWER   : '',
    cfg.digits  ? DIGITS  : '',
    cfg.symbols ? SYMBOLS : '',
  ].join('')
  if (!pool) return ''

  const arr = new Uint32Array(cfg.length)
  crypto.getRandomValues(arr)
  return Array.from(arr, n => pool[n % pool.length]).join('')
}

function strength(pw: string): { label: string; score: number } {
  if (!pw) return { label: '', score: 0 }
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 14) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['', 'Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte']
  return { label: labels[score] ?? 'Muy fuerte', score }
}

export default function Password() {
  const [cfg, setCfg] = useState<Config>({ length: 16, upper: true, lower: true, digits: true, symbols: true })
  const [pw,  setPw]  = useState(() => genPassword({ length: 16, upper: true, lower: true, digits: true, symbols: true }))
  const [copied, setCopied] = useState(false)
  const { addToHistory } = useDevTools()
  const { t } = useLang()

  const regen = useCallback((c: Config) => {
    const next = genPassword(c)
    setPw(next)
    addToHistory({
      toolId: 'password', toolName: 'Password', badge: '••',
      categoryName: 'Generadores',
      description: `${c.length} chars · ${[c.upper&&'A-Z',c.lower&&'a-z',c.digits&&'0-9',c.symbols&&'síms'].filter(Boolean).join('+')}`,
    })
  }, [addToHistory])

  function update(patch: Partial<Config>) {
    const next = { ...cfg, ...patch }
    setCfg(next)
    regen(next)
  }

  function copy() {
    navigator.clipboard.writeText(pw).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const { label: strLabel, score: strScore } = strength(pw)
  const strColors = ['', '#e53e3e', '#dd6b20', '#d69e2e', '#38a169', '#2b6cb0']

  return (
    <ToolLayout toolId="password" hideSplit>
      <div className={s.layout}>
        {/* Output */}
        <div className={s.outputBox}>
          <code className={s.pwText}>{pw || <span className={s.empty}>{t.pwNoOptions}</span>}</code>
          <div className={s.outputActions}>
            {pw && <span className={s.strength} style={{ color: strColors[strScore] }}>{strLabel}</span>}
            <button className={s.iconBtn} onClick={() => regen(cfg)} title="Regenerar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </button>
            <button className={s.copyBtn} onClick={copy} title="Copiar">
              {copied
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Length */}
        <div className={s.section}>
          <span className={s.sectionLabel}>{t.pwLength}</span>
          <div className={s.lengthRow}>
            <input
              type="range" min={4} max={64} value={cfg.length}
              onChange={e => update({ length: Number(e.target.value) })}
              className={s.slider}
            />
            <span className={s.lengthVal}>{cfg.length}</span>
          </div>
        </div>

        {/* Checkboxes */}
        <div className={s.section}>
          <span className={s.sectionLabel}>{t.pwChars}</span>
          <div className={s.checkGrid}>
            {([
              { key: 'upper',   label: t.pwUppercase, example: 'A-Z' },
              { key: 'lower',   label: t.pwLowercase, example: 'a-z' },
              { key: 'digits',  label: t.pwNumbers,   example: '0-9' },
              { key: 'symbols', label: t.pwSymbols,   example: '!@#' },
            ] as const).map(({ key, label, example }) => (
              <label key={key} className={s.checkItem}>
                <span
                  className={`${ts.checkboxBox} ${cfg[key] ? ts.checked : ''}`}
                  onClick={() => update({ [key]: !cfg[key] })}
                />
                <span className={s.checkLabel}>{label}</span>
                <code className={s.checkExample}>{example}</code>
              </label>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
