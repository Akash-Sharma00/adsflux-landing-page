/**
 * Deters casual saving of campaign media: no context menu ("Save image/video as…", "Open in new tab", "Copy
 * image") and no drag-out on images and videos. Text and links keep their normal context menu.
 *
 * This is a deterrent, not protection — anything a browser displays has been downloaded to it. The other layers:
 * `-webkit-touch-callout` / `-webkit-user-drag` in base.css (iOS long-press, Safari drag), `controlsList="nodownload"`
 * + no picture-in-picture/casting on videos (AutoplayVideo), and the vercel.json redirect that stops asset URLs
 * being opened directly in a tab or hotlinked from other sites.
 */
const MEDIA_SELECTOR = 'img, picture, video'

function blockOnMedia(event: Event) {
  if (event.target instanceof Element && event.target.closest(MEDIA_SELECTOR)) event.preventDefault()
}

/** Call once at startup. Returns a cleanup function (for tests / HMR). */
export function protectMedia(root: Document = document): () => void {
  root.addEventListener('contextmenu', blockOnMedia)
  root.addEventListener('dragstart', blockOnMedia)
  return () => {
    root.removeEventListener('contextmenu', blockOnMedia)
    root.removeEventListener('dragstart', blockOnMedia)
  }
}
