import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { protectMedia } from '@/lib/protectMedia'
import '@/styles/fonts'
import '@/styles/index.css'

protectMedia()

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root not found in index.html')
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Built pages arrive prerendered (src/entry-server.tsx) and are hydrated; the dev server serves an empty root.
if (rootElement.hasChildNodes()) hydrateRoot(rootElement, app)
else createRoot(rootElement).render(app)
