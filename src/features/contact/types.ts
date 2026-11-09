export type ContactFormValues = {
  name: string
  email: string
  company: string
  service: string
  budget: string
  message: string
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>
