<template>
  <div class="relative">
    <button
      class="inline-flex size-9 items-center justify-center rounded-md border bg-white text-gray-700 shadow-sm hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
      @click="toggleSort"
    >
      <component
        :is="sortIcon"
        class="size-5 cursor-pointer text-gray-700 dark:text-neutral-400"
      />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import SolarSortFromBottomToTopLineDuotone from '~icons/solar/sort-from-bottom-to-top-line-duotone';
import SolarSortFromTopToBottomLineDuotone from '~icons/solar/sort-from-top-to-bottom-line-duotone';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'desc',
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const sortIcon = computed(() => (props.modelValue === 'desc'
  ? SolarSortFromTopToBottomLineDuotone
  : SolarSortFromBottomToTopLineDuotone));

const toggleSort = () => {
  emit('update:modelValue', props.modelValue === 'desc' ? 'asc' : 'desc');
};
</script>
