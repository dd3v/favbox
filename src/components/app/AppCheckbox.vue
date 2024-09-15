<template>
  <label
    :for="'checkbox-' + value"
    class="flex cursor-pointer items-center space-x-2"
  >
    <input
      :id="'checkbox-' + value"
      :value="value"
      :name="name"
      type="checkbox"
      class="size-4 rounded border-gray-300 text-black focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:bg-black dark:focus:ring-offset-gray-800"
      :checked="modelValue.includes(value)"
      @change="update"
    >
    <span class="text-gray-900 dark:text-gray-100">{{ label }}</span>
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
  name: {
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
