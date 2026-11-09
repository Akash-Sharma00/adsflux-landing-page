import type { ResponsiveImage } from '@/types/media'
import { scalvoImageManifest } from './generated/scalvoImageManifest'

/**
 * Scalvo UI layers for the home page's animated mock-up. Kept apart from assetRegistry.ts (with its own generated
 * manifest) because only the code-split Scalvo section uses them, so this metadata stays out of the main bundle.
 *
 * Captured from the hero mock-up on https://www.scalvo.io/ — the names and numbers in them are Scalvo's
 * ILLUSTRATIVE example data, not Adsflux clients or results. The dark set uses Scalvo's own `.dark` theme tokens;
 * scalvo.io doesn't show a dark mode, so treat it as a concept until Scalvo confirms one ships.
 */

type ManifestEntry = (typeof scalvoImageManifest)[keyof typeof scalvoImageManifest]

const toImage = (entry: ManifestEntry, alt: string): ResponsiveImage => ({
  id: entry.id,
  alt,
  width: entry.width,
  height: entry.height,
  dominantColor: entry.dominantColor,
  hasAlpha: entry.hasAlpha,
  avif: entry.variants.avif,
  webp: entry.variants.webp,
})

export type ScalvoLayer = { light: ResponsiveImage; dark: ResponsiveImage }

/** Only the light workspace carries alt text — it describes the whole composition; the other layers repeat it. */
export const scalvoLayers = {
  workspace: {
    light: toImage(
      scalvoImageManifest.scalvoWorkspaceLight,
      'Scalvo’s campaign workspace: a campaign with creator submissions marked agency review, changes requested and approved, a brand-review card with Approve and Request changes buttons, and a progress card reading 18 of 24 approved. Illustrative example data.',
    ),
    dark: toImage(scalvoImageManifest.scalvoWorkspaceDark, ''),
  },
  approval: {
    light: toImage(scalvoImageManifest.scalvoApprovalLight, ''),
    dark: toImage(scalvoImageManifest.scalvoApprovalDark, ''),
  },
  progress: {
    light: toImage(scalvoImageManifest.scalvoProgressLight, ''),
    dark: toImage(scalvoImageManifest.scalvoProgressDark, ''),
  },
} as const satisfies Record<string, ScalvoLayer>
