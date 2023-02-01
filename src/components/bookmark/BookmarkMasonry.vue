<!-- eslint-disable max-len -->
<template>
  <div class="relative mb-6 w-full max-w-sm overflow-hidden border border-solid bg-white shadow-sm">
    <a :href="bookmark.url" target="_blank">
      <v-lazy-image
        class=""
        :src="bookmark.image ?? placeholder"
        :alt="bookmark.title"
        @error="errorHandler"
      />
      <div class="flex items-center bg-gray-600 p-1">
        <bookmark-favicon :favicon="bookmark.favicon" class="h-4 w-4" />
        <span class="mx-3 text-sm font-semibold text-white">{{ bookmark.domain }}</span>
      </div>
      <div class="px-6 py-4">
        <span class="break-words text-base font-semibold text-gray-800 dark:text-white"
          >{{ bookmark.title }}
        </span>
        <p class="py-2 text-sm text-gray-700 dark:text-gray-400">
          {{ bookmark.description }}
        </p>
      </div>
    </a>
    <slot name="actions" />
  </div>
</template>
<script setup>
import VLazyImage from 'v-lazy-image';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';
import { computed } from 'vue';
import empty from '@/assets/empty.svg';
import notfound from '@/assets/notfound.svg';
import placeholder from '@/assets/placeholder.svg';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const bookmark = computed({
  get: () => props.bookmark,
});

const errorHandler = (e) => {
  console.warn(e);
  bookmark.value.image = notfound;
};
</script>
<style scoped>
.v-lazy-image {
  opacity: 0;
  transition: opacity 1s;
}
.v-lazy-image-loaded {
  opacity: 1;
}
</style>
