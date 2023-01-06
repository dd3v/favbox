<template>
  <a-card style="width: 350px; height:100%;">
    <template #title> LinkFlow </template>
    <template #extra><a href="#">more</a></template>
    <a-form :model="bookmark" name="basic">
      <a-form-item
        name="title"
        :rules="[{ required: true, message: 'Please input bookmark title' }]"
        @finish="createBookmark"
      >
        <a-input v-model:value="bookmark.title">
          <template #prefix>
            <img :src="bookmark.favicon" width="16" :alt="bookmark.title" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-select
          v-model:value="folder"
          show-search
          placeholder="Folder"
          :options="folders"
          :filter-option="filter"
          :fieldNames="{ label: 'title', value: 'id' }"
        ></a-select>
      </a-form-item>
      <a-form-item>
        <template v-for="tag in tags" :key="tag">
          <a-tooltip v-if="tag.length > 20" :title="tag">
            <a-tag :closable="true" @close="handleClose(tag)">
              {{ `${tag.slice(0, 20)}...` }}
            </a-tag>
          </a-tooltip>
          <a-tag v-else :closable="true" @close="handleClose(tag)">
            {{ tag }}
          </a-tag>
        </template>
        <a-input
          v-if="inputVisible"
          ref="inputRef"
          v-model:value="inputValue"
          type="text"
          size="small"
          :style="{ width: '78px' }"
          @blur="handleInputConfirm"
          @keyup.enter="handleInputConfirm"
        />
        <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
          <plus-outlined />
          New Tag
        </a-tag>
      </a-form-item>
      <a-button class="w-full" @click="createBookmark">Add to bookmarks</a-button>
    </a-form>
  </a-card>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const bookmark = ref({});

const sendMessage = (tabId, request) => new Promise((resolve, reject) => {
  chrome.tabs.sendMessage(tabId, request, (response) => {
    if (chrome.runtime.lastError) {
      reject(chrome.runtime.lastError);
    } else {
      resolve(response);
    }
  });
});
const filter = (input, option) => option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
const getFolderTitles = (folders) => folders.filter((folder) => folder.title !== '');
const getFolders = (bookmarks) => {
  let folders = [];
  for (let i = 0; i < bookmarks.length; i += 1) {
    if (bookmarks[i].children) {
      folders.push(bookmarks[i]);
      folders = folders.concat(getFolders(bookmarks[i].children));
    }
  }
  return folders;
};

const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
if (tab.url.includes('chrome://')) {
  const preview = {
    title: tab.title,
    url: tab.url,
    favicon: tab.favIconUrl,
    image: null,
    domain: null,
    description: null,
  };
  bookmark.value = preview;
} else {
  // https://developer.chrome.com/docs/extensions/reference/runtime/#method-sendMessage
  const { preview } = await sendMessage(tab.id, { action: 'getCurrentTabPreview', tab });
  bookmark.value = preview;
}

const tree = await chrome.bookmarks.getTree();
const folders = getFolderTitles(getFolders(tree));
console.warn(folders);

const folder = ref('');
// const tagsList = ref([]);
const inputRef = ref();

const tags = ref(['Unremovable', 'Tag 2', 'Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3']);
const inputVisible = ref(false);
const inputValue = ref('');
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    inputRef.value.focus();
  });
};
const handleInputConfirm = () => {
  if (inputValue.value && tags.value.indexOf(inputValue.value) === -1) {
    tags.value.push(inputValue.value);
  }
  inputVisible.value = false;
};
const handleClose = (removedTag) => {
  tags.value = tags.value.filter((tag) => tag !== removedTag);
};

const createBookmark = () => {
  chrome.runtime.sendMessage(
    {
      action: 'createBookmark',
      bookmark: bookmark.value,
    },
    (response) => {
      console.warn(response);
    },
  );
};
</script>
<style>
</style>
