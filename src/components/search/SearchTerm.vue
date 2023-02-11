<template>
  <div class="relative w-full">
    <label for="term">
      <input
        type="search"
        :value="term"
        @input="debouncedEmit($event.target.value)"
        id="term"
        autocomplete="off"
        placeholder="Search terms..."
        class="w-full rounded-md border-gray-200 text-gray-700 shadow-sm outline-none focus:border-gray-300 focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 focus:dark:border-neutral-600 sm:text-sm"
      />
    </label>
  </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    require: true,
  },
});

const emit = defineEmits(['update:modelValue']);
const term = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
let timer = null;
const debouncedEmit = (value) => {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    emit('update:modelValue', value);
    timer = null;
  }, 300);
};
</script>
