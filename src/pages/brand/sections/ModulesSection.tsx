import { Badge, Container, Section } from '@/components/ui'
import { services } from '@/config/services'
import { pricingTiers, PricingTable } from '@/features/pricing'
import { ServiceModules } from '@/features/services'
import { CampaignCollage, showcaseItems } from '@/features/showcase'
import { testimonials, TestimonialSection } from '@/features/testimonials'
import { caseStudies, CaseStudyFeature } from '@/features/work'
import { BrandSection } from './BrandSection'
import { SpecHeading } from './SpecHeading'
import styles from './ModulesSection.module.css'

/** Five services = one full rhythm set (wide + narrow, three thirds). */
const SERVICE_SAMPLE_COUNT = 5
/** The compact collage (two composed rows): a 4:5 lead, the 16:9 wide piece second, then three 4:5 pieces. */
const COLLAGE_SAMPLE_IDS = ['go-cocoa-mist', 'altr-mints', 'herbiqroots-oil', 'sundress-mist', 'biopods-campaign']
const collageSample = COLLAGE_SAMPLE_IDS.flatMap((id) => showcaseItems.filter((item) => item.id === id))

const featuredStudy = caseStudies[0]

/** The feature modules as they ship on the home page. All content is sample. */
export function ModulesSection() {
  return (
    <>
      <BrandSection
        id="modules"
        title={
          <>
            Modules, <em>not cards.</em>
          </>
        }
        description="Feature components composed from the primitives above. Each owns its layout, tone rhythm and motion."
        actions={<Badge variant="highlight">Sample content</Badge>}
      >
        <SpecHeading title="Service modules" meta="@/features/services · MODULE_RHYTHM" />
        <ServiceModules services={services.slice(0, SERVICE_SAMPLE_COUNT)} />

        <SpecHeading title="Campaign collage" meta="@/features/showcase" className={styles.spacedHeading} />
        <CampaignCollage items={collageSample} />
      </BrandSection>

      {featuredStudy && (
        <Section tone="blue" spacing="lg" texture>
          <Container size="xl">
            <SpecHeading title="Case study feature" meta="@/features/work" />
            <CaseStudyFeature study={featuredStudy} index={0} />
          </Container>
        </Section>
      )}

      <TestimonialSection testimonials={testimonials} tone="cream" eyebrow="Testimonial section" />

      <Section tone="peach" spacing="lg" texture>
        <Container size="xl">
          <SpecHeading title="Pricing table" meta="@/features/pricing" />
          <p className={styles.sampleNote}>
            <Badge variant="highlight">Sample content</Badge>
            <span>Tier names, prices and inclusions are layout placeholders.</span>
          </p>
          <PricingTable tiers={pricingTiers} />
        </Container>
      </Section>
    </>
  )
}
