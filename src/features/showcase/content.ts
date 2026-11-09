import { campaignImages } from '@/assets/assetRegistry'
import { showcaseVideos } from '@/assets/showcaseVideos'
import type { ShowcaseItem } from './types'

/**
 * Real campaign creatives (from @/assets/assetRegistry). Client relationships are UNCONFIRMED, so
 * captions use neutral category labels — never client names, results or metrics.
 *
 * Adding work: run the asset pipeline (`npm run assets` for images, `npm run videos` then `npm run assets` for
 * reels), register the asset in src/assets/assetRegistry.ts (reels: src/assets/showcaseVideos.ts), then add an
 * entry here. Each asset appears once on the site. The collage has a composed layout for up to 5 images and a
 * 9-piece rhythm beyond that.
 *
 * Layout: videos form the reels row, in this order; images form the campaign collage, in this order — its compact
 * composition (≤ 5 pieces) expects a 4:5 lead, the 16:9 wide piece second, then 4:5 pieces. Caption numbers
 * follow this list, so they stay stable when a category filter moves its results to the top.
 */
export const IS_SAMPLE_SHOWCASE = false

export const showcaseItems: readonly ShowcaseItem[] = [
  {
    id: 'fixup-magnesium-reel',
    category: 'ugc',
    title: 'A supplement, explained like a friend would',
    client: 'Supplement brand',
    format: 'Creator explainer · 9:16',
    ratio: '9/16',
    video: showcaseVideos.fixupMagnesium,
    isVideo: true,
    art: 'stack',
    artTone: 'blue',
  },
  {
    id: 'vezzo-sneakers-reel',
    category: 'product',
    title: 'Sneakers, unboxed like a street-style film',
    client: 'Footwear brand',
    format: 'Product reel · 9:16',
    ratio: '9/16',
    video: showcaseVideos.vezzoSneakers,
    isVideo: true,
    art: 'stripes',
    artTone: 'peach',
  },
  {
    id: 'prathaa-outfit-reel',
    category: 'social',
    title: 'One outfit, styled for the scroll',
    client: 'Fashion label',
    format: 'Social reel · 9:16',
    ratio: '9/16',
    video: showcaseVideos.prathaaOutfit,
    isVideo: true,
    art: 'arch',
    artTone: 'blue',
  },
  {
    id: 'champagne-mist-review',
    category: 'ugc',
    title: 'A first spritz, reviewed on camera',
    client: 'Fragrance brand',
    format: 'Creator review · 9:16',
    ratio: '9/16',
    video: showcaseVideos.champagneMistReview,
    isVideo: true,
    art: 'halftone',
    artTone: 'peach',
  },
  {
    id: 'go-cocoa-mist',
    category: 'product',
    title: 'A gourmand mist, art-directed in chocolate',
    client: 'Fragrance brand',
    format: 'Product ad · 4:5',
    ratio: '4/5',
    image: campaignImages.goCocoaMist,
    art: 'sun',
    artTone: 'peach',
  },
  {
    id: 'altr-mints',
    category: 'brand',
    title: 'Caffeine mints, shot like a hero product',
    client: 'Functional confectionery',
    format: 'Key visual · 16:9',
    ratio: '16/9',
    image: campaignImages.altrMints,
    art: 'stripes',
    artTone: 'blue',
  },
  {
    id: 'herbiqroots-oil',
    category: 'social',
    title: 'An Ayurvedic ritual, told in one frame',
    client: 'Ayurvedic haircare',
    format: 'Social ad · 4:5',
    ratio: '4/5',
    image: campaignImages.herbiqrootsOil,
    art: 'arch',
    artTone: 'peach',
  },
  {
    id: 'sundress-mist',
    category: 'performance',
    title: 'A price-led ad that still looks premium',
    client: 'Fragrance brand',
    format: 'Performance ad · 4:5',
    ratio: '4/5',
    image: campaignImages.sundressMist,
    art: 'halftone',
    artTone: 'blue',
  },
  {
    id: 'biopods-campaign',
    category: 'brand',
    title: 'Laundry, styled like a fashion campaign',
    client: 'Home care brand',
    format: 'Campaign photography · 4:5',
    ratio: '4/5',
    image: campaignImages.biopodsPortrait,
    art: 'sun',
    artTone: 'peach',
  },
]
