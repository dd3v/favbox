<template>
  <div class="flex w-full overflow-y-hidden dark:bg-black">
    <AttributeList
      v-model="query"
      v-model:sort="attrsSort"
      v-model:includes="attrsIncludes"
      v-model:term="attrsTerm"
      class="p-2"
      :items="attributes"
      @paginate="paginateAttributes"
    />

    <AppInfiniteScroll
      ref="scroll"
      class="flex h-screen w-full flex-col overflow-y-auto"
      :limit="50"
      @scroll:end="paginateBookmarks"
    >
      <div class="sticky top-0 z-10 flex w-full flex-row space-x-3 bg-white/70 p-2 backdrop-blur-lg dark:bg-black/70">
        <SearchTerm
          ref="searchInputRef"
          v-model="query"
          :placeholder="'Total: ' + total + '. Search bookmarks...🚀'"
        />
        <ViewMode
          v-model="viewMode"
          v-tooltip.bottom="{ content: 'Display mode' }"
        />
        <SortDirection
          v-model="sortBookmarks"
          v-tooltip.bottom="{ content: 'Sort direction' }"
        />
        <ThemeMode v-tooltip.bottom="{ content: 'Theme' }" />
      </div>

      <div
        v-if="empty && query.length"
        class="flex h-5/6 items-center justify-center text-2xl font-thin text-black dark:text-white"
      >
        No results found.
      </div>
      <BookmarkLayout
        class="p-2"
        :display-type="viewMode"
      >
        <BookmarkCard
          v-for="(bookmark, key) in bookmarks"
          :key="key"
          :display-type="viewMode"
          :bookmark="bookmark"
          @onRemove="handleRemove"
          @onScreenshot="handleScreenshot"
          @onEdit="handleEdit"
          @onPin="handlePin"
        />
      </BookmarkLayout>
    </AppInfiniteScroll>

    <AppDrawer ref="drawer">
      <template #title>
        Edit Bookmark
      </template>
      <template #content>
        <BookmarkForm
          v-model="currentBookmark"
          :folders="bookmarkFolders"
          :tags="tags"
          class="w-full"
          @onSubmit="handleSubmit"
        />
      </template>
    </AppDrawer>
    <BookmarksSync @onRefresh="refresh" />
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
  reactive, ref, watch, onMounted,
} from 'vue';
import { notify } from 'notiwind';
import AppDrawer from '@/components/app/AppDrawer.vue';
import AttributeList from '@/ext/browser/components/AttributeList.vue';
import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import bookmarkHelper from '@/helpers/bookmark';
import SearchTerm from '@/ext/browser/components/SearchTerm.vue';
import ViewMode from '@/ext/browser/components/ViewMode.vue';
import BookmarkLayout from '@/ext/browser/components/BookmarkLayout.vue';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import tagHelper from '@/helpers/tags';
import BookmarksSync from '@/ext/browser/components/BookmarksSync.vue';
import BookmarkCard from '@/ext/browser/components/card/BookmarkCard.vue';
import AppConfirmation from '@/components/app/AppConfirmation.vue';
import BookmarkForm from '@/ext/browser/components/BookmarkForm.vue';
import SortDirection from '@/ext/browser/components/SortDirection.vue';
import ThemeMode from '@/ext/browser/components/ThemeMode.vue';
import { useStorage } from '@vueuse/core';

await initStorage();
const bookmarkStorage = new BookmarkStorage();

const bookmarkFolders = ref(await bookmarkHelper.getFolders());

console.warn('folders', bookmarkFolders.value);

const currentBookmark = ref({});
const drawer = ref(null);
const screenshotRef = ref(null);

const viewMode = useStorage('viewMode', 'masonry');

const scroll = ref(null);
const bookmarks = ref([]);
const deleteConfirmation = ref(null);
const total = ref(0);
const query = ref([]);
const sortBookmarks = ref('desc');

const attributes = ref([]);
const attrsSort = ref('count:desc');
const attrsIncludes = reactive({
  domain: true, folder: true, tag: true, keyword: true,
});
const attrsTerm = ref('');

const searchInputRef = ref(null);

const empty = ref(false);
const tags = ref([]);

const paginateBookmarks = async (skip) => {
  try {
    console.warn('skip', skip);
    bookmarks.value.push(
      ...(await bookmarkStorage.search(query.value, skip, 50, sortBookmarks.value)),
    );
  } catch (e) {
    console.error(e);
  }
};

