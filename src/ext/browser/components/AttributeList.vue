<template>
  <div
    class="flex h-screen w-64 flex-col bg-white"
  >
    <div class="flex w-full space-x-1 px-1">
      <div class="relative w-full">
        <span class="absolute inset-y-0 left-0 flex items-center pl-2">
          <SearchIcon class="size-5 text-gray-400 dark:text-gray-200" />
        </span>
        <input
          v-model="term"
          autocomplete="off"
          type="text"
          class="w-full rounded-md border-gray-200 px-9 text-gray-700 shadow-sm outline-none placeholder:text-xs focus:border-gray-300 focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 focus:dark:border-neutral-600 sm:text-sm"
        >
        <Popover class="relative">
          <PopoverButton
            ref="popoverButtonRef"
            class="pointer-events-auto absolute inset-y-0 -top-9 right-0 flex items-center pr-2 focus:outline-none focus:ring-0"
          >
            <span class="flex flex-wrap items-center gap-x-1 text-sm text-gray-400 dark:text-neutral-600">
              <kbd class="inline-flex size-6 items-center justify-center rounded-md border border-gray-200 bg-white px-1.5 py-1 font-mono text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                <CmdIcon />
              </kbd>
              <kbd class="inline-flex size-6 items-center justify-center rounded-md border border-gray-200 bg-white px-1.5 py-1 font-mono text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                /
              </kbd>
            </span>
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
              class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 dark:bg-neutral-900 dark:text-neutral-400"
            >
              <div class="flex flex-col space-y-4 p-4">
                <div class="flex items-center space-x-2">
                  <SortIcon class="size-5 text-gray-800 dark:text-gray-200" />
                  <h3 class="text-sm text-gray-800 dark:text-gray-200">
                    Sort By
                  </h3>
                </div>

                <div class="flex flex-col space-y-2">
                  <app-radio
                    v-model="sort"
                    label="Name ↑ (A-Z)"
                    value="name:asc"
                    name="sort"
                    class="text-gray-800 dark:text-gray-200"
                  />
                  <app-radio
                    v-model="sort"
                    label="Name ↓ (Z-A)"
                    value="name:desc"
                    name="sort"
                    class="text-gray-800 dark:text-gray-200"
                  />
                  <app-radio
                    v-model="sort"
                    label="Count ↑ (0-9)"
                    value="count:asc"
                    name="sort"
                    class="text-gray-800 dark:text-gray-200"
                  />
                  <app-radio
                    v-model="sort"
                    label="Count ↓ (9-0)"
                    value="count:desc"
                    name="sort"
                    class="text-gray-800 dark:text-gray-200"
                  />
                </div>

                <div class="border-t border-gray-200 dark:border-gray-700" />

                <div class="flex items-center space-x-2">
                  <IncludeIcon class="size-5 text-gray-800 dark:text-gray-200" />
                  <h3 class="text-sm text-gray-800 dark:text-gray-200">
                    Includes
                  </h3>
                </div>

                <div class="flex flex-col space-y-2">
                  <SwitchGroup
                    v-for="(value, key) in includes"
                    :key="key"
                  >
                    <div class="flex items-center justify-between">
                      <SwitchLabel class="flex items-center space-x-1">
                        <AppBullet
                          :size="3"
                          :color="getColor(key)"
                        />
                        <span>{{ key.charAt(0).toUpperCase() + key.slice(1) }}</span>
                      </SwitchLabel>
                      <Switch
                        v-model="includes[key]"
                        :class="value ? 'bg-black' : 'bg-gray-200'"
                        class="relative inline-flex h-5 w-8 items-center rounded-full"
                      >
                        <span class="sr-only">{{ key }}</span>
                        <span
                          :class="value ? 'translate-x-4' : 'translate-x-1'"
                          class="inline-block size-3 rounded-full bg-white transition"
                        />
                      </Switch>
                    </div>
                  </SwitchGroup>
                </div>
              </div>

              <div>
                <button
                  class="block w-full rounded-b-lg border-t border-gray-200 bg-gray-50 p-2 text-center text-sm font-medium text-gray-600 shadow-sm transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  @click="close"
                >
                  Close
                </button>
              </div>
            </PopoverPanel>
          </Transition>
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
      >
        <label
          :key="item.id + key"
          :for="item.id + key"
          :class="{'bg-red-100': selected(item.key, item.value)}"
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
            :checked="selected(item.key, item.value)"
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
  Popover, PopoverButton, PopoverPanel, SwitchGroup, SwitchLabel,
  Switch,
} from '@headlessui/vue';
import {
  computed, defineModel, onMounted, ref, onBeforeUnmount,
} from 'vue';
import AppRadio from '@/components/app/AppRadio.vue';
import AppBullet from '@/components/app/AppBullet.vue';
import KeywordIcon from '@/components/icons/KeywordIcon.vue';
import LangIcon from '@/components/icons/LangIcon.vue';
import UrlIcon from '@/components/icons/UrlIcon.vue';
import FolderIcon from '@/components//icons/FolderIcon.vue';
import TagIcon from '@/components/icons/TagIcon.vue';
import TypeIcon from '@/components/icons/TypeIcon.vue';
import IncludeIcon from '@/components/icons/IncludeIcon.vue';
import SortIcon from '@/components/icons/SortIcon.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';
import CmdIcon from '@/components/icons/CmdIcon.vue';

const emit = defineEmits(['update:modelValue']);

const sort = defineModel('sort', { type: String, required: true });
const includes = defineModel('includes', { type: Object, required: true });
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

const popoverButtonRef = ref(null);

const getIcon = (item) => iconMap[item.key];

const selected = (key, value) => props.modelValue.some((item) => item.key === key && item.value === value);

const list = computed(() => props.items);

const getColor = (key) => {
  switch (key) {
    case 'domain':
      return 'yellow';
    case 'tag':
      return 'pink';
    case 'keyword':
      return 'green';
    case 'folder':
      return 'purple';
    case 'locale':
      return 'blue';
    case 'type':
      return 'indigo';
    default:
      return 'gray';
  }
};

const update = (key, value) => {
  const updatedModelValue = [...props.modelValue];
  const index = updatedModelValue.findIndex((item) => item.key === key && item.value === value);
  if (index !== -1) {
    updatedModelValue.splice(index, 1);
  } else {
    updatedModelValue.push({ key, value });
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

</script>
