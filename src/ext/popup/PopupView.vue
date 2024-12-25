<template>
  <div class="light-bg relative inset-0 flex h-full min-h-64 min-w-96 flex-col">
    <div class="flex  justify-between bg-white/80 p-3 align-middle backdrop:blur-xl">
      <h4 class="font-sans text-xl font-thin dark:text-white">
        FavBox
      </h4>
      <div class="self-end">
        <button @click="openApp">
          Open
        </button>
      </div>
    </div>
    <div class="size-full bg-gray-50/90 p-3 backdrop-blur-xl">
      <BookmarkForm
        :title="tab.title"
        :favicon="tab.favIconUrl"
        :url="tab.url"
        :folders="folders"
        :tags="tags"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import BookmarkForm from '@/ext/popup/components/BookmarkForm.vue';
import bookmarkHelper from '@/helpers/bookmark';
import initStorage from '@/storage/idb/idb';
import BookmarkStorage from '@/storage/bookmark';

await initStorage();
const tags = await (new BookmarkStorage()).getTags();
const folders = await bookmarkHelper.getFolders();
const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

console.warn('folders', folders);
console.warn('tab', tab);

const handleSubmit = async (data) => {
  console.warn('data', data);
  try {
    await browser.bookmarks.create({
      title: data.title,
      parentId: data.parentId,
      url: data.url,
    });
  } catch (e) {
    console.error(e);
  } finally {
    // window.close();
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
