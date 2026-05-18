import { useState, useMemo } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { Icon } from '@/components/Icon'
import { useLang } from '@/store/lang.context'
import s from './Cron.module.css'

// ── Parser ────────────────────────────────────────────────────────────────

const MON_ALIAS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
const DOW_ALIAS = ['SUN','MON','TUE','WED','THU','FRI','SAT']

function expandField(raw: string, min: number, max: number, alias?: string[]): number[] | null {
  const out = new Set<number>()
  for (let part of raw.split(',')) {
    part = part.trim()
    if (alias) alias.forEach((a, i) => { part = part.toUpperCase().replace(new RegExp(a, 'gi'), String(i + min)) })

    let step = 1
    let range = part
    if (part.includes('/')) {
      const [r, st] = part.split('/')
      step = parseInt(st, 10)
      if (isNaN(step) || step <= 0) return null
      range = r
    }

    if (range === '*') {
      for (let i = min; i <= max; i += step) out.add(i)
    } else if (range.includes('-')) {
      const [a, b] = range.split('-').map(Number)
      if (isNaN(a) || isNaN(b) || a > b || a < min || b > max) return null
      for (let i = a; i <= b; i += step) out.add(i)
    } else {
      const n = Number(range)
      if (isNaN(n) || n < min || n > max) return null
      out.add(n)
    }
  }
  return [...out].sort((a, b) => a - b)
}

interface Parsed { minute: number[]; hour: number[]; dom: number[]; month: number[]; dow: number[] }
type ParseResult = { ok: true; data: Parsed } | { ok: false; error: string }

function parseCron(expr: string): ParseResult {
  const p = expr.trim().split(/\s+/)
  if (p.length !== 5) return { ok: false, error: 'Se esperan 5 campos: MIN HORA DÍA MES DOW' }
  const minute = expandField(p[0], 0, 59)
  const hour   = expandField(p[1], 0, 23)
  const dom    = expandField(p[2], 1, 31)
  const month  = expandField(p[3], 1, 12, MON_ALIAS)
  const dowRaw = expandField(p[4], 0, 7,  DOW_ALIAS)
  if (!minute) return { ok: false, error: 'Minuto inválido (0-59)' }
  if (!hour)   return { ok: false, error: 'Hora inválida (0-23)' }
  if (!dom)    return { ok: false, error: 'Día del mes inválido (1-31)' }
  if (!month)  return { ok: false, error: 'Mes inválido (1-12 / JAN-DEC)' }
  if (!dowRaw) return { ok: false, error: 'Día de la semana inválido (0-7 / SUN-SAT)' }
  const dow = [...new Set(dowRaw.map(d => d === 7 ? 0 : d))].sort((a, b) => a - b)
  return { ok: true, data: { minute, hour, dom, month, dow } }
}

function getNextRuns(data: Parsed, count: number): Date[] {
  const d = new Date()
  d.setSeconds(0, 0)
  d.setMinutes(d.getMinutes() + 1)
  const limit = d.getTime() + 366 * 24 * 60 * 60 * 1000
  const out: Date[] = []
  while (out.length < count && d.getTime() < limit) {
    if (
      data.minute.includes(d.getMinutes()) &&
      data.hour.includes(d.getHours()) &&
      data.dom.includes(d.getDate()) &&
      data.month.includes(d.getMonth() + 1) &&
      data.dow.includes(d.getDay())
    ) out.push(new Date(d))
    d.setMinutes(d.getMinutes() + 1)
  }
  return out
}

function relative(d: Date): string {
  const s = Math.round((d.getTime() - Date.now()) / 1000)
  if (s < 60)    return `en ${s}s`
  if (s < 3600)  return `en ${Math.round(s / 60)}min`
  if (s < 86400) return `en ${Math.round(s / 3600)}h`
  return `en ${Math.round(s / 86400)}d`
}

