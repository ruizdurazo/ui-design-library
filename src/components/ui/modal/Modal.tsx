import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Icon } from '../icon/Icon'
import styles from './Modal.module.scss'
import { cn } from '@/lib/cn'

type ModalProps = {
  open: boolean
  onClose: () => void
  wide?: boolean
  width?: number
  title?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  children?: ReactNode
}

export function Modal({
  open,
  onClose,
  wide,
  width = 600,
  title,
  header,
  footer,
  children,
}: ModalProps) {
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
          className={cn(styles.content, wide && styles.wide)}
          style={
            wide ? undefined : { width: `min(${width}px, calc(100% - 20px))` }
          }
          onPointerDownOutside={(event) => {
            event.preventDefault()
            onClose()
          }}
        >
          <div className={styles.header}>
            {title ? (
              <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            ) : (
              <Dialog.Title className={styles.srOnly}>Dialog</Dialog.Title>
            )}
            {header}
            <Dialog.Close className={styles.close} aria-label="Close">
              <Icon icon="x" width={18} />
            </Dialog.Close>
          </div>
          <div className={styles.body}>{children}</div>
          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
