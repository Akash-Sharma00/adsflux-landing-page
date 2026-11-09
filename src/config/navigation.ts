import { homeAnchor, routes } from './routes'
import { scalvoLinks } from './scalvo'
import { serviceAnchorId, services } from './services'

export type NavLink = {
  label: string
  href: string
  description?: string
}

export type NavItem = NavLink & {
  /** Present when the item opens a dropdown. */
  children?: readonly NavLink[]
}

const serviceLinks: readonly NavLink[] = services.map((service) => ({
  label: service.title,
  href: `${routes.home}#${serviceAnchorId(service.slug)}`,
  description: service.summary,
}))

export const mainNav: readonly NavItem[] = [
  { label: 'Services', href: homeAnchor('services'), children: serviceLinks },
  scalvoLinks.overview,
  { label: 'Showcase', href: homeAnchor('showcase') },
  { label: 'Work', href: homeAnchor('work') },
  { label: 'Philosophy', href: homeAnchor('philosophy') },
]

export const primaryCta: NavLink = { label: 'Start a project', href: homeAnchor('contact') }

export const footerNav: readonly { title: string; links: readonly NavLink[] }[] = [
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
    links: serviceLinks.map(({ label, href }) => ({ label, href })),
  },
]
