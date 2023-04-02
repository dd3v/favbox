<template>
  <suspense>
    <popup-view />
  </suspense>
</template>
<script setup>
import PopupView from '@/ext/popup/PopupView.vue';
</script>
<style>
html,
body {
  width: 18rem;
  padding: 0;
  margin: 0;
  background: #f9fafb;
}
html.dark {
  background: #171717;
}
</style>
