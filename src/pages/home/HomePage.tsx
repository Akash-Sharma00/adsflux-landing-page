import { PageHead } from '@/components/layout'
import { homeSections } from '@/config/routes'
import { testimonials, TestimonialSection } from '@/features/testimonials'
import { ContactSection } from './sections/ContactSection'
import { HomeHero } from './sections/HomeHero'
import { PhilosophySection } from './sections/PhilosophySection'
import { ScalvoSection } from './sections/ScalvoSection'
import { ServicesSection } from './sections/ServicesSection'
import { ShowcaseSection } from './sections/ShowcaseSection'
import { TickerBand } from './sections/TickerBand'
import { WorkSection } from './sections/WorkSection'

/**
 * Tone rhythm (Electric Editorial): cream hero → orange ticker → cream services (multi-tone modules)
 * → peach Scalvo platform → ink showcase → cobalt philosophy → soft-blue work → cream clients → cobalt contact → blue footer.
 * Cream leads; cobalt marks the two big moments; ink appears once, as the gallery wall.
 */
export function HomePage() {
  return (
    <>
      <PageHead page="home" />
      <HomeHero />
      <TickerBand />
      <ServicesSection />
      <ScalvoSection />
      <ShowcaseSection />
      <PhilosophySection />
      <WorkSection />
      <TestimonialSection id={homeSections.clients} testimonials={testimonials} index="06" eyebrow="Clients" />
      <ContactSection />
    </>
  )
}
