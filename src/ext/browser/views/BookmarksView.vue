<template>
  <div class="flex w-full overflow-y-hidden">
    <section class="flex">
      <attribute-list
        v-model="query"
        v-model:sort="attrsSort"
        v-model:includes="attrsIncludes"
        v-model:term="attrsTerm"
        class="sticky top-0 flex h-full w-64"
        :items="attrs"
      />
    </section>
    <div class="flex h-screen w-full flex-col overflow-hidden">
      <div class="sticky top-0 z-10 flex w-auto flex-row space-x-3">
        <search-term
          ref="searchInputRef"
          v-model="query"
          placeholder="Search your bookmarks.. ⏎"
        />
        <ViewMode v-model="displayType" />
      </div>
      <app-infinite-scroll
        ref="scroll"
        class="size-full overflow-y-auto"
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
  </div>
</template>
<script setup>
import {
  toRaw, reactive, ref, watch, onMounted,
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

await initStorage();
const bookmarkStorage = new BookmarkStorage();

const bookmarkFolders = ref(await bookmarkHelper.getFolders());

const temp = ref([]);

const currentBookmark = ref({});
const drawer = ref(null);

const displayType = ref(localStorage.getItem('displayType') ?? 'masonry');

const scroll = ref(null);
const bookmarks = ref([]);

const query = ref([]);

const attrs = ref([]);
const attrsSort = ref('name:asc');
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
  try {
    await chrome.bookmarks.remove(String(bookmark.id));
  } catch (e) {
    console.error(e);
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

  const result = await bookmarkStorage.getAttributes(attrsIncludes, attrsSort.value, attrsTerm.value);

  attrs.value = result;
}, { deep: true });

watch(attrsTerm, () => {
  console.log('attrsTerm', attrsTerm.value);
});

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
  const result = await bookmarkStorage.getAttributes(attrsIncludes, attrsSort.value, attrsTerm.value);

  attrs.value = result;

  console.warn('attrs', attrs.value);
});

chrome.runtime.onMessage.addListener(async (message) => {
  // handle updates from service worker
  if (message.action === 'refresh') {
    if (message.data?.progress && message.data.progress <= 100) {
      showSync.value = true;
      syncProgress.value = message.data.progress;
    }
    bookmarks.value = await bookmarkStorage.search(query.value);
    attrs.value = await bookmarkStorage.getAttributes(attrsIncludes, attrsSort.value, attrsTerm.value);
  }
});
</script>
