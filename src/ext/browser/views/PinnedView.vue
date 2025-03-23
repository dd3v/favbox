<template>
  <div class="flex h-screen">
    <div class="w-1/3 space-y-3 border-r border-gray-300 bg-white dark:border-neutral-900 dark:bg-black">
      <div class="relative w-full p-2">
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
      </div>
      <AppInfiniteScroll
        ref="scroll"
        class="h-full overflow-y-auto"
        :limit="50"
        @scroll:end="paginate"
      >
        <ul class="w-full cursor-pointer space-y-2 px-2 pb-20">
          <li
            v-for="bookmark in bookmarks"
            :key="bookmark.id"
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
    <div class="flex h-screen flex-1 flex-col items-center justify-center overflow-y-auto bg-white px-2 dark:bg-black">
      <TextEditor
        v-if="currentBookmark?.id"
        v-model="currentBookmark.notes"
      />
      <div
        v-else
        class="flex flex-1 flex-col items-center justify-center p-5"
      >
        <AppSpinner v-if="loading" />
        <span
          v-else
          class="text-2xl font-thin text-black dark:text-white"
        >
          Your local storage is currently empty. Please pin bookmarks to get started.
        </span>
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
import AppSpinner from '@/components/app/AppSpinner.vue';
import PhMagnifyingGlassLight from '~icons/ph/magnifying-glass-light';

const bookmarkStorage = new BookmarkStorage();
const scroll = ref(null);
const bookmarks = ref([]);
const searchTerm = ref('');
const currentBookmark = ref(null);
const skip = ref(0);
const loading = ref(true);

const fetchBookmarks = async (offset = 0, search = '') => {
  try {
    return await bookmarkStorage.getPinnedBookmarks(offset, 50, search);
  } catch (e) {
    console.error(e);
    return [];
  }
};

const open = (bookmark) => {
  window.open(bookmark.url, '_blank');
};

const pin = async (bookmark) => {
  try {
    await bookmarkStorage.updatePinStatusById(bookmark.id, 0);
    bookmarks.value = await fetchBookmarks(skip.value, searchTerm.value);
    currentBookmark.value = null;
  } catch (e) {
    console.error(e);
  }
};

const openEditor = (bookmark) => {
  currentBookmark.value = bookmark;
};

const paginate = async (offset) => {
  skip.value = offset;
  const newBookmarks = await fetchBookmarks(offset);
  bookmarks.value.push(...newBookmarks);
};

watch(searchTerm, async () => {
  bookmarks.value = await fetchBookmarks(0, searchTerm.value);
  currentBookmark.value = null;
  scroll.value?.scrollUp();
});

watch(
  currentBookmark,
  async (current, previous) => {
    if (current?.id !== previous?.id || current?.notes !== previous?.notes) {
      try {
        await bookmarkStorage.updateNotesById(current.id, current.notes);
      } catch (e) {
        console.error(e);
      }
    }
  },
  { deep: true },
);

onMounted(async () => {
  loading.value = true;
  bookmarks.value = await fetchBookmarks();
  loading.value = false;
});
</script>