function describe(expr: string, d: Parsed, lang: 'es' | 'en'): string {
  const [mE, hE, domE, monE, dowE] = expr.trim().split(/\s+/)
  const es = lang === 'es'
  const pad = (n: number) => String(n).padStart(2, '0')

  if (mE === '*' && hE === '*' && domE === '*' && monE === '*' && dowE === '*')
    return es ? 'Cada minuto' : 'Every minute'

  if (mE.startsWith('*/') && hE === '*' && domE === '*' && monE === '*' && dowE === '*')
    return es ? `Cada ${mE.slice(2)} minutos` : `Every ${mE.slice(2)} minutes`

  if (hE.startsWith('*/') && mE === '0' && domE === '*' && monE === '*' && dowE === '*')
    return es ? `Cada ${hE.slice(2)} horas` : `Every ${hE.slice(2)} hours`

  if (mE === '0' && hE === '*' && domE === '*' && monE === '*' && dowE === '*')
    return es ? 'Cada hora en punto' : 'Every hour on the hour'

  const time = d.hour.length === 1 && d.minute.length === 1
    ? `${pad(d.hour[0])}:${pad(d.minute[0])}`
    : null

  if (time && domE === '*' && monE === '*' && dowE === '*')
    return es ? `Cada día a las ${time}` : `Every day at ${time}`

  if (time && domE === '*' && monE === '*' && dowE === '1-5')
    return es ? `Lunes a viernes a las ${time}` : `Weekdays at ${time}`

  if (time && domE === '1' && monE === '*' && dowE === '*')
    return es ? `El 1 de cada mes a las ${time}` : `1st of each month at ${time}`

  const dowNames = es
    ? ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
    : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  if (time && domE === '*' && monE === '*' && d.dow.length > 0)
    return (es ? 'Cada ' : 'Every ') + d.dow.map(x => dowNames[x]).join('/') + (es ? ` a las ${time}` : ` at ${time}`)

  // Fallback: field-by-field
  const parts: string[] = []
  if (mE !== '*') parts.push((es ? 'min ' : 'min ') + d.minute.join(','))
  if (hE !== '*') parts.push((es ? 'hora ' : 'hour ') + d.hour.join(','))
  if (domE !== '*') parts.push((es ? 'día ' : 'day ') + d.dom.join(','))
  if (monE !== '*') parts.push(d.month.map(m => MON_ALIAS[m - 1]).join(','))
  if (dowE !== '*') parts.push(d.dow.map(x => dowNames[x]).join(','))
  return parts.join(' · ')
}

// ── Presets ───────────────────────────────────────────────────────────────

const PRESETS: { label: { es: string; en: string }; expr: string }[] = [
  { label: { es: 'Cada minuto',        en: 'Every minute'     }, expr: '* * * * *'   },
  { label: { es: 'Cada hora',          en: 'Every hour'       }, expr: '0 * * * *'   },
  { label: { es: 'Cada día (00:00)',   en: 'Daily (00:00)'    }, expr: '0 0 * * *'   },
  { label: { es: 'Cada semana',        en: 'Weekly'           }, expr: '0 0 * * 0'   },
  { label: { es: 'Cada mes',           en: 'Monthly'          }, expr: '0 0 1 * *'   },
  { label: { es: 'L–V 9am',           en: 'Weekdays 9am'     }, expr: '0 9 * * 1-5' },
  { label: { es: 'Cada 15min',         en: 'Every 15 min'     }, expr: '*/15 * * * *' },
  { label: { es: 'Cada 6 horas',       en: 'Every 6 hours'    }, expr: '0 */6 * * *' },
]

// ── Fields ────────────────────────────────────────────────────────────────

const FIELDS = [
  { idx: 0, label: { es: 'Minuto',       en: 'Minute'      }, hint: '0-59'        },
  { idx: 1, label: { es: 'Hora',         en: 'Hour'        }, hint: '0-23'        },
  { idx: 2, label: { es: 'Día mes',      en: 'Day (month)' }, hint: '1-31'        },
  { idx: 3, label: { es: 'Mes',          en: 'Month'       }, hint: '1-12'        },
  { idx: 4, label: { es: 'Día semana',   en: 'Day (week)'  }, hint: '0-7 (0=Sun)' },
]

