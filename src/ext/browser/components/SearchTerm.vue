<template>
  <div
    class="flex w-full items-center overflow-x-auto whitespace-nowrap rounded-md border border-gray-200 px-1 shadow-sm focus-within:border-gray-300 dark:bg-neutral-800"
  >
    <ul class="flex gap-1">
      <li
        v-for="(tag, tagKey) in modelValue"
        :key="tagKey"
      >
        <AppBadge
          v-motion-fade
          closable
          :color="getColor(tag.key)"
          @onClose="onClose(tag.key, tag.value)"
        >
          <div class="flex items-center">
            <component
              :is="getIcon(tag.key)"
              class="mr-1 size-4"
            /> {{ tag.value }}
          </div>
        </AppBadge>
      </li>
    </ul>
    <input
      ref="inputRef"
      v-model="term"
      type="text"
      maxlength="25"
      :placeholder="modelValue.length ? '' : placeholder"
      class="w-full min-w-max appearance-none border-0 px-2 py-1 text-sm focus:outline-none focus:ring-0"
      @keydown.enter="add"
      @keydown.tab.prevent="add"
      @keydown.delete="removeLast"
    >
  </div>
</template>

<script setup>
import AppBadge from '@/components/app/AppBadge.vue';
import KeywordIcon from '@/components/icons/KeywordIcon.vue';
import LangIcon from '@/components/icons/LangIcon.vue';
import UrlIcon from '@/components/icons/UrlIcon.vue';
import FolderIcon from '@/components//icons/FolderIcon.vue';
import TagIcon from '@/components/icons/TagIcon.vue';
import TypeIcon from '@/components/icons/TypeIcon.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';

import { ref } from 'vue';

const term = ref('');

const props = defineProps({
  placeholder: {
    type: String,
    default: '...',
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const inputRef = ref('');
const emit = defineEmits(['update:modelValue']);

const removeLast = () => {
  if (term.value) return;
  emit('update:modelValue', props.modelValue.slice(0, -1));
};

const add = () => {
  if (!term.value) return;
  const [key, value] = term.value.split(':');
  if (['tag', 'keyword', 'domain', 'folder', 'locale', 'type'].includes(key) && value) {
    emit('update:modelValue', [...props.modelValue, { key, value }]);
  } else {
    const updatedValue = [...props.modelValue.filter((item) => item.key !== 'term')];
    updatedValue.push({ key: 'term', value: term.value });
    emit('update:modelValue', updatedValue);
  }
  term.value = '';
};

const getIcon = (key) => {
  switch (key) {
    case 'type':
      return TypeIcon;
    case 'locale':
      return LangIcon;
    case 'folder':
      return FolderIcon;
    case 'keyword':
      return KeywordIcon;
    case 'tag':
      return TagIcon;
    case 'domain':
      return UrlIcon;
    default:
      return SearchIcon;
  }
};

const getColor = (key) => {
  switch (key) {
    case 'domain':
      return 'yellow';
    case 'tag':
      return 'gray';
    case 'keyword':
      return 'green';
    case 'folder':
      return 'purple';
    case 'locale':
      return 'cyan';
    case 'type':
      return 'indigo';
    default:
      return 'stone';
  }
};

const onClose = (key, value) => {
  const data = [...props.modelValue];
  const index = data.findIndex((item) => item.key === key && item.value === value);
  if (index !== -1) {
    data.splice(index, 1);
    emit('update:modelValue', data);
  }
};

</script>
