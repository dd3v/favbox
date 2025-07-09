<template>
  <component
    :is="displayComponent"
    :key="bookmark.id"
    :bookmark="bookmark"
  >
    <template #actions>
      <div class="absolute right-2 top-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
        <div class="flex gap-x-2">
          <button
            v-tooltip.bottom-start="{ content: 'Delete'}"
            class="-translate-y-8 rounded-md bg-red-500 p-1.5 text-white opacity-100 shadow-md transition-transform delay-100 duration-150 ease-out group-hover:translate-y-2 group-hover:opacity-100"
            @click="$emit('onRemove', bookmark)"
          >
            <CarbonTrashCan class="size-4" />
          </button>
          <button
            v-tooltip.bottom-start="{ content: 'Take a screenshot'}"
            class="-translate-y-8 rounded-md bg-black p-1.5 text-white opacity-100 shadow-md transition-transform delay-100 duration-300 ease-out group-hover:translate-y-2 group-hover:opacity-100"
            @click="$emit('onScreenshot', bookmark)"
          >
            <CarbonDropPhoto class="size-4" />
          </button>
          <button
            v-tooltip.bottom-start="{ content: 'Pin bookmark'}"
            class="-translate-y-8 rounded-md p-1.5  text-white opacity-100 shadow-md transition-transform delay-100 duration-500 ease-out group-hover:translate-y-2 group-hover:opacity-100"
            :class="[
              bookmark.pinned === 0 ? 'bg-black' : 'bg-purple-500 '
            ]"
            @click="$emit('onPin', bookmark)"
          >
            <CarbonPin class="size-4" />
          </button>
          <button
            v-tooltip.bottom-start="{ content: 'Update bookmark'}"
            class="-translate-y-8  rounded-md bg-black p-1.5 text-white opacity-100 shadow-md transition-transform delay-100 duration-1000 ease-out group-hover:translate-y-2 group-hover:opacity-100"
            @click="$emit('onEdit', bookmark)"
          >
            <CarbonEdit class="size-4" />
          </button>
        </div>
      </div>
    </template>
  </component>
</template>
<script setup>
import { computed } from 'vue';
import CardView from '@/ext/browser/components/card/type/CardView.vue';
import ListView from '@/ext/browser/components/card/type/ListView.vue';
import MasonryView from '@/ext/browser/components/card/type/MasonryView.vue';

import CarbonTrashCan from '~icons/carbon/trash-can';
import CarbonDropPhoto from '~icons/carbon/drop-photo';
import CarbonPin from '~icons/carbon/pin';
import CarbonEdit from '~icons/carbon/edit';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
    default: () => {},
  },
  displayType: {
    type: String,
    required: true,
    default: 'masonry',
  },
});
defineEmits(['onRemove', 'onEdit', 'onPin', 'onScreenshot']);

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
