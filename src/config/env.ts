/** The only place that reads import.meta.env. Import typed values from here. */
export const env = {
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT?.trim() ?? '',
} as const
