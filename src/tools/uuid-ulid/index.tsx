import { useState, useCallback } from 'react'
import { ulid } from 'ulid'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useLang } from '@/store/lang.context'
import s from './uuid.module.css'
import ts from '@/tools/tool.module.css'

type IdType = 'uuid' | 'ulid'

function genUUID(): string { return crypto.randomUUID() }
function genULID(): string { return ulid() }

function generate(type: IdType, count: number): string[] {
  return Array.from({ length: count }, () => type === 'uuid' ? genUUID() : genULID())
}

export default function UUIDUlid() {
  const [type,  setType]  = useState<IdType>('uuid')
  const [count, setCount] = useState(5)
  const [ids,   setIds]   = useState<string[]>(() => generate('uuid', 5))
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const { addToHistory } = useDevTools()
  const { t } = useLang()

  const regen = useCallback((idType: IdType, c: number) => {
    const next = generate(idType, c)
    setIds(next)
    addToHistory({
      toolId: 'uuid-ulid', toolName: 'UUID / ULID', badge: 'ID',
      categoryName: 'Generadores',
      description: `${c} ${idType.toUpperCase()}${c > 1 ? 's' : ''} ${t.uuidGeneratedSuffix}`,
    })
  }, [addToHistory, t])

  function handleType(idType: IdType) { setType(idType); regen(idType, count) }
  function handleCount(n: number) { setCount(n); regen(type, n) }

  function copyOne(idx: number) {
    navigator.clipboard.writeText(ids[idx]).catch(() => {})
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1200)
  }

  function copyAll() {
    navigator.clipboard.writeText(ids.join('\n')).catch(() => {})
  }

  const actions = (
    <>
      <div className={ts.segmented}>
        <button className={`${ts.segmentBtn} ${type === 'uuid' ? ts.segmentActive : ''}`} onClick={() => handleType('uuid')}>UUID v4</button>
        <button className={`${ts.segmentBtn} ${type === 'ulid' ? ts.segmentActive : ''}`} onClick={() => handleType('ulid')}>ULID</button>
      </div>
      <button className={ts.actionBtn} onClick={copyAll}>{t.uuidCopyAll}</button>
    </>
  )

  return (
    <ToolLayout toolId="uuid-ulid" hideSplit actions={actions}>
      <div className={s.layout}>
        <div className={s.controls}>
          <label className={s.countLabel}>Cantidad</label>
          <div className={s.countRow}>
            {[1, 5, 10, 20].map(n => (
              <button
                key={n}
                className={`${s.countBtn} ${count === n ? s.countActive : ''}`}
                onClick={() => handleCount(n)}
              >{n}</button>
            ))}
          </div>
          <button className={s.regenBtn} onClick={() => regen(type, count)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            {t.tcRegenerate}
          </button>
        </div>

        <div className={s.list}>
          {ids.map((id, i) => (
            <div key={i} className={s.idRow}>
              <span className={s.idNum}>{i + 1}</span>
              <code className={s.idValue}>{id}</code>
              <button className={s.copyBtn} onClick={() => copyOne(i)} title="Copiar">
                {copiedIdx === i
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
