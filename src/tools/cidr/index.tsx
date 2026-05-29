import { useState, useMemo } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useLang } from '@/store/lang.context'
import s from './cidr.module.css'
import ts from '@/tools/tool.module.css'

interface CIDRInfo {
  network:    string
  broadcast:  string
  firstHost:  string
  lastHost:   string
  subnetMask: string
  wildcard:   string
  prefix:     number
  totalHosts: number
  usableHosts: number
}

function ipToNum(ip: string): number {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0) >>> 0
}

function numToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
}

function parseCIDR(cidr: string): CIDRInfo | null {
  const m = cidr.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/)
  if (!m) return null
  const [, ip, prefixStr] = m
  const prefix = parseInt(prefixStr, 10)
  if (prefix < 0 || prefix > 32) return null
  const parts = ip.split('.').map(Number)
  if (parts.some(p => p < 0 || p > 255)) return null

  const mask    = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const ipNum   = ipToNum(ip)
  const netNum  = (ipNum & mask) >>> 0
  const bcast   = (netNum | (~mask >>> 0)) >>> 0
  const total   = Math.pow(2, 32 - prefix)
  const usable  = prefix >= 31 ? total : Math.max(0, total - 2)

  return {
    network:    numToIp(netNum),
    broadcast:  numToIp(bcast),
    firstHost:  prefix >= 31 ? numToIp(netNum) : numToIp(netNum + 1),
    lastHost:   prefix >= 31 ? numToIp(bcast)  : numToIp(bcast - 1),
    subnetMask: numToIp(mask),
    wildcard:   numToIp(~mask >>> 0),
    prefix,
    totalHosts: total,
    usableHosts: usable,
  }
}

export default function CIDR() {
  const [input,  setInput]  = useState('192.168.1.0/24')
  const [copied, setCopied] = useState<string | null>(null)
  const { addToHistory } = useDevTools()
  const { t, lang } = useLang()
  const locale = lang === 'es' ? 'es' : 'en'

  const ROWS: { key: keyof CIDRInfo; label: string; format?: (v: CIDRInfo[keyof CIDRInfo]) => string }[] = [
    { key: 'network',     label: t.cidrNetwork   },
    { key: 'subnetMask',  label: t.cidrMask      },
    { key: 'wildcard',    label: t.cidrWildcard  },
    { key: 'firstHost',   label: t.cidrFirstIp   },
    { key: 'lastHost',    label: t.cidrLastIp    },
    { key: 'broadcast',   label: t.cidrBroadcast },
    { key: 'totalHosts',  label: t.cidrTotal,     format: v => Number(v).toLocaleString(locale) },
    { key: 'usableHosts', label: t.cidrUsable,    format: v => Number(v).toLocaleString(locale) },
  ]

  const info   = useMemo(() => parseCIDR(input), [input])
  const isErr  = input.trim() !== '' && !info

  function copy(key: string, value: string) {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 1200)
    if (info) {
      addToHistory({
        toolId: 'cidr', toolName: 'CIDR', badge: '/24',
        categoryName: 'Red',
        description: `${input} → ${info.totalHosts.toLocaleString(locale)} IPs`,
      })
    }
  }

  return (
    <ToolLayout toolId="cidr" hideSplit>
      <div className={s.layout}>
        <div className={s.inputSection}>
          <label className={s.label}>{t.cidrLabel}</label>
          <input
            className={`${s.input} ${isErr ? s.inputErr : ''}`}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="192.168.1.0/24"
            spellCheck={false}
          />
          {isErr && <span className={ts.error}>{t.cidrInvalid}</span>}
        </div>

        {info && (
          <>
            <div className={s.badge}>/{info.prefix} — {info.usableHosts.toLocaleString(locale)} {t.cidrUsableLabel}</div>
            <div className={s.results}>
              {ROWS.map(({ key, label, format }) => {
                const raw = info[key]
                const val = format ? format(raw) : String(raw)
                return (
                  <div key={key} className={s.row}>
                    <span className={s.rowLabel}>{label}</span>
                    <code className={s.rowValue}>{val}</code>
                    {typeof raw === 'string' && (
                      <button className={s.copyBtn} onClick={() => copy(key, val)} title="Copiar">
                        {copied === key
                          ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        }
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
