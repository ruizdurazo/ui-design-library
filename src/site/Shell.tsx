import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button, Icon, ToggleButton } from '@/components/ui'
import { pages, sections } from './nav'
import { SearchDialog } from './SearchDialog'
import { useTheme } from './theme'
import styles from './Shell.module.scss'
import { cn } from '@/lib/cn'

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  )
}

export function Shell({ children }: { children: ReactNode }) {
  const { choice, setChoice } = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
        return
      }

      if (
        event.repeat ||
        !event.shiftKey ||
        event.altKey ||
        event.metaKey ||
        event.ctrlKey
      )
        return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      if (searchOpen || isTyping(event.target)) return
      if (
        document.querySelector(
          '[role="dialog"], [role="menu"], [role="listbox"]',
        )
      )
        return

      const index = pages.findIndex((page) => page.path === pathname)
      if (index < 0) return
      const destination =
        event.key === 'ArrowLeft' ? pages[index - 1] : pages[index + 1]
      if (!destination) return

      event.preventDefault()
      setNavOpen(false)
      navigate(destination.path)
      document.getElementById('main')?.scrollTo({ top: 0 })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, pathname, searchOpen])

  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      {navOpen ? (
        <button
          className={styles.backdrop}
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      ) : null}
      <aside className={cn(styles.sidebar, navOpen && styles.sidebarOpen)}>
        <div className={styles.brandRow}>
          <NavLink to="/" onClick={() => setNavOpen(false)}>
            UI Design Library
          </NavLink>
        </div>
        <Button
          className={styles.search}
          fullWidth
          align="start"
          icon="search"
          text="Search"
          onClick={() => setSearchOpen(true)}
        >
          <kbd className={styles.kbd}>⌘K</kbd>
        </Button>
        <nav className={styles.nav}>
          {sections.map((section) => (
            <div key={section.title ?? 'intro'}>
              {section.title ? (
                <div className={styles.group}>{section.title}</div>
              ) : null}
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    cn(styles.link, isActive && styles.active)
                  }
                  onClick={() => setNavOpen(false)}
                >
                  {item.title}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className={styles.footer}>
          <ToggleButton
            className={styles.theme}
            size="small"
            value={choice}
            onValueChange={(value) =>
              setChoice(value as 'system' | 'light' | 'dark')
            }
            options={[
              { label: 'System', value: 'system' },
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
            ]}
          />
        </div>
      </aside>
      <div className={styles.canvas}>
        <div className={styles.mobileBar}>
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setNavOpen(true)}
          >
            <Icon icon="menu" width={18} />
          </button>
          <span>UI Design Library</span>
        </div>
        <main id="main" className={styles.main} tabIndex={-1}>
          {children}
        </main>
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}
