import { useEffect, useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useNavigate } from 'react-router-dom'
import { pages, sections } from './nav'
import styles from './SearchDialog.module.scss'
import { cn } from '@/lib/cn'

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return pages
    return pages.filter((page) =>
      `${page.title} ${page.description ?? ''}`.toLowerCase().includes(needle),
    )
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
    }
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  const go = (path: string) => {
    onOpenChange(false)
    navigate(path)
  }

  const sectionOf = (path: string) =>
    sections.find((section) => section.items.some((item) => item.path === path))
      ?.title

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.content}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setActive((index) => Math.min(results.length - 1, index + 1))
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActive((index) => Math.max(0, index - 1))
            }
            if (event.key === 'Enter' && results[active]) {
              event.preventDefault()
              go(results[active].path)
            }
          }}
        >
          <Dialog.Title className={styles.srOnly}>
            Search the design system
          </Dialog.Title>
          <input
            className={styles.input}
            autoFocus
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className={styles.list}>
            {results.length === 0 ? (
              <div className={styles.empty}>No matches</div>
            ) : null}
            {results.map((page, index) => (
              <button
                key={page.path}
                type="button"
                className={cn(
                  styles.item,
                  index === active && styles.itemActive,
                )}
                onMouseEnter={() => setActive(index)}
                onClick={() => go(page.path)}
              >
                <span>{page.title}</span>
                <span>{sectionOf(page.path) ?? 'Introduction'}</span>
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
