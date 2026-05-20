import type { IconName } from '@/components/Icon'

export type CategoryId = 'conv' | 'fmt' | 'gen' | 'utils' | 'net' | 'crypt'

export interface ToolMeta {
  id: string
  name: string
  categoryId: CategoryId
  badge: string
  description: string
}

export interface Category {
  id: CategoryId
  name: string
  icon: IconName
  tools: ToolMeta[]
  hidden?: boolean
}

const TOOLS: ToolMeta[] = [
  // Conversores
  { id: 'base64',          name: 'Base64',          categoryId: 'conv',  badge: 'B64', description: 'Codifica y decodifica texto en Base64' },
  { id: 'hex-binario',     name: 'Hex / Binario',   categoryId: 'conv',  badge: 'HEX', description: 'Convierte entre texto, hex y binario' },
  { id: 'url-encode',      name: 'URL Encode',      categoryId: 'conv',  badge: 'URL', description: 'Encode/decode componentes de URL' },
  { id: 'color',           name: 'Color (HEX/RGB)', categoryId: 'conv',  badge: '#',   description: 'Convierte entre HEX, RGB y HSL' },
  { id: 'jwt-decode',      name: 'JWT Decode',      categoryId: 'conv',  badge: 'JWT', description: 'Decodifica tokens JWT (sin validación)' },
  { id: 'unix-timestamp',  name: 'Unix Timestamp',  categoryId: 'conv',  badge: 'TS',  description: 'Convierte epoch a fecha y viceversa' },
  { id: 'img-base64',     name: 'Img Base64',      categoryId: 'conv',  badge: 'IMG', description: 'Convierte imágenes a Base64 y viceversa' },
  { id: 'pdf-base64',     name: 'PDF Base64',      categoryId: 'conv',  badge: 'PDF', description: 'Convierte PDFs a Base64 y viceversa' },
  // Formateadores
  { id: 'json',            name: 'JSON',            categoryId: 'fmt',   badge: '{}',  description: 'Valida y formatea JSON' },
  { id: 'xml',             name: 'XML',             categoryId: 'fmt',   badge: '<>',  description: 'Valida y formatea XML' },
  { id: 'yaml',            name: 'YAML',            categoryId: 'fmt',   badge: '∶',   description: 'Valida y convierte YAML' },
  { id: 'json-schema',     name: 'JSON Schema',     categoryId: 'fmt',   badge: 'JS',  description: 'Valida JSON contra un schema' },
  { id: 'markdown',        name: 'Markdown',        categoryId: 'fmt',   badge: 'MD',  description: 'Preview en tiempo real de Markdown' },
  { id: 'json-pretty',     name: 'JSON Pretty',     categoryId: 'fmt',   badge: '{ }', description: 'Pretty print JSON con indentación configurable' },
  { id: 'xml-pretty',      name: 'XML Pretty',      categoryId: 'fmt',   badge: '</>',  description: 'Pretty print XML' },
  { id: 'sql',             name: 'SQL',             categoryId: 'fmt',   badge: 'SQ',  description: 'Formatea queries SQL' },
  { id: 'css-scss',        name: 'CSS / SCSS',      categoryId: 'fmt',   badge: 'CSS', description: 'Formatea y valida CSS/SCSS' },
  // Generadores
  { id: 'uuid-ulid',       name: 'UUID / ULID',     categoryId: 'gen',   badge: 'ID',  description: 'Genera UUIDs v4 y ULIDs' },
  { id: 'hash',            name: 'Hash MD5 / SHA',  categoryId: 'gen',   badge: '#',   description: 'MD5, SHA-1, SHA-256, SHA-512' },
  { id: 'password',        name: 'Password',        categoryId: 'gen',   badge: '••',  description: 'Genera contraseñas seguras' },
  { id: 'lorem-ipsum',     name: 'Lorem Ipsum',     categoryId: 'gen',   badge: 'L',   description: 'Genera texto de relleno' },
  { id: 'qr-code',         name: 'QR Code',         categoryId: 'gen',   badge: '▣',   description: 'Genera QR de texto o URL' },
  // Utilidades
  { id: 'diff',            name: 'Diff',            categoryId: 'utils', badge: '±',   description: 'Compara dos textos' },
  { id: 'regex',           name: 'Regex Tester',    categoryId: 'utils', badge: '.*',  description: 'Prueba expresiones regulares' },
  { id: 'case-converter',  name: 'Case Converter',  categoryId: 'utils', badge: 'Aa',  description: 'Convierte entre camelCase, snake_case, etc.' },
  { id: 'contador',        name: 'Contador',        categoryId: 'utils', badge: '∑',   description: 'Cuenta chars, palabras, líneas y bytes' },
  { id: 'notepad',         name: 'Notepad',         categoryId: 'utils', badge: 'NPD', description: 'Bloc de notas con pestañas persistentes' },
  { id: 'cron',            name: 'Cron',            categoryId: 'utils', badge: '⏱',  description: 'Testa y construye expresiones cron' },
  // Red
  { id: 'ip-lookup',       name: 'IP Lookup',       categoryId: 'net',   badge: 'IP',  description: 'Geolocalización de IPs' },
  { id: 'headers-http',    name: 'Headers HTTP',    categoryId: 'net',   badge: 'H',   description: 'Inspecciona headers de una URL' },
  { id: 'cidr',            name: 'CIDR',            categoryId: 'net',   badge: '/24', description: 'Calculadora de subredes' },
  { id: 'dns',             name: 'DNS',             categoryId: 'net',   badge: 'DNS', description: 'DNS lookup por tipo de registro' },
  // Cripto
  { id: 'bcrypt',          name: 'Bcrypt',          categoryId: 'crypt', badge: 'BC',  description: 'Hash y verifica con Bcrypt' },
  { id: 'aes',             name: 'AES',             categoryId: 'crypt', badge: 'AES', description: 'Cifra y descifra con AES-256' },
  { id: 'rsa-keys',        name: 'RSA Keys',        categoryId: 'crypt', badge: 'RSA', description: 'Genera pares de claves RSA' },
]

export const CATEGORIES: Category[] = [
  { id: 'conv',  name: 'Conversores',   icon: 'cat-conv',  tools: TOOLS.filter(t => t.categoryId === 'conv') },
  { id: 'fmt',   name: 'Formateadores', icon: 'cat-fmt',   tools: TOOLS.filter(t => t.categoryId === 'fmt') },
  { id: 'gen',   name: 'Generadores',   icon: 'cat-gen',   tools: TOOLS.filter(t => t.categoryId === 'gen') },
  { id: 'utils', name: 'Utilidades',    icon: 'cat-utils', tools: TOOLS.filter(t => t.categoryId === 'utils') },
  { id: 'net',   name: 'Red',           icon: 'cat-net',   tools: TOOLS.filter(t => t.categoryId === 'net'),  hidden: true },
  { id: 'crypt', name: 'Cripto',        icon: 'cat-crypt', tools: TOOLS.filter(t => t.categoryId === 'crypt') },
]

export const VISIBLE_CATEGORIES = CATEGORIES.filter(c => !c.hidden)

const HIDDEN_CAT_IDS = new Set(CATEGORIES.filter(c => c.hidden).map(c => c.id))
export const ALL_TOOLS = TOOLS.filter(t => !HIDDEN_CAT_IDS.has(t.categoryId))

export function getToolById(id: string): ToolMeta | undefined {
  return TOOLS.find(t => t.id === id)
}

export function getCategoryById(id: CategoryId): Category | undefined {
  return CATEGORIES.find(c => c.id === id)
}
