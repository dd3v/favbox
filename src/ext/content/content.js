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
div.setAttribute('style', ' font-size: 14px !important;');

const shadowRoot = div.attachShadow({ mode: 'open' });
// const sheet = new CSSStyleSheet();
// sheet.replaceSync(() => '@/assets/styles/app.css');
// shadowRoot.adoptedStyleSheets = [sheet];

shadowRoot.innerHTML = `
<style>

html {
  color: red !important;
}

.modal-backdrop {
  display: flex;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: red;
  transition: opacity 0.3s ease;
}

.modal {
  color: inherit;
  font-size: inherit;
  width: 400px;
  margin: 30px auto;
  padding: 5px 10px;
  box-shadow: red;
  background: red;
  border-radius: 5px;
  transition: all 0.3s ease;
  padding: 10px;
}

.modal-header {
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  padding: 0px 0px 30px 0px;
  color: red
}

.close-btn {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(0px);
  transition: 0.5s all ease;
}

.slide-enter-to {
  opacity: 1;
  transform: translateY(0px);
  transition: 0.5s all ease;
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(0px);
  transition: 0.5s all ease;
}
</style>
`;

const appContainer = document.createElement('div');
shadowRoot.appendChild(appContainer);

const app = createApp(App);
app.mount(appContainer);

document.body.appendChild(div);
