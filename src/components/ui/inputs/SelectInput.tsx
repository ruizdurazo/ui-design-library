import { useEffect, useMemo, useRef } from 'react'
import * as Select from '@radix-ui/react-select'
import { cn } from '@/lib/cn'
import { describedBy, useFormControl } from '../forms/useFormControl'
import { Icon } from '../icon/Icon'
import { FieldError } from './FieldError'
import { messages } from './messages'
import { useBlurredError } from './useBlurredError'
import field from './fields.module.scss'
import styles from './SelectInput.module.scss'

export type SelectOption =
  | {
      value?: string | number
      id?: string | number
      label?: string
      name?: string
      text?: string
    }
  | string
  | number

type SelectInputProps = {
  value?: string | number | null
  onValueChange?: (value: string | number | null) => void
  onValidation?: (valid: boolean) => void
  options: SelectOption[]
  edit?: boolean
  disabled?: boolean
  emptyValue?: string
  placeholder?: string
  clearable?: boolean
  allowEmpty?: boolean
  id?: string
}

type Normalized = { value: string; label: string; emitted: string | number }

function normalize(options: SelectOption[]): Normalized[] {
  return options.map((option, index) => {
    if (typeof option === 'object' && option !== null) {
      const raw = option.value ?? option.id ?? index
      const label = option.label ?? option.name ?? option.text ?? String(raw)
      return { value: String(raw), label: String(label), emitted: raw }
    }
    return { value: String(option), label: String(option), emitted: option }
  })
}

export function SelectInput({
  value = null,
  onValueChange,
  onValidation,
  options,
  edit = false,
  disabled,
  emptyValue = '—',
  placeholder = 'Select',
  clearable = false,
  allowEmpty = false,
  id,
}: SelectInputProps) {
  const { id: inputId, descriptionId } = useFormControl(id)
  const items = useMemo(() => normalize(options), [options])
  const openRef = useRef(false)
  const selected = items.find((item) => item.value === String(value ?? ''))
  const empty = value === null || value === undefined || value === ''
  const issue =
    edit && empty && !clearable && !allowEmpty ? messages.selectEmpty : null
  const { error, reveal } = useBlurredError(issue)

  useEffect(() => {
    if (edit) onValidation?.(!issue)
  }, [edit, issue, onValidation])

  if (!edit) {
    return (
      <div className={field.field}>
        <div className={field.readOnly}>
          {selected?.label ?? (empty ? emptyValue : String(value))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(field.field, error && field.invalid)}>
      <Select.Root
        value={empty ? '' : String(value)}
        disabled={disabled}
        onOpenChange={(next) => {
          openRef.current = next
          if (!next) reveal()
        }}
        onValueChange={(next) => {
          const match = items.find((item) => item.value === next)
          onValueChange?.(match ? match.emitted : next)
        }}
      >
        <Select.Trigger
          className={cn(field.control, styles.trigger)}
          id={inputId}
          aria-describedby={describedBy(descriptionId)}
          onBlur={() => {
            requestAnimationFrame(() => {
              if (!openRef.current) reveal()
            })
          }}
        >
          <Select.Value placeholder={placeholder}>
            {selected?.label}
          </Select.Value>
          <span className={styles.icons}>
            {clearable && !empty ? (
              <span
                className={styles.clear}
                role="button"
                aria-label="Clear"
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onValueChange?.(null)
                }}
              >
                <Icon icon="x" width={14} />
              </span>
            ) : null}
            <Select.Icon className={styles.chevron}>
              <Icon icon="chevron-down" width={16} />
            </Select.Icon>
          </span>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className={styles.content}
            position="popper"
            sideOffset={5}
          >
            <Select.Viewport className={styles.viewport}>
              {items.map((item) => (
                <Select.Item
                  key={item.value}
                  className={styles.item}
                  value={item.value}
                >
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <Icon icon="check" width={14} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <FieldError message={error} />
    </div>
  )
}
