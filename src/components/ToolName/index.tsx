import { Icon } from '@/components/Icon'

interface Props {
  name: string
  className?: string
  large?: boolean
}

export function ToolName({ name, className, large }: Props) {
  if (name.includes('↔')) {
    const [left, right] = name.split('↔')
    const icon = large
      ? <span style={{ margin: '0 6px', display: 'inline-flex', alignItems: 'center' }}><Icon name="cat-conv" size={20} strokeWidth={2.5} color="currentColor" /></span>
      : <Icon name="cat-conv" size={14} color="currentColor" />
    return <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{left.trim()}{icon}{right.trim()}</span>
  }
  return <span className={className}>{name}</span>
}
