<template>
  <div class="h-auto w-72 space-y-5 p-3 dark:bg-gray-900">
    <div class="flex justify-between">
      <h4 class="text-xl font-semibold">WebSnap</h4>
      <div class="flex self-end">
        <button
          @click="openApp"
          class="group relative inline-flex items-center justify-center overflow-hidden rounded-md border border-purple-500 p-2 py-1 font-medium text-indigo-600 shadow-sm transition duration-300 ease-out"
        >
          <span
            class="ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-purple-500 text-white duration-300 group-hover:translate-x-0"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
          <span
            class="ease absolute flex h-full w-full items-center justify-center text-purple-500 transition-all duration-300 group-hover:translate-x-full"
            >Open App</span
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
    const response = await chrome.bookmarks.create({
      title: tagHelper.toString(bookmark.value.title, bookmark.value.tags),
      parentId: bookmark.value.folder.id,
      url: bookmark.value.url,
    });
    console.warn(response);
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