const refresh = async () => {
  total.value = await bookmarkStorage.total();
  bookmarks.value = await bookmarkStorage.search(query.value, 0, 50, sortBookmarks.value);
};

const paginateAttributes = async (skip) => {
  try {
    console.warn('paginate attrbiutes', skip);
    const [sortColumn, sortDirection] = attrsSort.value.split(':');
    console.warn('paginate attrbiutes', skip, sortColumn, sortDirection);
    attributes.value.push(
      ...(await bookmarkStorage.getAttributes(attrsIncludes, sortColumn, sortDirection, attrsTerm.value, skip, 200)),
    );
  } catch (e) {
    console.error(e);
  }
};

const handleRemove = async (bookmark) => {
  if (await deleteConfirmation.value.request() === false) {
    return;
  }
  try {
    console.warn(bookmark.id.toString());
    await browser.bookmarks.remove(bookmark.id.toString());
  } catch (e) {
    console.error(e);
    // If for some reason we are not able to remove the bookmark from Google Browser.
    await bookmarkStorage.remove(bookmark.id.toString());
  } finally {
    bookmarks.value = bookmarks.value.filter((item) => item.id.toString() !== bookmark.id.toString());
    notify({ group: 'default', title: 'Success', text: 'Boookmark sucefully removed!' }, 2500);
  }
};
const handleEdit = async (e) => {
  currentBookmark.value = e;
  console.warn('edit', e);
  tags.value = await bookmarkStorage.getTags();
  drawer.value.open();
};
const handlePin = (bookmark) => {
  const status = bookmark.pinned ? 0 : 1;
  bookmark.pinned = status;
  bookmarkStorage.updatePinStatusById(bookmark.id, status);
};
const handleSubmit = async (bookmark) => {
  console.log('saving', bookmark);
  try {
    const bookmarkId = String(bookmark.id);
    const updatedTitle = tagHelper.toString(bookmark.title, bookmark.tags);
    await Promise.all([
      browser.bookmarks.update(bookmarkId, { title: updatedTitle }),
      browser.bookmarks.move(bookmarkId, { parentId: String(bookmark.folderId) }),
    ]);
    const index = bookmarks.value.findIndex((item) => item.id === bookmark.id);
    if (index !== -1) {
      bookmarks.value[index] = { ...bookmark, title: updatedTitle };
    }
    notify({ group: 'default', title: 'Success', text: 'Bookmark successfully saved!' }, 2500);
  } catch (error) {
    console.error('Failed to save bookmark:', error);
  } finally {
    drawer.value.close();
    currentBookmark.value = {};
  }
};
const handleScreenshot = async (bookmark) => {
  if (await screenshotRef.value.request() === false) {
    return;
  }
  // ff issue https://bugzilla.mozilla.org/show_bug.cgi?id=1795932
  const response = await browser.runtime.sendMessage({ action: 'screenshot', bookmark: JSON.parse(JSON.stringify(bookmark)) });
  if (response.error !== null) {
    throw Error(response.error);
  }
  const item = bookmarks.value.find((i) => i.id === bookmark.id);
  item.image = response.image;
};

watch(
  [query, sortBookmarks],
  async () => {
    console.warn('QUERY', query);
    scroll.value?.scrollUp();
    bookmarks.value = await bookmarkStorage.search(query.value, 0, 50, sortBookmarks.value);
  },
  { immediate: true, deep: true },
);

watch([attrsSort, attrsTerm, attrsIncludes], async ([newSort, newTerm, newIncludes]) => {
  console.warn('newSort', newSort);
  console.warn('newTerm', newTerm);
  console.warn('newIncludes', newIncludes);
  const [sortColumn, sortDirection] = newSort.split(':');
  const result = await bookmarkStorage.getAttributes(attrsIncludes, sortColumn, sortDirection, attrsTerm.value, 0, 200);
  attributes.value = result;
}, { deep: true });

watch(
  bookmarks,
  () => {
    empty.value = bookmarks.value.length === 0;
  },
  { immediate: true },
);

onMounted(async () => {
  const [sortColumn, sortDirection] = attrsSort.value.split(':');

  const [result, totalResult] = await Promise.all([
    bookmarkStorage.getAttributes(attrsIncludes, sortColumn, sortDirection, attrsTerm.value, 0, 200),
    bookmarkStorage.total(),
  ]);
  attributes.value = result;
  console.warn('attrs', attributes.value);
  await bookmarkStorage.refreshAttributes();
  total.value = totalResult;
});

</script>
