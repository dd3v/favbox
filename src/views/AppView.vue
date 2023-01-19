<!-- eslint-disable max-len -->
<template>
  <div class="flex">
    <nav-sidebar :items="tabs" v-model="currentTab" />
    <div class="flex" v-for="(items, key) in filters" :key="key">
      <filter-list :items="items" v-model="conditions[key]" v-if="currentTab === key" />
    </div>
    <div class="flex px-4 py-4">
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
  folders: [],
  domains: [],
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
</script>
<style scoped></style>
