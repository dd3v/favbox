<template>
  <div class="flex w-full overflow-y-hidden dark:bg-black">
    <!-- Sidebar with Tailwind responsive classes -->
    <div class="hidden md:block w-68 max-w-68 flex-shrink-0 transition-all duration-300 ease-in-out">
      <div class="flex h-screen w-full max-w-64 flex-col border-r border-soft-400 bg-soft-100 p-2 dark:border-neutral-800 dark:bg-black transition-all duration-300 ease-in-out">
        <TabGroup>
          <TabList class="mb-2 flex gap-1 rounded-md bg-gray-100 p-1 dark:bg-neutral-900">
            <Tab
              v-slot="{ selected }"
              class="w-full focus:outline-none"
            >
              <div
                :class="selected ? 'bg-white shadow-sm dark:bg-neutral-800' : 'hover:bg-gray-200 dark:hover:bg-neutral-700'"
                class="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors dark:text-neutral-300"
              >
                Search
              </div>
            </Tab>
            <Tab
              v-slot="{ selected }"
              class="w-full focus:outline-none"
            >
              <div
                :class="selected ? 'bg-white shadow-sm dark:bg-neutral-800' : 'hover:bg-gray-200 dark:hover:bg-neutral-700'"
                class="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors dark:text-neutral-300"
              >
                Folders
              </div>
            </Tab>
          </TabList>

          <TabPanels class="flex-1 overflow-hidden">
            <TabPanel class="flex h-full flex-col">
              <AttributeList
                v-model="bookmarksQuery"
                v-model:sort="attributesSort"
                v-model:includes="attributesIncludes"
                v-model:term="attributesTerm"
                :items="attributesList"
                @paginate="skip => loadAttributes({ skip, append: true })"
              />
            </TabPanel>

            <TabPanel class="h-full overflow-hidden">
              <FolderTree
                v-model="bookmarksQuery"
                :folders="folderTree"
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>

    <AppInfiniteScroll
      ref="scroll"
      class="flex h-screen w-full flex-col overflow-y-auto"
      :limit="PAGINATION_LIMIT"
      @scroll:end="loadMore"
    >
      <div class="sticky top-0 z-10 flex w-full flex-col gap-2 bg-white/70 pb-3 pt-2 px-2 backdrop-blur-sm sm:flex-row sm:gap-x-3 dark:bg-black/70">
        <SearchTerm
          ref="search"
          v-model="bookmarksQuery"
          :placeholder="bookmarksTotalPlaceholder"
          class="flex-1"
        />
        <div class="flex shrink-0 gap-x-2 sm:gap-x-3">
          <ViewMode
            v-model="viewMode"
            v-tooltip.bottom="{ content: 'Display mode' }"
          />
          <SortDirection
            v-model="bookmarksSort"
            v-tooltip.bottom="{ content: 'Sort direction' }"
          />
          <DatePicker v-model="selectedDate" />
        </div>
      </div>
      <div
        v-if="loading"
        class="flex flex-1 flex-col items-center justify-center p-5"
      >
        <AppSpinner class="size-12" />
      </div>
      <div
        v-else-if="bookmarksIsEmpty && !loading"
        class="flex flex-1 flex-col items-center justify-center p-5"
      >
        <span class="px-4 text-center text-lg font-thin text-black sm:text-2xl dark:text-white">
          🔍 No bookmarks match your search. Try changing the filters or keywords.
        </span>
      </div>
      <BookmarkLayout
        v-if="!loading"
        class="p-2 sm:p-4"
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
import { useStorage, useDebounceFn } from '@vueuse/core';
import { PAGINATION_LIMIT, NOTIFICATION_DURATION } from '@/constants/app';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue';
import AppDrawer from '@/components/app/AppDrawer.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';
import AttributeList from '@/ext/browser/components/AttributeList.vue';
import FolderTree from '@/ext/browser/components/FolderTree.vue';
import BookmarkStorage from '@/storage/bookmark';
import AttributeStorage from '@/storage/attribute';

import { getFolderTree } from '@/services/browserBookmarks';
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
const attributesIncludes = reactive({ domain: true, tag: true, keyword: true });
const attributesList = ref([]);
const folderTree = ref([]);

