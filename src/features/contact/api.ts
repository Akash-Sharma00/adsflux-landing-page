import { env } from '@/config/env'
import type { ContactFormValues } from './types'

export class ContactNotConfiguredError extends Error {
  constructor() {
    super('The contact form is not connected yet. Set VITE_CONTACT_ENDPOINT to enable it.')
    this.name = 'ContactNotConfiguredError'
  }
}

/** POSTs the enquiry as JSON to VITE_CONTACT_ENDPOINT (Formspree, a serverless function, a CRM…). */
export async function submitContactForm(values: ContactFormValues): Promise<void> {
  if (!env.contactEndpoint) throw new ContactNotConfiguredError()

  const response = await fetch(env.contactEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(values),
  })

  if (!response.ok) {
    throw new Error(`Contact submission failed with status ${response.status}`)
  }
}
