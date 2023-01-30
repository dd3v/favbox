<!-- eslint-disable max-len -->
<template>
  <div class="group relative flex">
    <a :href="bookmark.url" target="_blank" class="flex w-full flex-row">
      <div
        class="flex min-h-min w-full flex-col rounded-md border border-solid bg-white shadow-sm md:flex-row"
      >
        <v-lazy-image
          class="rounded-t object-cover md:h-auto md:w-32 md:rounded-none md:rounded-l"
          :src="bookmark.image ?? ''"
          :alt="bookmark.title"
        />
        <div class="flex w-full flex-col justify-start p-3">
          <div class="mb-2 flex flex-row items-center text-base font-semibold text-gray-900">
           <bookmark-favicon :favicon="bookmark.favicon" class="mr-1 h-4 w-4 shrink-0"  />
            {{ bookmark.title }}
          </div>
          <span class="text-xs">{{ bookmark.domain }}</span>
          <p class="my-2 text-sm text-gray-700">
            {{ bookmark.description }}
          </p>
          <div class="flex flex-wrap">
            <span
              v-for="(tag, key) in bookmark.tags"
              :key="key"
              class="mr-1 mt-1 w-auto whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </a>
        <slot name="actions"/>
  </div>
</template>
<script setup>
import VLazyImage from 'v-lazy-image';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});
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
