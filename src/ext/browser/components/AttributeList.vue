<template>
  <div
    class="flex h-screen w-64 flex-col bg-white"
  >
    <div class="flex w-full space-x-1 px-1">
      <input
        v-model="term"
        autocomplete="off"
        type="text"
        placeholder="Search terms..."
        class="w-full rounded-md border-gray-200 text-gray-700 shadow-sm outline-none focus:border-gray-300 focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 focus:dark:border-neutral-600 sm:text-sm"
      >
      <Popover
        v-slot="{ open }"
        class="relative"
      >
        <PopoverButton
          :class="open ? 'text-white' : 'text-white/90'"
          class="inline-flex items-stretch rounded-md border bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
        >
          <ChevronDownIcon
            :class="open ? 'text-gray-700' : 'text-gray-700/70'"
            class="size-5 transition duration-150 ease-in-out group-hover:text-gray-700/80"
            aria-hidden="true"
          />
        </PopoverButton>

        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-1 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-1 opacity-0"
        >
          <PopoverPanel
            class="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white shadow-md ring-1 ring-black/10 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:ring-gray-800"
          >
            <div class="flex flex-col space-y-4 p-4">
              <div class="flex items-center space-x-2">
                <SortIcon class="size-5 text-gray-800 dark:text-gray-200" />
                <h3 class="text-sm text-gray-800 dark:text-gray-200">
                  Sort By
                </h3>
              </div>

              <div class="flex flex-col space-y-2">
                <app-radio
                  v-model="sort"
                  label="Name ↑ (A-Z)"
                  value="name:asc"
                  name="sort"
                  class="text-gray-800 dark:text-gray-200"
                />
                <app-radio
                  v-model="sort"
                  label="Name ↓ (Z-A)"
                  value="name:desc"
                  name="sort"
                  class="text-gray-800 dark:text-gray-200"
                />
                <app-radio
                  v-model="sort"
                  label="Count ↑ (0-9)"
                  value="count:asc"
                  name="sort"
                  class="text-gray-800 dark:text-gray-200"
                />
                <app-radio
                  v-model="sort"
                  label="Count ↓ (9-0)"
                  value="count:desc"
                  name="sort"
                  class="text-gray-800 dark:text-gray-200"
                />
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700" />

              <div class="flex items-center space-x-2">
                <IncludeIcon class="size-5 text-gray-800 dark:text-gray-200" />
                <h3 class="text-sm text-gray-800 dark:text-gray-200">
                  Includes
                </h3>
              </div>

              <div class="flex flex-col space-y-2">
                <app-checkbox
                  v-model="includes"
                  label="Domains"
                  value="domain"
                  name="domain_includes"
                  class="text-gray-800 dark:text-gray-200"
                />
                <app-checkbox
                  v-model="includes"
                  label="Folders"
                  value="folder"
                  name="folder_includes"
                  class="text-gray-800 dark:text-gray-200"
                />
                <app-checkbox
                  v-model="includes"
                  label="Keywords"
                  value="keyword"
                  name="keyword_includes"
                  class="text-gray-800 dark:text-gray-200"
                />
                <app-checkbox
                  v-model="includes"
                  label="Locales"
                  value="locale"
                  name="locale_includes"
                  class="text-gray-800 dark:text-gray-200"
                />
                <app-checkbox
                  v-model="includes"
                  label="Tags"
                  value="tag"
                  name="tag_includes"
                  class="text-gray-800 dark:text-gray-200"
                />
                <app-checkbox
                  v-model="includes"
                  label="Types"
                  value="type"
                  name="type_includes"
                  class="text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            <div>
              <a
                href="##"
                class="block w-full rounded-b-lg border-t border-gray-200 bg-gray-50 p-2 text-center text-sm font-medium text-gray-600 shadow-sm transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </a>
            </div>
          </PopoverPanel>
        </transition>
      </Popover>
    </div>
    <transition-group
      tag="ul"
      name="fade"
      class="flex h-screen scroll-p-0.5 flex-col overflow-y-auto"
    >
      <li
        v-for="(item, key) in list"
        :key="item.id + key"
        class="px-1"
      >
        <label
          :key="item.id + key"
          :for="item.id + key"
          :class="{'bg-red-100':Array.isArray(modelValue[item.key]) && modelValue[item.key].includes(item.value)}"
          class="my-1 flex cursor-pointer place-items-end items-center rounded-md p-2 text-gray-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <component
            :is="getIcon(item)"
            class="size-4"
          />
          <input
            :id="item.id + key"
            type="checkbox"
            class="hidden"
            name="item"
            :value="item.value"
            :checked="Array.isArray(modelValue[item.key]) && modelValue[item.key].includes(item.value)"
            @input="update(item.key, item.value)"
          >
          <span class="truncate"> {{ item.value }} </span>
          <span
            class="ml-auto size-5 rounded-lg text-center"
          >{{ item.count }}</span>
        </label>
      </li>
    </transition-group>
  </div>
</template>
<script setup>
import {
  Popover, PopoverButton, PopoverPanel,
} from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { computed, defineModel } from 'vue';
import AppRadio from '@/components/app/AppRadio.vue';
import AppCheckbox from '@/components/app/AppCheckbox.vue';
import KeywordIcon from '@/components/icons/KeywordIcon.vue';
import LangIcon from '@/components/icons/LangIcon.vue';
import UrlIcon from '@/components/icons/UrlIcon.vue';
import FolderIcon from '@/components//icons/FolderIcon.vue';
import TagIcon from '@/components/icons/TagIcon.vue';
import TypeIcon from '@/components/icons/TypeIcon.vue';
import IncludeIcon from '@/components/icons/IncludeIcon.vue';
import SortIcon from '@/components/icons/SortIcon.vue';

const emit = defineEmits(['update:modelValue']);

const sort = defineModel('sort', { type: String, required: true });
const includes = defineModel('includes', { type: Array, required: true, default: [] });
const term = defineModel('term', { type: String, required: true });

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,

  },
  items: {
    type: Array,
    required: true,
  },
});

const iconMap = {
  keyword: KeywordIcon,
  locale: LangIcon,
  domain: UrlIcon,
  folder: FolderIcon,
  tag: TagIcon,
  type: TypeIcon,
};

const getIcon = (item) => iconMap[item.key];

const list = computed(() => props.items);

const update = (key, value) => {
  console.warn(key, value);
  const updatedModelValue = props.modelValue;
  updatedModelValue[key] = updatedModelValue[key] || [];
  // eslint-disable-next-line no-unused-expressions
  updatedModelValue[key].includes(value) ? updatedModelValue[key].splice(updatedModelValue[key].indexOf(value), 1) : updatedModelValue[key].push(value);
  emit('update:modelValue', updatedModelValue);
};

</script>
