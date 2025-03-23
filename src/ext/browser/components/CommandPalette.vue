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
        <div class="fixed bg-transparent" />
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
              class="flex min-h-96 w-full max-w-md overflow-hidden  rounded-lg border bg-white/60 align-middle text-xs text-black shadow-2xl backdrop-blur-lg transition-all placeholder:text-xs dark:border-black dark:bg-black/20 dark:text-white"
            >
              <div
                class="flex w-full flex-col items-start justify-center"
                @keydown.down.prevent="navigateDown"
                @keydown.up.prevent="navigateUp"
                @keydown.enter.prevent="selectActiveItem"
                @keydown.backspace="handleBackspace"
              >
                <div class="flex w-full items-center px-3 dark:border-neutral-900">
                  <span class="mr-0 size-4 shrink-0 text-black dark:text-white">
                    <PhMagnifyingGlassLight />
                  </span>
                  <input
                    ref="commandInput"
                    v-model="searchTerm"
                    type="text"
                    class="flex h-12 w-full rounded-md border-0 bg-transparent px-2 py-3 text-xs outline-none placeholder:text-xs placeholder:text-black focus:border-0 focus:outline-none focus:ring-0 dark:placeholder:text-white"
                    placeholder="Search..."
                    autocomplete="off"
                    autocorrect="off"
                    spellcheck="false"
                  >
                  <span
                    v-if="selectedCommand?.key"
                    class="mr-0 shrink-0 rounded-md bg-gray-200 p-1 text-xs dark:bg-black dark:text-white"
                  >
                    {{ selectedCommand.value }}
                  </span>
                </div>

                <AppInfiniteScroll
                  ref="scrollRef"
                  class="max-h-96 min-h-96 w-full flex-1 overflow-y-auto p-1"
                  :limit="50"
                  @scroll:end="paginate"
                >
                  <ul
                    v-if="filteredItems.length"
                    class="space-y-2"
                  >
                    <li
                      v-for="(item, index) in filteredItems"
                      :key="index"
                      ref="suggestionRef"
                      class="flex cursor-pointer items-center gap-x-1 rounded-md p-2 text-black dark:text-white"
                      :class="{
                        'bg-gray-500/10 ring-0 dark:bg-black/10': activeIndex === index
                      }"
                      @click="selectItem(item)"
                      @mouseenter="activeIndex = index"
                    >
                      <component
                        :is="item.icon"
                        class="size-5"
                      />
                      {{ item.value }}
                    </li>
                  </ul>
                  <div
                    v-else
                    class="flex min-h-full items-center justify-center p-4 text-xs font-thin text-black dark:text-white"
                  >
                    No results found.
                  </div>
                </AppInfiniteScroll>

                <div
                  class="flex w-full border-t bg-white/10 p-2 text-gray-600 dark:border-black dark:bg-neutral-900/20"
                >
                  <span
                    class="mx-0.5 size-6 rounded-md bg-gray-200 p-1 text-xs text-black dark:bg-black dark:text-white"
                  >
                    ↑
                  </span>
                  <span
                    class="mx-0.5 size-6 rounded-md bg-gray-200 p-1 text-xs text-black dark:bg-black dark:text-white"
                  >
                    ↓
                  </span>
                  <span
                    class="mx-0.5 size-6 rounded-md bg-gray-200 p-1 text-xs text-black dark:bg-black dark:text-white"
                  >
                    ↵
                  </span>
                  <span
                    class="mx-0.5 size-6 rounded-md bg-gray-200 p-1 text-xs text-black dark:bg-black dark:text-white"
                  >
                    ←
                  </span>
                  <span
                    class="mx-0.5 ml-auto  rounded-md bg-gray-200 p-1 text-xs text-black dark:bg-black dark:text-white"
                  >
                    esc
                  </span>
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
import { ref, watch, onMounted, onUnmounted } from 'vue';
import BookmarkStorage from '@/storage/bookmark';
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

const emit = defineEmits(['onSelected', 'onVisibilityToggle']);

const isOpen = ref(false);
const searchTerm = ref('');
const activeIndex = ref(-1);
const selectedCommand = ref(null);
const scrollRef = ref(null);
const filteredItems = ref([]);
const suggestionRef = ref(null);

const commands = [
  { key: 'command', value: 'tag', icon: PhHashStraightLight },
  { key: 'command', value: 'folder', icon: PhFolderSimpleLight },
  { key: 'command', value: 'domain', icon: PhGlobeSimpleLight },
  { key: 'command', value: 'keyword', icon: PhListMagnifyingGlassLight },
];

const bookmarkStorage = new BookmarkStorage();

const paginate = async (skip) => {
  try {
    console.warn('loading..', selectedCommand.value.value, searchTerm.value, skip, 50);
    filteredItems.value.push(
      ...(await bookmarkStorage.searchAttributes(selectedCommand.value.value, searchTerm.value, skip, 50)),
    );
  } catch (e) {
    console.error(e);
  }
};

const updateFilteredItems = async () => {
  if (selectedCommand.value) {
    try {
      console.warn('loading..', selectedCommand.value.key, searchTerm.value, 0, 50);
      filteredItems.value = await bookmarkStorage.searchAttributes(selectedCommand.value.value, searchTerm.value, 0, 50);
    } catch (e) {
      console.error(e);
    }
  } else {
    filteredItems.value = searchTerm.value.trim() === '' ? commands : commands.filter((command) => command.value.toLowerCase().includes(searchTerm.value.toLowerCase()));
  }
};

const scrollIntoView = () => {
  const currentElement = suggestionRef.value[activeIndex.value];
  if (currentElement) {
    currentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

const navigateDown = () => {
  if (activeIndex.value < filteredItems.value.length - 1) {
    activeIndex.value++;
    scrollIntoView();
  }
};

const navigateUp = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--;
    scrollIntoView();
  }
};

const selectItem = (item) => {
  if (item.type === 'command') {
    console.log('Selected command:', item);
    searchTerm.value = '';
    selectedCommand.value = null;
  } else {
    console.log('Selected subcomand:', item);
    selectedCommand.value = item;
    searchTerm.value = '';
    activeIndex.value = -1;
  }
};

const selectActiveItem = () => {
  if (activeIndex.value >= 0 && activeIndex.value < filteredItems.value.length) {
    selectItem(filteredItems.value[activeIndex.value]);
  }
};

const handleBackspace = (event) => {
  if (searchTerm.value === '') {
    if (selectedCommand.value) {
      selectedCommand.value = null;
      activeIndex.value = -1;
      searchTerm.value = '';
      event.preventDefault();
    }
  } else {
    return true;
  }
};

watch(searchTerm, () => { activeIndex.value = 0; });

const close = () => {
  isOpen.value = false;
  searchTerm.value = '';
  selectedCommand.value = null;
  emit('onVisibilityToggle', false);
};

const toggle = () => {
  isOpen.value = !isOpen.value;
  emit('onVisibilityToggle', isOpen.value);
};

const hotKey = (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault();
    toggle();
  }
};

watch([selectedCommand, searchTerm], () => {
  console.warn(selectedCommand);
  if (selectedCommand.value && selectedCommand.value.key !== 'command') {
    const updatedValue = [];
    updatedValue.push({ key: selectedCommand.value.key, value: selectedCommand.value.value });
    emit('onSelected', updatedValue);
    selectedCommand.value = null;
    close();
  } else {
    updateFilteredItems();
  }
}, { immediate: true });

defineExpose({ toggle });

onMounted(() => { document.addEventListener('keydown', hotKey); });
onUnmounted(() => { document.removeEventListener('keydown', hotKey); });
</script>
