import * as Label from '@radix-ui/react-label'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/cn'
import { describedBy, useFormControl } from '../forms/useFormControl'
import styles from './Switch.module.scss'

type SwitchProps = {
  value?: boolean
  defaultValue?: boolean
  onValueChange?: (value: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
  name?: string
  required?: boolean
  size?: 'default' | 'small'
  className?: string
}

export function Switch({
  value,
  defaultValue,
  onValueChange,
  label,
  disabled,
  id,
  name,
  required,
  size = 'default',
  className,
}: SwitchProps) {
  const { id: inputId, descriptionId } = useFormControl(id)
  const control = (
    <SwitchPrimitive.Root
      id={inputId}
      name={name}
      aria-describedby={describedBy(descriptionId)}
      required={required}
      className={cn(
        styles.root,
        size === 'small' && styles.small,
        !label && className,
      )}
      disabled={disabled}
      onCheckedChange={onValueChange}
      {...(value === undefined
        ? { defaultChecked: defaultValue }
        : { checked: value })}
    >
      <SwitchPrimitive.Thumb className={styles.thumb} />
    </SwitchPrimitive.Root>
  )

  if (!label) return control

  return (
    <span className={cn(styles.field, className)}>
      {control}
      <Label.Root className={styles.label} htmlFor={inputId}>
        {label}
      </Label.Root>
    </span>
  )
}
