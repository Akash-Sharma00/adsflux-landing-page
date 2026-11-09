import { useEffect } from 'react'
import type { HeadTag, PageSeoKey } from '@/config/seo'

type PageHeadProps = {
  page: PageSeoKey
}

/** Marks tags owned by PageHead (and by the build plugin's static copy of them) so they can be swapped. */
const MANAGED_ATTRIBUTE = 'data-seo'

function createElement({ tag, attributes, content }: HeadTag): HTMLElement {
  const element = document.createElement(tag)
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value)
  element.setAttribute(MANAGED_ATTRIBUTE, '')
  if (content !== undefined) element.textContent = content
  return element
}

/**
 * Title, description, canonical, Open Graph and JSON-LD for the current page (metadata: src/config/seo.ts).
 *
 * The build already writes each route's tags into its static HTML (what crawlers and link-preview bots read),
 * so this only matters after client-side navigation — which is why the metadata is loaded lazily, off the
 * initial-JS budget. Tags are replaced in place rather than rendered as React 19 <meta>, which would
 * duplicate the static ones.
 */
export function PageHead({ page }: PageHeadProps) {
  useEffect(() => {
    let isCurrent = true
    import('@/config/seo')
      .then(({ buildHeadTags, getPageSeo }) => {
        if (!isCurrent) return
        document.title = getPageSeo(page).title
        for (const element of document.head.querySelectorAll(`[${MANAGED_ATTRIBUTE}]:not(title)`)) element.remove()
        document.head.append(...buildHeadTags(page).map(createElement))
      })
      .catch((error: unknown) => console.error('PageHead: could not load page metadata', error))
    return () => {
      isCurrent = false
    }
  }, [page])

  return null
}
