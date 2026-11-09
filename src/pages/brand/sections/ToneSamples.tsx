import { Button } from '@/components/ui'
import { useTheme } from '@/hooks/useTheme'
import { colorReference, toneSamples } from '../brandData'
import styles from './ToneSamples.module.css'

/** Each tone as a miniature section: heading, muted copy and its CTA — all re-themed by data-theme. */
export function ToneSamples() {
  const { toneName } = colorReference(useTheme().theme)

  return (
    <ul className={styles.grid}>
      {toneSamples.map((sample) => (
        <li key={sample.tone} data-theme={sample.tone} className={styles.tile}>
          <span className="label">data-theme="{sample.tone}"</span>
          <h4 className={styles.title}>
            {toneName(sample)}, <em>in tone.</em>
          </h4>
          <p className={styles.muted}>{sample.use}</p>
          <Button size="sm" withArrow className={styles.cta}>
            Start a project
          </Button>
        </li>
      ))}
    </ul>
  )
}
