<template>
  <div class="relative inset-0 flex h-full min-h-64 min-w-96 flex-col">
    <div class="flex justify-between bg-white p-3 align-middle dark:bg-black">
      <h4 class="font-sans text-xl font-medium dark:text-white">
        FavBox
      </h4>
      <div class="group relative inline-flex items-center justify-center gap-4 self-end">
        <div
          class="absolute inset-1 rounded-md bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-100 group-hover:blur-md group-hover:duration-200"
        />
        <button
          class="group relative inline-flex items-center justify-center rounded-md bg-black px-3 py-1.5 text-xs text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-900"
          @click="openApp"
        >
          Open
          <svg
            aria-hidden="true"
            viewBox="0 0 10 10"
            height="10"
            width="10"
            fill="none"
            class="-mr-1 ml-2 mt-0.5 stroke-white stroke-2"
          >
            <path
              d="M0 5h7"
              class="opacity-0 transition group-hover:opacity-100"
            />
            <path
              d="M1 1l4 4-4 4"
              class="transition group-hover:translate-x-[3px]"
            />
          </svg>
        </button>
      </div>
    </div>
    <div
      v-if="exists"
      class="flex grow items-center justify-center bg-white p-3 shadow-inner dark:bg-neutral-950"
    >
      <div class="flex items-center justify-center">
        <LineMdConfirm class="text-black dark:text-white" />
        <span class="ml-2 text-lg font-thin text-black dark:text-white">This bookmark already exists!</span>
      </div>
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
import initStorage from '@/storage/idb/idb';
import BookmarkStorage from '@/storage/bookmark';
import LineMdConfirm from '~icons/line-md/confirm?width=24px&height=24px';

await initStorage();
const tags = await (new BookmarkStorage()).getTags();
const folders = await bookmarkHelper.getFolders();
const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
const exists = ref(false);

try {
  const bookmarks = await browser.bookmarks.search({ url: tab.url });
  exists.value = bookmarks.length > 0;
} catch (e) {
  exists.value = false;
  console.error(e);
}

console.debug('folders', folders);
console.debug('tab', tab);

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
onMounted(async () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>
