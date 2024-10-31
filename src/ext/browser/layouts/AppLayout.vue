<template>
  <div class="flex h-screen w-full">
    <a-side :items="menu" />
    <main class="size-full overflow-hidden">
      <suspense>
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            v-motion-fade
          />
        </router-view>
      </suspense>
    </main>
    <app-notifications />
  </div>
</template>

<script setup>
import { onErrorCaptured } from 'vue';
import { notify } from 'notiwind';
import AppNotifications from '@/components/app/AppNotifications.vue';
import BookmarkIcon from '@/components/icons/BookmarkIcon.vue';
import PinnedIcon from '@/components/icons/PinnedIcon.vue';
import ASide from '@/ext/browser/components/ASide.vue';
import SyncErrorIcon from '@/components/icons/SyncErrorIcon.vue';

const menu = [
  { name: 'BookmarksView', label: 'Bookmarks', icon: BookmarkIcon },
  { name: 'FavoritesView', label: 'Favorites', icon: PinnedIcon },
  { name: 'HealthCheckView', label: 'HealthCheckView', icon: SyncErrorIcon },
];

onErrorCaptured((e) => {
  notify({ group: 'error', title: 'Error', text: e.message }, 8500);
});

</script>

<style>
html, body {
  overflow: hidden;
}
</style>
