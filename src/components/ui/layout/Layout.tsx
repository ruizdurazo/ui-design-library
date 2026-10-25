import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './Layout.module.scss'

export function Box({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return <div className={cn(styles.box, className)}>{children}</div>
}

export function Empty({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return <div className={cn(styles.empty, className)}>{text}</div>
}

export function List({
  children,
  divider,
  className,
}: {
  children?: ReactNode
  divider?: boolean
  className?: string
}) {
  return (
    <ul className={cn(styles.list, divider && styles.divider, className)}>
      {children}
    </ul>
  )
}

export function FlexBoxRow({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return <div className={cn(styles.row, className)}>{children}</div>
}
