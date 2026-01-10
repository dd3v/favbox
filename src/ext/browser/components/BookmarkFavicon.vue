<template>
  <img
    v-if="faviconUrl"
    :src="faviconUrl"
    alt="favicon"
    class="size-4"
    @error="handleError"
  >
  <PhGlobeSimpleLight
    v-else
    class="size-4 text-black dark:text-white"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import PhGlobeSimpleLight from '~icons/ph/globe-simple-light';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const originalFailed = ref(false);
const fallbackFailed = ref(false);

const faviconUrl = computed(() => {
  if (props.bookmark.favicon && !originalFailed.value) {
    return props.bookmark.favicon;
  }

  if (!fallbackFailed.value && props.bookmark.domain) {
    return `https://icons.duckduckgo.com/ip3/${encodeURIComponent(props.bookmark.domain)}.ico`;
  }

  return null;
});

const handleError = () => {
  if (!originalFailed.value) {
    originalFailed.value = true;
  } else {
    fallbackFailed.value = true;
  }
};
</script>
