<template>
  <div class="flex flex-col">
    <div class="relative">
      <span
        class="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-content-center text-gray-500"
      >
        <hashtag-icon class="h-4 w-4 text-gray-700 dark:text-neutral-200" />
      </span>
      <input
        ref="inputRef"
        v-model="tag"
        class="w-full rounded-md border-gray-200 pl-10 text-xs text-gray-700 shadow-sm outline-none focus:border-gray-300 focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 focus:dark:border-neutral-600"
        type="text"
        maxlength="25"
        :placeholder="placeholder"
        aria-label="Tag input"
        @keydown.enter="add"
        @keydown.,.prevent="add"
        @keydown.tab.prevent="add"
        @keydown.delete="removeLast"
        @keydown.arrow-up.prevent="arrowUp"
        @keydown.arrow-down.prevent="arrowDown"
      >
    </div>
    <transition-group
      name="list"
      tag="ul"
      class="mt-2 inline-flex flex-wrap"
    >
      <li
        v-for="(value, key) in tags"
        :key="key"
      >
        <span
          class="m-1 mr-2 inline-flex items-center justify-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-neutral-700 dark:text-neutral-300"
          :data-tag="value"
        >
          <p class="flex-wrap whitespace-nowrap text-xs">{{ value }}</p>
          <button
            class="-mr-1 ml-1.5 inline-block rounded-full bg-gray-200 p-0.5 text-gray-700 transition hover:text-gray-600 dark:bg-neutral-800 dark:text-neutral-300"
            @click="remove(key)"
            @keypress="remove(key)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-3 w-3"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </span>
      </li>
    </transition-group>
    <div
      v-if="showSuggestions"
      class="z-10 mt-2 max-h-48 w-full overflow-y-auto rounded-md border-none bg-white py-1 shadow-lg dark:bg-neutral-800"
    >
      <ul>
        <li
          v-for="(suggest, index) in filteredSuggestions"
          :key="suggest"
          class="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-600 dark:hover:text-white"
          :class="{ 'bg-neutral-50 dark:bg-neutral-700': highlightedSuggestionIndex === index }"
          role="option"
          aria-selected="true"
          @click="highlightedSuggestionIndex = index; add();"
        >
          <span>{{ suggest }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import {
  ref, computed, watch, onMounted, onUnmounted,
} from 'vue';
import { HashtagIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  max: {
    type: Number,
    default: 5,
  },
  placeholder: {
    type: String,
    default: 'Enter a tag',
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  suggestions: {
    type: Array,
    default: () => [],
  },
});

const showSuggestions = ref(false);
const highlightedSuggestionIndex = ref(-1);
const inputRef = ref(null);
const emit = defineEmits(['update:modelValue']);
const tag = ref('');
const tags = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
const remove = (index) => {
  tags.value.splice(index, 1);
};
const removeLast = () => {
  if (!tag.value.length) {
    tags.value.pop();
  }
};
const filteredSuggestions = computed({
  get: () => (tag.value === ''
    ? []
    : props.suggestions.filter((suggestion) => suggestion.toLowerCase().includes(tag.value.toLowerCase()))),
});
const add = () => {
  let value = null;
  if (highlightedSuggestionIndex.value !== -1) {
    value = filteredSuggestions.value[highlightedSuggestionIndex.value];
  } else {
    value = tag.value;
  }
  if (value && !tags.value.includes(value) && tags.value.length < props.max) {
    tags.value.push(value);
  }
  tag.value = '';
};
const arrowUp = () => {
  if (highlightedSuggestionIndex.value !== 0) {
    highlightedSuggestionIndex.value -= 1;
  }
};
const arrowDown = () => {
  if (filteredSuggestions.value.length > highlightedSuggestionIndex.value + 1) {
    highlightedSuggestionIndex.value += 1;
  }
};
const hideSuggestions = () => {
  showSuggestions.value = false;
};
watch(tag, () => {
  highlightedSuggestionIndex.value = -1;
  if (filteredSuggestions.value.length) {
    showSuggestions.value = true;
  }
});
onMounted(() => {
  document.addEventListener('click', hideSuggestions);
});
onUnmounted(() => {
  document.removeEventListener('click', hideSuggestions);
});
</script>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
