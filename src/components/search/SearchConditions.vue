<template>
  <Popover
    v-slot="{ open }"
    class="relative"
  >
    <PopoverButton
      :class="open ? '' : 'text-opacity-90'"
      class="inline-flex items-stretch rounded-md border bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50 disabled:bg-gray-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:disabled:bg-neutral-800"
      :disabled="!options.length"
    >
      <adjustments-horizontal-icon
        class="h-5 w-5 text-gray-700 dark:text-neutral-400"
      />
      <div
        v-if="options.length"
        class="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full border-white bg-rose-400 text-xs text-white dark:border-gray-900"
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
        class="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-neutral-900"
      >
        <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
          <div class="p-1">
            <div
              v-for="(option, key) in options"
              :key="key"
              class="relative my-1 flex flex-row rounded-md p-2 text-gray-700 hover:bg-gray-50 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <div class="flex w-40 flex-row items-center justify-center">
                <span><component
                  :is="getIcon(option)"
                  class="mr-2 h-4 w-4"
                  aria-hidden="true"
                /></span>
                <span class="cursor-default truncate">{{ option.name }}</span>
                <button
                  class="ml-auto"
                  @click="remove(option, close)"
                >
                  <x-mark-icon class="h-4 w-4 text-rose-400" />
                </button>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-neutral-800">
            <button
              class="flex w-full items-center justify-center rounded-lg p-2 text-sm uppercase text-gray-900 dark:text-white"
              @click="
                $emit('removeAll');
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
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  FolderOpenIcon,
  HashtagIcon,
  GlobeAltIcon,
  StopIcon,
} from '@heroicons/vue/24/outline';
import { computed } from 'vue';

const emit = defineEmits(['remove', 'removeAll']);
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const options = computed({
  get: () => Object.entries({
    tags: props.modelValue.tags,
    domains: props.modelValue.domains,
    folders: props.modelValue.folders,
  })
    .flatMap(([type, arr]) => arr.map((name) => ({ name, type })))
    .sort((a, b) => a.name.localeCompare(b.name)),
});
const remove = (option, close) => {
  emit('remove', option);
  if (options.value.length === 0) {
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
