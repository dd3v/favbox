<template>
  <div
    class="absolute top-0 right-0 z-50 h-screen w-0 overflow-hidden bg-white pl-0 transition-all dark:bg-neutral-900 dark:text-neutral-400"
    :style="{
      width: drawerVisible ? '50vw' : '0',
      paddingLeft: drawerVisible ? '10px' : '0',
    }"
  >
    <TabGroup :selectedIndex="selectedTab" @change="changeTab">
      <div class="flex w-full">
        <div class="flex w-full justify-center py-1">
          <TabList class="flex w-72 space-x-1 rounded-xl bg-gray-300/20 p-1">
            <Tab v-slot="{ selected }" as="template">
              <button
                :class="[
                  'w-full rounded-lg py-1 text-sm font-medium leading-5 text-gray-700',
                  ' focus:outline-none ',
                  selected
                     ? 'bg-white shadow dark:bg-neutral-900 dark:text-neutral-400'
                    : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700',
                ]"
              >
                Preview page
              </button>
            </Tab>
            <Tab v-slot="{ selected }" as="template">
              <button
                :class="[
                  'w-full rounded-lg py-1 text-sm font-medium leading-5 text-gray-700',
                  'focus:outline-none ',
                  selected
                    ? 'bg-white shadow dark:bg-neutral-900 dark:text-white'
                    : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700',
                ]"
              >
                Edit bookmark
              </button>
            </Tab>
          </TabList>
        </div>
        <button @click="close" class="mr-2">
          <x-circle-icon class="h-5 w-5" />
        </button>
      </div>
      <TabPanels class="flex h-screen w-full p-4">
        <TabPanel class="flex h-screen w-full overflow-y-auto">
          <article class="prose  w-full max-w-none dark:prose-invert">
            <app-spinner
              v-if="loading"
              class="flex h-screen w-full flex-col items-center justify-center"
            />
            <div
              class="flex h-screen w-full flex-col items-center justify-center"
              v-if="emptyState"
            >
              <img class="w-32" :src="empty" alt="error" />
              <h4 class="text-gray-700 dark:text-neutral-400">Nothing to show</h4>
            </div>
            <div v-else v-html="content"></div>
          </article>
        </TabPanel>
        <TabPanel class="flex h-screen w-full justify-center">
          <bookmark-form v-model="bookmark" :folders="folders" @save="handleSave" class="w-4/6" />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
  <div
    class="absolute left-0 top-0 z-10 h-screen w-0 bg-black/30 transition-opacity"
    :style="{
      width: drawerVisible ? '100vw' : '0',
      opacity: drawerVisible ? '0.6' : '0',
    }"
    @keydown="close"
    @click="close"
  ></div>
</template>

<script setup>
import Parser from '@postlight/parser';
import { ref, watch } from 'vue';
import { XCircleIcon } from '@heroicons/vue/24/outline';
import {
  TabGroup, TabList, Tab, TabPanels, TabPanel,
} from '@headlessui/vue';
import BookmarkForm from '@/components/bookmark/BookmarkForm.vue';
import { getBookmarkFolders } from '@/helpers/folders';
import tagHelper from '@/helpers/tags';
import AppSpinner from '@/components/AppSpinner.vue';
import empty from '@/assets/empty.svg';

const bookmark = ref({});
const selectedTab = ref(1);
const folders = ref([]);
const content = ref('');
const drawerVisible = ref(false);
const loading = ref(true);
const emptyState = ref(false);
folders.value = await getBookmarkFolders();

function changeTab(index) {
  selectedTab.value = index;
}

const handleSave = async () => {
  console.warn('save');
  await chrome.bookmarks.update(String(bookmark.value.id), {
    title: tagHelper.toString(bookmark.value.title, bookmark.value.tags),
    url: bookmark.value.url,
  });
  await chrome.bookmarks.move(String(bookmark.value.id), { parentId: bookmark.value.folder.id });
};

const close = () => {
  drawerVisible.value = false;
};

const open = (tabIndex, data) => {
  selectedTab.value = tabIndex;
  bookmark.value = data;
  drawerVisible.value = true;
};

watch(
  bookmark,
  async () => {
    try {
      emptyState.value = false;
      content.value = '';
      loading.value = true;
      const response = await Parser.parse(bookmark.value.url);
      content.value = response?.content ?? '';
      if (content.value.length <= 100) {
        throw new Error('Nothing to show');
      }
    } catch (e) {
      emptyState.value = true;
      content.value = '';
    } finally {
      loading.value = false;
    }
  },
  {
    immediate: true,
    deep: true,
  },
);
defineExpose({ open });
</script>
