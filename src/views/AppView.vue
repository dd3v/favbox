<!-- eslint-disable max-len -->
<template>
  <filter-tabs/>
</template>
<script setup>
import FilterTabs from '@/components/FilterTabs.vue';
// import FilterList from '@/components/FilterList.vue';
import Bookmark from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import { getBookmarkFolders } from '@/helpers/folders';
import {
  toRaw, reactive, ref, watch,
} from 'vue';

// const tabs = [
//   { label: 'Categories', value: 'categories', icon: '' },
//   { label: 'Tags', value: 'tags', icon: '' },
//   { label: 'Domains', value: 'domains', icon: '' },
// ];
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
