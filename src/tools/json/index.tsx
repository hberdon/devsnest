import { useState, useRef, useCallback, useEffect } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { Icon } from '@/components/Icon'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/store/lang.context'
import { humanSize } from '@/tools/utils/formatters'
import s from './JsonValidator.module.css'

// ── Types ─────────────────────────────────────────────────────────────────
type ParseOk  = { ok: true;  value: unknown }
type ParseErr = { ok: false; error: string; line: number; col: number }
type ParseResult = ParseOk | ParseErr

type LeafNode   = { kind: 'leaf';   key: string; display: string; vtype: 'String' | 'Number' | 'Boolean' | 'Null'; depth: number }
type ObjectNode = { kind: 'object'; key: string; children: TreeNode[]; depth: number }
type ArrayNode  = { kind: 'array';  key: string; children: TreeNode[]; count: number; depth: number }
type TreeNode   = LeafNode | ObjectNode | ArrayNode

// ── Utils ─────────────────────────────────────────────────────────────────
function parseJSON(text: string): ParseResult {
  try {
    return { ok: true, value: JSON.parse(text) }
  } catch (e) {
    const msg = (e as Error).message
    let line = 0, col = 0
    // Firefox: "JSON.parse: ... at line N column M"
    const ffMatch = msg.match(/at line (\d+) column (\d+)/)
    if (ffMatch) {
      line = parseInt(ffMatch[1])
      col  = parseInt(ffMatch[2])
    } else {
      // V8: "JSON at position N" or similar
      const posMatch = msg.match(/position (\d+)/)
      if (posMatch) {
        const pos    = Math.min(parseInt(posMatch[1]), text.length - 1)
        const before = text.slice(0, pos)
        line = (before.match(/\n/g) || []).length + 1
        col  = pos - (before.lastIndexOf('\n') + 1) + 1
      }
    }
    return { ok: false, error: msg, line, col }
  }
}

function buildTree(value: unknown, key: string, depth: number): TreeNode {
  if (value === null)          return { kind: 'leaf', key, display: 'null',          vtype: 'Null',    depth }
  if (typeof value === 'string')  return { kind: 'leaf', key, display: `"${value}"`, vtype: 'String',  depth }
  if (typeof value === 'number')  return { kind: 'leaf', key, display: String(value), vtype: 'Number', depth }
  if (typeof value === 'boolean') return { kind: 'leaf', key, display: String(value), vtype: 'Boolean', depth }
  if (Array.isArray(value)) return {
    kind: 'array', key, count: value.length, depth,
    children: value.map((v, i) => buildTree(v, String(i), depth + 1)),
  }
  if (typeof value === 'object') return {
    kind: 'object', key, depth,
    children: Object.entries(value as Record<string, unknown>).map(([k, v]) => buildTree(v, k, depth + 1)),
  }
  return { kind: 'leaf', key, display: String(value), vtype: 'Null', depth }
}

function computeStats(value: unknown) {
  let keys = 0, maxDepth = 0, strings = 0, arrays = 0, booleans = 0, numbers = 0
  function walk(v: unknown, d: number) {
    maxDepth = Math.max(maxDepth, d)
    if (v === null || v === undefined) return
    if (typeof v === 'string')  { strings++;  return }
    if (typeof v === 'number')  { numbers++;  return }
    if (typeof v === 'boolean') { booleans++; return }
    if (Array.isArray(v))       { arrays++; v.forEach(item => walk(item, d + 1)); return }
    if (typeof v === 'object') {
      const entries = Object.entries(v as Record<string, unknown>)
      keys += entries.length
      entries.forEach(([, val]) => walk(val, d + 1))
    }
  }
  walk(value, 0)
  return { keys, depth: maxDepth, strings, arrays, booleans, numbers }
}

