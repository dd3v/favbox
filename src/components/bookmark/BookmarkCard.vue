<template>
  <component
    :is="displayComponent"
    :key="bookmark.id"
    :bookmark="bookmark"
    :class="{ 'border-rose-400': bookmark.error }"
  >
    <template #actions>
      <div class="invisible absolute right-2 top-2 group-hover:visible">
        <button
          class="m-1 rounded-full bg-rose-400 p-1.5 text-white shadow-lg transition duration-150 ease-in-out hover:shadow-lg focus:bg-rose-400 focus:shadow-lg focus:ring-0"
          @click="$emit('remove', bookmark)"
        >
          <trash-icon class="h-4 w-4" />
        </button>
        <button
          class="m-1 rounded-full bg-gray-800 p-1.5 text-white shadow-lg transition duration-150 ease-in-out hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:ring-0"
          @click="$emit('preview', bookmark)"
        >
          <newspaper-icon class="h-4 w-4" />
        </button>
        <button
          class="m-1 rounded-full bg-gray-800 p-1.5 text-white shadow-lg transition duration-150 ease-in-out hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:ring-0"
          @click="$emit('edit', bookmark)"
        >
          <pencil-square-icon class="h-4 w-4" />
        </button>
      </div>
    </template>
  </component>
</template>
<script setup>
import {
  NewspaperIcon,
  TrashIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline';
import { computed } from 'vue';
import CardView from '@/components/bookmark/views/CardView.vue';
import MasonryView from '@/components/bookmark/views/MasonryView.vue';
import ListView from '@/components/bookmark/views/ListView.vue';

const props = defineProps({
  bookmark: {
    type: Object,
    requred: true,
    default: () => {},
  },
  displayType: {
    type: String,
    requred: true,
    default: 'masonry',
  },
});
defineEmits(['remove', 'preview', 'edit']);

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
