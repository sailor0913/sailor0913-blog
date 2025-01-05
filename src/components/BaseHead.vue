<!-- BaseHead.vue -->
<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'A personal blog built with Astro'
  },
  image: {
    type: String,
    default: '/placeholder-social.jpg'
  }
})
</script>

<template>
  <!-- Global Metadata -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="generator" content={Astro.generator} />

  <!-- Primary Meta Tags -->
  <title>{{ title }}</title>
  <meta name="title" :content="title" />
  <meta name="description" :content="description" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:title" :content="title" />
  <meta property="og:description" :content="description" />
  <meta property="og:image" :content="image" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" :content="title" />
  <meta property="twitter:description" :content="description" />
  <meta property="twitter:image" :content="image" />
</template>
