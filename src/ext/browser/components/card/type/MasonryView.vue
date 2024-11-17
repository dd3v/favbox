<template>
  <div
    v-motion-slide-visible-once-bottom
    class="group relative mb-3 min-h-max w-full max-w-md overflow-hidden rounded-md border border-solid bg-white shadow-sm dark:border-neutral-900 dark:bg-neutral-950"
  >
    <a
      :href="bookmark.url"
      target="_blank"
    >
      <bookmark-image :bookmark="bookmark" />
      <div class="flex items-center bg-black/80 p-1">
        <bookmark-favicon
          :bookmark="bookmark"
          class="size-4 fill-white"
        />
        <span class="mx-2 truncate text-xs font-thin text-white">{{
          bookmark.domain
        }}</span>
      </div>
      <div class="p-1">
        <h1 class="break-words text-sm font-semibold text-black dark:text-white">{{ bookmark.title }}</h1>
        <p class="break-words py-2 text-xs text-gray-700 dark:text-neutral-500">
          {{ bookmark.description }} <br>
          <pre>
            {{ bookmark }}
            {{ bookmark.pinned }} - {{ bookmark.httpStatus }} - {{ bookmark.image }} - {{ bookmark.folderName }} - {{ bookmark.folder }}
          </pre>
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
import AppBadge from '@/components/app/AppBadge.vue';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';
import BookmarkImage from '@/ext/browser/components/card/BookmarkImage.vue';

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
