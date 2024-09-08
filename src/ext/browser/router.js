import { createWebHashHistory, createRouter } from 'vue-router';

const routes = [
  {
    path: '/bookmarks',
    alias: '/ext/browser/index.html',
    name: 'BookmarksView',
    component: () => import('./views/BookmarksView.vue'),
    meta: {
      page: 1,
    },
  },
  {
    path: '/favorites',
    name: 'FavoritesView',
    component: () => import('./views/FavoritesView.vue'),
    meta: { page: 2 },
  },
  {
    path: '/trash',
    name: 'TrashView',
    component: () => import('./views/TrashView.vue'),
    meta: { page: 3 },
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
