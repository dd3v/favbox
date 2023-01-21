<template>
  <div class="relative w-full">
    <label for="term">
      <input
        type="text"
        :value="term"
        @input="$emit('update:modelValue', $event.target.value)"
        id="term"
        placeholder="Search terms..."
        class="w-full rounded-md border-gray-200 pr-10 shadow-sm sm:text-sm"
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
</script>
