import { useState, useRef, useCallback, useEffect } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { Icon } from '@/components/Icon'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/store/lang.context'
import { formatXML, humanSize } from '@/tools/utils/formatters'
import s from './XMLFormatter.module.css'

// ── Types ─────────────────────────────────────────────────────────────────
type ParseOk  = { ok: true;  doc: Document }
type ParseErr = { ok: false; error: string; line: number; col: number }
type ParseResult = ParseOk | ParseErr

type LeafNode   = { kind: 'leaf';   key: string; display: string; vtype: 'String' | 'Attr' | 'Null'; depth: number }
type ObjectNode = { kind: 'object'; key: string; children: TreeNode[]; depth: number }
type ArrayNode  = { kind: 'array';  key: string; children: TreeNode[]; count: number; depth: number }
type TreeNode   = LeafNode | ObjectNode | ArrayNode

// ── Utils ─────────────────────────────────────────────────────────────────
function parseXML(text: string): ParseResult {
  const parser = new DOMParser()
  const doc    = parser.parseFromString(text, 'text/xml')
  const errEl  = doc.querySelector('parsererror')
  if (errEl) {
    const raw = errEl.textContent ?? 'XML inválido'
    const msg = raw.replace(/<[^>]*>/g, '').trim()
    let line = 0, col = 0
    const chromeM = msg.match(/line (\d+) at column (\d+)/i)
    if (chromeM) { line = parseInt(chromeM[1]); col = parseInt(chromeM[2]) }
    const ffM = msg.match(/[Ll]ine[^\d]*(\d+)[^\d]*[Cc]olumn[^\d]*(\d+)/)
    if (!chromeM && ffM) { line = parseInt(ffM[1]); col = parseInt(ffM[2]) }
    return { ok: false, error: msg, line, col }
  }
  return { ok: true, doc }
}

function buildXMLTree(node: Element, key: string, depth: number, emptyLabel = '(empty)'): TreeNode {
  const children: TreeNode[] = []

  Array.from(node.attributes ?? []).forEach(attr => {
    children.push({ kind: 'leaf', key: `@${attr.name}`, display: `"${attr.value}"`, vtype: 'Attr', depth: depth + 1 })
  })

  const childEls = Array.from(node.childNodes).filter(n =>
    n.nodeType === Node.ELEMENT_NODE ||
    (n.nodeType === Node.TEXT_NODE && n.textContent?.trim())
  )

  const grouped: Record<string, Element[]> = {}
  const order: string[] = []
  childEls.forEach(n => {
    if (n.nodeType === Node.ELEMENT_NODE) {
      const name = (n as Element).nodeName
      if (!grouped[name]) { grouped[name] = []; order.push(name) }
      grouped[name].push(n as Element)
    } else {
      const text = n.textContent?.trim() ?? ''
      if (text) children.push({ kind: 'leaf', key: '', display: `"${text}"`, vtype: 'String', depth: depth + 1 })
    }
  })

  order.forEach(name => {
    const els = grouped[name]
    if (els.length === 1) {
      children.push(buildXMLTree(els[0], name, depth + 1, emptyLabel))
    } else {
      children.push({
        kind: 'array', key: name, count: els.length, depth: depth + 1,
        children: els.map((el, i) => buildXMLTree(el, String(i), depth + 2, emptyLabel)),
      })
    }
  })

  if (children.length === 0) {
    return { kind: 'leaf', key, display: emptyLabel, vtype: 'Null', depth }
  }
  return { kind: 'object', key, children, depth }
}

function computeStats(doc: Document) {
  let elements = 0, attrs = 0, maxDepth = 0, textNodes = 0
  function walk(node: Node, d: number) {
    maxDepth = Math.max(maxDepth, d)
    if (node.nodeType === Node.ELEMENT_NODE) {
      elements++
      attrs += (node as Element).attributes.length
      Array.from(node.childNodes).forEach(c => walk(c, d + 1))
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      textNodes++
    }
  }
  walk(doc.documentElement, 0)
  return { elements, attrs, depth: maxDepth, textNodes }
}

