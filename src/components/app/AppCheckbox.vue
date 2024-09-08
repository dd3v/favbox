<template>
  <label class="group flex cursor-pointer items-center space-x-2">
    <input
      :value="value"
      type="checkbox"
      class="peer hidden"
      :checked="modelValue.includes(value)"
      @input="update"
    >
    <span
      class="relative flex h-4 w-4 items-center justify-center rounded-sm border-2 border-gray-300 bg-white shadow-sm transition-transform duration-200 ease-in-out group-hover:border-neutral-400 peer-checked:border-neutral-400 peer-checked:bg-neutral-400 dark:border-neutral-600 dark:bg-neutral-800 dark:group-hover:border-neutral-500 dark:peer-checked:border-neutral-500 dark:peer-checked:bg-neutral-500"
    >
      <span
        class="absolute inset-0 flex items-center justify-center text-white opacity-0 transition-opacity duration-200 ease-in-out peer-checked:opacity-100"
      >
        <span class="h-2.5 w-2.5 rounded-sm bg-current" />
      </span>
    </span>
    <span class="text-gray-700 dark:text-neutral-200">{{ label }}</span>
  </label>
</template>

<script setup>
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const update = () => {
  const arr = props.modelValue;
  if (arr.includes(props.value)) {
    arr.splice(arr.indexOf(props.value), 1);
  } else {
    arr.push(props.value);
  }
  emit('update:modelValue', arr);
};
</script>
