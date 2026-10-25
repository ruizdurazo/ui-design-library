import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from '../icon/Icon'
import { Tooltip } from '../tooltip/Tooltip'
import styles from './Info.module.scss'

export type InfoType = 'info' | 'warning' | 'error'

const icons: Record<InfoType, string> = {
  info: 'info-circle',
  warning: 'alert-triangle',
  error: 'alert-circle',
}

const labels: Record<InfoType, string> = {
  info: 'More information',
  warning: 'Data warning',
  error: 'Error',
}

const sizes: Record<InfoType, number> = {
  info: 17,
  warning: 18,
  error: 18,
}

type InfoProps = {
  type?: InfoType
  title?: string
  children?: ReactNode
}

export function Info({ type = 'info', title, children }: InfoProps) {
  return (
    <Tooltip
      content={
        <div>
          {title ? <header>{title}</header> : null}
          <div>{children}</div>
        </div>
      }
    >
      <button
        type="button"
        className={cn(styles.trigger, styles[type])}
        aria-label={title || labels[type]}
      >
        <Icon icon={icons[type]} width={sizes[type]} />
      </button>
    </Tooltip>
  )
}
