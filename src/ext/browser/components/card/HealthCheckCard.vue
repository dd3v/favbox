<template>
  <div class="group relative w-full rounded-md border border-solid bg-white shadow-xs dark:border-neutral-900 dark:bg-neutral-950">
    <div class="flex items-center justify-between w-full p-3 text-gray-900 dark:text-neutral-100">
      <div class="flex items-center gap-x-3 min-w-0 flex-1">
        <AppBadge
          v-tooltip.bottom-start="{ content: getStatusMessage(bookmark.httpStatus) }"
          :color="bookmark.httpStatus === HTTP_STATUS.UNKNOWN_ERROR ? 'yellow' : 'red'"
        >
          {{ bookmark.httpStatus }}
        </AppBadge>
        <bookmark-favicon
          :bookmark="bookmark"
          class="size-4 fill-gray-700 dark:fill-gray-100"
        />
        <div class="min-w-0">
          <a
            :href="bookmark.url"
            target="_blank"
            class="focus-visible:ring-2 focus-visible:ring-blue-500 rounded text-sm text-black dark:text-white no-underline hover:no-underline"
          >
            {{ bookmark.title }}
          </a>
          <p class="text-xs dark:text-neutral-500">
            {{ bookmark.domain }}
          </p>
        </div>
      </div>
      <button
        v-tooltip.bottom-start="{ content: 'Delete'}"
        class="ml-2 p-1 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
        aria-label="Delete bookmark"
        @click="$emit('onDelete', bookmark)"
      >
        <CarbonTrashCan class="size-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import BookmarkFavicon from '@/ext/browser/components/BookmarkFavicon.vue';
import AppBadge from '@/components/app/AppBadge.vue';
import { getStatusMessage, HTTP_STATUS } from '@/helpers/httpStatus';
import CarbonTrashCan from '~icons/carbon/trash-can';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

</script>
