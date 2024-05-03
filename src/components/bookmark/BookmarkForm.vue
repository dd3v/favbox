<template>
  <div class="space-y-3">
    <div class="relative">
      <label for="title">
        <input
          id="title"
          v-model="bookmark.title"
          type="text"
          placeholder="Page title"
          class="w-full rounded-md border-gray-200 pl-10 text-xs text-gray-700 shadow-sm outline-none focus:border-gray-300 focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 focus:dark:border-neutral-600"
        >
        <span
          class="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-content-center text-gray-700"
        >
          <bookmark-favicon
            :bookmark="bookmark"
            class="h-4 w-4 fill-gray-700 dark:fill-gray-100"
          />
        </span>
      </label>
    </div>
    <div class="relative">
      <Combobox
        v-model="bookmark.folder"
        :default-value="folders[0]"
      >
        <div class="relative mt-1">
          <div class="w-full">
            <ComboboxInput
              class="w-full rounded-md border-gray-200 text-xs text-gray-700 shadow-sm outline-none focus:border-gray-300 focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 focus:dark:border-neutral-600"
              :display-value="(folder) => folder?.title"
              @change="query = $event.target.value"
            />
            <ComboboxButton
              class="absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <ChevronUpDownIcon
                class="h-5 w-5 text-gray-700"
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>
          <TransitionRoot
            leave="transition ease-in duration-100"
            leave-from="opacity-100"
            leave-to="opacity-0"
            @after-leave="query = ''"
          >
            <ComboboxOptions
              class="absolute z-10 mt-1 max-h-44 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-neutral-800"
            >
              <div
                v-if="filteredFolders.length === 0 && query !== ''"
                class="relative cursor-default select-none px-4 py-2"
              >
                Nothing found.
              </div>

              <ComboboxOption
                v-for="folder in filteredFolders"
                :key="folder.id"
                v-slot="{ selected, active }"
                as="template"
                :value="folder"
              >
                <li
                  class="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-700 dark:text-neutral-400"
                  :class="{ 'bg-neutral-50 dark:bg-neutral-700': active }"
                >
                  <span
                    class="block truncate"
                    :class="{
                      'font-medium': selected,
                      'font-normal': !selected,
                    }"
                  >
                    {{ folder.title }}
                  </span>
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                    :class="{
                      'text-gray-900': active,
                      'text-gray-700': !active,
                    }"
                  >
                    <CheckIcon
                      class="h-5 w-5"
                      aria-hidden="true"
                    />
                  </span>
                </li>
              </ComboboxOption>
            </ComboboxOptions>
          </TransitionRoot>
        </div>
      </Combobox>
    </div>
    <div class="relative">
      <app-tag-input
        v-model="bookmark.tags"
        :max="5"
        :suggestions="tags"
        placeholder="Enter a tag and press enter or tab"
      />
    </div>
    <div class="relative my-4 flex w-full justify-between">
      <button
        class="inline-block w-full shrink-0 rounded-md border border-rose-400 bg-rose-400 px-12 py-2 text-white shadow-sm outline-none ring-0 transition hover:bg-transparent hover:text-rose-400 focus:ring-0 active:text-rose-400"
        @click="$emit('submit', bookmark)"
      >
        Save bookmark
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid';
import AppTagInput from '@/components/app/AppTagInput.vue';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      id: null,
      title: null,
      url: null,
      favicon: null,
      folder: {},
      tags: [],
    }),
    required: true,
  },
  folders: {
    type: Array,
    required: true,
    default: () => [],
  },
  tags: {
    type: Array,
    required: true,
    default: () => [],
  },
});
const emit = defineEmits(['update:modelValue', 'submit']);
const bookmark = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
const folders = computed({
  get: () => props.folders,
});
const query = ref('');
const filteredFolders = computed(() => (query.value === ''
  ? folders.value
  : folders.value.filter((folder) => folder.title
    .toLowerCase()
    .replace(/\s+/g, '')
    .includes(query.value.toLowerCase().replace(/\s+/g, '')))));
</script>
