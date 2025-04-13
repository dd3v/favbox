<template>
  <aside
    class="sticky top-0 flex h-full min-h-screen w-14 min-w-14 flex-col items-center justify-center border-soft-900 bg-soft-50 align-middle shadow-inner dark:border-r dark:border-neutral-900 dark:bg-neutral-950"
  >
    <RiBookmarkFill class="absolute top-3 size-8 fill-black text-black dark:fill-white dark:text-white" />
    <div
      ref="indicatorRef"
      class="absolute my-auto size-10 rounded-md bg-soft-200/50 transition-[top] duration-[0.5s] dark:bg-neutral-800"
    />
    <ul class="space-y-12">
      <li
        v-for="(item, key) in items"
        :key="item.key"
        :ref="el => setMenuItemRef(el, item.name)"
        @click="handleClick"
      >
        <router-link
          :key="key"
          v-tooltip.right="{ content: item.tooltip }"
          :to="{ name: item.name }"
          class="relative"
        >
          <component
            :is="item.icon"
            class="pointer-events-none size-6 text-soft-800 dark:text-white"
          />
        </router-link>
      </li>
    </ul>
    <div class="absolute bottom-1 flex flex-col items-center">
      <a
        v-tooltip.right="{ content: 'GitHub' }"
        href="https://github.com/dd3v/favbox"
        target="_blank"
      >
        <IconoirGithub class="size-4 text-soft-400 hover:text-soft-900 dark:text-white" />
      </a>
      <ThemeMode
        v-tooltip.right="{ content: 'Theme' }"
        class="mt-2"
      />
    </div>
  </aside>
</template>
<script setup>
import {
  defineProps, ref, onMounted, onBeforeUnmount, reactive, watch,
} from 'vue';
import { useRoute } from 'vue-router';

import ThemeMode from '@/ext/browser/components/ThemeMode.vue';
import RiBookmarkFill from '~icons/ri/bookmark-fill';
import IconoirGithub from '~icons/iconoir/github?width=24px&height=24px';

defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const route = useRoute();
const indicatorRef = ref(null);
const menuItemsRef = reactive({});

const isActive = (name) => route.name === name;

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
