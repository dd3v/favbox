<template>
  <div class="flex w-full overflow-y-hidden">
    <nav-sidebar :items="tabs" v-model="currentTab" />
    <div class="sticky top-0 flex h-full" v-for="(items, key) in filters" :key="key">
      <filter-list
        class="w-52"
        :items="items"
        v-model="conditions[key]"
        v-if="currentTab === key"
      />
    </div>
    <div class="flex h-screen w-full flex-col overflow-hidden bg-gray-50 p-2 dark:bg-neutral-900">
      <div class="sticky top-0 z-10 flex h-14 flex-row space-x-3">
        <search-term v-model="conditions.term" />
        <sort-direction v-model="conditions.sort" />
        <search-conditions
          v-model="conditions"
          @remove="removeSearchOption"
          @removeAll="removeAllSearchOptions"
        />
        <bookmark-display v-model="displayType" />
      </div>
      <infinite-scroll @scroll:end="paginate" :limit="50" ref="scroll">
        <bookmark-layout :displayType="displayType">
          <bookmark-card
            v-for="(bookmark, key) in bookmarks"
            :displayType="displayType"
            :bookmark="bookmark"
            :key="key"
            @remove="handleRemoveBookmark"
            @preview="tools.open(0, bookmark)"
            @edit="tools.open(1, bookmark)"
          >
          </bookmark-card>
        </bookmark-layout>
      </infinite-scroll>
    </div>
    <bookmark-tools ref="tools" />
  </div>
    <NotificationGroup group="default" position="bottom">
  <div
    class="pointer-events-none fixed inset-0 z-50 flex items-end justify-end p-6 px-4"
  >
    <div class="w-full max-w-sm">
      <Notification
        v-slot="{ notifications }"
        enter="transform ease-out duration-300 transition"
        enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
        enter-to="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0"
        move="transition duration-500"
        move-delay="delay-300"
      >
        <div
          class="mx-auto mt-4 flex w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md dark:bg-neutral-700"
          v-for="notification in notifications"
          :key="notification.id"
        >
          <div class="flex w-12 items-center justify-center bg-green-400">
            <svg class="h-6 w-6 fill-current text-white" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
            </svg>
          </div>

          <div class="-mx-3 px-4 py-2">
            <div class="mx-3">
              <span class="font-semibold text-green-400">{{ notification.title }}</span>
              <p class="text-sm text-gray-600 dark:text-white">{{ notification.text }}</p>
            </div>
          </div>
        </div>
      </Notification>
    </div>
  </div>
</NotificationGroup>
</template>
<script setup>
import {
  toRaw, reactive, ref, watch, onMounted,
} from 'vue';
import { FolderOpenIcon, HashtagIcon, GlobeAltIcon } from '@heroicons/vue/24/outline';
import NavSidebar from '@/components/NavSidebar.vue';
import FilterList from '@/components/FilterList.vue';
import BookmarkCard from '@/components/bookmark/BookmarkCard.vue';
import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import { getFolderList } from '@/helpers/folders';
import SearchTerm from '@/components/search/SearchTerm.vue';
import SortDirection from '@/components/search/SortDirection.vue';
import SearchConditions from '@/components/search/SearchConditions.vue';
import BookmarkDisplay from '@/components/search/BookmarkDisplay.vue';
import BookmarkTools from '@/components/bookmark/BookmarkTools.vue';
import BookmarkLayout from '@/components/bookmark/BookmarkLayout.vue';
import InfiniteScroll from '@/components/InfiniteScroll.vue';
import { notify } from 'notiwind';

await initStorage();
const bookmarkStorage = new BookmarkStorage();
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
    await bookmarkStorage.remove(parseInt(bookmark.id, 10));
  } finally {
    bookmarks.value = bookmarks.value.filter(
      (item) => parseInt(item.id, 10) !== parseInt(bookmark.id, 10),
    );
    notify({
      group: 'default',
      title: 'Success',
      text: 'Boookmark sucefully removed!',
    }, 2500);
  }
};
const paginate = async (skip) => {
  try {
    console.warn('load', skip);
    bookmarks.value.push(...(await bookmarkStorage.search(toRaw(conditions), skip, 50)));
  } catch (e) {
    console.warn(e);
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

onMounted(async () => {
  folders.value = await getFolderList();
  tags.value = await bookmarkStorage.getTags();
  domains.value = await bookmarkStorage.getDomains();
});

chrome.runtime.onMessage.addListener(async (request) => {
  // handle updates from service worker
  if (request.type === 'swDbUpdated') {
    bookmarks.value = await bookmarkStorage.search(toRaw(conditions));
    folders.value = await getFolderList();
    tags.value = await bookmarkStorage.getTags();
    domains.value = await bookmarkStorage.getDomains();
  }
});
</script>
<style scoped></style>