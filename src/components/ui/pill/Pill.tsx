import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from '../icon/Icon'
import styles from './Pill.module.scss'

export type PillVariant =
  'default' | 'transparent' | 'inverted' | 'outline' | 'danger' | 'brand'
export type PillSize = 'small' | 'medium' | 'large'

type PillProps = {
  variant?: PillVariant
  size?: PillSize
  icon?: string
  className?: string
  children?: ReactNode
} & Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'children'>

export function Pill({
  variant = 'default',
  size = 'medium',
  icon,
  className,
  children,
  ...rest
}: PillProps) {
  const iconSize = size === 'large' ? 14 : 12

  return (
    <span
      className={cn(
        styles.pill,
        size === 'small' && styles.small,
        size === 'large' && styles.large,
        variant === 'transparent' && styles.transparent,
        variant === 'inverted' && styles.inverted,
        variant === 'outline' && styles.outline,
        variant === 'danger' && styles.danger,
        variant === 'brand' && styles.brand,
        icon && styles.withIcon,
        className,
      )}
      {...rest}
    >
      {icon ? <Icon icon={icon} width={iconSize} /> : null}
      {children}
    </span>
  )
}
