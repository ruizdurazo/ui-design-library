import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { cn } from '@/lib/cn'
import { describedBy, useFormControl } from '../forms/useFormControl'
import { Icon } from '../icon/Icon'
import { FieldError } from './FieldError'
import { messages } from './messages'
import styles from './fields.module.scss'
import { useBlurredError } from './useBlurredError'
import local from './NumberInput.module.scss'

type NumberInputProps = {
  value?: number | null
  onValueChange?: (value: number | null) => void
  onValidation?: (valid: boolean) => void
  int?: boolean
  optional?: boolean
  noFormatting?: boolean
  min?: number
  max?: number
  /** When set, shows − and + buttons that change the value by this amount. */
  step?: number
  units?: string
  emptyValue?: string
  invalidValues?: number[]
  invalidValuesErrorMessage?: string
  edit?: boolean
  updateOn?: 'input' | 'blur'
  id?: string
}

type Bounds = { min?: number; max?: number; int?: boolean }

function fractionDigits(value: number) {
  if (!Number.isFinite(value)) return 0
  const [coeff, exp] = String(Math.abs(value)).toLowerCase().split('e')
  const decimals = (coeff.split('.')[1] ?? '').length
  const exponent = exp ? Number(exp) : 0
  return Math.max(0, decimals - exponent)
}

function stepped(current: number | null, delta: number, bounds: Bounds) {
  const size = Math.abs(delta)
  let next: number
  if (current === null) {
    if (delta > 0)
      next = bounds.min !== undefined && bounds.min > 0 ? bounds.min : size
    else next = bounds.max !== undefined && bounds.max < 0 ? bounds.max : -size
  } else {
    const digits = Math.max(fractionDigits(current), fractionDigits(size))
    const factor = 10 ** digits
    next = Math.round(current * factor + delta * factor) / factor
  }
  if (bounds.int) next = Math.round(next)
  if (bounds.min !== undefined) next = Math.max(bounds.min, next)
  if (bounds.max !== undefined) next = Math.min(bounds.max, next)
  return next
}

function unchanged(current: number | null, next: number) {
  return current !== null && Math.abs(current - next) < 1e-9
}

function errorFor(value: number | null, props: NumberInputProps) {
  if (value === null || Number.isNaN(value)) {
    return props.optional ? null : messages.empty
  }
  if (props.int && !Number.isInteger(value)) return messages.notInteger
  if (props.min !== undefined && value < props.min)
    return messages.tooSmall(props.min)
  if (props.max !== undefined && value > props.max)
    return messages.tooLarge(props.max)
  if (props.invalidValues?.includes(value))
    return props.invalidValuesErrorMessage || messages.invalidValue
  return null
}

function formatNumber(value: number | null, noFormatting?: boolean) {
  if (value === null || Number.isNaN(value)) return ''
  if (noFormatting) return String(value)
  return new Intl.NumberFormat('de-CH', { maximumFractionDigits: 6 }).format(
    value,
  )
}

type NumberTextOptions = { decimal: boolean; negative: boolean }

/** Keep digits. One leading minus and one decimal point are kept when the field allows them. */
function sanitizeNumberText(raw: string, { decimal, negative }: NumberTextOptions) {
  let sign = ''
  let body = ''
  let dot = false
  let seenDigit = false
  for (const char of raw) {
    if (char >= '0' && char <= '9') {
      body += char
      seenDigit = true
      continue
    }
    if (char === '-' && negative && !seenDigit && !sign) {
      sign = '-'
      continue
    }
    if (char === '.' && decimal && !dot) {
      body += '.'
      dot = true
    }
  }
  return sign + body
}

function StepButton({
  icon,
  label,
  disabled,
  controls,
  onStep,
}: {
  icon: string
  label: string
  disabled: boolean
  controls: string
  onStep: () => void
}) {
  return (
    <button
      type="button"
      className={local.step}
      aria-label={label}
      aria-controls={controls}
      disabled={disabled}
      tabIndex={-1}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onStep}
    >
      <Icon icon={icon} width={14} />
    </button>
  )
}

