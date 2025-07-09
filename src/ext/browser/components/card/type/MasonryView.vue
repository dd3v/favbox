<template>
  <div class="group relative">
    <!-- Animated border background -->
    <div
      :class="[
        'animated-gradient absolute -inset-0.5 rounded-lg bg-gradient-to-r opacity-0 transition-all duration-500 group-hover:opacity-60',
        animatedBorderGradient
      ]"
    />
    <!-- Glow effect -->
    <div
      :class="[
        'absolute -inset-2 opacity-0 blur-lg transition-all duration-300 group-hover:opacity-50 dark:group-hover:opacity-100',
        glowGradient
      ]"
    />
    <div
      class="group relative mb-1 min-h-max w-full max-w-md overflow-hidden rounded-md border border-solid border-gray-100 bg-white shadow-sm hover:[box-shadow:0px_0px_0px_1px_rgba(233,_226,_238,_0.253)] dark:border-neutral-900 dark:bg-neutral-950 dark:shadow-sm dark:hover:[box-shadow:0px_0px_0px_1px_rgba(233,_226,_238,_0.253)] sm:mb-2 md:mb-3"
    >
      <a
        :href="bookmark.url"
        target="_blank"
      >
        <BookmarkImage :bookmark="bookmark">
          <template #loading>
            <AppSpinner />
          </template>
        </BookmarkImage>
        <div class="p-2">
          <h1 class="break-words text-sm text-black dark:text-white">{{ bookmark.title }}</h1>
          <p class="break-words py-2 text-xs text-gray-700 dark:text-neutral-500">
            {{ bookmark.description }}
          </p>
          <div class="flex items-center gap-2">
            <bookmark-favicon
              :bookmark="bookmark"
              class="size-4"
            />
            <span class="truncate text-xs font-thin text-gray-700 dark:text-neutral-500">
              {{ bookmark.domain }}
            </span>
          </div>
          <div class="mt-2.5 flex flex-wrap gap-1">
            <app-badge
              v-for="(value, key) in bookmark.tags"
              :key="key"
            >
              {{ value }}
            </app-badge>
          </div>
        </div>
      </a>
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppBadge from '@/components/app/AppBadge.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';
import BookmarkImage from '@/ext/browser/components/card/BookmarkImage.vue';
import BookmarkFavicon from '@/ext/browser/components/BookmarkFavicon.vue';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const gradientStyles = [
  {
    border: 'from-cyan-400 via-blue-300 to-cyan-400',
    glow: 'glow-cyan-blue',
  },
  {
    border: 'from-indigo-400 via-violet-300 to-indigo-400',
    glow: 'glow-indigo-violet',
  },
  {
    border: 'from-sky-400 via-cyan-300 to-sky-400',
    glow: 'glow-sky-cyan',
  },
  {
    border: 'from-amber-400 via-orange-300 to-amber-400',
    glow: 'glow-amber-orange',
  },
  {
    border: 'from-rose-400 via-pink-300 to-rose-400',
    glow: 'glow-rose-pink',
  },
  {
    border: 'from-emerald-400 via-teal-300 to-emerald-400',
    glow: 'glow-emerald-teal',
  },
  {
    border: 'from-purple-400 via-fuchsia-300 to-purple-400',
    glow: 'glow-purple-fuchsia',
  },
  {
    border: 'from-violet-400 via-purple-300 to-violet-400',
    glow: 'glow-violet-purple',
  },
  {
    border: 'from-blue-500 via-cyan-400 to-blue-500',
    glow: 'glow-blue-cyan',
  },
  {
    border: 'from-pink-400 via-rose-300 to-pink-400',
    glow: 'glow-pink-rose',
  },
];

const selectedStyle = ref(gradientStyles[Math.floor(Math.random() * gradientStyles.length)]);
const animatedBorderGradient = ref(selectedStyle.value.border);
const glowGradient = ref(selectedStyle.value.glow);
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
