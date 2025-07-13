<template>
  <div
    class="group relative min-h-min w-full overflow-hidden rounded-md border border-solid border-gray-100 bg-white p-3 shadow-sm dark:border-neutral-900 dark:bg-neutral-950"
  >
    <a
      :href="bookmark.url"
      rel="noopener noreferrer"
      target="_blank"
      class="w-full"
    >
      <div class="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-black dark:text-white">
        <span>{{ bookmark.title }}</span>
        <span class="flex items-center text-xs text-gray-400 dark:text-neutral-500 mt-1 sm:mt-0 sm:ml-2">
          <PhCalendarBlank class="text-xs mr-1 align-text-bottom" />
          {{ new Date(bookmark.dateAdded).toISOString().slice(0, 10) }}
        </span>
      </div>
      <div class="flex flex-col">
        <span class="text-xs text-gray-700 dark:text-neutral-100 flex items-center gap-1">
          <bookmark-favicon
            :bookmark="bookmark"
            class="w-3 h-3"
          />
          {{ bookmark.domain }}
        </span>
        <p class="my-2 break-words text-xs text-gray-700 dark:text-neutral-500">
          {{ bookmark.description }}
        </p>
        <div class="flex flex-wrap gap-2">
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
import PhCalendarBlank from '~icons/ph/calendar-blank';

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
