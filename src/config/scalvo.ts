import { homeAnchor } from './routes'

/**
 * Scalvo — the creator-campaign workspace brands use to work with Adsflux (https://www.scalvo.io).
 * Brands are invited into their own workspace, so the login here is the brand login.
 */
export const scalvoConfig = {
  name: 'Scalvo',
  brandLoginUrl: 'https://app.scalvo.io/brand/login',
  siteUrl: 'https://www.scalvo.io/',
} as const

export const scalvoLinks = {
  overview: { label: scalvoConfig.name, href: homeAnchor('scalvo') },
  login: { label: 'Log in', href: scalvoConfig.brandLoginUrl },
  site: { label: `Explore ${scalvoConfig.name}`, href: scalvoConfig.siteUrl },
} as const
