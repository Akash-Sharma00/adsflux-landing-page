import { Badge } from '@/components/ui'
import { AA_BODY, AA_LARGE, contrastTokens, type ContrastPair } from '../brandData'
import styles from './ContrastTable.module.css'

type Verdict = { label: string; variant: 'solid' | 'outline' | 'highlight' }

function getVerdict(ratio: number): Verdict {
  if (ratio >= AA_BODY) return { label: 'Pass', variant: 'solid' }
  if (ratio >= AA_LARGE) return { label: 'Large only', variant: 'outline' }
  return { label: 'Fail', variant: 'highlight' }
}

function ContrastSample({ pair }: { pair: ContrastPair }) {
  return (
    <span
      className={styles.sample}
      style={{ color: `var(${contrastTokens[pair.foreground]})`, background: `var(${contrastTokens[pair.background]})` }}
      aria-hidden="true"
    >
      Aa
    </span>
  )
}

/** Every text/background pair the system allows — and the ones it forbids — with measured ratios. */
export function ContrastTable({ pairs }: { pairs: readonly ContrastPair[] }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className="visually-hidden">Measured contrast ratios against WCAG AA (4.5:1 body text)</caption>
        <thead>
          <tr>
            <th scope="col">Sample</th>
            <th scope="col">Text on background</th>
            <th scope="col">Ratio</th>
            <th scope="col">AA 4.5</th>
            <th scope="col">Rule</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((pair) => {
            const verdict = getVerdict(pair.ratio)
            return (
              <tr key={`${pair.foreground}-${pair.background}`}>
                <td className={styles.sampleCell}>
                  <ContrastSample pair={pair} />
                </td>
                <th scope="row" className={styles.pair}>
                  {pair.foreground} <span className={styles.on}>on</span> {pair.background}
                </th>
                <td className={styles.ratio}>{pair.ratio.toFixed(2)}</td>
                <td className={styles.verdict}>
                  <Badge variant={verdict.variant}>{verdict.label}</Badge>
                </td>
                <td className={styles.note}>{pair.note ?? 'Body text'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
