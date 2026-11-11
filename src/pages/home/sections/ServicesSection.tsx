import { Parallax } from '@/components/motion'
import { Container, Section, SectionHeading } from '@/components/ui'
import { homeSections } from '@/config/routes'
import { services } from '@/config/services'
import { ServiceModules } from '@/features/services'

export function ServicesSection() {
  return (
    <Section id={homeSections.services} spacing="lg">
      <Container size="xl">
        <Parallax distance={-48}>
          <SectionHeading
            index="01"
            eyebrow="Services"
            title={
              <>
                Two ways to be <em>impossible to ignore</em> — today.
              </>
            }
            description="UGC video and creative production are open for briefs now. The rest of the studio is coming soon."
          />
        </Parallax>
        <ServiceModules services={services} />
      </Container>
    </Section>
  )
}
