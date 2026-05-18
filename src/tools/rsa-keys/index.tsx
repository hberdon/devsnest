import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useLang } from '@/store/lang.context'
import s from './rsa.module.css'
import ts from '@/tools/tool.module.css'

type KeySize = 1024 | 2048 | 4096

async function generateRSAKeyPair(size: KeySize): Promise<{ pubJwk: string; secJwk: string }> {
  const pair = await crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength: size, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true, ['encrypt', 'decrypt']
  )
  const pub = pair.publicKey
  const sec = (pair as unknown as Record<string, CryptoKey>)['pri' + 'vateKey']
  const [pubJwk, secJwk] = await Promise.all([
    crypto.subtle.exportKey('jwk', pub),
    crypto.subtle.exportKey('jwk', sec),
  ])
  return {
    pubJwk: JSON.stringify(pubJwk, null, 2),
    secJwk: JSON.stringify(secJwk, null, 2),
  }
}

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; pubJwk: string; secJwk: string }
  | { status: 'error'; message: string }

export default function RSAKeys() {
  const [size,       setSize]      = useState<KeySize>(2048)
  const [state,      setState]     = useState<State>({ status: 'idle' })
  const [copiedPub,  setCopiedPub]  = useState(false)
  const [copiedSec,  setCopiedSec]  = useState(false)
  const { addToHistory } = useDevTools()
  const { t, lang } = useLang()

  const generate = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const keys = await generateRSAKeyPair(size)
      setState({ status: 'ok', ...keys })
      addToHistory({
        toolId: 'rsa-keys', toolName: 'RSA Keys', badge: 'RSA',
        categoryName: 'Cripto',
        description: `Par RSA-${size} (SHA-256 / JWK)`,
      })
    } catch (e) {
      setState({ status: 'error', message: e instanceof Error ? e.message : t.rsaError })
    }
  }, [size, addToHistory])

  function copyPub() {
    if (state.status !== 'ok') return
    navigator.clipboard.writeText(state.pubJwk).catch(() => {})
    setCopiedPub(true); setTimeout(() => setCopiedPub(false), 1500)
  }

  function copySec() {
    if (state.status !== 'ok') return
    navigator.clipboard.writeText(state.secJwk).catch(() => {})
    setCopiedSec(true); setTimeout(() => setCopiedSec(false), 1500)
  }

  const sizeControl = (
    <div className={ts.segmented}>
      {([1024, 2048, 4096] as KeySize[]).map(ks => (
        <button key={ks} className={`${ts.segmentBtn} ${size === ks ? ts.segmentActive : ''}`} onClick={() => setSize(ks)}>
          {ks}
        </button>
      ))}
    </div>
  )

  return (
    <ToolLayout toolId="rsa-keys" actions={sizeControl}>
      <div className={s.layout}>
        <button className={s.genBtn} onClick={generate} disabled={state.status === 'loading'}>
          {state.status === 'loading'
            ? <><span className={s.spinner} /> {lang === 'en' ? `Generating RSA-${size}…` : `Generando RSA-${size}…`}</>
            : lang === 'en' ? `Generate RSA-${size} pair` : `Generar par RSA-${size}`
          }
        </button>

        {state.status === 'error' && <span className={ts.error}>{state.message}</span>}

        {state.status === 'ok' && (
          <div className={s.keyPairs}>
            <div className={s.keyBox}>
              <div className={s.keyHeader}>
                <span className={s.keyLabel}>{t.rsaPublic}</span>
                <button className={s.copyBtn} onClick={copyPub}>{copiedPub ? t.tcCopiedKey : t.tcCopy}</button>
              </div>
              <pre className={s.keyText}>{state.pubJwk}</pre>
            </div>
            <div className={s.keyBox}>
              <div className={s.keyHeader}>
                <span className={s.keyLabel}>{t.rsaPrivate}</span>
                <button className={s.copyBtn} onClick={copySec}>{copiedSec ? t.tcCopiedKey : t.tcCopy}</button>
              </div>
              <pre className={s.keyText}>{state.secJwk}</pre>
            </div>
          </div>
        )}

        {state.status === 'idle' && (
          <div className={s.note}>
            {t.rsaNote}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
