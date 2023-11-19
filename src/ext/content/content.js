import { createApp } from 'vue';
import App from './App.vue';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getHTML') {
    sendResponse({ html: document.documentElement.outerHTML });
  }
});

const div = document.createElement('div');
div.setAttribute('id', `favbox-app-container-${Math.floor(Math.random() * 100)}`);

const shadowRoot = div.attachShadow({ mode: 'open' });
import('@/assets/styles/cmdk.css')
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
