<template>
  <div id="popup">
    <label for="title">
      <input type="text" name="text">
    </label>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
const openTab = () => {
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
