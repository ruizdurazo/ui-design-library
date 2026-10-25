import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'
import styles from './NumberFlow.module.scss'

/** +1 rolls every digit upward, −1 downward, 0 lets each digit take its own direction. */
export type NumberFlowTrend =
  number | ((oldValue: number, value: number) => number)

type NumberFlowProps = {
  value: number
  locales?: Intl.LocalesArgument
  format?: Intl.NumberFormatOptions
  prefix?: string
  suffix?: string
  /** Direction of the roll. Defaults to the sign of the value change. */
  trend?: NumberFlowTrend
  /** When false, the value updates immediately. */
  animated?: boolean
  /** When true, a reduced-motion preference skips the roll. */
  respectMotionPreference?: boolean
  className?: string
} & Omit<HTMLAttributes<HTMLSpanElement>, 'prefix'>

type TrendDir = -1 | 0 | 1
type ItemStatus = 'enter' | 'idle' | 'exit'

type DigitPart = { kind: 'digit'; key: string; digit: number }
type TextPart = { kind: 'text'; key: string; text: string; part: string }
type Part = DigitPart | TextPart
type Item = Part & { status: ItemStatus }

type Frame = {
  value: number
  signature: string
  motion: boolean
  trend: TrendDir
  items: Item[]
}

const ORIGIN = -10
const LAST = 19

function mod(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor
}

function formatter(
  locales?: Intl.LocalesArgument,
  format?: Intl.NumberFormatOptions,
) {
  try {
    return new Intl.NumberFormat(locales, format)
  } catch {
    return new Intl.NumberFormat(locales)
  }
}

function formatValue(
  value: number,
  locales: Intl.LocalesArgument | undefined,
  format: Intl.NumberFormatOptions | undefined,
  prefix?: string,
  suffix?: string,
) {
  return `${prefix ?? ''}${formatter(locales, format).format(value)}${suffix ?? ''}`
}

function buildParts(
  value: number,
  locales: Intl.LocalesArgument | undefined,
  format: Intl.NumberFormatOptions | undefined,
  prefix?: string,
  suffix?: string,
): Part[] {
  const parts: Part[] = []
  if (prefix) {
    parts.push({ kind: 'text', key: 'prefix', text: prefix, part: 'prefix' })
  }

  const intl = formatter(locales, format).formatToParts(value)
  const integerCount = intl.reduce(
    (count, part) =>
      part.type === 'integer' ? count + part.value.length : count,
    0,
  )
  const seen: Record<string, number> = {}
  let integerIndex = 0
  let fractionIndex = 0

  for (const part of intl) {
    if (part.type === 'integer' || part.type === 'fraction') {
      for (const char of part.value) {
        const digit = Number(char)
        if (!Number.isInteger(digit)) continue
        if (part.type === 'integer') {
          const pos = integerCount - integerIndex - 1
          integerIndex += 1
          parts.push({ kind: 'digit', key: `d${pos}`, digit })
        } else {
          fractionIndex += 1
          parts.push({ kind: 'digit', key: `d${-fractionIndex}`, digit })
        }
      }
      continue
    }

    if (part.type === 'group') {
      const right = integerCount - integerIndex - 1
      parts.push({
        kind: 'text',
        key: `group-${right}`,
        text: part.value,
        part: 'group',
      })
      continue
    }

    const occurrence = seen[part.type] ?? 0
    seen[part.type] = occurrence + 1
    const key =
      part.type === 'decimal'
        ? 'decimal'
        : part.type === 'minusSign'
          ? 'minus'
          : part.type === 'plusSign'
            ? 'plus'
            : part.type === 'percentSign'
              ? 'percent'
              : part.type === 'currency'
                ? occurrence === 0
                  ? 'currency'
                  : `currency-${occurrence}`
                : `${part.type}-${occurrence}`
    parts.push({ kind: 'text', key, text: part.value, part: part.type })
  }

  if (suffix) {
    parts.push({ kind: 'text', key: 'suffix', text: suffix, part: 'suffix' })
  }
  return parts
}

