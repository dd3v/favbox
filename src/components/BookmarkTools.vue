<template>
  <div
    class="h-screen w-0 flex-row overflow-hidden border-l border-solid border-gray-200 bg-gray-100 text-sm text-gray-600 delay-150 duration-100 ease-out"
    ref="block"
  >
    <TabGroup :selectedIndex="selectedTab" @change="changeTab">
      <div class="flex w-full p-2">
        <div class="flex w-full justify-center">
          <TabList class="flex w-72 space-x-1 rounded-xl bg-gray-300/20 p-1">
            <Tab v-slot="{ selected }" as="template">
              <button
                :class="[
                  'w-full rounded-lg py-1 text-sm font-medium leading-5 text-gray-700',
                  ' focus:outline-none ',
                  selected
                    ? 'bg-white shadow'
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
                    ? 'bg-white shadow'
                    : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700',
                ]"
              >
                Edit bookmark
              </button>
            </Tab>
          </TabList>
        </div>
        <button @click="close">
          <x-circle-icon class="h-5 w-5" />
        </button>
      </div>

      <TabPanels class="w-full">
        <TabPanel class="flex h-screen w-full overflow-y-auto p-4">
          <app-spinner v-if="loading" class="flex w-full items-center justify-center" />
          <article class="prose prose-slate">
            <div v-html="content"></div>
          </article>
        </TabPanel>
        <TabPanel class="flex h-screen w-full justify-center p-4">
          <bookmark-form v-model="bookmark" :folders="folders" @save="handleSave" class="w-4/6" />
        </TabPanel>
      </TabPanels>
    </TabGroup>
    <hr />
  </div>
</template>
<script setup>
import Parser from '@postlight/parser';
import { onMounted, ref, watch } from 'vue';
import { XCircleIcon } from '@heroicons/vue/24/outline';
import {
  TabGroup, TabList, Tab, TabPanels, TabPanel,
} from '@headlessui/vue';
import BookmarkForm from '@/components/BookmarkForm.vue';
import { getBookmarkFolders } from '@/helpers/folders';
import tagHelper from '@/helpers/tags';
import AppSpinner from '@/components/AppSpinner.vue';

const bookmark = ref({});
const selectedTab = ref(1);
const folders = ref([]);
const block = ref(null);
const content = ref('');
const loading = ref(true);

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
  block.value.style.width = '0';
};

const open = (tabIndex, data) => {
  selectedTab.value = tabIndex;
  block.value.style.width = '100vw';
  bookmark.value = data;
};

watch(
  bookmark,
  async () => {
    content.value = '';
    loading.value = true;
    const response = await Parser.parse(bookmark.value.url);
    content.value = response?.content;
    loading.value = false;
  },
  {
    immediate: true,
    deep: true,
  },
);

// FIXME
onMounted(async () => {
  folders.value = await getBookmarkFolders();
});
defineExpose({ open });
</script>
