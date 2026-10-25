import type { CSSProperties, ReactNode } from 'react'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { cn } from '@/lib/cn'
import { describedBy, useFormControl } from '../forms/useFormControl'
import styles from './RadioCards.module.scss'

export type RadioCardsSize = 'small' | 'default' | 'large'

type RadioCardsProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  columns?: number
  size?: RadioCardsSize
  name?: string
  disabled?: boolean
  required?: boolean
  id?: string
  className?: string
  'aria-label'?: string
  children?: ReactNode
}

type RadioCardProps = {
  value: string
  title?: ReactNode
  description?: ReactNode
  disabled?: boolean
  className?: string
  children?: ReactNode
}

export function RadioCards({
  value,
  defaultValue,
  onValueChange,
  columns,
  size = 'default',
  name,
  disabled,
  required,
  id,
  className,
  'aria-label': ariaLabel,
  children,
}: RadioCardsProps) {
  const { id: groupId, labelId, descriptionId } = useFormControl(id)
  const columnCount =
    columns != null && columns > 0 ? Math.floor(columns) : undefined

  return (
    <RadioGroup.Root
      id={groupId}
      name={name}
      required={required}
      disabled={disabled}
      aria-labelledby={labelId}
      aria-label={labelId ? undefined : ariaLabel}
      aria-describedby={describedBy(descriptionId)}
      className={cn(
        styles.root,
        size === 'small' && styles.small,
        size === 'large' && styles.large,
        className,
      )}
      onValueChange={onValueChange}
      {...(value === undefined ? { defaultValue } : { value })}
    >
      <div
        className={cn(styles.grid, columnCount != null && styles.columns)}
        style={
          columnCount != null
            ? ({ '--columns': columnCount } as CSSProperties)
            : undefined
        }
      >
        {children}
      </div>
    </RadioGroup.Root>
  )
}

export function RadioCard({
  value,
  title,
  description,
  disabled,
  className,
  children,
}: RadioCardProps) {
  return (
    <RadioGroup.Item
      className={cn(styles.item, className)}
      value={value}
      disabled={disabled}
    >
      {children ?? (
        <span className={styles.copy}>
          {title != null ? <span className={styles.title}>{title}</span> : null}
          {description != null ? (
            <span className={styles.description}>{description}</span>
          ) : null}
        </span>
      )}
    </RadioGroup.Item>
  )
}
