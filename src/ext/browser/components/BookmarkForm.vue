<template>
  <form
    class="space-y-3"
    @submit.prevent="$emit('onSubmit', bookmark)"
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
      :options="options"
    />
    <AppTagInput
      v-model="bookmark.tags"
      class="relative"
      :max="5"
      :suggestions="tags"
      placeholder="Tag it, press Enter or Tab 🏷️"
    />
    <AppButton class="w-full">
      Save bookmark
    </AppButton>
  </form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import AppTagInput from '@/components/app/AppTagInput.vue';
import BookmarkFavicon from '@/ext/browser/components/BookmarkFavicon.vue';
import AppButton from '@/components/app/AppButton.vue';
import Treeselect from '@zanmato/vue3-treeselect';
import bookmarkHelper from '../../../helpers/bookmark';

const props = defineProps({
  modelValue: {
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

const options = ref([]);
const bookmark = ref(props.modelValue);

const findFolderName = (folderId, folders) => {
  for (const folder of folders) {
    if (folder.id === folderId) {
      return folder.label;
    }
    if (folder.children) {
      const found = findFolderName(folderId, folder.children);
      if (found) return found;
    }
  }
  return null;
};

const onBeforeClearAll = () => {
  bookmark.value.folderId = 1;
};

const updateFolderName = (folderId) => {
  const folderName = findFolderName(folderId, options.value);
  bookmark.value.folderName = folderName || 'Unnamed Folder';
};

onMounted(async () => {
  options.value = await bookmarkHelper.buildFolderUITree();
  updateFolderName(bookmark.value.folderId);
});

watch(() => bookmark.value.folderId, (newFolderId) => {
  updateFolderName(newFolderId);
});

defineEmits(['onSubmit']);
</script>
