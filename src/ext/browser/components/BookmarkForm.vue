<template>
  <form
    class="flex flex-col gap-y-3"
    @submit.prevent="submit"
  >
    <label
      for="title"
      class="relative"
    >
      <input
        id="title"
        v-model="bookmark.title"
        type="text"
        placeholder="Page title"
        class="h-9 w-full rounded-md border-gray-200 pl-10 text-xs text-black shadow-sm outline-none focus:border-gray-300 focus:ring-0 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white focus:dark:border-neutral-700"
      >
      <span class="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-content-center text-gray-700">
        <BookmarkFavicon
          :bookmark="bookmark"
          class="size-5 fill-black"
        />
      </span>
    </label>
    <Treeselect
      v-model="bookmark.folderId"
      placeholder=""
      :before-clear-all="onBeforeClearAll"
      :always-open="false"
      :options="folders"
    />
    <AppTagInput
      v-model="bookmark.tags"
      class="relative"
      :max="5"
      :suggestions="tags"
      placeholder="Tag it and press enter 🏷️"
    />
    <AppButton class="w-full">
      Save bookmark
    </AppButton>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import Treeselect from '@zanmato/vue3-treeselect';
import AppTagInput from '@/components/app/AppTagInput.vue';
import BookmarkFavicon from '@/ext/browser/components/BookmarkFavicon.vue';
import AppButton from '@/components/app/AppButton.vue';
import tagHelper from '@/helpers/tags';

const props = defineProps({
  bookmark: {
    type: Object,
    required: true,
  },
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
});

const bookmark = ref({ ...props.bookmark });
const emit = defineEmits(['onSubmit']);

const findLabelById = (data, id) => {
  for (const item of data) {
    if (item.id === id) {
      return item.label;
    }
    if (item.children) {
      const result = findLabelById(item.children, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

const onBeforeClearAll = () => {
  bookmark.value.folderId = 1;
};

const submit = () => {
  const value = JSON.parse(JSON.stringify(bookmark.value));
  emit('onSubmit', {
    browserTitle: tagHelper.toString(value.title, value.tags),
    title: value.title,
    folderName: value.folderName,
    folderId: value.folderId,
    tags: value.tags,
    id: value.id,
  });
};

watch(() => bookmark.value.folderId, (newId) => {
  bookmark.value.folderName = findLabelById(props.folders, newId);
}, { immediate: true });

</script>
