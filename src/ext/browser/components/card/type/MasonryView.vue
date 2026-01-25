<template>
  <div class="group relative">
    <!-- Animated border background -->
    <div
      :class="['animated-gradient absolute -inset-0.5 rounded-lg bg-gradient-to-r opacity-0 transition-all duration-500 group-hover:opacity-60', randomGradient]"
    />
    <!-- Glow effect -->
    <div
      :class="['glow-effect absolute -inset-2 opacity-0 blur-lg transition-all duration-300 group-hover:opacity-50 dark:group-hover:opacity-100', glowClass]"
    />
    <div
      class="group relative mb-1 min-h-[60px] sm:min-h-[80px] w-full overflow-hidden rounded-md border border-solid border-gray-100 bg-white shadow-sm hover:[box-shadow:0px_0px_0px_1px_rgba(233,_226,_238,_0.253)] dark:border-neutral-900 dark:bg-neutral-950 dark:shadow-sm dark:hover:[box-shadow:0px_0px_0px_1px_rgba(233,_226,_238,_0.253)] sm:mb-2 md:mb-3"
    >
      <a
        :href="bookmark.url"
        rel="noopener noreferrer"
        target="_blank"
      >
        <!-- image -->
        <div
          class="flex w-full items-center justify-center relative"
          :class="{
            'min-h-[80px] sm:min-h-[120px]': !bookmark.image || imageError,
            'min-h-[60px] sm:min-h-[80px]': bookmark.image && !imageError
          }"
          :style="(!bookmark.image || imageError) ? placeholder : null"
        >
          <img
            v-if="bookmark.image && !imageError"
            :key="bookmark.id"
            :src="String(bookmark.image)"
            :alt="bookmark.title"
            class="max-h-full max-w-full object-cover transition-all duration-700 ease-out relative"
            :class="{ 'opacity-0': imageLoading }"
            @loadstart="imageLoading = true; imageError = false"
            @load="imageLoading = false"
            @error="onImageError"
          >
          <div
            v-if="imageLoading && bookmark.image && !imageError"
            class="absolute inset-0 flex items-center justify-center z-10"
          >
            <AppSpinner />
          </div>
          <div
            v-if="!bookmark.image || imageError"
            class="relative flex size-full items-center justify-center overflow-hidden min-w-0"
          >
            <div class="relative z-0 flex flex-col items-center p-6 w-full min-w-0">

              <div
                class="group relative flex aspect-square size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/50 dark:border-white/10 bg-white/20 dark:bg-white/5 shadow-lg backdrop-blur-xl mb-4"
              >
                <BookmarkFavicon
                  :bookmark="bookmark"
                  class="relative z-10 max-h-8 max-w-8 rounded-sm object-contain"
                />
              </div>

              <div class="text-center w-full min-w-0">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-200 truncate px-1">
                  {{ bookmark.domain || bookmark.title }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  No preview available
                </p>
              </div>

            </div>
          </div>
        </div>
        <!-- end image -->

        <div class="p-2 sm:p-3">
          <h1 class="break-words text-sm text-black dark:text-white line-clamp-3">{{ bookmark.title }}</h1>
          <p class="break-words py-2 text-xs text-gray-700 dark:text-neutral-500">
            {{ bookmark.description }}
          </p>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span class="flex items-center gap-1 text-xs text-gray-400 dark:text-neutral-500 min-w-0 truncate">
              <BookmarkFavicon
                :bookmark="bookmark"
                class="size-4 shrink-0"
              />
              <span class="truncate">{{ bookmark.domain }}</span>
            </span>
            <span
              v-if="bookmark.dateAdded"
              class="flex items-center text-xs text-gray-400 dark:text-neutral-500 whitespace-nowrap"
            >
              <PhCalendarBlank class="text-xs mr-1 align-text-bottom text-gray-400 dark:text-neutral-500 shrink-0" />
              {{ new Date(bookmark.dateAdded).toISOString().slice(0, 10) }}
            </span>
          </div>
          <div
            v-if="bookmark.tags && bookmark.tags.length"
            class="mt-5 flex flex-wrap gap-1"
          >
            <AppBadge
              v-for="(value, key) in bookmark.tags"
              :key="key"
            >
              {{ value }}
            </AppBadge>
          </div>
        </div>
      </a>
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AppBadge from '@/components/app/AppBadge.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';
import BookmarkFavicon from '@/ext/browser/components/BookmarkFavicon.vue';
import useColorExtraction from '@/composables/useColorExtraction';
import PhCalendarBlank from '~icons/ph/calendar-blank';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const imageError = ref(false);
const imageLoading = ref(true);
const { placeholder, extract } = useColorExtraction();
const faviconUrl = `https://icons.duckduckgo.com/ip3/${props.bookmark.domain}.ico`;
const cacheKey = `fav_${props.bookmark.domain}`;
const onImageError = async () => {
  imageError.value = true;
  imageLoading.value = false;
  extract(faviconUrl, cacheKey);
};

onMounted(async () => {
  if (!props.bookmark.image) {
    imageLoading.value = false;
    extract(faviconUrl, cacheKey);
  }
});
const gradientClasses = [
  'gradient-cyan-blue',
  'gradient-indigo-violet',
  'gradient-sky-cyan',
  'gradient-amber-orange',
  'gradient-rose-pink',
  'gradient-emerald-teal',
  'gradient-purple-fuchsia',
  'gradient-violet-purple',
  'gradient-blue-cyan',
  'gradient-pink-rose',
];

const randomGradient = computed(() => gradientClasses[Math.floor(Math.random() * gradientClasses.length)]);

const glowClass = computed(() => `glow-${randomGradient.value.replace('gradient-', '')}`);
</script>

<style scoped>
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.group:hover .animated-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 4s ease-in-out infinite;
}

