<template>
  <div
    :class="badgeClass"
    class="inline-flex cursor-pointer items-center space-x-1 truncate text-nowrap rounded-sm px-2 py-0.5 text-xs ring-1 ring-inset"
  >
    <slot />
    <button
      v-if="closable"
      :class="closeButtonClass"
      class="size-3 items-center justify-center"
      @click="handleClose"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
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

const emit = defineEmits(['onClose']);

const badgeClass = computed(() => {
  switch (props.color) {
    case 'red':
      return 'bg-red-50 text-red-700 ring-red-700/10 dark:bg-red-900 dark:text-red-300 dark:ring-red-400/20';
    case 'yellow':
      return 'bg-yellow-50 text-yellow-800 ring-yellow-700/10 dark:bg-yellow-900 dark:text-yellow-300 dark:ring-yellow-500/20';
    case 'green':
      return 'bg-green-50 text-green-700 ring-green-700/10 dark:bg-green-900 dark:text-green-300 dark:ring-green-500/20';
    case 'cyan':
      return 'bg-cyan-50 text-cyan-700 ring-cyan-700/10 dark:bg-cyan-900 dark:text-cyan-300 dark:ring-cyan-500/20';
    case 'indigo':
      return 'bg-indigo-50 text-indigo-700 ring-indigo-700/10 dark:bg-indigo-900 dark:text-indigo-300 dark:ring-indigo-500/20';
    case 'purple':
      return 'bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-900 dark:text-purple-300 dark:ring-purple-500/20';
    case 'pink':
      return 'bg-pink-50 text-pink-700 ring-pink-700/10 dark:bg-pink-900 dark:text-pink-300 dark:ring-pink-500/20';
    case 'gray':
      return 'bg-gray-50 text-gray-600 ring-gray-700/10 dark:bg-neutral-700 dark:text-neutral-300 dark:ring-neutral-500/20';
    default:
      return 'bg-rose-50 text-rose-600 ring-rose-700/10 dark:bg-rose-900 dark:text-rose-300 dark:ring-rose-500/20';
  }
});

const closeButtonClass = computed(() => {
  switch (props.color) {
    case 'red':
      return 'text-red-700  hover:bg-red-300/20 hover:text-red-900 dark:text-red-300 dark:hover:text-red-100';
    case 'yellow':
      return 'text-yellow-700 hover:bg-yellow-300/20 hover:text-yellow-900 dark:text-yellow-300 dark:hover:text-yellow-100';
    case 'green':
      return 'text-green-700 hover:text-green-900 hover:bg-green-300/20 dark:text-green-300 dark:hover:text-green-100';
    case 'cyan':
      return 'text-cyan-700 hover:text-cyan-900 hover:bg-cyan-300/20 dark:text-cyan-300 dark:hover:text-cyan-100';
    case 'indigo':
      return 'text-indigo-700 hover:bg-indigo-300/20 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-100';
    case 'purple':
      return 'text-purple-700 hover:bg-purple-300/20 hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100';
    case 'pink':
      return 'text-pink-700 hover:text-pink-900 hover:bg-pink-300/20 dark:text-pink-300 dark:hover:text-pink-100';
    case 'gray':
      return 'text-gray-600 hover:bg-gray-300/20 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100';
    default:
      return 'text-rose-600 hover:bg-rose-300/20 hover:text-rose-800 dark:text-rose-300 dark:hover:text-rose-100';
  }
});

const handleClose = () => {
  emit('onClose');
};
</script>
