<template>
  <div
    class="relative mb-3 min-h-max w-full max-w-sm overflow-hidden border border-solid bg-white shadow-sm"
  >
    <a :href="bookmark.url" target="_blank">
      <v-lazy-image
        class="w-full object-cover object-center"
        :src="bookmark.image ?? placeholder"
        :alt="bookmark.title"
        @error="errorHandler"
      />
      <div class="flex items-center bg-gray-900 p-1">
        <bookmark-favicon :favicon="bookmark.favicon" class="h-3 w-3" />
        <span class="mx-3 text-xs font-semibold text-white">{{ bookmark.domain }}</span>
      </div>
      <div class="px-6 py-4">
        <span class="break-words text-base font-semibold text-gray-900 dark:text-white"
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
import { computed, onMounted } from 'vue';
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

const errorHandler = () => {
  bookmark.value.image = placeholder;
};

onMounted(() => {
});

</script>
<style scoped>
.v-lazy-image {
  opacity: 0;
  transition: opacity 2s;
}
.v-lazy-image-loaded {
  opacity: 1;
}
</style>
