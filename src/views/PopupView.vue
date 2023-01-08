<template>
  <a-card style="width: 350px; height: 100%">
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
            <img :src="bookmark.favicon" width="16" :alt="bookmark.title" v-if="httpProtocol" />
            <home-outlined v-else />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-select
          v-model:value="bookmark.parentId"
          @change="updateFolder"
          placeholder="Folder"
          :options="folders"
          :fieldNames="{ label: 'title', value: 'id' }"
        ></a-select>
      </a-form-item>
      <a-form-item>
        <template v-for="tag in bookmark.tags" :key="tag">
          <a-tooltip v-if="tag.length > 20" :title="tag">
            <a-tag :closable="true" @close="handleClose(tag)">{{ `${tag.slice(0, 20)}...` }}</a-tag>
          </a-tooltip>
          <a-tag v-else :closable="true" @close="handleClose(tag)">{{ tag }}</a-tag>
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
import { ref, nextTick, computed } from 'vue';
import { PlusOutlined, HomeOutlined } from '@ant-design/icons-vue';

const bookmark = ref({
  title: '',
  url: '',
  favicon: '',
  tags: [],
  parentId: null,
});

const getFolders = (bookmarks) => {
  let folders = [];
  for (let i = 0; i < bookmarks.length; i += 1) {
    if (bookmarks[i].children) {
      folders.push(bookmarks[i]);
      folders = folders.concat(getFolders(bookmarks[i].children));
    }
  }
  folders = folders.filter((folder) => folder.title !== '');
  return folders;
};

const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
bookmark.value = {
  title: tab.title,
  url: tab.url,
  favicon: tab.favIconUrl,
  tags: [],
};

const tree = await chrome.bookmarks.getTree();
const folders = getFolders(tree);
bookmark.value.parentId = folders[0]?.id;
bookmark.value.folder = folders[0]?.title;
console.warn(folders);

const updateFolder = (id) => {
  const folder = folders.find((item) => item.id === id);
  bookmark.value.folder = folder?.title;
};
console.warn(bookmark);
const httpProtocol = computed(() => (bookmark.value.favicon ? bookmark.value.favicon.includes('http') : false));
const inputRef = ref();

const inputVisible = ref(false);
const inputValue = ref('');
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    inputRef.value.focus();
  });
};
const handleInputConfirm = () => {
  if (inputValue.value && bookmark.value.tags.indexOf(inputValue.value) === -1) {
    bookmark.value.tags.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};
const handleClose = (removedTag) => {
  bookmark.value.tags = bookmark.value.tags.filter((tag) => tag !== removedTag);
};

const createBookmark = async () => {
  console.warn(bookmark.value);
  const response = await chrome.runtime.sendMessage({
    action: 'createBookmark',
    data: bookmark.value,
  });
  console.warn(response);
};
</script>
<style></style>
