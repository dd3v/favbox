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
      return 'bg-red-50 border-red-400';
    case 'yellow':
      return 'bg-yellow-50 border-yellow-400';
    case 'green':
      return 'bg-green-50 border-green-400';
    case 'blue':
      return 'bg-blue-50 border-blue-400';
    case 'indigo':
      return 'bg-indigo-50 border-indigo-400';
    case 'purple':
      return 'bg-purple-50 border-purple-400';
    case 'pink':
      return 'bg-pink-50 border-pink-400';
    case 'cyan':
      return 'bg-cyan-50 border-cyan-400';
    case 'gray':
      return 'bg-gray-50 border-gray-400';
    default:
      return 'bg-gray-50 border-gray-400';
  }
});
</script>
