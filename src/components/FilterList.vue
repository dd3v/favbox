<template>
  <div class="flex h-screen flex-col border-r border-neutral-100 bg-[#FBFBFB] dark:border-neutral-800 dark:bg-neutral-900">
    <div class="p-2">
      <div class="relative flex items-center rounded-md  border-none bg-neutral-100 p-0.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
        <div class="grid place-items-center text-neutral-400 ">
          <magnifying-glass-circle-icon class="h-6 w-6" />
        </div>
        <label for="searc">
          <input
            class="w-full border-none bg-neutral-100 text-xs text-gray-700 outline-none focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            type="text"
            id="search"
            placeholder="Search something.."
            v-model="term"
            autocomplete="off"
          />
        </label>
      </div>
      <transition-group tag="ul" name="fade" class="flex h-screen flex-col overflow-y-auto">
        <li v-for="(item, key) in list" :key="key">
          <label
            :for="`${item + key}`"
            class="my-1 flex cursor-pointer place-items-end items-center rounded-md p-2 text-gray-700 hover:bg-neutral-100  dark:text-neutral-400 dark:hover:bg-neutral-800"
            :key="key"
          >
            <span
              class="m-1 h-2 w-2 rounded border border-solid border-gray-500 bg-white dark:border-neutral-700 dark:bg-neutral-800"
              :class="selected.includes(item) ? 'bg-gray-500 dark:bg-neutral-500' : 'bg-white'"
            ></span>
            <input
              type="checkbox"
              class="hidden"
              name="item"
              :id="`${item + key}`"
              :value="item"
              v-model="selected"
            />
            <span class="truncate">{{ item }}</span>
          </label>
        </li>
      </transition-group>
    </div>
  </div>
</template>
<script setup>
import { MagnifyingGlassCircleIcon } from '@heroicons/vue/24/outline';
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
  },
  items: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue']);
const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
const term = ref('');
const list = computed(() => {
  if (term.value.length === 0) {
    return props.items;
  }
  return props.items.filter((item) => item.toLowerCase().includes(term.value.toLowerCase()));
});
</script>
<style scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01);
}
</style>
