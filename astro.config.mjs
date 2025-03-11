// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import expressiveCode from 'astro-expressive-code';
import theme from './src/styles/code-theme.json';

import mdx from '@astrojs/mdx';

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

  integrations: [expressiveCode({ themes: [theme] }), mdx()]
});