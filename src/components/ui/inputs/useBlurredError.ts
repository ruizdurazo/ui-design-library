import { useState } from 'react'

/**
 * Keep a field in its default state until blur.
 * After an error is shown, later value changes update or clear it immediately.
 * A valid value leaves that state, so the next failure waits for blur again.
 */
export function useBlurredError(issue: string | null) {
  const [active, setActive] = useState(false)
  if (active && !issue) setActive(false)

  const reveal = (next: string | null = issue) => {
    if (next) setActive(true)
  }

  return { error: active ? issue : null, reveal }
}
