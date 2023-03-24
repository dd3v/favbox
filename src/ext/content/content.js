import { createApp } from 'vue';
import App from './App.vue';

const root = document.createElement('div');

createApp(App).mount(root);

// const mountPoint = document.createElement('div');
// const container = document.createElement('shadow-app');
// document.body.appendChild(container);
// container.attachShadow({ mode: 'open' }).appendChild(mountPoint);

// createApp(App).mount(mountPoint);
