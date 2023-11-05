import { createApp } from 'vue';
import App from './App.vue';

let port;
function connect() {
  console.warn('Keep alive connection..');
  port = chrome.runtime.connect({ name: 'favbox' });
  port.onDisconnect.addListener(connect);
  port.onMessage.addListener((msg) => {
    console.log('received', msg, 'from bg');
  });
  port.postMessage({ action: 'ping' });
}
try {
  connect();
} catch (e) {
  console.error('Content script error', e);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getHTML') {
    sendResponse({ html: document.documentElement.outerHTML });
  }
});

const id = `favbox-app-container-${Math.floor(Math.random() * 100)}`;
const div = document.createElement('div');
div.setAttribute('id', id);
document.body.appendChild(div);
createApp(App).mount(`#${id}`);
