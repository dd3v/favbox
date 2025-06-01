<template>
  <div class="group relative">
    <!-- Animated border background -->
    <div
      :class="[
        'absolute -inset-0.5 rounded-lg bg-gradient-to-r opacity-0 transition duration-500 group-hover:opacity-60',
        animatedBorderGradient
      ]"
    />
    <!-- Glow effect -->
    <div
      :class="[
        'absolute -inset-2 bg-black/10 opacity-0 blur-lg transition-all duration-300 hover:border-none group-hover:opacity-50 dark:z-0 dark:bg-white/10 dark:group-hover:opacity-100',
        gradient
      ]"
    />
    <div
      class="group relative mb-3 min-h-max w-full max-w-md overflow-hidden rounded-md border border-solid border-gray-100 bg-white shadow-sm hover:[box-shadow:0px_0px_0px_1px_rgba(233,_226,_238,_0.253)] dark:border-neutral-900 dark:bg-neutral-950 dark:shadow-sm dark:hover:[box-shadow:0px_0px_0px_1px_rgba(233,_226,_238,_0.253)]"
    >
      <a
        :href="bookmark.url"
        target="_blank"
      >
        <bookmark-image :bookmark="bookmark" />
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
            <span class="truncate text-xs font-thin text-soft-900 dark:text-neutral-500">
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
import BookmarkImage from '@/ext/browser/components/card/BookmarkImage.vue';
import BookmarkFavicon from '@/ext/browser/components/BookmarkFavicon.vue';

defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});

const gradients = [
  'green-blue-pink', 'pink-orange-purple', 'purple-green-yellow', 'red-yellow-blue',
  'blue-purple-orange', 'orange-green-purple', 'green-pink-yellow', 'pink-blue-yellow',
  'purple-pink-blue', 'orange-blue-purple',
];

const animatedBorderGradients = [
  'from-gray-400 via-gray-100 to-gray-400',
  'from-slate-400 via-slate-200 to-slate-400',
  'from-cyan-400 via-blue-300 to-cyan-400',
  'from-indigo-400 via-violet-300 to-indigo-400',
  'from-sky-400 via-cyan-300 to-sky-400',
  'from-amber-400 via-orange-300 to-amber-400',
  'from-rose-400 via-pink-300 to-rose-400',
  'from-emerald-400 via-teal-300 to-emerald-400',
  'from-purple-400 via-fuchsia-300 to-purple-400',
  'from-lime-300 via-emerald-400 to-lime-300',
  'from-violet-400 via-purple-300 to-violet-400',
  'from-amber-500 via-yellow-300 to-amber-500',
  'from-blue-500 via-cyan-400 to-blue-500',
];

const gradient = ref(gradients[Math.floor(Math.random() * gradients.length)]);
const animatedBorderGradient = ref(animatedBorderGradients[Math.floor(Math.random() * animatedBorderGradients.length)]);
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

.group:hover div[class*="from-"] {
  background-size: 200% 200%;
  animation: gradient-shift 4s ease-in-out infinite;
}

.green-blue-pink {
  background: radial-gradient(circle, rgba(102, 255, 115, 0.3) 0%, rgba(102, 178, 255, 0.3) 40%, rgba(255, 102, 178, 0.3) 70%, transparent 100%);
}

.pink-orange-purple {
  background: radial-gradient(circle, rgba(255, 102, 178, 0.3) 0%, rgba(255, 178, 102, 0.3) 40%, rgba(178, 102, 255, 0.3) 70%, transparent 100%);
}

.purple-green-yellow {
  background: radial-gradient(circle, rgba(178, 102, 255, 0.3) 0%, rgba(102, 255, 178, 0.3) 40%, rgba(255, 255, 102, 0.3) 70%, transparent 100%);
}

.red-yellow-blue {
  background: radial-gradient(circle, rgba(255, 102, 102, 0.3) 0%, rgba(255, 255, 102, 0.3) 40%, rgba(102, 178, 255, 0.3) 70%, transparent 100%);
}

.blue-purple-orange {
  background: radial-gradient(circle, rgba(102, 204, 255, 0.3) 0%, rgba(204, 102, 255, 0.3) 40%, rgba(255, 204, 102, 0.3) 70%, transparent 100%);
}

.orange-green-purple {
  background: radial-gradient(circle, rgba(255, 153, 102, 0.3) 0%, rgba(102, 255, 153, 0.3) 40%, rgba(153, 102, 255, 0.3) 70%, transparent 100%);
}

.green-pink-yellow {
  background: radial-gradient(circle, rgba(102, 255, 204, 0.3) 0%, rgba(255, 102, 204, 0.3) 40%, rgba(204, 255, 102, 0.3) 70%, transparent 100%);
}

.pink-blue-yellow {
  background: radial-gradient(circle, rgba(255, 102, 255, 0.3) 0%, rgba(102, 255, 255, 0.3) 40%, rgba(255, 255, 102, 0.3) 70%, transparent 100%);
}

.purple-pink-blue {
  background: radial-gradient(circle, rgba(153, 102, 255, 0.3) 0%, rgba(255, 102, 153, 0.3) 40%, rgba(102, 255, 255, 0.3) 70%, transparent 100%);
}

.orange-blue-purple {
  background: radial-gradient(circle, rgba(255, 204, 102, 0.3) 0%, rgba(102, 204, 255, 0.3) 40%, rgba(204, 102, 255, 0.3) 70%, transparent 100%);
}
</style>
