import { useState, useCallback } from 'react'
import { SplitPane } from '@/components/SplitPane'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import s from '@/tools/tool.module.css'

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')

function word(): string { return WORDS[Math.floor(Math.random() * WORDS.length)] }
function sentence(): string {
  const len = 8 + Math.floor(Math.random() * 10)
  const w   = Array.from({ length: len }, word)
  w[0] = w[0].charAt(0).toUpperCase() + w[0].slice(1)
  return w.join(' ') + '.'
}
function paragraph(): string {
  return Array.from({ length: 4 + Math.floor(Math.random() * 3) }, sentence).join(' ')
}

type Mode = 'words' | 'sentences' | 'paragraphs'

function generate(mode: Mode, count: number): string {
  if (mode === 'words')      return Array.from({ length: count }, word).join(' ')
  if (mode === 'sentences')  return Array.from({ length: count }, sentence).join(' ')
  return Array.from({ length: count }, paragraph).join('\n\n')
}

export default function LoremIpsum() {
  const [mode,   setMode]   = useState<Mode>('paragraphs')
  const [count,  setCount]  = useState(3)
  const [output, setOutput] = useState(() => generate('paragraphs', 3))
  const { addToHistory } = useDevTools()

  const regen = useCallback((m: Mode, c: number) => {
    const text = generate(m, c)
    setOutput(text)
    addToHistory({
      toolId: 'lorem-ipsum', toolName: 'Lorem Ipsum', badge: 'L',
      categoryName: 'Generadores',
      description: `${c} ${m} generados`,
    })
  }, [addToHistory])

  function handleMode(m: Mode) { setMode(m); regen(m, count) }
  function handleCount(c: number) { setCount(c); regen(mode, c) }

  const modeControl = (
    <div className={s.segmented}>
      {(['words', 'sentences', 'paragraphs'] as const).map(m => (
        <button key={m} className={`${s.segmentBtn} ${mode === m ? s.segmentActive : ''}`} onClick={() => handleMode(m)}>
          {m === 'words' ? 'Palabras' : m === 'sentences' ? 'Oraciones' : 'Párrafos'}
        </button>
      ))}
    </div>
  )

  const countControl = (
    <div className={s.segmented}>
      {[1, 3, 5, 10].map(n => (
        <button key={n} className={`${s.segmentBtn} ${count === n ? s.segmentActive : ''}`} onClick={() => handleCount(n)}>
          {n}
        </button>
      ))}
    </div>
  )

  return (
    <ToolLayout toolId="lorem-ipsum" actions={<>{modeControl}{countControl}</>}>
      <SplitPane
        primary={{
          label: 'Configuración',
          content: (
            <div style={{ padding: '12px', color: 'var(--color-muted)', fontSize: '15px', fontFamily: 'var(--font-ui)' }}>
              Selecciona tipo y cantidad en la barra superior, luego haz clic en Regenerar.
              <br /><br />
              <button
                className={s.actionBtn}
                onClick={() => regen(mode, count)}
              >
                Regenerar
              </button>
            </div>
          ),
        }}
        secondary={{
          label: 'Lorem Ipsum',
          meta: `${output.split(/\s+/).filter(Boolean).length} palabras`,
          onCopy: () => navigator.clipboard.writeText(output).catch(() => {}),
          content: <div className={s.output}>{output}</div>,
        }}
      />
    </ToolLayout>
  )
}
