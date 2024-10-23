<template>
  <Menu
    as="div"
    class="relative inline-block text-left"
  >
    <div>
      <MenuButton
        class="inline-flex items-stretch rounded-md border bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
      >
        <component
          :is="icon"
          class="size-5 text-gray-700 dark:text-neutral-400"
          aria-hidden="true"
        />
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <MenuItems
        class="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-400"
      >
        <div class="p-1">
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                active
                  ? 'bg-neutral-50 text-gray-700 dark:bg-neutral-800  dark:text-neutral-400'
                  : 'text-gray-700 dark:text-neutral-400',
                'group flex w-full items-center rounded-md p-2',
              ]"
              @click="view = 'masonry'"
            >
              <MasonryIcon
                :active="active"
                class="mr-2 size-4"
                aria-hidden="true"
              />
              Masonry
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                active
                  ? 'bg-neutral-50 text-gray-700 dark:bg-neutral-800 dark:text-neutral-400'
                  : 'text-gray-700 dark:text-neutral-400',
                'group flex w-full items-center rounded-md p-2',
              ]"
              @click="view = 'card'"
            >
              <GridIcon
                :active="active"
                class="mr-2 size-4"
                aria-hidden="true"
              />
              Cards
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                active
                  ? 'bg-neutral-50 text-gray-700 dark:bg-neutral-800 dark:text-neutral-400'
                  : 'text-gray-700 dark:text-neutral-400',
                'group flex w-full items-center rounded-md p-2',
              ]"
              @click="view = 'list'"
            >
              <ListIcon
                :active="active"
                class="mr-2 size-4"
                aria-hidden="true"
              />
              List
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
<script setup>
import {
  Menu, MenuButton, MenuItems, MenuItem,
} from '@headlessui/vue';

import MasonryIcon from '@/components/icons/MasonryIcon.vue';
import GridIcon from '@/components/icons/GridIcon.vue';
import ListIcon from '@/components/icons/ListIcon.vue';

import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    requred: true,
    default: 'masonry',
  },
});
const emit = defineEmits(['update:modelValue']);
const view = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
const icon = computed({
  get: () => {
    switch (view.value) {
      case 'card':
        return GridIcon;
      case 'list':
        return ListIcon;
      case 'masonry':
        return MasonryIcon;
      default:
        return MasonryIcon;
    }
  },
});
</script>
