import { useState, useEffect, useCallback } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import s from './ts.module.css'

type Direction = 'epoch→date' | 'date→epoch'

function epochToInfo(epoch: number): { local: string; utc: string; iso: string; relative: string } {
  const d    = new Date(epoch * 1000)
  const now  = Date.now()
  const diff = Math.round((epoch * 1000 - now) / 1000)
  const abs  = Math.abs(diff)
  let relative: string
  if (abs < 60)           relative = diff > 0 ? `en ${abs}s` : `hace ${abs}s`
  else if (abs < 3600)    relative = diff > 0 ? `en ${Math.round(abs/60)}m` : `hace ${Math.round(abs/60)}m`
  else if (abs < 86400)   relative = diff > 0 ? `en ${Math.round(abs/3600)}h` : `hace ${Math.round(abs/3600)}h`
  else                    relative = diff > 0 ? `en ${Math.round(abs/86400)}d` : `hace ${Math.round(abs/86400)}d`
  return {
    local: d.toLocaleString('es'),
    utc:   d.toUTCString(),
    iso:   d.toISOString(),
    relative,
  }
}

export default function UnixTimestamp() {
  const [input,     setInput]   = useState('')
  const [direction, setDir]     = useState<Direction>('epoch→date')
  const [now,       setNow]     = useState(() => Math.floor(Date.now() / 1000))
  const { addToHistory }        = useDevTools()

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  const isEpochToDate = direction === 'epoch→date'

  // Parse input
  const epoch = isEpochToDate
    ? (input ? parseInt(input.trim(), 10) : null)
    : (input ? Math.floor(new Date(input.trim()).getTime() / 1000) : null)

  const info   = (epoch != null && !isNaN(epoch)) ? epochToInfo(epoch) : null
  const isError = input !== '' && (epoch == null || isNaN(epoch))

  const handleNow = useCallback(() => {
    if (isEpochToDate) {
      setInput(String(now))
    } else {
      setInput(new Date().toISOString().slice(0, 16))
    }
  }, [isEpochToDate, now])

  useEffect(() => {
    if (!info || !input) return
    addToHistory({
      toolId: 'unix-timestamp', toolName: 'Unix Timestamp', badge: 'TS',
      categoryName: 'Conversores',
      description: isEpochToDate ? `${input} → ${info.relative}` : `fecha → epoch`,
    })
  }, [info?.iso]) // eslint-disable-line react-hooks/exhaustive-deps

  const nowAction = (
    <button className={s.nowBtn} onClick={handleNow} title="Insertar timestamp actual">
      Ahora → {now}
    </button>
  )

  return (
    <ToolLayout toolId="unix-timestamp" actions={nowAction}>
      <div className={s.layout}>
        {/* Live clock */}
        <div className={s.clock}>
          <span className={s.clockLabel}>Ahora mismo</span>
          <span className={s.clockEpoch}>{now}</span>
          <span className={s.clockDate}>{new Date().toLocaleString('es')}</span>
        </div>

        {/* Direction toggle */}
        <div className={s.dirToggle}>
          <button
            className={`${s.dirBtn} ${isEpochToDate ? s.dirActive : ''}`}
            onClick={() => { setDir('epoch→date'); setInput('') }}
          >
            Epoch → Fecha
          </button>
          <button
            className={`${s.dirBtn} ${!isEpochToDate ? s.dirActive : ''}`}
            onClick={() => { setDir('date→epoch'); setInput('') }}
          >
            Fecha → Epoch
          </button>
        </div>

        {/* Input */}
        <div className={s.inputSection}>
          <input
            className={s.input}
            type={isEpochToDate ? 'number' : 'datetime-local'}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={isEpochToDate ? '1735689600' : ''}
          />
          {isError && (
            <div className={s.error}>
              {isEpochToDate ? 'Epoch inválido — introduce un número' : 'Fecha inválida'}
            </div>
          )}
        </div>

        {/* Output */}
        {info && (
          <div className={s.results}>
            {isEpochToDate ? (
              <>
                <InfoRow label="Local"    value={info.local}    onCopy={() => navigator.clipboard.writeText(info.local)} />
                <InfoRow label="UTC"      value={info.utc}      onCopy={() => navigator.clipboard.writeText(info.utc)} />
                <InfoRow label="ISO 8601" value={info.iso}      onCopy={() => navigator.clipboard.writeText(info.iso)} />
                <InfoRow label="Relativo" value={info.relative} />
              </>
            ) : (
              <>
                <InfoRow label="Epoch" value={String(epoch!)} onCopy={() => navigator.clipboard.writeText(String(epoch!))} />
                <InfoRow label="ISO"   value={new Date(epoch! * 1000).toISOString()} />
              </>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

function InfoRow({ label, value, onCopy }: { label: string; value: string; onCopy?: () => void }) {
  return (
    <div className={s.infoRow}>
      <span className={s.infoLabel}>{label}</span>
      <code className={s.infoValue}>{value}</code>
      {onCopy && (
        <button className={s.copyBtn} onClick={onCopy} title="Copiar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
      )}
    </div>
  )
}
