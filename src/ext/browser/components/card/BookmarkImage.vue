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
      :class="props.rounded"
      @load="() => isLoading = false"
      @error="handleImageError"
    >
    <div
      v-else
      class="relative flex size-full items-center justify-center overflow-hidden"
      :class="[selectedPattern, props.rounded]"
    >
      <div class="relative z-0 flex flex-col items-center p-6">
        <div
          class="group relative flex aspect-square size-20 items-center justify-center overflow-hidden rounded-2xl border border-white/50 dark:border-white/10 bg-white/20 dark:bg-white/5 shadow-xl backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/30 dark:hover:bg-white/10 hover:shadow-2xl mb-4"
          :class="props.rounded"
          style="backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%);"
        >
          <!-- Favicon or fallback letter -->
          <img
            v-if="faviconUrl"
            :src="faviconUrl"
            :alt="bookmark.title"
            class="relative z-10 max-h-8 max-w-8 rounded-sm object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
            @error="handleFaviconError"
          >
          <div
            v-else
            class="relative z-10 flex size-10 items-center justify-center rounded-lg text-2xl font-bold text-gray-400 dark:text-white drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
          >
            {{ fallbackLetter }}
          </div>
        </div>
        <div class="text-center">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-2">
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
import { ref, onMounted, computed } from 'vue';

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
const originalFailed = ref(false);
const fallbackFailed = ref(false);

const patterns = [
  // grid
  'bg-white dark:bg-black bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]',
  // dots
  'bg-white dark:bg-black bg-[radial-gradient(circle,rgba(79,79,79,0.18)_1.5px,transparent_1.5px)] bg-[size:18px_18px]',
  // gradients - dark theme with black emphasis
  'bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 dark:from-black dark:via-black dark:to-black',
  'bg-gradient-to-tr from-yellow-100 via-pink-100 to-blue-200 dark:from-black dark:via-zinc-950 dark:to-black',
  'bg-gradient-to-b from-white to-gray-200 dark:from-black dark:via-black dark:to-black',
  'bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-black dark:via-neutral-950 dark:to-black',
  // subtle dark gradients
  'bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 dark:from-black dark:via-slate-950 dark:to-black',
  'bg-gradient-to-tr from-yellow-100 via-pink-100 to-blue-200 dark:from-black dark:via-zinc-950 dark:to-black',
];

const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];

const handleImageError = () => {
  imageError.value = true;
  isLoading.value = false;
};

const faviconUrl = computed(() => {
  if (props.bookmark.favicon && !originalFailed.value) {
    return props.bookmark.favicon;
  }

  if (!fallbackFailed.value && props.bookmark.domain) {
    return `https://icons.duckduckgo.com/ip3/${encodeURIComponent(props.bookmark.domain)}.ico`;
  }

  return null;
});

const fallbackLetter = computed(() => {
  const title = props.bookmark.domain || props.bookmark.title;
  if (!title) return '?';
  return title.charAt(0).toUpperCase();
});

const handleFaviconError = () => {
  if (!originalFailed.value) {
    originalFailed.value = true;
  } else {
    fallbackFailed.value = true;
  }
};

onMounted(() => {
  imageError.value = false;
  originalFailed.value = false;
  fallbackFailed.value = false;
  isLoading.value = !!props.bookmark.image && !props.bookmark.image?.startsWith('data:');
});
</script>
