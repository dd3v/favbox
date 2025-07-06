<template>
  <div class="relative inset-0 flex h-full min-h-64 min-w-96 flex-col">
    <div class="flex items-center justify-between bg-white p-3 dark:bg-black">
      <div class="flex items-center gap-3">
        <div class="flex size-[48px] items-center justify-center rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-[18px] font-bold text-white shadow-md dark:bg-gradient-to-r dark:from-gray-100 dark:to-gray-300 dark:text-black">
          <RiBookmarkFill class="size-6" />
        </div>
        <h4 class="font-sans text-xl font-semibold tracking-tight dark:text-white">
          FavBox
        </h4>
      </div>
      <div class="group relative inline-flex items-center justify-center">
        <div class="absolute inset-0 animate-pulse rounded-md bg-gradient-to-r from-red-500 via-blue-500 via-cyan-500 via-purple-500 to-green-500 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-100 group-hover:blur-md group-hover:duration-200" />
        <button
          class="group relative inline-flex items-center justify-center rounded-md border border-black bg-white px-4 py-2 text-xs font-medium text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:text-white hover:shadow-lg dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
          @click="openApp"
        >
          Open App
          <RiArrowRightSLine class="-mr-1 ml-2 mt-0.5 size-2.5 text-black transition-colors duration-200 group-hover:text-white dark:text-white dark:group-hover:text-black" />
        </button>
      </div>
    </div>
    <div
      v-if="exists"
      class="flex grow flex-col items-center justify-center bg-white p-6 dark:bg-neutral-950"
    >
      <div class="mb-8 flex flex-col items-center justify-center text-center">
        <div class="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <LineMdConfirm class="size-8 text-gray-900 dark:text-white" />
        </div>
        <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          Bookmark Exists!
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          This page is already saved in your bookmarks
        </p>
      </div>

      <button
        class="group relative w-auto cursor-pointer overflow-hidden rounded-md border border-black bg-black p-2 px-6 text-center font-semibold text-white transition-all duration-300 hover:border-gray-800 dark:border-white dark:bg-white dark:text-black dark:hover:border-gray-200"
        @click="openAppWithBookmark"
      >
        <div class="flex items-center gap-2">
          <div
            class="size-2 scale-100 rounded-lg bg-white transition-all duration-300 group-hover:scale-[100.8] dark:bg-black"
          />
          <span
            class="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0"
          >
            View in FavBox
          </span>
        </div>

        <div
          class="absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 text-black opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100 dark:text-white"
        >
          <span class="whitespace-nowrap">View in FavBox</span>
          <RiArrowRightLine class="size-4" />
        </div>
      </button>
    </div>
    <div
      v-else
      class="flex grow bg-white p-3 dark:bg-black"
    >
      <BookmarkForm
        class="w-full"
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
import BookmarkStorage from '@/storage/bookmark';
import LineMdConfirm from '~icons/line-md/confirm?width=24px&height=24px';
import RiBookmarkFill from '~icons/ri/bookmark-fill';
import RiArrowRightLine from '~icons/ri/arrow-right-line';
import RiArrowRightSLine from '~icons/ri/arrow-right-s-line';

const tags = await (new BookmarkStorage()).getTags();
const folders = await bookmarkHelper.buildFolderUITree();
const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
const exists = ref(false);
const bookmarkId = ref(null);

try {
  const bookmarks = await browser.bookmarks.search({ url: tab.url });
  exists.value = bookmarks.length > 0;
  if (bookmarks.length > 0) {
    const [firstBookmark] = bookmarks;
    bookmarkId.value = firstBookmark.id;
  }
} catch (e) {
  exists.value = false;
  console.error(e);
}

console.debug('folders', folders);
console.debug('tab', tab);
console.debug('bookmarkId', bookmarkId.value);

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
    window.close();
  }
};

const openApp = () => {
  browser.tabs.create({ url: '/ext/browser/index.html', index: tab.index + 1 });
  window.close();
};

const openAppWithBookmark = () => {
  const url = `/ext/browser/index.html#/bookmarks/${bookmarkId.value}`;
  browser.tabs.create({ url, index: tab.index + 1 });
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
