<template>
  <div>
    <div
      class="absolute right-0 top-0 z-20 h-screen w-0 overflow-hidden bg-white pl-0 transition-all dark:bg-neutral-900 dark:text-neutral-400"
      :style="{
        width: drawerVisible ? '50vw' : '0',
        paddingLeft: drawerVisible ? '10px' : '0',
      }"
    >
      <TabGroup
        :selected-index="selectedTab"
        @change="changeTab"
      >
        <div class="flex w-full">
          <div class="flex w-full justify-center py-1">
            <TabList class="flex w-72 space-x-1 rounded-xl bg-gray-300/20 p-1">
              <Tab
                v-slot="{ selected }"
                as="template"
              >
                <button
                  :class="[
                    'w-full rounded-lg py-1 text-sm font-medium leading-5 text-gray-500',
                    ' focus:outline-none ',
                    selected
                      ? 'bg-white shadow dark:bg-neutral-900 dark:text-white'
                      : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700 dark:text-white',
                  ]"
                >
                  Preview page
                </button>
              </Tab>
              <Tab
                v-slot="{ selected }"
                as="template"
              >
                <button
                  :class="[
                    'w-full rounded-lg py-1 text-sm font-medium leading-5 text-gray-500',
                    'focus:outline-none ',
                    selected
                      ? 'bg-white shadow dark:bg-neutral-900 dark:text-white'
                      : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700 dark:text-white',
                  ]"
                >
                  Edit bookmark
                </button>
              </Tab>
            </TabList>
          </div>
          <button
            class="mr-2"
            @click="close"
          >
            <x-circle-icon class="h-5 w-5" />
          </button>
        </div>
        <TabPanels class="flex h-screen w-full p-4">
          <TabPanel class="flex h-screen w-full overflow-y-auto">
            <slot name="preview" />
          </TabPanel>
          <TabPanel class="flex h-screen w-full justify-center">
            <slot name="edit" />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
    <div
      class="absolute left-0 top-0 z-10 h-screen w-0 bg-black/30 transition-opacity"
      :style="{
        width: drawerVisible ? '100vw' : '0',
        opacity: drawerVisible ? '0.6' : '0',
      }"
      @keydown="close"
      @click="close"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { XCircleIcon } from '@heroicons/vue/24/outline';
import {
  TabGroup, TabList, Tab, TabPanels, TabPanel,
} from '@headlessui/vue';

const selectedTab = ref(1);
const drawerVisible = ref(false);

const close = () => {
  drawerVisible.value = false;
};

const preview = () => {
  selectedTab.value = 0;
  drawerVisible.value = true;
};

const edit = () => {
  selectedTab.value = 1;
  drawerVisible.value = true;
};

function changeTab(index) {
  selectedTab.value = index;
}

defineExpose({ preview, edit });
</script>
