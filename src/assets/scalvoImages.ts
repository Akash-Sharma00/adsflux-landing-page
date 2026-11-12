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

const WORKSPACE_ALT =
  'Scalvo’s campaign workspace: a campaign with creator submissions marked agency review, changes requested and approved, a brand-review card with Approve and Request changes buttons, and a progress card reading 18 of 24 approved. Illustrative example data.'
const APPROVAL_ALT = 'Scalvo brand-review card with Approve and Request changes buttons. Illustrative example data.'
const PROGRESS_ALT = 'Scalvo progress card reading 18 of 24 approved. Illustrative example data.'

/**
 * Every layer has alt text (for search engines), but only the light workspace is announced: it describes the
 * whole composition, so ScalvoScreens hides the dark layers and the two cards from screen readers.
 */
export const scalvoLayers = {
  workspace: {
    light: toImage(scalvoImageManifest.scalvoWorkspaceLight, WORKSPACE_ALT),
    dark: toImage(scalvoImageManifest.scalvoWorkspaceDark, WORKSPACE_ALT),
  },
  approval: {
    light: toImage(scalvoImageManifest.scalvoApprovalLight, APPROVAL_ALT),
    dark: toImage(scalvoImageManifest.scalvoApprovalDark, APPROVAL_ALT),
  },
  progress: {
    light: toImage(scalvoImageManifest.scalvoProgressLight, PROGRESS_ALT),
    dark: toImage(scalvoImageManifest.scalvoProgressDark, PROGRESS_ALT),
  },
} as const satisfies Record<string, ScalvoLayer>
