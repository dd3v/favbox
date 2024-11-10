<template>
  <aside
    class="sticky top-0 flex h-full min-h-screen w-14 min-w-14 flex-col items-center justify-center border-neutral-800 bg-gray-100 align-middle shadow-inner dark:border-r dark:border-neutral-900 dark:bg-neutral-950"
  >
    <RiBookmarkFill class="absolute top-3 size-8 fill-black text-black dark:fill-white dark:text-white" />
    <div
      ref="indicatorRef"
      class="absolute my-auto size-10 rounded-md bg-white shadow transition-[top] duration-[0.5s] dark:bg-neutral-900"
    />
    <ul class="space-y-12">
      <li
        v-for="(item, key) in items"
        :key="item.key"
        :ref="el => setMenuItemRef(el, item.name)"
        v-tooltip="{ text: item.tooltip, position: 'right', delay: 1000 }"
        class=""
        @click="handleClick"
      >
        <router-link
          :key="key"

          :to="{ name: item.name }"
          class="relative"
        >
          <component
            :is="item.icon"
            class="pointer-events-none size-6 text-black dark:text-white"
          />
        </router-link>
      </li>
    </ul>
    <div class="absolute bottom-3 flex flex-col items-center space-y-2">
      <a
        href="https://github.com/dd3v/favbox"
        target="_blank"
      >
        <EiScGithub class="size-8 fill-black text-black dark:fill-white dark:text-white" />
      </a>
      <button @click="toggleTheme()">
        <component
          :is="isDark ? MynauiSun : MynauiMoon"
          class="size-6 cursor-pointer fill-black text-black dark:fill-white dark:text-white"
        />
      </button>
    </div>
  </aside>
</template>
<script setup>
import {
  defineProps, ref, onMounted, onBeforeUnmount, reactive, watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { useDark, useToggle } from '@vueuse/core';

import RiBookmarkFill from '~icons/ri/bookmark-fill';
import EiScGithub from '~icons/ei/sc-github';
import MynauiSun from '~icons/mynaui/sun';
import MynauiMoon from '~icons/mynaui/moon';

defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const isDark = useDark();
const toggleTheme = useToggle(isDark);

const route = useRoute();
const indicatorRef = ref(null);
const menuItemsRef = reactive({});

const setMenuItemRef = (el, name) => {
  menuItemsRef[name] = el;
};

const setIndicatorPosition = (element) => {
  const targetRect = element.getBoundingClientRect();
  const center = targetRect.top + targetRect.height / 2;
  indicatorRef.value.style.top = `${center - (indicatorRef.value.offsetHeight / 2)}px`;
};

const moveButton = () => {
  const currentItem = menuItemsRef[route.name];
  if (currentItem) {
    setIndicatorPosition(currentItem);
  }
};

const handleClick = (event) => {
  const targetElement = event.currentTarget;
  setIndicatorPosition(targetElement);
};

onMounted(() => {
  window.addEventListener('resize', moveButton);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', moveButton);
});

watch(() => route.name, () => {
  moveButton();
}, { immediate: true });

</script>
