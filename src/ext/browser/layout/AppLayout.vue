<template>
  <div class="flex h-screen w-full">
    <aside
      class="sticky top-0 flex h-full min-h-screen w-12 flex-col items-center justify-center border-neutral-800 bg-[#EEEEEF] align-middle shadow-inner dark:border-r dark:bg-neutral-900"
      role="tablist"
      aria-label="tabs"
    >
      <RouterLink :to="{ name: 'BookmarksView' }">
        Home
      </RouterLink>
      <RouterLink :to="{ name: 'FavoritesView' }">
        FavoritesView
      </RouterLink>
      <RouterLink :to="{ name: 'TrashView' }">
        TrashView
      </RouterLink>
    </aside>
    <main class="flex size-full overflow-hidden bg-gray-50 dark:bg-neutral-900">
      <Suspense>
        <RouterView />
      </Suspense>
    </main>
    <AppNotifications />
  </div>
</template>

<script setup>
import { onErrorCaptured } from 'vue';
import { notify } from 'notiwind';
import AppNotifications from '@/components/app/AppNotifications.vue';

onErrorCaptured((e) => {
  notify({ group: 'error', title: 'Error', text: e.message }, 8500);
});
</script>
