<template>
  <div class="flex h-full flex-col">
    <div class="flex w-full">
      <div class="relative w-full">
        <div class="absolute top-2 flex items-center pl-2">
          <MaterialSymbolsLightCategorySearchOutline class="size-5 text-gray-400 dark:text-white" />
        </div>
        <input
          v-model="term"
          autocomplete="off"
          type="text"
          aria-label="Search attributes"
          class="mb-2 h-9 w-full rounded-md border-1 border-gray-300/50 px-9 text-xs text-black shadow-sm outline-none placeholder:text-xs focus:border-gray-400/30 focus:ring-0 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white focus:dark:border-neutral-700"
        >
        <Popover class="relative">
          <PopoverButton
            ref="popoverButtonRef"
            class="pointer-events-auto absolute inset-y-1 -top-12 right-0 flex items-center pr-2 focus:outline-none focus:ring-0"
          >
            <div class="flex flex-wrap items-center gap-x-1 text-sm text-gray-400 dark:text-neutral-600">
              <kbd class="inline-flex size-6 items-center justify-center rounded-md border border-gray-200 bg-white font-mono text-lg shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                ⌘
              </kbd>
              <kbd class="inline-flex size-6 items-center justify-center rounded-md border border-gray-200 bg-white font-mono text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                /
              </kbd>
            </div>
          </PopoverButton>
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-1 opacity-0"
          >
            <PopoverPanel
              class="absolute right-1 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-400"
            >
              <div class="relative">
                <div class="flex flex-col gap-y-3 p-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-x-2">
                      <PhArrowsDownUp class="size-5 text-gray-800 dark:text-gray-200" />
                      <h3 class="text-xs text-gray-800 dark:text-gray-200">
                        Sort By
                      </h3>
                    </div>
                    <button
                      class="flex size-6 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 -mt-1 -mr-1"
                      @click="close"
                    >
                      <PhX class="size-4" />
                    </button>
                  </div>

                  <div class="flex flex-col gap-y-3">
                    <AppRadio
                      v-model="sort"
                      label="Name ↑ (A-Z)"
                      value="value:asc"
                      name="sort"
                    />
                    <AppRadio
                      v-model="sort"
                      label="Name ↓ (Z-A)"
                      value="value:desc"
                      name="sort"
                    />
                    <AppRadio
                      v-model="sort"
                      label="Count ↑ (0-9)"
                      value="count:asc"
                      name="sort"
                    />
                    <AppRadio
                      v-model="sort"
                      label="Count ↓ (9-0)"
                      value="count:desc"
                      name="sort"
                    />
                  </div>

                  <div class="border-t border-gray-200 dark:border-gray-700" />

                  <div class="flex items-center gap-x-2">
                    <PhListChecks class="size-5 text-gray-800 dark:text-white" />
                    <h3 class="text-xs text-black dark:text-white">
                      Includes
                    </h3>
                  </div>

                  <div class="flex flex-col gap-y-3">
                    <SwitchGroup
                      v-for="(value, key) in includes"
                      :key="key"
                    >
                      <div class="flex items-center justify-between">
                        <SwitchLabel class="flex items-center gap-x-1">
                          <AppBullet
                            :size="3"
                            :color="getColor(key)"
                          />
                          <span class="text-xs text-black dark:text-white">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</span>
                        </SwitchLabel>
                        <Switch
                          v-model="includes[key]"
                          :class="value ? 'bg-black dark:bg-neutral-500' : 'bg-neutral-200 dark:bg-neutral-700'"
                          class="relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-150"
                        >
                          <span class="sr-only">{{ key }}</span>
                          <span
                            :class="value ? 'translate-x-3.5' : 'translate-x-0.5'"
                            class="inline-block size-3 rounded-full bg-white transition-transform duration-150"
                          />
                        </Switch>
                      </div>
                    </SwitchGroup>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </Transition>
        </Popover>
      </div>
    </div>
    <AppInfiniteScroll
      ref="scrollRef"
      :limit="200"
      class="list-view flex h-full scroll-p-0.5 flex-col overflow-y-auto overflow-x-hidden py-1 text-xs"
      @scroll:end="paginate"
    >
      <ul
        role="listbox"
        aria-label="Filter options"
        class="w-full"
      >
        <li
          v-for="(item, key) in list"
          :key="item.id + key"
          role="option"
          :aria-selected="selected(item.key, item.value)"
          class="w-full"
        >
          <label
            :key="item.id + key"
            :for="item.id + key"
            :class="{'bg-neutral-100 dark:bg-neutral-900': selected(item.key, item.value)}"
            class="my-1 flex cursor-pointer place-items-end items-center px-3 py-2 text-gray-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900 focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600 focus-visible:ring-offset-0 rounded-md"
            tabindex="0"
            role="button"
            @keydown.enter="update(item)"
            @keydown.space.prevent="update(item)"
          >
            <component
              :is="getIcon(item)"
              v-tooltip.top="{ content: getTooltip(item) }"
              class="size-4 select-none focus:outline-none"
              tabindex="-1"
            />
            <input
              :id="item.id + key"
              type="checkbox"
              class="hidden"
              name="item"
              :value="item.value"
              :checked="selected(item.key, item.value)"
              @input="update(item)"
            >
            <span class="truncate px-1"> {{ item.label || item.value }} </span>
            <span
              class="ml-auto"
            >{{ item.count }}</span>
          </label>
        </li>
      </ul>
    </AppInfiniteScroll>
  </div>
