<!-- eslint-disable max-len -->
<template>
  <div
    class="sticky top-0 flex h-full min-h-screen w-12 flex-col items-center justify-center border-neutral-800 bg-[#EEEEEF]  align-middle shadow-inner dark:border-r dark:bg-neutral-900"
    role="tablist"
    aria-label="tabs"
  >
    <div class="absolute top-0 m-1">
      <img src="@/assets/icons/icon128.png" class="mt-2 h-6 w-6" alt="logo"
      />
    </div>
    <div
      class="absolute my-auto h-10 w-10 rounded-md bg-white shadow transition-[top] duration-[0.4s] dark:bg-neutral-800"
      ref="indicatorRef"
    ></div>
    <button
      v-for="(item, key) in items"
      :key="key"
      class="relative m-3 rounded-full p-2"
      :id="item.value"
      @click="handleTab"
      :ref="setTabRef"
    >
      <component :is="item.icon" class="pointer-events-none h-6 w-6 text-[#6A686F] dark:text-neutral-300" />
    </button>
    <div class="absolute bottom-2 flex flex-col space-y-2">
      <button
          @click="openGitHub"
          class="rounded-full border border-black p-0.5 text-black shadow-sm hover:bg-black hover:text-white focus:outline-none focus:ring-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512" class="h-5 w-5 hover:fill-white dark:fill-white">
            <path
              d="M186.1 328.7c0 20.9-10.9 55.1-36.7 55.1s-36.7-34.2-36.7-55.1 10.9-55.1 36.7-55.1 36.7 34.2 36.7 55.1zM480 278.2c0 31.9-3.2 65.7-17.5 95-37.9 76.6-142.1 74.8-216.7 74.8-75.8 0-186.2 2.7-225.6-74.8-14.6-29-20.2-63.1-20.2-95 0-41.9 13.9-81.5 41.5-113.6-5.2-15.8-7.7-32.4-7.7-48.8 0-21.5 4.9-32.3 14.6-51.8 45.3 0 74.3 9 108.8 36 29-6.9 58.8-10 88.7-10 27 0 54.2 2.9 80.4 9.2 34-26.7 63-35.2 107.8-35.2 9.8 19.5 14.6 30.3 14.6 51.8 0 16.4-2.6 32.7-7.7 48.2 27.5 32.4 39 72.3 39 114.2zm-64.3 50.5c0-43.9-26.7-82.6-73.5-82.6-18.9 0-37 3.4-56 6-14.9 2.3-29.8 3.2-45.1 3.2-15.2 0-30.1-.9-45.1-3.2-18.7-2.6-37-6-56-6-46.8 0-73.5 38.7-73.5 82.6 0 87.8 80.4 101.3 150.4 101.3h48.2c70.3 0 150.6-13.4 150.6-101.3zm-82.6-55.1c-25.8 0-36.7 34.2-36.7 55.1s10.9 55.1 36.7 55.1 36.7-34.2 36.7-55.1-10.9-55.1-36.7-55.1z"
            />
          </svg>
        </button>
        <button
          @click="toggleTheme()"
          class="rounded-full border border-black p-0.5 text-black shadow-sm hover:bg-black hover:text-white focus:outline-none focus:ring-0 dark:text-white"
        >
          <component :is="isDark ? SunIcon : MoonIcon" class="h-5 w-5" />
        </button>
    </div>
  </div>
</template>
<script setup>
import { useDark, useToggle } from '@vueuse/core';
import { onMounted, ref, computed } from 'vue';
import {
  SunIcon,
  MoonIcon,

} from '@heroicons/vue/24/outline';

const isDark = useDark();
const toggleTheme = useToggle(isDark);
const props = defineProps({
  modelValue: {
    type: String,
  },
  items: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue']);
const indicatorRef = ref(null);
const tabRefs = [];
const setTabRef = (el) => tabRefs.push(el);
const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
const handleTab = (tab) => {
  indicatorRef.value.style.top = `${
    tab.target.getBoundingClientRect().top - tab.target.parentElement.getBoundingClientRect().top
  }px`;
  selected.value = tab.target.getAttribute('id');
};
const openGitHub = () => window.open('https://github.com/dd3v/favbox', '_blank');
onMounted(() => {
  indicatorRef.value.style.width = `${tabRefs[0].getBoundingClientRect().width}px`;
  indicatorRef.value.style.top = `${
    tabRefs[0].getBoundingClientRect().top - tabRefs[0].parentElement.getBoundingClientRect().top
  }px`;
});
</script>
