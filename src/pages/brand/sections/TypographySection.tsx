import { Reveal } from '@/components/motion'
import { cn } from '@/lib/cn'
import { typeFamilies, typeScale } from '../brandData'
import { BrandSection } from './BrandSection'
import { SpecHeading } from './SpecHeading'
import styles from './TypographySection.module.css'

export function TypographySection() {
  return (
    <BrandSection
      id="type"
      tone="blue"
      texture
      title={
        <>
          Grotesk says it. <em>Serif makes you feel it.</em>
        </>
      }
      description="Four families with one job each. The signature move: an <em> inside any heading switches to Instrument Serif italic."
    >
      <figure className={styles.contrast}>
        <Reveal>
          <p className={styles.contrastLine}>
            Everything a brand needs, <em>under one roof.</em>
          </p>
        </Reveal>
        <figcaption className={styles.contrastCaption}>
          <span className="label">Space Grotesk 500 · −0.025em</span>
          <span className="label">+ &lt;em&gt; → Instrument Serif italic · 1.08em</span>
        </figcaption>
      </figure>

      <ul className={styles.families}>
        {typeFamilies.map((family) => (
          <li key={family.name} className={styles.family}>
            <div className={styles.familyMeta}>
              <h3 className={styles.familyName}>{family.name}</h3>
              <span className="label">{family.token}</span>
              <span className="label">{family.weights}</span>
              <p className={styles.familyRole}>{family.role}</p>
            </div>
            <p className={cn(styles.specimen, styles[family.variant])}>{family.specimen}</p>
          </li>
        ))}
      </ul>

      <div className={styles.scaleBlock}>
        <SpecHeading title={<>Type <em>scale</em></>} meta="Fluid clamp() · 360 → 1440px" />
        <ol className={styles.scale}>
          {typeScale.map((step) => (
            <li key={step.token} className={styles.step}>
              <div className={styles.stepMeta}>
                <span className={styles.stepName}>{step.name}</span>
                <span className="label">{step.token}</span>
                <span className={styles.stepSpec}>{step.spec}</span>
              </div>
              <p className={cn(styles.stepSample, styles[step.step])}>{step.sample}</p>
            </li>
          ))}
        </ol>
      </div>
    </BrandSection>
  )
}
