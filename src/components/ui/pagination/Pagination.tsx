import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../button/Button'
import styles from './Pagination.module.scss'

type PaginationProps<T> = {
  data: T[]
  pageSize?: number
  onPageChange?: (page: T[], pageNumber: number) => void
}

export function Pagination<T>({
  data,
  pageSize = 20,
  onPageChange,
}: PaginationProps<T>) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  useEffect(() => {
    setPage((current) =>
      Math.min(current, Math.max(1, Math.ceil(data.length / pageSize))),
    )
  }, [data, pageSize])

  const safePage = Math.min(page, totalPages)

  const visiblePages = useMemo(() => {
    const maxVisible = 5
    if (totalPages <= maxVisible)
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2))
    let end = start + maxVisible - 1
    if (end > totalPages) {
      end = totalPages
      start = Math.max(1, end - maxVisible + 1)
    }
    return Array.from({ length: end - start + 1 }, (_, index) => start + index)
  }, [safePage, totalPages])

  const onPageChangeRef = useRef(onPageChange)
  onPageChangeRef.current = onPageChange

  useEffect(() => {
    const start = (safePage - 1) * pageSize
    onPageChangeRef.current?.(data.slice(start, start + pageSize), safePage)
  }, [data, pageSize, safePage])

  if (totalPages <= 1) return null

  const go = (next: number) => setPage(Math.min(totalPages, Math.max(1, next)))

  return (
    <div className={styles.pagination}>
      <Button text="First" disabled={safePage === 1} onClick={() => go(1)} />
      <Button
        shape="square"
        icon="chevron-left"
        disabled={safePage === 1}
        onClick={() => go(safePage - 1)}
      />
      <div className={styles.pages}>
        {visiblePages.map((pageNumber) => (
          <Button
            key={pageNumber}
            shape="square"
            text={String(pageNumber)}
            active={pageNumber === safePage}
            onClick={() => go(pageNumber)}
          />
        ))}
      </div>
      <Button
        shape="square"
        icon="chevron-right"
        disabled={safePage === totalPages}
        onClick={() => go(safePage + 1)}
      />
      <Button
        text="Last"
        disabled={safePage === totalPages}
        onClick={() => go(totalPages)}
      />
    </div>
  )
}
