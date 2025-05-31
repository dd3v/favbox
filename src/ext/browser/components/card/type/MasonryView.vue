<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <div class="group relative">
    <!-- Main gradient background on hover -->
    <div
      :class="[
        'duration-400 absolute -inset-1.5 rounded-xl opacity-0 blur-lg transition-all ease-out group-hover:opacity-40 group-hover:blur-xl dark:group-hover:opacity-50',
        gradient
      ]"
    />

    <!-- Subtle inner gradient for enhanced effect -->
    <div
      :class="[
        'absolute -inset-0.5 rounded-lg opacity-0 blur-sm transition-all duration-300 ease-out group-hover:opacity-25 group-hover:blur-md',
        `${gradient}-inner`
      ]"
    />

    <!-- Animated border -->
    <div
      :class="[
        'duration-400 absolute -inset-0.5 rounded-lg opacity-0 transition-all ease-out group-hover:opacity-50',
        `${gradient}-border`
      ]"
    />

    <div
      v-motion-slide-visible-once-bottom
      class="group relative mb-3 min-h-max w-full max-w-md overflow-hidden rounded-md border border-solid border-gray-100 bg-white shadow-sm transition-all duration-300 ease-out hover:scale-[1.015] hover:border-transparent hover:shadow-lg hover:shadow-purple-500/5 dark:border-neutral-900 dark:bg-neutral-950 dark:shadow-sm dark:hover:shadow-lg dark:hover:shadow-purple-500/10"
    >
      <a
        :href="bookmark.url"
        target="_blank"
      >
        <bookmark-image :bookmark="bookmark" />
        <div class="relative z-10 p-2">
          <h1 class="break-words text-sm text-black transition-colors duration-200 group-hover:text-purple-900 dark:text-white dark:group-hover:text-purple-100">{{ bookmark.title }}</h1>
          <p class="break-words py-2 text-xs text-gray-700 transition-colors duration-200 group-hover:text-gray-600 dark:text-neutral-500 dark:group-hover:text-neutral-400">
            {{ bookmark.description }}
          </p>
          <div class="flex items-center gap-2">
            <bookmark-favicon
              :bookmark="bookmark"
              class="size-4 transition-transform duration-200 group-hover:scale-110"
            />
            <span class="truncate text-xs font-thin text-soft-900 transition-colors duration-200 group-hover:text-gray-600 dark:text-neutral-500 dark:group-hover:text-neutral-400">
              {{ bookmark.domain }}
            </span>
          </div>
          <div class="mt-2.5 flex flex-wrap gap-1">
            <app-badge
              v-for="(value, key) in bookmark.tags"
              :key="key"
              class="transition-all duration-200 group-hover:scale-105"
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
import BookmarkImage from '@/ext/browser/components/card/BookmarkImage.vue';
import BookmarkFavicon from '@/ext/browser/components/BookmarkFavicon.vue';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const gradients = [
  'aurora', 'cosmic', 'ocean', 'sunset', 'forest', 'neon', 'rainbow', 'fire', 'ice', 'galaxy',
];

const gradient = ref(gradients[Math.floor(Math.random() * gradients.length)]);
</script>

<style scoped>
/* Main gradients with reduced spread */
.aurora {
  background: radial-gradient(ellipse at center, rgba(96, 165, 250, 0.3) 0%, rgba(168, 85, 247, 0.25) 40%, rgba(236, 72, 153, 0.2) 70%, transparent 90%);
}

.cosmic {
  background: radial-gradient(ellipse at center, rgba(147, 51, 234, 0.35) 0%, rgba(79, 70, 229, 0.3) 35%, rgba(236, 72, 153, 0.25) 60%, transparent 85%);
}

.ocean {
  background: radial-gradient(ellipse at center, rgba(6, 182, 212, 0.35) 0%, rgba(59, 130, 246, 0.3) 40%, rgba(168, 85, 247, 0.25) 70%, transparent 90%);
}

.sunset {
  background: radial-gradient(ellipse at center, rgba(251, 146, 60, 0.35) 0%, rgba(239, 68, 68, 0.3) 40%, rgba(236, 72, 153, 0.25) 70%, transparent 90%);
}

.forest {
  background: radial-gradient(ellipse at center, rgba(34, 197, 94, 0.35) 0%, rgba(132, 204, 22, 0.3) 40%, rgba(251, 191, 36, 0.25) 70%, transparent 90%);
}

.neon {
  background: radial-gradient(ellipse at center, rgba(236, 72, 153, 0.4) 0%, rgba(168, 85, 247, 0.35) 35%, rgba(6, 182, 212, 0.25) 65%, transparent 85%);
}

.rainbow {
  background: radial-gradient(ellipse at center, rgba(239, 68, 68, 0.25) 0%, rgba(251, 146, 60, 0.25) 20%, rgba(251, 191, 36, 0.25) 40%, rgba(34, 197, 94, 0.25) 60%, rgba(6, 182, 212, 0.25) 80%, transparent 95%);
}

.fire {
  background: radial-gradient(ellipse at center, rgba(239, 68, 68, 0.4) 0%, rgba(251, 146, 60, 0.35) 40%, rgba(251, 191, 36, 0.25) 70%, transparent 90%);
}

