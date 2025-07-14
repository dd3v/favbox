<template>
  <div
    class="group relative w-full max-w-md overflow-hidden rounded-xl border border-solid border-gray-200 bg-white shadow-md p-0 flex flex-col dark:border-neutral-800 dark:bg-neutral-950"
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
      <div class="flex flex-wrap items-center gap-2 my-2">
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
      class="block"
    >
      <BookmarkImage
        :bookmark="bookmark"
        rounded="rounded-md"
        class="w-full px-4 py-1 aspect-video object-cover bg-white dark:bg-neutral-950"
      >
        <template #loading>
          <AppSpinner class="size-6 mx-auto my-8" />
        </template>
      </BookmarkImage>
    </a>
    <!-- footer -->
    <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 mt-2 dark:border-neutral-800">
      <span class="flex items-center gap-1 text-xs text-gray-400 dark:text-neutral-500 min-w-0 truncate">
        <BookmarkFavicon
          :bookmark="bookmark"
          class="w-3 h-3"
        />
        <span class="truncate">{{ bookmark.domain }}</span>
      </span>
      <slot name="actions" />
      <span class="flex items-center text-xs text-gray-400 dark:text-neutral-500 ml-2 whitespace-nowrap">
        <PhCalendarBlank class="mr-1 align-text-bottom" />
        {{ new Date(bookmark.dateAdded).toISOString().slice(0, 10) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import BookmarkImage from '@/ext/browser/components/card/BookmarkImage.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';
import AppBadge from '@/components/app/AppBadge.vue';
import BookmarkFavicon from '@/ext/browser/components/BookmarkFavicon.vue';
import PhCalendarBlank from '~icons/ph/calendar-blank';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});
</script>
