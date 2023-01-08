import { createApp } from 'vue';
import App from '@/App.vue';
import Antd, { ConfigProvider } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.variable.min.css';

ConfigProvider.config({
  prefixCls: 'ant',
  theme: {
    primaryColor: '#000000',
  },
});
createApp(App).use(Antd).mount('#app');
