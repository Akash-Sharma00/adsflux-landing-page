import { BrandSection } from './BrandSection'
import { ButtonShowcase } from './ButtonShowcase'
import { ControlParts } from './ControlParts'

export function ControlsSection() {
  return (
    <BrandSection
      id="controls"
      title={
        <>
          Sharp frames, <em>pill controls.</em>
        </>
      }
      description="Buttons and tags are the only rounded shapes in the system. Every control re-themes with its tone — no per-tone variants."
    >
      <ButtonShowcase />
      <ControlParts />
    </BrandSection>
  )
}
