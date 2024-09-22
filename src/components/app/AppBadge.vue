<template>
  <span
    :class="badgeClass"
    class="inline-flex items-center space-x-1 rounded-md px-2 py-1 font-medium ring-1 ring-inset"
  >
    <slot />
    <button
      v-if="closable"
      :class="closeButtonClass"
      @click="handleClose"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </span>
</template>

<script setup>
import { defineEmits, computed } from 'vue';

const props = defineProps({
  color: {
    type: String,
    default: 'gray',
  },
  closable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const badgeClass = computed(() => {
  switch (props.color) {
    case 'red':
      return 'bg-red-50 text-red-700 ring-red-600/10';
    case 'yellow':
      return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20';
    case 'green':
      return 'bg-green-50 text-green-700 ring-green-600/20';
    case 'blue':
      return 'bg-blue-50 text-blue-700 ring-blue-700/10';
    case 'indigo':
      return 'bg-indigo-50 text-indigo-700 ring-indigo-700/10';
    case 'purple':
      return 'bg-purple-50 text-purple-700 ring-purple-700/10';
    case 'pink':
      return 'bg-pink-50 text-pink-700 ring-pink-700/10';
    default:
      return 'bg-gray-50 text-gray-600 ring-gray-500/10';
  }
});

const closeButtonClass = computed(() => {
  switch (props.color) {
    case 'red':
      return 'text-red-700 hover:text-red-900 dark:text-red-300 dark:hover:text-red-100';
    case 'yellow':
      return 'text-yellow-800 hover:text-yellow-900 dark:text-yellow-300 dark:hover:text-yellow-100';
    case 'green':
      return 'text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100';
    case 'blue':
      return 'text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100';
    case 'indigo':
      return 'text-indigo-700 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-100';
    case 'purple':
      return 'text-purple-700 hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100';
    case 'pink':
      return 'text-pink-700 hover:text-pink-900 dark:text-pink-300 dark:hover:text-pink-100';
    default:
      return 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100';
  }
});

const handleClose = () => {
  emit('onClose');
};
</script>
