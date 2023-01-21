<template>
  <Popover v-slot="{ open }" class="relative">
    <PopoverButton
      :class="open ? '' : 'text-opacity-90'"
      class="inline-flex items-stretch rounded-md border bg-white p-2 hover:bg-gray-50 hover:text-gray-700 disabled:bg-gray-100 shadow-sm"
      :disabled="!options.length"
    >
      <adjustments-horizontal-icon class="h-5 w-5 text-gray-600" />
      <div
        v-if="options.length"
        class="border-1 absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full border-white bg-red-700 text-xs text-white dark:border-gray-900"
      >
        {{ options.length }}
      </div>
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
        v-slot="{ close }"
        class="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-1">
            <div
              class="relative flex flex-row rounded-md bg-white p-2 hover:bg-gray-50 hover:text-gray-700"
              v-for="(option, key) in options"
              :key="key"
            >
              <div class="flex w-40 flex-row items-center justify-center">
                <span
                  ><component :is="getIcon(option)" class="mr-2 h-4 w-4" aria-hidden="true"
                /></span>
                <span class="cursor-default truncate text-gray-900">{{ option.name }}</span>
                <button class="ml-auto" @click="remove(option, close)">
                  <trash-icon class="h-4 w-4 text-red-700" />
                </button>
              </div>
            </div>
          </div>
          <div class="bg-gray-50">
            <button
              class="font-sm flex w-full items-center justify-center rounded-lg p-2 text-sm uppercase text-gray-900"
              @click="
                $emit('delete:all');
                close();
              "
            >
              Clear all
            </button>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
<script setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import {
  TrashIcon,
  AdjustmentsHorizontalIcon,
  FolderOpenIcon,
  HashtagIcon,
  GlobeAltIcon,
  StopIcon,
} from '@heroicons/vue/24/outline';

const emit = defineEmits(['delete:option', 'delete:all']);

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
});

const remove = (option, close) => {
  emit('delete:option', option);
  console.warn(props.options.length);
  if (props.options.length === 1) {
    close();
  }
};

const getIcon = (option) => {
  switch (option.type) {
    case 'folders':
      return FolderOpenIcon;
    case 'tags':
      return HashtagIcon;
    case 'domains':
      return GlobeAltIcon;
    default:
      return StopIcon;
  }
};
</script>
