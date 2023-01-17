<!-- eslint-disable max-len -->
<template>
  <div class="flex h-full sticky top-0 ">
    <div class="min-h-screen bg-white p-3 w-48">
      <div class="relative flex items-center h-12 overflow-hidden">
        <div class="grid place-items-center h-full w-12 text-gray-300">
          <magnifying-glass-circle-icon class="w-6 h-6" />
        </div>
        <input
          class="h-full w-full outline-none text-gray-500"
          type="text"
          id="search"
          placeholder="Search something.."
          v-model="term"
        />
      </div>
      <label
        v-for="(item, key) in list"
        :for="`${item + key}`"
        class="flex place-items-end cursor-pointer text-gray-700 hover:text-grey-900 hover:bg-neutral-100 rounded-md px-2 py-2 my-2"
        :key="key"
      >
        <span
          class="h-2 w-2 m-1 rounded-full"
          :class="selected.includes(item) ? 'bg-gray-500' : 'bg-gray-300'"
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

const term = ref('');
const selected = ref([]);
const list = computed(() => {
  if (term.value.length === 0) {
    return props.items;
  }
  return props.items.filter((item) => item.toLowerCase().startsWith(term.value.toLowerCase()));
});
</script>
