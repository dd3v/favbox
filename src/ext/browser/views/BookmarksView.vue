<template>
  <div class="flex w-full overflow-y-hidden dark:bg-black">
    <AttributeList
      v-model="query"
      v-model:sort="attrsSort"
      v-model:includes="attrsIncludes"
      v-model:term="attrsTerm"
      class="p-1 py-2"
      :items="attributes"
      @paginate="paginateAttributes"
    />
    <div class="flex h-screen w-full flex-col overflow-hidden p-2">
      <div class="sticky top-0 z-10 flex w-auto flex-row space-x-3">
        <SearchTerm
          ref="searchInputRef"
          v-model="query"
          placeholder="Search your bookmarks.. ⏎"
        >
          <template #kbd>
            <button
              class="m-0 inline-flex appearance-none items-center space-x-1 border-none bg-transparent p-0"
              @click="handleCommandPallete"
            >
              <span class="inline-flex size-6 items-center justify-center rounded-md border border-gray-200 bg-white font-mono text-lg shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                ⌘
              </span>
              <span class="inline-flex size-6 items-center justify-center rounded-md border border-gray-200 bg-white font-mono text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                K
              </span>
            </button>
          </template>
        </SearchTerm>
        <ViewMode v-model="viewMode" />
      </div>
      <app-infinite-scroll
        ref="scroll"
        class="size-full overflow-y-auto py-2"
        :limit="50"
        @scroll:end="paginateBookmarks"
      >
        <div
          v-if="empty"
          class="flex h-5/6 items-center justify-center text-6xl font-thin text-gray-200 dark:text-white"
        >
          No results found.
        </div>
        <bookmark-layout
          :display-type="viewMode"
        >
          <bookmark-card
            v-for="(bookmark, key) in bookmarks"
            :key="key"
            :display-type="viewMode"
            :bookmark="bookmark"
            @remove="remove"
            @screenshot="screenshot"
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
        The browser extension will open a new tab, wait for the page to load, then capture a screenshot and save the current preview.
      </template>
      <template #cancel>
        Cancel
      </template>
      <template #confirm>
        Ok
      </template>
    </AppConfirmation>
    <CommandPalette
      ref="commandPalleteRef"
      v-model="query"
      @onVisibilityToggle="commandPaleteVisibilityHandler"
    />
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
import CommandPalette from '@/ext/browser/components/CommandPalette.vue';

await initStorage();
const bookmarkStorage = new BookmarkStorage();

const bookmarkFolders = ref(await bookmarkHelper.getFolders());

console.warn('folders', bookmarkFolders.value);

console.warn('tree folders', await bookmarkHelper.getFoldersTree());

const currentBookmark = ref({});
const drawer = ref(null);
const commandPalleteRef = ref(null);
const screenshotRef = ref(null);

const viewMode = ref(localStorage.getItem('viewMode') ?? 'masonry');

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

const remove = async (bookmark) => {
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
    bookmarks.value = bookmarks.value.filter(
      (item) => item.id.toString() !== bookmark.id.toString(),
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
  console.warn('save bookmark', bookmark);
  try {
    console.warn(bookmark);
    await browser.bookmarks.update(String(bookmark.id), {
      title: tagHelper.toString(bookmark.title, bookmark.tags),
    });
    await browser.bookmarks.move(String(bookmark.id), {
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

const screenshot = async (bookmark) => {
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

const handleCommandPallete = () => commandPalleteRef.value.toggle();

const commandPaleteVisibilityHandler = (status) => {
  if (status === false) {
    setTimeout(() => searchInputRef.value.focus(), 500);
  }
};

const paginateBookmarks = async (skip) => {
  try {
    console.warn('skip', skip);
    bookmarks.value.push(
      ...(await bookmarkStorage.search(query.value, skip, 50)),
    );
  } catch (e) {
    console.error(e);
  }
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

watch(viewMode, () => localStorage.setItem('viewMode', viewMode.value));
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
  // drawer.value.open();
  const [sortColumn, sortDirection] = attrsSort.value.split(':');
  const result = await bookmarkStorage.getAttributes(attrsIncludes, sortColumn, sortDirection, attrsTerm.value, 0, 200);
  attributes.value = result;
  console.warn('attrs', attributes.value);
  await bookmarkStorage.refreshAttributes();
});

browser.runtime.onMessage.addListener(async (message) => {
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
