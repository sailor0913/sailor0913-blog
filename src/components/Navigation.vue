<script setup>
import ThemeToggle from './ThemeToggle.vue';
import { ref } from 'vue';

const isMenuOpen = ref(false);

const navItems = [
  { name: '首页', href: '/' },
  { name: '博客', href: '/blog' },
  { name: '微圈', href: '/microcircle' },
  { name: '标签', href: '/tags' },
  { name: '关于', href: '/about' },
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
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

        <!-- 桌面端导航 -->
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

        <!-- 移动端菜单按钮 -->
        <div class="flex items-center md:hidden">
          <ThemeToggle class="mr-2" />
          <button
            @click="toggleMenu"
            class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
            aria-label="Toggle menu"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 移动端下拉菜单 -->
      <div
        v-show="isMenuOpen"
        class="md:hidden"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a
            v-for="item in navItems"
            :key="item.name"
            :href="item.href"
            class="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* 添加过渡动画 */
.md\:hidden {
  transition: all 0.3s ease-in-out;
}
</style>
