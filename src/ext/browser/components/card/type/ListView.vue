<template>
  <div
    v-motion-slide-visible-once-bottom
    class="group relative min-h-min w-full overflow-hidden rounded-md border border-solid border-gray-100 bg-white p-3 shadow-sm dark:border-neutral-900 dark:bg-neutral-950"
  >
    <a
      :href="bookmark.url"
      target="_blank"
      class="w-full"
    >
      <div
        class="mb-2 inline-flex items-center text-sm text-black dark:text-white"
      >
        <bookmark-favicon
          :bookmark="bookmark"
          class="mr-1 size-4 fill-gray-700 text-sm dark:fill-gray-100"
        />
        {{ bookmark.title }}
      </div>
      <div class="flex flex-col">
        <span class="text-xs text-gray-900 dark:text-neutral-100">{{
          bookmark.domain
        }}</span>
        <p class="my-2 break-words text-xs text-gray-700 dark:text-neutral-500">
          {{ bookmark.description }}
        </p>
        <div class="flex space-x-2">
          <app-badge
            v-for="(value, key) in bookmark.tags"
            :key="key"
          >{{ value }}</app-badge>
        </div>
      </div>
    </a>
    <slot name="actions" />
  </div>
</template>
<script setup>
import { computed } from 'vue';
import AppBadge from '@/components/app/AppBadge.vue';
import BookmarkFavicon from '@/ext/browser/components/BookmarkFavicon.vue';

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
