/**
 * Build-time entry: renders one route to HTML so every page ships its content in the static file
 * (search engines and link previews read it without running JS). Used only by scripts/vite-plugin-seo.ts;
 * the browser entry is main.tsx, which hydrates this markup.
 *
 * The tree mirrors <App /> with a StaticRouter in place of BrowserRouter — keep the two in sync, or
 * hydration falls back to a full client render.
 */
import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import { AppRoutes } from '@/app/AppRoutes'
import { MotionProvider } from '@/components/motion'

/** HTML for the app at `path`, with every lazy route and section rendered inline. */
export async function renderPage(path: string): Promise<string> {
  const { prelude } = await prerender(
    <StrictMode>
      <MotionProvider>
        <StaticRouter location={path}>
          <AppRoutes />
        </StaticRouter>
      </MotionProvider>
    </StrictMode>,
    // React otherwise moves large Suspense boundaries (every lazy route and section) to the end of the
    // document behind a fallback, revealed by an inline script — invisible to crawlers that don't run JS.
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  )
  return new Response(prelude).text()
}
