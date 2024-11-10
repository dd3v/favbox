<template>
  <TransitionRoot
    as="template"
    :show="isOpen"
  >
    <Dialog
      class="relative z-10"
      @close="isOpen = false"
    >
      <TransitionChild
        as="template"
        enter="ease-in-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-300 sm:duration-300"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-300 sm:duration-300"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto relative w-screen max-w-md">
                <TransitionChild
                  as="template"
                  enter="ease-in-out duration-300"
                  enter-from="opacity-0"
                  enter-to="opacity-100"
                  leave="ease-in-out duration-300"
                  leave-from="opacity-100"
                  leave-to="opacity-0"
                >
                  <div class="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      class="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      @click="isOpen = false"
                    >
                      <span class="absolute -inset-2.5" />
                      <span class="sr-only">Close panel</span>
                      <svg
                        class="size-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                      ><path
                        fill="currentColor"
                        d="m6.4 18.308l-.708-.708l5.6-5.6l-5.6-5.6l.708-.708l5.6 5.6l5.6-5.6l.708.708l-5.6 5.6l5.6 5.6l-.708.708l-5.6-5.6z"
                      /></svg>
                    </button>
                  </div>
                </TransitionChild>
                <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl dark:bg-black">
                  <div class="px-4 sm:px-6">
                    <DialogTitle class="text-base font-semibold leading-6 text-black dark:text-white">
                      <slot name="title" />
                    </DialogTitle>
                  </div>
                  <div class="relative mt-6 flex flex-1 justify-center  px-4 sm:px-6">
                    <slot name="content" />
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot,
} from '@headlessui/vue';
import { ref } from 'vue';

const isOpen = ref(false);

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};
defineExpose({ open, close });
</script>
