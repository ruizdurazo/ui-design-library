import type { ReactNode } from 'react'
import * as Menu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/cn'
import { Icon } from '../icon/Icon'
import styles from './DropdownMenu.module.scss'

export type MenuOption = {
  key: string
  label?: string
  icon?: string
  type?: 'item' | 'label'
  disabled?: boolean
  separator?: boolean
  shortcut?: string
  options?: MenuOption[]
}

type DropdownMenuProps = {
  options: MenuOption[]
  title?: string
  icon?: string
  iconSize?: number
  iconFirst?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  onSelect?: (option: MenuOption) => void
  children?: ReactNode
}

function Options({
  options,
  onSelect,
}: {
  options: MenuOption[]
  onSelect?: (option: MenuOption) => void
}) {
  return (
    <>
      {options
        .filter((option) => option && typeof option.key === 'string')
        .map((option) => {
          if (option.separator) {
            return (
              <Menu.Separator key={option.key} className={styles.separator} />
            )
          }
          if (option.type === 'label') {
            return (
              <Menu.Label key={option.key} className={styles.label}>
                {option.icon ? <Icon icon={option.icon} width={16} /> : null}
                {option.label}
              </Menu.Label>
            )
          }
          if (option.options && option.options.length > 0) {
            return (
              <Menu.Sub key={option.key}>
                <Menu.SubTrigger
                  className={styles.item}
                  disabled={option.disabled}
                >
                  {option.icon ? <Icon icon={option.icon} width={16} /> : null}
                  <span>{option.label}</span>
                  <span className={styles.right}>
                    {option.shortcut}
                    <Icon icon="chevron-right" width={16} />
                  </span>
                </Menu.SubTrigger>
                <Menu.Portal>
                  <Menu.SubContent
                    className={styles.content}
                    sideOffset={2}
                    alignOffset={-5}
                  >
                    <Options options={option.options} onSelect={onSelect} />
                  </Menu.SubContent>
                </Menu.Portal>
              </Menu.Sub>
            )
          }
          return (
            <Menu.Item
              key={option.key}
              className={styles.item}
              disabled={option.disabled}
              onSelect={() => onSelect?.(option)}
            >
              {option.icon ? <Icon icon={option.icon} width={16} /> : null}
              <span>{option.label}</span>
              {option.shortcut ? (
                <span className={styles.right}>{option.shortcut}</span>
              ) : null}
            </Menu.Item>
          )
        })}
    </>
  )
}

export function DropdownMenu({
  options,
  title,
  icon = 'more-horizontal',
  iconSize = 16,
  iconFirst = false,
  side,
  sideOffset = 5,
  align = 'start',
  alignOffset = -10,
  onSelect,
  children,
}: DropdownMenuProps) {
  const iconOnly = !title && !children
  return (
    <Menu.Root>
      <Menu.Trigger className={cn(styles.trigger, iconOnly && styles.iconOnly)}>
        {children ?? (
          <>
            {iconFirst && icon ? <Icon icon={icon} width={iconSize} /> : null}
            {title ? <span>{title}</span> : null}
            {!iconFirst && icon ? <Icon icon={icon} width={iconSize} /> : null}
          </>
        )}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          className={styles.content}
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
        >
          <Options options={options} onSelect={onSelect} />
          <Menu.Arrow className={styles.arrow} />
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
}
