<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Bookmarks manager</span>
        <el-button class="button" text>View all</el-button>
      </div>
    </template>
    <el-row :gutter="5"  align="middle">
      <el-col :span="9">
        <el-image :src="data.image" fit="cover"/>
      </el-col>
      <el-col :span="15">
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

const data = ref({
  title: 'Options: Lifecycle | Vue.js',
  image: 'https://andrejgajdos.com/wp-content/uploads/2019/11/generating-link-preview.png',
  domain: 'vuejs.org',
  description: 'Vue.js - The Progressive JavaScript Framework',
  favicon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196',
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

.box-card {
  width: 400px;
}
</style>
