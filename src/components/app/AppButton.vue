<template>
  <button
    :class="buttonClasses"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
  },
});
const buttonClasses = computed(() => {
  switch (props.variant) {
    case 'red':
      return 'inline-flex justify-center rounded-md px-3 py-2 text-xs text-white shadow-sm transition '
             + 'bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 '
             + 'dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-500';
    case 'gray':
      return 'inline-flex justify-center rounded-md px-3 py-2 text-xs shadow-sm transition '
             + 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 '
             + 'dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-500';
    default:
      return 'h-9 rounded-lg px-4 py-2 text-xs text-white shadow-sm transition '
             + 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 '
             + 'dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:focus:ring-gray-400';
  }
});
</script>
