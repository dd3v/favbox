<template>
  <div class="flex h-screen w-full scroll-smooth font-sans">
    <ASide :items="menu" />
    <main class="size-full overflow-hidden">
      <Suspense>
        <RouterView v-slot="{ Component, route }">
          <KeepAlive include="HealthCheckView">
            <component
              :is="Component"
              :key="route.name"
            />
          </KeepAlive>
        </RouterView>
      </Suspense>
    </main>
    <AppNotifications />
  </div>
</template>

<script setup>
import { onErrorCaptured } from 'vue';
import { notify } from 'notiwind';
import AppNotifications from '@/components/app/AppNotifications.vue';
import ASide from '@/ext/browser/components/ASide.vue';
import ClarityBookmarkLine from '~icons/clarity/bookmark-line';
import ClarityCopyLine from '~icons/clarity/copy-line';
import PhLinkBreak from '~icons/ph/link-break';
import ClarityClipboardOutlineBadged from '~icons/clarity/clipboard-outline-badged';

const menu = [
  { name: 'BookmarksView', label: 'Bookmarks', icon: ClarityBookmarkLine, tooltip: 'View all bookmarks' },
  { name: 'NotesView', label: 'Notes', icon: ClarityClipboardOutlineBadged, tooltip: 'Bookmarks with notes' },
  { name: 'HealthCheckView', label: 'Health Check', icon: PhLinkBreak, tooltip: 'Check broken links' },
  { name: 'DuplicatesView', label: 'Duplicates', icon: ClarityCopyLine, tooltip: 'Find duplicate bookmarks' },
];

onErrorCaptured((e) => {
  notify({ group: 'error', text: e.message }, 8500);
});
</script>

<style>
html, body {
  overflow: hidden;
}
</style>
