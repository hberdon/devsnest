import { useState, useCallback } from 'react'
import bcrypt from 'bcryptjs'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import s from './bcrypt.module.css'
import ts from '@/tools/tool.module.css'

type Tab = 'hash' | 'compare'

export default function Bcrypt() {
  const [tab,      setTab]      = useState<Tab>('hash')
  const [input,    setInput]    = useState('')
  const [rounds,   setRounds]   = useState(10)
  const [hashOut,  setHashOut]  = useState('')
  const [hashErr,  setHashErr]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [copied,   setCopied]   = useState(false)
  // Compare tab
  const [plaintext, setPlaintext] = useState('')
  const [hashInput, setHashInput] = useState('')
  const [cmpResult, setCmpResult] = useState<boolean | null>(null)
  const { addToHistory } = useDevTools()

  const doHash = useCallback(async () => {
    if (!input.trim()) return
    setLoading(true); setHashErr(''); setHashOut('')
    try {
      const salt = await bcrypt.genSalt(rounds)
      const hash = await bcrypt.hash(input, salt)
      setHashOut(hash)
      addToHistory({
        toolId: 'bcrypt', toolName: 'Bcrypt', badge: 'BC',
        categoryName: 'Cripto',
        description: `Hash bcrypt rounds=${rounds}`,
      })
    } catch (e) {
      setHashErr(e instanceof Error ? e.message : 'Error')
    } finally {
      setLoading(false)
    }
  }, [input, rounds, addToHistory])

  const doCompare = useCallback(async () => {
    if (!plaintext.trim() || !hashInput.trim()) return
    setLoading(true); setCmpResult(null)
    try {
      const match = await bcrypt.compare(plaintext, hashInput)
      setCmpResult(match)
      addToHistory({
        toolId: 'bcrypt', toolName: 'Bcrypt', badge: 'BC',
        categoryName: 'Cripto',
        description: match ? 'Hash verificado ✓' : 'Hash no coincide ✗',
      })
    } catch {
      setCmpResult(false)
    } finally {
      setLoading(false)
    }
  }, [plaintext, hashInput, addToHistory])

  function copyHash() {
    navigator.clipboard.writeText(hashOut).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const tabBar = (
    <div className={ts.segmented}>
      <button className={`${ts.segmentBtn} ${tab === 'hash' ? ts.segmentActive : ''}`} onClick={() => setTab('hash')}>Hashear</button>
      <button className={`${ts.segmentBtn} ${tab === 'compare' ? ts.segmentActive : ''}`} onClick={() => setTab('compare')}>Verificar</button>
    </div>
  )

  return (
    <ToolLayout toolId="bcrypt" actions={tabBar}>
      <div className={s.layout}>
        {tab === 'hash' ? (
          <>
            <div className={s.field}>
              <label className={s.label}>Texto a hashear</label>
              <input
                className={s.input}
                type="password"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doHash()}
                placeholder="contraseña o texto secreto"
                spellCheck={false}
                autoComplete="off"
              />
            </div>

            <div className={s.roundsRow}>
              <span className={s.label}>Rounds (cost factor)</span>
              <div className={ts.segmented}>
                {[8, 10, 12, 14].map(r => (
                  <button key={r} className={`${ts.segmentBtn} ${rounds === r ? ts.segmentActive : ''}`} onClick={() => setRounds(r)}>
                    {r}
                  </button>
                ))}
              </div>
              <span className={s.roundsNote}>~{Math.round(Math.pow(2, rounds) / 1000)}k iteraciones</span>
            </div>

            <button className={s.actionBtn} onClick={doHash} disabled={loading || !input.trim()}>
              {loading ? 'Hasheando…' : 'Generar hash'}
            </button>

            {hashErr && <span className={ts.error}>{hashErr}</span>}

            {hashOut && (
              <div className={s.outputBox}>
                <code className={s.hashText}>{hashOut}</code>
                <button className={s.copyBtn} onClick={copyHash} title="Copiar">
                  {copied
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  }
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className={s.field}>
              <label className={s.label}>Texto plano</label>
              <input
                className={s.input}
                type="password"
                value={plaintext}
                onChange={e => setPlaintext(e.target.value)}
                placeholder="texto a verificar"
                autoComplete="off"
              />
            </div>
            <div className={s.field}>
              <label className={s.label}>Hash bcrypt</label>
              <input
                className={s.input}
                value={hashInput}
                onChange={e => setHashInput(e.target.value)}
                placeholder="$2b$10$..."
                spellCheck={false}
              />
            </div>
            <button className={s.actionBtn} onClick={doCompare} disabled={loading || !plaintext.trim() || !hashInput.trim()}>
              {loading ? 'Verificando…' : 'Verificar'}
            </button>
            {cmpResult !== null && (
              <div className={`${s.cmpResult} ${cmpResult ? s.cmpOk : s.cmpFail}`}>
                {cmpResult
                  ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Coincide — hash válido</>
                  : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> No coincide</>
                }
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  )
}
