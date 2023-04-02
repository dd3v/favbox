<template>
  <img
    v-if="favicon"
    :src="favicon"
    alt="favicon"
    @error="handleError"
  >
  <globe-alt-icon v-else />
</template>
<script setup>
import { computed } from 'vue';
import { GlobeAltIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  favicon: {
    type: String,
    required: false,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue']);
const favicon = computed({
  get: () => props.favicon,
  set: (value) => emit('update:modelValue', value),
});

const handleError = () => {
  favicon.value = '';
};
</script>
