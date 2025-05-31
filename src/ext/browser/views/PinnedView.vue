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
        @scroll:end="handlePagination"
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
          v-else-if="!loading && bookmarks.length === 0"
          class="text-2xl font-thin text-black dark:text-white"
        >
          Your local storage is currently empty. Please pin bookmarks to get started.
        </span>
        <span
          v-else
          class="text-2xl font-thin text-black dark:text-white"
        >
          📌 Select a bookmark to start editing.
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, useTemplateRef } from 'vue';
import { notify } from 'notiwind';
import BookmarkStorage from '@/storage/bookmark';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import PinnedCard from '@/ext/browser/components/card/PinnedCard.vue';
import TextEditor from '@/ext/browser/components/TextEditor.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';
import PhMagnifyingGlassLight from '~icons/ph/magnifying-glass-light';

const bookmarkStorage = new BookmarkStorage();
const scrollRef = useTemplateRef('scroll');
const bookmarks = ref([]);
const searchTerm = ref('');
const currentBookmark = ref(null);
const skip = ref(0);
const loading = ref(true);

const loadBookmarks = async (options = {}) => {
  const {
    offset = 0,
    search = searchTerm.value,
    append = false,
  } = options;

  try {
    loading.value = true;
    const newBookmarks = await bookmarkStorage.getPinnedBookmarks(offset, search);
    if (append) {
      bookmarks.value.push(...newBookmarks);
    } else {
      bookmarks.value = newBookmarks;
    }
    skip.value = offset;
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    notify(
      { group: 'error', text: 'Error loading data.' },
      import.meta.env.VITE_NOTIFICATION_DURATION,
    );
  } finally {
    loading.value = false;
  }
};

const open = (bookmark) => {
  window.open(bookmark.url, '_blank');
};

const pin = async (bookmark) => {
  try {
    await bookmarkStorage.updatePinStatusById(bookmark.id, 0);
    await loadBookmarks();
    currentBookmark.value = null;
  } catch (error) {
    console.error('Error updating pin status:', error);
    notify(
      { group: 'error', text: 'Error updating bookmark.' },
      import.meta.env.VITE_NOTIFICATION_DURATION,
    );
  }
};

const openEditor = (bookmark) => {
  currentBookmark.value = bookmark;
};

const handlePagination = async (offset) => {
  await loadBookmarks({
    offset,
    append: true,
  });
};

watch(searchTerm, async () => {
  await loadBookmarks({
    offset: 0,
    search: searchTerm.value,
  });
  currentBookmark.value = null;
  scrollRef.value?.scrollUp();
});

watch(
  () => currentBookmark.value?.notes,
  async (newNotes, oldNotes) => {
    if (!currentBookmark.value || newNotes === oldNotes) return;
    try {
      await bookmarkStorage.updateNotesById(currentBookmark.value.id, newNotes);
    } catch (error) {
      console.error('Error updating notes:', error);
      notify({ group: 'error', text: 'Error saving notes.' }, import.meta.env.VITE_NOTIFICATION_DURATION);
    }
  },
);

onMounted(async () => {
  await loadBookmarks();
});
</script>
