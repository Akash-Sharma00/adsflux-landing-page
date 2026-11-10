/**
 * Colour mode (light / dark) — a tiny external store around `<html data-theme>`.
 *
 * First paint is handled by the inline bootstrap script in index.html, which runs before CSS and React and
 * sets the attribute from the saved preference, else light. Keep THEME_STORAGE_KEY and the resolution
 * rules in sync with that script.
 *
 * Preference model: no saved value → light (the OS setting is ignored). Choosing dark saves it; choosing
 * light clears the saved value, since light is the default.
 */
export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'adsflux-theme'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark'

/** Storage can throw (privacy modes, blocked site data) — the theme then simply isn't remembered. */
function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(value) ? value : null
  } catch {
    return null
  }
}

function writeStoredTheme(theme: Theme | null) {
  try {
    if (theme) window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    else window.localStorage.removeItem(THEME_STORAGE_KEY)
  } catch {
    // Not persisted; the choice still applies for this page view.
  }
}

export const DEFAULT_THEME: Theme = 'light'

/** The mode currently painted (set on <html> by the bootstrap script before first render). */
export function getTheme(): Theme {
  const value = document.documentElement.dataset.theme
  return isTheme(value) ? value : 'light'
}

/** Mobile browser chrome follows the page background token, so no colour is duplicated here. */
function syncThemeColorMeta() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  const background = getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
  if (meta && background) meta.content = background
}

const listeners = new Set<() => void>()

function applyTheme(theme: Theme) {
  if (getTheme() === theme) return
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  syncThemeColorMeta()
  listeners.forEach((listener) => listener())
}

/**
 * A short cross-fade (View Transitions API) instead of transitioning every colour property: one composited
 * animation, no clash with component transitions. Instant where unsupported or under reduced motion.
 */
function applyThemeWithTransition(theme: Theme) {
  const canAnimate =
    typeof document.startViewTransition === 'function' && !window.matchMedia(REDUCED_MOTION_QUERY).matches
  if (canAnimate) document.startViewTransition(() => applyTheme(theme))
  else applyTheme(theme)
}

/** Saves an explicit choice (or clears it when it is the default) and applies it. */
export function setTheme(theme: Theme) {
  writeStoredTheme(theme === DEFAULT_THEME ? null : theme)
  applyThemeWithTransition(theme)
}

const resolveTheme = () => readStoredTheme() ?? DEFAULT_THEME

/** Follows choices made in other tabs. */
const handleStorage = (event: StorageEvent) => {
  if (event.key === THEME_STORAGE_KEY || event.key === null) applyTheme(resolveTheme())
}

/** useSyncExternalStore-compatible subscription. Global listeners attach once, for the first subscriber. */
export function subscribeToTheme(listener: () => void) {
  if (listeners.size === 0) {
    window.addEventListener('storage', handleStorage)
  }
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener('storage', handleStorage)
    }
  }
}
