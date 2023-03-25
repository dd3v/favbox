<template>
  <div class="flex w-full overflow-y-hidden">
    <section
      v-if="visible"
      class="flex"
    >
      <nav-sidebar
        v-model="currentTab"
        :items="tabs"
      />
      <div
        v-for="(items, key) in filters"
        :key="key"
        class="sticky top-0 flex h-full"
      >
        <filter-list
          v-if="currentTab === key"
          v-model="conditions[key]"
          class="w-52"
          :items="items"
        />
      </div>
    </section>
    <div
      class="flex h-screen w-full flex-col overflow-hidden bg-gray-50 dark:bg-neutral-900"
    >
      <div class="sticky top-0 z-10 flex h-14 flex-row space-x-3 p-2">
        <search-term
          ref="searchInputRef"
          v-model="conditions.term"
        />
        <sort-direction v-model="conditions.sort" />
        <search-conditions
          v-model="conditions"
          @remove="removeSearchOption"
          @removeAll="removeAllSearchOptions"
        />
        <bookmark-display v-model="displayType" />
      </div>
      <infinite-scroll
        ref="scroll"
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
          class="p-2"
        >
          <bookmark-card
            v-for="(bookmark, key) in bookmarks"
            :key="key"
            :display-type="displayType"
            :bookmark="bookmark"
            @remove="handleRemoveBookmark"
            @preview="tools.open(0, bookmark)"
            @edit="tools.open(1, bookmark)"
          />
        </bookmark-layout>
      </infinite-scroll>
    </div>
    <bookmark-tools ref="tools" />
  </div>
  <bookmarks-sync
    v-if="showSync"
    :progress="syncProgress"
  />
</template>
<script setup>
import {
  toRaw, reactive, ref, watch, onMounted,
} from 'vue';
import {
  FolderOpenIcon,
  HashtagIcon,
  GlobeAltIcon,
} from '@heroicons/vue/24/outline';
import { notify } from 'notiwind';
import NavSidebar from '@/components/NavSidebar.vue';
import FilterList from '@/components/FilterList.vue';
import BookmarkCard from '@/components/bookmark/BookmarkCard.vue';
import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import bookmarkHelper from '@/helpers/bookmarks';
import BookmarksSync from '@/components/BookmarksSync.vue';
import SearchTerm from '@/components/search/SearchTerm.vue';
import SortDirection from '@/components/search/SortDirection.vue';
import SearchConditions from '@/components/search/SearchConditions.vue';
import BookmarkDisplay from '@/components/search/BookmarkDisplay.vue';
import BookmarkTools from '@/components/bookmark/BookmarkTools.vue';
import BookmarkLayout from '@/components/bookmark/BookmarkLayout.vue';
import InfiniteScroll from '@/components/InfiniteScroll.vue';

await initStorage();
const bookmarkStorage = new BookmarkStorage();

const visible = ref(true);

const displayType = ref(localStorage.getItem('displayType') ?? 'masonry');
const currentTab = ref('folders');
const tabs = [
  { value: 'folders', icon: FolderOpenIcon },
  { value: 'tags', icon: HashtagIcon },
  { value: 'domains', icon: GlobeAltIcon },
];
const scroll = ref(null);
const bookmarks = ref([]);
const tools = ref('');
const defaultConditions = {
  tags: [],
  folders: [],
  domains: [],
  sort: 'desc',
  term: '',
};
const searchInputRef = ref(null);
const showSync = ref(false);
const syncProgress = ref(0);
const empty = ref(false);
const conditions = reactive({ ...defaultConditions });
const folders = ref([]);
const tags = ref([]);
const domains = ref([]);
const filters = reactive({ folders, tags, domains });
const removeAllSearchOptions = () => {
  conditions.tags = [];
  conditions.domains = [];
  conditions.folders = [];
};
const removeSearchOption = (option) => {
  const index = conditions[option.type].indexOf(option.name);
  if (index !== -1) {
    conditions[option.type].splice(index, 1);
  }
};
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
const paginate = async (skip) => {
  try {
    console.warn('load', skip);
    bookmarks.value.push(
      ...(await bookmarkStorage.search(toRaw(conditions), skip, 50)),
    );
  } catch (e) {
    console.error(e);
  }
};
watch(displayType, () => localStorage.setItem('displayType', displayType.value));
watch(
  conditions,
  async () => {
    scroll.value?.scrollUp();
    bookmarks.value = await bookmarkStorage.search(toRaw(conditions));
  },
  { immediate: true, deep: true },
);
watch(
  bookmarks,
  () => {
    empty.value = bookmarks.value.length === 0;
  },
  { immediate: true },
);

onMounted(async () => {
  folders.value = await bookmarkHelper.getFoldersFlatten();
  tags.value = await bookmarkStorage.getTags();
  domains.value = await bookmarkStorage.getDomains();
});

chrome.runtime.onMessage.addListener(async (message) => {
  // handle updates from service worker
  if (message.type === 'swDbUpdated') {
    if (message.data.installed === true && message.data.progress <= 100) {
      showSync.value = true;
      syncProgress.value = message.data.progress;
    }
    bookmarks.value = await bookmarkStorage.search(toRaw(conditions));
    folders.value = await bookmarkHelper.getFoldersFlatten();
    tags.value = await bookmarkStorage.getTags();
    domains.value = await bookmarkStorage.getDomains();
  }
});

window.addEventListener('message', (event) => {
  if (event.data.type === 'favbox' && event.data.name === 'iframe') {
    visible.value = false;
    searchInputRef.value.input.focus();
    displayType.value = 'list';
  }
});

document.addEventListener('keydown', (event) => {
  if (event.keyCode === 27) {
    window?.parent.postMessage({ type: 'favbox', name: 'close' }, '*');
  }
});
</script>
<style scoped></style>
