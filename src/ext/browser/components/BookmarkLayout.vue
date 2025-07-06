<template>
  <masonry
    v-if="displayType === 'masonry'"
    :resolve-slot="true"
    :cols="{ 3840: 10, 2560: 7, 1920: 4, 992: 3, 768: 2, 576: 1 }"
    :gutter="20"
  >
    <slot />
  </masonry>
  <div
    v-else
    :class="layoutClasses"
  >
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
    validator: (value) => ['masonry', 'card', 'list'].includes(value),
  },
});

const LAYOUT_CLASSES = {
  masonry: '',
  card: 'grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
  list: 'grid gap-3 grid-cols-1',
};

const layoutClasses = computed(() => LAYOUT_CLASSES[props.displayType] || LAYOUT_CLASSES.masonry);
</script>
