import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { crx } from '@crxjs/vite-plugin';
import Icons from 'unplugin-icons/vite';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest }),
    Icons({
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        app: '/ext/browser/index.html',
      },
    },
    minify: 'terser',
    sourcemap: false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
