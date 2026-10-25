import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Icon } from '../icon/Icon'
import styles from './Drawer.module.scss'
import { cn } from '@/lib/cn'

export type DrawerSide = 'bottom' | 'top' | 'left' | 'right'

type DrawerProps = {
  open: boolean
  onClose: () => void
  side?: DrawerSide
  showCloseButton?: boolean
  title?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  children?: ReactNode
}

export function Drawer({
  open,
  onClose,
  side = 'bottom',
  showCloseButton = false,
  title,
  description,
  footer,
  children,
}: DrawerProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={cn(styles.content, styles[side])}
          onPointerDownOutside={(event) => {
            event.preventDefault()
            onClose()
          }}
        >
          {side === 'bottom' ? <div className={styles.handle} /> : null}
          <div className={styles.panel}>
            <div className={styles.header}>
              <div className={styles.heading}>
                <Dialog.Title className={title ? styles.title : styles.srOnly}>
                  {title ?? 'Drawer'}
                </Dialog.Title>
                {description ? (
                  <Dialog.Description className={styles.description}>
                    {description}
                  </Dialog.Description>
                ) : null}
              </div>
              {showCloseButton ? (
                <Dialog.Close className={styles.close} aria-label="Close">
                  <Icon icon="x" width={18} />
                </Dialog.Close>
              ) : null}
            </div>
            {children ? <div className={styles.body}>{children}</div> : null}
            {footer ? <div className={styles.footer}>{footer}</div> : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
