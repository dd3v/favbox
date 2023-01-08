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
          placeholder="Folder"
          :options="folders"
          :fieldNames="{ label: 'title', value: 'id' }"
        ></a-select>
      </a-form-item>
      <a-form-item>
        <template v-for="tag in tags" :key="tag">
          <a-tooltip v-if="tag.length > 20" :title="tag">
            <a-tag :closable="true" @close="handleClose(tag)">{{ `${tag.slice(0, 20)}...` }}</a-tag>
          </a-tooltip>
          <a-tag v-else :closable="true" @close="handleClose(tag)">{{ tag }}</a-tag>
        </template>
        <a-input
          v-if="tagInputVisible"
          ref="tagInputRef"
          v-model:value="tagInputValue"
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
import {
  ref, nextTick, computed, reactive,
} from 'vue';
import { PlusOutlined, HomeOutlined } from '@ant-design/icons-vue';
import { getBookmarkFolders } from '@/helpers/folders';
import tagHelper from '@/helpers/tags';

const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const folders = await getBookmarkFolders();
const bookmark = ref({
  title: tab.title, url: tab.url, favicon: tab.favIconUrl, parentId: folders[0]?.id,
});
let tags = reactive([]);
const tagInputRef = ref();
const tagInputVisible = ref(false);
const tagInputValue = ref('');

const showInput = () => {
  tagInputVisible.value = true;
  nextTick(() => tagInputRef.value.focus());
};
const handleInputConfirm = () => {
  if (tagInputValue.value && tags.indexOf(tagInputValue.value) === -1) {
    tags.push(tagInputValue.value);
  }
  tagInputVisible.value = false;
  tagInputValue.value = '';
};
const handleClose = (removedTag) => {
  tags = tags.filter((tag) => tag !== removedTag);
};

const httpProtocol = computed(() => (bookmark.value.favicon ? bookmark.value.favicon.includes('http') : false));

const createBookmark = async () => {
  console.warn(bookmark.value);
  bookmark.value.title = tagHelper.toString(bookmark.value.title, tags);
  const response = await chrome.runtime.sendMessage({ action: 'createBookmark', data: bookmark.value });
  console.warn(response);
};

</script>
<style></style>
