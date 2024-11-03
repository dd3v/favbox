<template>
  <Menu
    as="div"
    class="relative inline-block text-left"
  >
    <MenuButton
      class="inline-flex size-9 items-center justify-center rounded-md border bg-white text-gray-700 shadow-sm hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
    >
      <component
        :is="icon"
        class="m-auto size-5 text-gray-700 dark:text-neutral-400"
        aria-hidden="true"
      />
    </MenuButton>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <MenuItems
        class="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-400"
      >
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
            <CircumGrid42
              :active="active"
              class="mr-2 size-5"
              aria-hidden="true"
            />
            Gallery
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
            <CircumGrid41
              :active="active"
              class="mr-2 size-5"
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
            <CircumGrid2H
              :active="active"
              class="mr-2 size-5"
              aria-hidden="true"
            />
            List
          </button>
        </MenuItem>
      </MenuItems>
    </Transition>
  </Menu>
</template>
<script setup>
import {
  Menu, MenuButton, MenuItems, MenuItem,
} from '@headlessui/vue';

import { computed } from 'vue';

import CircumGrid42 from '~icons/circum/grid-4-2';
import CircumGrid41 from '~icons/circum/grid-4-1';
import CircumGrid2H from '~icons/circum/grid-2-h';

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
        return CircumGrid41;
      case 'list':
        return CircumGrid2H;
      case 'masonry':
        return CircumGrid42;
      default:
        return CircumGrid42;
    }
  },
});
</script>
