<template>
  <div id="popup">
    <header></header>
    <main></main>
    <footer></footer>
  </div>
</template>

<script setup>
import getLinkPreview from '@/libs/linkPreview';

const openTab = async () => {
  console.log(await getLinkPreview('google.com'));
  chrome.runtime.sendMessage('get-user-data', (response) => {
    console.log('received user data', response);
  });
  // chrome.identity.getAuthToken({ interactive: true }, (token) => {
  //   console.warn(token);
  // });
  // chrome.tabs.create({
  //   url: 'bookmarks.html',
  // });
};
</script>
<style>
html,
body {
  padding: 0;
  margin: 0;
}
#popup {
  width: 500px;
  height: 300px;
}
</style>
