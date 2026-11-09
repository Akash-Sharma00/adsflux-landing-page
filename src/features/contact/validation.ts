import { MIN_MESSAGE_LENGTH } from './constants'
import type { ContactFormErrors, ContactFormValues } from './types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {}

  if (!values.name.trim()) errors.name = 'Tell us your name.'
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address.'
  if (values.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = `A little more detail helps — at least ${MIN_MESSAGE_LENGTH} characters.`
  }

  return errors
}
