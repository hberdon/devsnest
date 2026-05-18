import { useCmdK } from '@/store/cmd-palette.context'
import { Icon } from '@/components/Icon'

interface CmdKButtonProps {
  className?: string
  label: string
  kbdHint?: string
  iconSize?: number
}

export function CmdKButton({ className, label, kbdHint = '⌘K', iconSize = 14 }: CmdKButtonProps) {
  const { open } = useCmdK()
  return (
    <button className={className} onClick={open}>
      <Icon name="search" size={iconSize} color="currentColor" />
      <span>{label}</span>
      {kbdHint && <kbd>{kbdHint}</kbd>}
    </button>
  )
}
