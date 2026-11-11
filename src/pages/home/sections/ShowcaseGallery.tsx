import { Parallax } from '@/components/motion'
import { Badge, SectionHeading } from '@/components/ui'
import { CampaignCollage, IS_SAMPLE_SHOWCASE, showcaseItems } from '@/features/showcase'

/** Heading + campaign collage. Code-split from ShowcaseSection: the collage, its reels and their metadata. */
export function ShowcaseGallery() {
  return (
    <>
      <Parallax distance={-48}>
        <SectionHeading
          index="03"
          eyebrow="Showcase"
          title={
            <>
              Campaigns that <em>earn the scroll.</em>
            </>
          }
          description="UGC, product ads, brand campaigns, social and performance creative — made to be watched, saved and shared."
          actions={IS_SAMPLE_SHOWCASE ? <Badge variant="outline">Sample content</Badge> : undefined}
        />
      </Parallax>
      <CampaignCollage items={showcaseItems} />
    </>
  )
}
