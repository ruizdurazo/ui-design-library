import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import * as Popover from '@radix-ui/react-popover'
import { cn } from '@/lib/cn'
import { describedBy, useFormControl } from '../forms/useFormControl'
import {
  clamp,
  formatHex,
  parseHex,
  rgbToHsv,
  toRgba,
  hsvToRgb,
  type Hsva,
} from './color'
import { FieldError } from './FieldError'
import { messages } from './messages'
import field from './fields.module.scss'
import styles from './ColorPicker.module.scss'
import { useBlurredError } from './useBlurredError'

const FALLBACK = parseHex('#36B908') ?? { h: 104, s: 1, v: 0.73, a: 1 }

type ColorPickerProps = {
  value?: string
  onValueChange?: (value: string) => void
  onValidation?: (valid: boolean) => void
  edit?: boolean
  disabled?: boolean
  placeholder?: string
  allowEmpty?: boolean
  alpha?: boolean
}

function digitsOf(value: string) {
  return value
    .trim()
    .replace(/^#/, '')
    .replace(/[^0-9a-f]/gi, '')
    .toUpperCase()
}

function sameHex(a: Hsva, b: Hsva, alpha: boolean) {
  return formatHex(a, alpha) === formatHex(b, alpha)
}

export function ColorPicker({
  value = '',
  onValueChange,
  onValidation,
  edit = false,
  disabled,
  placeholder,
  allowEmpty = true,
  alpha = false,
}: ColorPickerProps) {
  const { id: inputId, labelId, descriptionId } = useFormControl()
  const rootRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const changeRef = useRef(onValueChange)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<string | null>(null)
  const [hsva, setHsva] = useState<Hsva>(() => parseHex(value) ?? FALLBACK)
  const parsed = parseHex(value)
  const trimmed = value.trim()
  const issue = !edit
    ? null
    : !trimmed
      ? allowEmpty
        ? null
        : messages.colorRequired
      : parsed
        ? null
        : alpha
          ? messages.invalidColorAlpha
          : messages.invalidColor
  const { error, reveal } = useBlurredError(issue)
  const digits = draft ?? digitsOf(trimmed).slice(0, alpha ? 8 : 6)
  const swatch = parsed ? toRgba(alpha ? hsva : { ...hsva, a: 1 }) : undefined

  changeRef.current = onValueChange

  useEffect(() => {
    if (edit) onValidation?.(!issue)
  }, [edit, issue, onValidation])

  useEffect(() => {
    if (disabled) setOpen(false)
  }, [disabled])

  useEffect(() => {
    const next = parseHex(value)
    if (!next) return
    setHsva((current) => {
      const color =
        next.s < 0.005 || next.v < 0.005 ? { ...next, h: current.h } : next
      return sameHex(current, color, true) ? current : color
    })
  }, [value])

  useEffect(() => {
    if (!edit) return
    const digits = value.trim().replace(/^#/, '')
    if (alpha && /^[0-9a-f]{6}$/i.test(digits))
      changeRef.current?.(`#${digits.toUpperCase()}FF`)
    if (!alpha && /^[0-9a-f]{8}$/i.test(digits))
      changeRef.current?.(`#${digits.slice(0, 6).toUpperCase()}`)
  }, [alpha, edit, value])

  const commit = (next: Hsva, options?: { keepDraft?: boolean }) => {
    const color = {
      h: clamp(next.h, 0, 360),
      s: clamp(next.s, 0, 1),
      v: clamp(next.v, 0, 1),
      a: alpha ? clamp(next.a, 0, 1) : 1,
    }
    setHsva(color)
    if (!options?.keepDraft) setDraft(null)
    onValueChange?.(formatHex(color, alpha))
  }

  const keepFieldOpen = (event: {
    target: EventTarget | null
    preventDefault: () => void
  }) => {
    if (rootRef.current?.contains(event.target as Node)) event.preventDefault()
  }

  const leaveField = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget as Node | null
    if (
      next &&
      (rootRef.current?.contains(next) || popoverRef.current?.contains(next))
    )
      return
    reveal()
  }

  if (!edit) {
    const readOnly = parsed
      ? formatHex(hsva, alpha).slice(1)
      : digitsOf(trimmed)
    return (
      <div className={field.field}>
        <div className={cn(field.readOnly, styles.readOnly)}>
          {parsed ? (
            <>
              <Swatch color={toRgba(alpha ? hsva : { ...hsva, a: 1 })} />
              <span className={styles.hexGroup}>
                <span className={styles.hash} aria-hidden="true">
                  #
                </span>
                <span className={styles.digits}>{readOnly}</span>
              </span>
            </>
          ) : (
            <span>{trimmed ? trimmed : messages.undefinedValue}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div
        ref={rootRef}
        className={cn(field.field, error && field.invalid)}
        onBlur={leaveField}
      >
        <Popover.Anchor asChild>
          <div
            className={cn(
              styles.control,
              error && styles.invalid,
              disabled && styles.disabled,
            )}
            onMouseDown={(event) => {
              if (disabled) return
              const target = event.target as HTMLElement
              if (target.closest('input, button')) return
              event.preventDefault()
              inputRef.current?.focus()
            }}
          >
            <Popover.Trigger asChild>
              <button
                type="button"
                className={styles.chip}
                tabIndex={-1}
                disabled={disabled}
                aria-label="Pick a color"
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.preventDefault()
                  if (disabled) return
                  setOpen(true)
                  inputRef.current?.focus()
                }}
              >
                <Swatch color={swatch} />
              </button>
            </Popover.Trigger>
            <div className={styles.hexGroup}>
              <span className={styles.hash} aria-hidden="true">
                #
              </span>
              <input
                ref={inputRef}
                id={inputId}
                className={styles.hex}
                value={digits}
                disabled={disabled}
                placeholder={placeholder ?? (alpha ? 'RRGGBBAA' : 'RRGGBB')}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                aria-label={
                  labelId
                    ? undefined
                    : alpha
                      ? 'Hex color with alpha'
                      : 'Hex color'
                }
                aria-describedby={describedBy(descriptionId)}
                aria-expanded={open}
                onFocus={(event) => {
                  if (disabled) return
                  setOpen(true)
                  event.currentTarget.select()
                }}
                onClick={() => {
                  if (!disabled) setOpen(true)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setOpen(false)
                }}
                onBlur={() => setDraft(null)}
                onChange={(event) => {
                  const nextDigits = digitsOf(event.target.value).slice(
                    0,
                    alpha ? 8 : 6,
                  )
                  if (!nextDigits) {
                    setDraft('')
                    onValueChange?.('')
                    return
                  }
                  const pasted =
                    event.nativeEvent instanceof InputEvent &&
                    event.nativeEvent.inputType === 'insertFromPaste'
                  const complete =
                    nextDigits.length === (alpha ? 8 : 6) ||
                    (alpha && nextDigits.length === 6 && pasted)
                  const next = complete ? parseHex(nextDigits) : null
                  if (next) {
                    setDraft(nextDigits)
                    commit(next, { keepDraft: true })
                    return
                  }
                  setDraft(nextDigits)
                }}
              />
            </div>
          </div>
        </Popover.Anchor>
        <FieldError message={error} />
      </div>
      <Popover.Portal>
        <Popover.Content
          ref={popoverRef}
          className={styles.popover}
          aria-label="Color picker"
          side="bottom"
          align="start"
          sideOffset={6}
          collisionPadding={8}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onPointerDownOutside={keepFieldOpen}
          onFocusOutside={keepFieldOpen}
          onInteractOutside={keepFieldOpen}
          onBlur={leaveField}
          onMouseDown={(event) => {
            if ((event.target as HTMLElement).closest('input')) return
            event.preventDefault()
          }}
        >
          <Picker color={hsva} alpha={alpha} onChange={commit} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export function ColorPickerPanel({
  value = '#36B908',
  onValueChange,
  alpha = false,
}: {
  value?: string
  onValueChange?: (value: string) => void
  alpha?: boolean
}) {
  const changeRef = useRef(onValueChange)
  const [hsva, setHsva] = useState<Hsva>(() => parseHex(value) ?? FALLBACK)
  changeRef.current = onValueChange

  useEffect(() => {
    const next = parseHex(value)
    if (!next) return
    setHsva((current) => {
      const color =
        next.s < 0.005 || next.v < 0.005 ? { ...next, h: current.h } : next
      return sameHex(current, color, true) ? current : color
    })
  }, [value])

  useEffect(() => {
    const digits = value.trim().replace(/^#/, '')
    if (alpha && /^[0-9a-f]{6}$/i.test(digits))
      changeRef.current?.(`#${digits.toUpperCase()}FF`)
    if (!alpha && /^[0-9a-f]{8}$/i.test(digits))
      changeRef.current?.(`#${digits.slice(0, 6).toUpperCase()}`)
  }, [alpha, value])

  const commit = (next: Hsva) => {
    const color = {
      h: clamp(next.h, 0, 360),
      s: clamp(next.s, 0, 1),
      v: clamp(next.v, 0, 1),
      a: alpha ? clamp(next.a, 0, 1) : 1,
    }
    setHsva(color)
    onValueChange?.(formatHex(color, alpha))
  }

  return (
    <div className={cn(styles.popover, styles.panel)}>
      <Picker color={hsva} alpha={alpha} onChange={commit} />
    </div>
  )
}

function Swatch({ color }: { color?: string }) {
  return (
    <span className={styles.swatch}>
      <span className={styles.checker} />
      {color ? (
        <span className={styles.fill} style={{ background: color }} />
      ) : null}
    </span>
  )
}

function Picker({
  color,
  alpha,
  onChange,
}: {
  color: Hsva
  alpha: boolean
  onChange: (color: Hsva) => void
}) {
  const hueId = useId()
  const alphaId = useId()
  const { r, g, b } = hsvToRgb(color.h, color.s, color.v)
  const area = useDrag((x, y) => onChange({ ...color, s: x, v: 1 - y }))
  const hue = useDrag((x) => onChange({ ...color, h: x * 360 }))
  const transparency = useDrag((x) => onChange({ ...color, a: x }))

  return (
    <>
      <div
        className={styles.area}
        role="group"
        aria-label="Saturation and brightness"
        tabIndex={0}
        {...area}
        onKeyDown={(event) => {
          const step = event.shiftKey ? 0.1 : 0.01
          let { s, v } = color
          if (event.key === 'ArrowLeft') s -= step
          else if (event.key === 'ArrowRight') s += step
          else if (event.key === 'ArrowDown') v -= step
          else if (event.key === 'ArrowUp') v += step
          else return
          event.preventDefault()
          onChange({ ...color, s, v })
        }}
      >
        <div
          className={styles.surface}
          style={{ backgroundColor: `hsl(${color.h} 100% 50%)` }}
        />
        <div
          className={styles.thumb}
          style={{ left: `${color.s * 100}%`, top: `${(1 - color.v) * 100}%` }}
        />
      </div>
      <div className={styles.channel}>
        <span className={styles.label} id={hueId}>
          Hue
        </span>
        <div
          className={styles.slider}
          role="slider"
          aria-labelledby={hueId}
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={Math.round(color.h)}
          tabIndex={0}
          {...hue}
          onKeyDown={(event) =>
            onSliderKey(event, color.h, 0, 360, 1, (h) =>
              onChange({ ...color, h }),
            )
          }
        >
          <div className={cn(styles.track, styles.hue)} />
          <div
            className={styles.thumb}
            style={{ left: `${(color.h / 360) * 100}%` }}
          />
        </div>
        {alpha ? null : <ChannelFields color={color} onChange={onChange} />}
      </div>
      {alpha ? (
        <div className={styles.channel}>
          <span className={styles.label} id={alphaId}>
            Alpha
          </span>
          <div
            className={styles.slider}
            role="slider"
            aria-labelledby={alphaId}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(color.a * 100)}
            aria-valuetext={`${Math.round(color.a * 100)}%`}
            tabIndex={0}
            {...transparency}
            onKeyDown={(event) =>
              onSliderKey(event, color.a, 0, 1, 0.01, (a) =>
                onChange({ ...color, a }),
              )
            }
          >
            <div className={cn(styles.track, styles.checker)}>
              <div
                className={styles.alpha}
                style={{
                  background: `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0), rgb(${r}, ${g}, ${b}))`,
                }}
              />
            </div>
            <div
              className={styles.thumb}
              style={{ left: `${color.a * 100}%` }}
            />
          </div>
          <ChannelFields color={color} alpha onChange={onChange} />
        </div>
      ) : null}
    </>
  )
}

const CHANNELS = [
  { id: 'r', label: 'R', name: 'Red' },
  { id: 'g', label: 'G', name: 'Green' },
  { id: 'b', label: 'B', name: 'Blue' },
  { id: 'a', label: 'A', name: 'Alpha' },
] as const

type ChannelId = (typeof CHANNELS)[number]['id']

function ChannelFields({
  color,
  alpha,
  onChange,
}: {
  color: Hsva
  alpha?: boolean
  onChange: (color: Hsva) => void
}) {
  const { r, g, b } = hsvToRgb(color.h, color.s, color.v)
  const bytes = { r, g, b, a: Math.round(clamp(color.a, 0, 1) * 255) }
  const channels = alpha
    ? CHANNELS
    : CHANNELS.filter((channel) => channel.id !== 'a')
  const [draft, setDraft] = useState<{ id: ChannelId; text: string } | null>(
    null,
  )

  const apply = (id: ChannelId, value: number) => {
    if (id === 'a') {
      onChange({ ...color, a: value / 255 })
      return
    }
    const next = { r, g, b, [id]: value }
    const hsv = rgbToHsv(next.r, next.g, next.b)
    const achromatic = hsv.s < 0.005 || hsv.v < 0.005
    onChange({
      h: achromatic ? color.h : hsv.h,
      s: hsv.s,
      v: hsv.v,
      a: color.a,
    })
  }

  return (
    <div className={cn(styles.values, alpha && styles.valuesAlpha)}>
      {channels.map((channel) => {
        const text =
          draft?.id === channel.id ? draft.text : String(bytes[channel.id])
        return (
          <label key={channel.id} className={styles.value}>
            <span className={styles.valueLabel}>{channel.label}</span>
            <input
              className={styles.valueInput}
              data-channel={channel.id}
              inputMode="numeric"
              aria-label={channel.name}
              value={text}
              onFocus={(event) => event.currentTarget.select()}
              onBlur={() => setDraft(null)}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, '').slice(0, 3)
                if (!digits) {
                  setDraft({ id: channel.id, text: '' })
                  return
                }
                const value = Math.min(255, Number(digits))
                setDraft({
                  id: channel.id,
                  text: value === Number(digits) ? digits : String(value),
                })
                apply(channel.id, value)
              }}
            />
          </label>
        )
      })}
    </div>
  )
}

function onSliderKey(
  event: KeyboardEvent<HTMLDivElement>,
  value: number,
  min: number,
  max: number,
  step: number,
  onChange: (value: number) => void,
) {
  const large = step * 10
  const amount = event.shiftKey ? large : step
  let next: number | null = null
  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown')
    next = value - amount
  else if (event.key === 'ArrowRight' || event.key === 'ArrowUp')
    next = value + amount
  else if (event.key === 'PageDown') next = value - large
  else if (event.key === 'PageUp') next = value + large
  else if (event.key === 'Home') next = min
  else if (event.key === 'End') next = max
  if (next === null) return
  event.preventDefault()
  onChange(clamp(next, min, max))
}

function useDrag(onMove: (x: number, y: number) => void) {
  const pick = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    onMove(
      clamp((event.clientX - rect.left) / rect.width, 0, 1),
      clamp((event.clientY - rect.top) / rect.height, 0, 1),
    )
  }

  return {
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      const active = document.activeElement
      if (active instanceof HTMLInputElement && active.dataset.channel)
        active.blur()
      event.currentTarget.setPointerCapture(event.pointerId)
      pick(event)
    },
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
      pick(event)
    },
  }
}
