<template>
  <div class="flex">
    <nav-sidebar :items="tabs" v-model="currentTab">
      <template v-slot:header>
        LOGO
      </template>
      <template v-slot:footer>
        <button @click="toggleTheme">THEME</button>
      </template>
    </nav-sidebar>
    <div class="sticky top-0 flex h-full" v-for="(items, key) in filters" :key="key">
      <filter-list :items="items" v-model="conditions[key]" v-if="currentTab === key" />
    </div>
    <div class="flex flex-col px-2">
      <div class="sticky top-0 z-10 flex flex-row space-x-4 bg-white px-0 py-2">
        <search-term v-model="conditions.term" />
        <sort-direction v-model="conditions.sort" />
        <filter-options
          :options="options"
          @delete:option="handleDeleteOption"
          @delete:all="deleteAllOptions"
        />
        <display-type v-model="view" />
      </div>
      <div class="grid grid-cols-1 gap-x-6 gap-y-10 py-3 sm:grid-cols-1 md:grid-cols-4">
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
  domains: ['codepen.io', 'marketplace.visualstudio.com'],
  sort: 'desc',
  term: '',
};
const conditions = reactive({ ...defaultConditions });
console.warn(conditions);
const options = ref([]);
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
const handleDeleteOption = (option) => {
  const index = conditions[option.type].indexOf(option.name);
  if (index !== -1) {
    conditions[option.type].splice(index, 1);
  }
};
const deleteAllOptions = () => {
  conditions.domains = [];
  conditions.folders = [];
  conditions.tags = [];
};
const toggleTheme = () => console.warn('toggle theme');
watch(currentTab, () => console.warn(currentTab));
watch(
  conditions,
  () => {
    options.value = Object.entries({
      tags: conditions.tags,
      domains: conditions.domains,
      folders: conditions.folders,
    })
      .flatMap(([type, arr]) => arr.map((name) => ({ name, type })))
      .sort((a, b) => a.name.localeCompare(b.name));
    console.warn(conditions);
  },
  { immediate: true },
);
watch(view, () => console.warn(view));
</script>
<style scoped></style>