// ── Tree component ─────────────────────────────────────────────────────────
function TreeNodeEl({ node }: { node: TreeNode }) {
  const [open, setOpen] = useState(true)

  if (node.kind === 'leaf') {
    return (
      <div className={s.treeRow}>
        <span className={s.treeDot}>·</span>
        {node.key !== '' && <span className={node.vtype === 'Attr' ? s.treeAttr : s.treeKey}>{node.key}: </span>}
        <span className={`${s.treeValue} ${node.vtype === 'Attr' ? s.treeValAttr : node.vtype === 'Null' ? s.treeValNull : s.treeValString}`}>
          {node.display}
        </span>
      </div>
    )
  }
  if (node.kind === 'array') {
    return (
      <>
        <div className={s.treeRow} style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setOpen(o => !o)}>
          <span className={s.treeChev}>{open ? '▾' : '▸'}</span>
          {node.key !== '' && <span className={s.treeKey}>{node.key}</span>}
          <span className={s.treeArrayBadge}>[{node.count}]</span>
        </div>
        {open && node.children.length > 0 && (
          <div className={s.treeChildren}>
            {node.children.map((child, i) => <TreeNodeEl key={i} node={child} />)}
          </div>
        )}
      </>
    )
  }
  return (
    <>
      <div className={s.treeRow} style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setOpen(o => !o)}>
        <span className={s.treeChev}>{open ? '▾' : '▸'}</span>
        <span className={s.treeKey}>{node.key !== '' ? node.key : 'element'}</span>
      </div>
      {open && node.children.length > 0 && (
        <div className={s.treeChildren}>
          {node.children.map((child, i) => <TreeNodeEl key={i} node={child} />)}
        </div>
      )}
    </>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function XMLFormatter() {
  const [input, setInput]       = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef                 = useRef<HTMLDivElement>(null)
  const fileInputRef            = useRef<HTMLInputElement>(null)
  const textareaRef             = useRef<HTMLTextAreaElement>(null)
  const gutterRef               = useRef<HTMLDivElement>(null)
  const { addToHistory }        = useDevTools()
  const { t } = useLang()

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const trimmed   = input.trim()
  const result    = trimmed ? parseXML(trimmed) : null
  const lines     = input.split('\n')
  const lineCount = Math.max(lines.length, 1)
  const byteSize  = new TextEncoder().encode(input).length
  const errorLine = result && !result.ok ? result.line : 0

  const tree  = result?.ok ? buildXMLTree(result.doc.documentElement, result.doc.documentElement.nodeName, 0, t.xmlEmpty) : null
  const stats = result?.ok ? computeStats(result.doc) : null

  const debouncedInput = useDebounce(input, 1200)
  useEffect(() => {
    if (!debouncedInput || !result?.ok) return
    addToHistory({
      toolId: 'xml', toolName: 'XML', badge: 'XML',
      categoryName: 'Formateadores',
      description: `${t.xmlValidated} · ${humanSize(byteSize)}`,
    })
  }, [debouncedInput]) // eslint-disable-line react-hooks/exhaustive-deps

  const syncScroll = useCallback(() => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [])

  function handleFormat() {
    if (!result?.ok) return
    const r = formatXML(input.trim(), 2)
    if (r.ok) setInput(r.output)
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const text = e.clipboardData.getData('text')
    if (!text.trim()) return
    e.preventDefault()
    const parsed = parseXML(text.trim())
    if (parsed.ok) {
      const r = formatXML(text.trim(), 2)
      if (r.ok) { setInput(r.output); return }
    }
    setInput(text)
  }

  function handleMinify() {
    if (!result?.ok) return
    setInput(input.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim())
  }

  function handleFileLoad(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setInput((ev.target?.result as string) ?? '')
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <ToolLayout toolId="xml" hideSplit>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xml,text/xml,application/xml"
        style={{ display: 'none' }}
        onChange={handleFileLoad}
      />
      <div className={s.grid}>

        {/* ── Left: Editor ───────────────────────────────────────────── */}
        <div className={s.editorCard}>
          <div className={s.cardHeader}>
            <strong>XML</strong>
            {byteSize > 0 && (
              <span className={s.cardMeta}>
                UTF-8 · {humanSize(byteSize)} · {lineCount} {t.tcLines}
              </span>
            )}
            <div ref={menuRef} className={s.menuWrap}>
              <button
                className={`${s.moreBtn} ${menuOpen ? s.moreBtnActive : ''}`}
                onClick={() => setMenuOpen(o => !o)}
                title={t.tcActions}
              >
                <Icon name="more" size={18} />
              </button>
              {menuOpen && (
                <div className={s.menu}>
                  <button className={s.menuItem} disabled={!result?.ok} onClick={() => { handleFormat(); setMenuOpen(false) }}>
                    <Icon name="cat-fmt" size={12} />
                    {t.tcFormat}
                  </button>
                  <button className={s.menuItem} disabled={!result?.ok} onClick={() => { handleMinify(); setMenuOpen(false) }}>
                    <Icon name="minify" size={12} />
                    {t.tcMinify}
                  </button>
                  <div className={s.menuSep} />
                  <button className={s.menuItem} onClick={() => { fileInputRef.current?.click(); setMenuOpen(false) }}>
                    <Icon name="upload" size={12} />
                    {t.tcLoadFile}
                  </button>
                  <button className={s.menuItem} onClick={() => { navigator.clipboard.readText().then(setInput).catch(() => {}); setMenuOpen(false) }}>
                    <Icon name="paste" size={12} />
                    {t.tcPaste}
                  </button>
                  <button className={s.menuItem} disabled={byteSize === 0} onClick={() => { navigator.clipboard.writeText(input).catch(() => {}); setMenuOpen(false) }}>
                    <Icon name="copy" size={12} />
                    {t.xmlCopyXml}
                  </button>
                  <button className={s.menuItem} disabled={byteSize === 0} onClick={() => { setInput(''); setMenuOpen(false) }}>
                    <Icon name="trash" size={12} />
                    {t.tcClearEditor}
                  </button>
                  <div className={s.menuSep} />
                  <button
                    className={s.menuItem}
                    disabled={!result?.ok}
                    onClick={() => {
                      if (!result?.ok) return
                      const blob = new Blob([input], { type: 'application/xml' })
                      const url  = URL.createObjectURL(blob)
                      const a    = document.createElement('a')
                      a.href = url; a.download = 'data.xml'; a.click()
                      URL.revokeObjectURL(url)
                      setMenuOpen(false)
                    }}
                  >
                    <Icon name="download" size={12} />
                    {t.xmlExportXml}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={s.editorWrap}>
            <div ref={gutterRef} className={s.gutter} aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => (
                <div
                  key={i}
                  className={`${s.gutterLine}${errorLine === i + 1 ? ` ${s.gutterError}` : ''}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              className={s.code}
              value={input}
              onChange={e => setInput(e.target.value)}
              onScroll={syncScroll}
              onPaste={handlePaste}
              placeholder={'<root>\n  <item>valor</item>\n</root>'}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>

          {result && !result.ok && errorLine > 0 && (
            <div className={s.annotation}>{t.jsonErrorLine} {errorLine}</div>
          )}
        </div>

        {/* ── Right column ───────────────────────────────────────────── */}
        <div className={s.rightCol}>

          {/* Validation status */}
          <div className={s.statusCard}>
            {!result ? (
              <div className={`${s.statusHeader} ${s.statusHeaderEmpty}`}>
                <strong>{t.jsonReadyToValidate}</strong>
                <span className={s.statusMeta}>{t.xmlPasteLeft}</span>
              </div>
            ) : result.ok ? (
              <>
                <div className={`${s.statusHeader} ${s.statusHeaderValid}`}>
                  <div className={`${s.statusIcon} ${s.statusIconValid}`}>
                    <Icon name="check" size={12} color="#10b981" strokeWidth={2.5} />
                  </div>
                  <strong>{t.xmlValid}</strong>
                  <span className={s.statusMeta}>{t.jsonNoErrors}</span>
                </div>
                <div className={s.statusBody}>
                  <div className={s.statusMsg}>{t.jsonSyntaxOk}</div>
                  {stats && (
                    <div className={s.chips}>
                      <span className={s.chip}>UTF-8</span>
                      <span className={s.chip}>{humanSize(byteSize)}</span>
                      <span className={s.chip}>{t.tcDepth} {stats.depth}</span>
                      <span className={s.chip}>{stats.elements} {t.xmlElements}</span>
                      {stats.attrs > 0 && <span className={s.chip}>{stats.attrs} {t.xmlAttributes}</span>}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className={`${s.statusHeader} ${s.statusHeaderInvalid}`}>
                  <div className={`${s.statusIcon} ${s.statusIconInvalid}`}>
                    <Icon name="warn" size={12} color="#b91c1c" />
                  </div>
                  <strong>{t.xmlInvalid}</strong>
                  <span className={s.statusMeta}>{t.jsonOneError}</span>
                </div>
                <div className={s.statusBody}>
                  <div className={s.errorList}>
                    <div className={s.errorRow}>
                      {result.line > 0 && (
                        <span className={s.errorBadge}>L{result.line}:{result.col}</span>
                      )}
                      <div className={s.errorText}>{result.error}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tree */}
          <div className={s.treeCard}>
            <div className={s.treeHeader}>
              <strong>{t.tcTree}</strong>
              <span className={s.treeMeta}>&nbsp;· {t.tcNavigable}</span>
            </div>
            <div className={s.treeBody}>
              {tree ? (
                <TreeNodeEl node={tree} />
              ) : (
                <span className={s.treePlaceholder}>
                  {result && !result.ok
                    ? t.xmlFixForTree
                    : t.xmlTreeHere
                  }
                </span>
              )}
            </div>
            {stats && (
              <div className={s.treeFooter}>
                {[
                  `${stats.elements} ${t.xmlElements}`,
                  stats.attrs > 0 ? `${stats.attrs} ${t.xmlAttributes}` : '',
                  `${t.tcDepth} ${stats.depth}`,
                  stats.textNodes > 0 ? `${stats.textNodes} textos` : '',
                ].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>

        </div>
      </div>
    </ToolLayout>
  )
}