/* Gradient classes with full definitions */
.gradient-cyan-blue {
  background: linear-gradient(to right, #22d3ee, #93c5fd, #22d3ee);
}

.gradient-indigo-violet {
  background: linear-gradient(to right, #818cf8, #c4b5fd, #818cf8);
}

.gradient-sky-cyan {
  background: linear-gradient(to right, #0ea5e9, #22d3ee, #0ea5e9);
}

.gradient-amber-orange {
  background: linear-gradient(to right, #fbbf24, #fdba74, #fbbf24);
}

.gradient-rose-pink {
  background: linear-gradient(to right, #f43f5e, #f9a8d4, #f43f5e);
}

.gradient-emerald-teal {
  background: linear-gradient(to right, #10b981, #5eead4, #10b981);
}

.gradient-purple-fuchsia {
  background: linear-gradient(to right, #a855f7, #e879f9, #a855f7);
}

.gradient-violet-purple {
  background: linear-gradient(to right, #8b5cf6, #a855f7, #8b5cf6);
}

.gradient-blue-cyan {
  background: linear-gradient(to right, #3b82f6, #22d3ee, #3b82f6);
}

.gradient-pink-rose {
  background: linear-gradient(to right, #ec4899, #f43f5e, #ec4899);
}

/* Glow effect classes */
.glow-cyan-blue {
  background: radial-gradient(circle, rgba(34, 211, 238, 0.5) 0%, rgba(59, 130, 246, 0.5) 40%, rgba(34, 211, 238, 0.5) 70%, transparent 100%);
}

.glow-indigo-violet {
  background: radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(139, 92, 246, 0.5) 40%, rgba(99, 102, 241, 0.5) 70%, transparent 100%);
}

.glow-sky-cyan {
  background: radial-gradient(circle, rgba(14, 165, 233, 0.5) 0%, rgba(34, 211, 238, 0.5) 40%, rgba(14, 165, 233, 0.5) 70%, transparent 100%);
}

.glow-amber-orange {
  background: radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, rgba(251, 146, 60, 0.5) 40%, rgba(251, 191, 36, 0.5) 70%, transparent 100%);
}

.glow-rose-pink {
  background: radial-gradient(circle, rgba(244, 63, 94, 0.5) 0%, rgba(236, 72, 153, 0.5) 40%, rgba(244, 63, 94, 0.5) 70%, transparent 100%);
}

.glow-emerald-teal {
  background: radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(20, 184, 166, 0.5) 40%, rgba(16, 185, 129, 0.5) 70%, transparent 100%);
}

.glow-purple-fuchsia {
  background: radial-gradient(circle, rgba(147, 51, 234, 0.5) 0%, rgba(217, 70, 239, 0.5) 40%, rgba(147, 51, 234, 0.5) 70%, transparent 100%);
}

.glow-violet-purple {
  background: radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(147, 51, 234, 0.5) 40%, rgba(139, 92, 246, 0.5) 70%, transparent 100%);
}

.glow-blue-cyan {
  background: radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(34, 211, 238, 0.5) 40%, rgba(59, 130, 246, 0.5) 70%, transparent 100%);
}

.glow-pink-rose {
  background: radial-gradient(circle, rgba(236, 72, 153, 0.5) 0%, rgba(244, 63, 94, 0.5) 40%, rgba(236, 72, 153, 0.5) 70%, transparent 100%);
}
</style>
