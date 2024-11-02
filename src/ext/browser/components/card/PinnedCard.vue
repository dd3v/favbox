<template>
  <div
    v-motion-slide-visible-once-bottom
    class="group relative mb-3 min-h-max max-w-md rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
  >
    <div
      class="relative h-24 w-full rounded-t-lg bg-cover bg-center"
      :style="{ backgroundImage: `url(${bookmark.image})` }"
    >
      <div class="absolute inset-0 flex items-center rounded-t-lg bg-white/50 p-4 backdrop-blur-sm">
        <div class="text-black">
          <h1 class="text-sm font-semibold">
            {{ bookmark.title }}
          </h1>
          <p class="mt-1 flex items-center text-xs">
            <bookmark-favicon
              :bookmark="bookmark"
              class="mr-1 size-4 fill-current text-black"
            />
            <span>{{ bookmark.domain }}</span>
          </p>
        </div>
      </div>
    </div>
    <TextEditor v-model="bookmark.notes" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';
import BookmarkImage from '@/ext/browser/components/card/BookmarkImage.vue';
import TextEditor from '@/ext/browser/components/TextEditor.vue';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
});
const bookmark = computed({
  get: () => props.bookmark,
});
</script>
