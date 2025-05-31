<template>
  <div
    v-if="showImage"
    class="flex items-center justify-center"
    :class="{ 'min-h-[132px]': !bookmark.image }"
  >
    <img
      v-if="bookmark.image || bookmark.favicon"
      :key="bookmark.id"
      :src="String(bookmark.image || bookmark.favicon)"
      :alt="bookmark.title"
      class="max-h-full max-w-full transition-all duration-700 ease-out"
      :class="{
        'object-cover': bookmark.image,
        'object-contain p-2': !bookmark.image && bookmark.favicon,
        'blur-sm': isLoading,
        'blur-0': !isLoading
      }"
      @load="handleImageLoad"
      @error="handleImageError"
    >
  </div>
  <div
    v-else
    class="flex h-32 w-full items-center justify-center"
    :class="gradient"
  />
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const showImage = ref(true);
const isLoading = ref(true);

const gradients = [
  'bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] text-white',
  'bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] text-black',
];

const gradient = computed(() => gradients[Math.floor(Math.random() * gradients.length)]);

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
