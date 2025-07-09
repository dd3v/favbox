<template>
  <div
    class="flex w-full items-center justify-center"
    :class="{
      'min-h-[80px] sm:min-h-[120px]': !bookmark.image,
      'min-h-[60px] sm:min-h-[80px]': bookmark.image && !isLoading && !imageError
    }"
  >
    <div
      v-if="bookmark.image && isLoading"
      class="flex size-full items-center justify-center"
    >
      <slot name="loading">
        <AppSpinner />
      </slot>
    </div>
    <img
      v-else-if="bookmark.image && !imageError"
      :key="`${bookmark.id}-${bookmark.image}`"
      :src="String(bookmark.image)"
      :alt="bookmark.title"
      class="max-h-full max-w-full object-cover transition-all duration-700 ease-out"
      :class="{
        'blur-sm': isLoading,
        'blur-0': !isLoading
      }"
      @load="handleImageLoad"
      @error="handleImageError"
    >
    <ImagePlaceholder
      v-else
      :favicon="bookmark.favicon"
      :title="bookmark.domain"
      :bookmark-id="bookmark.id"
      class="w-full"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import ImagePlaceholder from '@/ext/browser/components/card/ImagePlaceholder.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const imageError = ref(false);
const isLoading = ref(false);

// Reset state when bookmark changes
watch(() => props.bookmark.image, (newImage, oldImage) => {
  if (newImage !== oldImage) {
    imageError.value = false;
    // Only show loading for non-base64 images
    const isBase64 = newImage?.startsWith('data:');
    isLoading.value = !!newImage && !isBase64;
  }
});

const handleImageLoad = () => {
  const isBase64 = props.bookmark.image?.startsWith('data:');
  const delay = isBase64 ? 0 : 200;
  setTimeout(() => {
    isLoading.value = false;
  }, delay);
};

const handleImageError = () => {
  setTimeout(() => {
    imageError.value = true;
    isLoading.value = false;
  }, 300);
};

onMounted(() => {
  imageError.value = false;
  const isBase64 = props.bookmark.image?.startsWith('data:');
  isLoading.value = !!props.bookmark.image && !isBase64;
});
</script>
