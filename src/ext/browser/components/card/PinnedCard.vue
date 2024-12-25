<template>
  <div
    class="group relative min-h-min w-full overflow-hidden rounded-md border border-solid p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
    :class="[active ? 'bg-gray-100 dark:bg-neutral-600' : 'bg-white dark:bg-neutral-950']"
  >
    <div class="mb-1 flex items-center text-sm text-black dark:text-white">
      {{ bookmark.title }}
    </div>
    <div class="mt-2 flex items-center justify-between text-xs text-black dark:text-white">
      <div class="flex items-center space-x-2">
        <bookmark-favicon
          :bookmark="bookmark"
          class="size-3"
        />
        <span>{{ bookmark.domain }}</span>
      </div>
      <div class="flex items-center">
        <UitCalender class="mr-1" />
        <span>{{ formatDate(bookmark.updatedAt) }}</span>
      </div>
    </div>

    <div class="absolute right-2 top-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
      <div class="flex space-x-2">
        <button
          title="Pin bookmark"
          class="-translate-y-8 rounded-md p-1.5 text-white opacity-100 shadow-md transition-transform delay-100 duration-300 ease-out group-hover:translate-y-2 group-hover:opacity-100"
          :class="[
            bookmark.pinned === 0 ? 'bg-black' : 'bg-purple-500 '
          ]"
          @click="$emit('pin', bookmark)"
        >
          <CarbonPin class="size-4" />
        </button>
        <button
          title="Open"
          class="-translate-y-8 rounded-md bg-black p-1.5 text-white opacity-100 shadow-md transition-transform delay-100 duration-500 ease-out group-hover:translate-y-2 group-hover:opacity-100"
          @click="$emit('open', bookmark)"
        >
          <CarbonNewTab class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';

import CarbonPin from '~icons/carbon/pin';
import CarbonNewTab from '~icons/carbon/new-tab';
import UitCalender from '~icons/uit/calender';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['remove', 'pin', 'edit']);

const formatDate = (date) => new Date(date).toLocaleDateString();

const bookmark = computed({
  get: () => props.bookmark,
});
</script>
