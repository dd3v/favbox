<template>
  <app-infinite-scroll
    class="flex h-screen w-full flex-col overflow-y-auto bg-white dark:bg-black"
    :limit="50"
    @scroll:end="paginate"
  >
    <div
      class="sticky top-0 z-10 flex w-full flex-col border-solid bg-white/70 p-4 shadow-sm backdrop-blur-lg dark:bg-black/50"
    >
      <div class="flex w-full items-center justify-between">
        <span class="text-xl font-extralight text-black dark:text-white">
          Total: <NumberFlow :value="total" />
        </span>
        <div class="flex space-x-3">
          <AppButton
            v-if="workerStatus"
            variant="gray"
            @click="stop"
          >
            Stop
          </AppButton>
          <AppButton
            v-else
            @click="go"
          >
            Scan bookmarks
          </AppButton>
        </div>
      </div>
      <AppProgress
        v-if="workerStatus"
        :progress="progress"
        class="mt-3 w-full"
      />
    </div>
    <div
      v-if="loading || bookmarks.length === 0"
      class="flex flex-1 flex-col items-center justify-center p-5"
    >
      <AppSpinner v-if="loading" />
      <div
        v-else
        class="text-2xl font-thin text-black dark:text-white"
      >
        Looks like there are no broken bookmarks in your browser.
      </div>
    </div>
    <div
      v-if="bookmarks.length > 0"
      class="flex flex-col space-y-3 p-4"
    >
      <HealthCheckCard
        v-for="(bookmark, key) in bookmarks"
        :key="key"
        :bookmark="bookmark"
        @onDelete="onDelete"
      />
    </div>
    <AppConfirmation ref="confirmation">
      <template #title>
        Delete bookmark
      </template>
      <template #description>
        Are you sure you want to delete this bookmark? This action cannot be undone. Removing the bookmark from FavBox
        will also delete it from your browser.
      </template>
      <template #cancel>
        Cancel
      </template>
      <template #confirm>
        Delete
      </template>
    </AppConfirmation>
  </app-infinite-scroll>
</template>

<script setup>
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue';
import BookmarkStorage from '@/storage/bookmark';
import AppConfirmation from '@/components/app/AppConfirmation.vue';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import HealthCheckCard from '@/ext/browser/components/card/HealthCheckCard.vue';
import { HTTP_STATUS } from '@/helpers/httpStatus';
import AppButton from '@/components/app/AppButton.vue';
import AppProgress from '@/components/app/AppProgress.vue';
import NumberFlow from '@number-flow/vue';
import AppSpinner from '@/components/app/AppSpinner.vue';
import { notify } from 'notiwind';
import { getWorker } from '../../../helpers/worker';

const bookmarkStorage = new BookmarkStorage();
const bookmarks = ref([]);
const confirmationRef = useTemplateRef('confirmation');
const total = ref(0);
const loading = ref(true);

let worker = null;
const progress = ref(0);
const workerStatus = ref(null);
const httpStatuses = [
  HTTP_STATUS.NOT_FOUND,
  HTTP_STATUS.SERVICE_UNAVAILABLE,
  HTTP_STATUS.INTERNAL_SERVER_ERROR,
  HTTP_STATUS.GATEWAY_TIMEOUT,
  HTTP_STATUS.BAD_GATEWAY,
  HTTP_STATUS.WEB_SERVER_IS_DOWN,
  HTTP_STATUS.GONE,
  HTTP_STATUS.REQUEST_TIMEOUT,
];

const go = () => {
  worker.postMessage('start');
};

const stop = () => {
  worker.postMessage('stop');
  progress.value = 0;
  workerStatus.value = false;
};

const paginate = async (skip) => {
  try {
    bookmarks.value.push(
      ...(await bookmarkStorage.getBookmarksByHttpStatusCode(httpStatuses, skip)),
    );
  } catch (e) {
    console.error(e);
  }
};

const onDelete = async (bookmark) => {
  if (await confirmationRef.value.request() === false) {
    return;
  }
  try {
    await browser.bookmarks.remove(String(bookmark.id));
    notify({ group: 'default', text: 'Bookmark successfully removed!' }, import.meta.env.VITE_NOTIFICATION_DURATION);
  } catch (e) {
    console.error(e);
    notify({ group: 'error', text: 'Failed to remove bookmark. Please try again.' }, import.meta.env.VITE_NOTIFICATION_DURATION);
  }
};

onMounted(async () => {
  // await await bookmarkStorage.setOK();
  loading.value = true;
  await paginate(0);
  worker = getWorker();
  worker.onmessage = async (event) => {
    switch (event.data.type) {
      case 'status':
        workerStatus.value = event.data.value;
        break;
      case 'progress':
        progress.value = parseInt(event.data.value, 10);
        total.value = await bookmarkStorage.getTotalByHttpStatus(httpStatuses);
        bookmarks.value = await bookmarkStorage.getBookmarksByHttpStatusCode(httpStatuses, 0);
        if (progress.value === 100) {
          stop();
        }
        break;
      default:
        console.error('🌀 Undefined message from worker:', event.data);
    }
    console.warn('🌀 Message from worker:', event.data);
  };
  worker.onerror = (event) => {
    console.error('🌀 Error from worker', event);
  };
  worker.postMessage('progress');
  worker.postMessage('status');
  loading.value = false;
});
onUnmounted(() => {});
</script>
