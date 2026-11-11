import { Parallax } from '@/components/motion'
import { Badge, SectionHeading } from '@/components/ui'
import { caseStudies, CaseStudyFeature, IS_SAMPLE_WORK } from '@/features/work'

/** Heading + case studies. Code-split from WorkSection: the case media (stock stand-ins) and their metadata. */
export function WorkCaseStudies() {
  return (
    <>
      <Parallax distance={-48}>
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
      </Parallax>
      <div>
        {caseStudies.map((study, index) => (
          <CaseStudyFeature key={study.slug} study={study} index={index} />
        ))}
      </div>
    </>
  )
}
