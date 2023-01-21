<!-- eslint-disable max-len -->
<template>
  <div
    class="sticky top-0 flex h-full min-h-screen w-12 flex-col items-center justify-center border-r border-neutral-200 bg-neutral-50 align-middle dark:bg-gray-800"
    role="tablist"
    aria-label="tabs"
  >
    <div class="absolute top-0 m-1">
      <slot name="header" />
    </div>
    <div
      class="indicator absolute my-auto h-10 w-10 rounded-md bg-white shadow dark:bg-gray-900"
      ref="indicatorRef"
    ></div>
    <button
      v-for="(item, key) in items"
      :key="key"
      class="tab relative m-3 rounded-full p-2"
      :id="item.value"
      @click="handleTab"
      :ref="setTabRef"
    >
      <component :is="item.icon" class="pointer-events-none h-6 w-6 text-neutral-600" />
    </button>
    <div class="absolute bottom-0 m-1">
      <slot name="footer"/>
    </div>
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
