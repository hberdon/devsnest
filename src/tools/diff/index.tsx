import { useState, useMemo } from 'react'
import { diffLines } from 'diff'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import s from './diff.module.css'
import ts from '@/tools/tool.module.css'

export default function Diff() {
  const [left,  setLeft]  = useState('')
  const [right, setRight] = useState('')
  const { addToHistory } = useDevTools()

  const changes = useMemo(() => {
    if (!left && !right) return null
    return diffLines(left, right)
  }, [left, right])

  const stats = useMemo(() => {
    if (!changes) return null
    const added   = changes.filter(c => c.added).reduce((a, c) => a + (c.count ?? 0), 0)
    const removed = changes.filter(c => c.removed).reduce((a, c) => a + (c.count ?? 0), 0)
    return { added, removed }
  }, [changes])

  function handleCompare() {
    if (!left || !right) return
    addToHistory({
      toolId: 'diff', toolName: 'Diff', badge: '±',
      categoryName: 'Utilidades',
      description: stats ? `+${stats.added} −${stats.removed} líneas` : 'Sin cambios',
    })
  }

  return (
    <ToolLayout toolId="diff">
      <div className={s.layout}>
        <div className={s.inputs}>
          <div className={s.pane}>
            <div className={s.paneHeader}>Original</div>
            <textarea
              className={ts.textarea}
              style={{ padding: '10px 12px' }}
              value={left}
              onChange={e => setLeft(e.target.value)}
              placeholder="Pega el texto original aquí…"
              spellCheck={false}
              onBlur={handleCompare}
            />
          </div>
          <div className={s.pane}>
            <div className={s.paneHeader}>Modificado</div>
            <textarea
              className={ts.textarea}
              style={{ padding: '10px 12px' }}
              value={right}
              onChange={e => setRight(e.target.value)}
              placeholder="Pega el texto modificado aquí…"
              spellCheck={false}
              onBlur={handleCompare}
            />
          </div>
        </div>

        {stats && (
          <div className={s.statsBar}>
            <span className={s.added}>+{stats.added} añadidas</span>
            <span className={s.removed}>−{stats.removed} eliminadas</span>
            {stats.added === 0 && stats.removed === 0 && (
              <span className={s.same}>Sin cambios</span>
            )}
          </div>
        )}

        {changes && (
          <div className={s.diffOutput}>
            {changes.map((part, i) => (
              <pre
                key={i}
                className={`${s.diffLine} ${part.added ? s.lineAdded : part.removed ? s.lineRemoved : s.lineSame}`}
              >
                <span className={s.lineMarker}>{part.added ? '+' : part.removed ? '−' : ' '}</span>
                {part.value}
              </pre>
            ))}
          </div>
        )}

        {!changes && (
          <div className={s.emptyState}>Pega texto en ambos paneles para ver el diff</div>
        )}
      </div>
    </ToolLayout>
  )
}
