import { ImageReveal, Parallax, Reveal, Stagger, StaggerItem } from '@/components/motion'
import { Badge, Container, Eyebrow, MediaFrame, Section, type SectionTone } from '@/components/ui'
import { IS_SAMPLE_TESTIMONIALS, type Testimonial } from '../content'
import { QuoteText } from './QuoteText'
import styles from './TestimonialSection.module.css'

type TestimonialSectionProps = {
  testimonials: readonly Testimonial[]
  id?: string
  eyebrow?: string
  index?: string
  tone?: SectionTone
}

/**
 * Editorial testimonial spread: a portrait beside one large featured quote, supporting quotes set
 * as smaller columns beneath. Typography and imagery — no cards.
 */
export function TestimonialSection({
  testimonials,
  id,
  eyebrow = 'Clients',
  index,
  tone = 'cream',
}: TestimonialSectionProps) {
  const [featured, ...rest] = testimonials
  if (!featured) return null

  return (
    <Section id={id} tone={tone} spacing="lg" texture>
      <Container size="xl">
        <div className={styles.top}>
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
          {IS_SAMPLE_TESTIMONIALS && <Badge>Sample content</Badge>}
        </div>

        <figure className={styles.spread}>
          <Parallax distance={50} className={styles.portrait}>
            <ImageReveal>
              <MediaFrame
                ratio="3/4"
                image={featured.portrait}
                sizes="(min-width: 1024px) 28vw, 90vw"
                art={featured.art}
                artTone={featured.artTone}
                placeholderMeta="Client portrait"
              />
            </ImageReveal>
          </Parallax>
          <Reveal className={styles.featuredBody}>
            <span className={styles.mark} aria-hidden="true">
              “
            </span>
            <blockquote className={styles.featuredQuote}>
              <p>
                <QuoteText quote={featured.quote} emphasis={featured.emphasis} />
              </p>
            </blockquote>
            <figcaption className={styles.caption}>
              <span className={styles.role}>{featured.role}</span>
              <span className="label">{featured.company}</span>
            </figcaption>
          </Reveal>
        </figure>

        {rest.length > 0 && (
          <Stagger as="ul" className={styles.list}>
            {rest.map((testimonial, itemIndex) => (
              <StaggerItem as="li" key={testimonial.quote}>
                <figure className={styles.item}>
                  <span className="label">({String(itemIndex + 2).padStart(2, '0')})</span>
                  <blockquote>
                    <p className={styles.quote}>
                      <QuoteText quote={testimonial.quote} emphasis={testimonial.emphasis} />
                    </p>
                  </blockquote>
                  <figcaption className={styles.caption}>
                    <MediaFrame
                      className={styles.thumb}
                      ratio="1/1"
                      image={testimonial.portrait}
                      sizes="56px"
                      art={testimonial.art}
                      artTone={testimonial.artTone}
                    />
                    <span>
                      <span className={styles.role}>{testimonial.role}</span>
                      <span className="label">{testimonial.company}</span>
                    </span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Container>
    </Section>
  )
}
