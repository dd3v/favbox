<template>
  <div
    class="relative flex size-full items-center justify-center overflow-hidden rounded-t-md"
    :class="backgroundClasses"
  >
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
      <div class="absolute bottom-0 right-0 size-32 translate-x-8 translate-y-8 rounded-full bg-white/10" />
    </div>

    <div class="relative z-0 flex flex-col items-center gap-y-4 p-6">
      <div
        class="group relative flex aspect-square size-20 items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-white/20 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/25 hover:shadow-lg"
      >
        <img
          v-if="favicon && !faviconError"
          :src="favicon"
          :alt="title"
          class="max-h-8 max-w-8 rounded-sm object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
          @error="handleFaviconError"
        >
        <div
          v-else
          class="flex size-10 items-center justify-center rounded-lg text-2xl font-bold text-white drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
          :class="fallbackClasses"
        >
          {{ fallbackLetter }}
        </div>
      </div>
      <div class="text-center">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ title }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          No preview available
        </p>
      </div>
    </div>
    <div class="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5" />
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
  bookmarkId: {
    type: [String, Number],
    default: null,
  },
});

const faviconError = ref(false);
const variantKeys = ['neutral', 'muted', 'subtle', 'soft', 'gentle'];

const variants = {
  neutral: {
    background: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
    card: 'bg-white/40 backdrop-blur-md border border-white/30 dark:bg-gray-700/40 dark:border-gray-600/30',
    fallback: 'bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700',
    text: 'text-gray-700 dark:text-gray-200',
  },
  muted: {
    background: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900',
    card: 'bg-white/40 backdrop-blur-md border border-white/30 dark:bg-slate-700/40 dark:border-slate-600/30',
    fallback: 'bg-gradient-to-br from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700',
    text: 'text-slate-700 dark:text-slate-200',
  },
  subtle: {
    background: 'bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900',
    card: 'bg-white/40 backdrop-blur-md border border-white/30 dark:bg-zinc-700/40 dark:border-zinc-600/30',
    fallback: 'bg-gradient-to-br from-zinc-400 to-zinc-600 dark:from-zinc-500 dark:to-zinc-700',
    text: 'text-zinc-700 dark:text-zinc-200',
  },
  soft: {
    background: 'bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900',
    card: 'bg-white/40 backdrop-blur-md border border-white/30 dark:bg-stone-700/40 dark:border-stone-600/30',
    fallback: 'bg-gradient-to-br from-stone-400 to-stone-600 dark:from-stone-500 dark:to-stone-700',
    text: 'text-stone-700 dark:text-stone-200',
  },
  gentle: {
    background: 'bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900',
    card: 'bg-white/40 backdrop-blur-md border border-white/30 dark:bg-neutral-700/40 dark:border-neutral-600/30',
    fallback: 'bg-gradient-to-br from-neutral-400 to-neutral-600 dark:from-neutral-500 dark:to-neutral-700',
    text: 'text-neutral-700 dark:text-neutral-200',
  },
};

const currentVariant = ref('neutral');

onMounted(() => {
  currentVariant.value = variantKeys[Math.floor(Math.random() * variantKeys.length)];
  faviconError.value = false;
});

const backgroundClasses = computed(() => variants[currentVariant.value].background);
const fallbackClasses = computed(() => variants[currentVariant.value].fallback);

const fallbackLetter = computed(() => {
  if (!props.title) return '?';
  return props.title.charAt(0).toUpperCase();
});

const handleFaviconError = () => {
  faviconError.value = true;
};
</script>
