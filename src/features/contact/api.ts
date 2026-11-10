import { env } from '@/config/env'
import type { ContactFormValues } from './types'

export class ContactNotConfiguredError extends Error {
  constructor() {
    super('The contact form is not connected yet. Set VITE_CONTACT_ENDPOINT to enable it.')
    this.name = 'ContactNotConfiguredError'
  }
}

type EndpointReply = { ok?: boolean; error?: string }

/**
 * POSTs the enquiry as JSON to VITE_CONTACT_ENDPOINT (a Google Apps Script web app that appends
 * a row to the leads sheet). Sent as text/plain so the browser skips the CORS preflight, which
 * Apps Script can't answer; the script parses the body as JSON and replies { ok: true }.
 */
export async function submitContactForm(values: ContactFormValues): Promise<void> {
  if (!env.contactEndpoint) throw new ContactNotConfiguredError()

  const response = await fetch(env.contactEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...values, page: window.location.href }),
  })

  if (!response.ok) {
    throw new Error(`Contact submission failed with status ${response.status}`)
  }

  // Apps Script answers 200 even when the script fails, so trust its { ok } flag instead.
  const reply = (await response.json().catch(() => ({}))) as EndpointReply
  if (reply.ok !== true) {
    throw new Error(`Contact submission was rejected: ${reply.error ?? 'unknown error'}`)
  }
}
