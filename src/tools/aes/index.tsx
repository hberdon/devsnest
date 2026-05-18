import { useState } from 'react'
import CryptoJS from 'crypto-js'
import { SplitPane } from '@/components/SplitPane'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useLang } from '@/store/lang.context'
import s from './aes.module.css'
import ts from '@/tools/tool.module.css'

type Direction = 'encrypt' | 'decrypt'

function doEncrypt(text: string, password: string): { ok: true; result: string } | { ok: false; error: string } {
  if (!text || !password) return { ok: false, error: '' }
  try {
    const encrypted = CryptoJS.AES.encrypt(text, password).toString()
    return { ok: true, result: encrypted }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'aes_encrypt_error' }
  }
}

function doDecrypt(cipher: string, password: string): { ok: true; result: string } | { ok: false; error: string } {
  if (!cipher || !password) return { ok: false, error: '' }
  try {
    const bytes  = CryptoJS.AES.decrypt(cipher, password)
    const result = bytes.toString(CryptoJS.enc.Utf8)
    if (!result) return { ok: false, error: 'aes_wrong_key' }
    return { ok: true, result }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'aes_decrypt_error' }
  }
}

export default function AES() {
  const [input,     setInput]     = useState('')
  const [password,  setPassword]  = useState('')
  const [direction, setDirection] = useState<Direction>('encrypt')
  const { addToHistory } = useDevTools()
  const { t } = useLang()

  const isEncrypt = direction === 'encrypt'
  const opResult  = isEncrypt ? doEncrypt(input, password) : doDecrypt(input, password)
  const output    = opResult.ok ? opResult.result : ''
  const rawError  = !opResult.ok ? opResult.error : ''
  const error     = rawError === 'aes_wrong_key' ? t.aesWrongKey
                  : rawError === 'aes_encrypt_error' ? t.aesEncryptError
                  : rawError === 'aes_decrypt_error' ? t.aesDecryptError
                  : rawError

  function handleSwap() {
    setInput(output)
    setDirection(d => d === 'encrypt' ? 'decrypt' : 'encrypt')
  }

  function handleApply() {
    if (!output) return
    addToHistory({
      toolId: 'aes', toolName: 'AES', badge: 'AES',
      categoryName: 'Cripto',
      description: isEncrypt ? `AES cifrado · ${input.length} chars` : `AES descifrado`,
    })
  }

  const dirToggle = (
    <div className={ts.segmented}>
      <button className={`${ts.segmentBtn} ${isEncrypt ? ts.segmentActive : ''}`} onClick={() => setDirection('encrypt')}>{t.aesEncrypt}</button>
      <button className={`${ts.segmentBtn} ${!isEncrypt ? ts.segmentActive : ''}`} onClick={() => setDirection('decrypt')}>{t.aesDecrypt}</button>
    </div>
  )

  return (
    <ToolLayout toolId="aes" actions={dirToggle}>
      <div className={s.layout}>
        <div className={s.passwordRow}>
          <label className={s.pwLabel}>{t.aesPasswordLabel}</label>
          <input
            className={s.pwInput}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t.aesPasswordPlaceholder}
            autoComplete="off"
          />
          {password && (
            <button className={ts.actionBtn} onClick={handleSwap} disabled={!output}>
              ⇄ {isEncrypt ? 'Decrypt' : 'Encrypt'}
            </button>
          )}
        </div>

        <SplitPane
          primary={{
            label:   isEncrypt ? t.aesInputPlain : t.aesInputEncrypted,
            onPaste: () => navigator.clipboard.readText().then(setInput).catch(() => {}),
            content: (
              <textarea
                className={ts.textarea}
                value={input}
                onChange={e => { setInput(e.target.value); if (e.target.value && password) handleApply() }}
                placeholder={isEncrypt ? t.aesPlaceholderEncrypt : t.aesPlaceholderDecrypt}
                spellCheck={false}
              />
            ),
            footer: <span className={ts.autoNote}>{t.aesAlgorithm}</span>,
          }}
          secondary={{
            label:  isEncrypt ? t.aesOutputEncrypted : t.aesOutputDecrypted,
            onCopy: output ? () => navigator.clipboard.writeText(output).catch(() => {}) : undefined,
            content: error
              ? <span className={ts.error}>{error}</span>
              : <div className={ts.output}>{output}</div>,
          }}
        />
      </div>
    </ToolLayout>
  )
}
