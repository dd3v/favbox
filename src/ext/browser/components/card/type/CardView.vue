<template>
  <div
    class="group relative w-full max-w-sm overflow-hidden rounded-md border border-solid border-gray-100 bg-white shadow-sm transition-transform duration-300 ease-in-out hover:-translate-y-1 dark:border-neutral-900 dark:bg-neutral-950"
  >
    <a
      :href="bookmark.url"
      target="_blank"
    >
      <bookmark-image :bookmark="bookmark" />
      <div class="flex items-center bg-black/80 p-1">
        <bookmark-favicon
          :bookmark="bookmark"
          class="size-5 fill-white"
        />
        <span class="mx-2 truncate text-xs font-thin text-white">
          {{ bookmark.domain }}
        </span>
      </div>
      <div class="p-1">
        <h1 class="break-words text-sm text-black dark:text-white">
          {{ bookmark.title }}
        </h1>
        <p class="break-words py-2 text-xs text-gray-700 dark:text-neutral-500">
          {{ bookmark.description }}
        </p>
        <div class="flex flex-wrap gap-1">
          <app-badge
            v-for="(value, key) in bookmark.tags"
            :key="key"
          >
            {{ value }}
          </app-badge>
        </div>
      </div>
    </a>
    <slot name="actions" />
  </div>
</template>

<script setup>
import BookmarkFavicon from '@/ext/browser/components/BookmarkFavicon.vue';
import BookmarkImage from '@/ext/browser/components/card/BookmarkImage.vue';
import AppBadge from '@/components/app/AppBadge.vue';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});
</script>
