import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'
import styles from './Compare.module.scss'

export type CompareOrientation = 'horizontal' | 'vertical'

export type CompareLabelTone = 'light' | 'dark'

type CompareProps = {
  before: ReactNode
  after: ReactNode
  beforeLabel?: ReactNode
  afterLabel?: ReactNode
  /** Pill color behind the before label. */
  beforeLabelTone?: CompareLabelTone
  /** Pill color behind the after label. */
  afterLabelTone?: CompareLabelTone
  /** Draw the labels on a pill. Set false for text only. */
  labelPill?: boolean
  orientation?: CompareOrientation
  /** Position of the divider, from 0 to 100. */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  onValueCommit?: (value: number) => void
  /** Snap the divider to multiples of this amount. Arrow keys move by one step. */
  step?: number
  disabled?: boolean
  /** Width / height of the frame. Set to `auto` and give the frame a height to size it yourself. */
  aspectRatio?: string
  className?: string
  'aria-label'?: string
}

function clampPosition(value: number, step?: number) {
  if (!Number.isFinite(value)) return 0
  const bounded = Math.min(100, Math.max(0, value))
  if (step == null || !(step > 0)) return bounded
  const snapped = Math.min(100, Math.max(0, Math.round(bounded / step) * step))
  const text = String(step)
  const dot = text.indexOf('.')
  const digits = dot === -1 ? 0 : text.length - dot - 1
  return Number(snapped.toFixed(Math.min(digits, 6)))
}

function nextPosition(
  key: string,
  current: number,
  amount: number,
  jump: number,
) {
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      return current - amount
    case 'ArrowRight':
    case 'ArrowDown':
      return current + amount
    case 'PageUp':
      return current + jump
    case 'PageDown':
      return current - jump
    case 'Home':
      return 0
    case 'End':
      return 100
    default:
      return null
  }
}

function isInteractive(target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  return Boolean(
    target.closest(
      'a, button, input, textarea, select, label, [contenteditable="true"]',
    ),
  )
}

export function Compare({
  before,
  after,
  beforeLabel,
  afterLabel,
  beforeLabelTone = 'light',
  afterLabelTone = 'light',
  labelPill = true,
  orientation = 'horizontal',
  value,
  defaultValue = 50,
  onValueChange,
  onValueCommit,
  step,
  disabled = false,
  aspectRatio = '3 / 2',
  className,
  'aria-label': ariaLabel,
}: CompareProps) {
  const [uncontrolled, setUncontrolled] = useState(() =>
    clampPosition(defaultValue, step),
  )
  const [dragging, setDragging] = useState(false)
  const position = clampPosition(value ?? uncontrolled, step)
  const positionRef = useRef(position)
  const draggingRef = useRef(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const vertical = orientation === 'vertical'

  if (!draggingRef.current) positionRef.current = position

  const name =
    ariaLabel ??
    (typeof beforeLabel === 'string' && typeof afterLabel === 'string'
      ? `${beforeLabel} and ${afterLabel}`
      : 'Comparison')

  const publish = (next: number) => {
    const clamped = clampPosition(next, step)
    if (clamped === positionRef.current) return
    positionRef.current = clamped
    if (value === undefined) setUncontrolled(clamped)
    onValueChange?.(clamped)
  }

  const readPosition = (event: PointerEvent<HTMLDivElement>) => {
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect) return positionRef.current
    const span = vertical ? rect.height : rect.width
    if (span <= 0) return positionRef.current
    const offset = vertical
      ? event.clientY - rect.top
      : event.clientX - rect.left
    return (offset / span) * 100
  }

  const endDrag = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    onValueCommit?.(positionRef.current)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0 || draggingRef.current) return
    if (isInteractive(event.target)) return
    event.preventDefault()
    draggingRef.current = true
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    handleRef.current?.focus({ preventScroll: true, focusVisible: false })
    publish(readPosition(event))
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    publish(readPosition(event))
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    endDrag()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const keyStep = step != null && step > 0 ? step : 1
    const jump = keyStep * 10
    const current = positionRef.current
    const next = nextPosition(
      event.key,
      current,
      event.shiftKey ? jump : keyStep,
      jump,
    )
    if (next == null) {
      if (event.key === ' ') event.preventDefault()
      return
    }
    event.preventDefault()
    publish(next)
    if (positionRef.current !== current) onValueCommit?.(positionRef.current)
  }

  return (
    <div
      ref={frameRef}
      className={cn(styles.root, className)}
      data-orientation={orientation}
      data-dragging={dragging ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      style={
        {
          '--position': `${position}%`,
          aspectRatio,
        } as CSSProperties
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={endDrag}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className={cn(styles.pane, styles.after)}>
        <div className={styles.media}>{after}</div>
        {afterLabel != null ? (
          <span
            className={cn(
              styles.label,
              styles.afterLabel,
              labelPill && styles.pill,
              labelPill && styles[afterLabelTone],
            )}
          >
            {afterLabel}
          </span>
        ) : null}
      </div>
      <div className={cn(styles.pane, styles.before)}>
        <div className={styles.media}>{before}</div>
        {beforeLabel != null ? (
          <span
            className={cn(
              styles.label,
              styles.beforeLabel,
              labelPill && styles.pill,
              labelPill && styles[beforeLabelTone],
            )}
          >
            {beforeLabel}
          </span>
        ) : null}
      </div>
      <div
        ref={handleRef}
        className={styles.handle}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={name}
        aria-orientation={orientation}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Number(position.toFixed(2))}
        aria-valuetext={`${Math.round(position)}%`}
        aria-disabled={disabled || undefined}
        onKeyDown={onKeyDown}
      >
        <span className={styles.line} />
      </div>
    </div>
  )
}
