<!-- eslint-disable max-len -->
<template>
  <div class="w-full max-w-sm overflow-hidden bg-white rounded-md shadow-md dark:bg-gray-800">
    <v-lazy-image
      class="object-cover object-center w-full h-56"
      :src="bookmark.image ?? ''"
      :alt="bookmark.title"
    />
    <div class="flex items-center px-3 py-3 bg-gray-900">
      <img :src="bookmark.favicon" alt="favicon" class="w-4" />
      <span class="mx-3 text-sm font-semibold text-white">{{ bookmark.domain }}</span>
    </div>
    <div class="px-6 py-4">
      <h1 class=" font-semibold text-gray-800 dark:text-white">{{ bookmark.title }}</h1>
      <p class="py-2 text-gray-700 dark:text-gray-400">
        {{ bookmark.description }}
      </p>
    </div>
  </div>
</template>
<script setup>
import VLazyImage from 'v-lazy-image';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});
</script>
<style scoped>
.v-lazy-image {
  opacity: 0;
  transition: opacity 1s;
}
.v-lazy-image-loaded {
  opacity: 1;
}
</style>
