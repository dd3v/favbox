<template>
  <div
    class="group relative w-full max-w-sm overflow-hidden rounded-md border border-solid bg-white shadow-sm transition-transform duration-300 ease-in-out hover:-translate-y-1 dark:border-neutral-700 dark:bg-neutral-800"
  >
    <a
      :href="bookmark.url"
      target="_blank"
    >
      <bookmark-image :bookmark="bookmark" />
      <div class="flex items-center bg-gray-900 p-1">
        <bookmark-favicon
          :bookmark="bookmark"
          class="h-3 w-3 fill-gray-700 dark:fill-gray-100"
        />
        <span class="mx-3 text-xs font-semibold text-white">{{
          bookmark.domain
        }}</span>
      </div>
      <div class="px-3 py-4">
        <span class="break-words text-sm font-semibold text-gray-900 dark:text-neutral-100">{{ bookmark.title }}
        </span>
        <p class="break-words py-2 text-gray-700 dark:text-neutral-300">
          {{ bookmark.description }}
        </p>
      </div>
    </a>
    <slot name="actions" />
  </div>
</template>
<script setup>
import { computed } from 'vue';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';
import BookmarkImage from '@/components/bookmark/BookmarkImage.vue';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});
const bookmark = computed({
  get: () => props.bookmark,
});
</script>
