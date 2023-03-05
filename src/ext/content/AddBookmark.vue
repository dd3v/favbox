<template>
  <app-modal ref="modal">
    <template #body>
      <!-- <bookmark-form
        v-model="model"
        :folders="folders"
        @save="handleSave"
      /> -->
    </template>
  </app-modal>
</template>
<script setup>
// import BookmarkForm from '@/components/bookmark/BookmarkForm.vue';
import AppModal from '@/components/AppModal.vue';
import { onMounted, ref } from 'vue';

// const [tab] = chrome.tabs.query({ active: true, currentWindow: true }).then((r) => console.warn(r));

// console.warn('TAAAB', tab);

const modal = ref(null);
console.warn('123');
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.code === 'KeyF') {
    modal.value.open();
  }
});
onMounted(() => {
  // modal.value.open();
});
</script>
