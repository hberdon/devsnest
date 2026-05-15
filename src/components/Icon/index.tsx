import type { ReactNode } from 'react'

export type IconName =
  | 'sidebar-l' | 'sidebar-r'
  | 'split-v'   | 'split-h'
  | 'swap'      | 'cmd'
  | 'pin'       | 'star'
  | 'chev-d'    | 'chev-r'
  | 'search'    | 'clock'
  | 'copy'      | 'more'
  | 'settings'  | 'close'
  | 'check'     | 'plus'
  | 'trash'     | 'arrow-r'
  // Category icons
  | 'cat-conv'  | 'cat-fmt'
  | 'cat-gen'   | 'cat-utils'
  | 'cat-net'   | 'cat-crypt'

const PATHS: Record<IconName, ReactNode> = {
  'sidebar-l':  <><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M9.5 4.5v15"/></>,
  'sidebar-r':  <><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M14.5 4.5v15"/></>,
  'split-v':    <><rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M12 4.5v15"/></>,
  'split-h':    <><rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M3.5 12h17"/></>,
  'swap':       <><path d="M4 8h13l-3-3M20 16H7l3 3"/></>,
  'cmd':        <><path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z"/></>,
  'pin':        <><path d="M14 3l7 7-4 1-2 5-3-3-5 5-1-1 5-5-3-3 5-2z"/></>,
  'star':       <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  'chev-d':     <><polyline points="6 9 12 15 18 9"/></>,
  'chev-r':     <><polyline points="9 18 15 12 9 6"/></>,
  'search':     <><circle cx="11" cy="11" r="7"/><path d="m17 17 4 4"/></>,
  'clock':      <><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></>,
  'copy':       <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
  'more':       <><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></>,
  'settings':   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
  'close':      <><path d="M18 6 6 18M6 6l12 12"/></>,
  'check':      <><polyline points="20 6 9 17 4 12"/></>,
  'plus':       <><path d="M12 5v14M5 12h14"/></>,
  'trash':      <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></>,
  'arrow-r':    <><path d="M5 12h14M12 5l7 7-7 7"/></>,
  // Category icons
  'cat-conv':   <><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><path d="M12 8v8"/><path d="M8 12h8"/></>,
  'cat-fmt':    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
  'cat-gen':    <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 8h2"/><path d="M15 8h2"/><path d="M11 12h2"/></>,
  'cat-utils':  <><path d="m14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></>,
  'cat-net':    <><circle cx="12" cy="12" r="9"/><path d="M12 3a14.5 14.5 0 0 1 0 18"/><path d="M3 12h18"/><path d="M12 3c-4 4-4 10 0 18"/></>,
  'cat-crypt':  <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
}

interface IconProps {
  name: IconName
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
}

export function Icon({ name, size = 16, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}
