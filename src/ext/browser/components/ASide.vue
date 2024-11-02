<template>
  <aside
    class="sticky top-0 flex h-full min-h-screen w-12 min-w-12 flex-col items-center justify-center border-neutral-800 align-middle shadow-inner dark:border-r dark:bg-neutral-900"
  >
    <div
      ref="indicatorRef"
      class="absolute my-auto size-10 rounded-md bg-white shadow transition-[top] duration-[0.3s] dark:bg-neutral-800"
    />
    <ul class="space-y-12">
      <li
        v-for="(item, key) in items"
        :key="item.key"
        :ref="el => setMenuItemRef(el, item.name)"
        v-tooltip="{ text: item.tooltip, position: 'right', delay: 1000 }"
        class=""
        @click="handleClick"
      >
        <router-link
          :key="key"

          :to="{ name: item.name }"
          class="relative"
        >
          <component
            :is="item.icon"
            class="pointer-events-none size-6 text-gray-700 dark:text-neutral-300"
          />
        </router-link>
      </li>
    </ul>
  </aside>
</template>
<script setup>
import {
  defineProps, ref, onMounted, onBeforeUnmount, reactive, watch,
} from 'vue';
import { useRoute } from 'vue-router';

defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const route = useRoute();
const indicatorRef = ref(null);
const menuItemsRef = reactive({});

const setMenuItemRef = (el, name) => {
  menuItemsRef[name] = el;
};

const setIndicatorPosition = (element) => {
  const targetRect = element.getBoundingClientRect();
  const center = targetRect.top + targetRect.height / 2;
  indicatorRef.value.style.top = `${center - (indicatorRef.value.offsetHeight / 2)}px`;
};

const moveButton = () => {
  const currentItem = menuItemsRef[route.name];
  if (currentItem) {
    setIndicatorPosition(currentItem);
  }
};

const handleClick = (event) => {
  const targetElement = event.currentTarget;
  setIndicatorPosition(targetElement);
};

onMounted(() => {
  window.addEventListener('resize', moveButton);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', moveButton);
});

watch(() => route.name, () => {
  moveButton();
}, { immediate: true });

</script>
