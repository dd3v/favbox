<template>
  <div class="flex h-screen">
    <div
      class="w-1/3 space-y-3 border-r border-gray-300 bg-white dark:border-neutral-900 dark:bg-black"
    >
      <div class="relative w-full p-2">
        <label for="title">
          <input
            id="title"
            v-model="searchTerm"
            type="text"
            placeholder="Search something.."
            class="h-9 w-full rounded-md border-gray-200 pl-7 text-xs text-gray-700 shadow-sm outline-none focus:border-gray-300 focus:ring-0 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white focus:dark:border-neutral-700"
          >
          <span class="pointer-events-none absolute inset-y-0 left-1 grid w-10 place-content-center text-black dark:text-white">
            <PhMagnifyingGlassLight />
          </span>
        </label>
      </div>
      <AppInfiniteScroll
        ref="scroll"
        class="h-full overflow-y-auto"
        :limit="50"
        @scroll:end="paginate"
      >
        <ul class="w-full cursor-pointer space-y-2 px-2 pb-20">
          <li
            v-for="(bookmark, key) in bookmarks"
            :key="key"
            @click="openEditor(bookmark)"
          >
            <PinnedCard
              :bookmark="bookmark"
              :active="bookmark.id === currentBookmark?.id"
              @open="open"
              @pin="pin"
            />
          </li>
        </ul>
      </AppInfiniteScroll>
    </div>
    <div class="h-screen flex-1 overflow-y-auto bg-white px-2 dark:bg-black">
      <TextEditor
        v-if="currentBookmark?.id"
        v-model="currentBookmark.notes"
      />
      <div
        v-if="bookmarks.length === 0"
        class="m-5 flex h-5/6 flex-col items-center justify-center space-y-3 p-5"
      >
        <span class="text-2xl font-thin text-black dark:text-white">Your local storage is currently empty. Please pin  bookmarks to get started.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import BookmarkStorage from '@/storage/bookmark';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import PinnedCard from '@/ext/browser/components/card/PinnedCard.vue';
import TextEditor from '@/ext/browser/components/TextEditor.vue';
import PhMagnifyingGlassLight from '~icons/ph/magnifying-glass-light';

const bookmarkStorage = new BookmarkStorage();
const scroll = ref(null);
const bookmarks = ref([]);
const searchTerm = ref('');
const currentBookmark = ref(null);

const open = (bookmark) => {
  window.open(bookmark.url, '_blank');
};

const pin = (bookmark) => {
  const status = bookmark.pinned ? 0 : 1;
  bookmark.pinned = status;
  try {
    bookmarkStorage.updatePinStatusById(bookmark.id, status);
  } catch (e) {
    console.error(e);
  } finally {
    bookmarks.value = bookmarks.value.filter((item) => item.id !== bookmark.id);
  }
};

const openEditor = (bookmark) => {
  currentBookmark.value = bookmark;
  console.warn(currentBookmark);
};

const paginate = async (skip) => {
  try {
    bookmarks.value.push(
      ...(await bookmarkStorage.getPinnedBookmarks(skip, 50)),
    );
  } catch (e) {
    console.error(e);
  }
};

watch(searchTerm, async () => {
  try {
    bookmarks.value = await bookmarkStorage.getPinnedBookmarks(0, 50, searchTerm.value);
    currentBookmark.value = null;
    scroll.value?.scrollUp();
  } catch (e) {
    console.error(e);
  }
});

watch(
  currentBookmark,
  async (current, previous) => {
    if (Object.is(current, previous) && current.id === previous.id) {
      try {
        console.warn('saving notes..', currentBookmark.value.id, currentBookmark.value.notes);
        await bookmarkStorage.updateNotesById(currentBookmark.value.id, currentBookmark.value.notes);
      } catch (e) {
        console.error(e);
      }
    }
  },
  {
    deep: true,
  },
);

onMounted(async () => {
  bookmarks.value = await bookmarkStorage.getPinnedBookmarks();
});
</script>
