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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref="searchInput"
              v-model="term"
              name="term"
              type="text"
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
              >
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
import { onBeforeMount, ref } from 'vue';
import hotKeys from '../../helpers/hk';

const term = ref('');
const show = ref(true);
const searchInput = ref(null);

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

const handleSearch = () => {
  console.warn('Term:', term.value);
};

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.keyCode === 75) {
    console.warn('open window');
    open();
  }
});

onBeforeMount(async () => {
  console.warn(hotKeys);
  items.value = hotKeys;
  // items.value = [];
  //  modal.value.open();
  // items.value = await chrome.runtime.sendMessage({ type: 'getItems', data: {} });
});

const up = () => console.warn('up');
const down = () => console.warn('down');

</script>
