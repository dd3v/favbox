<template>
  <div
    class="flex min-h-5 items-center justify-center p-8"
    :class="backgroundClasses"
  >
    <div
      class="w-full max-w-md rounded-lg p-8 text-center"
    >
      <div
        class="group relative mx-auto mb-6 flex aspect-square size-16 items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-white/20 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/25"
      >
        <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

        <div class="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/30 to-transparent" />

        <div class=" absolute inset-1 rounded-2xl from-white/15 via-transparent to-transparent" />

        <div class="relative z-10 flex items-center justify-center">
          <img
            v-if="favicon && !imageError"
            :src="favicon"
            :alt="title"
            class="max-h-6 max-w-6 rounded-sm object-contain drop-shadow-sm"
            @error="handleImageError"
          >
          <div
            v-else
            class="flex size-8 items-center justify-center rounded-lg text-xl font-bold text-white drop-shadow-sm"
            :class="fallbackClasses"
          >
            {{ fallbackLetter }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'organic-shapes.studio',
  },
  favicon: {
    type: String,
    default: '',
  },
});

const imageError = ref(false);
const randomVariant = ref('green');

const variantKeys = ['green', 'blue', 'purple', 'orange', 'pink'];

const variants = {
  green: {
    background: 'bg-gradient-to-br from-blue-50 to-green-200',
    card: 'bg-white/40 backdrop-blur-md border border-white/30',
    fallback: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    text: 'text-gray-700',
  },
  blue: {
    background: 'bg-gradient-to-br from-indigo-50 to-blue-200',
    card: 'bg-white/40 backdrop-blur-md border border-white/30',
    fallback: 'bg-gradient-to-br from-blue-400 to-blue-600',
    text: 'text-blue-800',
  },
  purple: {
    background: 'bg-gradient-to-br from-purple-50 to-violet-200',
    card: 'bg-white/40 backdrop-blur-md border border-white/30',
    fallback: 'bg-gradient-to-br from-purple-400 to-purple-600',
    text: 'text-purple-800',
  },
  orange: {
    background: 'bg-gradient-to-br from-orange-50 to-amber-200',
    card: 'bg-white/40 backdrop-blur-md border border-white/30',
    fallback: 'bg-gradient-to-br from-orange-400 to-orange-600',
    text: 'text-orange-800',
  },
  pink: {
    background: 'bg-gradient-to-br from-pink-50 to-rose-200',
    card: 'bg-white/40 backdrop-blur-md border border-white/30',
    fallback: 'bg-gradient-to-br from-pink-400 to-pink-600',
    text: 'text-pink-800',
  },
};

const getRandomVariant = () => {
  const randomIndex = Math.floor(Math.random() * variantKeys.length);
  return variantKeys[randomIndex];
};

onMounted(() => {
  randomVariant.value = getRandomVariant();
});

const backgroundClasses = computed(() => variants[randomVariant.value].background);
const fallbackClasses = computed(() => variants[randomVariant.value].fallback);

const fallbackLetter = computed(() => props.title.charAt(0).toUpperCase());

const handleImageError = () => {
  imageError.value = true;
};
</script>
