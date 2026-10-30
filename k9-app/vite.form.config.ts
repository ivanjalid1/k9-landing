// Form-only build for form.k9movement.com: `npm run build:form` -> dist-form/
// Uses form.html (Client Portal head) as the index.html template and
// src/main-form.tsx as the entry, so no landing code is bundled.
import { readFileSync } from 'node:fs'
import { defineConfig, mergeConfig, type Plugin } from 'vite'
import baseConfig from './vite.config'

const formHtml: Plugin = {
  name: 'k9-form-html',
  transformIndexHtml: {
    order: 'pre',
    handler: () => readFileSync(new URL('./form.html', import.meta.url), 'utf-8'),
  },
}

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [formHtml],
    define: {
      'import.meta.env.VITE_FORM_ONLY': JSON.stringify('true'),
    },
    build: {
      outDir: 'dist-form',
      emptyOutDir: true,
    },
  }),
)
