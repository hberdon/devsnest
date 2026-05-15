import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import s from './dns.module.css'
import ts from '@/tools/tool.module.css'

type RecordType = 'A' | 'AAAA' | 'MX' | 'TXT' | 'CNAME' | 'NS' | 'SOA'

interface DNSRecord {
  name: string
  type: number
  TTL: number
  data: string
}

const TYPE_NAMES: Record<number, string> = { 1:'A', 2:'NS', 5:'CNAME', 6:'SOA', 15:'MX', 16:'TXT', 28:'AAAA' }
const RECORD_TYPES: RecordType[] = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS']

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; records: DNSRecord[]; domain: string; type: RecordType }
  | { status: 'nxdomain'; domain: string }
  | { status: 'error'; message: string }

async function dnsLookup(domain: string, type: RecordType): Promise<DNSRecord[]> {
  const url = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`
  const res  = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (json.Status === 3) return [] // NXDOMAIN
  if (json.Status !== 0) throw new Error(`DNS error: status ${json.Status}`)
  return (json.Answer ?? []) as DNSRecord[]
}

export default function DNS() {
  const [domain, setDomain] = useState('')
  const [type,   setType]   = useState<RecordType>('A')
  const [state,  setState]  = useState<State>({ status: 'idle' })
  const { addToHistory } = useDevTools()

  const lookup = useCallback(async (d: string, t: RecordType) => {
    const clean = d.trim().replace(/^https?:\/\//, '').split('/')[0]
    if (!clean) return
    setState({ status: 'loading' })
    try {
      const records = await dnsLookup(clean, t)
      if (records.length === 0) {
        setState({ status: 'nxdomain', domain: clean })
      } else {
        setState({ status: 'ok', records, domain: clean, type: t })
        addToHistory({
          toolId: 'dns', toolName: 'DNS', badge: 'DNS',
          categoryName: 'Red',
          description: `${clean} ${t} → ${records.length} registros`,
        })
      }
    } catch (e) {
      setState({ status: 'error', message: e instanceof Error ? e.message : 'Error de red' })
    }
  }, [addToHistory])

  return (
    <ToolLayout toolId="dns">
      <div className={s.layout}>
        <div className={s.searchRow}>
          <input
            className={s.input}
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && lookup(domain, type)}
            placeholder="ejemplo.com"
            spellCheck={false}
          />
          <div className={ts.segmented}>
            {RECORD_TYPES.map(t => (
              <button
                key={t}
                className={`${ts.segmentBtn} ${type === t ? ts.segmentActive : ''}`}
                onClick={() => { setType(t); if (domain.trim()) lookup(domain, t) }}
              >{t}</button>
            ))}
          </div>
          <button
            className={ts.actionBtn}
            onClick={() => lookup(domain, type)}
            disabled={state.status === 'loading' || !domain.trim()}
          >
            {state.status === 'loading' ? '…' : 'Buscar'}
          </button>
        </div>

        {state.status === 'error' && (
          <div className={ts.error}>{state.message}</div>
        )}

        {state.status === 'nxdomain' && (
          <div className={s.empty}>No se encontraron registros {type} para <strong>{state.domain}</strong></div>
        )}

        {state.status === 'ok' && (
          <div className={s.results}>
            <div className={s.resultsHeader}>
              {state.records.length} registro{state.records.length !== 1 ? 's' : ''} {state.type} para {state.domain}
            </div>
            {state.records.map((r, i) => (
              <div key={i} className={s.row}>
                <span className={s.rType}>{TYPE_NAMES[r.type] ?? r.type}</span>
                <span className={s.rTTL}>{r.TTL}s</span>
                <code className={s.rData}>{r.data}</code>
              </div>
            ))}
          </div>
        )}

        {state.status === 'idle' && (
          <div className={s.empty}>Introduce un dominio y selecciona el tipo de registro</div>
        )}
      </div>
    </ToolLayout>
  )
}
