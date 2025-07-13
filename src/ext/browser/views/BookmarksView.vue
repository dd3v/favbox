<template>
  <div class="flex w-full overflow-y-hidden dark:bg-black">
    <!-- Sidebar with Tailwind responsive classes -->
    <div class="hidden md:block w-64 max-w-64 flex-shrink-0 transition-all duration-300 ease-in-out">
      <AttributeList
        v-model="bookmarksQuery"
        v-model:sort="attributesSort"
        v-model:includes="attributesIncludes"
        v-model:term="attributesTerm"
        :items="attributesList"
        @paginate="skip => loadAttributes({ skip, append: true })"
      />
    </div>

    <AppInfiniteScroll
      ref="scroll"
      class="flex h-screen w-full flex-col overflow-y-auto"
      :limit="BOOKMARKS_LIMIT"
      @scroll:end="skip => loadBookmarks({ skip, limit: BOOKMARKS_LIMIT, append: true })"
    >
      <div class="sticky top-0 z-10 flex w-full flex-row gap-x-3 bg-white/70 pb-3 pt-2 px-2 backdrop-blur-sm dark:bg-black/70">
        <SearchTerm
          ref="search"
          v-model="bookmarksQuery"
          :placeholder="bookmarksTotalPlaceholder"
        />
        <ViewMode
          v-model="viewMode"
          v-tooltip.bottom="{ content: 'Display mode' }"
        />
        <SortDirection
          v-model="bookmarksSort"
          v-tooltip.bottom="{ content: 'Sort direction' }"
        />
        <DatePicker
          v-model="selectedDate"
          v-tooltip.bottom="{ content: 'Date range filter' }"
        />
      </div>
      <div
        v-if="loading"
        class="flex h-5/6 flex-col items-center justify-center px-8 py-12"
      >
        <AppSpinner class="size-12" />
      </div>
      <div
        v-else-if="bookmarksIsEmpty && !loading"
        class="flex h-5/6 flex-col items-center justify-center px-8 py-12"
      >
        <span class="text-2xl font-thin text-black dark:text-white">
          🔍 No bookmarks match your search. Try changing the filters or keywords.
        </span>
      </div>
      <BookmarkLayout
        class="p-2"
        :display-type="viewMode"
      >
        <BookmarkCard
          v-for="bookmark in bookmarksList"
          :key="bookmark.id"
          :display-type="viewMode"
          :bookmark="bookmark"
          @on-remove="handleRemove"
          @on-edit="handleEdit"
          @on-pin="handlePin"
        />
      </BookmarkLayout>
    </AppInfiniteScroll>

    <AppDrawer ref="drawer">
      <template #title>
        Edit Bookmark
      </template>
      <template #content>
        <BookmarkForm
          :bookmark="bookmarksEditState.bookmark"
          :folders="bookmarksEditState.folders"
          :tags="bookmarksEditState.tags"
          class="w-full"
          @on-submit="handleSubmit"
        />
      </template>
    </AppDrawer>
    <BookmarksSync @on-sync="sync" />
    <AppConfirmation
      key="delete"
      ref="deleteConfirmation"
    >
      <template #title>
        Delete bookmark
      </template>
      <template #description>
        Are you sure you want to delete this bookmark? This action cannot be undone. Removing the bookmark from FavBox
        will also delete it from your browser.
      </template>
      <template #cancel>
        Cancel
      </template>
      <template #confirm>
        Delete
      </template>
    </AppConfirmation>
    <AppConfirmation
      key="screenshot"
      ref="screenshotRef"
    >
      <template #title>
        Take a screenshot
      </template>
      <template #description>
        The browser extension will open a new tab, wait for the page to load, then capture a screenshot and save the
        current preview.
      </template>
      <template #cancel>
        Cancel
      </template>
      <template #confirm>
        Ok
      </template>
    </AppConfirmation>
  </div>
</template>

<script setup>
import {
  reactive, ref, onMounted, computed, useTemplateRef, watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notify } from 'notiwind';
import { useStorage } from '@vueuse/core';
import AppDrawer from '@/components/app/AppDrawer.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';
import AttributeList from '@/ext/browser/components/AttributeList.vue';
import BookmarkStorage from '@/storage/bookmark';
import AttributeStorage from '@/storage/attribute';

import bookmarkHelper from '@/helpers/bookmark';
import debounce from '@/helpers/debounce';
import SearchTerm from '@/ext/browser/components/SearchTerm.vue';
import ViewMode from '@/ext/browser/components/ViewMode.vue';
import BookmarkLayout from '@/ext/browser/components/BookmarkLayout.vue';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import BookmarksSync from '@/ext/browser/components/BookmarksSync.vue';
import BookmarkCard from '@/ext/browser/components/card/BookmarkCard.vue';
import AppConfirmation from '@/components/app/AppConfirmation.vue';
import BookmarkForm from '@/ext/browser/components/BookmarkForm.vue';
import SortDirection from '@/ext/browser/components/SortDirection.vue';
import DatePicker from '@/ext/browser/components/DatePicker.vue';

