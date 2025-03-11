// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import expressiveCode from 'astro-expressive-code';
import theme from './src/styles/code-theme.json';

import mdx from '@astrojs/mdx';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';

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

  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          content: {
            type: 'text',
            value: '#'
          }
        }
      ],
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['external', 'noreferrer']
        }
      ]
    ]
  },

  integrations: [expressiveCode({ themes: [theme] }), mdx()]
});
