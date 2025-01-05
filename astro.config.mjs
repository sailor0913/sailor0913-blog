// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import tailwind from '@astrojs/tailwind';

import markdoc from '@astrojs/markdoc';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), tailwind(), markdoc(), mdx(), sitemap()]
});