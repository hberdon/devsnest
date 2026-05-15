import { Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getToolById, getCategoryById } from '@/tools/registry'
import { TOOL_COMPONENTS } from '@/tools/loader'
import { ToolLayout } from '@/components/ToolLayout'
import { Icon } from '@/components/Icon'

function NotImplemented({ toolId }: { toolId: string }) {
  const tool     = getToolById(toolId)
  const category = tool ? getCategoryById(tool.categoryId) : undefined
  const navigate = useNavigate()

  if (!tool) return (
    <div style={{ padding: 32, color: 'var(--color-muted)' }}>
      Herramienta no encontrada: <code>{toolId}</code>
    </div>
  )

  return (
    <ToolLayout toolId={toolId}>
      <div style={{
        flex: 1, height: '100%',
        border: '1.4px dashed var(--color-muted)',
        borderRadius: 'var(--radius-sketch)',
        background: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        color: 'var(--color-muted)',
      }}>
        <Icon name={category?.icon ?? 'cat-utils'} size={32} color="var(--color-accent-soft)" />
        <div style={{ fontSize: 19, fontWeight: 600, color: 'var(--color-ink2)' }}>{tool.name}</div>
        <div style={{ fontSize: 15 }}>Disponible en fases 5–8</div>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: 8,
            padding: '6px 16px',
            border: 'var(--border-base)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-surface)',
            boxShadow: 'var(--shadow-sketch-sm)',
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          ← Volver al dashboard
        </button>
      </div>
    </ToolLayout>
  )
}

export default function ToolPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return null

  const ToolComponent = TOOL_COMPONENTS[id]

  if (!ToolComponent) {
    return <NotImplemented toolId={id} />
  }

  return (
    <Suspense fallback={
      <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--color-muted)', fontSize: 15 }}>
        Cargando…
      </div>
    }>
      <ToolComponent />
    </Suspense>
  )
}
