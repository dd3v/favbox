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
  @apply block rounded-md bg-black px-4 py-2 text-white drop-shadow-sm transition-all duration-300 hover:bg-gray-900 active:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:active:bg-gray-200;
}

.btn-red {
  @apply block rounded-md bg-red-600 px-4 py-2 text-white drop-shadow-sm transition-all duration-300 hover:bg-red-700 active:bg-red-800;
}

.btn-gray {
  @apply block rounded-md bg-gray-100 px-4 py-2 text-gray-900 drop-shadow-sm transition-all duration-300 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-800;
}
</style>
