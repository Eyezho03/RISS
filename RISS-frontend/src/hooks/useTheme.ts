import { useState, useEffect } from 'react'

type Theme = 'dark' | 'light'

/**
 * useTheme Hook
 * Manages dark/light theme toggle
 * Stores preference in localStorage
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored && (stored === 'dark' || stored === 'light')) {
      return stored
    }
    // Default to dark (Cyber-Noir)
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light')
    } else {
      root.setAttribute('data-theme', 'dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = (): void => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return {
    theme,
    toggleTheme,
    setTheme,
  }
}

