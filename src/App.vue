<template>
  <suspense>
    <app-view />
  </suspense>
  <app-notifications />
</template>
<script setup>
import AppView from '@/views/AppView.vue';
import AppNotifications from '@/components/AppNotifications.vue';
</script>
