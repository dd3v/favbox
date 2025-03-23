<template>
  <div class="relative">
    <button
      class="inline-flex size-9 items-center justify-center rounded-md border bg-white text-gray-700 shadow-sm hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
      @click="toggleTheme()"
    >
      <component
        :is="isDark ? MynauiSun : MynauiMoon"
        class="size-5 cursor-pointer fill-black text-gray-700 dark:fill-white dark:text-neutral-400"
      />
    </button>
  </div>
</template>
<script setup>
import { useDark, useToggle } from '@vueuse/core';
import MynauiSun from '~icons/mynaui/sun';
import MynauiMoon from '~icons/mynaui/moon';

const isDark = useDark();
const toggleTheme = useToggle(isDark);
</script>
