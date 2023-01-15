<template>
  <ul class="list-style-none cursor-pointer">
    <li class="flex flex-col" v-for="(tab, key) in items" :key="key">
      <label :for="tab.value" class="cursor-pointer">
        <input
          class="hidden"
          type="radio"
          name="menu"
          :id="tab.value"
          :value="tab.value"
          v-model="selected"
        />
        <span>{{ tab.label }}</span>
      </label>
    </li>
  </ul>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
  },
  items: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue']);
const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

</script>
