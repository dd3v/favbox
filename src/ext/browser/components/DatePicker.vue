<template>
  <div
    ref="rootRef"
    class="relative"
  >
    <button
      v-tooltip.bottom="{ content: 'Date filter' }"
      class="inline-flex size-9 items-center justify-center rounded-md border-1 border-gray-400/30 bg-white text-gray-700 shadow-sm hover:bg-gray-50 font-sans text-base dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
      @click="toggleCalendar"
    >
      <IconoirCalendar class="size-5 cursor-pointer text-gray-700 dark:text-neutral-400" />
    </button>
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 z-50 mt-2 origin-top-right shadow-md"
      >
        <VueDatePicker
          v-model="selectedDate"
          :enable-time-picker="false"
          :dark="isDarkMode"
          :range="true"
          :inline="true"
          :auto-apply="true"
          :close-on-auto-apply="true"
          @update:model-value="onDateSelected"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useDark } from '@vueuse/core';
import VueDatePicker from '@vuepic/vue-datepicker';
import IconoirCalendar from '~icons/iconoir/calendar';

const props = defineProps({
  modelValue: {
    type: [Date, String, Array, null],
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const rootRef = ref(null);


const selectedDate = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isDarkMode = useDark();

const toggleCalendar = () => {
  isOpen.value = !isOpen.value;
};

const closeCalendar = () => {
  isOpen.value = false;
};

const onDateSelected = (value) => {
  selectedDate.value = value;
  closeCalendar();
};

const handleClickOutside = (event) => {
  if (isOpen.value && rootRef.value && !rootRef.value.contains(event.target)) {
    closeCalendar();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

</script>
