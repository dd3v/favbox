<template>
  <div
    v-motion-fade-visible-once
    class="group relative w-full max-w-sm overflow-hidden rounded-md border border-solid bg-white shadow-sm transition-transform duration-300 ease-in-out hover:-translate-y-1 dark:border-neutral-700 dark:bg-neutral-800"
  >
    <a
      :href="bookmark.url"
      target="_blank"
    >
      <bookmark-image :bookmark="bookmark" />
      <div class="flex items-center bg-black/80 p-2">
        <bookmark-favicon
          :bookmark="bookmark"
          class="size-3 fill-white"
        />
        <span class="mx-3 truncate text-xs font-semibold text-white">{{
          bookmark.domain
        }}</span>
      </div>
      <div class="p-2">
        <h1 class="break-words text-sm font-semibold text-gray-900 dark:text-neutral-100">{{ bookmark.title }}
        </h1>
        <p class="break-words py-2 text-gray-700 dark:text-neutral-300">
          {{ bookmark.description }}
        </p>
        <div class="flex flex-wrap gap-1">
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
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';
import BookmarkImage from '@/ext/browser/components/card/BookmarkImage.vue';
import AppBadge from '@/components/app/AppBadge.vue';

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
