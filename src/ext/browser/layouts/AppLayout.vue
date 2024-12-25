<template>
  <div class="flex h-screen w-full">
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
    <button @click="exportFile">Export</button>
    <app-notifications />
  </div>
</template>

<script setup>
import { onErrorCaptured } from 'vue';
import { notify } from 'notiwind';
import AppNotifications from '@/components/app/AppNotifications.vue';
import ASide from '@/ext/browser/components/ASide.vue';
import ClarityBookmarkLine from '~icons/clarity/bookmark-line';
import ClarityPinLine from '~icons/clarity/pin-line';
import ClarityErrorStandardLine from '~icons/clarity/error-standard-line';

const menu = [
  { name: 'BookmarksView', label: 'Bookmarks', icon: ClarityBookmarkLine, tooltip: 'View all bookmarks' },
  { name: 'PinnedView', label: 'Pinned', icon: ClarityPinLine, tooltip: 'View pinned bookmarks' },
  { name: 'HealthCheckView', label: 'Health Check', icon: ClarityErrorStandardLine, tooltip: 'Bookmarks with potential issues' },
];

onErrorCaptured((e) => {
  notify({ group: 'error', title: 'Error', text: e.message }, 8500);
});

const exportFile = async () => {
  const root = await navigator.storage.getDirectory();
  const fileHandle = await root.getFileHandle('mydb.sqlite3');
  const file = await fileHandle.getFile();
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mydb.sqlite3';
  a.click();
  URL.revokeObjectURL(url);
};

</script>

<style>
html, body {
  overflow: hidden;
}
</style>
