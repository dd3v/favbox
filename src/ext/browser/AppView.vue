<template>
  <div class="flex w-full overflow-y-hidden">
    <section
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
        <broken-bookmarks v-model="conditions.error" />
      </div>
      <app-infinite-scroll
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
            @edit="edit"
          />
        </bookmark-layout>
      </app-infinite-scroll>
    </div>
    <bookmark-toolbar ref="drawer">
      <template #edit>
        <bookmark-form
          v-model="currentBookmark"
          :folders="bookmarkFolders"
          :tags="tags"
          class="w-3/5"
          @submit="handleSubmit"
        />
      </template>
    </bookmark-toolbar>
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
import {
  FolderOpenIcon,
  HashtagIcon,
  GlobeAltIcon,
} from '@heroicons/vue/24/outline';
import { notify } from 'notiwind';
import BookmarkToolbar from '@/components/bookmark/BookmarkToolbar.vue';
import NavSidebar from '@/components/NavSidebar.vue';
import FilterList from '@/components/FilterList.vue';
import BookmarkCard from '@/components/bookmark/BookmarkCard.vue';
import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import bookmarkHelper from '@/helpers/bookmarks';
import BookmarksSync from '@/components/BookmarksSync.vue';
import BrokenBookmarks from '@/components/search/BrokenBookmarks.vue';
import SearchTerm from '@/components/search/SearchTerm.vue';
import SortDirection from '@/components/search/SortDirection.vue';
import SearchConditions from '@/components/search/SearchConditions.vue';
import BookmarkDisplay from '@/components/search/BookmarkDisplay.vue';
import BookmarkLayout from '@/components/bookmark/BookmarkLayout.vue';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import BookmarkForm from '@/components/bookmark/BookmarkForm.vue';
import tagHelper from '@/helpers/tags';

await initStorage();
const bookmarkStorage = new BookmarkStorage();

const bookmarkFolders = ref(await bookmarkHelper.getFolders());

const currentBookmark = ref({});
const drawer = ref(null);

const displayType = ref(localStorage.getItem('displayType') ?? 'masonry');
const currentTab = ref('folders');
const tabs = [
  { value: 'folders', icon: FolderOpenIcon },
  { value: 'tags', icon: HashtagIcon },
  { value: 'domains', icon: GlobeAltIcon },
];
const scroll = ref(null);
const bookmarks = ref([]);

const defaultConditions = {
  tags: [],
  folders: [],
  domains: [],
  sort: 'desc',
  term: '',
  error: 0,
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
    console.warn(conditions);
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
  if (message.action === 'refresh') {
    if (message.data?.progress && message.data.progress <= 100) {
      showSync.value = true;
      syncProgress.value = message.data.progress;
    }
    bookmarks.value = await bookmarkStorage.search(toRaw(conditions));
    folders.value = await bookmarkHelper.getFoldersFlatten();
    tags.value = await bookmarkStorage.getTags();
    domains.value = await bookmarkStorage.getDomains();
  }
});
</script>
