import { Container, Section, SectionHeading } from '@/components/ui'
import { homeSections } from '@/config/routes'
import { services } from '@/config/services'
import { ServiceModules } from '@/features/services'

export function ServicesSection() {
  return (
    <Section id={homeSections.services} spacing="lg">
      <Container size="xl">
        <SectionHeading
          index="01"
          eyebrow="Services"
          title={
            <>
              Eight ways we make brands <em>impossible to ignore.</em>
            </>
          }
          description="Strategy sets the direction. Creative earns the attention. Performance turns it into growth."
        />
        <ServiceModules services={services} />
      </Container>
    </Section>
  )
}
