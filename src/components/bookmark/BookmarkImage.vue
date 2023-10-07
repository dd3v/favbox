<template>
  <div
    v-if="showImage"
    class="flex items-center justify-center"
    :class="{'min-h-[132px]': !bookmark.image}"
  >
    <v-lazy-image
      :src="String(bookmark.image || bookmark.favicon)"
      :alt="bookmark.title"
      class="object-cover object-center"
      @error="showImage = false"
    />
  </div>
  <div
    v-else
    class="flex h-32 w-full items-center justify-center"
    :class="gradient"
  >
    <span :class="`p-3 drop-shadow-lg text-white ${fontSize}`">{{ title }}</span>
  </div>
</template>

<script setup>
import VLazyImage from 'v-lazy-image';
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
  'bg-gradient-to-r from-purple-500 to-purple-900',
  'bg-gradient-to-r from-fuchsia-600 to-pink-600',
  'bg-gradient-to-r from-fuchsia-600 to-purple-600',
  'bg-gradient-to-r from-amber-500 to-pink-500',
  'bg-gradient-to-r from-pink-500 to-rose-500',
  'bg-gradient-to-r from-violet-400 to-pink-300',
  'bg-gradient-to-bl from-rose-400 to-rose-600',
];
const gradient = computed({
  get: () => gradients[Math.floor(Math.random() * gradients.length)],
});
const fontSize = computed({
  get: () => {
    console.warn(props.bookmark.title);
    if (props.bookmark.title.length < 20) {
      return 'text-4xl';
    } if (props.bookmark.title.length < 30) {
      return 'text-lg';
    }
    return 'text-sm';
  },
});
</script>
