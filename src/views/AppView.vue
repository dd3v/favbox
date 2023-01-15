<!-- eslint-disable max-len -->
<template>
  <div class="mx-auto">
    <div class="flex flex-row">
      <div
        class="flex h-screen sticky top-0 w-50 px-4 bg-white border-r dark:bg-gray-900 dark:border-gray-700"
      >
        <div class="flex flex-col items-center justify-center h-screen vh-screen">
          <filter-tabs v-model="tab" :items="tabs" />
        </div>
      </div>

      <filter-list :items="folders" v-if="tab === 'categories'"/>
      <filter-list v-if="tab === 'tags'"/>
      <filter-list v-if="tab === 'domains'"/>

      <div
        class="grid grid-flow-row gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-5 py-5 bg-neutral-100"
      >
        <div
          class="w-full inline-block max-w-sm overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 duration-300 hover:-translate-y-1 cursor-pointer"
          v-for="(bookmark, key) in bookmarks"
          :key="key"
        >
          <img class="object-cover object-center w-full h-56" :src="bookmark.image" alt="avatar" />

          <div class="flex items-center px-6 py-3 bg-gray-900">
            <img :src="bookmark.favicon" alt="image" width="16" />

            <h1 class="mx-3 text-sm font-semibold text-white">{{ bookmark.domain }}</h1>
          </div>

          <div class="px-6 py-4">
            <h1 class="text-md font-semibold text-gray-800 dark:text-white">
              {{ bookmark.title }}
            </h1>

            <p class="py-2 text-gray-700 dark:text-gray-400">
              {{ bookmark.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import FilterTabs from '@/components/FilterTabs.vue';
import FilterList from '@/components/FilterList.vue';
import Bookmark from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import { getBookmarkFolders } from '@/helpers/folders';
import {
  toRaw, reactive, ref, watch,
} from 'vue';

const tabs = [
  { label: 'Categories', value: 'categories', icon: '' },
  { label: 'Tags', value: 'tags', icon: '' },
  { label: 'Domains', value: 'domains', icon: '' },
];
const tab = ref();
const bookmarks = ref([]);
await initStorage();
const bookmark = new Bookmark();

const defaultConditions = {
  tags: [],
  sort: 'desc',
  term: '',
};
const conditions = reactive({ ...defaultConditions });
console.warn(conditions);
bookmarks.value = await bookmark.search(toRaw(conditions));
const folders = await getBookmarkFolders();
const tags = await bookmark.getTags();
const domains = await bookmark.getDomains();
console.log(tags);
console.warn(domains);
console.log(folders);
watch(tab, () => console.warn(tab));
</script>
<style></style>
