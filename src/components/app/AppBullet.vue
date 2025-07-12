<template>
  <span
    :class="[dotClass, dotSize]"
    class="inline-block rounded-full border"
    aria-hidden="true"
    focusable="false"
  />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: 'gray',
  },
  size: {
    type: Number,
    default: 2,
  },
});

const dotSize = computed(() => `size-${props.size}`);

const dotClass = computed(() => {
  const colorClasses = {
    red: 'bg-red-50 border-red-400 dark:bg-red-900 dark:border-red-600',
    yellow: 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900 dark:border-yellow-600',
    green: 'bg-green-50 border-green-400 dark:bg-green-900 dark:border-green-600',
    blue: 'bg-blue-50 border-blue-400 dark:bg-blue-900 dark:border-blue-600',
    indigo: 'bg-indigo-50 border-indigo-400 dark:bg-indigo-900 dark:border-indigo-600',
    purple: 'bg-purple-50 border-purple-400 dark:bg-purple-900 dark:border-purple-600',
    pink: 'bg-pink-50 border-pink-400 dark:bg-pink-900 dark:border-pink-600',
    cyan: 'bg-cyan-50 border-cyan-400 dark:bg-cyan-900 dark:border-cyan-600',
    gray: 'bg-gray-50 border-gray-400 dark:bg-neutral-700 dark:border-neutral-500',
  };
  return colorClasses[props.color] || colorClasses.gray;
});
</script>
