<template>
  <a-layout has-sider>
    <a-layout-sider
      :style="{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#fff',
      }"
    >
      sidebar
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%', background: '#fff' }"
        >Search</a-layout-header
      >
      <a-layout-content :style="{ margin: '70px 16px 0', overflow: 'initial' }">
        <a-row :gutter="5">
          <a-col :span="6" v-for="(bookmark, key) in bookmarks" :key="key">
            <a-card hoverable style="width: 100%">
              <template #cover>
                <img alt="example" :src="bookmark.image" />
              </template>
              <template #actions>
                <setting-outlined key="setting" />
                <edit-outlined key="edit" />
                <ellipsis-outlined key="ellipsis" />
              </template>
              <a-card-meta :title="bookmark.title" :description="bookmark.description">
                <template #avatar>
                  <a-avatar :src="bookmark.favicon" />
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup>
import Bookmark from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import { toRaw, reactive, ref } from 'vue';
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue';

const bookmarks = ref([]);
await initStorage();
const bookmark = new Bookmark();

const defaultConditions = {
  tags: [],
  sort: 'desc',
  term: '',
};
const conditions = reactive({ ...defaultConditions });
console.warn(conditions);
bookmarks.value = await bookmark.search(toRaw(conditions));
</script>
<style>
.site-layout .site-layout-background {
  background: #fff;
}
</style>