export function NumberInput({
  value = null,
  onValueChange,
  onValidation,
  int,
  optional,
  noFormatting,
  min,
  max,
  step,
  units,
  emptyValue = '—',
  invalidValues,
  invalidValuesErrorMessage,
  edit = false,
  updateOn = 'input',
  id,
}: NumberInputProps) {
  const { id: inputId, descriptionId } = useFormControl(id)
  const [draft, setDraft] = useState(value === null ? '' : String(value))
  const [focused, setFocused] = useState(false)
  const [suffixWidth, setSuffixWidth] = useState(0)
  const suffixRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const caretRef = useRef<number | null>(null)
  const textOptions = {
    decimal: !int,
    negative: min === undefined || min < 0,
  }
  const stepSize =
    step !== undefined && Number.isFinite(step) && step !== 0
      ? Math.abs(step)
      : null
  const numeric = draft.trim() === '' ? null : Number(draft)
  const current = numeric === null || Number.isNaN(numeric) ? null : numeric
  const currentRef = useRef(current)
  currentRef.current = current
  const bounds = { min, max, int }
  const issue = edit
    ? draft.trim() !== '' && Number.isNaN(numeric)
      ? messages.notANumber
      : errorFor(numeric, {
          int,
          optional,
          min,
          max,
          invalidValues,
          invalidValuesErrorMessage,
        })
    : null
  const { error, reveal } = useBlurredError(issue)

  useEffect(() => {
    if (!focused)
      setDraft(value === null || value === undefined ? '' : String(value))
  }, [value, focused])

  useEffect(() => {
    if (edit) onValidation?.(!issue)
  }, [edit, issue, onValidation])

  useLayoutEffect(() => {
    const node = suffixRef.current
    if (!node) {
      setSuffixWidth(0)
      return
    }
    const measure = () => {
      const next = node.offsetWidth
      setSuffixWidth((width) => (width === next ? width : next))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [edit, units])

  useLayoutEffect(() => {
    const input = inputRef.current
    const caret = caretRef.current
    if (!input || caret === null) return
    caretRef.current = null
    input.setSelectionRange(caret, caret)
  }, [draft])

  const commit = (raw: string) => {
    const next = raw.trim() === '' ? null : Number(raw)
    onValueChange?.(Number.isNaN(next as number) ? null : next)
  }

  const nudge = (delta: number) => {
    const base = currentRef.current
    const next = stepped(base, delta, bounds)
    if (unchanged(base, next)) return
    currentRef.current = next
    const raw = String(next)
    setDraft(raw)
    onValueChange?.(next)
  }

  const writeDraft = (next: string, caret?: number) => {
    if (caret !== undefined) caretRef.current = caret
    setDraft(next)
    if (updateOn === 'input') commit(next)
  }

  if (!edit) {
    return (
      <div className={styles.field}>
        <div className={styles.readOnly}>
          {value === null || value === undefined
            ? emptyValue
            : `${formatNumber(value, noFormatting)}${units ? ` ${units}` : ''}`}
        </div>
      </div>
    )
  }

  const canDecrease =
    stepSize !== null &&
    !unchanged(current, stepped(current, -stepSize, bounds))
  const canIncrease =
    stepSize !== null && !unchanged(current, stepped(current, stepSize, bounds))

  return (
    <div
      className={cn(styles.field, local.number, error && styles.invalid)}
      data-invalid={error ? '' : undefined}
      style={{ '--suffix': `${suffixWidth}px` } as CSSProperties}
    >
      <input
        ref={inputRef}
        id={inputId}
        className={cn(
          styles.control,
          units && local.withSuffix,
          stepSize !== null && local.withStep,
        )}
        aria-describedby={describedBy(descriptionId)}
        inputMode={int ? 'numeric' : 'decimal'}
        value={focused || noFormatting ? draft : formatNumber(numeric, true)}
        onFocus={(event) => {
          setFocused(true)
          event.currentTarget.select()
        }}
        onBlur={() => {
          setFocused(false)
          if (updateOn === 'blur') commit(draft)
          reveal()
        }}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing || event.key === 'Process') return
          const shortcut = event.metaKey || event.ctrlKey
          if (
            !shortcut &&
            !event.altKey &&
            stepSize !== null &&
            (event.key === 'ArrowUp' || event.key === 'ArrowDown')
          ) {
            event.preventDefault()
            nudge(event.key === 'ArrowUp' ? stepSize : -stepSize)
            return
          }
          if (shortcut || event.altKey || event.key.length !== 1) return
          const input = event.currentTarget
          const start = input.selectionStart ?? 0
          const end = input.selectionEnd ?? 0
          const next = input.value.slice(0, start) + event.key + input.value.slice(end)
          if (sanitizeNumberText(next, textOptions) !== next) event.preventDefault()
        }}
        onBeforeInput={(event) => {
          const inputType = event.nativeEvent.inputType
          if (
            inputType === 'insertFromPaste' ||
            inputType === 'insertFromDrop' ||
            (inputType !== 'insertText' && inputType !== 'insertCompositionText')
          )
            return
          const data = event.nativeEvent.data
          if (!data) return
          const input = event.currentTarget
          const start = input.selectionStart ?? 0
          const end = input.selectionEnd ?? 0
          const next = input.value.slice(0, start) + data + input.value.slice(end)
          if (sanitizeNumberText(next, textOptions) === next) return
          event.preventDefault()
          if (data.length === 1) return
          const cleaned = sanitizeNumberText(next, textOptions)
          const caret = sanitizeNumberText(input.value.slice(0, start) + data, textOptions).length
          writeDraft(cleaned, caret)
        }}
        onPaste={(event) => {
          event.preventDefault()
          const input = event.currentTarget
          const start = input.selectionStart ?? 0
          const end = input.selectionEnd ?? 0
          const pasted = event.clipboardData.getData('text')
          const next = sanitizeNumberText(
            input.value.slice(0, start) + pasted + input.value.slice(end),
            textOptions,
          )
          const caret = sanitizeNumberText(input.value.slice(0, start) + pasted, textOptions).length
          writeDraft(next, caret)
        }}
        onChange={(event) => {
          const input = event.currentTarget
          const next = sanitizeNumberText(input.value, textOptions)
          if (next === input.value) {
            writeDraft(next)
            return
          }
          const caret = sanitizeNumberText(
            input.value.slice(0, input.selectionStart ?? next.length),
            textOptions,
          ).length
          writeDraft(next, caret)
        }}
      />
      {units ? (
        <span ref={suffixRef} className={local.suffix}>
          <span className={local.units}>{units}</span>
        </span>
      ) : null}
      {stepSize !== null ? (
        <div className={local.stepper}>
          <StepButton
            icon="minus"
            label="Decrease"
            disabled={!canDecrease}
            controls={inputId}
            onStep={() => nudge(-stepSize)}
          />
          <StepButton
            icon="plus"
            label="Increase"
            disabled={!canIncrease}
            controls={inputId}
            onStep={() => nudge(stepSize)}
          />
        </div>
      ) : null}
      <FieldError message={error} />
    </div>
  )
}
