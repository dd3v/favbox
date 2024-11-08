import { createApp } from 'vue';
import App from './App.vue';

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getHTML') {
    sendResponse({ html: document.documentElement.outerHTML });
  }
});

// TODO: make some tests
// let port;
// function connect() {
//   console.warn('Keep alive connection..');
//   port = browser.runtime.connect({ name: 'favbox' });
//   port.onDisconnect.addListener(connect);
//   port.onMessage.addListener((msg) => {
//     console.log('received', msg, 'from bg');
//   });
//   port.postMessage({ action: 'ping' });
// }
// try {
//   connect();
// } catch (e) {
//   console.error('Content script error', e);
// }

const div = document.createElement('div');
div.setAttribute('id', `favbox-app-container-${Math.floor(Math.random() * 100)}`);
const shadowRoot = div.attachShadow({ mode: 'open' });
require('@/assets/styles/cmdk.css')
  .then((content) => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(content.default);
    shadowRoot.adoptedStyleSheets = [sheet];
  })
  .catch((error) => {
    console.error('error', error);
  });

const appContainer = document.createElement('div');
shadowRoot.appendChild(appContainer);
const app = createApp(App);
app.mount(appContainer);
document.body.appendChild(div);
