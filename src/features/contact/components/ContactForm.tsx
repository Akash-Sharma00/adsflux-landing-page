import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Button, Field, Input, Select, Textarea } from '@/components/ui'
import { liveServices } from '@/config/services'
import { ContactNotConfiguredError, submitContactForm } from '../api'
import { BUDGET_OPTIONS } from '../constants'
import type { ContactFormErrors, ContactFormValues } from '../types'
import { validateContactForm } from '../validation'
import styles from './ContactForm.module.css'

const EMPTY_VALUES: ContactFormValues = { name: '', email: '', company: '', service: '', budget: '', message: '' }

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'success' } | { kind: 'error'; message: string }

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateContactForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus({ kind: 'submitting' })
    try {
      await submitContactForm(values)
      setStatus({ kind: 'success' })
      setValues(EMPTY_VALUES)
    } catch (error) {
      const message =
        error instanceof ContactNotConfiguredError
          ? error.message
          : 'Something went wrong sending your message. Please try again.'
      setStatus({ kind: 'error', message })
    }
  }

  if (status.kind === 'success') {
    return (
      <div className={styles.success} role="status">
        <p className={styles.successTitle}>Message received.</p>
        <p>We’ll be in touch within two working days.</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <Field label="Name" required error={errors.name}>
          {(props) => <Input {...props} name="name" autoComplete="name" value={values.name} onChange={handleChange} />}
        </Field>
        <Field label="Work email" required error={errors.email}>
          {(props) => (
            <Input {...props} name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} />
          )}
        </Field>
      </div>
      <div className={styles.row}>
        <Field label="Company">
          {(props) => (
            <Input {...props} name="company" autoComplete="organization" value={values.company} onChange={handleChange} />
          )}
        </Field>
        <Field label="What do you need?">
          {(props) => (
            <Select {...props} name="service" value={values.service} onChange={handleChange}>
              <option value="">Choose a service</option>
              {liveServices.map((service) => (
                <option key={service.slug} value={service.title}>
                  {service.title}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <Field label="Monthly budget" hint="Helps us recommend the right team.">
        {(props) => (
          <Select {...props} name="budget" value={values.budget} onChange={handleChange}>
            <option value="">Select a range</option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Tell us about the brand and the goal" required error={errors.message}>
        {(props) => <Textarea {...props} name="message" value={values.message} onChange={handleChange} />}
      </Field>

      {status.kind === 'error' && (
        <p className={styles.formError} role="alert">
          {status.message}
        </p>
      )}

      <Button type="submit" size="lg" withArrow disabled={status.kind === 'submitting'} className={styles.submit}>
        {status.kind === 'submitting' ? 'Sending…' : 'Send enquiry'}
      </Button>
    </form>
  )
}
