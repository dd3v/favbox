<template>
  <div
    v-motion-slide-visible-once-bottom
    class="group relative flex min-h-min w-full rounded-md border border-solid bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
  >
    <a
      :href="bookmark.url"
      target="_blank"
      class="w-full"
    >
      <div
        class="mb-2 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-neutral-100"
      >
        <bookmark-favicon
          :bookmark="bookmark"
          class="size-0 fill-gray-700 dark:fill-gray-100 md:mr-1 md:size-4"
        />
        {{ bookmark.title }}
      </div>
      <div class="flex flex-col">
        <span class="text-xs text-gray-900 dark:text-neutral-100">{{
          bookmark.domain
        }}</span>
        <p class="my-2 break-words text-gray-700 dark:text-neutral-300">
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
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';

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
