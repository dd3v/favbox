<template>
  <div
    v-if="showImage"
    class="flex items-center justify-center"
    :class="{'min-h-[132px]': !bookmark.image}"
  >
    <img
      :src="String(bookmark.image || bookmark.favicon)"
      :alt="bookmark.title"
      class="object-cover object-center"
      @error="showImage = false"
    >
  </div>
  <div
    v-else
    class="flex h-32 w-full items-center justify-center"
    :class="gradient"
  >
    <span
      class="p-3 drop-shadow-lg"
      style="font-size: calc(0.4rem + 1vw);"
    >{{ title }}</span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});
const showImage = ref(true);
const title = computed({
  get: () => {
    if (props.bookmark.title.length > 65) {
      return `${props.bookmark.title.slice(0, 65)}...`;
    }
    return props.bookmark.title;
  },
});
const gradients = [
  'bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] text-white',
  'bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] text-black',
];
const gradient = computed({
  get: () => gradients[Math.floor(Math.random() * gradients.length)],
});
</script>
