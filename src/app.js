import { createApp } from 'vue';
import App from '@/App.vue';
import '@/assets/styles/app.css';
import masonry from 'vue-next-masonry';
import Notifications from 'notiwind';

const app = createApp(App);
app.use(masonry);
app.use(Notifications);
app.mount('#app');
