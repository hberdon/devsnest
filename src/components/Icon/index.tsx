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
  | 'sun'       | 'moon'
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
  'sun':        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />,
  'moon':       <><path fillRule="evenodd" clipRule="evenodd" d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z" fill="currentColor" opacity="0.2" stroke="none"/><path d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z" fill="currentColor" stroke="none"/><path fillRule="evenodd" clipRule="evenodd" d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z" fill="currentColor" stroke="none"/></>,
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
