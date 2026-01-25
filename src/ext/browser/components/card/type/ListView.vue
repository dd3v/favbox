<template>
  <div
    class="group relative min-h-min w-full overflow-hidden rounded-md border border-solid border-gray-200 bg-white p-3 shadow-xs dark:border-neutral-900 dark:bg-neutral-950"
  >
    <a
      :href="bookmark.url"
      rel="noopener noreferrer"
      target="_blank"
      class="w-full block"
    >
      <div class="mb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <span class="text-sm text-black dark:text-white leading-snug">{{ bookmark.title }}</span>
        <span class="flex items-center text-xs text-gray-400 dark:text-neutral-500 shrink-0">
          <PhCalendarBlank class="text-xs mr-1" />
          {{ new Date(bookmark.dateAdded).toISOString().slice(0, 10) }}
        </span>
      </div>
      <div class="flex flex-col gap-2.5">
        <span class="text-xs text-gray-700 dark:text-neutral-100 flex items-center gap-1.5">
          <BookmarkFavicon
            :bookmark="bookmark"
            class="w-3 h-3 shrink-0"
          />
          {{ bookmark.domain }}
        </span>
        <p
          v-if="bookmark.description"
          class="break-words text-xs text-gray-700 dark:text-neutral-500 leading-relaxed"
        >
          {{ bookmark.description }}
        </p>
        <div
          v-if="bookmark.tags && bookmark.tags.length"
          class="flex flex-wrap gap-2"
        >§
          <AppBadge
            v-for="(value, key) in bookmark.tags"
            :key="key"
          >
            {{ value }}
          </AppBadge>
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
