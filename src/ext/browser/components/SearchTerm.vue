<template>
  <div
    class="flex h-9 w-full items-center overflow-x-auto whitespace-nowrap rounded-md border border-gray-200 bg-white px-1 shadow-sm focus-within:border-gray-300 dark:bg-neutral-800"
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
      class="w-full min-w-max flex-1 appearance-none border-0 bg-transparent px-1 py-0 text-sm placeholder:text-xs focus:outline-none focus:ring-0"
      @keydown.enter="add"
      @keydown.tab.prevent="add"
      @keydown.delete="removeLast"
    >
    <div class="flex flex-wrap items-center gap-x-1 text-sm text-gray-400 dark:text-neutral-600">
      <slot name="kbd" />
    </div>
  </div>
</template>

<script setup>
import AppBadge from '@/components/app/AppBadge.vue';
import { ref } from 'vue';

import PhHashStraightLight from '~icons/ph/hash-straight-light';
import PhGlobeSimpleLight from '~icons/ph/globe-simple-light';
import PhListMagnifyingGlassLight from '~icons/ph/list-magnifying-glass-light';
import PhFolderSimpleLight from '~icons/ph/folder-simple-light';
import PhFileMagnifyingGlassLight from '~icons/ph/file-magnifying-glass-light';
import PhTranslateLight from '~icons/ph/translate-light';
import PhMagnifyingGlassLight from '~icons/ph/magnifying-glass-light';

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

const term = ref('');
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
      return PhFileMagnifyingGlassLight;
    case 'locale':
      return PhTranslateLight;
    case 'folder':
      return PhFolderSimpleLight;
    case 'keyword':
      return PhListMagnifyingGlassLight;
    case 'tag':
      return PhHashStraightLight;
    case 'domain':
      return PhGlobeSimpleLight;
    default:
      return PhMagnifyingGlassLight;
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

const focus = () => {
  inputRef.value.focus();
};

const onClose = (key, value) => {
  const data = [...props.modelValue];
  const index = data.findIndex((item) => item.key === key && item.value === value);
  if (index !== -1) {
    data.splice(index, 1);
    emit('update:modelValue', data);
  }
};

defineExpose({ focus });

</script>