function signatureOf(parts: Part[]) {
  return parts
    .map((part) =>
      part.kind === 'digit'
        ? `${part.key}:${part.digit}`
        : `${part.key}:${part.text}`,
    )
    .join('|')
}

function resolveTrend(
  trend: NumberFlowTrend | undefined,
  previous: number,
  next: number,
): TrendDir {
  const raw =
    typeof trend === 'function'
      ? trend(previous, next)
      : (trend ?? Math.sign(next - previous))
  if (!Number.isFinite(raw) || raw === 0) return 0
  return raw > 0 ? 1 : -1
}

function merge(prev: Item[], next: Part[], animated: boolean): Item[] {
  if (!animated) {
    return next.map((part) => ({ ...part, status: 'idle' }))
  }

  const nextKeys = new Set(next.map((part) => part.key))
  const previous = new Map(prev.map((item, index) => [item.key, index]))
  const result: Item[] = next.map((part) => {
    const existing = prev.find((item) => item.key === part.key)
    return { ...part, status: existing ? 'idle' : 'enter' }
  })

  for (const item of prev) {
    if (nextKeys.has(item.key)) continue
    const at = previous.get(item.key) ?? 0
    let insertAt = 0
    for (let index = at - 1; index >= 0; index -= 1) {
      const neighbor = result.findIndex(
        (entry) => entry.key === prev[index].key,
      )
      if (neighbor !== -1) {
        insertAt = neighbor + 1
        break
      }
    }
    result.splice(insertAt, 0, { ...item, status: 'exit' })
  }

  return result
}

function deltaFor(current: number, next: number, trend: TrendDir) {
  if (trend > 0) return mod(next - current, 10)
  if (trend < 0) return -mod(current - next, 10)
  return next - current
}

function translate(spin: number) {
  return `translate3d(0, calc(${-(spin - ORIGIN)} * var(--digit)), 0)`
}

function spinFromElement(el: HTMLElement) {
  const raw = el.dataset.spin
  if (raw == null) return null
  const target = Number(raw)
  if (el.style.transition === 'none') return target
  const sample = el.firstElementChild
  const height = sample instanceof HTMLElement ? sample.offsetHeight : 0
  if (!height) return target
  const matrix = getComputedStyle(el).transform
  if (!matrix || matrix === 'none') return target
  const values = matrix.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)
  if (!values) return target
  const offset = Number(values.length >= 16 ? values[13] : values[5])
  if (!Number.isFinite(offset)) return target
  return ORIGIN - offset / height
}

function DigitReel({
  digit,
  trend,
  animate,
}: {
  digit: number
  trend: TrendDir
  animate: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const cells = []
  for (let index = ORIGIN; index <= LAST; index += 1) cells.push(index)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const logical = el.dataset.spin == null ? null : Number(el.dataset.spin)

    const column = el.parentElement

    if (!animate || logical == null || !Number.isFinite(logical)) {
      el.dataset.spin = String(digit)
      el.style.transition = 'none'
      el.style.transform = translate(digit)
      if (column) delete column.dataset.moving
      return
    }

    const step = deltaFor(mod(logical, 10), digit, trend)
    if (step === 0) return

    let to = logical + step
    let from = spinFromElement(el) ?? logical
    while (Math.max(from, to) > LAST) {
      from -= 10
      to -= 10
    }
    while (Math.min(from, to) < ORIGIN) {
      from += 10
      to += 10
    }

    const visual = spinFromElement(el) ?? from
    if (Math.abs(from - visual) > 0.01 || el.style.transition === 'none') {
      el.style.transition = 'none'
      el.style.transform = translate(from)
      void el.offsetWidth
    }

    el.dataset.spin = String(to)
    el.style.transition = ''
    el.style.transform = translate(to)
    if (column) column.dataset.moving = ''
  }, [animate, digit, trend])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onEnd = (event: globalThis.TransitionEvent) => {
      if (event.target !== el || event.propertyName !== 'transform') return
      if (el.parentElement) delete el.parentElement.dataset.moving
      const spin = Number(el.dataset.spin)
      if (!Number.isFinite(spin)) return
      const normalized = mod(spin, 10)
      if (normalized === spin) return
      el.dataset.spin = String(normalized)
      el.style.transition = 'none'
      el.style.transform = translate(normalized)
    }
    el.addEventListener('transitionend', onEnd)
    return () => el.removeEventListener('transitionend', onEnd)
  }, [])

  return (
    <span className={styles.digit}>
      <span ref={ref} className={styles.reel}>
        {cells.map((index) => (
          <span key={index} className={styles.cell}>
            {mod(index, 10)}
          </span>
        ))}
      </span>
    </span>
  )
}

