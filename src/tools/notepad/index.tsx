import { useState, useRef, useCallback, useEffect } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { Icon } from '@/components/Icon'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useLang } from '@/store/lang.context'
import s from './Notepad.module.css'

interface NotepadTab {
  id: string
  name: string
  content: string
  format: string | null
}

const FORMAT_EXT: Record<string, string> = {
  JSON: 'json', XML: 'xml', HTML: 'html', SQL: 'sql',
  YAML: 'yaml', Markdown: 'md', CSS: 'css', 'JS/TS': 'js', Base64: 'txt',
}

function detectFormat(text: string): string | null {
  const t = text.trim()
  if (!t || t.length < 5) return null
  try { JSON.parse(t); return 'JSON' } catch {}
  if (/^<!DOCTYPE html/i.test(t) || /^<html[\s>]/i.test(t)) return 'HTML'
  if (/^<[a-zA-Z]/.test(t)) return 'XML'
  if (/^\s*(SELECT|INSERT\s+INTO|UPDATE\s+\w|DELETE\s+FROM|CREATE\s+(TABLE|DATABASE|INDEX|VIEW)|DROP|ALTER|TRUNCATE|WITH\s+\w)\b/i.test(t)) return 'SQL'
  if (/^[a-zA-Z_][a-zA-Z0-9_-]*:\s/m.test(t) && !/^[{[<]/.test(t)) return 'YAML'
  if (/^#{1,6}\s|\*\*[^*]+\*\*|^[-*+]\s|^>\s/m.test(t)) return 'Markdown'
  if (/[a-z.-]+\s*\{[\s\S]*?\}/i.test(t) && !/\b(function|const|let|var)\b/.test(t)) return 'CSS'
  if (/\b(function|const|let|var|import|export|class|interface|type\s+\w|=>)\b/.test(t)) return 'JS/TS'
  if (t.length >= 30 && !/\s/.test(t) && /^[A-Za-z0-9+/]+=*$/.test(t)) return 'Base64'
  return null
}

function makeTab(name: string): NotepadTab {
  return { id: crypto.randomUUID(), name, content: '', format: null }
}

const DEFAULT_TAB = makeTab('Sin título 1')

export default function Notepad() {
  const { t } = useLang()
  const [tabs, setTabs]           = useLocalStorage<NotepadTab[]>('devsnest-notepad-tabs', [DEFAULT_TAB])
  const [activeTabId, setActiveTabId] = useLocalStorage<string>('devsnest-notepad-active', DEFAULT_TAB.id)
  const [editingTabId, setEditingTabId] = useState<string | null>(null)
  const [editingName, setEditingName]   = useState('')
  const [menuOpen, setMenuOpen]   = useState(false)
  const [copied, setCopied]       = useState(false)

  const menuRef      = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef  = useRef<HTMLTextAreaElement>(null)
  const gutterRef    = useRef<HTMLDivElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  const activeTab  = tabs.find(tab => tab.id === activeTabId) ?? tabs[0]
  const content    = activeTab?.content ?? ''
  const lines      = content.split('\n')
  const lineCount  = Math.max(lines.length, 1)
  const byteSize   = new TextEncoder().encode(content).length

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen])

  // Focus rename input
  useEffect(() => {
    if (editingTabId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingTabId])

  const syncScroll = useCallback(() => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [])

  // ── Tab mutations ──────────────────────────────────────────────────────────
  function addTab() {
    const tab = makeTab(`${t.npdUntitled} ${tabs.length + 1}`)
    setTabs(prev => [...prev, tab])
    setActiveTabId(tab.id)
  }

  function closeTab(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (tabs.length === 1) return
    const idx  = tabs.findIndex(tab => tab.id === id)
    const next = tabs[idx === 0 ? 1 : idx - 1]
    setTabs(prev => prev.filter(tab => tab.id !== id))
    if (activeTabId === id) setActiveTabId(next.id)
  }

  function startRename(id: string, name: string, e: React.MouseEvent) {
    e.stopPropagation()
    setEditingTabId(id)
    setEditingName(name)
  }

  function commitRename() {
    if (editingTabId && editingName.trim()) {
      setTabs(prev => prev.map(tab =>
        tab.id === editingTabId ? { ...tab, name: editingName.trim() } : tab
      ))
    }
    setEditingTabId(null)
    setEditingName('')
  }

  // ── Content mutations ──────────────────────────────────────────────────────
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    const tabId = activeTab.id
    setTabs(prev => prev.map(tab =>
      tab.id === tabId
        ? { ...tab, content: value, format: value.trim() ? tab.format : null }
        : tab
    ))
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const pasted = e.clipboardData.getData('text')
    if (!pasted.trim()) return
    const fmt   = detectFormat(pasted)
    const tabId = activeTab.id
    setTabs(prev => prev.map(tab => tab.id === tabId ? { ...tab, format: fmt } : tab))
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  function handleLoad() {
    fileInputRef.current?.click()
    setMenuOpen(false)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const c = (ev.target?.result as string) ?? ''
      const tab: NotepadTab = {
        id: crypto.randomUUID(),
        name: file.name,
        content: c,
        format: detectFormat(c),
      }
      setTabs(prev => [...prev, tab])
      setActiveTabId(tab.id)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleSave() {
    if (!content) return
    const ext      = activeTab?.format ? (FORMAT_EXT[activeTab.format] ?? 'txt') : 'txt'
    const filename = activeTab?.name?.includes('.') ? activeTab.name : `${activeTab?.name ?? 'nota'}.${ext}`
    const blob     = new Blob([content], { type: 'text/plain' })
    const url      = URL.createObjectURL(blob)
    const a        = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
    setMenuOpen(false)
  }

  async function handleCopy() {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setMenuOpen(false)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleClear() {
    const tabId = activeTab.id
    setTabs(prev => prev.map(tab =>
      tab.id === tabId ? { ...tab, content: '', format: null } : tab
    ))
    setMenuOpen(false)
  }

  return (
    <ToolLayout toolId="notepad" hideSplit>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className={s.wrapper}>

        {/* ── V4 browser-style tab bar ──────────────────────────────── */}
        <div className={s.tabBar}>
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`${s.tab} ${tab.id === activeTab?.id ? s.tabActive : ''}`}
              onClick={() => setActiveTabId(tab.id)}
            >
              {editingTabId === tab.id ? (
                <input
                  ref={editInputRef}
                  className={s.tabNameInput}
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitRename()
                    if (e.key === 'Escape') setEditingTabId(null)
                  }}
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span
                  className={s.tabName}
                  onDoubleClick={e => startRename(tab.id, tab.name, e)}
                >
                  {tab.name}
                </span>
              )}
              {tabs.length > 1 && (
                <button
                  className={s.closeTab}
                  onClick={e => closeTab(tab.id, e)}
                  title={t.npdCloseTab}
                >
                  <Icon name="close" size={10} strokeWidth={2} />
                </button>
              )}
            </div>
          ))}
          <button className={s.addTab} onClick={addTab} title={t.npdAddTab}>
            <Icon name="plus" size={13} strokeWidth={2} />
          </button>
        </div>

        {/* ── Editor card ───────────────────────────────────────────── */}
        <div className={s.editorCard}>

          <div className={s.cardHeader}>
            <strong className={s.cardTitle}>{activeTab?.name ?? ''}</strong>
            {byteSize > 0 && (
              <span className={s.cardMeta}>
                UTF-8 · {byteSize < 1024 ? `${byteSize} B` : `${(byteSize / 1024).toFixed(1)} KB`} · {lineCount} {t.tcLines}
              </span>
            )}
            {activeTab?.format && (
              <span className={s.formatBadge}>{activeTab.format}</span>
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
                  <button className={s.menuItem} onClick={handleLoad}>
                    <Icon name="upload" size={12} />
                    {t.npdLoad}
                  </button>
                  <button className={s.menuItem} disabled={!content} onClick={handleSave}>
                    <Icon name="download" size={12} />
                    {t.npdSave}
                  </button>
                  <button className={s.menuItem} disabled={!content} onClick={handleCopy}>
                    <Icon name="copy" size={12} />
                    {copied ? t.npdCopied : t.npdCopy}
                  </button>
                  <div className={s.menuSep} />
                  <button className={s.menuItem} disabled={!content} onClick={handleClear}>
                    <Icon name="trash" size={12} />
                    {t.tcClearEditor}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={s.editorWrap}>
            <div ref={gutterRef} className={s.gutter} aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i} className={s.gutterLine}>{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              className={s.code}
              value={content}
              onChange={handleChange}
              onPaste={handlePaste}
              onScroll={syncScroll}
              placeholder={t.npdPlaceholder}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>

        </div>
      </div>
    </ToolLayout>
  )
}
