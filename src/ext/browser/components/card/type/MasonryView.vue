<template>
  <div class="group relative">
    <div :class="['absolute -inset-2 opacity-0 blur-lg transition-all duration-300 hover:border-none group-hover:opacity-50 dark:z-0 dark:group-hover:opacity-100', gradient]" />
    <div
      v-motion-slide-visible-once-bottom
      class="group relative mb-3 min-h-max w-full max-w-md overflow-hidden rounded-md border border-solid border-gray-100 bg-white shadow-sm hover:[box-shadow:0px_0px_0px_1px_rgba(233,_226,_238,_0.253)] dark:border-neutral-900 dark:bg-neutral-950"
    >
      <a
        :href="bookmark.url"
        target="_blank"
      >
        <bookmark-image :bookmark="bookmark" />
        <div class="flex items-center bg-black/80 p-1">
          <bookmark-favicon
            :bookmark="bookmark"
            class="size-4 fill-white"
          />
          <span class="mx-2 truncate text-xs font-thin text-white">
            {{ bookmark.domain }}
          </span>
        </div>
        <div class="px-1 py-2">
          <h1 class="break-words text-sm text-black dark:text-white">{{ bookmark.title }}</h1>
          <p class="break-words py-2 text-xs text-gray-700 dark:text-neutral-500">
            {{ bookmark.description }}
          </p>
          <div class="flex flex-wrap gap-1">
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

const gradient = ref(gradients[Math.floor(Math.random() * gradients.length)]);
</script>
<style scoped>
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
