<template>
  <app-infinite-scroll
    ref="scroll"
    class="size-full space-y-3 overflow-y-auto p-3"
    :limit="50"
    @scroll:end="paginate"
  >
    <div
      v-if="bookmarks.length === 0"
      class="m-5 flex h-5/6 flex-col items-center justify-center space-y-3 p-5"
    >
      <div
        class="text-2xl font-thin text-black"
      >
        Looks like there are no broken bookmarks in your browser.
      </div>
      <div
        v-if="healthcheck?.date"
        class="text-gray-300"
      >
        <ul
          role="list"
          class="mt-8 space-y-4 font-thin text-gray-900"
        >
          <li class="flex items-center gap-x-1">
            <UitCalender class="size-4" />
            <span>Last checked on: {{ healthcheck?.date ?? 'TBD' }}</span>
          </li>
          <li class="flex items-center gap-x-1">
            <UitBookmark class="size-4" />
            <span>Total bookmarks checked: {{ healthcheck?.total ?? 'TBD' }}</span>
          </li>
          <li class="flex items-center gap-x-1">
            <UitClock class="size-4" />
            <span>Time taken: {{ healthcheck?.executionTime ?? 'TBD' }}</span>
          </li>
        </ul>
      </div>
    </div>
    <HealthCheckCard
      v-for="(bookmark, key) in bookmarks"
      :key="key"
      v-motion-slide-visible-once-bottom
      :bookmark="bookmark"
      @onDelete="onDelete"
    />
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
import { ref, onMounted } from 'vue';
import BookmarkStorage from '@/storage/bookmark';
import AppConfirmation from '@/components/app/AppConfirmation.vue';
import initStorage from '@/storage/idb/idb';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import HealthCheckCard from '@/ext/browser/components/card/HealthCheckCard.vue';
import { HTTP_STATUS } from '@/helpers/httpStatus';

import UitBookmark from '~icons/uit/bookmark';
import UitClock from '~icons/uit/clock';
import UitCalender from '~icons/uit/calender';

await initStorage();
const bookmarkStorage = new BookmarkStorage();
const bookmarks = ref([]);
const confirmation = ref(true);
const scroll = ref(null);
let healthcheck = {};

try {
  const result = await browser.storage.local.get('healthcheck');
  healthcheck = result.healthcheck || null;
} catch (e) {
  console.error(e);
}

const paginate = async (skip) => {
  try {
    console.warn('loading broken bookmarks', skip);
    bookmarks.value.push(
      ...(await bookmarkStorage.getBookmarksByHttpStatusCode([
        HTTP_STATUS.NOT_FOUND,
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.GATEWAY_TIMEOUT,
        HTTP_STATUS.BAD_GATEWAY,
        HTTP_STATUS.WEB_SERVER_IS_DOWN,
        HTTP_STATUS.GONE,
      ], skip)),
    );
  } catch (e) {
    console.error(e);
  }
};

const onDelete = async (bookmark) => {
  if (await confirmation.value.request() === false) {
    return;
  }
  try {
    await browser.bookmarks.remove(String(bookmark.id));
  } catch (e) {
    console.error(e);
    await bookmarkStorage.remove(bookmark.id);
  } finally {
    bookmarks.value = bookmarks.value.filter(
      (item) => item.id !== bookmark.id,
    );
  }
};

onMounted(async () => {
  await paginate(0);
});
</script>
