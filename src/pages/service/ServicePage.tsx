import { PageHead } from '@/components/layout'
import { CtaSection } from '@/components/sections'
import { primaryCta } from '@/config/navigation'
import { homeAnchor } from '@/config/routes'
import { servicePageKey } from '@/config/seo'
import { services, type Service } from '@/config/services'
import { serviceDetails } from './serviceContent'
import { FaqSection } from './sections/FaqSection'
import { IncludedSection } from './sections/IncludedSection'
import { ProcessSection } from './sections/ProcessSection'
import { RelatedServices } from './sections/RelatedServices'
import { ServiceHero } from './sections/ServiceHero'

type ServicePageProps = {
  service: Service
}

/**
 * One page per service — the pages that rank for "<service> agency in India" searches.
 * Tone rhythm: cream hero → cream included (divider) → peach process → cream FAQ → blue related services
 * → cobalt CTA → blue footer.
 */
export function ServicePage({ service }: ServicePageProps) {
  const detail = serviceDetails[service.slug]
  if (!detail) throw new Error(`ServicePage: no content for service "${service.slug}" in pages/service/serviceContent.ts`)
  const position = services.indexOf(service)

  return (
    <>
      <PageHead page={servicePageKey(service.slug)} />
      <ServiceHero service={service} detail={detail} position={position} />
      <IncludedSection service={service} points={detail.included} />
      <ProcessSection steps={detail.process} />
      <FaqSection questions={detail.faqs} />
      <RelatedServices currentSlug={service.slug} />
      <CtaSection
        title={
          <>
            Got a brief? Let’s make it <em>impossible to ignore.</em>
          </>
        }
        description="Tell us about the brand, the goal and the deadline. We’ll take it from there."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See our work', href: homeAnchor('showcase') }}
      />
    </>
  )
}
