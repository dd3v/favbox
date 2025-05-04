import { createApp } from 'vue';
import '@/assets/app.css';
import masonry from 'vue-next-masonry';
import Notifications from 'notiwind';
import { MotionPlugin } from '@vueuse/motion';
import FloatingVue from 'floating-vue';
import router from './router';
import AppLayout from './layouts/AppLayout.vue';
import 'floating-vue/dist/style.css';
import '@zanmato/vue3-treeselect/dist/vue3-treeselect.min.css';
import '@fontsource-variable/inter';

const app = createApp(AppLayout).use(router).use(masonry).use(Notifications)
  .use(MotionPlugin)
  .use(FloatingVue);

app.mount('#app');
