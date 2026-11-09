/** Route paths and in-page anchors. Reference these constants instead of string literals. */
export const routes = {
  home: '/',
  brand: '/brand',
} as const

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
