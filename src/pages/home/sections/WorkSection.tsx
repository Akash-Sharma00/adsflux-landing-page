import { Badge, Container, Section, SectionHeading } from '@/components/ui'
import { homeSections } from '@/config/routes'
import { caseStudies, CaseStudyFeature, IS_SAMPLE_WORK } from '@/features/work'

export function WorkSection() {
  return (
    <Section id={homeSections.work} tone="blue" spacing="lg" texture>
      <Container size="xl">
        <SectionHeading
          index="05"
          eyebrow="Selected work"
          title={
            <>
              The brief, the idea, <em>the difference.</em>
            </>
          }
          description="Every project starts with a business problem. Here’s how we approached a few of them."
          actions={IS_SAMPLE_WORK ? <Badge variant="outline">Sample content</Badge> : undefined}
        />
        <div>
          {caseStudies.map((study, index) => (
            <CaseStudyFeature key={study.slug} study={study} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
