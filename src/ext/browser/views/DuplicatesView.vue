<template>
  <div class="h-screen w-full flex flex-col">
    <AppInfiniteScroll
      class="flex flex-col flex-1 overflow-y-auto bg-white dark:bg-black"
      :limit="PAGINATION_LIMIT"
      @scroll:end="loadMore"
    >
      <div
        class="sticky top-0 z-10 flex w-full flex-col  bg-white/70 p-4 backdrop-blur-sm dark:bg-black/50"
      >
        <div class="flex w-full items-center justify-between">
          <span class="text-xl font-extralight text-black dark:text-white">
            Total duplicate groups: <NumberFlow :value="total" />
          </span>
        </div>
      </div>
      <div
        v-if="loading || groups.length === 0"
        class="flex flex-1 flex-col items-center justify-center p-5"
      >
        <AppSpinner v-if="loading" />
        <div
          v-else
          class="text-2xl text-black dark:text-white"
        >
          🚀 No duplicate bookmarks found.
        </div>
      </div>
      <TransitionGroup
        v-show="groups.length > 0"
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-5"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-5"
        move-class="transition-transform duration-300 ease-in-out"
        tag="div"
        class="flex flex-col gap-y-4 p-4"
      >
        <div
          v-for="(group, index) in groups"
          :key="group.url"
          :style="{ transitionDelay: `${Math.min(index * 50, 1000)}ms` }"
          class="rounded-md border border-solid bg-white shadow-xs dark:border-neutral-900 dark:bg-neutral-950 mb-3"
        >
          <div class="flex items-center justify-between w-full p-3 pb-0">
            <div class="flex items-center gap-x-2">
              <AppBadge color="gray">
                {{ group.count }}
              </AppBadge>
              <span class="text-xs text-gray-900 dark:text-white truncate w-full">
                <a
                  :href="group.url"
                  class="block max-w-xs md:max-w-md lg:max-w-2xl truncate hover:underline focus:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="group.url"
                >
                  {{ group.url }}
                </a>
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-y-3 p-3 pt-2">
            <DuplicateCard
              v-for="bookmark in group.bookmarks"
              :key="bookmark.id"
              :bookmark="bookmark"
              @onDelete="onDelete"
            />
          </div>
        </div>
      </TransitionGroup>
    </AppInfiniteScroll>
    <AppConfirmation ref="confirmation">
      <template #title>
        Delete bookmark
      </template>
      <template #description>
        Are you sure you want to delete this bookmark? This action cannot be undone. Removing the bookmark from FavBox will also delete it from your browser.
      </template>
      <template #cancel>
        Cancel
      </template>
      <template #confirm>
        Delete
      </template>
    </AppConfirmation>
  </div>
</template>

<script setup>
import { ref, onMounted, useTemplateRef } from 'vue';
import { notify } from 'notiwind';
import { PAGINATION_LIMIT, NOTIFICATION_DURATION } from '@/constants/app';
import BookmarkStorage from '@/storage/bookmark';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';
import AppBadge from '@/components/app/AppBadge.vue';
import DuplicateCard from '@/ext/browser/components/card/DuplicateCard.vue';
import AppConfirmation from '@/components/app/AppConfirmation.vue';
import NumberFlow from '@number-flow/vue';

const bookmarkStorage = new BookmarkStorage();

const loading = ref(true);
const groups = ref([]);
const total = ref(0);
const confirmationRef = useTemplateRef('confirmation');
const deletedGroupsCount = ref(0);

const load = async () => {
  try {
    loading.value = true;
    const result = await bookmarkStorage.getDuplicatesGrouped(0, PAGINATION_LIMIT);
    groups.value = result.groups;
    total.value = result.total;
  } catch (error) {
    console.error('Error loading duplicates:', error);
    notify({ group: 'error', text: 'Error loading duplicates' }, NOTIFICATION_DURATION);
  } finally {
    loading.value = false;
  }
};

const loadMore = async (offset) => {
  try {
    const result = await bookmarkStorage.getDuplicatesGrouped(offset, PAGINATION_LIMIT);
    groups.value.push(...result.groups);
  } catch (error) {
    console.error('Error loading more duplicates:', error);
  }
};

const findBookmarkInGroups = (bookmarkId) => {
  for (let i = 0; i < groups.value.length; i++) {
    const group = groups.value[i];
    const bookmarkIndex = group.bookmarks.findIndex((b) => b.id === bookmarkId);
    if (bookmarkIndex !== -1) {
      return { groupIndex: i, bookmarkIndex };
    }
  }
  return null;
};

const removeBookmarkFromGroup = (groupIndex, bookmarkIndex) => {
  const group = groups.value[groupIndex];
  group.bookmarks.splice(bookmarkIndex, 1);

  const isGroupEmpty = group.bookmarks.length <= 1;
  if (isGroupEmpty) {
    groups.value.splice(groupIndex, 1);
    total.value -= 1;
    deletedGroupsCount.value += 1;
  }
  return isGroupEmpty;
};

const loadOneMoreGroup = async () => {
  const offset = groups.value.length + deletedGroupsCount.value;
  if (offset >= total.value) return;

  const result = await bookmarkStorage.getDuplicatesGrouped(offset, 1);
  if (result.groups.length > 0) {
    groups.value.push(result.groups[0]);
  }
};

const onDelete = async (bookmark) => {
  if (await confirmationRef.value.request() === false) return;

  try {
    await browser.bookmarks.remove(String(bookmark.id));

    const location = findBookmarkInGroups(bookmark.id);
    if (!location) return;

    const groupRemoved = removeBookmarkFromGroup(location.groupIndex, location.bookmarkIndex);
    if (groupRemoved) {
      await loadOneMoreGroup();
    }

    notify({ group: 'default', text: 'Bookmark deleted.' }, NOTIFICATION_DURATION);
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    notify({ group: 'error', text: 'Error deleting bookmark' }, NOTIFICATION_DURATION);
  }
};

onMounted(load);
</script>
