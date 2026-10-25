import { Icon } from '../icon/Icon'
import styles from './LoadingSpinner.module.scss'
import { cn } from '@/lib/cn'

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(styles.spinner, className)}
      role="status"
      aria-label="Loading"
    >
      <Icon icon="spinner" width={16} />
    </span>
  )
}
