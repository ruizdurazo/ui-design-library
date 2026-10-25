import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import styles from './fields.module.scss'

/** Matches the error opacity and margin transitions in fields.module.scss. */
const ERROR_MOTION_MS = 200

function errorMotionMs() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0
  return ERROR_MOTION_MS
}

export function FieldError({
  message,
  id,
}: {
  message: string | null
  id?: string
}) {
  const [retained, setRetained] = useState(message)
  const [revealed, setRevealed] = useState(false)
  const text = message ?? retained
  const shown = Boolean(message) && revealed
  const textRef = useRef(text)
  textRef.current = text

  useEffect(() => {
    if (message) {
      setRetained(message)
      const frame = requestAnimationFrame(() => setRevealed(true))
      return () => cancelAnimationFrame(frame)
    }

    if (!textRef.current) return
    const timeout = window.setTimeout(() => {
      setRetained(null)
      setRevealed(false)
    }, errorMotionMs())
    return () => window.clearTimeout(timeout)
  }, [message])

  if (!text) return null

  return (
    <span
      className={cn(styles.error, shown && styles.shown)}
      id={id}
      aria-hidden={message ? undefined : true}
    >
      {text}
    </span>
  )
}
