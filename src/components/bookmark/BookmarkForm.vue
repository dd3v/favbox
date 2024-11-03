<template>
  <div class="space-y-3">
    <div class="relative">
      <label for="title">
        <input
          id="title"
          v-model="bookmark.title"
          type="text"
          placeholder="Page title"
          class="h-9 w-full rounded-md border-gray-200 pl-10 text-xs text-gray-700 shadow-sm outline-none focus:border-gray-300 focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 focus:dark:border-neutral-600"
        >
        <span class="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-content-center text-gray-700">
          <bookmark-favicon
            :bookmark="bookmark"
            class="size-4 fill-black"
          />
        </span>
      </label>
    </div>
    <div class="relative">
      <Listbox v-model="bookmark.folder">
        <div class="relative mt-1">
          <ListboxButton
            class="relative w-full cursor-default rounded-md border border-gray-200 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300"
          >
            <span class="block truncate">{{ bookmark.folder?.title }}</span>
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
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-xs shadow-lg ring-1 ring-black/5 focus:outline-none"
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
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-900',
                    'relative cursor-default select-none py-2',
                  ]"
                >
                  <span
                    :class="[
                      selected ? 'font-medium' : 'font-normal',
                      'block truncate',
                    ]"
                    :style="{'padding-left': (0.1 + folder.depth) + 'rem'}"
                  >{{ folder.title }} </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
    </div>
    <div class="relative">
      <app-tag-input
        v-model="bookmark.tags"
        :max="5"
        :suggestions="tags"
        placeholder="Enter a tag and press enter or tab"
      />
    </div>
    <fieldset
      v-if="bookmark.keywords && bookmark.keywords.length"
      class="rounded-md border p-3"
    >
      <legend>
        Tag seggestions baded on content page
      </legend>
      <AppBadge
        v-for="(value, key) in bookmark.keywords"
        :key="key"
        class="m-1"
        @click="addToTags"
      >
        {{ value }}
      </AppBadge>
    </fieldset>

    <div class="my-4 flex w-full justify-between">
      <AppButton
        class="w-full"
        @click="$emit('submit', bookmark)"
      >
        Save bookmark
      </AppButton>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
import AppTagInput from '@/components/app/AppTagInput.vue';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';
import AppBadge from '@/components/app/AppBadge.vue';
import AppButton from '@/components/app/AppButton.vue';
import HeroiconsChevronUpDown from '~icons/heroicons/chevron-up-down';

const props = defineProps({
  modelValue: {
    type: Object,
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
</script>
