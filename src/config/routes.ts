/** Route paths and in-page anchors. Reference these constants instead of string literals. */
export const routes = {
  home: '/',
  brand: '/brand',
} as const

/** A service page, one per entry in the services catalogue. */
export const servicePath = (slug: string) => `/services/${slug}`

export const homeSections = {
  services: 'services',
  scalvo: 'scalvo',
  showcase: 'showcase',
  philosophy: 'philosophy',
  work: 'work',
  clients: 'clients',
  contact: 'contact',
} as const

export const homeAnchor = (section: keyof typeof homeSections) => `${routes.home}#${homeSections[section]}`
