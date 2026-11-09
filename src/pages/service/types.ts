export type ServicePoint = {
  title: string
  description: string
}

export type ServiceQuestion = {
  question: string
  answer: string
}

/** Long-form copy for a service page (the catalogue entry itself lives in @/config/services). */
export type ServiceDetail = {
  /** Serif punch line under the keyword <h1> lead; `emphasis` is the italic payoff. */
  punch: { text: string; emphasis: string }
  /** Opening paragraph: ≤ 3 sentences. */
  intro: string
  /** What the engagement covers — one point per catalogue capability. */
  included: readonly ServicePoint[]
  /** How the work runs, in order. */
  process: readonly ServicePoint[]
  faqs: readonly ServiceQuestion[]
}
