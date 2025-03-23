<template>
  <component
    :is="error ? PhGlobeSimpleLight : 'img'"
    v-bind="error ? { class: 'size-4 fill-black' } : { src: bookmark.favicon, alt: 'favicon', onError: handleError }"
  />
</template>

<script setup>
import { ref } from 'vue';
import PhGlobeSimpleLight from '~icons/ph/globe-simple-light';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const error = ref(false);

const handleError = () => {
  error.value = true;
};
</script>
