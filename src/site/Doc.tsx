import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '@/components/ui'
import { pages } from './nav'
import styles from './Doc.module.scss'

export function Doc({
  title,
  lede,
  children,
}: {
  title: string
  lede?: string
  children: ReactNode
}) {
  const { pathname } = useLocation()
  const index = pages.findIndex((page) => page.path === pathname)
  const previous = index > 0 ? pages[index - 1] : null
  const next = index >= 0 && index < pages.length - 1 ? pages[index + 1] : null

  return (
    <div className={styles.page}>
      <div className={styles.column}>
        <header className={styles.header}>
          <h1>{title}</h1>
          {lede ? <p>{lede}</p> : null}
        </header>
        <div className={styles.rule} role="separator" />
        <div className={styles.sections}>{children}</div>
        <nav className={styles.pager}>
          {previous ? (
            <Link to={previous.path}>
              <Icon icon="chevron-left" width={16} />
              <span className={styles.pagerCopy}>
                <span className={styles.kicker}>Previous</span>
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={next.path} className={styles.next}>
              <span className={styles.pagerCopy}>
                <span className={styles.kicker}>Next</span>
                {next.title}
              </span>
              <Icon icon="chevron-right" width={16} />
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  )
}

export function Section({
  title,
  children,
  code,
  align = 'center',
  direction = 'row',
}: {
  title: string
  children: ReactNode
  code?: string
  align?: 'center' | 'start'
  direction?: 'row' | 'column'
}) {
  const [open, setOpen] = useState(false)
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2>{title}</h2>
        {code ? (
          <button type="button" onClick={() => setOpen((value) => !value)}>
            {open ? 'Hide code' : 'Show code'}
          </button>
        ) : null}
      </div>
      <div className={styles.stage}>
        <div
          className={[
            align === 'start' ? styles.stageStart : styles.stageInner,
            direction === 'column' ? styles.stageColumn : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
      </div>
      {open && code ? <pre className={styles.code}>{code}</pre> : null}
    </section>
  )
}
