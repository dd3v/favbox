<template>
  <component
    :is="displayComponent"
    :key="bookmark.id"
    :bookmark="bookmark"
  >
    <template #actions>
      <div class="absolute right-2 top-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
        <div class="flex space-x-2">
          <button
            v-tooltip="{ text: 'Delete', position: 'bottom', delay: 300 }"
            class="-translate-y-8 rounded-md bg-red-500 p-1.5 text-white opacity-100 shadow-md transition-transform delay-100 duration-150 ease-out group-hover:translate-y-2 group-hover:opacity-100"
            @click="$emit('remove', bookmark)"
          >
            <trash-icon class="size-4" />
          </button>
          <button
            v-tooltip="{ text: 'Take a screenshot', position: 'bottom', delay: 300 }"
            class="-translate-y-8 rounded-md bg-black p-1.5 text-white opacity-100 shadow-md transition-transform delay-100 duration-300 ease-out group-hover:translate-y-2 group-hover:opacity-100"
            @click="$emit('secreenshot', bookmark)"
          >
            <ScreenshotIcon class="size-4" />
          </button>
          <button
            v-tooltip="{ text: 'Pin bookmark', position: 'bottom', delay: 300 }"
            class="-translate-y-8 rounded-md  p-1.5 text-white opacity-100 shadow-md transition-transform delay-100 duration-500 ease-out group-hover:translate-y-2 group-hover:opacity-100"
            :class="[
              bookmark.pinned === 0 ? 'bg-black' : 'bg-purple-500 '
            ]"
            @click="$emit('pin', bookmark)"
          >
            <PinnedIcon class="size-4" />
          </button>
          <button
            v-tooltip="{ text: 'Similar bookmarks', position: 'bottom', delay: 300 }"
            class="-translate-y-8 rounded-md bg-black p-1.5 text-white opacity-100 shadow-md transition-transform  delay-100 duration-700 ease-out group-hover:translate-y-2 group-hover:opacity-100"
            @click="$emit('search', bookmark)"
          >
            <SearchIcon class="size-4" />
          </button>
          <button
            v-tooltip="{ text: 'Update', position: 'bottom', delay: 300 }"
            class="-translate-y-8 rounded-md bg-black p-1.5 text-white opacity-100 shadow-md transition-transform delay-100 duration-1000 ease-out group-hover:translate-y-2 group-hover:opacity-100"
            @click="$emit('edit', bookmark)"
          >
            <EditIcon class="size-4" />
          </button>
        </div>
      </div>
    </template>
  </component>
</template>
<script setup>
import TrashIcon from '@/components/icons/TrashIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import PinnedIcon from '@/components/icons/PinnedIcon.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';
import ScreenshotIcon from '@/components/icons/ScreenshotIcon.vue';
import { computed } from 'vue';
import CardView from '@/ext/browser/components/card/type/CardView.vue';
import ListView from '@/ext/browser/components/card/type/ListView.vue';
import MasonryView from '@/ext/browser/components/card/type/MasonryView.vue';

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
defineEmits(['remove', 'edit', 'pin']);

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
