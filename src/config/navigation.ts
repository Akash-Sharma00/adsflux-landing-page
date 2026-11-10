import { homeAnchor, routes, servicePath } from './routes'
import { scalvoLinks } from './scalvo'
import { services } from './services'

export type NavLink = {
  label: string
  href: string
  description?: string
}

/** A listed entry with nothing to link to yet (a coming-soon service): plain text plus a short tag. */
export type NavPlaceholder = {
  label: string
  href?: undefined
  description?: string
  tag: string
}

export type NavEntry = NavLink | NavPlaceholder

export type NavItem = NavLink & {
  /** Present when the item opens a dropdown. */
  children?: readonly NavEntry[]
}

const serviceLinks: readonly NavEntry[] = services.map((service) =>
  service.isComingSoon
    ? { label: service.title, description: service.summary, tag: 'Soon' }
    : { label: service.title, href: servicePath(service.slug), description: service.summary },
)

export const mainNav: readonly NavItem[] = [
  { label: 'Services', href: homeAnchor('services'), children: serviceLinks },
  scalvoLinks.overview,
  { label: 'Showcase', href: homeAnchor('showcase') },
  { label: 'Work', href: homeAnchor('work') },
  { label: 'Philosophy', href: homeAnchor('philosophy') },
]

export const primaryCta: NavLink = { label: 'Start a project', href: homeAnchor('contact') }

export const footerNav: readonly { title: string; links: readonly NavEntry[] }[] = [
  {
    title: 'Studio',
    links: [
      { label: 'Showcase', href: homeAnchor('showcase') },
      { label: 'Selected work', href: homeAnchor('work') },
      { label: 'Philosophy', href: homeAnchor('philosophy') },
      { label: 'Clients', href: homeAnchor('clients') },
      { label: 'Contact', href: homeAnchor('contact') },
      { label: 'Brand system', href: routes.brand },
    ],
  },
  {
    title: 'Scalvo',
    links: [
      { label: 'Overview', href: scalvoLinks.overview.href },
      { label: 'Brand log in ↗', href: scalvoLinks.login.href },
      { label: 'scalvo.io ↗', href: scalvoLinks.site.href },
    ],
  },
  {
    title: 'Services',
    links: serviceLinks.map(({ description: _description, ...link }) => link),
  },
]
