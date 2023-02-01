<template>
  <div class="flex w-full overflow-y-hidden">
    <nav-sidebar :items="tabs" v-model="currentTab">
      <template v-slot:header
        ><img src="@/assets/icons/icon128.png" class="mt-2 h-6 w-6" alt="logo"
      /></template>
      <template v-slot:footer>
        <button @click="toggleTheme">THEME</button>
      </template>
    </nav-sidebar>
    <div class="sticky top-0 flex h-full" v-for="(items, key) in filters" :key="key">
      <filter-list
        class="w-48"
        :items="items"
        v-model="conditions[key]"
        v-if="currentTab === key"
      />
    </div>
    <div class="flex h-screen w-full flex-col overflow-y-hidden bg-[#FBFBFB] px-2">
      <div class="sticky top-0 z-10 flex flex-row space-x-4 bg-[#FBFBFB] px-3 py-2">
        <search-term v-model="conditions.term" />
        <sort-direction v-model="conditions.sort" />
        <filter-options
          :options="options"
          @delete:option="handleDeleteOption"
          @delete:all="deleteAllOptions"
        />
        <display-type v-model="view" />
      </div>
      <infinite-scroll  @scroll:end="paginate" :limit="50" ref="scroll">
        <bookmark-layout :displayType="view" class="px-3 py-2">
          <component
            :is="displayComponent"
            v-for="(bookmark, key) in bookmarks"
            :bookmark="bookmark"
            :key="key"
          >
            <template v-slot:actions>
              <div class="visible absolute top-2 right-2 group-hover:visible">
                <button
                  @click="remove"
                  class="m-1 rounded-full bg-[#E37878] p-1.5 uppercase leading-tight text-white shadow-lg transition duration-150 ease-in-out hover:shadow-lg focus:bg-[#E37878] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#E37878] active:shadow-lg"
                >
                  <trash-icon class="h-4 w-4" />
                </button>
                <button
                  @click="tools.open(0, bookmark)"
                  class="m-1 rounded-full bg-gray-800 p-1.5 uppercase leading-tight text-white shadow-lg transition duration-150 ease-in-out hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg"
                >
                  <newspaper-icon class="h-4 w-4" />
                </button>
                <button
                  @click="tools.open(1, bookmark)"
                  class="m-1 rounded-full bg-gray-800 p-1.5 uppercase leading-tight text-white shadow-lg transition duration-150 ease-in-out hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg"
                >
                  <pencil-square-icon class="h-4 w-4" />
                </button>
              </div>
            </template>
          </component>
        </bookmark-layout>
      </infinite-scroll>
    </div>
    <bookmark-tools ref="tools" />
  </div>
</template>
<script setup>
import {
  toRaw, reactive, ref, watch, computed,
} from 'vue';
import {
  NewspaperIcon,
  TrashIcon,
  FolderOpenIcon,
  HashtagIcon,
  GlobeAltIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline';
import NavSidebar from '@/components/NavSidebar.vue';
import FilterList from '@/components/FilterList.vue';
import BookmarkCard from '@/components/bookmark/BookmarkCard.vue';
import Bookmark from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import { getBookmarkFolders } from '@/helpers/folders';
import SearchTerm from '@/components/search/SearchTerm.vue';
import SortDirection from '@/components/search/SortDirection.vue';
import FilterOptions from '@/components/search/FilterOptions.vue';
import DisplayType from '@/components/search/DisplayType.vue';
import BookmarkList from '@/components/bookmark/BookmarkList.vue';
import BookmarkTools from '@/components/BookmarkTools.vue';
import BookmarkMasonry from '@/components/bookmark/BookmarkMasonry.vue';
import BookmarkLayout from '@/components/bookmark/BookmarkLayout.vue';
import InfiniteScroll from '@/components/InfiniteScroll.vue';

const view = ref(localStorage.getItem('displayType') ?? 'masonry');
const currentTab = ref('folders');
const tabs = [
  { value: 'folders', icon: FolderOpenIcon },
  { value: 'tags', icon: HashtagIcon },
  { value: 'domains', icon: GlobeAltIcon },
];
const scroll = ref(null);
const bookmarks = ref([]);
await initStorage();
const bookmark = new Bookmark();

const defaultConditions = {
  tags: [],
  folders: [],
  domains: [],
  sort: 'desc',
  term: '',
};
const conditions = reactive({ ...defaultConditions });
console.warn(conditions);
const options = ref([]);
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
  get: () => {
    switch (view.value) {
      case 'card':
        return BookmarkCard;
      case 'list':
        return BookmarkList;
      case 'masonry':
        return BookmarkMasonry;
      default:
        return BookmarkMasonry;
    }
  },
});
const tools = ref('');
const toggleTheme = () => console.warn('toggle theme');
const paginate = async (skip) => {
  try {
    console.warn('load', skip);
    bookmarks.value.push(...(await bookmark.search(toRaw(conditions), skip, 50)));
  } catch (e) {
    console.warn(e);
  }
};
watch(currentTab, () => console.warn(currentTab));
watch(view, () => localStorage.setItem('displayType', view.value));
watch(
  conditions,
  async () => {
    options.value = Object.entries({
      tags: conditions.tags,
      domains: conditions.domains,
      folders: conditions.folders,
    })
      .flatMap(([type, arr]) => arr.map((name) => ({ name, type })))
      .sort((a, b) => a.name.localeCompare(b.name));
    bookmarks.value = await bookmark.search(toRaw(conditions));
    scroll.value.scrollUp();
  },
  { immediate: true, deep: true },
);
</script>
<style scoped></style>
