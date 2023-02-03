<template>
  <div class="h-auto w-72 space-y-5 bg-[#FBFBFB] p-3 dark:bg-neutral-900">
    <div class="flex justify-between">
      <h4 class="text-xl font-semibold dark:text-white">FavBox</h4>
      <div class="flex self-end">
        <button
          @click="openApp"
          class="group relative inline-flex items-center justify-center overflow-hidden rounded-md border border-rose-400 p-2 py-1 font-medium text-rose-400 shadow-md transition duration-300 ease-out"
        >
          <span
            class="ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-rose-400 text-white duration-300 group-hover:translate-x-0"
          >
           <star-icon class="h-4 w-4"/>
          </span>
          <span
            class="ease absolute flex h-full w-full items-center justify-center text-rose-400 transition-all duration-300 group-hover:translate-x-full"
            >OPEN</span
          >
          <span class="invisible relative">Open App</span>
        </button>
      </div>
    </div>
    <div><bookmark-form v-model="bookmark" :folders="folders" @save="handleSave" /></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BookmarkForm from '@/components/bookmark/BookmarkForm.vue';
import tagHelper from '@/helpers/tags';
import { getBookmarkFolders } from '@/helpers/folders';
import { StarIcon } from '@heroicons/vue/24/solid';

const folders = await getBookmarkFolders();
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const bookmark = ref({
  title: tab.title,
  url: tab.url,
  favicon: tab.favIconUrl,
  folder: null,
  tags: [],
});
const handleSave = async () => {
  try {
    await chrome.bookmarks.create({
      title: tagHelper.toString(bookmark.value.title, bookmark.value.tags),
      parentId: bookmark.value.folder.id,
      url: bookmark.value.url,
    });
    window.close();
  } catch (e) {
    console.warn(e);
  }
};
const openApp = () => chrome.tabs.create({ url: '/app.html', index: tab.index + 1 });
</script>
<style>
html,
body {
  width: 18rem !important;
}
</style>
