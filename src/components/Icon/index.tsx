import type { ReactNode } from 'react'

export type IconName =
  | 'sidebar-l' | 'sidebar-r'
  | 'split-v'   | 'split-h'
  | 'swap'      | 'cmd'
  | 'pin'       | 'pin-fill'
  | 'star'
  | 'chev-d'    | 'chev-r'
  | 'search'    | 'clock'
  | 'copy'      | 'more'
  | 'settings'  | 'close'
  | 'check'     | 'plus'
  | 'trash'     | 'arrow-r'
  | 'warn'      | 'download'
  | 'schema'    | 'minify'   | 'paste'  | 'upload'
  | 'globe'
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
  'pin':        <><rect x="6" y="3" width="12" height="4" rx="1.5"/><path d="M12 7v13M9 20h6"/></>,
  'pin-fill':   <><path d="M14 3l7 7-4 1-2 5-3-3-5 5-1-1 5-5-3-3 5-2z"/></>,
  'star':       <><path d="M12 4l2.6 5.4 6 .8-4.4 4.1 1.1 5.9L12 17.3 6.7 20.2l1.1-5.9L3.4 10.2l6-.8z"/></>,
  'chev-d':     <><path d="m8 9 4 4 4-4"/></>,
  'chev-r':     <><path d="m9 7 5 5-5 5"/></>,
  'search':     <><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></>,
  'clock':      <><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></>,
  'copy':       <><rect x="8" y="8" width="11" height="11" rx="1.5"/><path d="M5 15V6a1 1 0 0 1 1-1h9"/></>,
  'more':       <><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></>,
  'settings':   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
  'close':      <><path d="M18 6 6 18M6 6l12 12"/></>,
  'check':      <><path d="M5 12l4 4 10-10"/></>,
  'plus':       <><path d="M12 5v14M5 12h14"/></>,
  'trash':      <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></>,
  'arrow-r':    <><path d="M5 12h14M12 5l7 7-7 7"/></>,
  'warn':       <><path d="M12 4 2 20h20L12 4z"/><path d="M12 10v5M12 17v.5"/></>,
  'download':   <><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></>,
  'schema':     <><rect x="3" y="4" width="18" height="5" rx="1"/><rect x="3" y="11" width="12" height="5" rx="1"/><rect x="3" y="18" width="6" height="3" rx="1"/></>,
  'minify':     <><path d="M5 12h14"/><path d="M9 8l-4 4 4 4"/><path d="M15 8l4 4-4 4"/></>,
  'paste':      <><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M8 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2"/><path d="M12 11v5M10 14l2 2 2-2"/></>,
  'upload':     <><path d="M12 15V4M17 9l-5-5-5 5M5 20h14"/></>,
  'globe':      <><circle cx="12" cy="12" r="9"/><path d="M4.5 12h15M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9"/></>,
  // Category icons — exact paths from wireframes.jsx
  'cat-conv':   <><path d="M4 8h12l-3-3"/><path d="M20 16H8l3 3"/></>,
  'cat-fmt':    <><path d="M5 6h14M5 12h9M5 18h14"/></>,
  'cat-gen':    <><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="4"/></>,
  'cat-utils':  <><path d="M6 6h12M9 6v14M15 6v14"/></>,
  'cat-net':    <><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16"/></>,
  'cat-crypt':  <><rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
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
