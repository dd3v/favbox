<template>
  <div class="flex w-full overflow-y-hidden dark:bg-black">
    <AttributeList
      v-model="bookmarksQuery"
      v-model:sort="attributesSort"
      v-model:includes="attributesIncludes"
      v-model:term="attributesTerm"
      :items="attributesList"
      @paginate="paginateAttributes"
    />
    <AppInfiniteScroll
      ref="scroll"
      class="flex h-screen w-full flex-col overflow-y-auto"
      :limit="BOOKMARKS_LIMIT"
      @scroll:end="paginateBookmarks"
    >
      <div class="sticky top-0 z-10 flex w-full flex-row gap-x-3 bg-white/70 p-2 backdrop-blur-lg dark:bg-black/70">
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
      </div>
      <div
        v-if="bookmarksIsEmpty"
        class="flex h-5/6 flex-col items-center justify-center px-8 py-12"
      >
        <div class="mb-6 rounded-full bg-gray-100 p-6 dark:bg-gray-900">
          <RiBookmarkFill class="size-12 dark:text-white" />
        </div>
        <div class="text-center">
          <h3 class="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
            No bookmarks found
          </h3>
        </div>
      </div>
      <BookmarkLayout
        class="p-2"
        :display-type="viewMode"
      >
        <BookmarkCard
          v-for="(bookmark, key) in bookmarksList"
          :key="key"
          :display-type="viewMode"
          :bookmark="bookmark"
          @on-remove="handleRemove"
          @on-screenshot="handleScreenshot"
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
    <BookmarksSync @on-refresh="refresh" />
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
  reactive, ref, watch, onMounted, computed, useTemplateRef,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { notify } from 'notiwind';
import { useStorage } from '@vueuse/core';
import AppDrawer from '@/components/app/AppDrawer.vue';
import AttributeList from '@/ext/browser/components/AttributeList.vue';
import BookmarkStorage from '@/storage/bookmark';
import AttributeStorage from '@/storage/attribute';

import bookmarkHelper from '@/helpers/bookmark';
import SearchTerm from '@/ext/browser/components/SearchTerm.vue';
import ViewMode from '@/ext/browser/components/ViewMode.vue';
import BookmarkLayout from '@/ext/browser/components/BookmarkLayout.vue';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import BookmarksSync from '@/ext/browser/components/BookmarksSync.vue';
import BookmarkCard from '@/ext/browser/components/card/BookmarkCard.vue';
import AppConfirmation from '@/components/app/AppConfirmation.vue';
import BookmarkForm from '@/ext/browser/components/BookmarkForm.vue';
import SortDirection from '@/ext/browser/components/SortDirection.vue';
import RiBookmarkFill from '~icons/ri/bookmark-fill';

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
const bookmarksTotalPlaceholder = computed(() => `Total: ${bookmarksTotal.value}. Press Enter to search.. 🚀`);

const paginateBookmarks = async (skip) => {
  try {
    console.warn('skip', skip);
    bookmarksList.value.push(
      ...(await bookmarkStorage.search(bookmarksQuery.value, skip, BOOKMARKS_LIMIT, bookmarksSort.value)),
    );
  } catch (e) {
    console.error(e);
  }
};

const refresh = async () => {
  try {
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
  }
};

const paginateAttributes = async (skip) => {
  try {
    console.warn('paginate attributes', skip);
    const [sortColumn, sortDirection] = attributesSort.value.split(':');
    console.warn('paginate attributes', skip, sortColumn, sortDirection);
    attributesList.value.push(
      ...(await attributeStorage.search(
        attributesIncludes,
        sortColumn,
        sortDirection,
        attributesTerm.value,
        skip,
        ATTRIBUTES_LIMIT,
      )),
    );
  } catch (e) {
    console.error(e);
    notify({ group: 'error', text: 'Error loading attributes.' }, NOTIFICATION_DURATION);
  }
};

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

const handleScreenshot = async (bookmark) => {
  try {
    const granted = await screenshotRef.value.request();
    if (granted === false) {
      return;
    }
    const response = await browser.runtime.sendMessage({
      action: 'screenshot',
      bookmark: JSON.parse(JSON.stringify(bookmark)),
    });
    if (response.error) {
      throw new Error(response.error);
    }
    const item = bookmarksList.value.find((i) => i.id === bookmark.id);
    if (item) {
      item.image = response.image;
      notify({ group: 'default', text: 'Screenshot saved successfully!' }, NOTIFICATION_DURATION);
    }
  } catch (e) {
    console.error('Screenshot failed:', e);
    notify({ group: 'error', text: 'Screenshot failed.' }, NOTIFICATION_DURATION);
  }
};

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'refresh') {
    await refresh(message.data);
  }
});

watch(
  [bookmarksQuery, bookmarksSort],
  async () => {
    try {
      loading.value = true;
      console.warn('QUERY', bookmarksQuery);
      scrollRef.value?.scrollUp();
      bookmarksList.value = await bookmarkStorage.search(bookmarksQuery.value, 0, BOOKMARKS_LIMIT, bookmarksSort.value);
      if (bookmarksQuery.value.length === 0 && route.params.id) {
        router.replace({ path: '/bookmarks' });
      }
    } catch (e) {
      console.error('Error fetching bookmarks:', e);
      notify({ group: 'error', text: 'Error loading bookmarks.' }, NOTIFICATION_DURATION);
    } finally {
      loading.value = false;
    }
  },
  { immediate: true, deep: true },
);

watch(
  [attributesSort, attributesTerm, attributesIncludes],
  async ([newSort, newTerm, newIncludes]) => {
    try {
      console.warn('newSort', newSort, 'newTerm', newTerm, 'newIncludes', newIncludes);
      const [sortColumn, sortDirection] = newSort.split(':');
      const result = await attributeStorage.search(newIncludes, sortColumn, sortDirection, newTerm, 0, ATTRIBUTES_LIMIT);
      attributesList.value = result;
    } catch (e) {
      console.error('Error fetching attributes:', e);
      notify({ group: 'error', text: 'Error loading attributes.' }, NOTIFICATION_DURATION);
    }
  },
  { deep: true },
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
    searchRef.value.focus();
  } catch (error) {
    console.error('Error during component mount:', error);
    notify({ group: 'error', text: 'Error initializing bookmarks view.' }, NOTIFICATION_DURATION);
  } finally {
    loading.value = false;
  }
});
</script>
