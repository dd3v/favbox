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
        <div class="fixed bg-transparent backdrop-blur-lg" />
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
              class="flex min-h-96 w-full max-w-md overflow-hidden rounded-lg border bg-white/40 shadow-lg backdrop-blur-lg transition-all dark:border-neutral-800 dark:bg-black/40 dark:text-white"
            >
              <div
                class="flex w-full flex-col items-start justify-center"
                @keydown.down.prevent="navigateDown"
                @keydown.up.prevent="navigateUp"
                @keydown.enter.prevent="selectActiveItem"
                @keydown.backspace="handleBackspace"
              >
                <div class="flex w-full items-center px-4 py-3 text-gray-700 ">
                  <span class="mr-2 text-xl dark:text-white">
                    <PhMagnifyingGlassLight />
                  </span>
                  <input
                    ref="input"
                    v-model="searchTerm"
                    type="text"
                    class="flex-1 border-none bg-transparent text-sm outline-none ring-0 placeholder:text-gray-700 focus:border-0 focus:border-none focus:ring-0 dark:text-white dark:placeholder:text-white"
                    placeholder="Search..."
                    autocomplete="off"
                    autocorrect="off"
                    spellcheck="false"
                    @blur="refocusInput"
                  >
                  <span
                    v-if="command?.key"
                    class="ml-3 p-1 text-xs text-gray-700 dark:text-white"
                  >
                    {{ command.value }}
                  </span>
                </div>

                <AppInfiniteScroll
                  class="list-view max-h-96 w-full flex-1 overflow-y-auto p-1"
                  :limit="100"
                  @scroll:end="paginate"
                >
                  <ul
                    v-if="items.length"
                    class="space-y-2"
                  >
                    <li
                      v-for="(item, index) in items"
                      :key="index"
                      ref="item"
                      class="flex cursor-pointer items-center gap-x-2 rounded-md p-3 transition-colors duration-200 hover:bg-black/10 hover:dark:bg-white/10"
                      :class="{
                        'bg-black/10 dark:bg-white/10': activeIndex === index
                      }"
                      @click="selectItem(item)"
                    >
                      <component
                        :is="item.icon"
                        class="size-5 text-gray-700 dark:text-gray-300"
                      />
                      <span class="text-sm text-gray-700 dark:text-white">{{ item.value }}</span>
                    </li>
                  </ul>
                  <div
                    v-else
                    class="flex min-h-full items-center justify-center p-4 text-sm font-thin text-gray-400 dark:text-gray-500"
                  >
                    No results found.
                  </div>
                </AppInfiniteScroll>
                <div class="w-full border-t border-black/10 bg-black/5 px-4 py-3 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <kbd class="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-700 shadow-sm dark:border-gray-900 dark:bg-black dark:text-gray-300">↑↓</kbd>
                      <span class="text-xs text-gray-500 dark:text-gray-400">navigate</span>
                    </div>
                    <div class="flex items-center gap-4">
                      <div class="flex items-center gap-2">
                        <kbd class="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-700 shadow-sm dark:border-gray-900 dark:bg-black dark:text-gray-300">↵</kbd>
                        <span class="text-xs text-gray-500 dark:text-gray-400">select</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <kbd class="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-700 shadow-sm dark:border-gray-900 dark:bg-black dark:text-gray-300">esc</kbd>
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
import { ref, useTemplateRef, watch, onMounted, onBeforeUnmount } from 'vue';
import AttributeStorage from '@/storage/attribute';
import {
  Dialog,
  TransitionRoot,
  TransitionChild,
  DialogPanel,
} from '@headlessui/vue';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';

import PhMagnifyingGlassLight from '~icons/ph/magnifying-glass-light';
import PhHashStraightLight from '~icons/ph/hash-straight-light';
import PhGlobeSimpleLight from '~icons/ph/globe-simple-light';
import PhListMagnifyingGlassLight from '~icons/ph/list-magnifying-glass-light';
import PhFolderSimpleLight from '~icons/ph/folder-simple-light';

const attributeStorage = new AttributeStorage();
const emit = defineEmits(['onSelected', 'onVisibilityToggle']);

const isOpen = ref(false);
const searchTerm = ref('');
const activeIndex = ref(-1);
const command = ref(null);
const items = ref([]);
const itemRef = useTemplateRef('item');
const inputRef = useTemplateRef('input');

const commands = [
  { key: 'command', value: 'tag', icon: PhHashStraightLight },
  { key: 'command', value: 'folder', icon: PhFolderSimpleLight },
  { key: 'command', value: 'domain', icon: PhGlobeSimpleLight },
  { key: 'command', value: 'keyword', icon: PhListMagnifyingGlassLight },
];

const paginate = async (skip) => {
  try {
    items.value.push(
      ...(await attributeStorage.filterByKeyAndValue(command.value.value, searchTerm.value, skip, 100)),
    );
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

const selectItem = (item) => {
  command.value = item;
  searchTerm.value = '';
  activeIndex.value = -1;
};

const selectActiveItem = () => {
  if (activeIndex.value >= 0 && activeIndex.value < items.value.length) {
    selectItem(items.value[activeIndex.value]);
  }
};

const handleBackspace = (event) => {
  if (searchTerm.value === '' && command?.value?.key === 'command') {
    command.value = null;
    activeIndex.value = -1;
    searchTerm.value = '';
    event.preventDefault();
  } else {
    return true;
  }
};

watch(searchTerm, () => { activeIndex.value = 0; });

const close = () => {
  isOpen.value = false;
  searchTerm.value = '';
  command.value = null;
  activeIndex.value = -1;
  emit('onVisibilityToggle', false);
};

const toggle = () => {
  isOpen.value = !isOpen.value;
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

const arraySearch = () => {
  const term = searchTerm.value.trim().toLowerCase();
  items.value = term === '' ? commands : commands.filter((k) => k.value.toLowerCase().includes(term));
};

const dbSearch = async () => {
  try {
    items.value = await attributeStorage.filterByKeyAndValue(command.value.value, searchTerm.value, 0, 50);
  } catch (e) {
    console.error(e);
  }
};

const search = async () => {
  !command.value ? arraySearch() : await dbSearch();
};

// FIXME
watch(searchTerm, () => search());
watch(
  command,
  () => {
    if (!command.value || command.value.key === 'command') {
      search();
    } else {
      emit('onSelected', [{ key: command.value.key, value: command.value.value }]);
      close();
    }
  },
  { immediate: true },
);

defineExpose({ toggle });

onMounted(() => { document.addEventListener('keydown', hotKey); });
onBeforeUnmount(() => { document.removeEventListener('keydown', hotKey); });
</script>
