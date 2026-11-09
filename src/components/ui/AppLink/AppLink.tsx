import type { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router'

export type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

const isInternalRoute = (href: string) => href.startsWith('/') && !href.startsWith('//')
const isExternal = (href: string) => /^https?:\/\//.test(href)

/**
 * The one link component. Internal paths use client-side routing, external URLs open in a
 * new tab safely, and everything else (#hash, mailto:, tel:) renders a plain anchor.
 */
export function AppLink({ href, children, ...props }: AppLinkProps) {
  if (isInternalRoute(href)) {
    return (
      <Link to={href} {...props}>
        {children}
      </Link>
    )
  }

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
