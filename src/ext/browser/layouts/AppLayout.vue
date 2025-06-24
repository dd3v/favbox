<template>
  <div class="flex h-screen w-full font-sans">
    <a-side :items="menu" />
    <main class="size-full overflow-hidden">
      <suspense>
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
          />
        </router-view>
      </suspense>
    </main>
    <app-notifications />
  </div>
</template>

<script setup>
import { onErrorCaptured, onMounted } from 'vue';
import { notify } from 'notiwind';
import AppNotifications from '@/components/app/AppNotifications.vue';
import ASide from '@/ext/browser/components/ASide.vue';
import initStorage from '@/storage/idb/idb';
import ClarityBookmarkLine from '~icons/clarity/bookmark-line';
import ClarityPinLine from '~icons/clarity/pin-line';
import ClarityHeartBrokenLine from '~icons/clarity/heart-broken-line';

const menu = [
  { name: 'BookmarksView', label: 'Bookmarks', icon: ClarityBookmarkLine, tooltip: 'View all bookmarks' },
  { name: 'PinnedView', label: 'Pinned', icon: ClarityPinLine, tooltip: 'View pinned bookmarks' },
  { name: 'HealthCheckView', label: 'Health Check', icon: ClarityHeartBrokenLine, tooltip: 'Bookmarks with errors' },
];

onErrorCaptured((e) => {
  notify({ group: 'error', text: e.message }, 8500);
});

onMounted(async () => {
  await initStorage();
});
</script>

<style>
html, body {
  overflow: hidden;
}
</style>