function Char({
  status,
  animate,
  part,
  onExited,
  children,
}: {
  status: ItemStatus
  animate: boolean
  part: string
  onExited: () => void
  children: ReactNode
}) {
  const onExitedRef = useRef(onExited)
  const [phase, setPhase] = useState<ItemStatus>(
    status === 'enter' && animate ? 'enter' : 'idle',
  )
  onExitedRef.current = onExited

  useEffect(() => {
    if (!animate) {
      if (status === 'exit') onExitedRef.current()
      else setPhase('idle')
      return
    }
    if (status === 'exit') {
      setPhase('exit')
      return
    }
    if (phase === 'enter') {
      const frame = requestAnimationFrame(() => setPhase('idle'))
      return () => cancelAnimationFrame(frame)
    }
    if (phase === 'exit') setPhase('idle')
  }, [animate, phase, status])

  useEffect(() => {
    if (phase !== 'exit') return
    const timeout = window.setTimeout(() => onExitedRef.current(), 1000)
    return () => window.clearTimeout(timeout)
  }, [phase])

  return (
    <span
      className={styles.slot}
      data-part={part}
      data-state={phase === 'idle' ? undefined : phase}
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.propertyName !== 'grid-template-columns') return
        if (phase === 'exit') onExitedRef.current()
      }}
    >
      <span className={styles.slotInner}>{children}</span>
    </span>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

export function NumberFlow({
  value,
  locales,
  format,
  prefix,
  suffix,
  trend,
  animated = true,
  respectMotionPreference = true,
  className,
  ...rest
}: NumberFlowProps) {
  const reduced = usePrefersReducedMotion()
  const motion = animated && !(respectMotionPreference && reduced)
  const parts = buildParts(value, locales, format, prefix, suffix)
  const signature = signatureOf(parts)

  const [frame, setFrame] = useState<Frame>(() => ({
    value,
    signature,
    motion,
    trend: 0 as TrendDir,
    items: parts.map((part) => ({ ...part, status: 'idle' as const })),
  }))

  if (frame.signature !== signature || frame.motion !== motion) {
    setFrame({
      value,
      signature,
      motion,
      trend:
        frame.value === value
          ? frame.trend
          : resolveTrend(trend, frame.value, value),
      items: merge(frame.items, parts, motion),
    })
  }

  const remove = (key: string) => {
    setFrame((current) => ({
      ...current,
      items: current.items.filter(
        (item) => item.key !== key || item.status !== 'exit',
      ),
    }))
  }

  return (
    <span
      {...rest}
      className={cn(styles.root, className)}
      data-trend={frame.trend > 0 ? 'up' : frame.trend < 0 ? 'down' : undefined}
      data-reduced={motion ? undefined : ''}
    >
      <span className={styles.sr}>
        {formatValue(value, locales, format, prefix, suffix)}
      </span>
      <span className={styles.visual} aria-hidden>
        {frame.items.map((item) => (
          <Char
            key={item.key}
            status={item.status}
            animate={motion}
            part={item.kind === 'digit' ? 'digit' : item.part}
            onExited={() => remove(item.key)}
          >
            {item.kind === 'digit' ? (
              <DigitReel
                digit={item.digit}
                trend={frame.trend}
                animate={motion}
              />
            ) : (
              <span className={styles.text}>{item.text}</span>
            )}
          </Char>
        ))}
      </span>
    </span>
  )
}
