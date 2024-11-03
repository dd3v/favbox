<template>
  <TransitionRoot
    appear
    :show="isOpen"
    as="template"
  >
    <Dialog
      as="div"
      class="relative z-10"
      @close="close"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-[rgba(255,_255,_255,_0.19)] backdrop-blur-[13px] backdrop-saturate-[200%]" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-neutral-900"
            >
              <DialogTitle
                as="h3"
                class="flex items-center text-lg font-medium leading-6 text-gray-900 dark:text-gray-400"
              >
                <PixelarticonsHeart class="mr-2" />
                Welcome!
              </DialogTitle>
              <div class="mt-2">
                <p class="py-1 text-sm text-black">
                  The app is scanning your bookmarks and gathering information about the pages to make everything run smoother and faster.
                  This process may take a little time depending on how many bookmarks you have, your internet speed, and device performance.
                </p>
                <p class="py-4 text-sm text-black">
                  Thank you for your patience!
                </p>
                <AppProgress
                  :progress="progress"
                />
              </div>
              <div class="mt-4 flex justify-end">
                <AppButton @click="close">
                  OK
                </AppButton>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import AppButton from '@/components/app/AppButton.vue';
import AppProgress from '@/components/app/AppProgress.vue';

import { ref, watch } from 'vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import PixelarticonsHeart from '~icons/pixelarticons/heart';

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    default: 10,
  },
});
const isOpen = ref(true);
const close = () => {
  isOpen.value = false;
};
watch(
  () => props.progress,
  (newValue) => {
    if (parseInt(newValue, 10) >= 100) {
      isOpen.value = false;
    }
  },
);
</script>
