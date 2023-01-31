<template>
  <div class="flex h-screen flex-col border-r border-neutral-100 bg-[#FBFBFB]">
    <div class="p-2">
      <div class="relative flex items-center rounded-md  border-none bg-neutral-100 p-0.5">
        <div class="grid place-items-center text-gray-400 ">
          <magnifying-glass-circle-icon class="h-6 w-6" />
        </div>
        <label for="searc">
          <input
            class="w-full border-none bg-neutral-100 text-xs  text-gray-500 outline-none focus:ring-0"
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
            class="my-1 flex cursor-pointer	place-items-end items-center rounded-md p-2 text-gray-700 hover:bg-neutral-100 hover:text-gray-900"
            :key="key"
          >
            <span
              class="m-1 h-2 w-2 rounded border border-solid border-gray-500 bg-white"
              :class="selected.includes(item) ? 'bg-gray-500' : 'bg-white'"
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
  return props.items.filter((item) => item.toLowerCase().startsWith(term.value.toLowerCase()));
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
