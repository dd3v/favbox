<!-- eslint-disable max-len -->
<template>
  <div class="relative flex">
    <a :href="bookmark.url" target="_blank" class="flex w-full flex-row">
      <div
        class="flex min-h-min w-full flex-col rounded-md border border-solid bg-white shadow-sm md:flex-row"
      >
        <v-lazy-image
          class="rounded-t object-cover object-center md:h-auto md:w-28 md:rounded-none md:rounded-l"
          :src="bookmark.image ?? ''"
          :alt="bookmark.title"
        />
        <div class="flex w-full flex-col justify-start p-3">
          <div class="mb-2 flex flex-row items-center text-base font-semibold text-gray-900">
            <img :src="bookmark.favicon" class="shrink-0 mr-1 h-4 w-4" :alt="bookmark.title" />
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
    <div class="absolute top-0 right-0 flex flex-row">
      <button
        @click="remove"
        class="m-1 rounded-full bg-red-800 p-1.5 uppercase leading-tight text-white shadow-lg transition duration-150 ease-in-out hover:bg-red-900 hover:shadow-lg focus:bg-red-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-900 active:shadow-lg group-hover:visible"
      >
        <trash-icon class="h-4 w-4" />
      </button>
      <button
        @click="preview"
        class="m-1 rounded-full bg-gray-800 p-1.5 uppercase leading-tight text-white shadow-lg transition duration-150 ease-in-out hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg group-hover:visible"
      >
        <newspaper-icon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
<script setup>
import { NewspaperIcon, TrashIcon } from '@heroicons/vue/24/outline';
import VLazyImage from 'v-lazy-image';
// import { NewspaperIcon, TrashIcon } from '@heroicons/vue/24/outline';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

// const remove = () => console.warn('remoe handler');
// const preview = () => console.warn('preview handler');
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
