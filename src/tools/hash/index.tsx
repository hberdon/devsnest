import { useState, useEffect } from 'react'
import SparkMD5 from 'spark-md5'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/store/lang.context'
import s from './hash.module.css'
import ts from '@/tools/tool.module.css'

type HashAlgo = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512'

const ALGOS: HashAlgo[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512']

async function computeHash(text: string, algo: HashAlgo): Promise<string> {
  if (!text) return ''
  if (algo === 'MD5') return SparkMD5.hash(text)
  const encoded = new TextEncoder().encode(text)
  const buf     = await crypto.subtle.digest(algo, encoded)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function Hash() {
  const [input,  setInput]  = useState('')
  const [hashes, setHashes] = useState<Record<HashAlgo, string>>({ 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-512': '' })
  const [copied, setCopied] = useState<HashAlgo | null>(null)
  const { addToHistory } = useDevTools()
  const { t } = useLang()

  const debouncedInput = useDebounce(input, 400)

  useEffect(() => {
    if (!debouncedInput) {
      setHashes({ 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-512': '' })
      return
    }
    Promise.all(ALGOS.map(a => computeHash(debouncedInput, a))).then(results => {
      const next = {} as Record<HashAlgo, string>
      ALGOS.forEach((a, i) => { next[a] = results[i] })
      setHashes(next)
    })
  }, [debouncedInput])

  useEffect(() => {
    if (!debouncedInput || !hashes['SHA-256']) return
    addToHistory({
      toolId: 'hash', toolName: 'Hash MD5 / SHA', badge: '#',
      categoryName: 'Generadores',
      description: `${debouncedInput.length} chars → MD5/SHA-1/256/512`,
    })
  }, [hashes['SHA-256']]) // eslint-disable-line react-hooks/exhaustive-deps

  function copyHash(algo: HashAlgo) {
    navigator.clipboard.writeText(hashes[algo]).catch(() => {})
    setCopied(algo)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <ToolLayout toolId="hash">
      <div className={s.layout}>
        <div className={s.inputSection}>
          <label className={s.inputLabel}>{t.hashInputLabel}</label>
          <textarea
            className={`${ts.textarea} ${s.inputArea}`}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t.hashInputPlaceholder}
            spellCheck={false}
            rows={4}
          />
        </div>

        <div className={s.results}>
          {ALGOS.map(algo => (
            <div key={algo} className={s.hashRow}>
              <span className={s.algoLabel}>{algo}</span>
              <code className={s.hashValue}>{hashes[algo] || <span className={s.empty}>—</span>}</code>
              <button
                className={s.copyBtn}
                onClick={() => copyHash(algo)}
                disabled={!hashes[algo]}
                title={t.tcCopy}
              >
                {copied === algo
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                }
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
