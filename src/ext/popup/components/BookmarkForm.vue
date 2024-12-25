<template>
  <form
    @submit.prevent="submit"
    @keydown.enter.prevent
  >
    <div class="space-y-3">
      <label
        for="title"
        class="relative"
      >
        <input
          id="title"
          v-model="bookmarkTitle"
          required
          type="text"
          placeholder="Page title"
          class="h-9 w-full rounded-md border-gray-200 pl-10 text-xs text-black shadow-sm outline-none focus:border-gray-300 focus:ring-0  dark:border-neutral-800 dark:bg-neutral-900 dark:text-white focus:dark:border-neutral-700"
        >
        <span class="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-content-center text-gray-700">
          <img
            v-if="favicon"
            class="size-5"
            :src="favicon"
            alt="favicon"
          >
          <PhGlobeSimpleLight
            v-else
            class="size-5"
          />
        </span>
      </label>
      <Listbox
        v-model="selectedFolder"
        class="relative"
      >
        <div class="mt-1">
          <!--
          TODO: There are some issues with rendering trees; it might be necessary to consider a more suitable solution.
          Currently using deeph due to challenges with recursive function calls and rendering the headless-ui component. 😔
          -->
          <ListboxButton
            class="relative h-9 w-full cursor-default rounded-md border border-gray-200 bg-white pl-3 pr-10 text-left shadow-sm focus:border-gray-300 focus:outline-none  dark:border-neutral-800 dark:bg-neutral-900 dark:text-white focus:dark:border-neutral-700"
          >
            <span class="block truncate text-xs">{{ selectedFolder.title }}</span>
            <span
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <HeroiconsChevronUpDown
                class="size-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions
              class="z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-xs shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-neutral-900 dark:text-neutral-400"
            >
              <ListboxOption
                v-for="folder in folders"
                v-slot="{ active, selected }"
                :key="folder.id"
                :value="folder"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-gray-100 text-gray-900 dark:bg-neutral-800' : '',
                    'relative cursor-default select-none py-2',
                  ]"
                >
                  <span
                    :class="[
                      selected ? 'font-medium' : 'font-normal',
                      'block truncate text-black dark:text-white',
                    ]"
                    :style="{'padding-left': (0.1 + folder.depth) + 'rem'}"
                  >{{ folder.title }} </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
      <app-tag-input
        v-model="selectedTags"
        class="relative"
        :max="5"
        :suggestions="tags"
        placeholder="Enter a tag and press enter or tab"
      />
      <div class="my-4 flex w-full justify-between">
        <AppButton
          class="w-full"
        >
          Save bookmark
        </AppButton>
      </div>
    </div>
  </form>
</template>
<script setup>
import { ref } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
import AppTagInput from '@/components/app/AppTagInput.vue';
import AppButton from '@/components/app/AppButton.vue';
import tagHelper from '@/helpers/tags';
import HeroiconsChevronUpDown from '~icons/heroicons/chevron-up-down';
import PhGlobeSimpleLight from '~icons/ph/globe-simple-light';

const props = defineProps({
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
  favicon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const bookmarkTitle = ref(props.title);
const selectedFolder = ref(props.folders[0]);
const selectedTags = ref([]);

const emit = defineEmits(['submit']);

const submit = () => {
  const data = { title: tagHelper.toString(bookmarkTitle.value, selectedTags.value), url: props.url, parentId: String(selectedFolder.value.id) };
  console.warn('emit', selectedFolder.value);
  emit('submit', data);
};
</script>
