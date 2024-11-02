<template>
  <div class="flex w-full overflow-y-hidden">
    <div class="flex h-screen w-full flex-col overflow-hidden p-2">
      <app-infinite-scroll
        ref="scroll"
        class="size-full overflow-y-auto py-2"
        :limit="50"
        @scroll:end="paginate"
      >
        <div
          v-if="empty"
          class="flex h-5/6 items-center justify-center text-6xl font-black text-gray-200"
        >
          Empty
        </div>
        <masonry
          :resolve-slot="true"
          :cols="{ default: 4, 1000: 2, 700: 1 }"
          :gutter="5"
        >
          <PinnedCard
            v-for="(bookmark, key) in bookmarks"
            :key="key"
            :bookmark="bookmark"
            @remove="handleRemoveBookmark"
            @edit="edit"
            @pin="pin"
          />
        </masonry>
      </app-infinite-scroll>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import AppInfiniteScroll from '@/components/app/AppInfiniteScroll.vue';
import PinnedCard from '@/ext/browser/components/card/PinnedCard.vue';

await initStorage();
const bookmarkStorage = new BookmarkStorage();
const scroll = ref(null);
const bookmarks = ref([]);

const paginate = async (skip) => {
  try {
    console.warn('load', skip);
    bookmarks.value.push(
      ...(await bookmarkStorage.getPinnedBookmarks(skip, 50)),
    );
  } catch (e) {
    console.error(e);
  }
};

onMounted(async () => {
  bookmarks.value = await bookmarkStorage.getPinnedBookmarks();
});

</script>
