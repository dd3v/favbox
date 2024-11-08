<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <div id="favbox-browser-extension-v2">
    <div
      v-show="showModal"
      class="modal-backdrop"
      @click.self="close"
      @keydown.esc="close"
    >
      <div class="modal-wrapper">
        <div class="search-container">
          <input
            ref="searchInputRef"
            v-model="term"
            name="term"
            type="text"
            placeholder="Search for bookmarks..."
            autofocus
            autocomplete="off"
            @input="handleSearch"
            @keydown.up="up"
            @keydown.down="down"
            @keydown.enter="openFocusedBookmark"
          >
        </div>
        <div
          ref="containerRef"
          class="list-container"
        >
          <ul v-if="items.length">
            <li
              v-for="(item, key) in items"
              :key="key"
              :class="{
                active:
                  focusedBookmark &&
                  item.id === focusedBookmark.id,
              }"
              @click="openBookmark(item)"
              @mouseenter="setActive(key, item)"
            >
              <bookmark-favicon
                :bookmark="item"
                class="favbox-bookmark-favicon"
              />
              {{ item.title }}
            </li>
          </ul>
          <div
            v-else
            class="empty"
          >
            empty.. 🤔
          </div>
        </div>
        <div class="footer-container">
          <div class="footer-kbd">
            <span class="kbd">↑</span>
            <span class="kbd">↓</span>
            <span class="kbd">esc</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  watch, reactive, ref, nextTick,
} from 'vue';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';

const term = ref('');
const showModal = ref(false);
const searchInputRef = ref(null);
const focusedBookmark = reactive({});
const focusedBookmarkIndex = ref(0);
const items = reactive([]);
const containerRef = ref(null);

const onEsc = (event) => {
  if (showModal.value === true && event.keyCode === 27) {
    showModal.value = false;
  }
};

const close = () => {
  showModal.value = false;
  document.removeEventListener('keyup', onEsc);
};

const open = () => {
  showModal.value = true;
  document.addEventListener('keyup', onEsc);
  nextTick(() => {
    searchInputRef.value.focus();
  });
};

const handleSearch = async () => {
  console.warn('Term:', term.value);
  const response = await browser.runtime.sendMessage({
    type: 'search',
    data: { term: term.value },
  });
  console.warn('🔍️ search response:', response);
  items.splice(0, items.length, ...response.bookmarks);
  if (items.length) {
    Object.assign(focusedBookmark, items[0]);
    focusedBookmarkIndex.value = 0;
  }
  containerRef.value.scrollTo({ top: 0, behavior: 'smooth' });
};

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.keyCode === 75) {
    console.warn('open window');
    open();
  }
});

const openBookmark = (item) => {
  window.open(item.url, '_blank');
  showModal.value = false;
};

const openFocusedBookmark = () => openBookmark(focusedBookmark);

const up = () => {
  containerRef.value.scrollBy({ top: -50, behavior: 'smooth' });
  const index = focusedBookmarkIndex.value - 1;
  if (items[index]) {
    focusedBookmarkIndex.value -= 1;
    Object.assign(focusedBookmark, items[index]);
  }
};
const down = () => {
  console.warn(containerRef);
  containerRef.value.scrollBy({ top: 50, behavior: 'smooth' });
  const index = focusedBookmarkIndex.value + 1;
  if (items[index]) {
    focusedBookmarkIndex.value += 1;
    Object.assign(focusedBookmark, items[index]);
  }
};

const setActive = (key, item) => {
  focusedBookmarkIndex.value = key;
  Object.assign(focusedBookmark, item);
};

watch(showModal, async () => {
  if (showModal.value === true) {
    const response = await browser.runtime.sendMessage({
      type: 'search',
      data: { term: term.value },
    });
    Object.assign(items, response.bookmarks);
    if (items.length) {
      Object.assign(focusedBookmark, items[0]);
    }
  }
});
</script>
