<template>
  <button
    :class="buttonClasses"
    :aria-label="ariaLabel"
    :title="title"
    tabindex="0"
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
  ariaLabel: {
    type: String,
    default: 'Button',
  },
  title: {
    type: String,
    default: 'Button',
  },
});

const buttonClasses = computed(() => {
  switch (props.variant) {
    case 'red':
      return 'btn-red';
    case 'gray':
      return 'btn-gray';
    default:
      return 'btn-default';
  }
});
</script>

<style scoped>
.btn-default {
  @apply block rounded-md bg-gray-900 px-3 py-2.5 text-xs font-medium text-white
         border border-gray-800 transition-all duration-200 ease-out
         hover:bg-gray-800 hover:border-gray-700 hover:shadow-sm
         active:bg-gray-900 active:scale-[0.98]
         focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1
         dark:bg-gray-50 dark:text-gray-900 dark:border-gray-200
         dark:hover:bg-white dark:hover:border-gray-300 dark:hover:shadow-sm
         dark:focus:ring-gray-300;
}

.btn-red {
  @apply block rounded-md bg-red-600 px-3 py-2.5 text-xs font-medium text-white
         border border-red-500 transition-all duration-200 ease-out
         hover:bg-red-700 hover:border-red-600 hover:shadow-sm
         active:bg-red-800 active:scale-[0.98]
         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1;
}

.btn-gray {
  @apply block rounded-md bg-gray-100 px-3 py-2.5 text-xs font-medium text-gray-700
         border border-gray-200 transition-all duration-200 ease-out
         hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm hover:text-gray-900
         active:bg-gray-100 active:scale-[0.98]
         focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1
         dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600
         dark:hover:bg-gray-600 dark:hover:border-gray-500 dark:hover:text-white
         dark:focus:ring-gray-500;
}
</style>
