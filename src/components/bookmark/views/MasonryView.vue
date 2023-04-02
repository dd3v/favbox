<template>
  <div
    class="group relative mb-3 min-h-max w-full max-w-sm overflow-hidden rounded-md border border-solid bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
  >
    <a
      :href="bookmark.url"
      target="_blank"
    >
      <v-lazy-image
        class="w-full object-cover object-center"
        :src="bookmark.image ?? placeholder"
        :alt="bookmark.title"
        @error="errorHandler"
      />
      <div class="flex items-center bg-gray-900 p-1">
        <bookmark-favicon
          :favicon="bookmark.favicon"
          class="h-3 w-3"
        />
        <span class="mx-3 text-xs font-semibold text-white">{{
          bookmark.domain
        }}</span>
      </div>
      <div class="px-6 py-4">
        <span
          class="break-words text-sm font-semibold text-gray-900 dark:text-neutral-100"
        >{{ bookmark.title }}
        </span>
        <p class="break-words py-2 text-gray-700 dark:text-neutral-300">
          {{ bookmark.description }}
        </p>
      </div>
    </a>
    <slot name="actions" />
  </div>
</template>
<script setup>
import VLazyImage from 'v-lazy-image';
import { computed, ref, watch } from 'vue';
import { useDark } from '@vueuse/core';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';
import placeholderDark from '@/assets/placeholder_dark.svg';
import placeholderLight from '@/assets/placeholder.svg';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const placeholder = ref(useDark().value ? placeholderDark : placeholderLight);
const bookmark = computed({
  get: () => props.bookmark,
});
const errorHandler = () => {
  bookmark.value.image = placeholder;
};
watch(
  () => useDark().value,
  () => {
    placeholder.value = useDark().value ? placeholderDark : placeholderLight;
  },
);
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
