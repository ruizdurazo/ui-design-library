import type { ReactNode } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import styles from './Tooltip.module.scss'

type Side = 'top' | 'right' | 'bottom' | 'left'

type TooltipProps = {
  content: ReactNode
  placement?: Side
  delayDuration?: number
  children: ReactNode
}

export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={200} skipDelayDuration={200}>
      {children}
    </TooltipPrimitive.Provider>
  )
}

export function Tooltip({
  content,
  placement = 'top',
  delayDuration = 200,
  children,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className={styles.content}
          side={placement}
          sideOffset={5}
        >
          {content}
          <TooltipPrimitive.Arrow
            className={styles.arrow}
            width={10}
            height={5}
          />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
