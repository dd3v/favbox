<!-- eslint-disable max-len -->
<template>
  <div
    class="flex flex-col h-full sticky top-0 border-r border-neutral-200 items-center align-middle justify-center min-h-screen bg-neutral-50 w-12"
    role="tablist"
    aria-label="tabs"
  >
    <div
      class="absolute indicator h-10 w-10 my-auto bg-white rounded-md shadow"
      ref="indicatorRef"
    ></div>
    <button
      v-for="(item, key) in items"
      :key="key"
      class="relative tab m-3 p-2 rounded-full"
      :id="`item-${key}`"
      @click="handleTab"
      :ref="setTabRef"
    >
      <component :is="item.icon" class="w-6 h-6 pointer-events-none text-neutral-600" />
    </button>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';

defineProps({
  modelValue: {
    type: Array,
  },
  items: {
    type: Array,
    required: true,
  },
});

const indicatorRef = ref(null);
const tabRefs = [];
const setTabRef = (el) => tabRefs.push(el);

const handleTab = (tab) => {
  indicatorRef.value.style.top = `${
    tab.target.getBoundingClientRect().top - tab.target.parentElement.getBoundingClientRect().top
  }px`;
  const selectedTab = tab.target.getAttribute('id');
  console.warn(selectedTab);
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
