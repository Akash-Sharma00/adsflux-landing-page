import type { CSSProperties } from 'react'
import { Stagger, StaggerItem } from '@/components/motion'
import { useTheme } from '@/hooks/useTheme'
import { colorReference } from '../brandData'
import { BrandSection } from './BrandSection'
import { ContrastTable } from './ContrastTable'
import { SpecHeading } from './SpecHeading'
import { ToneSamples } from './ToneSamples'
import styles from './ColorSection.module.css'

export function ColorSection() {
  const { theme } = useTheme()
  const { modeName, colors, tints, contrastPairs } = colorReference(theme)

  return (
    <BrandSection
      id="color"
      divider
      title={
        <>
          Six colors. <em>One loud one.</em>
        </>
      }
      description="Paper Cream leads every page. Electric Cobalt marks the big moments. Signal Orange is a controlled spark — fills and shapes, never text on light. In dark mode each tone has a Midnight Editorial counterpart; switch the theme to see it."
    >
      <p className={styles.mode}>
        <span className="label">Showing</span> {modeName}
      </p>

      <Stagger as="ul" className={styles.swatches}>
        {colors.map((color) => (
          <StaggerItem as="li" key={color.token} className={styles.swatchItem}>
            <article data-theme={color.tone} className={styles.swatch}>
              <span className="label">{color.share}% of the page</span>
              <div className={styles.swatchBody}>
                <h3 className={styles.swatchName}>{color.name}</h3>
                <p className={styles.swatchRole}>{color.role}</p>
                <dl className={styles.swatchSpec}>
                  <div>
                    <dt className="visually-hidden">Hex</dt>
                    <dd>{color.hex}</dd>
                  </div>
                  <div>
                    <dt className="visually-hidden">Token</dt>
                    <dd>{color.token}</dd>
                  </div>
                </dl>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      <ul className={styles.tints} aria-label="Derived tints">
        {tints.map((tint) => (
          <li key={tint.token} className={styles.tint}>
            <span className={styles.tintChip} style={{ background: `var(${tint.token})` }} aria-hidden="true" />
            <span>
              <span className={styles.tintName}>{tint.name}</span>
              <span className="label">
                {tint.hex} · {tint.token}
              </span>
              <span className={styles.tintUse}>{tint.use}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className={styles.block}>
        <SpecHeading title={<>Target <em>balance</em></>} meta="Share of page surface, approximate" />
        <ul className={styles.balance}>
          {colors.map((color) => (
            <li
              key={color.token}
              data-theme={color.tone}
              className={styles.balanceSegment}
              style={{ '--share': color.share } as CSSProperties}
            >
              <span className={styles.balanceShare}>{color.share}%</span>
              <span className={styles.balanceName}>{color.name}</span>
            </li>
          ))}
        </ul>
        <p className={styles.balanceNote}>
          Cream-led page; cobalt for big moments; blue and peach as supporting bands; orange controlled; ink sparing — one band
          per page at most.
        </p>
      </div>

      <div className={styles.block}>
        <SpecHeading title={<>Contrast, <em>measured</em></>} meta="WCAG 2.x · AA = 4.5 body / 3 large" />
        <ContrastTable pairs={contrastPairs} />
      </div>

      <div className={styles.block}>
        <SpecHeading title={<>Six <em>tones</em></>} meta='data-theme="…" · <Section tone>' />
        <ToneSamples />
      </div>
    </BrandSection>
  )
}
