<!-- eslint-disable max-len -->
<template>
  <div
    class="group relative w-full max-w-sm overflow-hidden rounded-md border border-solid bg-white shadow-sm transition-transform duration-300 ease-in-out hover:-translate-y-1 dark:bg-gray-800"
  >
    <a :href="bookmark.url" target="_blank">
      <v-lazy-image
        class="h-56 w-full object-cover object-center"
        :src="bookmark.image ?? ''"
        :alt="bookmark.title"
      />
      <div class="flex items-center bg-gray-900 p-1">
        <bookmark-favicon :favicon="bookmark.favicon" class="h-4 w-4"/>
        <span class="mx-3 text-sm font-semibold text-white">{{ bookmark.domain }}</span>
      </div>
      <div class="px-6 py-4">
        <span class="break-words text-base font-semibold text-gray-800 dark:text-white"
          >{{ bookmark.title }}
        </span>
        <p class="py-2 text-sm text-gray-700 dark:text-gray-400">
          {{ bookmark.description }}
        </p>
      </div>
    </a>

    <slot name="actions" />
  </div>
</template>
<script setup>
import VLazyImage from 'v-lazy-image';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';

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
