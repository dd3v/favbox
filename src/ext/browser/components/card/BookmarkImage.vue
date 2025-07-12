<template>
  <div
    class="flex w-full items-center justify-center relative"
    :class="{
      'min-h-[80px] sm:min-h-[120px]': !bookmark.image,
      'min-h-[60px] sm:min-h-[80px]': bookmark.image && !isLoading && !imageError
    }"
  >
    <div
      v-if="bookmark.image && isLoading"
      class="flex size-full items-center justify-center py-8"
    >
      <slot
        name="loading"
      />
    </div>
    <img
      v-else-if="bookmark.image && !imageError"
      :key="`${bookmark.id}-${bookmark.image}`"
      :src="String(bookmark.image)"
      :alt="bookmark.title"
      class="max-h-full max-w-full object-cover transition-all duration-700 ease-out relative"
      :class="[{'blur-sm': isLoading, 'blur-0': !isLoading}, props.rounded]"
      @load="handleImageLoad"
      @error="handleImageError"
    >
    <div
      v-else
      class="relative flex size-full items-center justify-center overflow-hidden"
      :class="[backgroundClasses, props.rounded]"
    >
      <!-- Grid pattern for grid variant -->
      <div v-if="currentVariant === 'grid'" class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <!-- Default pattern for other variants -->
      <div v-else class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <div class="absolute bottom-0 right-0 size-32 translate-x-8 translate-y-8 rounded-full bg-white/10" />
      </div>

      <div class="relative z-0 flex flex-col items-center p-6">
        <div
          class="group relative flex aspect-square size-20 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-md backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-gray-50 hover:shadow-lg mb-4 dark:border-white/20 dark:bg-black/40 dark:shadow-xl dark:hover:bg-black/50 dark:hover:shadow-2xl"
          :class="props.rounded"
        >
          <!-- Favicon or fallback letter -->
          <img
            v-if="bookmark.favicon && !faviconError"
            :src="bookmark.favicon"
            :alt="bookmark.title"
            class="relative z-10 max-h-8 max-w-8 rounded-sm object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
            @error="handleFaviconError"
          >
          <div
            v-else
            class="relative z-10 flex size-10 items-center justify-center rounded-lg text-2xl font-bold text-gray-400 dark:text-white drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
            :class="fallbackClasses"
          >
            {{ fallbackLetter }}
          </div>
        </div>
        <div class="text-center">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ bookmark.domain || bookmark.title }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            No preview available
          </p>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
  rounded: {
    type: String,
    default: '',
  },
});

const imageError = ref(false);
const isLoading = ref(false);
const faviconError = ref(false);
const variantKeys = ['neutral', 'muted', 'subtle', 'soft', 'gentle', 'grid'];

const variants = {
  neutral: {
    background: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
    card: 'bg-white/40 backdrop-blur-md border border-white/30 dark:bg-gray-700/40 dark:border-gray-600/30',
    fallback: 'bg-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:to-black',
    text: 'text-gray-700 dark:text-gray-200',
  },
  muted: {
    background: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900',
    card: 'bg-white/40 backdrop-blur-md border border-white/30 dark:bg-slate-700/40 dark:border-slate-600/30',
    fallback: 'bg-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:to-black',
    text: 'text-slate-700 dark:text-slate-200',
  },
  subtle: {
    background: 'bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900',
    card: 'bg-white/40 backdrop-blur-md border border-white/30 dark:bg-zinc-700/40 dark:border-zinc-600/30',
    fallback: 'bg-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:to-black',
    text: 'text-zinc-700 dark:text-zinc-200',
  },
  soft: {
    background: 'bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900',
    card: 'bg-white/40 backdrop-blur-md border border-white/30 dark:bg-stone-700/40 dark:border-stone-600/30',
    fallback: 'bg-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:to-black',
    text: 'text-stone-700 dark:text-stone-200',
  },
  gentle: {
    background: 'bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900',
    card: 'bg-white/40 backdrop-blur-md border border-white/30 dark:bg-neutral-700/40 dark:border-neutral-600/30',
    fallback: 'bg-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:to-black',
    text: 'text-neutral-700 dark:text-neutral-200',
  },
  grid: {
    background: 'bg-white dark:bg-black',
    card: 'bg-white/40 backdrop-blur-md border border-white/30 dark:bg-gray-800/40 dark:border-gray-600/30',
    fallback: 'bg-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:to-black',
    text: 'text-gray-700 dark:text-gray-200',
  },
};

const currentVariant = ref('neutral');

watch(() => props.bookmark.image, (newImage, oldImage) => {
  if (newImage !== oldImage) {
    imageError.value = false;
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

const handleFaviconError = () => {
  faviconError.value = true;
};

const backgroundClasses = computed(() => variants[currentVariant.value].background);
const fallbackClasses = computed(() => variants[currentVariant.value].fallback);

const fallbackLetter = computed(() => {
  const title = props.bookmark.domain || props.bookmark.title;
  if (!title) return '?';
  return title.charAt(0).toUpperCase();
});

onMounted(() => {
  imageError.value = false;
  faviconError.value = false;
  currentVariant.value = variantKeys[Math.floor(Math.random() * variantKeys.length)];
  const isBase64 = props.bookmark.image?.startsWith('data:');
  isLoading.value = !!props.bookmark.image && !isBase64;
});
</script>
