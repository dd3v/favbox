<template>
  <div class="relative">
    <button
      class=" text-gray-700  dark:border-neutral-800  dark:text-white"
      @click="toggleTheme()"
    >
      <component
        :is="isDark ? IconoirSunLight : IconoirHalfMoon"
        class="size-4 text-soft-900 hover:text-black dark:text-white dark:hover:text-white"
      />
    </button>
  </div>
</template>
<script setup>
import { useDark, useToggle } from '@vueuse/core';
import IconoirHalfMoon from '~icons/iconoir/half-moon?width=24px&height=24px';
import IconoirSunLight from '~icons/iconoir/sun-light?width=24px&height=24px';

const isDark = useDark();
const toggleTheme = useToggle(isDark);
</script>
