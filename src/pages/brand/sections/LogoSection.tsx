import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import { Monogram, Wordmark, type MonogramVariant, type SectionTone } from '@/components/ui'
import { FAVICON_SIZES, logoDonts, logoDos, logoFiles } from '../brandData'
import { BrandSection } from './BrandSection'
import { SpecHeading } from './SpecHeading'
import styles from './LogoSection.module.css'

const WORDMARK_TILES: readonly { tone: SectionTone; caption: string; className?: string }[] = [
  { tone: 'cream', caption: 'On cream — ink letters, orange burst', className: styles.tileLead },
  { tone: 'cobalt', caption: 'On cobalt — cream letters, orange burst', className: styles.tileSide },
  { tone: 'ink', caption: 'On ink — cream letters, orange burst', className: styles.tileSide },
]

const MONOGRAMS: readonly { variant: MonogramVariant; use: string }[] = [
  { variant: 'cobalt', use: 'Default — favicon, avatars' },
  { variant: 'cream', use: 'On photography' },
  { variant: 'orange', use: 'Stickers & merch only' },
]

export function LogoSection() {
  return (
    <BrandSection
      id="logo"
      title={
        <>
          A wordmark with a <em>signal.</em>
        </>
      }
      description="Instrument Serif “Ads” roman + “flux” italic, drawn as outlines, with the orange burst. Colors follow the tone automatically."
    >
      <div className={styles.tiles}>
        {WORDMARK_TILES.map((tile) => (
          <Reveal key={tile.tone} className={tile.className}>
            <figure data-theme={tile.tone} className={styles.tile}>
              <Wordmark className={styles.tileMark} />
              <figcaption className="label">{tile.caption}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <div className={styles.secondary}>
        <div>
          <SpecHeading title="Mono" meta="Single-color reproduction" />
          <div className={styles.monoTile}>
            <Wordmark className={styles.monoMark} title="Adsflux, one-color version" />
          </div>
        </div>

        <div>
          <SpecHeading title="Monogram" meta="<Monogram variant>" />
          <Stagger as="ul" className={styles.monograms}>
            {MONOGRAMS.map((monogram) => (
              <StaggerItem as="li" key={monogram.variant} className={styles.monogramItem}>
                <Monogram variant={monogram.variant} className={styles.monogram} title={`Adsflux monogram, ${monogram.variant}`} />
                <span className="label">{monogram.variant}</span>
                <span className={styles.use}>{monogram.use}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div>
          <SpecHeading title="Favicon" meta="/favicon.svg" />
          <ul className={styles.favicons}>
            {FAVICON_SIZES.map((size) => (
              <li key={size} className={styles.favicon}>
                <img src="/favicon.svg" width={size} height={size} alt={`Favicon at ${size}px`} />
                <span className="label">{size}px</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.rules}>
        <div>
          <SpecHeading title={<em>Do</em>} />
          <ul className={styles.ruleList}>
            {logoDos.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
        <div>
          <SpecHeading title={<em>Don’t</em>} />
          <ul className={styles.ruleList} data-kind="dont">
            {logoDonts.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
        <div>
          <SpecHeading title="Files" meta="public/brand/" />
          <ul className={styles.files}>
            {logoFiles.map((file) => (
              <li key={file}>
                <a href={`/brand/${file}`} download>
                  {file}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BrandSection>
  )
}
