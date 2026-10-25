import * as Checkbox from '@radix-ui/react-checkbox'
import * as Label from '@radix-ui/react-label'
import { describedBy, useFormControl } from '../forms/useFormControl'
import { Icon } from '../icon/Icon'
import styles from './CheckInput.module.scss'

type CheckInputProps = {
  value?: boolean
  onValueChange?: (value: boolean) => void
  label?: string
  activeLabel?: string
  inactiveLabel?: string
  edit?: boolean
  disabled?: boolean
  id?: string
}

export function CheckInput({
  value = false,
  onValueChange,
  label,
  activeLabel,
  inactiveLabel,
  edit = false,
  disabled,
  id,
}: CheckInputProps) {
  const { id: inputId, descriptionId } = useFormControl(id)

  if (!edit) {
    const text = value ? (activeLabel ?? label) : inactiveLabel
    if (!text) return null
    return <span className={styles.readOnly}>{text}</span>
  }

  return (
    <span className={styles.check}>
      <Checkbox.Root
        id={inputId}
        className={styles.box}
        aria-describedby={describedBy(descriptionId)}
        checked={value}
        disabled={disabled}
        onCheckedChange={(checked) => onValueChange?.(checked === true)}
      >
        <Checkbox.Indicator className={styles.indicator}>
          <Icon icon="check" width={12} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      {label ? (
        <Label.Root className={styles.label} htmlFor={inputId}>
          {label}
        </Label.Root>
      ) : null}
    </span>
  )
}
