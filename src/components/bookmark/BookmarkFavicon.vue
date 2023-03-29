<template>
  <img
    v-if="favicon"
    :src="favicon"
    alt="favicon"
  >
  <globe-alt-icon v-else />
</template>
<script setup>
import { GlobeAltIcon } from '@heroicons/vue/24/outline';

defineProps({
  favicon: {
    type: String,
    required: false,
    default: '',
  },
});
</script>
