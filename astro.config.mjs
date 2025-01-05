// @ts-check
import { defineConfig } from "astro/config";

import vue from "@astrojs/vue";

import tailwind from "@astrojs/tailwind";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), vue(), mdx()],
  legacy: {
    collections: true,
  },
});
