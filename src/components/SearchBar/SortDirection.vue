<template>
  <div class="relative">
    <button
      class="inline-flex items-stretch rounded-md border bg-white rounded-l-md px-2 py-2 hover:bg-gray-50 hover:text-gray-700"
      @click="$emit('update:modelValue', sort === 'desc' ? 'asc' : 'desc')"
    >
      <component :is="icon" class="h-5 w-5 text-gray-600" />
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
