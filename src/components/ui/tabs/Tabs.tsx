import {
  Children,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/cn'
import styles from './Tabs.module.scss'

type TabProps = {
  value: string
  title: string
  children?: ReactNode
}

export function Tab(_props: TabProps) {
  return null
}

export type TabsVariant = 'default' | 'underline'

type TabsProps = {
  group?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  variant?: TabsVariant
  actions?: ReactNode
  children: ReactNode
}

function isTabElement(node: ReactNode): node is ReactElement<TabProps> {
  return isValidElement(node) && node.type === Tab
}

function clipInset(top: number, right: number, bottom: number, left: number) {
  return `inset(${top}px ${right}px ${bottom}px ${left}px round 500px)`
}

export function Tabs({
  group,
  value,
  defaultValue,
  onValueChange,
  variant = 'default',
  actions,
  children,
}: TabsProps) {
  const tabs = useMemo(
    () => Children.toArray(children).filter(isTabElement),
    [children],
  )
  const storageKey = group ? `compass-tab:${group}` : null
  const first = tabs[0]?.props.value ?? ''

  const [internal, setInternal] = useState(() => {
    if (value) return value
    if (storageKey) {
      const stored = localStorage.getItem(storageKey)
      if (stored && tabs.some((tab) => tab.props.value === stored))
        return stored
    }
    return defaultValue ?? first
  })

  const current = value ?? internal
  const underline = variant === 'underline'
  const listRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const readyRef = useRef(false)

  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, current)
  }, [storageKey, current])

  useLayoutEffect(() => {
    const list = listRef.current
    const fill = fillRef.current
    if (!list || !fill) return

    const update = () => {
      const active = list.querySelector<HTMLElement>('[data-state="active"]')
      if (!active) return

      if (underline) {
        const left = active.offsetLeft
        const width = active.offsetWidth
        const hidden =
          left + width <= list.scrollLeft ||
          left >= list.scrollLeft + list.clientWidth
        fill.style.width = hidden ? '0px' : `${width}px`
        fill.style.transform = `translateX(${left}px)`
        return
      }

      const listBox = list.getBoundingClientRect()
      const activeBox = active.getBoundingClientRect()
      const left = activeBox.left - listBox.left
      const rightEdge = activeBox.right - listBox.left
      if (rightEdge <= 0 || left >= listBox.width) {
        fill.style.clipPath = 'inset(0 100% 0 0 round 500px)'
        return
      }

      const top = Math.max(0, activeBox.top - listBox.top)
      const bottom = Math.max(0, listBox.bottom - activeBox.bottom)
      fill.style.clipPath = clipInset(
        top,
        Math.max(0, listBox.width - rightEdge),
        bottom,
        Math.max(0, left),
      )
    }

    if (!readyRef.current) fill.style.transition = 'none'
    update()
    if (!readyRef.current) {
      fill.getBoundingClientRect()
      fill.style.transition = ''
      readyRef.current = true
    }

    const onScroll = () => {
      fill.style.transition = 'none'
      update()
      requestAnimationFrame(() => {
        fill.style.transition = ''
      })
    }

    const observer = new ResizeObserver(update)
    observer.observe(list)
    for (const tab of list.querySelectorAll<HTMLElement>('[role="tab"]'))
      observer.observe(tab)
    list.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      list.removeEventListener('scroll', onScroll)
    }
  }, [current, tabs, underline])

  const setValue = (next: string) => {
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  return (
    <TabsPrimitive.Root
      className={styles.root}
      value={current}
      onValueChange={setValue}
    >
      <div className={cn(styles.bar, underline && styles.barUnderline)}>
        <TabsPrimitive.List
          ref={listRef}
          className={cn(styles.list, underline && styles.listUnderline)}
        >
          {tabs.map((tab) => (
            <TabsPrimitive.Trigger
              key={tab.props.value}
              className={cn(
                styles.trigger,
                underline && styles.triggerUnderline,
              )}
              value={tab.props.value}
            >
              <span>{tab.props.title}</span>
            </TabsPrimitive.Trigger>
          ))}
          {underline ? (
            <div
              ref={fillRef}
              className={styles.indicator}
              aria-hidden="true"
            />
          ) : (
            <div className={styles.clip} aria-hidden="true">
              <div ref={fillRef} className={styles.fill}>
                <div className={styles.overlay}>
                  {tabs.map((tab) => (
                    <span key={tab.props.value} className={styles.overlayItem}>
                      <span>{tab.props.title}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </TabsPrimitive.List>
        {actions ? (
          <div
            className={cn(styles.actions, underline && styles.actionsUnderline)}
          >
            {actions}
          </div>
        ) : null}
      </div>
      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.props.value}
          className={styles.content}
          value={tab.props.value}
        >
          {tab.props.children}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}
