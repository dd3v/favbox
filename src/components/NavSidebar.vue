<!-- eslint-disable max-len -->
<template>
  <div
    class="flex flex-col h-full sticky top-0 border-r border-neutral-200 items-center align-middle justify-center min-h-screen bg-neutral-50 w-12 dark:bg-gray-800"
    role="tablist"
    aria-label="tabs"
  >
    <div
      class="absolute indicator h-10 w-10 my-auto bg-white rounded-md shadow dark:bg-gray-900"
      ref="indicatorRef"
    ></div>
    <button
      v-for="(item, key) in items"
      :key="key"
      class="relative tab m-3 p-2 rounded-full"
      :id="item.value"
      @click="handleTab"
      :ref="setTabRef"
    >
      <component :is="item.icon" class="w-6 h-6 pointer-events-none text-neutral-600" />
    </button>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
  },
  items: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue']);
const indicatorRef = ref(null);
const tabRefs = [];
const setTabRef = (el) => tabRefs.push(el);
const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
const handleTab = (tab) => {
  indicatorRef.value.style.top = `${
    tab.target.getBoundingClientRect().top - tab.target.parentElement.getBoundingClientRect().top
  }px`;
  selected.value = tab.target.getAttribute('id');
};

onMounted(() => {
  indicatorRef.value.style.width = `${tabRefs[0].getBoundingClientRect().width}px`;
  indicatorRef.value.style.top = `${
    tabRefs[0].getBoundingClientRect().top - tabRefs[0].parentElement.getBoundingClientRect().top
  }px`;
});
</script>
<style>
.indicator {
  transition: top 0.4s;
}
</style>
