<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<!-- eslint-disable max-len -->
<template>
  <div class="flex">
    <nav-sidebar :items="tabs" v-model="currentTab" />
    <div class="flex" v-for="(items, key) in filters" :key="key">
      <filter-list :items="items" v-model="conditions[key]" v-if="currentTab === key" />
    </div>
    <div class="flex flex-col">
      <div class="flex flex-row py-3 space-x-4 pr-3 sticky top-0 bg-white">
        <search-term />
        <sort-direction v-model="conditions.sort"/>
        <filter-options />
        <display-type />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 gap-x-6 gap-y-10">
        <bookmark-card v-for="(bookmark, key) in bookmarks" :bookmark="bookmark" :key="key" />
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  toRaw, reactive, ref, watch,
} from 'vue';
import NavSidebar from '@/components/NavSidebar.vue';
import FilterList from '@/components/FilterList.vue';
import BookmarkCard from '@/components/BookmarkCard.vue';
import { FolderOpenIcon, HashtagIcon, GlobeAltIcon } from '@heroicons/vue/24/outline';
import Bookmark from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import { getBookmarkFolders } from '@/helpers/folders';
import SearchTerm from '@/components/SearchBar/SearchTerm.vue';
import SortDirection from '@/components/SearchBar/SortDirection.vue';
import FilterOptions from '@/components/SearchBar/FilterOptions.vue';
import DisplayType from '@/components/SearchBar/DisplayType.vue';

const view = ref('card');
const currentTab = ref('folders');
const tabs = [
  { value: 'folders', icon: FolderOpenIcon },
  { value: 'tags', icon: HashtagIcon },
  { value: 'domains', icon: GlobeAltIcon },
];

const bookmarks = ref([]);
await initStorage();
const bookmark = new Bookmark();

const defaultConditions = {
  tags: [],
  folders: ['test2', 'test3', 'Новая папка'],
  domains: ['codepen.io'],
  sort: 'desc',
  term: '',
};
const conditions = reactive({ ...defaultConditions });
console.warn(conditions);
bookmarks.value = await bookmark.search(toRaw(conditions));
let folders = await getBookmarkFolders();
folders = folders.map((item) => item.title);
const tags = await bookmark.getTags();
const domains = await bookmark.getDomains();
const filters = reactive({ folders, tags, domains });
console.warn(filters);
console.log(tags);
console.warn(domains);
console.log(folders);
watch(currentTab, () => console.warn(currentTab));
watch(conditions, () => console.warn(conditions));
watch(view, () => console.warn(view));
</script>
<style scoped></style>