const BOOKMARKS_LIMIT = import.meta.env.VITE_BOOKMARKS_PAGINATION_LIMIT;
const ATTRIBUTES_LIMIT = import.meta.env.VITE_ATTRIBUTES_PAGINATION_LIMIT;
const NOTIFICATION_DURATION = import.meta.env.VITE_NOTIFICATION_DURATION;
const bookmarkStorage = new BookmarkStorage();
const attributeStorage = new AttributeStorage();

const route = useRoute();
const router = useRouter();

const drawerRef = useTemplateRef('drawer');
const scrollRef = useTemplateRef('scroll');
const deleteConfirmationRef = useTemplateRef('deleteConfirmation');
const screenshotRef = useTemplateRef('screenshotRef');
const searchRef = useTemplateRef('search');

const viewMode = useStorage('viewMode', 'masonry');
const loading = ref(false);

// Reactive state for bookmarks
const bookmarksList = ref([]);
const bookmarksTotal = ref(0);
const bookmarksQuery = ref(route.params.id ? [{ key: 'id', value: route.params.id }] : []);
const bookmarksSort = ref('desc');
const selectedDate = ref(null);

// Reactive state for attributes
const attributesSort = ref('count:desc');
const attributesTerm = ref('');
const attributesIncludes = reactive({ domain: true, folder: true, tag: true, keyword: true });
const attributesList = ref([]);

const bookmarksEditState = reactive({
  bookmark: null,
  folders: [],
  tags: [],
});

const bookmarksIsEmpty = computed(() => bookmarksList.value.length === 0 && !loading.value);
const bookmarksTotalPlaceholder = computed(() => (bookmarksQuery.value.length ? '' : `🚀 Total: ${bookmarksTotal.value}. Search: tag:important domain:example.com folder:work`));

const loadBookmarks = async ({ skip = 0, limit = BOOKMARKS_LIMIT, append = false, query = bookmarksQuery.value, sort = bookmarksSort.value } = {}) => {
  try {
    // Clear bookmarks and show spinner immediately for new searches
    if (!append) {
      bookmarksList.value = [];
      loading.value = true;
    }
    const newBookmarks = await bookmarkStorage.search(query, skip, limit, sort);
    if (append) {
      bookmarksList.value.push(...newBookmarks);
    } else {
      bookmarksList.value = newBookmarks;
    }
  } catch (e) {
    console.error(e);
    notify({ group: 'error', text: 'Error loading bookmarks.' }, NOTIFICATION_DURATION);
  } finally {
    if (!append) {
      loading.value = false;
    }
  }
};

const sync = async () => {
  try {
    bookmarksList.value = [];
    loading.value = true;
    bookmarksTotal.value = await bookmarkStorage.total();
    bookmarksList.value = await bookmarkStorage.search(bookmarksQuery.value, 0, BOOKMARKS_LIMIT, bookmarksSort.value);
    attributesList.value = await attributeStorage.search(
      attributesIncludes,
      ...attributesSort.value.split(':'),
      attributesTerm.value,
      0,
      ATTRIBUTES_LIMIT,
    );
  } catch (error) {
    console.error('Error refreshing bookmarks:', error);
    notify({ group: 'error', text: 'Failed to refresh bookmarks.' }, NOTIFICATION_DURATION);
  } finally {
    loading.value = false;
  }
};

const loadAttributes = debounce(async ({ skip = 0, limit = ATTRIBUTES_LIMIT, append = false, includes = attributesIncludes, sort = attributesSort.value, term = attributesTerm.value } = {}) => {
  try {
    const [sortColumn, sortDirection] = sort.split(':');
    const newAttributes = await attributeStorage.search(
      includes,
      sortColumn,
      sortDirection,
      term,
      skip,
      limit,
    );
    if (append) {
      attributesList.value.push(...newAttributes);
    } else {
      attributesList.value = newAttributes;
    }
  } catch (e) {
    console.error('Error loading attributes:', e);
    notify({ group: 'error', text: 'Error loading attributes.' }, NOTIFICATION_DURATION);
  }
}, 200);

