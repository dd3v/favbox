<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="close" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
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
              class="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-neutral-900"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-400"
              >
                💬 Welcome!
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  We're scanning your existing bookmarks and gathering information about the pages
                  for more efficient performance. It will take a while...
                </p>
                <div class="my-5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="rounded-full bg-rose-400 p-0.5 text-center text-xs font-medium leading-none text-white"
                    :style="{ width: `${progress}%` }"
                  >
                    {{ progress }}%
                  </div>
                </div>
              </div>
              <div class="mt-4 flex justify-end">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-rose-400 bg-rose-400 px-6 py-2 text-white shadow-sm outline-none ring-0 transition hover:bg-transparent hover:text-rose-400 focus:ring-0 active:text-rose-400"
                  @click="close"
                >
                  Got it!
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref, watch } from 'vue';
import {
  TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle,
} from '@headlessui/vue';

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    default: 0,
  },
});
const isOpen = ref(true);
const close = () => {
  isOpen.value = false;
};
watch(() => props.progress, (newValue) => {
  if (parseInt(newValue, 10) >= 100) {
    isOpen.value = false;
  }
});
</script>
