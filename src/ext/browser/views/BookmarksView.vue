<template>
  <div class="flex w-full overflow-y-hidden">
    <AttributeList
      v-model="query"
      v-model:sort="attrsSort"
      v-model:includes="attrsIncludes"
      v-model:term="attrsTerm"
      class="p-1 py-2"
      :items="attributes"
    />
    <div class="flex h-screen w-full flex-col overflow-hidden p-2">
      <div class="sticky top-0 z-10 flex w-auto flex-row space-x-3">
        <SearchTerm
          ref="searchInputRef"
          v-model="query"
          placeholder="Search your bookmarks.. ⏎"
        />
        <ViewMode v-model="displayType" />
      </div>
      <app-infinite-scroll
        ref="scroll"
        class="size-full overflow-y-auto py-2"
        :limit="50"
        @scroll:end="paginate"
      >
        <div
          v-if="empty"
          class="flex h-5/6 items-center justify-center text-6xl font-black text-gray-200"
        >
          Empty
        </div>
        <bookmark-layout
          :display-type="displayType"
        >
          <bookmark-card
            v-for="(bookmark, key) in bookmarks"
            :key="key"
            :display-type="displayType"
            :bookmark="bookmark"
            @remove="handleRemoveBookmark"
            @edit="edit"
            @pin="pin"
          />
        </bookmark-layout>
      </app-infinite-scroll>
    </div>
    <app-drawer ref="drawer">
      <template #title>
        Edit Bookmark
      </template>
      <template #content>
        <bookmark-form
          v-model="currentBookmark"
          :folders="bookmarkFolders"
          :tags="tags"
          class="w-full"
          @submit="handleSubmit"
        />
      </template>
    </app-drawer>
    <bookmarks-sync
      v-if="showSync"
      :progress="syncProgress"
    />
    <AppConfirmation ref="deleteConfirmation">
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
import BookmarkForm from '@/components/bookmark/BookmarkForm.vue';
import tagHelper from '@/helpers/tags';
import BookmarksSync from '@/ext/browser/components/BookmarksSync.vue';
import BookmarkCard from '@/ext/browser/components/card/BookmarkCard.vue';
import AppConfirmation from '@/components/app/AppConfirmation.vue';

await initStorage();
const bookmarkStorage = new BookmarkStorage();

const bookmarkFolders = ref(await bookmarkHelper.getFolders());

console.warn('folders', bookmarkFolders.value);

console.warn('tree folders', await bookmarkHelper.getFoldersTree());

const currentBookmark = ref({});
const drawer = ref(null);

const displayType = ref(localStorage.getItem('displayType') ?? 'masonry');

const scroll = ref(null);
const bookmarks = ref([]);
const deleteConfirmation = ref(null);

const query = ref([]);

const attributes = ref([]);
const attrsSort = ref('count:desc');
const attrsIncludes = reactive({
  domain: true, folder: true, tag: true, keyword: true, locale: false, type: false,
});
const attrsTerm = ref('');

const searchInputRef = ref(null);
const showSync = ref(false);
const syncProgress = ref(0);
const empty = ref(false);
const tags = ref([]);

const handleRemoveBookmark = async (bookmark) => {
  if (await deleteConfirmation.value.request() === false) {
    return;
  }
  try {
    await chrome.bookmarks.remove(String(bookmark.id));
  } catch (e) {
    console.error(e);
    // If for some reason we are not able to remove the bookmark from Google Chrome
    await bookmarkStorage.remove(parseInt(bookmark.id, 10));
  } finally {
    bookmarks.value = bookmarks.value.filter(
      (item) => parseInt(item.id, 10) !== parseInt(bookmark.id, 10),
    );
    notify(
      {
        group: 'default',
        title: 'Success',
        text: 'Boookmark sucefully removed!',
      },
      2500,
    );
  }
};

const edit = (e) => {
  currentBookmark.value = e;
  console.warn('edit', e);
  drawer.value.open();
};

const pin = (bookmark) => {
  const status = bookmark.pinned ? 0 : 1;
  bookmark.pinned = status;
  bookmarkStorage.updatePinStatusById(bookmark.id, status);
};

const handleSubmit = async (bookmark) => {
  try {
    console.warn(bookmark);
    await chrome.bookmarks.update(String(bookmark.id), {
      title: tagHelper.toString(bookmark.title, bookmark.tags),
      url: bookmark.url,
    });
    await chrome.bookmarks.move(String(bookmark.id), {
      parentId: String(bookmark.folder.id),
    });
    notify(
      {
        group: 'default',
        title: 'Success',
        text: 'Boookmark sucefully saved!',
      },
      2500,
    );
  } catch (e) {
    console.error(e);
  }
};

const paginate = async (skip) => {
  try {
    console.warn('load', skip);
    bookmarks.value.push(
      ...(await bookmarkStorage.search(query.value, skip, 50)),
    );
  } catch (e) {
    console.error(e);
  }
};
watch(displayType, () => localStorage.setItem('displayType', displayType.value));
watch(
  query,
  async () => {
    console.warn('QUERY', query);
    scroll.value?.scrollUp();
    bookmarks.value = await bookmarkStorage.search(query.value);
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

watch(query, (newVal) => {
  console.warn('query', newVal);
}, { deep: true, immediate: true });
watch(
  bookmarks,
  () => {
    empty.value = bookmarks.value.length === 0;
  },
  { immediate: true },
);

onMounted(async () => {
  drawer.value.open();
  const [sortColumn, sortDirection] = attrsSort.value.split(':');
  const result = await bookmarkStorage.getAttributes(attrsIncludes, sortColumn, sortDirection, attrsTerm.value, 0, 200);
  attributes.value = result;
  console.warn('attrs', attributes.value);
  await bookmarkStorage.refreshAttributes();
});

chrome.runtime.onMessage.addListener(async (message) => {
  // handle updates from service worker
  if (message.action === 'refresh') {
    if (message.data?.progress && message.data.progress <= 100) {
      showSync.value = true;
      syncProgress.value = message.data.progress;
    }
    bookmarks.value = await bookmarkStorage.search(query.value);
  }
});
</script>
