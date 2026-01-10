<template>
  <TransitionRoot
    appear
    :show="isOpen"
    as="template"
  >
    <Dialog
      as="div"
      class="relative z-10"
      @close="close"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-transparent backdrop-blur" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="flex h-screen max-h-[32rem] w-full max-w-md overflow-hidden rounded-lg border bg-white/60 shadow-lg backdrop-blur-lg transition-all dark:border-neutral-800 dark:bg-black/40 dark:text-white focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <div
                class="flex w-full flex-col items-start justify-between h-full"
              >
                <div class="flex w-full flex-col flex-1 min-h-0">
                  <div class="flex w-full items-center px-4 py-3 text-gray-700">
                    <span class="mr-2 text-xl text-gray-800 dark:text-gray-200">
                      <PhMagnifyingGlassLight />
                    </span>
                    <input
                      ref="input"
                      v-model="searchTerm"
                      type="text"
                      aria-label="Search command palette"
                      class="flex-1 border-none bg-transparent text-sm outline-none ring-0 placeholder:text-gray-600 focus:border-0 focus:border-none focus:ring-0 dark:text-gray-100 dark:placeholder:text-gray-400"
                      placeholder="Search..."
                      autocomplete="off"
                      autocorrect="off"
                      spellcheck="false"
                      @blur="refocusInput"
                      @keydown.down.prevent="navigateDown"
                      @keydown.up.prevent="navigateUp"
                      @keydown.enter.prevent="selectActiveItem"
                      @keydown.backspace="handleBackspace"
                    >
                  </div>

                  <AppInfiniteScroll
                    class="list-view w-full flex-1 overflow-y-auto p-1"
                    :limit="100"
                    @scroll:end="paginate"
                  >
                    <div
                      v-if="isLoading"
                      class="flex min-h-full items-center justify-center p-4"
                    >
                      <AppSpinner class="size-6" />
                    </div>
                    <ul
                      v-else-if="items.length"
                      class="gap-y-2"
                      role="menu"
                    >
                      <li
                        v-for="(item, index) in items"
                        :key="index"
                        ref="item"
                        class="flex cursor-pointer items-center gap-x-2 rounded-md p-3 transition-colors duration-200 hover:bg-black/5 hover:dark:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-500"
                        :class="{
                          'bg-black/10 dark:bg-white/10': activeIndex === index
                        }"
                        role="menuitem"
                        tabindex="0"
                        @click="handleCommandSelect(item)"
                        @keydown.enter="handleCommandSelect(item)"
                        @keydown.arrow-up.prevent="navigateUp"
                        @keydown.arrow-down.prevent="navigateDown"
                        @focus="activeIndex = index"
                      >
                        <div
                          class="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-white to-gray-100 backdrop-blur-sm dark:from-black/80 dark:to-black/80"
                        >
                          <component
                            :is="item.icon"
                            class="size-4 text-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <span class="text-sm text-gray-800 dark:text-gray-100">{{ item.value }}</span>
                      </li>
                    </ul>
                    <div
                      v-else
                      class="flex min-h-full items-center justify-center p-4 text-sm font-thin text-gray-800 dark:text-gray-300"
                    >
                      🔍 No results found.
                    </div>
                  </AppInfiniteScroll>
                </div>
                <div
                  class="w-full border-t border-gray-200 bg-gray-50 px-4 py-3 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <kbd
                        class="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-700 shadow-sm dark:border-transparent dark:bg-black dark:text-gray-200"
                      >↑↓</kbd>
                      <span class="text-xs text-gray-600 dark:text-gray-300">navigate</span>
                    </div>
                    <div class="flex items-center gap-4">
                      <div class="flex items-center gap-2">
                        <kbd
                          class="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-700 shadow-sm dark:border-transparent dark:bg-black dark:text-gray-200"
                        >↵</kbd>
                        <span class="text-xs text-gray-600 dark:text-gray-300">select</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <kbd
                          class="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-700 shadow-sm dark:border-transparent dark:bg-black dark:text-gray-200"
                        >esc</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, useTemplateRef, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import {
  Dialog,
  TransitionRoot,
  TransitionChild,
  DialogPanel,
} from '@headlessui/vue';
import AttributeStorage from '@/storage/attribute';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';
import { useDebounceFn } from '@vueuse/core';

