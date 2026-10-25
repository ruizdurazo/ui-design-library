import { useEffect, useLayoutEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { describedBy, useFormControl } from '../forms/useFormControl'
import { FieldError } from './FieldError'
import { textError } from './TextInput'
import styles from './fields.module.scss'
import { useBlurredError } from './useBlurredError'

function resizeTextarea(textarea: HTMLTextAreaElement) {
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight + 2}px`
}

type TextAreaInputProps = {
  value?: string
  onValueChange?: (value: string) => void
  onValidation?: (valid: boolean) => void
  allowEmpty?: boolean
  minLength?: number
  maxLength?: number
  edit?: boolean
  forbiddenChars?: string[]
  placeholder?: string
  id?: string
}

export function TextAreaInput({
  value = '',
  onValueChange,
  onValidation,
  allowEmpty = false,
  minLength,
  maxLength,
  edit = false,
  forbiddenChars,
  placeholder,
  id,
}: TextAreaInputProps) {
  const { id: inputId, descriptionId } = useFormControl(id)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const issue = edit
    ? textError(value, {
        allowEmpty,
        minLength,
        maxLength,
        forbiddenChars,
        value,
      })
    : null
  const { error, reveal } = useBlurredError(issue)

  useEffect(() => {
    if (edit) onValidation?.(!issue)
  }, [edit, issue, onValidation])

  useLayoutEffect(() => {
    if (edit && textareaRef.current) resizeTextarea(textareaRef.current)
  }, [edit, value])

  if (!edit) {
    return (
      <div className={styles.field}>
        <div className={styles.readOnly}>{value || '—'}</div>
      </div>
    )
  }

  return (
    <div className={cn(styles.field, error && styles.invalid)}>
      <textarea
        ref={textareaRef}
        id={inputId}
        className={cn(styles.control, styles.textarea)}
        aria-describedby={describedBy(descriptionId)}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onValueChange?.(event.target.value)}
        onBlur={() => reveal()}
        onInput={(event) => resizeTextarea(event.currentTarget)}
      />
      <FieldError message={error} />
    </div>
  )
}
