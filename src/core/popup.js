import { createApp } from 'vue';
import PopupApp from '@/PopupApp.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(PopupApp);
app.use(Antd);
app.mount('#app');
