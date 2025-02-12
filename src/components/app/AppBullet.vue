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
  switch (props.color) {
    case 'red':
      return 'dot-red';
    case 'yellow':
      return 'dot-yellow';
    case 'green':
      return 'dot-green';
    case 'blue':
      return 'dot-blue';
    case 'indigo':
      return 'dot-indigo';
    case 'purple':
      return 'dot-purple';
    case 'pink':
      return 'dot-pink';
    case 'cyan':
      return 'dot-cyan';
    case 'gray':
      return 'dot-gray';
    default:
      return 'dot-gray';
  }
});
</script>

<style scoped>
.dot-red {
  @apply bg-red-50 border-red-400 dark:bg-red-900 dark:border-red-600;
}

.dot-yellow {
  @apply bg-yellow-50 border-yellow-400 dark:bg-yellow-900 dark:border-yellow-600;
}

.dot-green {
  @apply bg-green-50 border-green-400 dark:bg-green-900 dark:border-green-600;
}

.dot-blue {
  @apply bg-blue-50 border-blue-400 dark:bg-blue-900 dark:border-blue-600;
}

.dot-indigo {
  @apply bg-indigo-50 border-indigo-400 dark:bg-indigo-900 dark:border-indigo-600;
}

.dot-purple {
  @apply bg-purple-50 border-purple-400 dark:bg-purple-900 dark:border-purple-600;
}

.dot-pink {
  @apply bg-pink-50 border-pink-400 dark:bg-pink-900 dark:border-pink-600;
}

.dot-cyan {
  @apply bg-cyan-50 border-cyan-400 dark:bg-cyan-900 dark:border-cyan-600;
}

.dot-gray {
  @apply bg-gray-50 border-gray-400 dark:bg-neutral-700 dark:border-neutral-500;
}

.size-2 {
  @apply h-2 w-2;
}

.size-3 {
  @apply h-3 w-3;
}

.size-4 {
  @apply h-4 w-4;
}

.size-5 {
  @apply h-5 w-5;
}

.size-6 {
  @apply h-6 w-6;
}
</style>
