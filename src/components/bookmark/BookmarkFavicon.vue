<template>
  <img
    :src="favicon"
    alt="favicon"
    @error="handleError"
  >
</template>
<script setup>
import { ref } from 'vue';
import globe from '@/assets/globe.svg';

const props = defineProps({
  favicon: {
    type: String,
    required: false,
    default: '',
  },
  domain: {
    type: String,
    required: false,
    default: '',
  },
});

const favicon = ref(props.favicon ? props.favicon : `https://${props.domain}/favicon.ico`);

const handleError = () => {
  favicon.value = globe;
};
</script>
