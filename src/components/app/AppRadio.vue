<template>
  <label class="group flex cursor-pointer items-center space-x-2">
    <input
      v-model="model"
      type="radio"
      :name="name"
      :value="value"
      class="size-4 rounded-full border-gray-300 text-black focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:bg-black dark:focus:ring-offset-gray-800"
    >
    <span class="text-gray-800 dark:text-neutral-100">{{ label }}</span>
  </label>
</template>
<script setup>
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
</script>
