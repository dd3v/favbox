<template>
  <button
    class="inline-flex items-stretch rounded-md border bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
    @click="$emit('update:modelValue', +!error)"
  >
    <exclamation-circle-icon
      class="h-5 w-5"
      :class="error ? 'text-rose-400' : 'text-gray-700 dark:text-neutral-400'"
    />
  </button>
</template>
<script setup>
import { computed } from 'vue';
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue']);
const error = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

console.warn('123123');
</script>
