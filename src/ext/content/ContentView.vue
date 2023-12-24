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
              @keyup.up="up"
              @keyup.down="down"
            >
          </div>
          <div class="list-container">
            <ul v-if="items.length">
              <li
                v-for="item, key in items"
                :key="key"
                :class="{ 'active': item.id === selected?.id }"
              >
                {{ item }}
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
import { onBeforeMount, ref } from 'vue';

const term = ref('');
const show = ref(true);
const searchInput = ref(null);
const selected = ref(null);

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

const items = ref([]);

const handleSearch = async () => {
  console.warn('Term:', term.value);
  const response = await chrome.runtime.sendMessage({ type: 'search', data: { term: term.value } });
  console.warn('search response', response);
  items.value = response.bookmarks;
};

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.keyCode === 75) {
    console.warn('open window');
    open();
  }
});

onBeforeMount(async () => {
  // items.value = [];
  //  modal.value.open();
  // items.value = await chrome.runtime.sendMessage({ type: 'getItems', data: {} });
  items.value = await chrome.runtime.sendMessage({ type: 'search', data: { term: term.value, limit: 30 } });
});

const up = () => console.warn('up');
const down = () => {

};

</script>
