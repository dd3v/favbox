import { createApp } from 'vue';
import App from '@/App.vue';
import '@/styles/app.css';
import masonry from 'vue-next-masonry';

const app = createApp(App);
app.use(masonry);
app.mount('#app');
