import { useLayoutEffect, useRef } from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { cn } from '@/lib/cn'
import { Icon } from '../icon/Icon'
import styles from './ToggleButton.module.scss'

export type ToggleOption = {
  label: string
  value: string
  icon?: string
  className?: string
}

type ToggleButtonProps = {
  options: ToggleOption[]
  value?: string
  onValueChange?: (value: string) => void
  size?: 'default' | 'small'
  className?: string
}

function OptionLabel({
  option,
  size,
}: {
  option: ToggleOption
  size: 'default' | 'small'
}) {
  return (
    <>
      {option.icon ? (
        <Icon icon={option.icon} width={size === 'small' ? 14 : 16} />
      ) : null}
      {option.label}
    </>
  )
}

function clipInset(
  top: number,
  right: number,
  bottom: number,
  left: number,
  radius: number,
) {
  return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`
}

export function ToggleButton({
  options,
  value,
  onValueChange,
  size = 'default',
  className,
}: ToggleButtonProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const readyRef = useRef(false)

  useLayoutEffect(() => {
    const root = rootRef.current
    const border = borderRef.current
    const fill = fillRef.current
    if (!root || !border || !fill) return

    const update = () => {
      const active = root.querySelector<HTMLElement>('[data-state="on"]')
      if (!active) return

      const rootBox = root.getBoundingClientRect()
      const activeBox = active.getBoundingClientRect()
      const left = Math.max(0, activeBox.left - rootBox.left)
      const top = Math.max(0, activeBox.top - rootBox.top)
      const right = Math.max(0, rootBox.right - activeBox.right)
      const bottom = Math.max(0, rootBox.bottom - activeBox.bottom)

      border.style.clipPath = clipInset(top, right, bottom, left, 40)
      fill.style.clipPath = clipInset(
        top + 1,
        right + 1,
        bottom + 1,
        left + 1,
        39,
      )
    }

    if (!readyRef.current) {
      border.style.transition = 'none'
      fill.style.transition = 'none'
    }
    update()
    if (!readyRef.current) {
      border.getBoundingClientRect()
      border.style.transition = ''
      fill.style.transition = ''
      readyRef.current = true
    }

    const observer = new ResizeObserver(update)
    observer.observe(root)
    return () => observer.disconnect()
  }, [value, options, size])

  return (
    <ToggleGroup.Root
      ref={rootRef}
      className={cn(styles.root, size === 'small' && styles.small, className)}
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange?.(next)
      }}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          className={cn(styles.item, option.className)}
          value={option.value}
        >
          <OptionLabel option={option} size={size} />
        </ToggleGroup.Item>
      ))}
      <div className={styles.clip} aria-hidden="true">
        <div ref={borderRef} className={cn(styles.plate, styles.border)} />
        <div ref={fillRef} className={cn(styles.plate, styles.fill)}>
          <div className={styles.overlay}>
            {options.map((option) => (
              <span
                key={option.value}
                className={cn(styles.overlayItem, option.className)}
              >
                <OptionLabel option={option} size={size} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </ToggleGroup.Root>
  )
}
