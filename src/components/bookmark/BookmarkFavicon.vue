<template>
  <img
    :src="favicon"
    alt="favicon"
    @error="handleError"
  >
</template>
<script setup>
import { ref, onBeforeUpdate } from 'vue';
import globe from '@/assets/globe.svg';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const favicon = ref(props.bookmark.favicon || globe);

const handleError = () => {
  favicon.value = globe;
};

onBeforeUpdate(() => {
  favicon.value = props.bookmark.favicon || globe;
});
</script>
