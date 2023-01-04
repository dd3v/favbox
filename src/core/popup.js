import { createApp } from 'vue';
import PopupApp from '@/PopupApp.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'windi.css';

const app = createApp(PopupApp);
app.use(ElementPlus);
app.mount('#app');