const handleRemove = async (bookmark) => {
  if (await deleteConfirmationRef.value.request() === false) {
    return;
  }
  try {
    const id = bookmark.id.toString();
    await browser.bookmarks.remove(id);
    bookmarksList.value = bookmarksList.value.filter((item) => item.id.toString() !== id);
    notify({ group: 'default', text: 'Bookmark successfully removed!' }, NOTIFICATION_DURATION);
    console.log(`Bookmark ${id} successfully removed`);
  } catch (error) {
    console.error('Error removing bookmark:', error);
    notify({ group: 'error', text: 'Failed to remove bookmark. Please try again.' }, NOTIFICATION_DURATION);
  }

  // Silently load more bookmarks if needed, without showing spinner
  try {
    if (bookmarksList.value.length < BOOKMARKS_LIMIT) {
      const more = await bookmarkStorage.search(bookmarksQuery.value, bookmarksList.value.length, 1, bookmarksSort.value);
      if (more.length) bookmarksList.value.push(...more);
    }
  } catch (e) {
    console.error('Error loading additional bookmarks after removal:', e);
  }
};

const handleEdit = async (bookmark) => {
  try {
    bookmarksEditState.bookmark = JSON.parse(JSON.stringify(bookmark));
    drawerRef.value.open();
    const [tags, folders] = await Promise.all([bookmarkStorage.getTags(), bookmarkHelper.buildFolderUITree()]);
    bookmarksEditState.tags = tags;
    bookmarksEditState.folders = folders;
  } catch (error) {
    console.error('Failed to load data:', error);
    notify({ group: 'error', text: 'Error loading data.' }, NOTIFICATION_DURATION);
  }
};

const handlePin = (bookmark) => {
  try {
    const status = bookmark.pinned ? 0 : 1;
    bookmark.pinned = status;
    bookmarkStorage.updatePinStatusById(bookmark.id, status);
    const message = status ? 'Bookmark successfully pinned!' : 'Bookmark successfully unpinned!';
    notify({ group: 'default', text: message }, NOTIFICATION_DURATION);
  } catch (e) {
    console.error(e);
    notify({ group: 'error', text: 'Failed to update pin status.' }, NOTIFICATION_DURATION);
  }
};

const handleSubmit = async (data) => {
  try {
    const id = String(data.id);
    await browser.bookmarks.update(id, { title: data.browserTitle });
    await browser.bookmarks.move(id, { parentId: String(data.folderId) });
    const bookmark = bookmarksList.value.find((item) => item.id === id);
    if (bookmark) {
      bookmark.title = data.title;
      bookmark.tags = data.tags;
    }
    notify({ group: 'default', text: 'Bookmark successfully saved!' }, NOTIFICATION_DURATION);
  } catch (error) {
    console.error('Failed to save bookmark:', error);
    notify({ group: 'error', text: 'Bookmark not saved.' }, NOTIFICATION_DURATION);
  } finally {
    drawerRef.value.close();
  }
};

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'refresh') {
    console.warn('checking tab');
    const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
    const isFavBoxTab = activeTab?.url?.includes('/ext/browser/index.html');
    if (isFavBoxTab) {
      console.log('Skipping refresh message - current tab is FavBox bookmarks tab');
      attributesList.value = await attributeStorage.search(
        attributesIncludes,
        ...attributesSort.value.split(':'),
        attributesTerm.value,
        0,
        ATTRIBUTES_LIMIT,
      );
    } else {
      console.warn('refresing..');
      await sync();
    }
  }
});

watch(
  [bookmarksQuery, bookmarksSort],
  async ([query]) => {
    bookmarksList.value = [];
    loading.value = true;
    if (!query.some((f) => f.key === 'dateAdded')) {
      selectedDate.value = null;
    }
    loadBookmarks({ skip: 0, append: false });
    scrollRef.value?.scrollUp();
    if (bookmarksQuery.value.length === 0 && route.params.id) {
      router.replace({ path: '/bookmarks' });
    }
  },
  { immediate: false },
);

watch(selectedDate, (date) => {
  console.warn(date);
  if (date) {
    const formatted = date.map((d) => d.toISOString().slice(0, 10));
    bookmarksQuery.value = [
      ...bookmarksQuery.value.filter((f) => f.key !== 'dateAdded'),
      { key: 'dateAdded', value: formatted.join('~') },
    ];
  }
});

watch(
  [attributesSort, attributesTerm, attributesIncludes],
  () => {
    loadAttributes({ skip: 0, append: false });
  },
  { immediate: false },
);

onMounted(async () => {
  try {
    loading.value = true;
    const [sortColumn, sortDirection] = attributesSort.value.split(':');
    const [result, totalResult] = await Promise.all([
      attributeStorage.search(attributesIncludes, sortColumn, sortDirection, attributesTerm.value, 0, ATTRIBUTES_LIMIT),
      bookmarkStorage.total(),
    ]);
    attributesList.value = result;
    bookmarksTotal.value = totalResult;
    await loadBookmarks();
    searchRef.value.focus();
  } catch (error) {
    console.error('Error during component mount:', error);
    notify({ group: 'error', text: 'Error initializing bookmarks view.' }, NOTIFICATION_DURATION);
  } finally {
    loading.value = false;
  }
});
</script>
