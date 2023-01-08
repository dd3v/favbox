<template>
  <h1>Main app</h1>
</template>
<script setup>
import Bookmark from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import { toRaw, reactive } from 'vue';

await initStorage();
const bookmark = new Bookmark();

const defaultConditions = {
  tags: [],
  sort: 'desc',
  term: '',
};
const conditions = reactive({ ...defaultConditions });

console.warn(await bookmark.search(toRaw(conditions)));

</script>
<style></style>
