<template>
  <suspense>
    <app-view/>
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
