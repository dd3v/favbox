<template>
  <div class="flex flex-col md:flex-row h-screen md:h-screen">
    <div class="w-full md:w-1/3 gap-y-3 border-b md:border-b-0 md:border-r border-gray-300 bg-white dark:border-neutral-900 dark:bg-black">
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
        class="h-72 md:h-full overflow-y-auto"
        :limit="BOOKMARKS_LIMIT"
        @scroll:end="offset => loadBookmarks({ offset, append: true })"
      >
        <ul
          class="w-full flex flex-col cursor-pointer gap-y-2 px-2 pb-20 mt-1"
          role="listbox"
        >
          <li
            v-for="bookmark in bookmarks"
            :key="`${bookmark.id}-${bookmark.updatedAt}`"
            role="option"
            :aria-selected="bookmark.id === currentBookmarkId"
            tabindex="0"
            class="focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-500 rounded-md"
            @click="openEditor(bookmark)"
            @keydown.enter="openEditor(bookmark)"
          >
            <PinnedCard
              :bookmark="bookmark"
              :active="bookmark.id === currentBookmarkId"
              @open="open"
              @pin="pin"
            />
          </li>
        </ul>
      </AppInfiniteScroll>
    </div>
    <div class="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-white px-2 dark:bg-black h-full md:h-screen">
      <TextEditor
        v-if="currentBookmark"
        v-model="editorNotes"
      />
      <div
        v-else
        class="flex flex-1 flex-col items-center justify-center p-5"
      >
        <AppSpinner v-if="loading" />
        <span
          v-else-if="isEmpty"
          class="text-2xl font-thin text-black dark:text-white"
        >
          🗂️ Your <u>local storage</u> is currently empty. Please pin bookmarks to get started.
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
import { ref, onMounted, watch, useTemplateRef, computed } from 'vue';
import { notify } from 'notiwind';
import BookmarkStorage from '@/storage/bookmark';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import PinnedCard from '@/ext/browser/components/card/PinnedCard.vue';
import TextEditor from '@/ext/browser/components/TextEditor.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';
import PhMagnifyingGlassLight from '~icons/ph/magnifying-glass-light';

const BOOKMARKS_LIMIT = import.meta.env.VITE_BOOKMARKS_PAGINATION_LIMIT;

// State
const bookmarkStorage = new BookmarkStorage();
const scrollRef = useTemplateRef('scroll');
const bookmarks = ref([]);
const searchTerm = ref('');
const currentBookmarkId = ref(null);
const editorNotes = ref('');
const loading = ref(true);

const currentBookmark = computed(() => {
  if (!currentBookmarkId.value) return null;
  return bookmarks.value.find((b) => b.id === currentBookmarkId.value) || null;
});

const isEmpty = computed(() => !loading.value && bookmarks.value.length === 0);

const loadBookmarks = async (options = {}) => {
  const { offset = 0, search = searchTerm.value, append = false } = options;

  try {
    loading.value = true;
    const newBookmarks = await bookmarkStorage.getPinnedBookmarks(offset, BOOKMARKS_LIMIT, search);

    if (append) {
      bookmarks.value.push(...newBookmarks);
    } else {
      bookmarks.value = newBookmarks;
      // Clear current bookmark if it's no longer in the list
      if (currentBookmarkId.value && !newBookmarks.find((b) => b.id === currentBookmarkId.value)) {
        currentBookmarkId.value = null;
      }
    }
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
    if (currentBookmarkId.value === bookmark.id) {
      currentBookmarkId.value = null;
    }
    await loadBookmarks();
  } catch (error) {
    console.error('Error updating pin status:', error);
    notify(
      { group: 'error', text: 'Error updating bookmark.' },
      import.meta.env.VITE_NOTIFICATION_DURATION,
    );
  }
};

const openEditor = (bookmark) => {
  currentBookmarkId.value = bookmark.id;
  editorNotes.value = bookmark.notes || '';
};

const search = async (term) => {
  await loadBookmarks({ offset: 0, search: term });
  scrollRef.value?.scrollUp();
};

const saveNotes = async (bookmarkId, notes) => {
  try {
    await bookmarkStorage.updateNotesById(bookmarkId, notes);
    const bookmarkIndex = bookmarks.value.findIndex((b) => b.id === bookmarkId);
    if (bookmarkIndex !== -1) {
      bookmarks.value[bookmarkIndex] = {
        ...bookmarks.value[bookmarkIndex],
        notes,
        updatedAt: Date.now(),
      };
    }
  } catch (error) {
    console.error('Error updating notes:', error);
    notify({ group: 'error', text: 'Error saving notes.' }, import.meta.env.VITE_NOTIFICATION_DURATION);
  }
};
watch(searchTerm, search);
watch(editorNotes, (newNotes) => {
  if (!currentBookmark.value) return;
  saveNotes(currentBookmark.value.id, newNotes);
}, { flush: 'post' });
onMounted(() => loadBookmarks());
</script>