import PhMagnifyingGlassLight from '~icons/ph/magnifying-glass-light';
import PhHashStraightLight from '~icons/ph/hash-straight-light';
import PhGlobeSimpleLight from '~icons/ph/globe-simple-light';
import PhListMagnifyingGlassLight from '~icons/ph/list-magnifying-glass-light';

const attributeStorage = new AttributeStorage();
const emit = defineEmits(['onSelected', 'onVisibilityToggle']);

const isOpen = ref(false);
const searchTerm = ref('');
const activeIndex = ref(-1);
const command = ref(null);
const items = ref([]);
const itemRef = useTemplateRef('item');
const inputRef = useTemplateRef('input');
const isLoading = ref(false);

const commands = [
  { key: 'command', value: 'tag', icon: PhHashStraightLight },
  { key: 'command', value: 'domain', icon: PhGlobeSimpleLight },
  { key: 'command', value: 'keyword', icon: PhListMagnifyingGlassLight },
];

const iconMap = Object.fromEntries(commands.map((c) => [c.value, c.icon]));

const paginate = async (skip) => {
  try {
    const results = await attributeStorage.filterByKeyAndValue(command.value.value, searchTerm.value, skip, 100);
    const resultsWithIcons = results.map((item) => ({
      ...item,
      icon: iconMap[item.key],
    }));
    items.value.push(...resultsWithIcons);
  } catch (e) {
    console.error(e);
  }
};

const scrollToActive = (newIndex) => {
  activeIndex.value = newIndex;
  const el = itemRef.value[newIndex];
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

const navigateDown = () => {
  const nextIndex = activeIndex.value + 1;
  if (nextIndex < items.value.length) {
    scrollToActive(nextIndex);
  }
};

const navigateUp = () => {
  const prevIndex = activeIndex.value - 1;
  if (prevIndex >= 0) {
    scrollToActive(prevIndex);
  }
};

const performSearch = useDebounceFn(async () => {
  if (!command.value) {
    const term = searchTerm.value.trim().toLowerCase();
    items.value = term === '' ? commands : commands.filter((k) => k.value.toLowerCase().includes(term));
    activeIndex.value = 0;
  } else {
    isLoading.value = true;
    try {
      const results = await attributeStorage.filterByKeyAndValue(command.value.value, searchTerm.value, 0, 50);
      items.value = results.map((item) => ({
        ...item,
        icon: iconMap[item.key],
      }));
      activeIndex.value = 0;
    } catch (e) {
      console.error('Search error:', e);
      items.value = [];
    } finally {
      isLoading.value = false;
    }
  }
}, 200);

const close = () => {
  isOpen.value = false;
  searchTerm.value = '';
  command.value = null;
  activeIndex.value = -1;
  items.value = [];
  emit('onVisibilityToggle', false);
};

const handleCommandSelect = (selectedCommand) => {
  if (selectedCommand.key === 'command') {
    command.value = selectedCommand;
    searchTerm.value = '';
    performSearch();
  } else {
    emit('onSelected', [{ key: selectedCommand.key, value: selectedCommand.value }]);
    close();
  }
};

const selectActiveItem = () => {
  if (activeIndex.value >= 0 && activeIndex.value < items.value.length) {
    handleCommandSelect(items.value[activeIndex.value]);
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
};

const handleBackspace = (event) => {
  if (searchTerm.value === '' && command?.value?.key === 'command') {
    command.value = null;
    activeIndex.value = -1;
    searchTerm.value = '';
    performSearch();
    event.preventDefault();
  }
};

const toggle = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    items.value = commands;
    activeIndex.value = 0;
  }
  emit('onVisibilityToggle', isOpen.value);
};

const hotKey = (event) => {
  if (event.altKey && !event.ctrlKey && !event.metaKey && event.code === 'KeyK') {
    event.preventDefault();
    event.stopPropagation();
    toggle();
  }
};

const refocusInput = () => setTimeout(() => { inputRef.value?.focus(); }, 10);

watch(searchTerm, () => {
  if (isOpen.value) {
    performSearch();
  }
});

watch(isOpen, (open) => {
  if (open) {
    items.value = commands;
    activeIndex.value = 0;
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});

defineExpose({ toggle });

onMounted(() => { document.addEventListener('keydown', hotKey); });
onBeforeUnmount(() => { document.removeEventListener('keydown', hotKey); });
</script>
