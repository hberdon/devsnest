import { useState, useEffect } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { useDevTools } from '@/store/devtools.context'
import { useDebounce } from '@/hooks/useDebounce'
import s from './color.module.css'

// ── Color math ────────────────────────────────────────────────────────────
interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }

function hexToRgb(hex: string): RGB | null {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    ?? hex.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i)?.map((v, i) => i === 0 ? v : v + v)
  if (!m) return null
  return { r: parseInt(String(m[1]), 16), g: parseInt(String(m[2]), 16), b: parseInt(String(m[3]), 16) }
}

function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  switch (max) {
    case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
    case gn: h = ((bn - rn) / d + 2) / 6; break
    default: h = ((rn - gn) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const hn = h / 360, sn = s / 100, ln = l / 100
  if (sn === 0) { const v = Math.round(ln * 255); return { r: v, g: v, b: v } }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q
  const hue = (t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  return { r: Math.round(hue(hn + 1/3) * 255), g: Math.round(hue(hn) * 255), b: Math.round(hue(hn - 1/3) * 255) }
}

function parseColor(input: string): RGB | null {
  const v = input.trim()
  // HEX
  if (/^#?[a-f\d]{3}([a-f\d]{3})?$/i.test(v)) return hexToRgb(v)
  // rgb(r, g, b)
  const rgb = v.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)
  if (rgb) return { r: +rgb[1], g: +rgb[2], b: +rgb[3] }
  // hsl(h, s%, l%)
  const hsl = v.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i)
  if (hsl) return hslToRgb({ h: +hsl[1], s: +hsl[2], l: +hsl[3] })
  return null
}

// ── Component ─────────────────────────────────────────────────────────────
export default function ColorTool() {
  const [input, setInput]   = useState('#5f36fe')
  const { addToHistory }    = useDevTools()
  const debounced           = useDebounce(input, 1200)

  const rgb = parseColor(input)
  const hsl = rgb ? rgbToHsl(rgb) : null
  const hex = rgb ? rgbToHex(rgb) : null

  useEffect(() => {
    if (!debounced || !rgb) return
    addToHistory({
      toolId: 'color', toolName: 'Color (HEX/RGB)', badge: '#',
      categoryName: 'Conversores',
      description: `${hex} · rgb(${rgb.r},${rgb.g},${rgb.b}) · hsl(${hsl?.h},${hsl?.s}%,${hsl?.l}%)`,
    })
  }, [debounced]) // eslint-disable-line react-hooks/exhaustive-deps

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <ToolLayout toolId="color">
      <div className={s.layout}>
        {/* Input */}
        <div className={s.inputSection}>
          <label className={s.inputLabel}>Valor de color</label>
          <div className={s.inputRow}>
            <input
              className={s.textInput}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="#5f36fe · rgb(95,54,254) · hsl(253,99%,60%)"
              spellCheck={false}
            />
            {rgb && (
              <input
                type="color"
                className={s.colorPicker}
                value={hex ?? '#000000'}
                onChange={e => setInput(e.target.value)}
                title="Selector de color"
              />
            )}
          </div>
          {!rgb && input && (
            <div className={s.parseError}>Formato no reconocido. Usa #hex, rgb(...) o hsl(...)</div>
          )}
        </div>

        {rgb && hex && hsl ? (
          <div className={s.results}>
            {/* Swatch */}
            <div className={s.swatch} style={{ background: hex }} />

            {/* Formats */}
            <div className={s.formatsGrid}>
              <FormatRow label="HEX"  value={hex}                                  onCopy={() => copy(hex)} />
              <FormatRow label="RGB"  value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}  onCopy={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} />
              <FormatRow label="HSL"  value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} onCopy={() => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} />
              <FormatRow label="RGB%" value={`${(rgb.r/255*100).toFixed(1)}% ${(rgb.g/255*100).toFixed(1)}% ${(rgb.b/255*100).toFixed(1)}%`} onCopy={() => {}} />
            </div>

            {/* HSL sliders (visual only) */}
            <div className={s.sliders}>
              <SliderRow label="H" value={hsl.h} max={360} color={`hsl(${hsl.h},100%,50%)`} />
              <SliderRow label="S" value={hsl.s} max={100} color={`hsl(${hsl.h},${hsl.s}%,50%)`} />
              <SliderRow label="L" value={hsl.l} max={100} color={`hsl(${hsl.h},100%,${hsl.l}%)`} />
            </div>
          </div>
        ) : (
          <div className={s.emptyState}>
            Introduce un color para ver su conversión
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

function FormatRow({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return (
    <div className={s.formatRow}>
      <span className={s.formatLabel}>{label}</span>
      <code className={s.formatValue}>{value}</code>
      <button className={s.copyBtn} onClick={onCopy} title="Copiar">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </button>
    </div>
  )
}

function SliderRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = `${(value / max * 100).toFixed(0)}%`
  return (
    <div className={s.sliderRow}>
      <span className={s.sliderLabel}>{label}</span>
      <div className={s.sliderTrack}>
        <div className={s.sliderFill} style={{ width: pct, background: color }} />
      </div>
      <span className={s.sliderValue}>{value}</span>
    </div>
  )
}
