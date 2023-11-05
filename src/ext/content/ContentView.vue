<template>
  <AppModal ref="modal">
    <template #body>
      <div class="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <input
          type="text"
          class="mr-3 w-full appearance-none border-none border-transparent bg-transparent px-2 py-3 text-lg font-normal leading-tight text-gray-700 focus:border-transparent focus:outline-none focus:ring-0"
          placeholder="Search for bookmarks and commands..."
          @input="handleSearch"
        >

        <div
          class="mt-2"
        >
          <p class="text-sm text-gray-500">
            <ul>
              <li
                v-for="item, key in items"
                :key="key"
              >
                {{ item.title }}
              </li>
            </ul>
            <button @click="test">
              test
            </button>
          </p>
        </div>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import AppModal from '../../components/app/AppModal.vue';
import hotKeys from '../../helpers/hk';

const modal = ref(null);
const items = ref([]);

const handleSearch = (e) => {
  console.warn(e);
};

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.keyCode === 75) {
    console.warn('open window');
    modal.value.open();
    console.warn(modal);
  }
});

onBeforeMount(async () => {
  console.warn(hotKeys);
  items.value = hotKeys;
  // items.value = await chrome.runtime.sendMessage({ type: 'getItems', data: {} });
});

</script>
<style lang="scss" scoped>
@import url("/assets/styles/app.css");

#d {
  font-size: 24px !important;
}

</style>