</template>
<script setup>
import {
  Popover, PopoverButton, PopoverPanel, SwitchGroup, SwitchLabel,
  Switch,
} from '@headlessui/vue';
import {
  computed, defineModel, onMounted, ref, onBeforeUnmount, watch,
} from 'vue';
import AppRadio from '@/components/app/AppRadio.vue';
import AppBullet from '@/components/app/AppBullet.vue';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import PhListChecks from '~icons/ph/list-checks';
import PhArrowsDownUp from '~icons/ph/arrows-down-up';
import MaterialSymbolsLightCategorySearchOutline from '~icons/material-symbols-light/category-search-outline';
import PhHashStraightLight from '~icons/ph/hash-straight-light';
import PhGlobeSimpleLight from '~icons/ph/globe-simple-light';
import PhListMagnifyingGlassLight from '~icons/ph/list-magnifying-glass-light';
import PhX from '~icons/ph/x';

const emit = defineEmits(['update:modelValue', 'paginate']);

const sort = defineModel('sort', { type: String, required: true });
const includes = defineModel('includes', { type: Object, required: true });
const term = defineModel('term', { type: String, required: true });

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
});

const iconMap = {
  keyword: PhListMagnifyingGlassLight,
  domain: PhGlobeSimpleLight,
  tag: PhHashStraightLight,
};

const tooltipMap = {
  keyword: 'Filter by keywords',
  domain: 'Filter by website',
  tag: 'Filter by tag',
};

const popoverButtonRef = ref(null);
const scrollRef = ref(null);

const getIcon = (item) => iconMap[item.key];

const getTooltip = (item) => tooltipMap[item.key];

const selected = (key, value) => props.modelValue.some((item) => item.key === key && item.value === value);

const list = computed(() => props.items);

const paginate = (skip) => {
  emit('paginate', skip);
};

const getColor = (key) => {
  switch (key) {
    case 'domain':
      return 'yellow';
    case 'tag':
      return 'gray';
    case 'keyword':
      return 'green';
    case 'locale':
      return 'cyan';
    case 'type':
      return 'indigo';
    default:
      return 'stone';
  }
};

const update = (item) => {
  const updatedModelValue = [...props.modelValue];
  const index = updatedModelValue.findIndex((f) => f.key === item.key && f.value === item.value);
  if (index !== -1) {
    updatedModelValue.splice(index, 1);
  } else {
    updatedModelValue.push({ key: item.key, value: item.value, label: item.label || item.value });
  }
  emit('update:modelValue', updatedModelValue);
};

const close = () => {
  popoverButtonRef.value.el.click();
};

const popoverKbd = (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === '/') {
    event.preventDefault();
    close();
  }
};

onMounted(() => {
  document.addEventListener('keydown', popoverKbd);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', popoverKbd);
});

watch([sort, includes, term], () => {
  scrollRef.value.scrollUp();
});
</script>
