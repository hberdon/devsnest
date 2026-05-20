import { lazy, type ComponentType } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>

export const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<AnyComponent>> = {
  // Fase 4
  'base64':         lazy(() => import('./base64')),
  // Fase 5 — Conversores
  'hex-binario':    lazy(() => import('./hex-binario')),
  'url-encode':     lazy(() => import('./url-encode')),
  'color':          lazy(() => import('./color')),
  'jwt-decode':     lazy(() => import('./jwt-decode')),
  'unix-timestamp': lazy(() => import('./unix-timestamp')),
  'img-base64':     lazy(() => import('./img-base64')),
  'pdf-base64':     lazy(() => import('./pdf-base64')),
  // Fase 8 — Red + Cripto
  'ip-lookup':      lazy(() => import('./ip-lookup')),
  'headers-http':   lazy(() => import('./headers-http')),
  'cidr':           lazy(() => import('./cidr')),
  'dns':            lazy(() => import('./dns')),
  'bcrypt':         lazy(() => import('./bcrypt')),
  'aes':            lazy(() => import('./aes')),
  'rsa-keys':       lazy(() => import('./rsa-keys')),
  // Fase 7 — Generadores + Utilidades
  'uuid-ulid':      lazy(() => import('./uuid-ulid')),
  'hash':           lazy(() => import('./hash')),
  'password':       lazy(() => import('./password')),
  'lorem-ipsum':    lazy(() => import('./lorem-ipsum')),
  'qr-code':        lazy(() => import('./qr-code')),
  'diff':           lazy(() => import('./diff')),
  'regex':          lazy(() => import('./regex')),
  'case-converter': lazy(() => import('./case-converter')),
  'contador':       lazy(() => import('./contador')),
  'notepad':        lazy(() => import('./notepad')),
  'cron':           lazy(() => import('./cron')),
  // Fase 6 — Formateadores
  'json':           lazy(() => import('./json')),
  'xml':            lazy(() => import('./xml')),
  'yaml':           lazy(() => import('./yaml')),
  'json-schema':    lazy(() => import('./json-schema')),
  'markdown':       lazy(() => import('./markdown')),
  'json-pretty':    lazy(() => import('./json-pretty')),
  'xml-pretty':     lazy(() => import('./xml-pretty')),
  'sql':            lazy(() => import('./sql')),
  'css-scss':       lazy(() => import('./css-scss')),
}
