<template>
  <img
    :src="favicon"
    alt="favicon"
  >
</template>
<script setup>
import { computed } from 'vue';
import globe from '@/assets/globe.svg';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const favicon = computed({
  get: () => props.bookmark.favicon ?? globe,
});
</script>
