<template>
  <component
    :is="showFallback ? PhGlobeSimpleLight : 'img'"
    v-bind="showFallback
      ? { class: 'size-4 text-black dark:text-white' }
      : { src: props.bookmark.favicon, alt: 'favicon', onError: handleError }"
  />
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue';
import PhGlobeSimpleLight from '~icons/ph/globe-simple-light';

const emit = defineEmits(['onError']);

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const error = ref(false);

const handleError = () => {
  if (!error.value) {
    error.value = true;
    emit('onError');
  }
};

const showFallback = computed(() => !props.bookmark.favicon || error.value);
</script>
