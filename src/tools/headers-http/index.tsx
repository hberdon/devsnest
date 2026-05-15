import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import s from './headers.module.css'
import ts from '@/tools/tool.module.css'

type HeaderEntry = { name: string; value: string }
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; headers: HeaderEntry[]; statusCode: number; statusText: string }
  | { status: 'error'; message: string }

async function fetchHeaders(url: string): Promise<{ headers: HeaderEntry[]; statusCode: number; statusText: string }> {
  const target = url.startsWith('http') ? url : `https://${url}`
  const res = await fetch(target, { method: 'GET', mode: 'cors', credentials: 'omit' })
  const headers: HeaderEntry[] = []
  res.headers.forEach((value, name) => headers.push({ name, value }))
  return { headers: headers.sort((a, b) => a.name.localeCompare(b.name)), statusCode: res.status, statusText: res.statusText }
}

export default function HeadersHTTP() {
  const [input,  setInput]  = useState('')
  const [state,  setState]  = useState<State>({ status: 'idle' })
  const [copied, setCopied] = useState<number | null>(null)
  const { addToHistory } = useDevTools()

  const fetch_ = useCallback(async (url: string) => {
    if (!url.trim()) return
    setState({ status: 'loading' })
    try {
      const result = await fetchHeaders(url)
      setState({ status: 'ok', ...result })
      addToHistory({
        toolId: 'headers-http', toolName: 'Headers HTTP', badge: 'H',
        categoryName: 'Red',
        description: `${result.statusCode} · ${result.headers.length} headers · ${url.slice(0, 40)}`,
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error de red'
      setState({
        status: 'error',
        message: msg.includes('CORS') || msg.includes('Failed to fetch')
          ? 'CORS bloqueó la petición. El servidor no permite solicitudes cross-origin desde el navegador.'
          : msg,
      })
    }
  }, [addToHistory])

  function copyHeader(idx: number, value: string) {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(idx)
    setTimeout(() => setCopied(null), 1200)
  }

  const statusOk = state.status === 'ok' && state.statusCode < 400

  return (
    <ToolLayout toolId="headers-http">
      <div className={s.layout}>
        <div className={s.searchRow}>
          <input
            className={s.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetch_(input)}
            placeholder="https://api.ejemplo.com"
            spellCheck={false}
          />
          <button
            className={ts.actionBtn}
            onClick={() => fetch_(input)}
            disabled={state.status === 'loading' || !input.trim()}
          >
            {state.status === 'loading' ? 'Cargando…' : 'Inspeccionar'}
          </button>
        </div>

        {state.status === 'error' && (
          <div className={s.errorBox}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {state.message}
          </div>
        )}

        {state.status === 'ok' && (
          <>
            <div className={s.statusBar}>
              <span className={`${s.statusCode} ${statusOk ? s.statusOk : s.statusErr}`}>{state.statusCode}</span>
              <span className={s.statusText}>{state.statusText}</span>
              <span className={s.headerCount}>{state.headers.length} headers</span>
            </div>
            <div className={s.headerList}>
              {state.headers.map((h, i) => (
                <div key={i} className={s.headerRow}>
                  <span className={s.headerName}>{h.name}</span>
                  <span className={s.headerValue}>{h.value}</span>
                  <button className={s.copyBtn} onClick={() => copyHeader(i, h.value)} title="Copiar valor">
                    {copied === i
                      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    }
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {state.status === 'idle' && (
          <div className={s.note}>
            Introduce una URL y haz clic en Inspeccionar.
            <br />
            <small>Nota: muchos servidores bloquean peticiones CORS desde el navegador.</small>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