// ── Component ─────────────────────────────────────────────────────────────

export default function CronTool() {
  const [expr, setExpr]     = useState('* * * * *')
  const [copied, setCopied] = useState(false)
  const { lang } = useLang()
  const L = lang === 'es' ? 'es' : 'en'

  const parsed  = useMemo(() => parseCron(expr), [expr])
  const parts   = expr.trim().split(/\s+/)
  const nexts   = useMemo(() => parsed.ok ? getNextRuns(parsed.data, 5) : [], [parsed])
  const desc    = useMemo(() => parsed.ok ? describe(expr, parsed.data, L) : null, [parsed, expr, L])

  function updateField(idx: number, val: string) {
    const p = expr.trim().split(/\s+/)
    while (p.length < 5) p.push('*')
    p[idx] = val || '*'
    setExpr(p.join(' '))
  }

  function handleCopy() {
    navigator.clipboard.writeText(expr).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const copyBtn = (
    <button className={s.copyBtn} onClick={handleCopy}>
      <Icon name="copy" size={13} color="currentColor" />
      {copied ? (L === 'es' ? 'Copiado' : 'Copied') : (L === 'es' ? 'Copiar' : 'Copy')}
    </button>
  )

  return (
    <ToolLayout toolId="cron" hideSplit actions={copyBtn}>
      <div className={s.layout}>

        {/* Expression input */}
        <div className={s.exprRow}>
          <span className={s.dollar}>$</span>
          <input
            className={`${s.exprInput} ${!parsed.ok ? s.exprInvalid : ''}`}
            value={expr}
            onChange={e => setExpr(e.target.value)}
            spellCheck={false}
            placeholder="* * * * *"
          />
        </div>
        {!parsed.ok && <div className={s.error}>{parsed.error}</div>}

        {/* Field breakdown */}
        <div className={s.fields}>
          {FIELDS.map(f => (
            <div key={f.idx} className={s.field}>
              <span className={s.fieldLabel}>{f.label[L]}</span>
              <input
                className={s.fieldInput}
                value={parts[f.idx] ?? '*'}
                onChange={e => updateField(f.idx, e.target.value)}
                spellCheck={false}
              />
              <span className={s.fieldHint}>{f.hint}</span>
            </div>
          ))}
        </div>

        {/* Presets */}
        <div className={s.presets}>
          {PRESETS.map(p => (
            <button
              key={p.expr}
              className={`${s.preset} ${expr.trim() === p.expr ? s.presetActive : ''}`}
              onClick={() => setExpr(p.expr)}
            >
              {p.label[L]}
            </button>
          ))}
        </div>

        {/* Results */}
        {parsed.ok && (
          <div className={s.results}>
            {desc && (
              <div className={s.card}>
                <span className={s.cardLabel}>{L === 'es' ? 'Descripción' : 'Description'}</span>
                <span className={s.cardValue}>{desc}</span>
              </div>
            )}
            <div className={s.card}>
              <span className={s.cardLabel}>{L === 'es' ? 'Próximas ejecuciones' : 'Next runs'}</span>
              {nexts.length === 0
                ? <span className={s.cardMuted}>{L === 'es' ? 'Sin ejecuciones en el próximo año' : 'No runs in the next year'}</span>
                : <div className={s.nextList}>
                    {nexts.map((d, i) => (
                      <div key={i} className={s.nextRow}>
                        <span className={s.nextN}>#{i + 1}</span>
                        <code className={s.nextDate}>{d.toLocaleString(lang === 'es' ? 'es-ES' : 'en-US')}</code>
                        <code className={s.nextRel}>{relative(d)}</code>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
