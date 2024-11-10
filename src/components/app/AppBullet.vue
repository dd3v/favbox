<template>
  <span
    :class="[dotClass, dotSize]"
    class="inline-block rounded-full border"
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
  switch (props.color) {
    case 'red':
      return 'bg-red-50 border-red-400 dark:bg-red-900 dark:border-red-600';
    case 'yellow':
      return 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900 dark:border-yellow-600';
    case 'green':
      return 'bg-green-50 border-green-400 dark:bg-green-900 dark:border-green-600';
    case 'blue':
      return 'bg-blue-50 border-blue-400 dark:bg-blue-900 dark:border-blue-600';
    case 'indigo':
      return 'bg-indigo-50 border-indigo-400 dark:bg-indigo-900 dark:border-indigo-600';
    case 'purple':
      return 'bg-purple-50 border-purple-400 dark:bg-purple-900 dark:border-purple-600';
    case 'pink':
      return 'bg-pink-50 border-pink-400 dark:bg-pink-900 dark:border-pink-600';
    case 'cyan':
      return 'bg-cyan-50 border-cyan-400 dark:bg-cyan-900 dark:border-cyan-600';
    case 'gray':
      return 'bg-gray-50 border-gray-400 dark:bg-neutral-700 dark:border-neutral-500';
    default:
      return 'bg-gray-50 border-gray-400 dark:bg-neutral-700 dark:border-neutral-500';
  }
});
</script>
