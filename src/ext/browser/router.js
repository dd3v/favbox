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
    path: '/pinned',
    name: 'PinnedView',
    component: () => import('./views/PinnedView.vue'),
    meta: { page: 2 },
  },
  {
    path: '/health-check',
    name: 'HealthCheckView',
    component: () => import('./views/HealthCheckView.vue'),
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
