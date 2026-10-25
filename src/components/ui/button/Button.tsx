import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Icon } from '../icon/Icon'
import { LoadingSpinner } from '../spinner/LoadingSpinner'
import styles from './Button.module.scss'

export type ButtonVariant = 'default' | 'primary' | 'ghost' | 'delete'
export type ButtonShape = 'default' | 'square' | 'circle'
export type ButtonRadius = 'round' | 'soft' | 'sharp'

type ButtonProps = {
  className?: string
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  icon?: string
  iconTitle?: string
  text?: string
  small?: boolean
  href?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
  shape?: ButtonShape
  radius?: ButtonRadius
  active?: boolean
  fullWidth?: boolean
  align?: 'center' | 'start'
  children?: ReactNode
  onClick?: () => void
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick' | 'disabled' | 'className'
>

function variantFromClass(className?: string): ButtonVariant | undefined {
  if (!className) return undefined
  if (className.includes('button--primary')) return 'primary'
  if (className.includes('button--ghost')) return 'ghost'
  if (className.includes('button--delete')) return 'delete'
  return undefined
}

function shapeFromClass(className?: string): ButtonShape | undefined {
  if (!className) return undefined
  if (className.includes('button--circle')) return 'circle'
  if (className.includes('button--square')) return 'square'
  return undefined
}

export function Button({
  className,
  disabled,
  loading,
  loadingText,
  icon,
  iconTitle,
  text,
  small,
  href,
  type = 'button',
  variant,
  shape,
  radius = 'soft',
  active,
  fullWidth,
  align = 'center',
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const resolvedVariant = variant ?? variantFromClass(className) ?? 'default'
  const resolvedShape = shape ?? shapeFromClass(className) ?? 'default'
  const isDisabled = disabled || loading

  const classes = cn(
    styles.button,
    resolvedVariant === 'primary' && styles.primary,
    resolvedVariant === 'ghost' && styles.ghost,
    resolvedVariant === 'delete' && styles.delete,
    resolvedShape === 'square' && styles.square,
    resolvedShape === 'circle' && styles.circle,
    radius === 'round' && styles.round,
    radius === 'sharp' && styles.sharp,
    small && styles.small,
    active && styles.active,
    fullWidth && styles.full,
    align === 'start' && styles.start,
    loading && styles.loading,
    className,
  )

  const iconSize = small ? 16 : 18
  const label = loading && loadingText !== undefined ? loadingText : text
  const inner = (
    <>
      {loading ? <LoadingSpinner className={styles.spinner} /> : null}
      {!loading && icon ? (
        <Icon
          icon={icon}
          title={iconTitle}
          width={iconSize}
          className={styles.icon}
        />
      ) : null}
      {label ? <span>{label}</span> : null}
      {children}
    </>
  )

  if (href && !isDisabled) {
    if (/^https?:\/\//.test(href)) {
      return (
        <a className={classes} href={href}>
          {inner}
        </a>
      )
    }
    return (
      <Link className={classes} to={href} onClick={onClick}>
        {inner}
      </Link>
    )
  }

  return (
    <button
      className={classes}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={onClick}
      {...rest}
    >
      {inner}
    </button>
  )
}