const bookmarksEditState = reactive({
  bookmark: null,
  folders: [],
  tags: [],
});

const bookmarksIsEmpty = computed(() => bookmarksList.value.length === 0 && !loading.value);
const bookmarksTotalPlaceholder = computed(() => (bookmarksQuery.value.length ? '' : `🚀 Total: ${bookmarksTotal.value}. Search: tag:important domain:example.com`));

const load = async () => {
  try {
    loading.value = true;
    bookmarksList.value = await bookmarkStorage.search(bookmarksQuery.value, 0, PAGINATION_LIMIT, bookmarksSort.value);
  } catch (e) {
    console.error(e);
    notify({ group: 'error', text: 'Error loading bookmarks.' }, NOTIFICATION_DURATION);
  } finally {
    loading.value = false;
  }
};

const loadMore = async (offset) => {
  try {
    const more = await bookmarkStorage.search(bookmarksQuery.value, offset, PAGINATION_LIMIT, bookmarksSort.value);
    bookmarksList.value.push(...more);
  } catch (e) {
    console.error(e);
    notify({ group: 'error', text: 'Error loading bookmarks.' }, NOTIFICATION_DURATION);
  }
};

const sync = async () => {
  try {
    bookmarksList.value = [];
    loading.value = true;
    bookmarksTotal.value = await bookmarkStorage.total();
    bookmarksList.value = await bookmarkStorage.search(bookmarksQuery.value, 0, PAGINATION_LIMIT, bookmarksSort.value);
    attributesList.value = await attributeStorage.search(
      attributesIncludes,
      ...attributesSort.value.split(':'),
      attributesTerm.value,
      0,
      PAGINATION_LIMIT,
    );
  } catch (error) {
    console.error('Error refreshing bookmarks:', error);
    notify({ group: 'error', text: 'Failed to refresh bookmarks.' }, NOTIFICATION_DURATION);
  } finally {
    loading.value = false;
  }
};

const loadAttributes = useDebounceFn(async ({ skip = 0, limit = PAGINATION_LIMIT, append = false, includes = attributesIncludes, sort = attributesSort.value, term = attributesTerm.value } = {}) => {
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
    if (bookmarksList.value.length < PAGINATION_LIMIT) {
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
    const [tags, folders] = await Promise.all([bookmarkStorage.getTags(), getFolderTree()]);
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
    const message = status ? 'Added to notes!' : 'Removed from notes!';
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
      bookmark.folderId = data.folderId;
      bookmark.folderName = data.folderName;
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
    console.log('Refreshing bookmarks view...');
    const [attrs, folders, total, bookmarks] = await Promise.all([
      attributeStorage.search(attributesIncludes, ...attributesSort.value.split(':'), attributesTerm.value, 0, PAGINATION_LIMIT),
      getFolderTree(),
      bookmarkStorage.total(),
      bookmarkStorage.search(bookmarksQuery.value, 0, PAGINATION_LIMIT, bookmarksSort.value),
    ]);
    attributesList.value = attrs;
    folderTree.value = folders;
    bookmarksTotal.value = total;
    bookmarksList.value = bookmarks;
  }
});

watch(
  [bookmarksQuery, bookmarksSort],
  async ([query]) => {
    if (!query.some((f) => f.key === 'dateAdded')) {
      selectedDate.value = null;
    }
    await load();
    scrollRef.value?.scrollUp();
    if (bookmarksQuery.value.length === 0 && route.params.id) {
      router.replace({ path: '/bookmarks' });
    }
  },
  { immediate: false },
);

watch(selectedDate, (date) => {
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
    const [result, totalResult, folders] = await Promise.all([
      attributeStorage.search(attributesIncludes, sortColumn, sortDirection, attributesTerm.value, 0, PAGINATION_LIMIT),
      bookmarkStorage.total(),
      getFolderTree(),
    ]);
    attributesList.value = result;
    bookmarksTotal.value = totalResult;
    folderTree.value = folders;
    await load();
    searchRef.value.focus();
  } catch (error) {
    console.error('Error during component mount:', error);
    notify({ group: 'error', text: 'Error initializing bookmarks view.' }, NOTIFICATION_DURATION);
  } finally {
    loading.value = false;
  }
});
</script>
