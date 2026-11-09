import { BrowserRouter } from 'react-router'
import { MotionProvider } from '@/components/motion'
import { AppRoutes } from './AppRoutes'

/**
 * Declarative routing (BrowserRouter) on purpose: ~13 KB gzip vs ~31 KB for the data router.
 * A marketing site needs no loaders/actions. Revisit if routes start fetching data.
 */
export function App() {
  return (
    <MotionProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </MotionProvider>
  )
}
