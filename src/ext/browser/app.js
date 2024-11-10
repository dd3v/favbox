import { createApp } from 'vue';
import '@/assets/app.css';
import masonry from 'vue-next-masonry';
import Notifications from 'notiwind';
import { MotionPlugin } from '@vueuse/motion';
import router from './router';
import AppLayout from './layouts/AppLayout.vue';
import tooltip from '../../directives/tooltip';

const app = createApp(AppLayout).use(router).use(masonry).use(Notifications)
  .use(MotionPlugin);
app.directive('tooltip', tooltip);

app.mount('#app');
