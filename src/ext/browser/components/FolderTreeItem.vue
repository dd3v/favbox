<template>
  <li
    class="select-none"
    role="treeitem"
    :aria-expanded="hasChildren ? isExpanded : undefined"
    :aria-selected="isSelected"
  >
    <div
      role="button"
      tabindex="0"
      class="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-gray-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600"
      :class="{ 'bg-neutral-100 dark:bg-neutral-900': isSelected }"
      :aria-label="`${folder.label}${folder.count ? `, ${folder.count} bookmarks` : ''}`"
      @click="select"
      @keydown.enter="select"
      @keydown.space.prevent="select"
    >
      <button
        v-if="hasChildren"
        class="flex size-4 items-center justify-center text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 focus:outline-none"
        :aria-label="isExpanded ? 'Collapse folder' : 'Expand folder'"
        @click.stop="toggle"
        @keydown.enter.stop="toggle"
        @keydown.space.stop.prevent="toggle"
      >
        <PhCaretRight
          class="size-3 transition-transform duration-150"
          :class="{ 'rotate-90': isExpanded }"
        />
      </button>
      <span
        v-else
        class="size-4"
        aria-hidden="true"
      />
      <PhFolderSimpleLight class="size-4 shrink-0" />
      <span class="truncate text-xs">{{ folder.label }}</span>
      <span
        v-if="folder.count"
        class="ml-auto text-xs text-gray-400 dark:text-neutral-600"
        aria-label="bookmark count"
      >{{ folder.count }}</span>
    </div>
    <ul
      v-if="hasChildren && isExpanded"
      class="ml-3 border-l border-gray-200 dark:border-neutral-700"
      role="group"
    >
      <FolderTreeItem
        v-for="child in folder.children"
        :key="`${child.id}-${child.label}`"
        :folder="child"
        :selected-id="selectedId"
        :level="level + 1"
        @select="$emit('select', $event)"
      />
    </ul>
  </li>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import PhCaretRight from '~icons/ph/caret-right';
import PhFolderSimpleLight from '~icons/ph/folder-simple-light';

const props = defineProps({
  folder: {
    type: Object,
    required: true,
    validator: (value) => value && typeof value === 'object' && value.id && value.label,
  },
  selectedId: {
    type: String,
    default: null,
  },
  level: {
    type: Number,
    default: 0,
    validator: (value) => typeof value === 'number' && value >= 0,
  },
});

const emit = defineEmits(['select']);

const hasChildren = computed(() => Boolean(props.folder.children?.length));

const hasSelectedChild = computed(() => {
  if (!hasChildren.value || !props.selectedId) return false;

  const checkChildren = (children) => {
    for (const child of children) {
      if (child.id === props.selectedId) return true;
      if (child.children && checkChildren(child.children)) return true;
    }
    return false;
  };

  return checkChildren(props.folder.children);
});

const isExpanded = ref(props.level < 2 || hasSelectedChild.value);

const isSelected = computed(() => props.selectedId === props.folder.id);

watch(
  () => hasSelectedChild.value,
  (hasSelected) => {
    if (hasSelected) {
      isExpanded.value = true;
    }
  },
  { immediate: true },
);

const toggle = () => {
  isExpanded.value = !isExpanded.value;
};

const select = () => {
  emit('select', { id: props.folder.id, label: props.folder.label });
};
</script>
