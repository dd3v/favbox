<template>
  <span
    :class="[dotClass, dotSize]"
    class="inline-block rounded-full"
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
      return 'bg-red-400';
    case 'yellow':
      return 'bg-yellow-400';
    case 'green':
      return 'bg-green-400';
    case 'blue':
      return 'bg-blue-400';
    case 'indigo':
      return 'bg-indigo-400';
    case 'purple':
      return 'bg-purple-400';
    case 'pink':
      return 'bg-pink-400';
    case 'gray':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
});
</script>
