<template>
  <button
    :class="buttonClasses"
    :aria-label="ariaLabel"
    :title="title"
    :role="role"
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
  role: {
    type: String,
    default: 'button',
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
  @apply block rounded-md bg-black px-3 py-2.5 text-xs font-medium text-white
         border border-gray-800 shadow-sm transition-all duration-200 ease-out
         hover:bg-gray-900 hover:border-gray-700 hover:shadow-md
         active:bg-black active:scale-[0.98] active:shadow-sm
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
         focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
         dark:bg-white dark:text-black dark:border-gray-200 dark:shadow-sm
         dark:hover:bg-gray-50 dark:hover:border-gray-300 dark:hover:shadow-md
         dark:focus:ring-blue-400 dark:focus-visible:ring-blue-400;
}

.btn-red {
  @apply block rounded-md bg-red-600 px-3 py-2.5 text-xs font-medium text-white
         border border-red-500 shadow-sm transition-all duration-200 ease-out
         hover:bg-red-700 hover:border-red-600 hover:shadow-md
         active:bg-red-800 active:scale-[0.98] active:shadow-sm
         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
         focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2;
}

.btn-gray {
  @apply block rounded-md bg-gray-100 px-3 py-2.5 text-xs font-medium text-gray-700
         border border-gray-200 shadow-sm transition-all duration-200 ease-out
         hover:bg-gray-50 hover:border-gray-300 hover:shadow-md hover:text-gray-900
         active:bg-gray-100 active:scale-[0.98] active:shadow-sm
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
         focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
         dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:shadow-sm
         dark:hover:bg-gray-600 dark:hover:border-gray-500 dark:hover:text-white dark:hover:shadow-md
         dark:focus:ring-blue-400 dark:focus-visible:ring-blue-400;
}
</style>
