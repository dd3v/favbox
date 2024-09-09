<template>
  <div class="flex w-full overflow-y-hidden">
    <section class="flex">
      <attribute-list
        v-model="query"
        :sort="attrsSort"
        :includes="attrsIncludes"
        :term="attrsTerm"
        class="sticky top-0 flex h-full w-64"
        :items="attrs"
      />
    </section>
    <div class="flex h-screen w-full flex-col overflow-hidden bg-gray-50 dark:bg-neutral-900">
      <div class="sticky top-0 z-10 flex h-14 flex-row space-x-3">
        <search-term
          ref="searchInputRef"
          v-model="temp"
        />
        <sort-direction v-model="temp" />
        <bookmark-display v-model="displayType" />
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
import {
  FolderOpenIcon,
  HashtagIcon,
  GlobeAltIcon,
} from '@heroicons/vue/24/outline';
import { notify } from 'notiwind';
import AppDrawer from '@/components/app/AppDrawer.vue';
import AttributeList from '@/components/AttributeList.vue';
import BookmarkCard from '@/components/bookmark/BookmarkCard.vue';
import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import bookmarkHelper from '@/helpers/bookmark';
import SearchTerm from '@/components/search/SearchTerm.vue';
import SortDirection from '@/components/search/SortDirection.vue';
import BookmarkDisplay from '@/components/search/BookmarkDisplay.vue';
import BookmarkLayout from '@/components/bookmark/BookmarkLayout.vue';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import BookmarkForm from '@/components/bookmark/BookmarkForm.vue';
import tagHelper from '@/helpers/tags';
import BookmarksSync from '@/ext/browser/components/BookmarksSync.vue';

await initStorage();
const bookmarkStorage = new BookmarkStorage();

const bookmarkFolders = ref(await bookmarkHelper.getFolders());

const temp = ref(null);

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

const query = reactive({
  domain: [],
  tag: [],
  folder: [],
  locale: [],
  keyword: [],
  type: [],
  error: false,
});

const attrs = ref([]);
const attrsSort = ref('asc');
const attrsIncludes = ref(['folders']);
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
      ...(await bookmarkStorage.search(toRaw(query), skip, 50)),
    );
  } catch (e) {
    console.error(e);
  }
};
watch(displayType, () => localStorage.setItem('displayType', displayType.value));
watch(
  query,
  async () => {
    console.warn(query);
    scroll.value?.scrollUp();
    bookmarks.value = await bookmarkStorage.search(toRaw(query));
  },
  { immediate: true, deep: true },
);

watch([attrsSort, attrsTerm, attrsIncludes], ([newSort, newTerm, newIncludes]) => {
  console.warn('newSort', newSort);
  console.warn('newTerm', newTerm);
  console.warn('newIncludes', newIncludes);

  // eslint-disable-next-line no-unused-expressions
  attrs.value = newSort === 'asc'
    ? attrs.value.sort((a, b) => {
      const valueA = a.value || '';
      const valueB = b.value || '';
      return valueA.localeCompare(valueB);
    })
    : attrs.value.sort((a, b) => {
      const valueA = a.value || '';
      const valueB = b.value || '';
      return valueB.localeCompare(valueA);
    });
  // attrs.value = attrs.value.filter((item) => attrsIncludes.value.includes(item.key));
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
  attrs.value = await bookmarkStorage.getAttributes();

  console.warn('attrs', attrs.value);
});

chrome.runtime.onMessage.addListener(async (message) => {
  // handle updates from service worker
  if (message.action === 'refresh') {
    if (message.data?.progress && message.data.progress <= 100) {
      showSync.value = true;
      syncProgress.value = message.data.progress;
    }
    bookmarks.value = await bookmarkStorage.search(toRaw(query));
    attrs.value = await bookmarkStorage.getAttributes();
  }
});
</script>
