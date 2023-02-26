<template>
  <div
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
          :favicon="bookmark.favicon"
          class="h-0 w-0 md:mr-1 md:h-4 md:w-4"
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
        <div class="flex flex-wrap space-x-1 space-y-1">
          <bookmark-tag
            v-for="(tag, key) in bookmark.tags"
            :key="key"
            :value="tag"
          />
        </div>
      </div>
    </a>
    <slot name="actions" />
  </div>
</template>
<script setup>
import BookmarkTag from '@/components/bookmark/BookmarkTag.vue';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});
</script>
