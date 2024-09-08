import { createApp } from 'vue';
import AppLayout from './layout/AppLayout.vue';
import '@/assets/styles/app.css';
import masonry from 'vue-next-masonry';
import Notifications from 'notiwind';
import router from './router';

const app = createApp(AppLayout).use(router).use(masonry).use(Notifications);
app.mount('#app');
