import { useState, useEffect, useMemo } from 'react'
import { Icon } from '@/components/Icon'
import { SplitPane } from '@/components/SplitPane'
import { ToolLayout } from '@/components/ToolLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/store/lang.context'
import { humanSize } from '@/tools/utils/formatters'
import s from './XmlJson.module.css'

// ── XML → JSON ────────────────────────────────────────────────────────────────
function elementToValue(el: Element): unknown {
  const attrs = Array.from(el.attributes)
  const childEls = Array.from(el.children)
  const textContent = Array.from(el.childNodes)
    .filter(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim())
    .map(n => n.textContent?.trim() ?? '')
    .join('')

  if (childEls.length === 0 && attrs.length === 0) {
    return textContent || null
  }

  const obj: Record<string, unknown> = {}
  attrs.forEach(a => { obj[`@${a.name}`] = a.value })

  const grouped: Record<string, Element[]> = {}
  childEls.forEach(child => {
    if (!grouped[child.tagName]) grouped[child.tagName] = []
    grouped[child.tagName].push(child)
  })

  if (textContent && (childEls.length > 0 || attrs.length > 0)) obj['#text'] = textContent

  Object.entries(grouped).forEach(([tag, els]) => {
    obj[tag] = els.length === 1 ? elementToValue(els[0]) : els.map(e => elementToValue(e))
  })

  return obj
}

function convertXmlToJson(input: string): { ok: true; output: string; size: number } | { ok: false; error: string } {
  if (!input.trim()) return { ok: true, output: '', size: 0 }
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input.trim(), 'text/xml')
    const errEl = doc.querySelector('parsererror')
    if (errEl) {
      return { ok: false, error: errEl.textContent?.replace(/<[^>]*>/g, '').trim() ?? 'XML inválido' }
    }
    const root = doc.documentElement
    const obj: Record<string, unknown> = { [root.tagName]: elementToValue(root) }
    const output = JSON.stringify(obj, null, 2)
    return { ok: true, output, size: new TextEncoder().encode(output).length }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error desconocido' }
  }
}

// ── JSON → XML ────────────────────────────────────────────────────────────────
function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function serializeNode(key: string, value: unknown, lines: string[], depth: number): void {
  const pad = '  '.repeat(depth)

  if (Array.isArray(value)) {
    value.forEach(item => serializeNode(key, item, lines, depth))
    return
  }
  if (value === null || value === undefined) {
    lines.push(`${pad}<${key}/>`)
    return
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    lines.push(`${pad}<${key}>${escXml(String(value))}</${key}>`)
    return
  }

  const obj = value as Record<string, unknown>
  const attrsStr = Object.entries(obj)
    .filter(([k]) => k.startsWith('@'))
    .map(([k, v]) => ` ${k.slice(1)}="${escXml(String(v))}"`)
    .join('')
  const text = obj['#text']
  const children = Object.entries(obj).filter(([k]) => !k.startsWith('@') && k !== '#text')

  if (children.length === 0 && text === undefined) {
    lines.push(`${pad}<${key}${attrsStr}/>`)
    return
  }
  if (children.length === 0) {
    lines.push(`${pad}<${key}${attrsStr}>${escXml(String(text))}</${key}>`)
    return
  }

  lines.push(`${pad}<${key}${attrsStr}>`)
  if (text !== undefined) lines.push(`${pad}  ${escXml(String(text))}`)
  children.forEach(([k, v]) => serializeNode(k, v, lines, depth + 1))
  lines.push(`${pad}</${key}>`)
}

function convertJsonToXml(input: string): { ok: true; output: string; size: number } | { ok: false; error: string } {
  if (!input.trim()) return { ok: true, output: '', size: 0 }
  try {
    const obj = JSON.parse(input.trim())
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return { ok: false, error: 'El JSON debe ser un objeto con clave raíz' }
    }
    const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>']
    const keys = Object.keys(obj)
    if (keys.length === 1) {
      serializeNode(keys[0], obj[keys[0]], lines, 0)
    } else {
      lines.push('<root>')
      keys.forEach(k => serializeNode(k, obj[k], lines, 1))
      lines.push('</root>')
    }
    const output = lines.join('\n')
    return { ok: true, output, size: new TextEncoder().encode(output).length }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'JSON inválido' }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function XmlJson() {
  const [input, setInput]       = useState('')
  const [direction, setDir]     = useState<'xml2json' | 'json2xml'>('xml2json')
  const [clipboardError, setClipboardError] = useState('')
  const { addToHistory }        = useDevTools()
  const { t } = useLang()

  const isXml2Json = direction === 'xml2json'

  const result = useMemo(
    () => isXml2Json ? convertXmlToJson(input) : convertJsonToXml(input),
    [input, isXml2Json]
  )
  const inputSize = useMemo(
    () => new TextEncoder().encode(input).length,
    [input]
  )

  const output = result.ok ? result.output : ''
  const error  = !result.ok ? result.error : ''

  const debouncedInput = useDebounce(input, 1500)

  useEffect(() => {
    if (!debouncedInput || !output) return
    addToHistory({
      toolId: 'xml-json', toolName: 'XML ↔ JSON', badge: 'XJ',
      categoryName: 'Conversores',
      description: `${isXml2Json ? 'XML → JSON' : 'JSON → XML'} · ${humanSize(inputSize)}`,
    })
  }, [debouncedInput, isXml2Json, output, inputSize, addToHistory])

  function handleSwap() {
    setInput(output)
    setDir(d => d === 'xml2json' ? 'json2xml' : 'xml2json')
  }

  function handlePaste() {
    setClipboardError('')
    navigator.clipboard.readText()
      .then(setInput)
      .catch(() => setClipboardError('No se pudo acceder al portapapeles'))
  }

  function handleCopy() {
    setClipboardError('')
    navigator.clipboard.writeText(output)
      .catch(() => setClipboardError('No se pudo copiar al portapapeles'))
  }

  const swapAction = (
    <button className={s.swapBtn} onClick={handleSwap} disabled={!output} aria-label="Intercambiar XML y JSON">
      <Icon name="swap" size={14} />
      {isXml2Json ? 'XML → JSON' : 'JSON → XML'}
    </button>
  )

  const inputLabel  = isXml2Json ? 'XML' : 'JSON'
  const outputLabel = isXml2Json ? 'JSON' : 'XML'
  const placeholder = isXml2Json
    ? '<root>\n  <item id="1">valor</item>\n</root>'
    : '{\n  "root": {\n    "item": { "@id": "1", "#text": "valor" }\n  }\n}'

  return (
    <ErrorBoundary>
      <ToolLayout toolId="xml-json" actions={swapAction}>
        {clipboardError && <span className={s.error}>{clipboardError}</span>}
        <SplitPane
          primary={{
            label: inputLabel,
            meta: input ? `UTF-8 · ${humanSize(inputSize)}` : '',
            onPaste: handlePaste,
            content: (
              <textarea
                className={s.textarea}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={placeholder}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
              />
            ),
            footer: (
              <>
                {input !== debouncedInput && <span className={s.procesando}>procesando…</span>}
                <span className={s.autoNote}>{t.tcAutoUpdates}</span>
              </>
            ),
          }}
          secondary={{
            label: outputLabel,
            meta: result.ok && result.size > 0 ? humanSize(result.size) : '',
            onCopy: output ? handleCopy : undefined,
            content: error
              ? <span className={s.error}>{error}</span>
              : <div className={s.output}>{output}</div>,
          }}
        />
      </ToolLayout>
    </ErrorBoundary>
  )
}
