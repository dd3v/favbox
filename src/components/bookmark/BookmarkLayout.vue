<template>
  <masonry
    v-if="displayType === 'masonry'"
    :resolve-slot="true"
    :cols="{ default: 4, 1000: 2, 700: 1 }"
    :gutter="10"
  >
    <slot />
  </masonry>
  <div :class="layout" v-else>
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
        return '';
      case 'card':
        return 'grid gap-10 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';
      case 'list':
        return 'grid gap-5 grid-cols-1';
      default:
        return '';
    }
  },
});
</script>
