import { useId, useState } from 'react'
import type { CSSProperties } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/cn'
import { describedBy, useFormControl } from '../forms/useFormControl'
import styles from './Slider.module.scss'

export type SliderMark = {
  value: number
  label?: string
}

type SliderMarkInput = number | SliderMark

type SharedSliderProps = {
  min?: number
  max?: number
  step?: number
  /** Minimum number of steps between thumbs. */
  minStepsBetweenThumbs?: number
  /** Thumbs keep their order and cannot cross while dragging. */
  preserveThumbOrder?: boolean
  marks?: SliderMarkInput[]
  label?: string
  /** Accessible name for each thumb. Range sliders should name every thumb. */
  thumbLabels?: string[]
  showValue?: boolean
  formatValue?: (value: number) => string
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  inverted?: boolean
  dir?: 'ltr' | 'rtl'
  name?: string
  className?: string
}

type SingleSliderProps = SharedSliderProps & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  onValueCommit?: (value: number) => void
}

type RangeSliderProps = SharedSliderProps & {
  value: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
}

type RangeDefaultSliderProps = SharedSliderProps & {
  value?: number[]
  defaultValue: number[]
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
}

export type SliderProps =
  SingleSliderProps | RangeSliderProps | RangeDefaultSliderProps

function fractionDigits(step: number) {
  if (!Number.isFinite(step)) return 0
  const text = String(step)
  if (text.includes('e-')) {
    const digits = Number(text.split('e-')[1])
    return Number.isFinite(digits) ? digits : 0
  }
  const dot = text.indexOf('.')
  return dot === -1 ? 0 : text.length - dot - 1
}

function toValues(
  value: number | number[] | undefined,
  multiple: boolean,
  min: number,
  max: number,
) {
  if (Array.isArray(value)) return value.length > 0 ? value : [min, max]
  if (typeof value === 'number' && Number.isFinite(value)) return [value]
  return multiple ? [min, max] : [min]
}

function toPercent(value: number, min: number, max: number) {
  if (max === min) return 0
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
}

function anchor(percent: number) {
  return `calc(${percent}% + (var(--thumb) / 2) * (1 - ${percent} / 50))`
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs = 0,
  preserveThumbOrder = false,
  marks,
  label,
  thumbLabels,
  showValue = true,
  formatValue,
  disabled = false,
  orientation = 'horizontal',
  inverted = false,
  dir,
  name,
  className,
  ...props
}: SliderProps) {
  const form = useFormControl()
  const ownLabelId = useId()
  const multiple =
    Array.isArray(props.value) || Array.isArray(props.defaultValue)
  const [uncontrolled, setUncontrolled] = useState(() =>
    toValues(props.defaultValue ?? props.value, multiple, min, max),
  )
  const values =
    props.value !== undefined
      ? toValues(props.value, multiple, min, max)
      : uncontrolled
  const format = (value: number) =>
    formatValue?.(value) ??
    new Intl.NumberFormat(undefined, {
      maximumFractionDigits: fractionDigits(step),
    }).format(value)
  const valueText =
    values.length === 2
      ? `${format(values[0])} – ${format(values[1])}`
      : values.map(format).join(', ')
  const onValueChange = props.onValueChange as
    ((value: number | number[]) => void) | undefined
  const onValueCommit = props.onValueCommit as
    ((value: number | number[]) => void) | undefined
  const vertical = orientation === 'vertical'
  const fromStart = vertical ? !inverted : dir === 'rtl' ? inverted : !inverted

  const publish = (next: number[], fn?: (value: number | number[]) => void) => {
    fn?.(multiple ? next : (next[0] ?? min))
  }

  const place = (value: number): CSSProperties => {
    const position = anchor(toPercent(value, min, max))
    if (vertical) {
      return fromStart
        ? { bottom: position, left: '50%', transform: 'translate(-50%, 50%)' }
        : { top: position, left: '50%', transform: 'translate(-50%, -50%)' }
    }
    return fromStart
      ? { left: position, top: '50%', transform: 'translate(-50%, -50%)' }
      : { right: position, top: '50%', transform: 'translate(50%, -50%)' }
  }

  const placeLabel = (value: number): CSSProperties => {
    const position = anchor(toPercent(value, min, max))
    if (vertical) {
      return fromStart
        ? { bottom: position, transform: 'translateY(50%)' }
        : { top: position, transform: 'translateY(-50%)' }
    }
    return fromStart
      ? { left: position, transform: 'translateX(-50%)' }
      : { right: position, transform: 'translateX(50%)' }
  }

  const normalizedMarks = (marks ?? [])
    .map((mark) =>
      typeof mark === 'number' ? { value: mark, label: format(mark) } : mark,
    )
    .sort((a, b) => a.value - b.value)
  const labelledMarks = normalizedMarks.filter((mark) => mark.label)

  return (
    <div
      className={cn(styles.root, className)}
      data-orientation={orientation}
      data-disabled={disabled ? '' : undefined}
    >
      {label || showValue ? (
        <div className={styles.header}>
          {label ? (
            <span className={styles.label} id={ownLabelId}>
              {label}
            </span>
          ) : (
            <span />
          )}
          {showValue ? <span className={styles.value}>{valueText}</span> : null}
        </div>
      ) : null}
      <div className={styles.body}>
        <SliderPrimitive.Root
          className={styles.control}
          value={values}
          min={min}
          max={max}
          step={step}
          minStepsBetweenThumbs={minStepsBetweenThumbs}
          preserveThumbOrder={preserveThumbOrder}
          disabled={disabled}
          orientation={orientation}
          inverted={inverted}
          dir={dir}
          name={name}
          onValueChange={(next) => {
            if (props.value === undefined) setUncontrolled(next)
            publish(next, onValueChange)
          }}
          onValueCommit={(next) => publish(next, onValueCommit)}
        >
          <SliderPrimitive.Track className={styles.track}>
            <SliderPrimitive.Range className={styles.range} />
            {normalizedMarks.map((mark) => (
              <span
                key={mark.value}
                aria-hidden
                className={styles.mark}
                style={place(mark.value)}
              />
            ))}
          </SliderPrimitive.Track>
          {values.map((_, index) => {
            const thumbLabel = thumbLabels?.[index]
            const fieldLabelId = label ? ownLabelId : form.labelId
            const labelledBy =
              !thumbLabel && fieldLabelId && !multiple
                ? fieldLabelId
                : undefined
            const accessibleName =
              thumbLabel ?? (!fieldLabelId && !multiple ? 'Value' : undefined)
            return (
              <SliderPrimitive.Thumb
                key={index}
                className={styles.thumb}
                aria-describedby={describedBy(form.descriptionId)}
                {...(accessibleName ? { 'aria-label': accessibleName } : {})}
                {...(labelledBy ? { 'aria-labelledby': labelledBy } : {})}
              />
            )
          })}
        </SliderPrimitive.Root>
        {labelledMarks.length > 0 ? (
          <div className={styles.scale} aria-hidden>
            {labelledMarks.map((mark) => (
              <span
                key={mark.value}
                className={styles.scaleLabel}
                style={placeLabel(mark.value)}
              >
                {mark.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
