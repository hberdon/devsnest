import { useState, useEffect } from 'react'
import { SplitPane } from '@/components/SplitPane'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import s from '@/tools/tool.module.css'
import js from './jwt.module.css'

interface JWTResult {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

function decodeBase64Url(str: string): unknown {
  const padded = str + '='.repeat((4 - str.length % 4) % 4)
  const binary = atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
  const bytes  = Uint8Array.from(binary, c => c.charCodeAt(0))
  return JSON.parse(new TextDecoder().decode(bytes))
}

function parseJWT(token: string): JWTResult | null {
  const parts = token.trim().split('.')
  if (parts.length !== 3) return null
  try {
    return {
      header:    decodeBase64Url(parts[0]) as Record<string, unknown>,
      payload:   decodeBase64Url(parts[1]) as Record<string, unknown>,
      signature: parts[2],
    }
  } catch {
    return null
  }
}

function formatExp(exp: unknown): string {
  if (typeof exp !== 'number') return ''
  const d   = new Date(exp * 1000)
  const now = Date.now()
  const diff = exp * 1000 - now
  const label = diff > 0
    ? `expira en ${Math.round(diff / 3600000)}h`
    : `expiró hace ${Math.round(-diff / 3600000)}h`
  return `${d.toLocaleString('es')} (${label})`
}

export default function JWTDecode() {
  const [input, setInput]  = useState('')
  const { addToHistory }   = useDevTools()
  const debounced          = useDebounce(input, 1000)

  const result = input.trim() ? parseJWT(input) : null
  const isError = input.trim() && !result

  useEffect(() => {
    if (!debounced || !result) return
    const alg = result.header.alg as string ?? '?'
    const exp = result.payload.exp
    const expStr = exp ? ` · exp ${formatExp(exp).split('(')[1]?.replace(')', '') ?? '?'}` : ''
    addToHistory({
      toolId: 'jwt-decode', toolName: 'JWT Decode', badge: 'JWT',
      categoryName: 'Conversores',
      description: `alg ${alg}${expStr}`,
    })
  }, [debounced]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ToolLayout toolId="jwt-decode">
      <SplitPane
        primary={{
          label: 'Token JWT',
          meta: result ? '3 partes' : '',
          onPaste: () => navigator.clipboard.readText().then(t => setInput(t.trim())).catch(() => {}),
          content: (
            <textarea
              className={s.textarea}
              style={{ wordBreak: 'break-all' }}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\n.eyJzdWIiOiIxMjM0NTY3ODkwIn0\n.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'}
              spellCheck={false}
            />
          ),
        }}
        secondary={{
          label: 'Payload decodificado',
          onCopy: result ? () => navigator.clipboard.writeText(JSON.stringify(result.payload, null, 2)).catch(() => {}) : undefined,
          content: isError ? (
            <span className={s.error}>JWT inválido — debe tener 3 partes separadas por punto</span>
          ) : result ? (
            <div className={js.decoded}>
              <Section label="Header" data={result.header} />
              <Section label="Payload" data={result.payload} expValue={result.payload.exp as number | undefined} />
              <div className={js.sigRow}>
                <span className={js.secLabel}>Signature</span>
                <code className={js.sig}>{result.signature.slice(0, 24)}…</code>
              </div>
            </div>
          ) : (
            <span style={{ color: 'var(--color-muted)', fontSize: 15 }}>Pega un JWT para decodificarlo</span>
          ),
        }}
      />
    </ToolLayout>
  )
}

function Section({ label, data, expValue }: { label: string; data: Record<string, unknown>; expValue?: number }) {
  return (
    <div className={js.section}>
      <div className={js.secLabel}>{label}</div>
      <pre className={js.json}>{JSON.stringify(data, null, 2)}</pre>
      {expValue && <div className={js.expNote}>{formatExp(expValue)}</div>}
    </div>
  )
}
