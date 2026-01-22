<template>
  <masonry
    v-if="displayType === 'masonry'"
    :resolve-slot="true"
    :cols="{ 5120: 12, 3840: 10, 2560: 7, 1920: 4, 1280: 4, 992: 3, 768: 2, 576: 1 }"
    :gutter="20"
    class="card-container"
  >
    <slot />
  </masonry>
  <TransitionGroup
    v-else
    tag="div"
    appear
    enter-active-class="transition-opacity duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    :class="layoutClasses"
  >
    <slot />
  </TransitionGroup>
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
  card: 'grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  list: 'grid gap-3 grid-cols-1',
};

const layoutClasses = computed(() => LAYOUT_CLASSES[props.displayType] || LAYOUT_CLASSES.masonry);
</script>
