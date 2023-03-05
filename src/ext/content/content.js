import Parser from '@/libs/parser';
import { createApp } from 'vue';
import AddBookmark from './AddBookmark.vue';

const root = document.createElement('div');

createApp(AddBookmark).mount(root);

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.warn('Content script..');
  let port;
  function connect() {
    port = chrome.runtime.connect({ name: 'favbox' });
    port.onDisconnect.addListener(connect);
    port.onMessage.addListener((msg) => {
      console.log('received', msg, 'from bg');
    });
  }

  try {
    connect();
    const parser = new Parser(document.location.href, document);
    const pageInfo = parser.getFullPageInfo();
    port.postMessage({ action: 'cache', data: pageInfo });
  } catch (e) {
    console.error('Content script error', e);
  }
})();
