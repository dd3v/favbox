<template>
  <component :is="displayComponent" :bookmark="bookmark" :key="bookmark.id">
    <template v-slot:actions>
      <div class="invisible absolute top-2 right-2 group-hover:visible">
        <button
          @click="$emit('remove', bookmark)"
          class="m-1 rounded-full bg-rose-400 p-1.5 text-white shadow-lg transition duration-150 ease-in-out hover:shadow-lg focus:bg-rose-400 focus:shadow-lg focus:ring-0"
        >
          <trash-icon class="h-4 w-4" />
        </button>
        <button
          v-if="article"
          @click="$emit('preview', bookmark)"
          class="m-1 rounded-full bg-gray-800 p-1.5 text-white shadow-lg transition duration-150 ease-in-out hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:ring-0"
        >
          <newspaper-icon class="h-4 w-4" />
        </button>
        <button
          @click="$emit('edit', bookmar)"
          class="m-1 rounded-full bg-gray-800 p-1.5 text-white shadow-lg transition duration-150 ease-in-out hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:ring-0"
        >
          <pencil-square-icon class="h-4 w-4" />
        </button>
      </div>
    </template>
  </component>
</template>
<script setup>
import CardView from '@/components/bookmark/views/CardView.vue';
import MasonryView from '@/components/bookmark/views/MasonryView.vue';
import ListView from '@/components/bookmark/views/ListView.vue';
import { NewspaperIcon, TrashIcon, PencilSquareIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';

const props = defineProps({
  bookmark: {
    type: Object,
    requred: true,
  },
  displayType: {
    type: String,
    requred: true,
  },
});
defineEmits(['remove', 'preview', 'edit']);

const article = computed({
  get: () => props.bookmark.type === 'article' || props.bookmark.type === 'blog',
});

const displayComponent = computed({
  get: () => {
    switch (props.displayType) {
      case 'card':
        return CardView;
      case 'list':
        return ListView;
      case 'masonry':
        return MasonryView;
      default:
        return MasonryView;
    }
  },
});
</script>
