<template>
  <div class="flex h-full flex-col overflow-hidden">
    <ul
      class="space-y-0.5 overflow-y-auto py-1"
      role="tree"
      aria-label="Bookmark folders"
    >
      <FolderTreeItem
        v-for="folder in folders"
        :key="`${folder.id}-${folder.label}`"
        :folder="folder"
        :selected-id="selectedFolderId"
        :level="0"
        @select="selectFolder"
      />
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import FolderTreeItem from '@/ext/browser/components/FolderTreeItem.vue';

const props = defineProps({
  folders: {
    type: Array,
    default: () => [],
    validator: (value) => Array.isArray(value),
  },
  modelValue: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value),
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedFolderId = ref(null);

const folderFilter = computed(() => props.modelValue.find((item) => item.key === 'folder'));

const selectFolder = ({ id, label }) => {
  if (selectedFolderId.value === id) {
    selectedFolderId.value = null;
    emit('update:modelValue', props.modelValue.filter((item) => item.key !== 'folder'));
  } else {
    selectedFolderId.value = id;
    const filtered = props.modelValue.filter((item) => item.key !== 'folder');
    filtered.push({ key: 'folder', value: id, label });
    emit('update:modelValue', filtered);
  }
};

watch(
  () => folderFilter.value?.value,
  (newValue) => {
    selectedFolderId.value = newValue || null;
  },
  { immediate: true },
);
</script>
