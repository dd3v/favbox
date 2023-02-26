<template>
  <suspense>
    <app-view />
  </suspense>
  <app-notifications />
</template>
<script setup>
import { onErrorCaptured } from 'vue';
import { notify } from 'notiwind';
import AppView from '@/AppView.vue';
import AppNotifications from '@/components/AppNotifications.vue';

onErrorCaptured((e) => {
  notify({ group: 'error', title: 'Error', text: e.message }, 8500);
});
</script>
