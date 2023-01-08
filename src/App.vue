<template>
  <suspense>
    <a-config-provider prefix-cls="ant">
      <app-view />
    </a-config-provider>
  </suspense>
</template>
<script setup>
import AppView from '@/views/AppView.vue';
</script>
<style>
#app {
  height: 100%;
}
</style>
