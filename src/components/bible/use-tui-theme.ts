'use client'

import { useState, useEffect, useCallback } from 'react'

export type TuiThemeName = 'cyan' | 'amber' | 'matrix' | 'monokai'

export interface TuiTheme {
  name: TuiThemeName
  label: string
  fg: string
  bg: string
  border: string
  muted: string
  glow: string
  secondaryFg: string
  cardBg: string
}

export const TUI_THEMES: Record<TuiThemeName, TuiTheme> = {
  cyan: {
    name: 'cyan',
    label: 'Cyberpunk Slate & Neon Cyan',
    fg: '#00f0ff',
    secondaryFg: '#34d399',
    bg: '#070a0f',
    cardBg: '#0d1522',
    border: '#00f0ff40',
    muted: '#00f0ff80',
    glow: '0 0 15px rgba(0, 240, 255, 0.25)',
  },
  amber: {
    name: 'amber',
    label: 'VT100 Amber Phosphor',
    fg: '#ffb000',
    secondaryFg: '#fb923c',
    bg: '#0c0900',
    cardBg: '#150e00',
    border: '#ffb00040',
    muted: '#ffb00080',
    glow: '0 0 15px rgba(255, 176, 0, 0.25)',
  },
  matrix: {
    name: 'matrix',
    label: 'Hacker Green',
    fg: '#00ff66',
    secondaryFg: '#a3e635',
    bg: '#020b04',
    cardBg: '#031408',
    border: '#00ff6640',
    muted: '#00ff6680',
    glow: '0 0 15px rgba(0, 255, 102, 0.25)',
  },
  monokai: {
    name: 'monokai',
    label: 'Monokai Pro',
    fg: '#ffd866',
    secondaryFg: '#ff6188',
    bg: '#2d2a2e',
    cardBg: '#403c40',
    border: '#ffd86640',
    muted: '#ffd86680',
    glow: '0 0 15px rgba(255, 216, 102, 0.25)',
  },
}

export const THEME_STORAGE_KEY = 'bible_tui_theme'
export const THEME_LIST: TuiThemeName[] = ['cyan', 'amber', 'matrix', 'monokai']

export function useTuiTheme(defaultTheme: TuiThemeName = 'cyan') {
  const [theme, setThemeState] = useState<TuiThemeName>(defaultTheme)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as TuiThemeName | null
      if (savedTheme && THEME_LIST.includes(savedTheme)) {
        setThemeState(savedTheme)
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const setTheme = useCallback((newTheme: TuiThemeName) => {
    if (!THEME_LIST.includes(newTheme)) return false
    setThemeState(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch {
      // Ignore localStorage errors
    }
    return true
  }, [])

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const currentIndex = THEME_LIST.indexOf(current)
      const nextIndex = (currentIndex + 1) % THEME_LIST.length
      const nextTheme = THEME_LIST[nextIndex]
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
      } catch {
        // Ignore localStorage errors
      }
      return nextTheme
    })
  }, [])

  return {
    theme,
    themeConfig: TUI_THEMES[theme],
    setTheme,
    cycleTheme,
    isLoaded,
    themes: TUI_THEMES,
    themeList: THEME_LIST,
  }
}
