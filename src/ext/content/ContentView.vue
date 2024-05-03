<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <transition name="slide">
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
              @keydown.enter="openBookmark"
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
                :class="{ 'active': selected && item.id === selected.id }"
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
  </transition>
</template>

<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import BookmarkFavicon from '@/components/bookmark/BookmarkFavicon.vue';

const term = ref('');
const show = ref(true);
const searchInput = ref(null);
const selected = reactive({});
const selectedIndex = ref(0);
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
  searchInput.value.focus();
  document.addEventListener('keyup', onEsc);
};

const handleSearch = async () => {
  console.warn('Term:', term.value);
  const response = await chrome.runtime.sendMessage({ type: 'search', data: { term: term.value } });
  console.warn('🔍️ search response:', response);
  items.splice(0, items.length, ...response.bookmarks);
  if (items.length) {
    Object.assign(selected, items[0]);
    selectedIndex.value = 0;
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
    Object.assign(selected, items[0]);
  }
});

const openBookmark = (item) => {
  window.open(item.url, '_blank');
};

const up = () => {
  container.value.scrollBy({ top: -50, behavior: 'smooth' });
  const index = selectedIndex.value - 1;
  if (items[index]) {
    selectedIndex.value -= 1;
    Object.assign(selected, items[index]);
  }
};
const down = () => {
  console.warn(container);
  container.value.scrollBy({ top: 50, behavior: 'smooth' });
  const index = selectedIndex.value + 1;
  if (items[index]) {
    selectedIndex.value += 1;
    Object.assign(selected, items[index]);
  }
};

const setActive = (key, item) => {
  selectedIndex.value = key;
  Object.assign(selected, item);
};

</script>
