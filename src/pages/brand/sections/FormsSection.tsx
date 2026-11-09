import { Reveal } from '@/components/motion'
import { Badge, Field, Input } from '@/components/ui'
import { env } from '@/config/env'
import { ContactForm } from '@/features/contact'
import { BrandSection } from './BrandSection'
import { SpecHeading } from './SpecHeading'
import styles from './FormsSection.module.css'

const isFormConnected = Boolean(env.contactEndpoint)

export function FormsSection() {
  return (
    <BrandSection
      id="forms"
      divider
      title={
        <>
          Forms that read like <em>a page.</em>
        </>
      }
      description="Editorial underline inputs: large DM Sans, mono labels, no boxes. Labels, hints and errors are wired by <Field>."
      actions={
        <Badge variant={isFormConnected ? 'solid' : 'outline'} dot>
          {isFormConnected ? 'Endpoint connected' : 'Not connected'}
        </Badge>
      }
    >
      <div className={styles.layout}>
        <div className={styles.aside}>
          <p className={styles.lede}>
            The live <code>ContactForm</code> from <code>@/features/contact</code>. It validates locally, but submits nowhere
            until <code>VITE_CONTACT_ENDPOINT</code> is set — until then a submit shows the “not configured” message.
          </p>

          <div>
            <SpecHeading title="States" meta="hint · error" />
            <div className={styles.states}>
              <Field label="Company" hint="Optional — helps us prepare.">
                {(props) => <Input {...props} defaultValue="Adsflux" />}
              </Field>
              <Field label="Work email" required error="Enter a valid email address.">
                {(props) => <Input {...props} type="email" defaultValue="hello@" />}
              </Field>
            </div>
          </div>

          <div data-theme="cobalt" className={styles.cobaltPanel}>
            <span className="label">On cobalt — the home contact section</span>
            <Field label="Name" required error="Tell us who you are.">
              {(props) => <Input {...props} placeholder="Your name" />}
            </Field>
            <p className={styles.panelNote}>
              Lines turn cream, placeholders cream-soft, and errors switch to the on-dark danger tint (5.59:1).
            </p>
          </div>
        </div>

        <Reveal className={styles.form}>
          <SpecHeading title={<>Live <em>form</em></>} meta="On cream" />
          <ContactForm />
        </Reveal>
      </div>
    </BrandSection>
  )
}
