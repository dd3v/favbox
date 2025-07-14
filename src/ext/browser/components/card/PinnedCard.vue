<template>
  <div
    class="group relative min-h-min w-full overflow-hidden rounded-md border border-solid p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
    :class="activeClass"
  >
    <div class="mb-1 flex items-center text-sm text-black dark:text-white">
      {{ bookmark.title }}
    </div>
    <div class="flex items-center justify-between text-xs text-black dark:text-white mt-2">
      <div class="flex items-center gap-x-2 min-w-0">
        <bookmark-favicon
          :bookmark="bookmark"
          class="size-3"
        />
        <span class="truncate">{{ bookmark.domain }}</span>
      </div>
      <div class="flex items-center text-xs text-gray-400 flex-shrink-0 ml-2">
        <CarbonTime class="mr-1" />
        <span class="mr-1">Last viewed:</span>
        <span>{{ new Date(bookmark.updatedAt).toLocaleString() }}</span>
      </div>
    </div>

    <div class="absolute right-2 top-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
      <div class="flex gap-x-2">
        <button
          v-tooltip.bottom-start="{ content: 'Unpin bookmark'}"
          aria-label="Unpin bookmark"
          class="-translate-y-8 rounded-md p-1.5 text-white opacity-100 shadow-md transition-transform delay-100 duration-300 ease-out group-hover:translate-y-2 group-hover:opacity-100"
          :class="[
            bookmark.pinned === 0 ? 'bg-black' : 'bg-purple-500 '
          ]"
          @click="$emit('pin', bookmark)"
        >
          <CarbonPin class="size-4" />
        </button>
        <button
          v-tooltip.bottom-start="{ content: 'Open'}"
          aria-label="Open bookmark"
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
import BookmarkFavicon from '@/ext/browser/components/BookmarkFavicon.vue';
import CarbonPin from '~icons/carbon/pin';
import CarbonNewTab from '~icons/carbon/new-tab';
import CarbonTime from '~icons/carbon/time';

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

const activeClass = computed(() => (props.active ? 'bg-gray-100 dark:bg-neutral-600' : 'bg-white dark:bg-neutral-950'));

</script>
