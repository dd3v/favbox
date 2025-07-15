<template>
  <AppInfiniteScroll
    class="flex h-screen w-full flex-col overflow-y-auto bg-white dark:bg-black"
    :limit="BOOKMARKS_LIMIT"
    @scroll:end="skip => loadBrokenBookmarks({ skip, limit: BOOKMARKS_LIMIT, append: true })"
  >
    <div
      class="sticky top-0 z-10 flex w-full flex-col border-solid bg-white/70 p-4 backdrop-blur-sm dark:bg-black/50"
    >
      <div class="flex w-full items-center justify-between">
        <span
          class="text-xl font-extralight text-black dark:text-white"
        >
          Total: <NumberFlow :value="total" />
        </span>
        <div class="flex gap-x-3">
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
        ✅ Looks like there are no broken bookmarks in your browser.
      </div>
    </div>
    <div
      v-show="bookmarks.length > 0"
      v-auto-animate
      class="flex flex-col gap-y-3 p-4"
    >
      <HealthCheckCard
        v-for="bookmark in bookmarks"
        :key="bookmark.id"
        :bookmark="bookmark"
        @on-delete="onDelete"
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
  </AppInfiniteScroll>
</template>

<script setup>
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue';
import NumberFlow from '@number-flow/vue';
import { notify } from 'notiwind';
import BookmarkStorage from '@/storage/bookmark';
import AppConfirmation from '@/components/app/AppConfirmation.vue';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import HealthCheckCard from '@/ext/browser/components/card/HealthCheckCard.vue';
import { HTTP_STATUS } from '@/helpers/httpStatus';
import AppButton from '@/components/app/AppButton.vue';
import AppProgress from '@/components/app/AppProgress.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';

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

const BOOKMARKS_LIMIT = import.meta.env.VITE_BOOKMARKS_PAGINATION_LIMIT;

function getWorker() {
  if (!worker) {
    const isDevelopment = import.meta.env.DEV;
    if (isDevelopment) {
      worker = new Worker(browser.runtime.getURL('workers/ping.js'), { type: 'module' });
    } else {
      worker = new Worker(new URL('@/workers/ping.js', import.meta.url), { type: 'module' });
    }
  }
  return worker;
}

const go = () => {
  const workerInstance = getWorker();
  workerInstance.postMessage('start');
};

const stop = () => {
  const workerInstance = getWorker();
  workerInstance.postMessage('stop');
  progress.value = 0;
  workerStatus.value = false;
};

const terminateWorker = () => {
  if (worker) {
    worker.terminate();
    worker = null;
  }
};

const loadBrokenBookmarks = async ({ skip = 0, limit = BOOKMARKS_LIMIT, append = false } = {}) => {
  try {
    loading.value = !append;
    const newBookmarks = await bookmarkStorage.getBookmarksByHttpStatusCode(httpStatuses, skip, limit);
    if (append) {
      bookmarks.value.push(...newBookmarks);
    } else {
      bookmarks.value = newBookmarks;
    }
  } catch (e) {
    console.error(e);
  } finally {
    if (!append) loading.value = false;
  }
};

const onDelete = async (bookmark) => {
  if (await confirmationRef.value.request() === false) {
    return;
  }
  try {
    await browser.bookmarks.remove(String(bookmark.id));
    bookmarks.value = bookmarks.value.filter((b) => b.id !== bookmark.id);
    total.value = await bookmarkStorage.getTotalByHttpStatus(httpStatuses);
    notify({ group: 'default', text: 'Bookmark successfully removed!' }, import.meta.env.VITE_NOTIFICATION_DURATION);
  } catch (e) {
    console.error(e);
    notify({ group: 'error', text: 'Failed to remove bookmark. Please try again.' }, import.meta.env.VITE_NOTIFICATION_DURATION);
  }

  try {
    if (bookmarks.value.length < BOOKMARKS_LIMIT) {
      const more = await bookmarkStorage.getBookmarksByHttpStatusCode(httpStatuses, bookmarks.value.length, 1);
      console.warn(more);
      if (more.length) bookmarks.value.push(...more);
    }
  } catch (e) {
    console.error(e);
  }
};

onMounted(async () => {
  loading.value = true;
  await loadBrokenBookmarks();
  total.value = await bookmarkStorage.getTotalByHttpStatus(httpStatuses);
  const workerInstance = getWorker();
  workerInstance.onmessage = async (event) => {
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
  workerInstance.onerror = (event) => {
    console.error('🌀 Error from worker', event);
  };
  workerInstance.postMessage('progress');
  workerInstance.postMessage('status');
  loading.value = false;
});

onUnmounted(() => {
  terminateWorker();
});
</script>
