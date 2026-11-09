import { useSyncExternalStore } from 'react'
import { getTheme, setTheme, subscribeToTheme, type Theme } from '@/lib/theme'

const getServerSnapshot = (): Theme => 'light'

/** The active colour mode and a setter. Shared by the header toggle and the /brand reference. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerSnapshot)
  return { theme, setTheme } as const
}
