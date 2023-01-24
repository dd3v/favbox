<template>
  <div class="flex w-full">
    <nav-sidebar :items="tabs" v-model="currentTab">
      <template v-slot:header> LOGO </template>
      <template v-slot:footer>
        <button @click="toggleTheme">THEME</button>
      </template>
    </nav-sidebar>
    <div class="sticky top-0 flex h-full" v-for="(items, key) in filters" :key="key">
      <filter-list :items="items" v-model="conditions[key]" v-if="currentTab === key" />
    </div>
    <div class="flex h-screen w-full  flex-col overflow-y-auto px-2">
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
      <div class="grid w-full grid-cols-1 gap-x-6 gap-y-10 py-3 sm:grid-cols-1 md:grid-cols-1">
        <component
          :is="displayComponent"
          v-for="(bookmark, key) in bookmarks"
          :bookmark="bookmark"
          :key="key"
        >
          <template v-slot:actions>
            <div class="visible absolute top-0 right-0 group-hover:visible">
              <button
                @click="remove"
                class="m-1 rounded-full bg-red-800 p-1.5 uppercase leading-tight text-white shadow-lg transition duration-150 ease-in-out hover:bg-red-900 hover:shadow-lg focus:bg-red-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-900 active:shadow-lg"
              >
                <trash-icon class="h-4 w-4" />
              </button>
              <button
                @click="tools.open()"
                class="m-1 rounded-full bg-gray-800 p-1.5 uppercase leading-tight text-white shadow-lg transition duration-150 ease-in-out hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg"
              >
                <newspaper-icon class="h-4 w-4" />
              </button>
            </div>
          </template>
        </component>
      </div>
    </div>
    <bookmark-tools ref="tools"/>
  </div>
</template>
<script setup>
import {
  toRaw, reactive, ref, watch, computed,
} from 'vue';
import {
  NewspaperIcon, TrashIcon, FolderOpenIcon, HashtagIcon, GlobeAltIcon,
} from '@heroicons/vue/24/outline';
import NavSidebar from '@/components/NavSidebar.vue';
import FilterList from '@/components/FilterList.vue';
import BookmarkCard from '@/components/BookmarkCard.vue';
import Bookmark from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import { getBookmarkFolders } from '@/helpers/folders';
import SearchTerm from '@/components/SearchBar/SearchTerm.vue';
import SortDirection from '@/components/SearchBar/SortDirection.vue';
import FilterOptions from '@/components/SearchBar/FilterOptions.vue';
import DisplayType from '@/components/SearchBar/DisplayType.vue';
import BookmarkList from '@/components/BookmarkList.vue';
import BookmarkTools from '@/components/BookmarkTools.vue';

const view = ref('list');
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
const displayComponent = computed({
  get: () => (view.value === 'card' ? BookmarkCard : BookmarkList),
});
const tools = ref('');
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
