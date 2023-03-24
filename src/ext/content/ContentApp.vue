<template>
  <div>
    <app-modal ref="bookmarks">
      <template #body>
        <iframe
          src="chrome-extension://hgdbfojbkemlcdjeepfhbmkobikhmall/ext/browser/index.html"
        />
      </template>
    </app-modal>
  </div>
</template>
<script setup>
import AppModal from '@/components/AppModal.vue';
import { onMounted, reactive, ref } from 'vue';

const bookmark = reactive({});
const bookmarks = ref(null);
const add = ref(null);
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.code === 'KeyF') {
    bookmarks.value.open();
  }
});

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value

console.warn('Content script..');

try {
  console.log('send message');
  bookmark.value = await chrome.runtime.sendMessage({
    action: 'getBookmark',
    data: { url: document.location.href },
  });
  console.warn(document.location.href);
  console.warn(bookmark);
} catch (e) {
  console.warn(e);
}

onMounted(() => {
  bookmarks.value.open();
});
</script>
<style>
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
