// ── JSON ──────────────────────────────────────────────────────────────────
export type IndentSize = 2 | 4 | 'tab'

function indentStr(size: IndentSize): string | number {
  return size === 'tab' ? '\t' : size
}

export interface FormatResult {
  ok: true
  output: string
  size: number
}
export interface FormatError {
  ok: false
  error: string
}

export function formatJSON(input: string, indent: IndentSize = 2): FormatResult | FormatError {
  if (!input.trim()) return { ok: true, output: '', size: 0 }
  try {
    const parsed = JSON.parse(input)
    const output = JSON.stringify(parsed, null, indentStr(indent))
    return { ok: true, output, size: new TextEncoder().encode(output).length }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'JSON inválido' }
  }
}

export function minifyJSON(input: string): FormatResult | FormatError {
  if (!input.trim()) return { ok: true, output: '', size: 0 }
  try {
    const output = JSON.stringify(JSON.parse(input))
    return { ok: true, output, size: new TextEncoder().encode(output).length }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'JSON inválido' }
  }
}

// ── XML ──────────────────────────────────────────────────────────────────
export function validateXML(input: string): string | null {
  const parser = new DOMParser()
  const doc = parser.parseFromString(input, 'text/xml')
  const err = doc.querySelector('parsererror')
  if (err) return err.textContent?.trim() ?? 'XML inválido'
  return null
}

export function formatXML(input: string, indent: IndentSize = 2): FormatResult | FormatError {
  if (!input.trim()) return { ok: true, output: '', size: 0 }
  const error = validateXML(input)
  if (error) return { ok: false, error }

  const pad = indent === 'tab' ? '\t' : ' '.repeat(indent)
  let result = ''
  let level  = 0

  const nodes = input
    .replace(/>\s*</g, '><')
    .replace(/</g, '\x00<')
    .split('\x00')
    .filter(Boolean)

  for (let i = 0; i < nodes.length; i++) {
    const trimmed = nodes[i].trim()
    if (!trimmed) continue
    // Closing tag
    if (trimmed.startsWith('</')) {
      level = Math.max(0, level - 1)
      result += `${pad.repeat(level)}${trimmed}\n`
    // Self-closing or declaration or comment
    } else if (trimmed.endsWith('/>') || trimmed.startsWith('<?') || trimmed.startsWith('<!')) {
      result += `${pad.repeat(level)}${trimmed}\n`
    // Opening tag
    } else if (trimmed.startsWith('<')) {
      const gtIdx = trimmed.indexOf('>')
      const inlineText = gtIdx !== -1 ? trimmed.slice(gtIdx + 1).trim() : ''
      if (inlineText) {
        // Element has inline text — peek for closing tag and combine on one line
        const next = nodes[i + 1]?.trim()
        const tagPart = trimmed.slice(0, gtIdx + 1)
        const textContent = inlineText.replace(/\s+/g, ' ')
        if (next?.startsWith('</')) {
          result += `${pad.repeat(level)}${tagPart}${textContent}${next}\n`
          i++
        } else {
          result += `${pad.repeat(level)}${trimmed}\n`
          level++
        }
      } else {
        result += `${pad.repeat(level)}${trimmed}\n`
        level++
      }
    // Text content
    } else {
      result += `${pad.repeat(level)}${trimmed}\n`
    }
  }

  const output = result.trim()
  return { ok: true, output, size: new TextEncoder().encode(output).length }
}

// ── CSS basic formatter ───────────────────────────────────────────────────
export function formatCSS(input: string): FormatResult | FormatError {
  if (!input.trim()) return { ok: true, output: '', size: 0 }
  try {
    const output = input
      .replace(/\/\*.*?\*\//gs, m => m)          // preserve comments
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/;\s*(?!\/)/g, ';\n  ')
      .replace(/\s*\}\s*/g, '\n}\n\n')
      .replace(/\n {2}\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    return { ok: true, output, size: new TextEncoder().encode(output).length }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'CSS inválido' }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────
export function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} b`
  return `${(bytes / 1024).toFixed(1)} KB`
}
