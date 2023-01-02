<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Bookmarks manager</span>
        <el-button class="button" text>View all</el-button>
      </div>
    </template>
    <el-row :gutter="5"  align="middle">
      <el-col :span="24">
        <el-image :src="data.image" fit="cover"/>
      </el-col>
      <el-col :span="24">
        <el-form :model="data" label-width="150px" label-position="top">
          <el-form-item>
            <el-input v-model="data.title" placeholder="Type something">
              <template #prefix>
                <img :src="data.favicon" width="16" :alt="data.title" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="value"
              multiple
              filterable
              allow-create
              collapse-tags
              placeholder="Tags"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="category" placeholder="Category" filterable>
              <el-option
                v-for="item in categories"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-button class="w-100">Add to bookmarks</el-button>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';

const data = ref({});
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(
    tabs[0].id,
    {
      action: 'getCurrentTabPreview',
    },
    (response) => {
      console.log(response);
      const { preview } = response;
      console.log(preview);
      data.value = preview;
    },
  );
});

const value = ref([]);
const options = [
  {
    value: 'HTML',
    label: 'HTML',
  },
  {
    value: 'CSS',
    label: 'CSS',
  },
  {
    value: 'JavaScript',
    label: 'JavaScript',
  },
];

const category = ref('');

const categories = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
];

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
html,
body {
  padding: 0;
  margin: 0;
}
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

.box-card {
  width: 400px;
}
</style>
