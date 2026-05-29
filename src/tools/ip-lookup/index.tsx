import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useLang } from '@/store/lang.context'
import s from './ip.module.css'
import ts from '@/tools/tool.module.css'

interface IPData {
  ip: string; city: string; region: string; country_name: string
  country_code: string; org: string; timezone: string
  latitude: number; longitude: number; utc_offset: string
}

type State = { status: 'idle' } | { status: 'loading' } | { status: 'ok'; data: IPData } | { status: 'error'; message: string }

async function fetchIP(ip: string): Promise<IPData> {
  const target = ip.trim() || ''
  const url    = target ? `https://ipapi.co/${target}/json/` : 'https://ipapi.co/json/'
  const res    = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.reason ?? 'IP inválida')
  return data as IPData
}

export default function IPLookup() {
  const [input, setInput] = useState('')
  const [state, setState] = useState<State>({ status: 'idle' })
  const [copied, setCopied] = useState<keyof IPData | null>(null)
  const { addToHistory } = useDevTools()
  const { t } = useLang()

  const ROWS: { key: keyof IPData; label: string }[] = [
    { key: 'ip',           label: t.ipLabelIp      },
    { key: 'city',         label: t.ipLabelCity    },
    { key: 'region',       label: t.ipLabelRegion  },
    { key: 'country_name', label: t.ipLabelCountry },
    { key: 'org',          label: t.ipLabelOrg     },
    { key: 'timezone',     label: t.ipLabelTz      },
    { key: 'utc_offset',   label: t.ipLabelUtc     },
    { key: 'latitude',     label: t.ipLabelLat     },
    { key: 'longitude',    label: t.ipLabelLon     },
  ]

  const lookup = useCallback(async (ip: string) => {
    setState({ status: 'loading' })
    try {
      const data = await fetchIP(ip)
      setState({ status: 'ok', data })
      addToHistory({
        toolId: 'ip-lookup', toolName: 'IP Lookup', badge: 'IP',
        categoryName: 'Red',
        description: `${data.ip} → ${data.city}, ${data.country_name}`,
      })
    } catch (e) {
      setState({ status: 'error', message: e instanceof Error ? e.message : 'Error desconocido' })
    }
  }, [addToHistory])

  function copy(key: keyof IPData, value: string) {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <ToolLayout toolId="ip-lookup" hideSplit>
      <div className={s.layout}>
        <div className={s.searchRow}>
          <input
            className={s.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && lookup(input)}
            placeholder={t.ipPlaceholder}
            spellCheck={false}
          />
          <button
            className={ts.actionBtn}
            onClick={() => lookup(input)}
            disabled={state.status === 'loading'}
          >
            {state.status === 'loading' ? t.ipSearching : t.ipSearch}
          </button>
          <button
            className={ts.actionBtn}
            onClick={() => { setInput(''); lookup('') }}
            title={t.ipMyIp}
          >
            {t.ipMyIp}
          </button>
        </div>

        {state.status === 'error' && (
          <div className={ts.error}>{state.message}</div>
        )}

        {state.status === 'ok' && (
          <div className={s.results}>
            {ROWS.map(({ key, label }) => {
              const val = String(state.data[key] ?? '—')
              return (
                <div key={key} className={s.row}>
                  <span className={s.rowLabel}>{label}</span>
                  <span className={s.rowValue}>{val}</span>
                  <button className={s.copyBtn} onClick={() => copy(key, val)} title="Copiar">
                    {copied === key
                      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    }
                  </button>
                </div>
              )
            })}
            {state.data.latitude && state.data.longitude && (
              <div className={s.mapLink}>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${state.data.latitude}&mlon=${state.data.longitude}&zoom=10`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.ipViewMap}
                </a>
              </div>
            )}
          </div>
        )}

        {state.status === 'idle' && (
          <div className={s.empty}>{t.ipEmpty}</div>
        )}
      </div>
    </ToolLayout>
  )
}
