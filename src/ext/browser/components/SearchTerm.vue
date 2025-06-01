<template>
  <div
    class="flex h-9 w-full overflow-x-auto whitespace-nowrap rounded-md border border-gray-200 bg-white px-1 shadow-sm focus-within:border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white focus:dark:border-neutral-700"
  >
    <ul class="flex h-full items-center gap-x-1">
      <li
        v-for="(tag, tagKey) in modelValue"
        :key="tagKey"
        class="flex items-center"
      >
        <AppBadge
          closable
          :color="getColor(tag.key)"
          @onClose="onClose(tag.key, tag.value)"
        >
          <component
            :is="getIcon(tag.key)"
            class="mr-1 size-4"
          />
          {{ tag.value }}
        </AppBadge>
      </li>
    </ul>
    <input
      ref="inputRef"
      v-model="term"
      type="text"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      maxlength="25"
      :placeholder="modelValue.length ? '' : placeholder"
      class="w-full min-w-max flex-1 appearance-none border-0 bg-transparent px-1 py-0 text-xs placeholder:text-xs focus:outline-none focus:ring-0"
      @keydown.enter="add"
      @keydown.tab.prevent="add"
      @keydown.delete="removeLast"
    >
    <div class="flex flex-wrap items-center gap-x-1 text-xs text-gray-400 dark:text-neutral-600">
      <button
        class="m-0 inline-flex appearance-none items-center space-x-1 border-none bg-transparent p-0"
        @click="handleCommandPallete"
      >
        <span class="inline-flex size-6 items-center justify-center rounded-md border border-gray-200 bg-white font-mono text-lg shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
          ⌥
        </span>
        <span class="inline-flex size-6 items-center justify-center rounded-md border border-gray-200 bg-white font-mono text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
          K
        </span>
      </button>
    </div>
    <CommandPalette
      ref="cmd"
      @onVisibilityToggle="cmdToggle"
      @onSelected="emit('update:modelValue', [...modelValue, ...$event.filter(n => !modelValue.some(e => e.key === n.key && e.value === n.value))])"
    />
  </div>
</template>

<script setup>
import AppBadge from '@/components/app/AppBadge.vue';
import { ref, computed } from 'vue';
import CommandPalette from '@/ext/browser/components/CommandPalette.vue';

import PhHashStraightLight from '~icons/ph/hash-straight-light';
import PhGlobeSimpleLight from '~icons/ph/globe-simple-light';
import PhListMagnifyingGlassLight from '~icons/ph/list-magnifying-glass-light';
import PhFolderSimpleLight from '~icons/ph/folder-simple-light';
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
const inputRef = ref(null);
const cmd = ref(null);
const emit = defineEmits(['update:modelValue']);

const removeLast = () => {
  if (term.value) return;
  emit('update:modelValue', props.modelValue.slice(0, -1));
};

const add = () => {
  if (!term.value) return;
  const [key, value] = term.value.split(':');
  const validKeys = ['tag', 'keyword', 'domain', 'folder', 'locale', 'type'];

  if (validKeys.includes(key) && value) {
    emit('update:modelValue', [...props.modelValue, { key, value }]);
  } else {
    const updatedValue = props.modelValue.filter((item) => item.key !== 'term');
    updatedValue.push({ key: 'term', value: term.value });
    emit('update:modelValue', updatedValue);
  }
  term.value = '';
};

const iconMap = computed(() => ({
  folder: PhFolderSimpleLight,
  keyword: PhListMagnifyingGlassLight,
  tag: PhHashStraightLight,
  domain: PhGlobeSimpleLight,
  default: PhMagnifyingGlassLight,
}));

const colorMap = computed(() => ({
  domain: 'yellow',
  tag: 'gray',
  keyword: 'green',
  folder: 'purple',
  default: 'red',
}));

const getIcon = (key) => iconMap.value[key] || iconMap.value.default;
const getColor = (key) => colorMap.value[key] || colorMap.value.default;

const focus = () => { inputRef.value.focus(); };
const handleCommandPallete = () => { cmd.value.toggle(); };

const onClose = (key, value) => {
  const data = props.modelValue.filter((item) => !(item.key === key && item.value === value));
  emit('update:modelValue', data);
};

const cmdToggle = (status) => {
  if (status === false) {
    setTimeout(() => focus(), 500);
  }
};

defineExpose({ focus });
</script>