// ── Tree component ────────────────────────────────────────────────────────
function TreeNodeEl({ node }: { node: TreeNode }) {
  const [open, setOpen] = useState(true)

  if (node.kind === 'leaf') {
    return (
      <div className={s.treeRow}>
        <span className={s.treeDot}>·</span>
        {node.key !== '' && <span className={s.treeKey}>{node.key}: </span>}
        <span className={`${s.treeValue} ${(s as Record<string, string>)[`treeVal${node.vtype}`] ?? ''}`}>{node.display}</span>
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

  // object
  return (
    <>
      <div className={s.treeRow} style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setOpen(o => !o)}>
        <span className={s.treeChev}>{open ? '▾' : '▸'}</span>
        <span className={s.treeKey}>{node.key !== '' ? node.key : 'object'}</span>
      </div>
      {open && node.children.length > 0 && (
        <div className={s.treeChildren}>
          {node.children.map((child, i) => <TreeNodeEl key={i} node={child} />)}
        </div>
      )}
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function JSONValidator() {
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
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const trimmed   = input.trim()
  const result    = trimmed ? parseJSON(trimmed) : null
  const lines     = input.split('\n')
  const lineCount = Math.max(lines.length, 1)
  const byteSize  = new TextEncoder().encode(input).length
  const errorLine = result && !result.ok ? result.line : 0

  const tree  = result?.ok ? buildTree(result.value, '', 0) : null
  const stats = result?.ok ? computeStats(result.value) : null

  const debouncedInput = useDebounce(input, 1200)
  useEffect(() => {
    if (!debouncedInput || !result?.ok) return
    addToHistory({
      toolId: 'json', toolName: 'JSON', badge: '{}',
      categoryName: 'Formateadores',
      description: `Validado · ${humanSize(byteSize)}`,
    })
  }, [debouncedInput]) // eslint-disable-line react-hooks/exhaustive-deps

  const syncScroll = useCallback(() => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [])

  function handleFileLoad(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setInput((ev.target?.result as string) ?? '')
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleFormat() {
    if (!result?.ok) return
    setInput(JSON.stringify(result.value, null, 2))
  }

  function handleMinify() {
    if (!result?.ok) return
    setInput(JSON.stringify(result.value))
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const text = e.clipboardData.getData('text')
    if (!text.trim()) return
    e.preventDefault()
    try {
      const parsed = JSON.parse(text)
      setInput(JSON.stringify(parsed, null, 2))
    } catch {
      setInput(text)
    }
  }

  const exportBtn = null

  return (
    <ToolLayout toolId="json" hideSplit actions={exportBtn}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleFileLoad}
      />
      <div className={s.grid}>

        {/* ── Left: Editor ───────────────────────────────────────────── */}
        <div className={s.editorCard}>
          <div className={s.cardHeader}>
            <strong>JSON</strong>
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
                  <button className={s.menuItem} disabled>
                    <Icon name="schema" size={12} />
                    {t.jsonValidateSchema}
                  </button>
                  <div className={s.menuSep} />
                  <button
                    className={s.menuItem}
                    onClick={() => { fileInputRef.current?.click(); setMenuOpen(false) }}
                  >
                    <Icon name="upload" size={12} />
                    {t.tcLoadFile}
                  </button>
                  <button
                    className={s.menuItem}
                    onClick={() => { navigator.clipboard.readText().then(setInput).catch(() => {}); setMenuOpen(false) }}
                  >
                    <Icon name="paste" size={12} />
                    {t.tcPaste}
                  </button>
                  <button
                    className={s.menuItem}
                    disabled={byteSize === 0}
                    onClick={() => { navigator.clipboard.writeText(input).catch(() => {}); setMenuOpen(false) }}
                  >
                    <Icon name="copy" size={12} />
                    {t.jsonCopyJson}
                  </button>
                  <button
                    className={s.menuItem}
                    disabled={byteSize === 0}
                    onClick={() => { setInput(''); setMenuOpen(false) }}
                  >
                    <Icon name="trash" size={12} />
                    {t.tcClearEditor}
                  </button>
                  <div className={s.menuSep} />
                  <button
                    className={s.menuItem}
                    disabled={!result?.ok}
                    onClick={() => {
                      if (!result?.ok) return
                      const blob = new Blob([input], { type: 'application/json' })
                      const url  = URL.createObjectURL(blob)
                      const a    = document.createElement('a')
                      a.href = url; a.download = 'data.json'; a.click()
                      URL.revokeObjectURL(url)
                      setMenuOpen(false)
                    }}
                  >
                    <Icon name="download" size={12} />
                    {t.jsonExportJson}
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
              placeholder={'{\n  "clave": "valor"\n}'}
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

          {/* Card 2: Validation status */}
          <div className={s.statusCard}>
            {!result ? (
              <div className={`${s.statusHeader} ${s.statusHeaderEmpty}`}>
                <strong>{t.jsonReadyToValidate}</strong>
                <span className={s.statusMeta}>{t.jsonPasteLeft}</span>
              </div>
            ) : result.ok ? (
              <>
                <div className={`${s.statusHeader} ${s.statusHeaderValid}`}>
                  <div className={`${s.statusIcon} ${s.statusIconValid}`}>
                    <Icon name="check" size={12} color="#10b981" strokeWidth={2.5} />
                  </div>
                  <strong>{t.jsonValid}</strong>
                  <span className={s.statusMeta}>{t.jsonNoErrors}</span>
                </div>
                <div className={s.statusBody}>
                  <div className={s.statusMsg}>{t.jsonSyntaxOk}</div>
                  {stats && (
                    <div className={s.chips}>
                      <span className={s.chip}>UTF-8</span>
                      <span className={s.chip}>{humanSize(byteSize)}</span>
                      <span className={s.chip}>{t.tcDepth} {stats.depth}</span>
                      <span className={s.chip}>{stats.keys} {t.jsonKeys}</span>
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
                  <strong>{t.jsonInvalid}</strong>
                  <span className={s.statusMeta}>{t.jsonOneError}</span>
                </div>
                <div className={s.statusBody}>
                  <div className={s.errorList}>
                    <div className={s.errorRow}>
                      {result.line > 0 && (
                        <span className={s.errorBadge}>L{result.line}:{result.col}</span>
                      )}
                      <div className={s.errorText}>{result.error}</div>
                      <button className={s.errorGoBtn} title="Ir a la línea">
                        <Icon name="chev-r" size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Card 3: Tree */}
          <div className={s.treeCard}>
            <div className={s.treeHeader}>
              <strong>{t.tcTree}</strong>
              <span className={s.treeMeta}>&nbsp;· {t.tcNavigable}</span>
              <div className={s.treeActions}>
                <button className={s.treeActionPill}>{t.tcExpandAll}</button>
                <button className={s.treeActionBtn} title={t.jsonCopyPath}>
                  <Icon name="copy" size={12} />
                </button>
              </div>
            </div>
            <div className={s.treeBody}>
              {tree ? (
                <TreeNodeEl node={tree} />
              ) : (
                <span className={s.treePlaceholder}>
                  {result && !result.ok
                    ? t.tcEmptyTreeFix
                    : t.tcEmptyTreeHere
                  }
                </span>
              )}
            </div>
            {stats && (
              <div className={s.treeFooter}>
                {[
                  stats.keys    > 0 ? `${stats.keys} ${t.jsonKeys}` : '',
                  `${t.tcDepth} ${stats.depth}`,
                  stats.strings  > 0 ? `${stats.strings} strings`  : '',
                  stats.arrays   > 0 ? `${stats.arrays} arrays`    : '',
                  stats.booleans > 0 ? `${stats.booleans} bool`    : '',
                  stats.numbers  > 0 ? `${stats.numbers} number`   : '',
                ].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>

        </div>
      </div>
    </ToolLayout>
  )
}
