<template>
  <div class="space-y-3">
    <div class="relative">
      <label for="title">
        <input
          type="text"
          id="title"
          v-model="bookmark.title"
          placeholder="Page title"
          class="w-full rounded-md border-gray-200 pl-10 text-xs text-gray-700 shadow-sm outline-none focus:border-gray-300 focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 focus:dark:border-neutral-600"
        />

        <span
          class="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-content-center text-gray-700"
        >
          <bookmark-favicon :favicon="bookmark.favicon" class="h-4 w-4" />
        </span>
      </label>
    </div>
    <div class="relative">
      <Combobox v-model="selectedFolder">
        <div class="relative mt-1">
          <div class="w-full">
            <ComboboxInput
              class="w-full rounded-md border-gray-200 text-xs text-gray-700 shadow-sm outline-none focus:border-gray-300 focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 focus:dark:border-neutral-600"
              :displayValue="(folder) => folder.title"
              @change="query = $event.target.value"
            />
            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon class="h-5 w-5 text-gray-700" aria-hidden="true" />
            </ComboboxButton>
          </div>
          <TransitionRoot
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            @after-leave="query = ''"
          >
            <ComboboxOptions
              class="absolute z-10 mt-1 max-h-44 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-neutral-800"
            >
              <div
                v-if="filteredFolders.length === 0 && query !== ''"
                class="relative cursor-default select-none py-2 px-4"
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
                  class="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-700 dark:bg-neutral-800 dark:text-neutral-400"
                  :class="{ 'bg-neutral-50 dark:bg-neutral-700': active }"
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
                    :class="{ 'text-gray-900': active, 'text-gray-700': !active }"
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
    <div class="relative">
      <tag-input :max="5" placeholder="Enter a tag" v-model="bookmark.tags" />
    </div>
    <div class="relative my-4 flex w-full justify-between">
      <button
        @click="$emit('save', bookmark)"
        class="inline-block w-full shrink-0 rounded-md border border-rose-400 bg-rose-400 px-12 py-2 text-white outline-none ring-0 transition hover:bg-transparent hover:text-rose-400 focus:ring-0 active:text-rose-400"
      >
        Save bookmark
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue';
import TagInput from '@/components/TagInput.vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';
import { getFolderById } from '@/helpers/folders';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  folders: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'save']);
const bookmark = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
const folders = computed({
  get: () => props.folders,
});
const selectedFolder = ref(folders.value[0]);
const query = ref('');
const filteredFolders = computed(() => (query.value === ''
  ? folders.value
  : folders.value.filter((folder) => folder.title
    .toLowerCase()
    .replace(/\s+/g, '')
    .includes(query.value.toLowerCase().replace(/\s+/g, '')))));

watch(() => bookmark, async () => {
  selectedFolder.value = bookmark.value?.folderId ? await getFolderById(bookmark.value.folderId) : folders.value[0];
}, { deep: true, immediate: true });

watch(() => selectedFolder, () => {
  bookmark.value.folderId = selectedFolder.value.id;
  bookmark.value.folderName = selectedFolder.value.title;
}, { deep: true });

</script>
