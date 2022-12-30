<template>
  <div id="popup">
    <label for="title">
      <input type="text" name="text">
      <button @click="openTab">123</button>
    </label>
  </div>
</template>

<script setup>
import getLinkPreview from '@/libs/linkPreview';

const openTab = async () => {
  console.log(await getLinkPreview('https://andrejgajdos.com/how-to-create-a-link-preview/'));
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
  padding: 30px;
}
</style>
