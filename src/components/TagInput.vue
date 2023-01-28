<template>
  <div class="flex flex-col">
    <transition-group name="list" tag="ul" class="inline-flex flex-wrap">
      <li v-for="(tag, key) in tags" :key="key">
        <span
          class="m-1 mr-2 inline-flex items-center justify-center rounded-full  bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          :data-tag="tag"
        >
          <p class="flex-wrap whitespace-nowrap text-xs">{{ tag }}</p>
          <button
            class="-mr-1 ml-1.5 inline-block rounded-full bg-gray-200 p-0.5 text-gray-700 transition hover:text-gray-600 dark:bg-gray-800 dark:text-gray-300"
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
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      </li>
    </transition-group>
    <div class="relative">
      <input
        class="border-none bg-transparent pl-8 text-xs outline-none focus:ring-0 dark:bg-gray-900 dark:text-white"
        type="text"
        maxlength="25"
        v-model="tag"
        :placeholder="placeholder"
        aria-label="Tag input"
        @keydown.enter="add"
        @keydown.,.prevent="add"
        @keydown.tab.prevent="add"
        @keydown.delete="removeLast"
      />
      <span
        class="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-content-center text-gray-500"
      >
        <hashtag-icon class="h-4 w-4 text-gray-400" />
      </span>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
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
  },
});
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
const add = () => {
  if (!tags.value.includes(tag.value) && tag.value.length > 0 && tags.value.length < props.max) {
    tags.value.push(tag.value);
  }
  tag.value = '';
};
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
