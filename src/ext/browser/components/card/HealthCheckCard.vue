<template>
  <div class="group relative w-full rounded-md border border-solid bg-white shadow-sm dark:border-neutral-900 dark:bg-neutral-950">
    <a
      :href="bookmark.url"
      target="_blank"
    >
      <div class="flex w-full items-center space-x-5 p-5 text-gray-900 dark:text-neutral-100">
        <div>
          <AppBadge
            color="yellow"
          >
            {{ bookmark.httpStatus }}
          </AppBadge>
        </div>
        <div>
          <bookmark-favicon
            :bookmark="bookmark"
            class="size-5 fill-gray-700 dark:fill-gray-100"
          />
        </div>
        <div>
          <h1 class="text-sm font-semibold text-black dark:text-white"> {{ bookmark.title }}</h1>
          <p class="text-xs dark:text-neutral-500">{{ bookmark.domain }}</p>
        </div>
      </div>
      <div class="my-1 ml-5 text-gray-900 dark:text-neutral-100" />
    </a>
    <button
      title="Delete"
      class="absolute right-2 top-2 rounded-md bg-red-500 p-1.5 text-white opacity-0 shadow-md transition-opacity duration-150 ease-out group-hover:opacity-100"
      @click="$emit('onDelete', bookmark)"
    >
      <CarbonTrashCan class="size-4" />
    </button>
  </div>
</template>

<script setup>
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';
import AppBadge from '@/components/app/AppBadge.vue';
import { getStatusMessage } from '@/helpers/httpStatus';
import CarbonTrashCan from '~icons/carbon/trash-can';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

</script>
