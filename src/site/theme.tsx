import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type ThemeChoice = 'system' | 'light' | 'dark'

type ThemeContextValue = {
  choice: ThemeChoice
  setChoice: (choice: ThemeChoice) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function resolve(choice: ThemeChoice) {
  if (choice === 'light' || choice === 'dark') return choice
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function apply(choice: ThemeChoice) {
  const theme = resolve(choice)
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  localStorage.setItem('compass-theme-choice', choice)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(() => {
    const stored = localStorage.getItem('compass-theme-choice')
    if (stored === 'light' || stored === 'dark' || stored === 'system')
      return stored
    return 'system'
  })

  useEffect(() => {
    apply(choice)
    if (choice !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply('system')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [choice])

  return (
    <ThemeContext.Provider value={{ choice, setChoice: setChoiceState }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
