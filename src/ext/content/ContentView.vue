<template>
  <AppModal ref="modal">
    <template #body>
      <div>
        <span>Hello</span>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import hotKeys from '../../helpers/hk';
import AppModal from '../../components/app/AppModal.vue';

const modal = ref(null);
const items = ref([]);

const handleSearch = (e) => {
  console.warn(e);
};

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.keyCode === 75) {
    console.warn('open window');
    modal.value.open();
  }
});

onBeforeMount(async () => {
  console.warn(modal);
  console.warn(hotKeys);
  items.value = hotKeys;
  //  modal.value.open();
  // items.value = await chrome.runtime.sendMessage({ type: 'getItems', data: {} });
});

</script>
