import { PageHead } from '@/components/layout'
import { CtaSection } from '@/components/sections'
import { homeAnchor, routes } from '@/config/routes'
import { BrandHero } from './sections/BrandHero'
import { BrandSubnav } from './sections/BrandSubnav'
import { ColorSection } from './sections/ColorSection'
import { ControlsSection } from './sections/ControlsSection'
import { FormsSection } from './sections/FormsSection'
import { ImagerySection } from './sections/ImagerySection'
import { LogoSection } from './sections/LogoSection'
import { ModulesSection } from './sections/ModulesSection'
import { MotionSection } from './sections/MotionSection'
import { TypographySection } from './sections/TypographySection'

/**
 * Living brand reference ("Electric Editorial"), rendered with the production tokens and components.
 * Tone rhythm: cream-led, soft-blue type spread, one ink gallery wall (imagery), cobalt close.
 */
export function BrandPage() {
  return (
    <>
      <PageHead page="brand" />
      <BrandHero />
      <BrandSubnav />
      <LogoSection />
      <ColorSection />
      <TypographySection />
      <ControlsSection />
      <FormsSection />
      <ImagerySection />
      <ModulesSection />
      <MotionSection />
      <CtaSection
        eyebrow="Closing section · CtaSection"
        title={
          <>
            Let’s make it <em>impossible to ignore.</em>
          </>
        }
        description="The closing block on every page: one big serif line, one primary action."
        primaryAction={{ label: 'Start a project', href: homeAnchor('contact') }}
        secondaryAction={{ label: 'Back to home', href: routes.home }}
      />
    </>
  )
}
