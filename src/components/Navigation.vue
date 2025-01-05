<script setup>
const navItems = [
  { name: '首页', href: '/' },
  { name: '博客', href: '/blog' },
  { name: '标签', href: '/tags' },
  { name: '关于', href: '/about' },
];
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex-shrink-0">
          <a href="/" class="text-2xl font-bold text-gray-900 dark:text-white">
            My Blog
          </a>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-center space-x-4">
            <a
              v-for="item in navItems"
              :key="item.name"
              :href="item.href"
              class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {{ item.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
