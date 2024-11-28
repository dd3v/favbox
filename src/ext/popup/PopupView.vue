<template>
  <div class="h-auto w-72 bg-white shadow-sm dark:bg-black">
    <div class="flex justify-between border-b px-3 py-2 dark:border-neutral-800">
      <h4 class="font-sans text-xl dark:text-white">
        FavBox
      </h4>
      <div class="flex self-end">
        <button
          class="group relative inline-flex items-center justify-center overflow-hidden rounded-md border border-black bg-black p-2 py-1 font-medium text-black shadow-md transition duration-300 ease-out dark:bg-white"
          @click="openApp"
        >
          <span
            class="ease absolute inset-0 flex size-full -translate-x-full items-center justify-center bg-black text-white duration-300 group-hover:translate-x-0 dark:bg-white"
          >
            <EvaBookmarkFill class="size-5 text-white dark:text-black" />
          </span>
          <span
            class="ease absolute flex size-full items-center justify-center text-xs text-white transition-all duration-300 group-hover:translate-x-full dark:text-black"
          >Get started</span>
          <span class="invisible relative">Get started</span>
        </button>
      </div>
    </div>
    <bookmark-form
      v-model="bookmark"
      :folders="folders"
      :tags="tags"
      class="px-3 py-5"
      @submit="handleSubmit"
    />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import BookmarkForm from '@/components/bookmark/BookmarkForm.vue';
import tagHelper from '@/helpers/tags';
import bookmarkHelper from '@/helpers/bookmark';
import initStorage from '@/storage/idb/idb';
import BookmarkStorage from '@/storage/bookmark';

import EvaBookmarkFill from '~icons/eva/bookmark-fill';

await initStorage();
const storage = new BookmarkStorage();

const tags = await storage.getTags();
const folders = await bookmarkHelper.getFolders();
const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
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

const handleSubmit = async (data) => {
  try {
    if (data.id === null) {
      await browser.bookmarks.create({
        title: tagHelper.toString(data.title, data.tags),
        parentId: data.folder.id,
        url: data.url,
      });
    } else {
      await browser.bookmarks.update(String(data.id), {
        title: tagHelper.toString(data.title, data.tags),
        url: data.url,
      });
      console.warn({
        title: tagHelper.toString(data.title, data.tags),
        url: data.url,
      });
      await browser.bookmarks.move(String(data.id), { parentId: data.folder.id });
    }
    if (import.meta.env.MODE === 'production') {
      window.close();
    }
  } catch (e) {
    console.error(e);
  }
};
const openApp = () => {
  browser.tabs.create({ url: '/ext/browser/index.html', index: tab.index + 1 });
  window.close();
};
onMounted(async () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>
