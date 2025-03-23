<template>
  <masonry
    v-if="displayType === 'masonry'"
    :resolve-slot="true"
    :cols="{ 3840: 10, 2560: 7, 1920: 4, 992: 3, 768: 2, 576: 1 }"
    :gutter="15"
  >
    <slot />
  </masonry>
  <div
    v-else
    :class="layout"
  >
    <slot />
  </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  displayType: { type: String, required: true, default: 'masonry' },
});

const layout = computed({
  get: () => {
    switch (props.displayType) {
      case 'masonry':
        return '';
      case 'card':
        return 'grid gap-3 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';
      case 'list':
        return 'grid gap-3 grid-cols-1';
      default:
        return 'masonry';
    }
  },
});
</script>
