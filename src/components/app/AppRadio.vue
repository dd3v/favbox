<template>
  <label
    :for="inputId"
    class="group flex cursor-pointer items-center gap-x-2"
  >
    <input
      :id="inputId"
      v-model="model"
      type="radio"
      :name="name"
      :value="value"
      :aria-label="label"
      class="size-4 rounded-full border-gray-300 text-black focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:bg-black dark:focus:ring-offset-gray-800"
    >
    <span class="text-xs text-black dark:text-white">{{ label }}</span>
  </label>
</template>
<script setup>
import { useId } from 'vue';

const model = defineModel({ type: String, required: true });
defineProps({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const inputId = useId();
</script>
