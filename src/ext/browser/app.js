import { createApp } from 'vue';
import masonry from 'vue-next-masonry';
import Notifications from 'notiwind';
import FloatingVue from 'floating-vue';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import router from './router';
import AppLayout from './layouts/AppLayout.vue';
import 'floating-vue/dist/style.css';
import '@zanmato/vue3-treeselect/dist/vue3-treeselect.min.css';
import '@fontsource/sn-pro';
import '@vuepic/vue-datepicker/dist/main.css';
import '@/assets/app.css';

const app = createApp(AppLayout)
  .use(router)
  .use(masonry)
  .use(Notifications)
  .use(FloatingVue)
  .use(autoAnimatePlugin);

app.mount('#app');
