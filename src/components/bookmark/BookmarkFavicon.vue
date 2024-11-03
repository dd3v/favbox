<template>
  <PhGlobeSimpleLight
    v-if="fallback || !bookmark.favicon"
    class="size-4 fill-black"
  />
  <img
    v-else
    :src="bookmark.favicon"
    alt="favicon"
    @error="handleError"
  >
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

const fallback = ref(false);

const handleError = () => {
  fallback.value = true;
};

</script>
