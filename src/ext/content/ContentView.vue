<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <div id="favbox-browser-extension-v2">
    <div
      v-show="show"
      class="modal-backdrop"
      @click.self="close"
      @keydown.esc="close"
    >
      <div class="modal-wrapper">
        <div class="search-container">
          <input
            ref="searchInput"
            v-model="term"
            name="term"
            type="text"
            placeholder="Search for bookmarks and commands"
            autofocus
            @input="handleSearch"
            @keydown.up="up"
            @keydown.down="down"
            @keydown.enter="openFocusedBookmark"
          >
        </div>
        <div
          ref="container"
          class="list-container"
        >
          <ul v-if="items.length">
            <li
              v-for="item, key in items"
              :key="key"
              :class="{ 'active': focusedBookmark && item.id === focusedBookmark.id }"
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
            <span class="kbd">↑</span><span class="kbd">↓</span>
            <hr>
            <span class="kbd">esc</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onBeforeMount, reactive, ref, nextTick,
} from 'vue';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';

const term = ref('');
const show = ref(false);
const searchInput = ref(null);
const focusedBookmark = reactive({});
const focusedBookmarkIndex = ref(0);
const items = reactive([]);
const container = ref(null);

const onEsc = (event) => {
  if (show.value === true && event.keyCode === 27) {
    show.value = false;
  }
};

const close = () => {
  show.value = false;
  document.removeEventListener('keyup', onEsc);
};

const open = () => {
  show.value = true;
  document.addEventListener('keyup', onEsc);
  nextTick(() => { searchInput.value.focus(); });
};

const handleSearch = async () => {
  console.warn('Term:', term.value);
  const response = await chrome.runtime.sendMessage({ type: 'search', data: { term: term.value } });
  console.warn('🔍️ search response:', response);
  items.splice(0, items.length, ...response.bookmarks);
  if (items.length) {
    Object.assign(focusedBookmark, items[0]);
    focusedBookmarkIndex.value = 0;
  }
  container.value.scrollTo({ top: 0, behavior: 'smooth' });
};

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.keyCode === 75) {
    console.warn('open window');
    open();
  }
});

onBeforeMount(async () => {
  const response = await chrome.runtime.sendMessage({ type: 'search', data: { term: '' } });
  Object.assign(items, response.bookmarks);
  if (items.length) {
    Object.assign(focusedBookmark, items[0]);
  }
});

const openBookmark = (item) => {
  window.open(item.url, '_blank');
  show.value = false;
};

const openFocusedBookmark = () => openBookmark(focusedBookmark);

const up = () => {
  container.value.scrollBy({ top: -50, behavior: 'smooth' });
  const index = focusedBookmarkIndex.value - 1;
  if (items[index]) {
    focusedBookmarkIndex.value -= 1;
    Object.assign(focusedBookmark, items[index]);
  }
};
const down = () => {
  console.warn(container);
  container.value.scrollBy({ top: 50, behavior: 'smooth' });
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

</script>
