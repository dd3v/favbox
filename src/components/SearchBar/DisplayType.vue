<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="inline-flex items-stretch rounded-md border bg-white p-2 hover:bg-gray-50 hover:text-gray-700 shadow-sm"
      >
        <component :is="icon" class="h-5 w-5 text-gray-600" aria-hidden="true" />
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="p-1">
          <MenuItem v-slot="{ active }">
            <button
              @click="view = 'card'"
              :class="[
                active ? 'bg-neutral-50 text-grey' : 'text-gray-900',
                'group flex w-full items-center rounded-md px-2 py-2',
              ]"
            >
              <squares-2X2-icon :active="active" class="mr-2 h-4 w-4" aria-hidden="true" />
              Card view
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              @click="view = 'list'"
              :class="[
                active ? 'bg-neutral-50 text-grey' : 'text-gray-900',
                'group flex w-full items-center rounded-md px-2 py-2',
              ]"
            >
              <list-bullet-icon :active="active" class="mr-2 h-4 w-4" aria-hidden="true" />
              List view
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
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/vue/24/outline';

import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    requred: true,
  },
});
const emit = defineEmits(['update:modelValue']);
const view = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
const icon = computed({
  get: () => (view.value === 'card' ? Squares2X2Icon : ListBulletIcon),
});
</script>
