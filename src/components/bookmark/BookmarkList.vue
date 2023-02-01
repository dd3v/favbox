<!-- eslint-disable max-len -->
<template>
  <div class="relative flex min-h-min w-full rounded-md border border-solid bg-white p-3 shadow-sm">
    <a :href="bookmark.url" target="_blank" class="w-full">
      <div class="mb-2 inline-flex items-center text-base font-semibold text-gray-900">
        <bookmark-favicon :favicon="bookmark.favicon" class="h-0 w-0 md:mr-1 md:h-4 md:w-4" />
        {{ bookmark.title }}
      </div>
      <div class="flex flex-col">
        <span class="text-xs">{{ bookmark.domain }}</span>
        <p class="my-2 text-sm text-gray-700">
          {{ bookmark.description }}
        </p>
        <div class="flex flex-wrap">
          <bookmark-tag v-for="(tag, key) in bookmark.tags" :value="tag" :key="key" />
        </div>
      </div>
    </a>
    <slot name="actions" />
  </div>
</template>
<script setup>
import BookmarkTag from '@/components/bookmark/BookmarkTag.vue';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});
</script>
