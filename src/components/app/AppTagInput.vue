<template>
  <div @click="focus">
    <div
      class="flex min-h-9 w-full flex-wrap items-center gap-1 whitespace-normal rounded-md border border-gray-200 bg-white px-2 py-1 shadow-sm focus-within:border-gray-300  dark:border-neutral-800 dark:bg-neutral-900 dark:text-white focus-within:dark:border-neutral-700"
    >
      <AppBadge
        v-for="(value, index) in tags"
        :key="index"
        closable
        :data-tag="value"
        @onClose="remove(index)"
      >
        <span class="whitespace-nowrap text-xs">{{ value }}</span>
      </AppBadge>
      <input
        v-if="showInput"
        ref="inputRef"
        v-model="tag"
        class="min-w-[20%] flex-1 appearance-none border-0 bg-transparent px-1 py-0 text-xs placeholder:text-xs focus:outline-none focus:ring-0"
        type="text"
        maxlength="25"
        :placeholder="tags.length ? '' : placeholder"
        aria-label="Tag input"
        @keydown.enter="add"
        @keydown.tab.prevent="add"
        @keydown.delete="removeLast"
        @keydown.arrow-up.prevent="arrowUp"
        @keydown.arrow-down.prevent="arrowDown"
      >
    </div>
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <div
        v-if="showSuggestionContainer"
        class="z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-xs shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-neutral-900 dark:text-neutral-400"
      >
        <ul>
          <li
            v-for="(suggestion, index) in filteredSuggestions"
            :key="index"
            ref="suggestionRef"
            class="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
            :class="{'bg-neutral-100 dark:bg-neutral-800': highlightedSuggestionIndex === index }"
            role="option"
            @click="add"
            @mouseenter="highlightedSuggestionIndex = index"
          >
            <div class="inline-flex items-center space-x-1 dark:text-white">
              <PhHashStraightLight class="size-4" />
              <span>{{ suggestion }}</span>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {
  ref, computed, watch, onMounted, onUnmounted, nextTick,
} from 'vue';
import AppBadge from '@/components/app/AppBadge.vue';
import PhHashStraightLight from '~icons/ph/hash-straight-light';

const props = defineProps({
  max: { type: Number, default: 5 },
  placeholder: { type: String, default: 'Enter a tag' },
  modelValue: { type: Array, default: () => [] },
  suggestions: { type: Array, default: () => [] },
});

const showSuggestionContainer = ref(false);
const highlightedSuggestionIndex = ref(-1);
const inputRef = ref(null);
const emit = defineEmits(['update:modelValue']);
const tag = ref('');
const suggestionRef = ref([]);
const showInput = ref(false);

const tags = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const focus = () => {
  showInput.value = true;
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
};

const remove = (index) => {
  tags.value.splice(index, 1);
};

const removeLast = () => {
  if (!tag.value) tags.value.pop();
};

const filteredSuggestions = computed(() => (tag.value === '' ? [] : props.suggestions.filter((suggestion) => suggestion.toLowerCase().includes(tag.value.toLowerCase()))));

const add = () => {
  const value = highlightedSuggestionIndex.value !== -1
    ? filteredSuggestions.value[highlightedSuggestionIndex.value]
    : tag.value;

  if (value && !tags.value.includes(value) && tags.value.length < props.max) {
    tags.value.push(value);
  }
  tag.value = '';
  showSuggestionContainer.value = false;
};

const scrollIntoView = () => {
  const currentElement = suggestionRef.value[highlightedSuggestionIndex.value];
  if (currentElement) {
    currentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

const arrowUp = () => {
  if (highlightedSuggestionIndex.value !== 0) {
    highlightedSuggestionIndex.value -= 1;
    scrollIntoView();
  }
};

const arrowDown = () => {
  if (filteredSuggestions.value.length > highlightedSuggestionIndex.value + 1) {
    highlightedSuggestionIndex.value += 1;
    scrollIntoView();
  }
};

const hideSuggestions = () => {
  showSuggestionContainer.value = false;
};

watch(tag, () => {
  highlightedSuggestionIndex.value = -1;
  showSuggestionContainer.value = tag.value && filteredSuggestions.value.length > 0;
});

onMounted(() => {
  if (tags.value.length === 0) {
    showInput.value = true;
  }
  document.addEventListener('click', hideSuggestions);
});

onUnmounted(() => {
  document.removeEventListener('click', hideSuggestions);
});
</script>
