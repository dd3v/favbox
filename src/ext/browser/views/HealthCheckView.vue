<template>
  <AppInfiniteScroll
    class="flex h-screen w-full flex-col overflow-y-auto bg-white dark:bg-black"
    :limit="PAGINATION_LIMIT"
    @scroll:end="loadMore"
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
            v-if="scanning"
            variant="gray"
            @click="stop"
          >
            Stop
          </AppButton>
          <AppButton
            v-else
            @click="scan"
          >
            Scan bookmarks
          </AppButton>
        </div>
      </div>
      <AppProgress
        v-if="scanning"
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
    <TransitionGroup
      v-show="bookmarks.length > 0"
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      move-class="transition-transform duration-200 ease-out"
      tag="div"
      class="flex flex-col gap-y-3 p-4"
    >
      <HealthCheckCard
        v-for="bookmark in bookmarks"
        :key="bookmark.id"
        :bookmark="bookmark"
        @on-delete="onDelete"
      />
    </TransitionGroup>
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
import { ref, onMounted, useTemplateRef } from 'vue';
import NumberFlow from '@number-flow/vue';
import { notify } from 'notiwind';
import BookmarkStorage from '@/storage/bookmark';
import AppConfirmation from '@/components/app/AppConfirmation.vue';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import HealthCheckCard from '@/ext/browser/components/card/HealthCheckCard.vue';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { PAGINATION_LIMIT, NOTIFICATION_DURATION } from '@/constants/app';
import { fetchUrl, fetchHead } from '@/services/httpClient';
import AppButton from '@/components/app/AppButton.vue';
import AppProgress from '@/components/app/AppProgress.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';

const bookmarkStorage = new BookmarkStorage();
const bookmarks = ref([]);
const confirmationRef = useTemplateRef('confirmation');
const total = ref(0);
const loading = ref(true);
const scanning = ref(false);
const progress = ref(0);

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

const scan = async () => {
  scanning.value = true;
  progress.value = 0;

  const limit = 50;
  const totalBookmarks = await bookmarkStorage.total();
  if (totalBookmarks === 0) {
    scanning.value = false;
    return;
  }

  let processed = 0;
  let id = null;

  while (scanning.value) {
    const batch = await bookmarkStorage.findAfterId(id, limit);
    if (batch.length === 0) break;

    processed += batch.length;
    progress.value = Math.ceil((processed / totalBookmarks) * 100);

    const results = await Promise.all(
      batch.map(async (bookmark) => {
        let httpStatus = await fetchHead(bookmark.url, 15000);
        if (httpStatus === HTTP_STATUS.NOT_FOUND) {
          httpStatus = (await fetchUrl(bookmark.url, 15000)).httpStatus;
        }
        return httpStatus >= HTTP_STATUS.BAD_REQUEST
          ? { httpStatus, id: bookmark.id }
          : null;
      }),
    );

    const broken = results.filter(Boolean);
    if (broken.length) {
      await Promise.all(
        broken.map((r) => bookmarkStorage.updateHttpStatusById(r.id, r.httpStatus)),
      );
      total.value = await bookmarkStorage.getTotalByHttpStatus(httpStatuses);
      bookmarks.value = await bookmarkStorage.findByHttpStatus(httpStatuses, 0, PAGINATION_LIMIT);
    }

    id = batch[batch.length - 1].id;
  }

  if (scanning.value) {
    progress.value = 100;
  }
  scanning.value = false;
};

const stop = () => {
  scanning.value = false;
  progress.value = 0;
};

const load = async () => {
  try {
    loading.value = true;
    bookmarks.value = await bookmarkStorage.findByHttpStatus(httpStatuses, 0, PAGINATION_LIMIT);
    total.value = await bookmarkStorage.getTotalByHttpStatus(httpStatuses);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const loadMore = async (offset) => {
  try {
    const more = await bookmarkStorage.findByHttpStatus(httpStatuses, offset, PAGINATION_LIMIT);
    bookmarks.value.push(...more);
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
    bookmarks.value = bookmarks.value.filter((b) => b.id !== bookmark.id);
    total.value = await bookmarkStorage.getTotalByHttpStatus(httpStatuses);
    notify({ group: 'default', text: 'Bookmark successfully removed!' }, NOTIFICATION_DURATION);
  } catch (e) {
    console.error(e);
    notify({ group: 'error', text: 'Failed to remove bookmark. Please try again.' }, NOTIFICATION_DURATION);
  }

  try {
    if (bookmarks.value.length < PAGINATION_LIMIT) {
      const more = await bookmarkStorage.findByHttpStatus(httpStatuses, bookmarks.value.length, 1);
      if (more.length) bookmarks.value.push(...more);
    }
  } catch (e) {
    console.error(e);
  }
};

onMounted(load);
</script>
