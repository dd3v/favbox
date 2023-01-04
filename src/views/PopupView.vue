<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Bookmarks manager</span>
        <el-button class="button" text>View all</el-button>
      </div>
    </template>
    <el-form :model="data" label-width="150px" label-position="top">
      <el-form-item>
        <el-input v-model="data.title" placeholder="Type something">
          <template #prefix>
            <img :src="data.favicon" width="16" :alt="data.title" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="folder" placeholder="Folder" filterable>
          <el-option v-for="item in folders" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item class="min-h-20">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          class="mr-1 ml-1 mt-1"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          class="mt-1 w-20"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
          size="small"
        />
        <el-button v-else class="button-new-tag mt-1" size="small" @click="showInput">
          + New Tag
        </el-button>
      </el-form-item>

      <el-button class="w-full">Add to bookmarks</el-button>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const data = ref({});
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (tab.url.includes('chrome://')) {
    const preview = {
      title: tab.title,
      url: tab.url,
      favicon: tab.favIconUrl,
      image: null,
      domain: null,
      description: null,
    };
    data.value = preview;
  } else {
    chrome.tabs.sendMessage(
      tab.id,
      {
        action: 'getCurrentTabPreview',
        tab: tabs[0],
      },
      (response) => {
        console.log(response);
        const { preview } = response;
        console.log(preview);
        data.value = preview;
      },
    );
  }
});

function getFolderTitles(folders) {
  return folders.filter((folder) => folder.title !== '');
}
function getFolders(bookmarks) {
  let folders = [];
  for (let i = 0; i < bookmarks.length; i += 1) {
    if (bookmarks[i].children) {
      folders.push(bookmarks[i]);
      folders = folders.concat(getFolders(bookmarks[i].children));
    }
  }
  return folders;
}
const tree = await chrome.bookmarks.getTree();
const folders = getFolderTitles(getFolders(tree));
console.warn(folders);

const inputValue = ref('');
const dynamicTags = ref(['Tag 1', 'Tag 2', 'Tag 3', 'sdfsdfsdfsdf', 'sdfsd sdf sdf sdf sdf']);
const inputVisible = ref(false);
const InputRef = ref('');
const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value?.input?.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};

const folder = ref('');

// const openTab = async () => {
// console.log(await getLinkPreview('https://developer.mozilla.org/ru/docs/Web/API/DOMParser'));
// chrome.identity.getAuthToken({ interactive: true }, (token) => {
//   console.warn(token);
// });
// chrome.tabs.create({
//   url: 'bookmarks.html',
// });
// };
</script>
<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
</style>
