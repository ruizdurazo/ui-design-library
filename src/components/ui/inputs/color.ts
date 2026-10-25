export type Hsva = {
  h: number
  s: number
  v: number
  a: number
}

export function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min
  return Math.min(max, Math.max(min, value))
}

function byte(value: number) {
  return clamp(Math.round(value), 0, 255)
}

function byteToHex(value: number) {
  return byte(value).toString(16).padStart(2, '0').toUpperCase()
}

export function hsvToRgb(h: number, s: number, v: number) {
  const hue = ((h % 360) + 360) % 360
  const chroma = v * s
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = v - chroma
  let r: number
  let g: number
  let b: number

  if (hue < 60) [r, g, b] = [chroma, x, 0]
  else if (hue < 120) [r, g, b] = [x, chroma, 0]
  else if (hue < 180) [r, g, b] = [0, chroma, x]
  else if (hue < 240) [r, g, b] = [0, x, chroma]
  else if (hue < 300) [r, g, b] = [x, 0, chroma]
  else [r, g, b] = [chroma, 0, x]

  return {
    r: byte((r + m) * 255),
    g: byte((g + m) * 255),
    b: byte((b + m) * 255),
  }
}

export function rgbToHsv(r: number, g: number, b: number) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min
  let h = 0

  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6
    else if (max === gn) h = (bn - rn) / delta + 2
    else h = (rn - gn) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }

  return { h, s: max === 0 ? 0 : delta / max, v: max }
}

export function formatHex(color: Hsva, alpha: boolean) {
  const { r, g, b } = hsvToRgb(color.h, color.s, color.v)
  const hex = [r, g, b].map(byteToHex).join('')
  return alpha ? `#${hex}${byteToHex(color.a * 255)}` : `#${hex}`
}

export function toRgba(color: Hsva) {
  const { r, g, b } = hsvToRgb(color.h, color.s, color.v)
  return `rgba(${r}, ${g}, ${b}, ${clamp(color.a, 0, 1)})`
}

const HEX = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i

export function parseHex(value: string): Hsva | null {
  const match = HEX.exec(value.trim())
  if (!match) return null
  const r = Number.parseInt(match[1], 16)
  const g = Number.parseInt(match[2], 16)
  const b = Number.parseInt(match[3], 16)
  const a = match[4] ? Number.parseInt(match[4], 16) / 255 : 1
  return { ...rgbToHsv(r, g, b), a }
}
