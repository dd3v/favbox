<template>
  <div>
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
                class="w-full max-w-md overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-black"
              >
                <DialogTitle
                  as="h3"
                  class="flex items-center text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  <PixelarticonsHeart class="mr-2" />
                  Scanning your bookmarks..
                </DialogTitle>
                <div class="mt-2">
                  <p class="py-1 text-sm text-black dark:text-white">
                    The app is scanning your bookmarks and gathering information about the pages to make everything run smoother and faster.
                    This process may take a little time depending on how many bookmarks you have, your network and device performance.
                  </p>
                  <p class="py-4 text-sm text-black dark:text-white">
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
    <div
      v-if="!isOpen && !status && progress < 100"
      class="fixed bottom-4 right-4 z-50"
    >
      <button
        class="relative size-16 cursor-pointer rounded-full bg-black from-pink-500 via-blue-500 to-green-500 font-mono text-xs text-white shadow-[0_0_0_4px_rgba(180,160,255,0.253)] transition-all duration-300 after:absolute after:inset-0 after:-z-10 after:rounded-full after:bg-gradient-to-r after:opacity-60 after:blur-md hover:shadow-[0_0_20px_rgba(180,160,255,0.5)] hover:after:opacity-100"
        type="button"
        aria-label="Sync progress"
        title="Sync progress"
        tabindex="0"
        @click="open"
      >
        <span class="text-sm text-white">
          <NumberFlow :value="progress" />%
        </span>
      </button>
    </div>
  </div>
</template>
<script setup>
import AppButton from '@/components/app/AppButton.vue';
import AppProgress from '@/components/app/AppProgress.vue';
import NumberFlow from '@number-flow/vue';
import { onMounted, ref, defineEmits } from 'vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import PixelarticonsHeart from '~icons/pixelarticons/heart';

const status = ref(false);
const progress = ref(0);
const isOpen = ref(false);
const close = () => { isOpen.value = false; };
const open = () => { isOpen.value = true; };
const emit = defineEmits(['onRefresh']);

onMounted(async () => {
  status.value = (await browser.storage.session.get('status')).status ?? false;
  progress.value = (await browser.storage.session.get('progress')).progress ?? 0;
  isOpen.value = status.value === false && progress.value < 100;
});

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'refresh') {
    progress.value = message.data.progress;
    status.value = message.data.progress >= 100;

    if (message.data.progress >= 100) {
      isOpen.value = false;
    }

    emit('onRefresh', message.data);
    console.warn('BookmarksSync', message.data);
  }
});
</script>
