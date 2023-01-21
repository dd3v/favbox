<!-- eslint-disable max-len -->
<template>
  <div
    class="group relative w-full max-w-sm overflow-hidden rounded-md border border-solid bg-white shadow-sm transition-transform duration-300 ease-in-out hover:-translate-y-1 dark:bg-gray-800"
  >
    <a :href="bookmark.url" target="_blank">
      <v-lazy-image
        class="h-56 w-full object-cover object-center"
        :src="bookmark.image ?? ''"
        :alt="bookmark.title"
      />
      <div class="flex items-center bg-gray-900 p-1">
        <img :src="bookmark.favicon" alt="favicon" class="w-4" />
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

    <div class="invisible absolute top-0 right-0 group-hover:visible">
      <button
        @click="remove"
        class="m-1 rounded-full bg-red-800 p-1.5 uppercase leading-tight text-white shadow-lg transition duration-150 ease-in-out hover:bg-red-900 hover:shadow-lg focus:bg-red-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-900 active:shadow-lg"
      >
        <trash-icon class="h-4 w-4" />
      </button>
      <button
        @click="preview"
        class="m-1 rounded-full bg-gray-800 p-1.5 uppercase leading-tight text-white shadow-lg transition duration-150 ease-in-out hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg"
      >
        <newspaper-icon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
<script setup>
import VLazyImage from 'v-lazy-image';
import { NewspaperIcon, TrashIcon } from '@heroicons/vue/24/outline';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const remove = () => console.warn('remoe handler');
const preview = () => console.warn('preview handler');
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
