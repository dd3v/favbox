<template>
  <div :class="layout">
    <slot />
  </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  displayType: {
    type: String,
    required: true,
    default: 'masonry',
  },
});

const layout = computed({
  get: () => {
    switch (props.displayType) {
      case 'masonry':
        return 'columns-2 md:columns-3 lg:columns-4';
      case 'card':
        return 'grid gap-10 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';
      case 'list':
        return 'grid gap-5 grid-cols-1';
      default:
        return 'columns-2 md:columns-3 lg:columns-4';
    }
  },
});
</script>
