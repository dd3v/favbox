<template>
  <div class="relative">
    <button
      class="inline-flex items-stretch rounded-md border bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
      @click="$emit('update:modelValue', sort === 'desc' ? 'asc' : 'desc')"
    >
      <component
        :is="icon"
        class="h-5 w-5 text-gray-700 dark:text-neutral-400"
      />
    </button>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { BarsArrowDownIcon, BarsArrowUpIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'desc',
    required: true,
  },
});
const emit = defineEmits(['update:modelValue']);
const sort = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
const icon = computed({
  get: () => (sort.value === 'desc' ? BarsArrowDownIcon : BarsArrowUpIcon),
});
</script>
