<!-- eslint-disable max-len -->
<template>
  <div
    class="relative mb-6 w-full border border-solid max-w-sm overflow-hidden  bg-white shadow-sm"
  >
    <a :href="bookmark.url" target="_blank">
      <v-lazy-image
        class=""
        :src="bookmark.image ?? ''"
        :alt="bookmark.title"
      />
      <div class="flex items-center bg-gray-600 p-1">
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
