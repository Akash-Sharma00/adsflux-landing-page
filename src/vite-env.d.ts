/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Endpoint that receives contact form submissions (JSON POST). Optional. */
  readonly VITE_CONTACT_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
