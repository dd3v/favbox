<template>
  <label class="group flex cursor-pointer items-center space-x-2">
    <input
      v-model="model"
      type="radio"
      name="sort"
      :value="props.value"
      class="peer hidden"
    >
    <span
      class="relative flex size-4 items-center justify-center rounded-full border-2 border-gray-300 bg-white shadow-sm transition-transform duration-200 ease-in-out group-hover:border-neutral-400 peer-checked:border-neutral-400 peer-checked:bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-800 dark:group-hover:border-neutral-500 dark:peer-checked:border-neutral-500 dark:peer-checked:bg-neutral-600"
    >
      <span
        class="absolute size-2.5 rounded-full bg-neutral-600 opacity-0 transition-opacity duration-200 ease-in-out peer-checked:opacity-100 dark:bg-neutral-400"
      />
    </span>
    <span class="text-gray-700 dark:text-neutral-200">{{ label }}</span>
  </label>
</template>
<script setup>

const model = defineModel({ type: String, required: true });

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});
</script>
