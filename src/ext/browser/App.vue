<template>
  <div id="browser-bookmarks">
    <suspense>
      <app-view />
    </suspense>
    <app-notifications />
  </div>
</template>
<script setup>
import { onErrorCaptured } from 'vue';
import { notify } from 'notiwind';
import AppView from '@/ext/browser/AppView.vue';
import AppNotifications from '@/components/app/AppNotifications.vue';

onErrorCaptured((e) => {
  notify({ group: 'error', title: 'Error', text: e.message }, 8500);
});
</script>
