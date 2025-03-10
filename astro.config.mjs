// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  site: 'https://retrocast.top/',
  trailingSlash: 'always',
  output: 'static',

  vite: {
    plugins: [tailwindcss()]
  },

  experimental: {
    contentIntellisense: true
  },

  integrations: [expressiveCode()]
});