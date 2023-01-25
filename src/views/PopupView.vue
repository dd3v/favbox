<template>
  <div class="h-auto w-72 space-y-5 p-3 dark:bg-gray-900">
    <div class="flex justify-between">
      <h4 class="text-xl font-semibold">WebSnap</h4>
      <div class="flex self-end">
        <button
          @click="openApp"
          class="group relative inline-flex items-center justify-center overflow-hidden rounded-md border border-purple-500 p-2 py-1 font-medium text-indigo-600 shadow-sm transition duration-300 ease-out"
        >
          <span
            class="ease absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center bg-purple-500 text-white duration-300 group-hover:translate-x-0"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
          <span
            class="ease absolute flex h-full w-full items-center justify-center text-purple-500 transition-all duration-300 group-hover:translate-x-full"
            >Open App</span
          >
          <span class="invisible relative">Button Text</span>
        </button>
      </div>
    </div>
    <div class="relative">
      <label for="title">
        <input
          type="email"
          id="title"
          :value="bookmark.title"
          placeholder="Page title"
          class="w-full rounded-md border-gray-200 pl-10 text-xs shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />

        <span
          class="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-content-center text-gray-500"
        >
          <img :src="bookmark.favicon" width="16" :alt="bookmark.title" v-if="httpProtocol" />
          <home-icon class="h-4 w-4" v-else />
        </span>
      </label>
    </div>
    <div class="relative">
      <Combobox v-model="folder">
        <div class="relative mt-1">
          <div class="w-full">
            <ComboboxInput
              class="w-full rounded-md border-gray-200 text-xs shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              :displayValue="(folder) => folder.title"
              @change="query = $event.target.value"
            />
            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </ComboboxButton>
          </div>
          <TransitionRoot
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            @after-leave="query = ''"
          >
            <ComboboxOptions
              class="absolute z-10 mt-1 max-h-44 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <div
                v-if="filteredFolders.length === 0 && query !== ''"
                class="relative cursor-default select-none py-2 px-4 text-gray-700"
              >
                Nothing found.
              </div>

              <ComboboxOption
                v-for="folder in filteredFolders"
                as="template"
                :key="folder.id"
                :value="folder"
                v-slot="{ selected, active }"
              >
                <li
                  class="relative cursor-default select-none py-2 pl-10 pr-4"
                  :class="{
                    'bg-neutral-100 text-gray-900': active,
                    'text-gray-500': !active,
                  }"
                >
                  <span
                    class="block truncate"
                    :class="{ 'font-medium': selected, 'font-normal': !selected }"
                  >
                    {{ folder.title }}
                  </span>
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                    :class="{ 'text-gray-900': active, 'text-gray-500': !active }"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ComboboxOption>
            </ComboboxOptions>
          </TransitionRoot>
        </div>
      </Combobox>
    </div>
    <div>
      <tag-input :max="5" placeholder="Enter a tag" v-model="tags" />
    </div>
    <div class="my-4 flex w-full justify-between">
      <button
        @click="createBookmark"
        class="inline-block w-full shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-2 font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
      >
        Create bookmark
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue';
import TagInput from '@/components/TagInput.vue';
import { CheckIcon, ChevronUpDownIcon, HomeIcon } from '@heroicons/vue/20/solid';
import { ref, computed } from 'vue';
import { getBookmarkFolders } from '@/helpers/folders';
import tagHelper from '@/helpers/tags';

const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const folders = await getBookmarkFolders();
const query = ref('');
const filteredFolders = computed(() => (query.value === ''
  ? folders
  : folders.filter((folder) => folder.title
    .toLowerCase()
    .replace(/\s+/g, '')
    .includes(query.value.toLowerCase().replace(/\s+/g, '')))));
const tags = ref([]);
const folder = ref(folders[0]);
const bookmark = ref({
  title: tab.title,
  url: tab.url,
  favicon: tab.favIconUrl,
});

const httpProtocol = computed(() => (bookmark.value.favicon ? bookmark.value.favicon.includes('http') : false));

const createBookmark = async () => {
  console.warn(bookmark.value);
  const response = await chrome.runtime.sendMessage({
    action: 'createBookmark',
    data: {
      title:
        tags.value.length !== 0
          ? tagHelper.toString(bookmark.value.title, tags.value)
          : bookmark.value.title,
      parentId: folder.value.id,
      url: bookmark.value.url,
    },
  });
  console.warn(response);
};

const openApp = () => chrome.tabs.create({ url: '/app.html', index: tab.index + 1 });
</script>
<style>
html,
body {
  width: 18rem !important;
}
</style>
