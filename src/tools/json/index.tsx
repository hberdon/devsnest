import { useState, useRef, useCallback, useEffect } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { Icon } from '@/components/Icon'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
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
        <div className={s.treeRow}>
          <span className={s.treeChev}>▾</span>
          {node.key !== '' && <span className={s.treeKey}>{node.key}</span>}
          <span className={s.treeArrayBadge}>[{node.count}]</span>
        </div>
        {node.children.length > 0 && (
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
      <div className={s.treeRow}>
        <span className={s.treeChev}>▾</span>
        <span className={s.treeKey}>{node.key !== '' ? node.key : 'object'}</span>
      </div>
      {node.children.length > 0 && (
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
  const textareaRef             = useRef<HTMLTextAreaElement>(null)
  const gutterRef               = useRef<HTMLDivElement>(null)
  const { addToHistory }        = useDevTools()

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

  function handleFormat() {
    if (!result?.ok) return
    setInput(JSON.stringify(result.value, null, 2))
  }

  function handleMinify() {
    if (!result?.ok) return
    setInput(JSON.stringify(result.value))
  }

  const exportBtn = null

  return (
    <ToolLayout toolId="json" hideSplit actions={exportBtn}>
      <div className={s.grid}>

        {/* ── Left: Editor ───────────────────────────────────────────── */}
        <div className={s.editorCard}>
          <div className={s.cardHeader}>
            <strong>JSON</strong>
            {byteSize > 0 && (
              <span className={s.cardMeta}>
                UTF-8 · {humanSize(byteSize)} · {lineCount} líneas
              </span>
            )}
            <div ref={menuRef} className={s.menuWrap}>
              <button
                className={`${s.moreBtn} ${menuOpen ? s.moreBtnActive : ''}`}
                onClick={() => setMenuOpen(o => !o)}
                title="Acciones"
              >
                <Icon name="more" size={18} />
              </button>
              {menuOpen && (
                <div className={s.menu}>
                  <button className={s.menuItem} disabled={!result?.ok} onClick={() => { handleFormat(); setMenuOpen(false) }}>
                    Formatear
                  </button>
                  <button className={s.menuItem} disabled={!result?.ok} onClick={() => { handleMinify(); setMenuOpen(false) }}>
                    Minificar
                  </button>
                  <div className={s.menuSep} />
                  <button className={s.menuItem} disabled>
                    <Icon name="schema" size={12} />
                    Validar Schema
                  </button>
                  <div className={s.menuSep} />
                  <button
                    className={s.menuItem}
                    onClick={() => { navigator.clipboard.readText().then(setInput).catch(() => {}); setMenuOpen(false) }}
                  >
                    Pegar desde portapapeles
                  </button>
                  <button
                    className={s.menuItem}
                    disabled={byteSize === 0}
                    onClick={() => { navigator.clipboard.writeText(input).catch(() => {}); setMenuOpen(false) }}
                  >
                    <Icon name="copy" size={12} />
                    Copiar JSON
                  </button>
                  <button
                    className={s.menuItem}
                    disabled={byteSize === 0}
                    onClick={() => { setInput(''); setMenuOpen(false) }}
                  >
                    Limpiar editor
                  </button>
                  <div className={s.menuSep} />
                  <button
                    className={s.menuItem}
                    disabled={!result?.ok}
                    onClick={() => {
                      if (!result?.ok) return
                      const blob = new Blob([JSON.stringify(result.value, null, 2)], { type: 'application/json' })
                      const url  = URL.createObjectURL(blob)
                      const a    = document.createElement('a')
                      a.href = url; a.download = 'data.json'; a.click()
                      URL.revokeObjectURL(url)
                      setMenuOpen(false)
                    }}
                  >
                    <Icon name="download" size={12} />
                    Exportar JSON
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
              placeholder={'{\n  "clave": "valor"\n}'}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>

          {result && !result.ok && errorLine > 0 && (
            <div className={s.annotation}>↑ error línea {errorLine}</div>
          )}
        </div>

        {/* ── Right column ───────────────────────────────────────────── */}
        <div className={s.rightCol}>

          {/* Card 2: Validation status */}
          <div className={s.statusCard}>
            {!result ? (
              <div className={`${s.statusHeader} ${s.statusHeaderEmpty}`}>
                <strong>Listo para validar</strong>
                <span className={s.statusMeta}>pega tu JSON a la izquierda</span>
              </div>
            ) : result.ok ? (
              <>
                <div className={`${s.statusHeader} ${s.statusHeaderValid}`}>
                  <div className={`${s.statusIcon} ${s.statusIconValid}`}>
                    <Icon name="check" size={12} color="#10b981" strokeWidth={2.5} />
                  </div>
                  <strong>JSON válido</strong>
                  <span className={s.statusMeta}>0 errores · 0 warnings</span>
                </div>
                <div className={s.statusBody}>
                  <div className={s.statusMsg}>Sintaxis correcta, estructura verificada.</div>
                  {stats && (
                    <div className={s.chips}>
                      <span className={s.chip}>UTF-8</span>
                      <span className={s.chip}>{humanSize(byteSize)}</span>
                      <span className={s.chip}>profundidad {stats.depth}</span>
                      <span className={s.chip}>{stats.keys} keys</span>
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
                  <strong>JSON inválido</strong>
                  <span className={s.statusMeta}>1 error · 0 warnings</span>
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
              <strong>Árbol</strong>
              <span className={s.treeMeta}>&nbsp;· navegable</span>
              <div className={s.treeActions}>
                <button className={s.treeActionPill}>expandir todo</button>
                <button className={s.treeActionBtn} title="Copiar ruta">
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
                    ? 'Corrige el JSON para ver el árbol'
                    : 'El árbol aparecerá aquí'
                  }
                </span>
              )}
            </div>
            {stats && (
              <div className={s.treeFooter}>
                {[
                  stats.keys    > 0 ? `${stats.keys} keys`        : '',
                  `profundidad ${stats.depth}`,
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
