<!-- eslint-disable max-len -->
<template>
  <div class="flex h-full sticky top-0">
    <div class="min-h-screen bg-white p-3">
      <div class="relative flex items-center w-full h-12 overflow-hidden">
        <div class="grid place-items-center h-full w-12 text-gray-300">
          <magnifying-glass-circle-icon class="w-6 h-6" />
        </div>
        <input
          class="h-full w-full outline-none text-gray-500"
          type="text"
          id="search"
          placeholder="Search something.."
        />
      </div>
      <label
        :for="`${item + key}`"
        class="flex place-items-end cursor-pointer text-gray-700 hover:text-grey-900 hover:bg-neutral-100 rounded-md px-2 py-2 my-2"
        v-for="(item, key) in items"
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
        {{ item }}
      </label>
    </div>
  </div>
</template>
<script setup>
import { MagnifyingGlassCircleIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';

defineProps({
  modelValue: {
    type: Array,
  },
  items: {
    type: Array,
    required: true,
  },
});

const selected = ref([]);
</script>
