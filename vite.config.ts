import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { analyticsPlugin } from './scripts/vite-plugin-analytics.ts'
import { seoPlugin } from './scripts/vite-plugin-seo.ts'

export default defineConfig({
  plugins: [react(), analyticsPlugin(), seoPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          /**
           * Everything the first page statically needs ships as one chunk. Without this, code shared with
           * several lazy routes (UI primitives, config, motion) is split into many small initial chunks,
           * each costing its own request and gzip overhead.
           */
          groups: [{ name: 'app', tags: ['$initial'] }],
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
})
