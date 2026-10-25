import type { ReactNode } from 'react'
import styles from './ButtonWrapper.module.scss'
import { cn } from '@/lib/cn'

export function ButtonWrapper({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return <nav className={cn(styles.wrapper, className)}>{children}</nav>
}
