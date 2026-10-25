import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import styles from './ConfirmDialog.module.scss'

type ConfirmRequest = {
  title: string
  message: string
}

type ConfirmContextValue = {
  confirm: (request: ConfirmRequest) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context)
    throw new Error('useConfirm must be used within ConfirmProvider')
  return context.confirm
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ConfirmRequest | null>(null)
  const [open, setOpen] = useState(false)
  const resolver = useRef<((value: boolean) => void) | null>(null)
  const settled = useRef(false)

  const confirm = useCallback((next: ConfirmRequest) => {
    settled.current = false
    setRequest(next)
    setOpen(true)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  const settle = (value: boolean) => {
    if (settled.current) return
    settled.current = true
    resolver.current?.(value)
    resolver.current = null
    setOpen(false)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AlertDialog.Root
        open={open}
        onOpenChange={(next) => {
          if (!next) settle(false)
        }}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className={styles.overlay} />
          <AlertDialog.Content className={styles.content}>
            <AlertDialog.Title className={styles.title}>
              {request?.title}
            </AlertDialog.Title>
            <AlertDialog.Description className={styles.description}>
              {request?.message}
            </AlertDialog.Description>
            <div className={styles.footer}>
              <AlertDialog.Cancel
                className={styles.cancel}
                onClick={() => settle(false)}
              >
                Cancel
              </AlertDialog.Cancel>
              <AlertDialog.Action
                className={styles.action}
                onClick={(event) => {
                  event.preventDefault()
                  settle(true)
                }}
              >
                Confirm
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </ConfirmContext.Provider>
  )
}
