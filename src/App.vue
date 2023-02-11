<template>
  <suspense>
    <app-view />
  </suspense>
  <app-notifications />
</template>
<script setup>
import { onErrorCaptured } from 'vue';
import AppView from '@/views/AppView.vue';
import AppNotifications from '@/components/AppNotifications.vue';
import { notify } from 'notiwind';

onErrorCaptured((e) => {
  notify({ group: 'error', title: 'Error', text: e.message }, 8500);
});
</script>
