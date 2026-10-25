import type { ReactNode } from 'react'
import * as Menu from '@radix-ui/react-context-menu'
import { Icon } from '../icon/Icon'
import type { MenuOption } from './DropdownMenu'
import styles from './DropdownMenu.module.scss'

type ContextMenuProps = {
  options: MenuOption[]
  disabled?: boolean
  onSelect?: (option: MenuOption) => void
  children: ReactNode
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

export function ContextMenu({
  options,
  disabled = false,
  onSelect,
  children,
}: ContextMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild disabled={disabled}>
        {children}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content className={styles.content}>
          <Options options={options} onSelect={onSelect} />
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
}