.ice {
  background: radial-gradient(ellipse at center, rgba(6, 182, 212, 0.35) 0%, rgba(59, 130, 246, 0.3) 40%, rgba(168, 85, 247, 0.25) 70%, transparent 90%);
}

.galaxy {
  background: radial-gradient(ellipse at center, rgba(30, 41, 59, 0.4) 0%, rgba(88, 28, 135, 0.35) 35%, rgba(147, 51, 234, 0.25) 65%, transparent 85%);
}

/* Inner gradients for enhanced effect */
.aurora-inner {
  background: linear-gradient(45deg, rgba(96, 165, 250, 0.15) 0%, rgba(168, 85, 247, 0.12) 50%, rgba(236, 72, 153, 0.1) 100%);
}

.cosmic-inner {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.18) 0%, rgba(79, 70, 229, 0.15) 50%, rgba(236, 72, 153, 0.12) 100%);
}

.ocean-inner {
  background: linear-gradient(45deg, rgba(6, 182, 212, 0.18) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(168, 85, 247, 0.12) 100%);
}

.sunset-inner {
  background: linear-gradient(45deg, rgba(251, 146, 60, 0.18) 0%, rgba(239, 68, 68, 0.15) 50%, rgba(236, 72, 153, 0.12) 100%);
}

.forest-inner {
  background: linear-gradient(45deg, rgba(34, 197, 94, 0.18) 0%, rgba(132, 204, 22, 0.15) 50%, rgba(251, 191, 36, 0.12) 100%);
}

.neon-inner {
  background: linear-gradient(45deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.18) 50%, rgba(6, 182, 212, 0.15) 100%);
}

.rainbow-inner {
  background: linear-gradient(45deg, rgba(239, 68, 68, 0.12) 0%, rgba(251, 191, 36, 0.12) 33%, rgba(34, 197, 94, 0.12) 66%, rgba(168, 85, 247, 0.12) 100%);
}

.fire-inner {
  background: linear-gradient(45deg, rgba(239, 68, 68, 0.2) 0%, rgba(251, 146, 60, 0.18) 50%, rgba(251, 191, 36, 0.15) 100%);
}

.ice-inner {
  background: linear-gradient(45deg, rgba(6, 182, 212, 0.18) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(168, 85, 247, 0.12) 100%);
}

.galaxy-inner {
  background: linear-gradient(45deg, rgba(30, 41, 59, 0.2) 0%, rgba(88, 28, 135, 0.18) 50%, rgba(147, 51, 234, 0.15) 100%);
}

/* Subtle animated borders */
.aurora-border {
  background: linear-gradient(90deg, rgba(96, 165, 250, 0.4), rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4), rgba(96, 165, 250, 0.4));
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite;
}

.cosmic-border {
  background: linear-gradient(90deg, rgba(147, 51, 234, 0.4), rgba(79, 70, 229, 0.4), rgba(236, 72, 153, 0.4), rgba(147, 51, 234, 0.4));
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite;
}

.ocean-border {
  background: linear-gradient(90deg, rgba(6, 182, 212, 0.4), rgba(59, 130, 246, 0.4), rgba(168, 85, 247, 0.4), rgba(6, 182, 212, 0.4));
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite;
}

.sunset-border {
  background: linear-gradient(90deg, rgba(251, 146, 60, 0.4), rgba(239, 68, 68, 0.4), rgba(236, 72, 153, 0.4), rgba(251, 146, 60, 0.4));
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite;
}

.forest-border {
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.4), rgba(132, 204, 22, 0.4), rgba(251, 191, 36, 0.4), rgba(34, 197, 94, 0.4));
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite;
}

.neon-border {
  background: linear-gradient(90deg, rgba(236, 72, 153, 0.5), rgba(168, 85, 247, 0.5), rgba(6, 182, 212, 0.5), rgba(236, 72, 153, 0.5));
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

.rainbow-border {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.4), rgba(251, 146, 60, 0.4), rgba(251, 191, 36, 0.4), rgba(34, 197, 94, 0.4), rgba(6, 182, 212, 0.4), rgba(59, 130, 246, 0.4), rgba(168, 85, 247, 0.4));
  background-size: 300% 300%;
  animation: gradientShift 5s ease infinite;
}

.fire-border {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.5), rgba(251, 146, 60, 0.5), rgba(251, 191, 36, 0.4), rgba(239, 68, 68, 0.5));
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

.ice-border {
  background: linear-gradient(90deg, rgba(6, 182, 212, 0.4), rgba(59, 130, 246, 0.4), rgba(168, 85, 247, 0.4), rgba(6, 182, 212, 0.4));
  background-size: 200% 200%;
  animation: gradientShift 4.5s ease infinite;
}

.galaxy-border {
  background: linear-gradient(90deg, rgba(30, 41, 59, 0.4), rgba(88, 28, 135, 0.4), rgba(147, 51, 234, 0.4), rgba(30, 41, 59, 0.4));
  background-size: 200% 200%;
  animation: gradientShift 5s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
