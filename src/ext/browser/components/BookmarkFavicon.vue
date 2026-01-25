<template>
  <div>
    <img
      v-if="faviconUrl"
      v-show="loaded"
      :key="faviconUrl"
      class="size-full"
      :src="faviconUrl"
      alt="favicon"
      @load="loaded = true"
      @error="handleError"
    >

    <PhGlobeSimpleLight
      v-if="!loaded"
      class="size-4 text-black dark:text-white"
    />
  </div>
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

const loaded = ref(false);
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
  loaded.value = false;

  if (!originalFailed.value) {
    originalFailed.value = true;
  } else {
    fallbackFailed.value = true;
  }
};
</script>
