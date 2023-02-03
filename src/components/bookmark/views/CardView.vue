<template>
  <div
    class="group relative w-full max-w-sm overflow-hidden rounded-md border border-solid bg-white shadow-sm transition-transform duration-300 ease-in-out hover:-translate-y-1 dark:border-neutral-700 dark:bg-neutral-800"
  >
    <a :href="bookmark.url" target="_blank">
      <v-lazy-image
        class="w-full object-cover object-center"
        :src="bookmark.image ?? placeholder"
        :alt="bookmark.title"
        @error="errorHandler"
      />
      <div class="flex items-center bg-gray-900 p-1">
        <bookmark-favicon :favicon="bookmark.favicon" class="h-3 w-3" :key="bookmark.id" />
        <span class="mx-3 text-xs font-semibold text-white">{{ bookmark.domain }}</span>
      </div>
      <div class="px-3 py-4">
        <span class="break-words text-sm font-semibold text-gray-900 dark:text-neutral-100"
          >{{ bookmark.title }}
        </span>
        <p class="py-2 text-gray-700 dark:text-neutral-300">
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
import { computed, watch, ref } from 'vue';
import placeholderDark from '@/assets/placeholder_dark.svg';
import placeholderLight from '@/assets/placeholder.svg';
import { useDark } from '@vueuse/core';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});
const bookmark = computed({
  get: () => props.bookmark,
});
const placeholder = ref(useDark().value ? placeholderDark : placeholderLight);
const errorHandler = () => {
  bookmark.value.image = placeholder;
};
watch(() => useDark().value, () => {
  placeholder.value = useDark().value ? placeholderDark : placeholderLight;
});
</script>
<style scoped>
.v-lazy-image {
  filter: blur(5px);
  transition: filter 1.1s;
  will-change: filter;
}
.v-lazy-image-loaded {
  filter: blur(0);
}
</style>
