import { useEffect } from 'react'
import { cn } from '@/lib/cn'
import { describedBy, useFormControl } from '../forms/useFormControl'
import { FieldError } from './FieldError'
import { messages } from './messages'
import styles from './fields.module.scss'
import { useBlurredError } from './useBlurredError'

type TextInputProps = {
  value?: string
  onValueChange?: (value: string) => void
  onValidation?: (valid: boolean) => void
  password?: boolean
  allowEmpty?: boolean
  minLength?: number
  maxLength?: number
  invalidValues?: string[]
  invalidValuesErrorMessage?: string
  edit?: boolean
  forbiddenChars?: string[]
  placeholder?: string
  id?: string
}

export function textError(
  value: string,
  props: Omit<TextInputProps, 'onValueChange' | 'onValidation' | 'edit'>,
) {
  if (props.minLength !== undefined && value.length < props.minLength) {
    return value.length ? messages.tooShort(props.minLength) : messages.empty
  }
  if (props.maxLength !== undefined && value.length > props.maxLength)
    return messages.tooLong(props.maxLength)
  const chars = (props.forbiddenChars ?? []).filter(Boolean)
  const found = chars.filter((char) => value.includes(char))
  if (found.length) return messages.forbidden(found)
  if (props.invalidValues?.includes(value))
    return props.invalidValuesErrorMessage || messages.invalidValue
  if (!props.allowEmpty && value === '') return messages.empty
  return null
}

export function TextInput({
  value = '',
  onValueChange,
  onValidation,
  password,
  allowEmpty = false,
  minLength,
  maxLength,
  invalidValues,
  invalidValuesErrorMessage,
  edit = false,
  forbiddenChars,
  placeholder,
  id,
}: TextInputProps) {
  const { id: inputId, descriptionId } = useFormControl(id)
  const rules = {
    password,
    allowEmpty,
    minLength,
    maxLength,
    invalidValues,
    invalidValuesErrorMessage,
    forbiddenChars,
    value,
  }
  const issue = edit ? textError(value, rules) : null
  const { error, reveal } = useBlurredError(issue)

  useEffect(() => {
    if (edit) onValidation?.(!textError(value, rules))
    // Rules are derived from props on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit, value, allowEmpty, minLength, maxLength, password])

  if (!edit) {
    return (
      <div className={styles.field}>
        <div className={styles.readOnly}>{value || '—'}</div>
      </div>
    )
  }

  return (
    <div className={cn(styles.field, error && styles.invalid)}>
      <input
        id={inputId}
        className={styles.control}
        aria-describedby={describedBy(descriptionId)}
        type={password ? 'password' : 'text'}
        value={value}
        placeholder={placeholder}
        onFocus={(event) => event.currentTarget.select()}
        onBlur={() => reveal()}
        onChange={(event) => onValueChange?.(event.target.value)}
      />
      <FieldError message={error} />
    </div>
  )
}
