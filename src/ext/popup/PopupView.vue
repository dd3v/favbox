<template>
  <div class="h-auto w-72 space-y-5 bg-gray-50 p-3 dark:bg-neutral-900">
    <div class="flex justify-between">
      <h4 class="font-sans text-xl dark:text-white">
        FavBox
      </h4>
      <div class="flex self-end">
        <button
          class="group relative inline-flex items-center justify-center overflow-hidden rounded-md border border-rose-400 p-2 py-1 font-medium text-rose-400 shadow-md transition duration-300 ease-out"
          @click="openApp"
        >
          <span
            class="ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-rose-400 text-white duration-300 group-hover:translate-x-0"
          >
            <heart-icon class="h-4 w-4" />
          </span>
          <span
            class="ease absolute flex h-full w-full items-center justify-center text-rose-400 transition-all duration-300 group-hover:translate-x-full"
          >OPEN</span>
          <span class="invisible relative">Open App</span>
        </button>
      </div>
    </div>
    <div>
      <bookmark-form
        v-model="bookmark"
        :folders="folders"
        :tags="tags"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { HeartIcon } from '@heroicons/vue/24/solid';
import BookmarkForm from '@/components/bookmark/BookmarkForm.vue';
import tagHelper from '@/helpers/tags';
import bookmarkHelper from '@/helpers/bookmarks';
import initStorage from '@/storage/idb/idb';
import BookmarkStorage from '@/storage/bookmark';

await initStorage();
const storage = new BookmarkStorage();

const tags = await storage.getTags();
const folders = await bookmarkHelper.getFolders();
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const bookmark = ref({});
bookmark.value = await storage.getByUrl(tab.url);

if (bookmark.value === null) {
  bookmark.value = {
    id: null,
    title: tab.title,
    url: tab.url,
    favicon: tab.favIconUrl,
    folder: folders[0],
    tags: [],
  };
}

console.warn(bookmark);

const handleSubmit = async (data) => {
  try {
    if (data.id === null) {
      await chrome.bookmarks.create({
        title: tagHelper.toString(data.title, data.tags),
        parentId: data.folder.id,
        url: data.url,
      });
    } else {
      await chrome.bookmarks.update(String(data.id), {
        title: tagHelper.toString(data.title, data.tags),
        url: data.url,
      });
      await chrome.bookmarks.move(String(data.id), { parentId: data.folder.id });
    }
    if (import.meta.env.MODE === 'production') {
      window.close();
    }
  } catch (e) {
    console.error(e);
  }
};
const openApp = () => chrome.tabs.create({ url: '/ext/browser/index.html', index: tab.index + 1 });
onMounted(async () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>
