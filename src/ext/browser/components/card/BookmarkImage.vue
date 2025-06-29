<template>
  <div
    class="size-full"
    :class="{ 'flex items-center justify-center': bookmark.image }"
  >
    <img
      v-if="bookmark.image"
      :key="bookmark.id"
      :src="String(bookmark.image || bookmark.favicon)"
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
      class="size-full"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ImagePlaceholder from '@/ext/browser/components/card/ImagePlaceholder.vue';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const showImage = ref(true);
const isLoading = ref(true);

const handleImageLoad = () => {
  setTimeout(() => {
    isLoading.value = false;
  }, 200);
};

const handleImageError = () => {
  setTimeout(() => {
    showImage.value = false;
    isLoading.value = false;
  }, 300);
};

onMounted(() => {
  isLoading.value = true;
  showImage.value = true;
});
</script>
