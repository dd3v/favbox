<template>
  <form
    @submit.prevent="submit"
  >
    <div class="flex flex-col gap-y-3">
      <label
        for="title"
        class="relative"
      >
        <input
          id="title"
          v-model="bookmarkTitle"
          required
          type="text"
          placeholder="Page title"
          class="h-9 w-full rounded-md border-gray-200 pl-10 text-xs text-black shadow-sm outline-none focus:border-gray-300 focus:ring-0  dark:border-neutral-800 dark:bg-neutral-900 dark:text-white focus:dark:border-neutral-700"
        >
        <div class="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-content-center text-gray-700">
          <img
            v-if="favicon"
            class="size-5"
            :src="favicon"
            alt="favicon"
          >
          <PhGlobeSimpleLight
            v-else
            class="size-5"
          />
        </div>
      </label>
      <Treeselect
        v-model="selectedFolder"
        placeholder=""
        :before-clear-all="onBeforeClearAll"
        :always-open="false"
        :options="folders"
      />
      <AppTagInput
        v-model="selectedTags"
        :max="5"
        :suggestions="tags"
        placeholder="Tag it and press enter 🏷️"
      />
      <div class="my-0 flex w-full justify-between">
        <AppButton
          class="w-full"
        >
          Save bookmark
        </AppButton>
      </div>
    </div>
  </form>
</template>
<script setup>
import { ref, watch } from 'vue';

import Treeselect from '@zanmato/vue3-treeselect';
import AppTagInput from '@/components/app/AppTagInput.vue';
import AppButton from '@/components/app/AppButton.vue';
import { joinTitleAndTags } from '@/services/tags';
import PhGlobeSimpleLight from '~icons/ph/globe-simple-light';

const props = defineProps({
  folders: {
    type: Array,
    required: true,
    default: () => [],
  },
  tags: {
    type: Array,
    required: true,
    default: () => [],
  },
  favicon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const bookmarkTitle = ref(props.title);

watch(() => props.title, (newTitle) => {
  bookmarkTitle.value = newTitle;
});
const selectedFolder = ref(1);
const selectedTags = ref([]);

const onBeforeClearAll = () => {
  selectedFolder.value = 1;
};

const emit = defineEmits(['submit']);

const submit = () => {
  emit('submit', { title: joinTitleAndTags(bookmarkTitle.value, selectedTags.value), url: props.url, parentId: String(selectedFolder.value) });
};
</script>
