<!-- eslint-disable max-len -->
<template>
  <div class="flex">
    <nav-sidebar :items="tabs" />
    <filter-list :items="domains" />
    <div class="flex px-4 py-4">
      <bookmark-card v-for="(bookmark, key) in bookmarks" :key="key"/>
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

const tabs = [
  { label: 'Folder', value: 'folder', icon: FolderOpenIcon },
  { label: 'Tag', value: 'tag', icon: HashtagIcon },
  { label: 'Domain', value: 'domain', icon: GlobeAltIcon },
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
