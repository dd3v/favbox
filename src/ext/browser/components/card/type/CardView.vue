<template>
  <div
    class="group relative w-full max-w-md mx-auto overflow-hidden rounded-xl border border-solid border-gray-200 bg-white shadow-sm p-0 flex flex-col dark:border-neutral-800 dark:bg-neutral-950"
  >
    <div class="px-4 pt-4 flex-1 flex flex-col">
      <a
        :href="bookmark.url"
        target="_blank"
        rel="noopener noreferrer"
        class="break-words text-sm text-black dark:text-white line-clamp-3"
      >
        {{ bookmark.title }}
      </a>
      <div
        v-if="bookmark.tags && bookmark.tags.length"
        class="flex flex-wrap items-center gap-2 my-2"
      >
        <AppBadge
          v-for="(value, key) in bookmark.tags"
          :key="key"
        >
          {{ value }}
        </AppBadge>
      </div>
    </div>
    <!-- preview image -->
    <a
      :href="bookmark.url"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Open link: ${bookmark.title}`"
      class="block px-4 py-1"
    >
      <div class="w-full aspect-video rounded-md bg-gray-100 dark:bg-neutral-900 flex items-center justify-center overflow-hidden">
        <img
          v-if="bookmark.image && !imageError"
          :src="String(bookmark.image)"
          :alt="bookmark.title"
          class="w-full h-full object-cover rounded-md"
          @error="imageError = true"
        >
        <div
          v-else
          class="flex items-center justify-center w-full h-full"
        >
          <BookmarkFavicon
            :bookmark="bookmark"
            class="max-w-8 max-h-8"
          />
        </div>
      </div>
    </a>
    <!-- footer -->
    <div class="flex flex-col gap-2 px-4 py-3 border-t border-gray-200 mt-2 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
      <span class="flex items-center gap-1 text-xs text-gray-400 dark:text-neutral-500 min-w-0 truncate">
        <BookmarkFavicon
          :bookmark="bookmark"
          class="w-3 h-3 shrink-0"
        />
        <span class="truncate">{{ bookmark.domain }}</span>
      </span>
      <div class="flex items-center gap-2 sm:order-last">
        <slot name="actions" />
        <span class="flex items-center text-xs text-gray-400 dark:text-neutral-500 whitespace-nowrap">
          <PhCalendarBlank class="mr-1 align-text-bottom shrink-0" />
          {{ new Date(bookmark.dateAdded).toISOString().slice(0, 10) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppBadge from '@/components/app/AppBadge.vue';
import BookmarkFavicon from '@/ext/browser/components/BookmarkFavicon.vue';
import PhCalendarBlank from '~icons/ph/calendar-blank';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const imageError = ref(false);
</script>
