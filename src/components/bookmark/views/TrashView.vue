<template>
  <div
    class="flex w-full rounded-md border border-solid bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
  >
    <a
      :href="bookmark.url"
      target="_blank"
      class="grow"
    >
      <div
        class="flex items-center space-x-1 font-semibold text-gray-900 dark:text-neutral-100"
      >
        <bookmark-favicon
          :bookmark="bookmark"
          class="size-4 fill-gray-700 dark:fill-gray-100"
        />
        <span>{{ bookmark.title }}</span>
      </div>

      <div class="my-1 text-gray-900 dark:text-neutral-100">{{
        bookmark.domain
      }}</div>
    </a>
    <slot
      name="actions"
      class="ml-auto flex items-center"
    />
  </div>
</template>
<script setup>
import { computed } from 'vue';
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
