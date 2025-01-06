<script setup>
import ThemeToggle from './ThemeToggle.vue';

const navItems = [
  { name: '首页', href: '/' },
  { name: '博客', href: '/blog' },
  { name: '微圈', href: '/microcircle' },
  { name: '标签', href: '/tags' },
  { name: '关于', href: '/about' },
];
</script>

<template>
  <nav class="bg-cream-100 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex-shrink-0">
          <a href="/" class="text-2xl font-bold text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
            My Blog
          </a>
        </div>
        <div class="hidden md:flex md:items-center md:space-x-6">
          <div class="flex items-center space-x-4">
            <a
              v-for="item in navItems"
              :key="item.name"
              :href="item.href"
              class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {{ item.name }}
            </a>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  </nav>
</template>
