import { createContext, useContext, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { cn } from '@/lib/cn'
import { Icon } from '../icon/Icon'
import styles from './NavigationMenu.module.scss'

const DepthContext = createContext<'root' | 'sub'>('root')

type NavigationMenuRootProps = Omit<
  NavigationMenuPrimitive.NavigationMenuProps,
  'orientation'
>

export function NavigationMenu({
  className,
  children,
  ...props
}: NavigationMenuRootProps) {
  return (
    <DepthContext.Provider value="root">
      <NavigationMenuPrimitive.Root
        {...props}
        className={cn(styles.root, className)}
      >
        {children}
        <div className={styles.viewportPosition}>
          <NavigationMenuPrimitive.Viewport className={styles.viewport} />
        </div>
      </NavigationMenuPrimitive.Root>
    </DepthContext.Provider>
  )
}

type NavigationMenuSubProps = Omit<
  NavigationMenuPrimitive.NavigationMenuSubProps,
  'orientation'
>

export function NavigationMenuSub({
  className,
  children,
  ...props
}: NavigationMenuSubProps) {
  return (
    <DepthContext.Provider value="sub">
      <NavigationMenuPrimitive.Sub
        {...props}
        className={cn(styles.sub, className)}
      >
        {children}
      </NavigationMenuPrimitive.Sub>
    </DepthContext.Provider>
  )
}

export function NavigationMenuList({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.NavigationMenuListProps) {
  const depth = useContext(DepthContext)
  return (
    <NavigationMenuPrimitive.List
      className={cn(styles.list, depth === 'sub' && styles.listSub, className)}
      {...props}
    >
      {children}
      {depth === 'root' ? (
        <NavigationMenuPrimitive.Indicator className={styles.indicator}>
          <div className={styles.arrow} />
        </NavigationMenuPrimitive.Indicator>
      ) : null}
    </NavigationMenuPrimitive.List>
  )
}

export function NavigationMenuItem({
  className,
  ...props
}: NavigationMenuPrimitive.NavigationMenuItemProps) {
  return (
    <NavigationMenuPrimitive.Item
      className={cn(styles.item, className)}
      {...props}
    />
  )
}

export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.NavigationMenuTriggerProps) {
  const depth = useContext(DepthContext)
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(
        styles.trigger,
        depth === 'sub' && styles.triggerSub,
        className,
      )}
      {...props}
    >
      {children}
      {depth === 'root' ? (
        <Icon icon="chevron-down" width={14} className={styles.caret} />
      ) : null}
    </NavigationMenuPrimitive.Trigger>
  )
}

export type NavigationMenuLayout = 'grid' | 'stack'

export function NavigationMenuContent({
  className,
  layout,
  ...props
}: NavigationMenuPrimitive.NavigationMenuContentProps & {
  layout?: NavigationMenuLayout
}) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        styles.content,
        layout === 'grid' && styles.grid,
        layout === 'stack' && styles.stack,
        className,
      )}
      {...props}
    />
  )
}

type NavigationMenuLinkProps = {
  href: string
  active?: boolean
  title?: string
  description?: string
  icon?: string
  className?: string
  children?: ReactNode
  onSelect?: (event: Event) => void
}

function linkKind(href: string) {
  if (href === '' || href === '#') return 'placeholder'
  if (/^(https?:|mailto:|tel:)/.test(href)) return 'external'
  return 'router'
}

export function NavigationMenuLink({
  href,
  active,
  title,
  description,
  icon,
  className,
  children,
  onSelect,
}: NavigationMenuLinkProps) {
  const rich = title != null || description != null
  const classes = cn(rich ? styles.linkCard : styles.link, className)
  const body =
    title != null || description != null ? (
      <>
        {icon ? (
          <Icon icon={icon} width={16} className={styles.linkIcon} />
        ) : null}
        <span className={styles.linkCopy}>
          {title ? <span className={styles.linkTitle}>{title}</span> : null}
          {description ? (
            <span className={styles.linkDescription}>{description}</span>
          ) : null}
        </span>
      </>
    ) : (
      children
    )

  const kind = linkKind(href)

  if (kind === 'router') {
    return (
      <NavigationMenuPrimitive.Link asChild active={active} onSelect={onSelect}>
        <Link className={classes} to={href}>
          {body}
        </Link>
      </NavigationMenuPrimitive.Link>
    )
  }

  return (
    <NavigationMenuPrimitive.Link asChild active={active} onSelect={onSelect}>
      <a
        className={classes}
        href={kind === 'placeholder' ? '#' : href}
        target={kind === 'external' ? '_blank' : undefined}
        rel={kind === 'external' ? 'noreferrer' : undefined}
        onClick={
          kind === 'placeholder' ? (event) => event.preventDefault() : undefined
        }
      >
        {body}
      </a>
    </NavigationMenuPrimitive.Link>
  )
}
