<template>
  <div class="group relative w-full rounded-md border border-solid bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
    <a
      :href="bookmark.url"
      target="_blank"
    >
      <div class="flex w-full items-center space-x-5 p-5 text-gray-900 dark:text-neutral-100">
        <div>
          <AppBadge
            v-tooltip="{ text: getStatusMessage(bookmark.httpStatus), position: 'right' }"
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
          <h1 class=" font-semibold"> {{ bookmark.title }}</h1>

          <p class="text-xs">{{ bookmark.domain }}</p>

        </div>

      </div>
      <div class="my-1 ml-5 text-gray-900 dark:text-neutral-100" />
    </a>
    <button
      v-tooltip="{ text: 'Delete', position: 'left', delay: 500 }"
      class="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 shadow-md transition-opacity duration-150 ease-out group-hover:opacity-100"
      @click="$emit('onDelete', bookmark)"
    >
      <trash-icon class="size-4" />
    </button>
  </div>
</template>

<script setup>
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';
import AppBadge from '@/components/app/AppBadge.vue';
import { getStatusMessage } from '@/helpers/httpStatus';
import TrashIcon from '@/components/icons/TrashIcon.vue';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

</script>
