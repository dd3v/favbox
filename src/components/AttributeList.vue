<template>
  <div
    class="flex h-screen flex-col border-r border-neutral-100 bg-[#FBFBFB] dark:border-neutral-800 dark:bg-neutral-900"
  >
    <div class="relative flex">
      <div class="relative flex w-full">
        <input
          v-model="term"
          type="text"
          class="w-full rounded-md rounded-r-none border border-r-0 border-gray-200 text-gray-700 shadow-sm outline-none focus:border-gray-300 focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 focus:dark:border-neutral-600 sm:text-sm"
          placeholder=""
          required
        >

        <Popover
          v-slot="{ open }"
          class="relative"
        >
          <PopoverButton
            :class="open ? 'text-white' : 'text-white/90'"
            class="z-10 inline-flex shrink-0 items-center rounded-md rounded-l-none border border-gray-200 p-2 text-gray-700 shadow-sm outline-none focus:border-gray-300 focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 focus:dark:border-neutral-600 sm:text-sm"
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
              class="absolute right-0 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:divide-neutral-700 dark:bg-neutral-900 dark:ring-neutral-600"
            >
              <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-neutral-600">
                <div class="bg-white px-2 py-4 dark:bg-neutral-900">
                  <div class="flex flex-col space-y-2">
                    <app-radio
                      v-model="sort"
                      label="Sort asc"
                      value="asc"
                    />
                    <app-radio
                      v-model="sort"
                      label="Sort desc"
                      value="desc"
                    />
                  </div>

                  <div class="mt-4 space-y-2">
                    <app-checkbox
                      v-model="includes"
                      label="Folders"
                      value="folder"
                    />
                    <app-checkbox
                      v-model="includes"
                      label="Tags"
                      value="tag"
                    />
                    <app-checkbox
                      v-model="includes"
                      label="Domains"
                      value="domain"
                    />
                    <app-checkbox
                      v-model="includes"
                      label="Locales"
                      value="locale"
                    />
                    <app-checkbox
                      v-model="includes"
                      label="Keywords"
                      value="keyword"
                    />
                  </div>
                </div>
                <div>
                  <a
                    href="##"
                    class="block w-full rounded-b-md border-t border-gray-200 bg-gray-50 p-3 text-center text-sm font-medium text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 hover:shadow-md focus:outline-none focus-visible:ring focus-visible:ring-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-white dark:focus-visible:ring-neutral-600"
                  >
                    Close
                  </a>
                </div>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
      </div>
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
import AppRadio from './app/AppRadio.vue';
import AppCheckbox from './app/AppCheckbox.vue';
import KeywordIcon from './icons/KeywordIcon.vue';
import LangIcon from './icons/LangIcon.vue';
import UrlIcon from './icons/UrlIcon.vue';
import FolderIcon from './icons/FolderIcon.vue';
import TagIcon from './icons/TagIcon.vue';
import TypeIcon from './icons/TypeIcon.vue';

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
  const updatedModelValue = props.modelValue;
  updatedModelValue[key] = updatedModelValue[key] || [];
  // eslint-disable-next-line no-unused-expressions
  updatedModelValue[key].includes(value) ? updatedModelValue[key].splice(updatedModelValue[key].indexOf(value), 1) : updatedModelValue[key].push(value);
  emit('update:modelValue', updatedModelValue);
};

</script>
