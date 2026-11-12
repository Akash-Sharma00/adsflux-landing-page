import { Stagger, StaggerItem } from '@/components/motion'
import { Badge, ButtonLink, SectionHeading } from '@/components/ui'
import { scalvoConfig, scalvoLinks } from '@/config/scalvo'
import styles from './ScalvoPlatform.module.css'
import { ScalvoScreens } from './ScalvoScreens'

type PlatformFeature = {
  title: string
  body: string
  status: 'live' | 'soon'
}

/** Statuses mirror https://www.scalvo.io (its "Coming soon" roadmap). Flip to 'live' only when shipped. */
const FEATURES: readonly PlatformFeature[] = [
  {
    title: 'Your own brand login',
    body: 'Approve or reject the creators we propose, with a reason, and review content before it goes live.',
    status: 'live',
  },
  {
    title: 'UGC flow, brief to delivery',
    body: 'Brief, creator selection, scripts, product shipments, submissions and your approval — one shared version.',
    status: 'live',
  },
  {
    title: 'AI creative',
    body: 'Ad creatives generated from your brand’s research, or adapted from an ad you like.',
    status: 'live',
  },
  {
    title: 'AI videos',
    body: 'Video ads made with AI, directed by people who know your brand.',
    status: 'soon',
  },
  {
    title: 'Meta ads integration',
    body: 'Spend and results from your ad campaigns, next to the content that made them.',
    status: 'soon',
  },
  {
    title: 'Detailed reports',
    body: 'Shareable campaign reports, in the same workspace.',
    status: 'soon',
  },
]

/** Scalvo content: heading + CTAs, the pinned animated UI mock-up and an editorial index of what's inside. */
export function ScalvoPlatform() {
  return (
    <>
      <SectionHeading
        index="02"
        eyebrow={`Platform · ${scalvoConfig.name}`}
        title={
          <>
            Every campaign, in <em>one workspace.</em>
          </>
        }
        description={`${scalvoConfig.name} is where brands work with us — log in, approve creators, review content and follow every campaign to delivery.`}
        actions={
          <>
            <ButtonLink href={scalvoLinks.login.href} withArrow>
              Brand log in
            </ButtonLink>
            <ButtonLink href={scalvoLinks.site.href} variant="secondary">
              {scalvoLinks.site.label} ↗
            </ButtonLink>
          </>
        }
      />

      <div className={styles.layout}>
        <div className={styles.visual}>
          <ScalvoScreens />
        </div>

        <Stagger as="ol" className={styles.features}>
          {FEATURES.map((feature, index) => (
            <StaggerItem as="li" key={feature.title} className={styles.feature}>
              <span className={styles.index} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className={styles.featureBody}>
                {/* The badge sits beside the heading, not in it, so "Coming soon" isn't read as a topic of the page. */}
                <div className={styles.featureHeading}>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  {feature.status === 'soon' && <Badge variant="solid">Coming soon</Badge>}
                </div>
                <p className={styles.featureText}>{feature.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </>
  )
}
