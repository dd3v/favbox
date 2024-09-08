import { createWebHashHistory, createRouter } from 'vue-router';

const routes = [
  {
    path: '/bookmarks',
    alias: '/ext/browser/index.html',
    name: 'BookmarksView',
    component: () => import('./views/BookmarksView.vue'),
  },
  {
    path: '/favorites',
    name: 'FavoritesView',
    component: () => import('./views/FavoritesView.vue'),
  },
  {
    path: '/trash',
    name: 'TrashView',
    component: () => import('./views/TrashView.vue'),
  },
  {
    path: '/',
    redirect: '/bookmarks',
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/bookmarks',
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
