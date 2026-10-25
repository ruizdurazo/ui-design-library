import { createContext, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from '../icon/Icon'
import styles from './Card.module.scss'

type CardContextValue = {
  collapsed: boolean
  collapsible: boolean
  toggle: () => void
}

const CardContext = createContext<CardContextValue | null>(null)

type CardProps = {
  collapsible?: boolean
  collapsed?: boolean
  section?: string
  isStatic?: boolean
  className?: string
  onCollapsedChange?: (collapsed: boolean) => void
  children?: ReactNode
}

export function Card({
  collapsible = false,
  collapsed = false,
  section,
  isStatic,
  className,
  onCollapsedChange,
  children,
}: CardProps) {
  const storageKey = section ? `compass-card:${section}` : null
  const [isCollapsed, setCollapsed] = useState(() => {
    if (!storageKey) return collapsed
    const stored = localStorage.getItem(storageKey)
    return stored == null ? collapsed : stored === '1'
  })

  const toggle = () => {
    if (!collapsible) return
    setCollapsed((current) => {
      const next = !current
      if (storageKey) localStorage.setItem(storageKey, next ? '1' : '0')
      onCollapsedChange?.(next)
      return next
    })
  }

  return (
    <CardContext.Provider
      value={{ collapsed: isCollapsed, collapsible, toggle }}
    >
      <div className={cn(styles.card, isStatic && styles.static, className)}>
        {children}
      </div>
    </CardContext.Provider>
  )
}

type CardHeaderProps = {
  title?: string
  icon?: string
  isStatic?: boolean
  action?: ReactNode
  children?: ReactNode
}

export function CardHeader({
  title,
  icon,
  isStatic,
  action,
  children,
}: CardHeaderProps) {
  const context = useContext(CardContext)
  const collapsed = context?.collapsed ?? false
  const collapsible = context?.collapsible ?? false

  return (
    <div
      className={cn(
        styles.header,
        collapsed && styles.headerCollapsed,
        isStatic && styles.headerStatic,
      )}
    >
      <button
        type="button"
        className={styles.heading}
        onClick={() => context?.toggle()}
        disabled={!collapsible}
      >
        {icon ? <Icon icon={icon} width={18} /> : null}
        <span className={styles.title}>{children ?? title}</span>
        {collapsible ? (
          <Icon
            icon="chevron-down"
            width={16}
            className={cn(styles.chevron, collapsed && styles.chevronCollapsed)}
          />
        ) : null}
      </button>
      {action ? (
        <div
          className={styles.action}
          onClick={(event) => event.stopPropagation()}
        >
          {action}
        </div>
      ) : null}
    </div>
  )
}

export function CardContent({
  children,
  isStatic,
  className,
}: {
  children?: ReactNode
  isStatic?: boolean
  className?: string
}) {
  const context = useContext(CardContext)
  if (context?.collapsed) return null
  return (
    <div
      className={cn(
        styles.content,
        isStatic && styles.contentStatic,
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardFooter({ children }: { children?: ReactNode }) {
  const context = useContext(CardContext)
  if (context?.collapsed) return null
  return <div className={styles.footer}>{children}</div>
}
