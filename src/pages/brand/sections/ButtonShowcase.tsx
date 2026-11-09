import { Button, type ButtonSize, type ButtonVariant, type SectionTone } from '@/components/ui'
import styles from './ButtonShowcase.module.css'

const VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'ghost']
const SIZES: readonly ButtonSize[] = ['sm', 'md', 'lg']

const TONE_PANELS: readonly { tone: SectionTone; note: string }[] = [
  { tone: 'cobalt', note: 'Primary flips to cream; hover goes orange.' },
  { tone: 'ink', note: 'Primary is orange — ink’s accent.' },
  { tone: 'orange', note: 'Primary is ink; hover goes cobalt.' },
]

/** Full button matrix on cream, then the same controls re-themed by the three loud tones. */
export function ButtonShowcase() {
  return (
    <div className={styles.layout}>
      <div className={styles.matrix}>
        <span className="label">data-theme="cream" — the default</span>
        {VARIANTS.map((variant) => (
          <div key={variant} className={styles.row}>
            <span className={styles.rowLabel}>{variant}</span>
            <div className={styles.buttons}>
              {SIZES.map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {size}
                </Button>
              ))}
              <Button variant={variant} withArrow>
                withArrow
              </Button>
              <Button variant={variant} disabled>
                disabled
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.tones}>
        {TONE_PANELS.map((panel) => (
          <div key={panel.tone} data-theme={panel.tone} className={styles.tonePanel}>
            <span className="label">data-theme="{panel.tone}"</span>
            <div className={styles.buttons}>
              <Button withArrow>Start a project</Button>
              <Button variant="secondary">See the work</Button>
              <Button variant="ghost">Read more</Button>
            </div>
            <p className={styles.note}>{panel.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
