<template>
  <GlobeIcon
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
import GlobeIcon from '@/components/icons/GlobeIcon.vue';

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
