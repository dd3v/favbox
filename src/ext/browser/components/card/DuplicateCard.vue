<template>
  <div
    class="group relative w-full min-w-xs overflow-hidden rounded border border-gray-200 bg-white p-3 shadow-xs hover:shadow-sm transition-shadow dark:border-neutral-700 dark:bg-neutral-900"
  >
    <div class="flex items-center justify-between w-full text-gray-900 dark:text-neutral-100">
      <div class="flex items-center gap-x-3 min-w-0 flex-1">
        <BookmarkFavicon
          :bookmark="bookmark"
          class="size-4 fill-gray-700 dark:fill-gray-100"
        />
        <div class="min-w-0">
          <div class="flex items-center gap-x-2 min-w-0 overflow-hidden">
            <a
              :href="bookmark.url"
              target="_blank"
              class="focus-visible:ring-2 focus-visible:ring-blue-500 rounded text-sm text-black dark:text-white no-underline hover:no-underline truncate"
            >
              {{ bookmark.title }}
            </a>
            <span class="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 truncate">ID:{{ bookmark.id }}</span>
          </div>
          <p class="text-xs dark:text-neutral-500">
            {{ bookmark.domain }}
          </p>
          <div class="flex flex-wrap gap-x-1 gap-y-1 mt-1">
            <AppBadge
              v-for="(value, key) in bookmark.tags"
              :key="key"
              class="text-xs px-1.5 py-0.5 truncate max-w-[60px]"
            >
              {{ value }}
            </AppBadge>
          </div>
        </div>
      </div>
      <button
        v-tooltip.bottom-start="{ content: 'Delete' }"
        class="ml-2 p-1 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
        aria-label="Delete duplicate"
        @click="$emit('onDelete', bookmark)"
      >
        <CarbonTrashCan class="size-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BookmarkFavicon from '@/ext/browser/components/BookmarkFavicon.vue';
import AppBadge from '@/components/app/AppBadge.vue';
import CarbonTrashCan from '~icons/carbon/trash-can';

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
