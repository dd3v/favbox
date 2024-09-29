<template>
  <app-infinite-scroll
    ref="scroll"
    class="size-full space-y-3 overflow-y-auto p-3"
    :limit="50"
    @scroll:end="paginate"
  >
    <div
      v-if="empty"
      class="flex h-5/6 items-center justify-center text-6xl font-black text-gray-200"
    >
      Empty
    </div>
    <trash-view
      v-for="(bookmark, key) in bookmarks"
      :key="key"
      v-motion-slide-visible-once-bottom
      :bookmark="bookmark"
      @remove="handleRemoveBookmark"
    >
      <template #actions>
        delete
      </template>
    </trash-view>
  </app-infinite-scroll>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { notify } from 'notiwind';
import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import TrashView from '@/components/bookmark/views/TrashView.vue';

await initStorage();
const bookmarkStorage = new BookmarkStorage();
const bookmarks = ref([]);

const paginate = async (skip) => {
  try {
    console.warn('loading broken bookmarks', skip);
    bookmarks.value.push(
      ...(await bookmarkStorage.getBrokenBookmarks(skip, 50)),
    );
  } catch (e) {
    console.error(e);
  }
};

onMounted(async () => {
  bookmarks.value = await bookmarkStorage.getBrokenBookmarks();
});
</script>
