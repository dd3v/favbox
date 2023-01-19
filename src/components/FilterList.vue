<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<!-- eslint-disable max-len -->
<template>
  <div class="flex h-full sticky top-0">
    <div class="min-h-screen bg-white p-3 w-48">
      <div class="relative flex items-center h-12 overflow-hidden">
        <div class="grid place-items-center h-full w-12 text-gray-300">
          <magnifying-glass-circle-icon class="w-6 h-6" />
        </div>
        <input
          class="w-full outline-none text-gray-500"
          type="text"
          id="search"
          placeholder="Search something.."
          v-model="term"
        />
      </div>
      <transition-group tag="ul" name="fade" class="items">
        <li v-for="(item, key) in list" :key="key">
          <label
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
