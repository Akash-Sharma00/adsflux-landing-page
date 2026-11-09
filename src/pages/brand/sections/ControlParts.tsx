import { Badge, Burst, Dropdown, Eyebrow, Stamp } from '@/components/ui'
import { mainNav } from '@/config/navigation'
import { SpecHeading } from './SpecHeading'
import styles from './ControlParts.module.css'

const DROPDOWN_ITEM_COUNT = 3
const serviceItems = mainNav.find((item) => item.children)?.children?.slice(0, DROPDOWN_ITEM_COUNT) ?? []

/** The small parts: tags, labels, the nav disclosure and the two decorative stickers. */
export function ControlParts() {
  return (
    <div className={styles.grid}>
      <div className={styles.cell}>
        <SpecHeading title="Badge" meta="outline · solid · highlight · dot" />
        <div className={styles.row}>
          <Badge>Outline</Badge>
          <Badge variant="solid">Solid</Badge>
          <Badge variant="highlight">Highlight</Badge>
          <Badge dot>With dot</Badge>
          <Badge variant="solid" dot>
            Live
          </Badge>
        </div>
      </div>

      <div className={styles.cell}>
        <SpecHeading title="Eyebrow" meta="index → (01)" />
        <div className={styles.stack}>
          <Eyebrow index="01">Services</Eyebrow>
          <Eyebrow index="04">Selected work</Eyebrow>
          <Eyebrow>Without an index</Eyebrow>
        </div>
      </div>

      <div className={styles.cell}>
        <SpecHeading title="Dropdown" meta="WAI-ARIA disclosure" />
        <Dropdown label="Services" items={serviceItems} />
        <p className={styles.note}>Escape closes and returns focus. Links highlight orange on hover.</p>
      </div>

      <div className={styles.cell}>
        <SpecHeading title="Stamp" meta="Decorative · aria-hidden" />
        <div className={styles.center}>
          <Stamp text="Strategy • Storytelling • Performance • " />
        </div>
      </div>

      <div className={styles.cellWide}>
        <SpecHeading title="Burst" meta="shape-1 · shape-2 · current · 8 / 12 rays · spin" />
        <div className={styles.bursts}>
          <figure className={styles.burstItem}>
            <Burst className={styles.burst} />
            <figcaption className="label">shape-1</figcaption>
          </figure>
          <figure className={styles.burstItem}>
            <Burst className={styles.burst} color="shape-2" />
            <figcaption className="label">shape-2</figcaption>
          </figure>
          <figure className={styles.burstItem}>
            <Burst className={styles.burst} color="current" rays={12} />
            <figcaption className="label">current · 12</figcaption>
          </figure>
          <figure className={styles.burstItem}>
            <Burst className={styles.burst} rays={12} spin />
            <figcaption className="label">spin</figcaption>
          </figure>
        </div>
      </div>
    </div>
  )
}
