<template>
  <div
    :class="badgeClass"
    class="inline-flex cursor-pointer gap-x-1 items-center space-x-1 whitespace-nowrap rounded-sm px-2 py-0.5 text-xs ring-1 ring-inset"
  >
    <slot />
    <button
      v-if="closable"
      type="button"
      :class="closeButtonClass"
      class="size-3 flex items-center justify-center"
      aria-label="Close"
      tabindex="0"
      @click="handleClose"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1"
        stroke="currentColor"
        class="size-3"
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
  const colorClasses = {
    red: 'bg-red-50 text-red-700 ring-red-700/10 shadow shadow-red-500/20 dark:bg-red-900 dark:text-red-300 dark:ring-red-400/20',
    yellow: 'bg-yellow-50 text-yellow-800 ring-yellow-700/10 shadow shadow-yellow-500/20 dark:bg-yellow-900 dark:text-yellow-300 dark:ring-yellow-500/20',
    green: 'bg-green-50 text-green-700 ring-green-700/10 shadow shadow-green-500/20 dark:bg-green-900 dark:text-green-300 dark:ring-green-500/20',
    cyan: 'bg-cyan-50 text-cyan-700 ring-cyan-700/10 shadow shadow-cyan-500/20 dark:bg-cyan-900 dark:text-cyan-300 dark:ring-cyan-500/20',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10 shadow shadow-indigo-500/20 dark:bg-indigo-900 dark:text-indigo-300 dark:ring-indigo-500/20',
    purple: 'bg-purple-50 text-purple-700 ring-purple-700/10 shadow shadow-purple-500/20 dark:bg-purple-900 dark:text-purple-300 dark:ring-purple-500/20',
    pink: 'bg-pink-50 text-pink-700 ring-pink-700/10 shadow shadow-pink-500/20 dark:bg-pink-900 dark:text-pink-300 dark:ring-pink-500/20',
    gray: 'bg-gray-50 text-gray-600 ring-gray-700/10 shadow shadow-gray-400/20 dark:bg-neutral-700 dark:text-neutral-300 dark:ring-neutral-500/20',
  };
  return colorClasses[props.color] || colorClasses.gray;
});

const closeButtonClass = computed(() => {
  const closeClasses = {
    red: 'text-red-700 hover:bg-red-300/20 hover:text-red-900 dark:text-red-300 dark:hover:text-red-100',
    yellow: 'text-yellow-700 hover:bg-yellow-300/20 hover:text-yellow-900 dark:text-yellow-300 dark:hover:text-yellow-100',
    green: 'text-green-700 hover:bg-green-300/20 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100',
    cyan: 'text-cyan-700 hover:bg-cyan-300/20 hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-100',
    indigo: 'text-indigo-700 hover:bg-indigo-300/20 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-100',
    purple: 'text-purple-700 hover:bg-purple-300/20 hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100',
    pink: 'text-pink-700 hover:bg-pink-300/20 hover:text-pink-900 dark:text-pink-300 dark:hover:text-pink-100',
    gray: 'text-gray-600 hover:bg-gray-300/20 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100',
  };
  return closeClasses[props.color] || closeClasses.gray;
});

const handleClose = () => {
  emit('onClose');
};
</script>
