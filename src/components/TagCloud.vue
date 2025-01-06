<!-- TagCloud.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { CollectionEntry } from 'astro:content';

interface Props {
  posts: CollectionEntry<'blog'>[];
}

const props = defineProps<Props>();
const tags = ref<{ name: string; count: number }[]>([]);

onMounted(() => {
  const tagCount = new Map<string, number>();
  
  props.posts.forEach(post => {
    post.data.tags?.forEach(tag => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });

  tags.value = Array.from(tagCount.entries()).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count);
});
</script>

<template>
  <div class="mb-8">
    <h2 class="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">标签云</h2>
    <div class="flex flex-wrap gap-2">
      <a
        v-for="tag in tags"
        :key="tag.name"
        :href="`/tags/${tag.name}`"
        class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
      >
        {{ tag.name }} ({{ tag.count }})
      </a>
    </div>
  </div>
</template>
